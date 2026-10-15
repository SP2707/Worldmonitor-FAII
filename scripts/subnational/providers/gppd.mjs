// WRI Global Power Plant Database v1.3.0 (CC BY 4.0). ~35k plants worldwide with capacity (MW),
// primary fuel, coordinates. The project is unmaintained since early 2022, so this is a ~2021
// snapshot: great for structural energy mix and strategic capacity, NOT current. Every
// observation says so. Plants are assigned to divisions with the vendored boundaries.

import { DIVISIONS as ALL_DIVISIONS, isExtraLayer } from '../_registry.mjs';
// No boundary polygons for the Eurostat NUTS 2 layer, so zero-filling it would claim "no power plants" falsely.
const DIVISIONS = ALL_DIVISIONS.filter((d) => !isExtraLayer(d));
import { locate } from '../geo/geo.mjs';
import { parseCsv } from '../_csv.mjs';

export const GPPD_URL = 'https://raw.githubusercontent.com/wri/global-power-plant-database/master/output_database/global_power_plant_database.csv';
export const ISO3_TO_ISO2 = { USA: 'US', CHN: 'CN', RUS: 'RU', GBR: 'GB', DEU: 'DE', KOR: 'KR', FRA: 'FR', JPN: 'JP', SAU: 'SA', ISR: 'IL', ARE: 'AE', IND: 'IN', CAN: 'CA', UKR: 'UA', ITA: 'IT' };
export const FUEL_GROUP = {
  Coal: 'coal', Gas: 'gas', Oil: 'oil', Petcoke: 'oil', Hydro: 'hydro', Nuclear: 'nuclear', Solar: 'solar', Wind: 'wind',
  Biomass: 'biomass_waste', Waste: 'biomass_waste', Cogeneration: 'other', Geothermal: 'geothermal', Storage: 'storage',
  'Wave and Tidal': 'other', Other: 'other',
};
export const FUEL_GROUPS = ['coal', 'gas', 'oil', 'hydro', 'nuclear', 'solar', 'wind', 'biomass_waste', 'geothermal', 'storage', 'other'];

export function aggregatePlants(rows) {
  const out = new Map(DIVISIONS.map((d) => [d.id, { total_mw: 0, count: 0, gen_gwh_2017: 0, by: Object.fromEntries(FUEL_GROUPS.map((g) => [g, 0])) }]));
  const stats = { considered: 0, contains: 0, nearest: 0, unassigned: 0 };
  for (const r of rows) {
    const country = ISO3_TO_ISO2[r.country];
    if (!country) continue;
    const mw = Number(r.capacity_mw);
    if (!Number.isFinite(mw) || mw < 0) continue;
    stats.considered++;
    const loc = locate(Number(r.longitude), Number(r.latitude), { country });
    if (!loc) { stats.unassigned++; continue; }
    stats[loc.method]++;
    const c = out.get(loc.id);
    const g = FUEL_GROUP[r.primary_fuel] ?? 'other';
    c.total_mw += mw; c.count++; c.by[g] += mw;
    const gen = Number(r.estimated_generation_gwh_2017);
    if (Number.isFinite(gen) && gen > 0) c.gen_gwh_2017 += gen;
  }
  return { agg: out, stats };
}

export function createGppdProvider({ id = 'wri-gppd', only = null } = {}) {
  const want = (m) => !only || only.includes(m);
  return {
    id,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? globalThis.fetch;
      const resp = await fetchFn(GPPD_URL, { headers: { 'User-Agent': 'worldmonitor-faii-subnational/1.0' }, signal: AbortSignal.timeout(120_000) });
      if (!resp.ok) throw new Error(`GPPD HTTP ${resp.status}`);
      const rows = parseCsv(await resp.text());
      if (rows.length < 1000 || !('capacity_mw' in rows[0])) throw new Error('GPPD: unexpected CSV shape');
      const { agg, stats } = aggregatePlants(rows);
      const base = { source: 'wri-gppd:v1.3.0', sourceUrl: 'https://datasets.wri.org/dataset/globalpowerplantdatabase', scope: 'division', method: 'direct', year: 2021, note: 'WRI GPPD v1.3.0 snapshot (CC BY 4.0), unmaintained since 2022; capacity not generation' };
      const observations = [];
      for (const [divisionId, c] of agg) {
        if (want('installed_mw_total')) observations.push({ ...base, divisionId, metric: 'installed_mw_total', value: c.total_mw, unit: 'MW' });
        if (want('plants_count')) observations.push({ ...base, divisionId, metric: 'plants_count', value: c.count, unit: 'count' });
        if (want('estimated_generation_gwh_2017')) observations.push({ ...base, divisionId, metric: 'estimated_generation_gwh_2017', value: c.gen_gwh_2017, unit: 'GWh', year: 2017, note: 'GPPD model estimate for 2017 (plants with an estimate only)' });
        for (const g of FUEL_GROUPS) if (want(`installed_mw_${g}`)) observations.push({ ...base, divisionId, metric: `installed_mw_${g}`, value: c.by[g], unit: 'MW' });
      }
      return { observations, note: `${stats.considered} plants: ${stats.contains} inside, ${stats.nearest} nearest-fallback, ${stats.unassigned} unassigned` };
    },
  };
}
