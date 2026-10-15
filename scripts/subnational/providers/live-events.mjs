// Live point-event layers read from the Redis keys the other (already working) seeders fill:
//   fires        wildfire:fires:v1          NASA FIRMS NRT (+ CWFIS), capped sample (15,000 rows)
//   quakes       seismology:earthquakes:v1  USGS M4.5+ past week, complete for that threshold
//   ucdp         conflict:ucdp-events:v1    UCDP GED, capped recent slice (2,000 rows), lags months
// Events are assigned to divisions with the vendored boundaries. No extra network calls.
//
// Honesty: fires and ucdp are CAPPED SAMPLES, so a division with no events is NOT reported as
// zero - only divisions that have at least one event get observations. quakes (complete for
// M4.5+) are zero-filled. Each observation carries the window it covers.

import { DIVISIONS as ALL_DIVISIONS, isExtraLayer } from '../_registry.mjs';
// Events are placed by boundary polygons, which the Eurostat NUTS 2 layer lacks: zero-filling it would claim "no events" falsely.
const DIVISIONS = ALL_DIVISIONS.filter((d) => !isExtraLayer(d));
import { locate } from '../geo/geo.mjs';

const iso = (ms) => new Date(ms).toISOString().slice(0, 10);

function assign(events, pt) {
  const byDiv = new Map();
  const stats = { events: 0, assigned: 0, outside: 0 };
  for (const e of events) {
    const p = pt(e);
    if (!p) continue;
    stats.events++;
    const loc = locate(p[0], p[1]);
    if (!loc) { stats.outside++; continue; }
    stats.assigned++;
    if (!byDiv.has(loc.id)) byDiv.set(loc.id, []);
    byDiv.get(loc.id).push(e);
  }
  return { byDiv, stats };
}
const lonlat = (e) => (Number.isFinite(e?.location?.longitude) && Number.isFinite(e?.location?.latitude) ? [e.location.longitude, e.location.latitude] : null);
const window = (events, t) => {
  const ts = events.map(t).filter(Number.isFinite);
  return ts.length ? { from: Math.min(...ts), to: Math.max(...ts) } : null;
};

export const LIVE = {
  fires: {
    key: 'wildfire:fires:v1',
    source: 'nasa-firms+cwfis (seeded)',
    sourceUrl: 'https://firms.modaps.eosdis.nasa.gov/',
    list: (d) => d?.fireDetections ?? [],
    point: lonlat,
    time: (e) => e.detectedAt,
    zeroFill: false,
    maxAgeMs: 10 * 86400_000, // the seeded feed mixes in old detections (seen: 2020); only the last 10 days count
    metrics: (evs) => ({
      fires_detections: [evs.length, 'count'],
      fires_frp_total: [evs.reduce((s, e) => s + (Number(e.frp) || 0), 0), 'MW (FRP sum)'],
      fires_high_confidence: [evs.filter((e) => /HIGH/.test(String(e.confidence))).length, 'count'],
    }),
    emptyMetrics: null,
    capNote: 'capped sample of the latest detections; absence of rows does not mean no fire',
  },
  quakes: {
    key: 'seismology:earthquakes:v1',
    source: 'usgs-m4.5-week (seeded)',
    sourceUrl: 'https://earthquake.usgs.gov/earthquakes/feed/',
    list: (d) => d?.earthquakes ?? [],
    point: lonlat,
    time: (e) => e.occurredAt,
    zeroFill: true,
    metrics: (evs) => ({
      quakes_m45_week: [evs.length, 'count'],
      quake_max_magnitude: [evs.reduce((m, e) => Math.max(m, Number(e.magnitude) || 0), 0), 'M'],
    }),
    emptyMetrics: { quakes_m45_week: [0, 'count'], quake_max_magnitude: [0, 'M'] },
    capNote: 'complete for magnitude 4.5+ in the past week',
  },
  ucdp: {
    key: 'conflict:ucdp-events:v1',
    source: 'ucdp-ged (seeded)',
    sourceUrl: 'https://ucdp.uu.se/',
    list: (d) => d?.events ?? [],
    point: lonlat,
    time: (e) => e.dateStart,
    zeroFill: false,
    metrics: (evs) => ({
      ucdp_events: [evs.length, 'count'],
      ucdp_deaths_best: [evs.reduce((s, e) => s + (Number(e.deathsBest) || 0), 0), 'persons (best estimate)'],
    }),
    emptyMetrics: null,
    capNote: 'UCDP GED publishes with a lag of months; seeded slice is capped, so absence does not mean peace',
  },
};

export function aggregateLive(kind, data, nowMs = Date.now()) {
  const cfg = LIVE[kind];
  const all = cfg.list(data);
  const events = cfg.maxAgeMs ? all.filter((e) => { const t = Number(cfg.time(e)); return Number.isFinite(t) && nowMs - t <= cfg.maxAgeMs && t <= nowMs + 86400_000; }) : all;
  const { byDiv, stats } = assign(events, cfg.point);
  const win = window(events, cfg.time);
  const rows = [];
  for (const div of DIVISIONS) {
    const evs = byDiv.get(div.id);
    const m = evs ? cfg.metrics(evs) : (cfg.zeroFill ? cfg.emptyMetrics : null);
    if (!m) continue;
    for (const [metric, [value, unit]] of Object.entries(m)) {
      rows.push({
        divisionId: div.id, metric, value, unit,
        year: new Date(nowMs).getUTCFullYear(),
        source: cfg.source, sourceUrl: cfg.sourceUrl, scope: 'division', method: 'direct',
        note: `window ${win ? `${iso(win.from)}..${iso(win.to)}` : 'unknown'}; ${cfg.capNote}`,
      });
    }
  }
  return { observations: rows, stats, window: win };
}

async function defaultRead(key) {
  const { readCanonicalValue } = await import('../../_seed-utils.mjs');
  return readCanonicalValue(key);
}

export function createLiveEventsProvider(kind, { id = `live:${kind}` } = {}) {
  const cfg = LIVE[kind];
  if (!cfg) throw new Error(`unknown live kind ${kind}`);
  return {
    id,
    async run(ctx) {
      const data = await (ctx.readKey ?? defaultRead)(cfg.key);
      if (!data) throw new Error(`${cfg.key} is empty - run the ${kind} seeder first`);
      const { observations, stats, window: w } = aggregateLive(kind, data, ctx.nowMs ?? Date.now());
      return { observations, note: `${stats.assigned}/${stats.events} events inside our divisions (${stats.outside} elsewhere)${w ? `, window ${iso(w.from)}..${iso(w.to)}` : ''}` };
    },
  };
}
