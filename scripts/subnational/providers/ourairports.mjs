// OurAirports (public domain, community-maintained, updated continuously) - airport counts per
// division. Division = the record's ISO 3166-2 region when it is one of ours, otherwise located
// from its coordinates with the vendored boundaries (handles e.g. Chinese numeric codes).
// Zero-filled for every division: OurAirports is a global register, so 0 means "none listed".

import { DIVISIONS as ALL_DIVISIONS, COUNTRIES, isExtraLayer } from '../_registry.mjs';
// Point-in-region placement needs boundary polygons, which the Eurostat NUTS 2 layer does not have: zero-filling those divisions would claim "no airports" falsely.
const DIVISIONS = ALL_DIVISIONS.filter((d) => !isExtraLayer(d));
import { locate } from '../geo/geo.mjs';
import { parseCsv } from '../_csv.mjs';

export const OURAIRPORTS_URL = 'https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv';
const MIL_NAME = /(air force base|\bafb\b|air base|airbase|naval air|naval station|military|army airfield|air station|\bnas\b)/i;

export const AIRPORT_METRICS = [
  'airports_large', 'airports_medium', 'airports_small', 'heliports', 'seaplane_bases',
  'airports_scheduled_service', 'airports_with_iata', 'airfields_military_by_name',
];

/** Pure aggregation over parsed rows -> Map(divisionId -> counts), plus assignment stats. */
export function aggregateAirports(rows) {
  const ids = new Set(DIVISIONS.map((d) => d.id));
  const countries = new Set(COUNTRIES);
  const out = new Map(DIVISIONS.map((d) => [d.id, Object.fromEntries(AIRPORT_METRICS.map((m) => [m, 0]))]));
  const stats = { considered: 0, direct: 0, located: 0, nearest: 0, unassigned: 0 };
  for (const r of rows) {
    if (!countries.has(r.iso_country) || r.type === 'closed' || r.type === 'balloonport') continue;
    stats.considered++;
    let id = null;
    if (ids.has(r.iso_region)) { id = r.iso_region; stats.direct++; }
    else {
      const loc = locate(Number(r.longitude_deg), Number(r.latitude_deg), { country: r.iso_country });
      if (loc) { id = loc.id; stats[loc.method === 'nearest' ? 'nearest' : 'located']++; } else stats.unassigned++;
    }
    if (!id) continue;
    const c = out.get(id);
    if (r.type === 'large_airport') c.airports_large++;
    else if (r.type === 'medium_airport') c.airports_medium++;
    else if (r.type === 'small_airport') c.airports_small++;
    else if (r.type === 'heliport') c.heliports++;
    else if (r.type === 'seaplane_base') c.seaplane_bases++;
    if (r.scheduled_service === 'yes') c.airports_scheduled_service++;
    if (r.iata_code) c.airports_with_iata++;
    if (MIL_NAME.test(r.name || '')) c.airfields_military_by_name++;
  }
  return { counts: out, stats };
}

export function createOurAirportsProvider({ id = 'ourairports', only = null } = {}) {
  const want = new Set(only ?? AIRPORT_METRICS);
  return {
    id,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? globalThis.fetch;
      const resp = await fetchFn(OURAIRPORTS_URL, { headers: { 'User-Agent': 'worldmonitor-faii-subnational/1.0' }, signal: AbortSignal.timeout(120_000) });
      if (!resp.ok) throw new Error(`OurAirports HTTP ${resp.status}`);
      const rows = parseCsv(await resp.text());
      if (rows.length < 1000 || !('iso_region' in rows[0])) throw new Error('OurAirports: unexpected CSV shape');
      const { counts, stats } = aggregateAirports(rows);
      const year = new Date(ctx.nowMs ?? Date.now()).getUTCFullYear();
      const observations = [];
      for (const [divisionId, c] of counts) {
        for (const m of AIRPORT_METRICS) {
          if (!want.has(m)) continue;
          observations.push({
            divisionId, metric: m, value: c[m], unit: 'count', year,
            source: 'ourairports', sourceUrl: 'https://ourairports.com/data/', scope: 'division', method: 'direct',
            note: m === 'airfields_military_by_name' ? 'HEURISTIC: airport name matches air base/AFB/naval air/military patterns' : 'public-domain community register; closed airfields excluded',
          });
        }
      }
      return { observations, note: `${stats.considered} airfields: ${stats.direct} by ISO region, ${stats.located} located, ${stats.nearest} nearest-fallback, ${stats.unassigned} unassigned` };
    },
  };
}
