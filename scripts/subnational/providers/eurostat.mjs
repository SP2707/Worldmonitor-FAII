// Eurostat dissemination API (JSON-stat 2.0, no key). Only the three EU
// countries in the list (DE, FR, IT) are covered; UK left Eurostat after Brexit.
// Divisions carry NUTS 2021 codes in divisions.json. A division is read
// directly when the dataset has its code, otherwise summed from its children
// (same-year only), because several tables are published at NUTS 2 or 3 only.

import { DIVISIONS } from '../_registry.mjs';

const BASE = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

/** JSON-stat 2.0 -> [{ geo, time, value }] (works for any extra dims already pinned to one value). */
export function parseJsonStat(js) {
  const ids = js?.id;
  const size = js?.size;
  if (!Array.isArray(ids) || !Array.isArray(size) || !js.dimension || js.value == null) return [];
  const posToCode = ids.map((dim) => {
    const idx = js.dimension[dim]?.category?.index ?? {};
    const arr = [];
    if (Array.isArray(idx)) idx.forEach((code, i) => { arr[i] = code; });
    else for (const [code, i] of Object.entries(idx)) arr[i] = code;
    return arr;
  });
  const geoDim = ids.indexOf('geo');
  const timeDim = ids.indexOf('time');
  if (geoDim < 0 || timeDim < 0) return [];
  const loose = ids.filter((d, i) => i !== geoDim && i !== timeDim && size[i] > 1);
  if (loose.length > 0) throw new Error(`unpinned dimension(s) ${loose.join(',')}; refusing to mix series`);
  const strides = new Array(size.length);
  let s = 1;
  for (let i = size.length - 1; i >= 0; i--) { strides[i] = s; s *= size[i]; }
  const entries = Array.isArray(js.value) ? js.value.map((v, i) => [i, v]) : Object.entries(js.value).map(([k, v]) => [Number(k), v]);
  const rows = [];
  for (const [flat, value] of entries) {
    if (value == null || !Number.isFinite(Number(value))) continue;
    const g = Math.floor(flat / strides[geoDim]) % size[geoDim];
    const t = Math.floor(flat / strides[timeDim]) % size[timeDim];
    rows.push({ geo: posToCode[geoDim][g], time: posToCode[timeDim][t], value: Number(value) });
  }
  return rows;
}

/** geo -> Map(time -> value) */
export function indexRows(rows) {
  const m = new Map();
  for (const r of rows) {
    if (!m.has(r.geo)) m.set(r.geo, new Map());
    m.get(r.geo).set(r.time, r.value);
  }
  return m;
}

/**
 * Value for one NUTS code: direct (latest year) or sum of children that share
 * the latest common year. Returns null when neither is possible.
 */
export function resolveCode(index, code, leafLength = code.length + 1, directOnly = false) {
  const direct = index.get(code);
  if (direct && direct.size > 0) {
    const year = [...direct.keys()].sort().pop();
    return { value: direct.get(year), year, method: 'direct' };
  }
  if (directOnly) return null; // rates / indices / means must never be summed over child regions
  const children = [...index.keys()].filter((g) => g.startsWith(code) && g.length === leafLength);
  if (children.length === 0) return null;
  let common = null;
  for (const c of children) {
    const years = new Set(index.get(c).keys());
    common = common ? new Set([...common].filter((y) => years.has(y))) : years;
  }
  if (!common || common.size === 0) return null;
  const year = [...common].sort().pop();
  return { value: children.reduce((a, c) => a + index.get(c).get(year), 0), year, method: 'sum_of_children' };
}

/**
 * @param {{ dataset:string, metric:string, unit:string, query?:string, leafLength?:number, id?:string, rate?:boolean }} spec
 *   rate:true for rates, shares and averages: only a direct value for a single NUTS code is used
 *   (no summing over children, no multi-code divisions such as a pair of NUTS 2 regions).
 */
export function createEurostatProvider(spec) {
  const id = spec.id ?? `eurostat:${spec.dataset}`;
  return {
    id,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? globalThis.fetch;
      const url = `${BASE}/${spec.dataset}?format=JSON&lang=EN&lastTimePeriod=5${spec.query ? `&${spec.query}` : ''}`;
      const resp = await fetchFn(url, {
        headers: { Accept: 'application/json', 'User-Agent': 'worldmonitor-faii-subnational/1.0' },
        signal: AbortSignal.timeout(90_000),
      });
      if (!resp.ok) throw new Error(`Eurostat ${spec.dataset} HTTP ${resp.status}`);
      const index = indexRows(parseJsonStat(await resp.json()));
      if (index.size === 0) throw new Error(`Eurostat ${spec.dataset}: no parsable rows`);
      const observations = [];
      for (const div of DIVISIONS) {
        if (!div.nuts) continue;
        const codes = Array.isArray(div.nuts) ? div.nuts : [div.nuts];
        if (spec.rate && codes.length !== 1) continue;
        const parts = codes.map((c) => resolveCode(index, c, spec.leafLength ?? c.length + 1, !!spec.rate));
        if (parts.some((p) => !p)) continue;
        const years = new Set(parts.map((p) => p.year));
        if (years.size !== 1) continue; // never add numbers from different years
        observations.push({
          divisionId: div.id,
          metric: spec.metric,
          value: parts.reduce((a, p) => a + p.value, 0),
          unit: spec.unit,
          year: Number(parts[0].year),
          source: id,
          sourceUrl: `https://ec.europa.eu/eurostat/databrowser/view/${spec.dataset}/default/table`,
          scope: 'division',
          method: parts.every((p) => p.method === 'direct') ? 'direct' : 'sum_of_children',
        });
      }
      return { observations };
    },
  };
}
