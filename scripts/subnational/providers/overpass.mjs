// OpenStreetMap Overpass provider (ODbL, no key). Feature counts per division,
// found through the boundary relation's ISO3166-2 tag. OSM completeness varies
// by country (notably thinner for some military/strategic features), so these
// are mapped-feature counts, not official statistics - observations say so.
//
// Politeness: strictly sequential, a delay between queries, a per-run batch
// that refreshes the stalest divisions first, a wall-clock deadline, and an
// early stop after repeated failures. Re-running continues where it left off.

import { DIVISIONS, isExtraLayer } from '../_registry.mjs';

// Live check 2026-10-11: overpass-api.de round-robins to backends and was returning 504 even for
// `node(1);out;`; lz4.overpass-api.de answered (area + count worked, but it 504'd intermittently);
// overpass.openstreetmap.fr answers 200 but with an empty "open64 ... No such file" remark for area
// queries (the post() guard below skips that); kumi/private.coffee gave HTTP 500 or were unreachable.
export const OVERPASS_URLS = [
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

/** One `out count` per metric, in order, inside one request. */
export function buildCountQuery(code, filterGroups, timeoutS = 120) {
  const body = filterGroups
    .map((filters) => filters.map((f) => `nwr${f}(area.a);`).join('\n') + '\nout count;')
    .map((stmt, i) => (filterGroups[i].length > 1 ? `(${stmt.replace(/\nout count;$/, '')})->.s${i};\n.s${i} out count;` : stmt))
    .join('\n');
  return `[out:json][timeout:${timeoutS}];\narea["ISO3166-2"="${code}"]->.a;\n${body}`;
}

/** Totals from `out count` elements, in query order. */
export function parseCounts(json) {
  return (json?.elements ?? [])
    .filter((e) => e.type === 'count')
    .map((e) => Number(e.tags?.total ?? 0));
}

export function buildPlantsQuery(code, timeoutS = 150) {
  return `[out:json][timeout:${timeoutS}];\narea["ISO3166-2"="${code}"]->.a;\nnwr["power"="plant"]["plant:output:electricity"](area.a);\nout tags;`;
}

/** "120 MW", "1.5 GW", "500 kW", "2e6" (plain number = W per OSM convention) -> megawatts, or null. */
export function parseMegawatts(raw) {
  if (typeof raw !== 'string') return null;
  const m = raw.trim().replace(',', '.').match(/^([0-9]*\.?[0-9]+(?:e[+-]?\d+)?)\s*(gw|mw|kw|w)?$/i);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return null;
  const unit = (m[2] ?? 'w').toLowerCase();
  const mw = unit === 'gw' ? n * 1000 : unit === 'mw' ? n : unit === 'kw' ? n / 1000 : n / 1e6;
  return mw;
}

const SOURCE_GROUPS = ['solar', 'wind', 'hydro', 'nuclear', 'gas', 'coal', 'oil', 'biomass', 'geothermal'];

/** Sum plant capacity (MW) overall and by primary source group. */
export function summarizePlants(json) {
  const total = { mw: 0, count: 0 };
  const bySource = {};
  for (const el of json?.elements ?? []) {
    const tags = el.tags ?? {};
    const mw = parseMegawatts(tags['plant:output:electricity']);
    if (mw == null) continue;
    total.mw += mw;
    total.count += 1;
    const src = String(tags['plant:source'] ?? '').split(';')[0].trim().toLowerCase();
    const group = SOURCE_GROUPS.includes(src) ? src : 'other';
    bySource[group] = (bySource[group] ?? 0) + mw;
  }
  return { total, bySource };
}

// The mirror that answered last goes first, so a dead mirror is not retried on every query.
let preferredUrl = null;
export function resetOverpassState() { preferredUrl = null; }
const orderedUrls = () => (preferredUrl ? [preferredUrl, ...OVERPASS_URLS.filter((u) => u !== preferredUrl)] : OVERPASS_URLS);

async function post(fetchFn, query, timeoutMs, rounds = 2) {
  let lastErr = null;
  for (let round = 0; round < rounds; round++) {
    if (round > 0) await new Promise((r) => setTimeout(r, 4000));
    for (const url of orderedUrls()) {
    try {
      const resp = await fetchFn(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'worldmonitor-faii-subnational/1.0' },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!resp.ok) { lastErr = new Error(`Overpass HTTP ${resp.status}`); continue; }
      const json = await resp.json();
      if (json?.remark && /error|timed out|out of memory/i.test(json.remark) && !(json.elements?.length)) {
        lastErr = new Error(`Overpass remark: ${json.remark.slice(0, 120)}`);
        continue;
      }
      preferredUrl = url;
      return json;
    } catch (err) { lastErr = err; }
    }
  }
  throw lastErr ?? new Error('Overpass unavailable');
}

