// FRED state-level series via the keyless fredgraph.csv endpoint (US states + DC only).
// Verified live (HTTP 200): {ST}NGSP, {ST}POP, {ST}PCPI (per-capita personal income, 51/51),
// MEHOINUS{ST}A646N (median household income, 51/51), plus {ST}UR, GCT1502{ST}, PPAA{ST}{FIPS}000A156NCEN
// (CA confirmed). FRED sits behind a WAF: a burst of ~50 parallel requests got the caller's IP an
// "Access Denied" for a while, so requests are strictly sequential with a delay, and the provider
// stops at the first 403/429 instead of hammering on (keeping what it already read).

import { DIVISIONS } from '../_registry.mjs';

export const US_FIPS = {
  AL: '01', AK: '02', AZ: '04', AR: '05', CA: '06', CO: '08', CT: '09', DE: '10', DC: '11', FL: '12', GA: '13', HI: '15', ID: '16', IL: '17', IN: '18', IA: '19', KS: '20',
  KY: '21', LA: '22', ME: '23', MD: '24', MA: '25', MI: '26', MN: '27', MS: '28', MO: '29', MT: '30', NE: '31', NV: '32', NH: '33', NJ: '34', NM: '35', NY: '36', NC: '37',
  ND: '38', OH: '39', OK: '40', OR: '41', PA: '42', RI: '44', SC: '45', SD: '46', TN: '47', TX: '48', UT: '49', VT: '50', VA: '51', WA: '53', WV: '54', WI: '55', WY: '56',
};

/** "observation_date,ID\n2024-01-01,123\n..." -> {date, value} of the newest numeric row, or null. */
export function parseFredLatest(csv) {
  if (typeof csv !== 'string') return null;
  const lines = csv.trim().split(/\r?\n/);
  for (let i = lines.length - 1; i >= 1; i--) {
    const [date, raw] = lines[i].split(',');
    const n = Number(raw);
    if (date && raw != null && raw.trim() !== '' && raw.trim() !== '.' && Number.isFinite(n)) return { date: date.trim(), value: n };
  }
  return null;
}

/**
 * @param {{ metric:string, suffix?:string, idFn?:(st:string,fips:string)=>string, unit:string, scale?:number, label:string, delayMs?:number }} spec
 *   Series id is `${ST}${suffix}` unless idFn is given.
 */
export function createFredStateProvider(spec, { id } = {}) {
  const tag = spec.suffix ?? spec.metric;
  const providerId = id ?? `fred:state-${tag}`;
  return {
    id: providerId,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? globalThis.fetch;
      const sleep = ctx.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
      const observations = [];
      const errors = [];
      let missing = 0;
      let blocked = null;
      const states = DIVISIONS.filter((d) => d.country === 'US' && /^US-[A-Z]{2}$/.test(d.id));
      for (const div of states) {
        if (Date.now() > (ctx.deadlineMs ?? Infinity)) break;
        const st = div.id.slice(3);
        const series = spec.idFn ? spec.idFn(st, US_FIPS[st]) : `${st}${spec.suffix}`;
        try {
          const resp = await fetchFn(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${series}&cosd=2015-01-01`, {
            headers: { Accept: 'text/csv', 'User-Agent': 'worldmonitor-faii-subnational/1.0' },
            signal: AbortSignal.timeout(30_000),
          });
          if (resp.status === 403 || resp.status === 429) { blocked = `HTTP ${resp.status} at ${series}`; break; }
          if (resp.status === 404) { missing++; await sleep(spec.delayMs ?? 400); continue; }
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const hit = parseFredLatest(await resp.text());
          if (!hit) throw new Error('no numeric rows');
          observations.push({
            divisionId: div.id,
            metric: spec.metric,
            value: hit.value * (spec.scale ?? 1),
            unit: spec.unit,
            year: Number(hit.date.slice(0, 4)) || null,
            source: `fred:${series}`,
            sourceUrl: `https://fred.stlouisfed.org/series/${series}`,
            scope: 'division',
            method: 'direct',
            note: spec.label,
          });
        } catch (err) {
          errors.push(`${series}: ${err.message}`);
        }
        await sleep(spec.delayMs ?? 400);
      }
      if (observations.length === 0) {
        throw new Error(`no FRED ${tag} series readable${blocked ? ` (FRED refused: ${blocked}; wait and retry)` : ''}${errors.length ? `: ${errors.slice(0, 3).join('; ')}` : ''}`);
      }
      const parts = [];
      if (blocked) parts.push(`stopped early, FRED refused (${blocked}); got ${observations.length}/${states.length}`);
      if (missing) parts.push(`${missing} series not published`);
      if (errors.length) parts.push(`${errors.length} failed: ${errors.slice(0, 3).join('; ')}`);
      return { observations, ...(parts.length ? { note: parts.join('; ') } : {}) };
    },
  };
}
