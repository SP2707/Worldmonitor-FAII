#!/usr/bin/env node
// Subnational seeder 10/10 - Geostrategic and Military Footprint.
// Honest scope: there is no open, complete register of military sites. What is used:
//  - OurAirports airfields whose NAME marks them as military (HEURISTIC, a floor not a census)
//  - UCDP GED conflict events/deaths already seeded by the live feed, assigned by polygon
//    (lags months; a capped slice, so only divisions with events get values)
//  - OSM military-tagged features when an Overpass mirror is up (zeros = none mapped)
//  - SIPRI/World Bank national defence indicators, labelled national
import { createWikidataProvider } from './subnational/providers/wikidata.mjs';
import { createOverpassProvider } from './subnational/providers/overpass.mjs';
import { createWorldBankProvider } from './subnational/providers/worldbank.mjs';
import { createOurAirportsProvider } from './subnational/providers/ourairports.mjs';
import { createLiveEventsProvider } from './subnational/providers/live-events.mjs';
import { makeDensityDerive } from './subnational/_core.mjs';
import { runCategorySeeder, isMainScript } from './subnational/_run.mjs';

export const SLUG = 'military';
export const COUNTS = [
  { metric: 'military_landuse', label: 'military land areas', filters: ['["landuse"="military"]'] },
  { metric: 'military_airfields', label: 'military airfields', filters: ['["military"="airfield"]'] },
  { metric: 'military_barracks', label: 'barracks', filters: ['["military"="barracks"]'] },
  { metric: 'military_naval_bases', label: 'naval bases', filters: ['["military"="naval_base"]'] },
  { metric: 'military_ranges', label: 'training ranges', filters: ['["military"="range"]'] },
  { metric: 'military_bunkers', label: 'bunkers', filters: ['["military"="bunker"]'] },
];
// Used only as a denominator; a division with just this is NOT counted as covered.
export const auxMetrics = ['area_km2'];
export const providers = [
  createWikidataProvider([{ metric: 'area_km2', prop: 'P2046', withUnit: true }]),
  createOurAirportsProvider({ only: ['airfields_military_by_name'] }),
  createLiveEventsProvider('ucdp'),
  createOverpassProvider({ id: 'osm:military', counts: COUNTS, markerMetric: 'military_landuse', batchSize: 40 }),
  createWorldBankProvider([
    { metric: 'military_spend_pct_gdp_national', indicator: 'MS.MIL.XPND.GD.ZS', unit: '% of GDP', label: 'military expenditure (SIPRI)' },
    { metric: 'military_spend_usd_national', indicator: 'MS.MIL.XPND.CD', unit: 'USD', label: 'military expenditure (SIPRI)' },
    { metric: 'armed_forces_personnel_national', indicator: 'MS.MIL.TOTL.P1', unit: 'persons', label: 'armed forces personnel' },
  ]),
];
export const derive = makeDensityDerive(['airfields_military_by_name', 'military_landuse', 'military_airfields', 'military_barracks']);

if (isMainScript('seed-subnational-military.mjs')) {
  runCategorySeeder({ slug: SLUG, scriptUrl: import.meta.url, providers, derive, auxMetrics, budgetMs: 1_500_000, sourceVersion: 'subnational-military-v2' });
}