/** Oldest-fetched first; never-fetched first of all. */
export function pickBatch(previousDivisions, markerMetric, size) {
  return DIVISIONS.filter((d) => !isExtraLayer(d))
    .map((d) => ({ d, at: previousDivisions?.[d.id]?.metrics?.[markerMetric]?.fetchedAt ?? 0 }))
    .sort((a, b) => a.at - b.at)
    .slice(0, size)
    .map((x) => x.d);
}

/**
 * @param {{
 *   id: string,
 *   counts?: { metric:string, filters:string[], unit?:string, label:string }[],
 *   plants?: boolean,
 *   markerMetric: string,
 *   batchSize?: number,
 *   delayMs?: number,
 * }} spec
 */
export function createOverpassProvider(spec) {
  return {
    id: spec.id,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? globalThis.fetch;
      const sleep = ctx.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
      const batch = Number(ctx.env?.SUBNATIONAL_OSM_BATCH) || spec.batchSize || 40;
      const delay = spec.delayMs ?? 2000;
      const deadline = ctx.deadlineMs ?? Infinity;
      // Cheap health check first: with every mirror down, the per-division loop below used to burn
      // 15-25 minutes of timeouts per seeder before giving up.
      try { await post(fetchFn, '[out:json][timeout:10];node(1);out ids;', 20_000, 1); }
      catch (err) { throw new Error(`Overpass preflight failed on every mirror (${err.message}); OSM layer skipped this run`); }
      const targets = pickBatch(ctx.previous?.divisions, spec.markerMetric, batch);
      const observations = [];
      let consecutiveFailures = 0;
      let done = 0;
      for (const div of targets) {
        if (Date.now() > deadline) break;
        try {
          const meta = {
            divisionId: div.id,
            source: 'osm:overpass',
            sourceUrl: `https://www.openstreetmap.org/search?query=${encodeURIComponent(div.name)}`,
            scope: 'division',
            method: 'direct',
            year: new Date(ctx.nowMs ?? Date.now()).getUTCFullYear(),
            note: 'OSM mapped-feature count; completeness varies by country',
          };
          if (spec.counts?.length) {
            const json = await post(fetchFn, buildCountQuery(div.id, spec.counts.map((c) => c.filters)), 150_000);
            const totals = parseCounts(json);
            if (totals.length !== spec.counts.length) throw new Error(`expected ${spec.counts.length} counts, got ${totals.length}`);
            spec.counts.forEach((c, i) => observations.push({ ...meta, metric: c.metric, value: totals[i], unit: c.unit ?? 'count' }));
          }
          if (spec.plants) {
            const json = await post(fetchFn, buildPlantsQuery(div.id), 180_000);
            const { total, bySource } = summarizePlants(json);
            observations.push({ ...meta, metric: 'installed_mw_total', value: total.mw, unit: 'MW' });
            observations.push({ ...meta, metric: 'plants_with_capacity', value: total.count, unit: 'count' });
            for (const [src, mw] of Object.entries(bySource)) observations.push({ ...meta, metric: `installed_mw_${src}`, value: mw, unit: 'MW' });
          }
          consecutiveFailures = 0;
          done += 1;
        } catch (err) {
          consecutiveFailures += 1;
          if (consecutiveFailures >= 2) throw new Error(`Overpass failing repeatedly (last: ${err.message}); stopped after ${done}/${targets.length}`);
        }
        await sleep(delay);
      }
      return { observations, note: `${done}/${targets.length} divisions refreshed this run (batch ${batch})` };
    },
  };
}
