#!/usr/bin/env node
// Subnational seeder 5/10 - Energy and Strategic Resource Sufficiency.
// Backbone: WRI Global Power Plant Database v1.3.0 (CC BY 4.0, ~24.8k plants in these countries,
// capacity by fuel, plant coordinates assigned to divisions by boundary polygons). It is a ~2021
// snapshot - structural capacity and mix, NOT current output. OSM Overpass adds wells,
// refineries and mines when a mirror is up. National World Bank energy context is repeated and
// labelled national. Per-capita and mix figures are derived and labelled as such.
import { createWikidataProvider } from './subnational/providers/wikidata.mjs';
import { createOverpassProvider } from './subnational/providers/overpass.mjs';
import { createWorldBankProvider } from './subnational/providers/worldbank.mjs';
import { createGppdProvider } from './subnational/providers/gppd.mjs';
import { addRatio } from './subnational/_core.mjs';
import { runCategorySeeder, isMainScript } from './subnational/_run.mjs';

export const SLUG = 'energy';
export const COUNTS = [
  { metric: 'petroleum_wells', label: 'petroleum wells', filters: ['["man_made"="petroleum_well"]'] },
  { metric: 'refineries', label: 'refineries', filters: ['["industrial"="refinery"]'] },
  { metric: 'mines_quarries', label: 'mines and quarries', filters: ['["industrial"="mine"]', '["landuse"="quarry"]'] },
];
// Used only as a denominator; a division with just this is NOT counted as covered.
export const auxMetrics = ['population'];
export const providers = [
  createWikidataProvider([{ metric: 'population', prop: 'P1082', unit: 'persons' }]),
  createGppdProvider(),
  createOverpassProvider({ id: 'osm:energy', counts: COUNTS, markerMetric: 'petroleum_wells', batchSize: 40 }),
  createWorldBankProvider([
    { metric: 'energy_imports_net_pct_use_national', indicator: 'EG.IMP.CONS.ZS', unit: '% of energy use', label: 'net energy imports (negative = net exporter)' },
    { metric: 'energy_use_per_capita_national', indicator: 'EG.USE.PCAP.KG.OE', unit: 'kg oil eq.', label: 'energy use per capita' },
    { metric: 'renewable_electricity_pct_national', indicator: 'EG.ELC.RNEW.ZS', unit: '% of electricity output', label: 'renewable electricity' },
    { metric: 'electric_consumption_per_capita_national', indicator: 'EG.USE.ELEC.KH.PC', unit: 'kWh', label: 'electric power consumption per capita' },
  ]),
];

const SHARES = [
  ['renewable_capacity_share_pct', ['hydro', 'solar', 'wind', 'biomass_waste', 'geothermal']],
  ['fossil_capacity_share_pct', ['coal', 'gas', 'oil']],
  ['nuclear_capacity_share_pct', ['nuclear']],
];
const NOTE_SNAPSHOT = 'DERIVED from WRI GPPD ~2021 capacity (not generation, not current)';

export function derive(rec, nowMs) {
  for (const k of ['installed_w_per_capita', 'generation_2017_kwh_per_capita', ...SHARES.map(([m]) => m)]) delete rec.metrics[k];
  addRatio(rec, {
    numerator: 'installed_mw_total', denominator: 'population', metric: 'installed_w_per_capita', unit: 'W per person', factor: 1e6, nowMs,
    note: 'DERIVED: GPPD ~2021 installed capacity / Wikidata population (vintages differ)',
  });
  addRatio(rec, {
    numerator: 'estimated_generation_gwh_2017', denominator: 'population', metric: 'generation_2017_kwh_per_capita', unit: 'kWh per person', factor: 1e6, nowMs,
    note: 'DERIVED: GPPD 2017 generation estimate / Wikidata population (plants with an estimate only)',
  });
  const total = rec.metrics.installed_mw_total;
  if (!total || total.scope !== 'division' || !(total.value > 0)) return;
  for (const [metric, groups] of SHARES) {
    let mw = 0, seen = 0;
    for (const g of groups) { const m = rec.metrics[`installed_mw_${g}`]; if (m && m.scope === 'division') { mw += m.value; seen++; } }
    if (!seen) continue;
    rec.metrics[metric] = { value: (mw / total.value) * 100, unit: '% of installed MW', year: total.year ?? null, source: `derived:${groups.join('+')}/installed_mw_total`, sourceUrl: null, scope: 'division', method: 'derived', note: NOTE_SNAPSHOT, rank: 0, fetchedAt: nowMs };
  }
}

if (isMainScript('seed-subnational-energy.mjs')) {
  runCategorySeeder({ slug: SLUG, scriptUrl: import.meta.url, providers, derive, auxMetrics, budgetMs: 1_500_000, sourceVersion: 'subnational-energy-v2' });
}
