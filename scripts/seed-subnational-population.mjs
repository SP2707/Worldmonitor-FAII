#!/usr/bin/env node
// Subnational seeder 3/10 - Population Size and Demographic Dividend.
import { createEurostatProvider } from './subnational/providers/eurostat.mjs';
import { createFredStateProvider } from './subnational/providers/fred-us-states.mjs';
import { createMongoliaPxProvider } from './subnational/providers/pxweb-mongolia.mjs';
import { createDosmPopulationProvider } from './subnational/providers/dosm-malaysia.mjs';
import { createWikidataProvider } from './subnational/providers/wikidata.mjs';
import { createWorldBankProvider } from './subnational/providers/worldbank.mjs';
import { addRatio, makeShareDeriveAll } from './subnational/_core.mjs';
import { runCategorySeeder, isMainScript } from './subnational/_run.mjs';

export const SLUG = 'population';
// demo_r_d2jan = single-year ages (TOTAL verified); broad groups live in demo_r_pjanaggr3.
const EU = (dataset, metric, age, id) => createEurostatProvider({
  dataset, metric, unit: 'persons', query: `sex=T&age=${age}&unit=NR`, id,
});
export const providers = [
  EU('demo_r_d2jan', 'population', 'TOTAL', 'eurostat:demo_r_d2jan:total'),
  EU('demo_r_pjanaggr3', 'population_15_64', 'Y15-64', 'eurostat:demo_r_pjanaggr3:15-64'),
  EU('demo_r_pjanaggr3', 'population_65_plus', 'Y_GE65', 'eurostat:demo_r_pjanaggr3:65+'),
  createFredStateProvider({ metric: 'population', suffix: 'POP', unit: 'persons', scale: 1000, label: 'FRED/Census resident population (thousands x 1000)' }),
  createMongoliaPxProvider({ id: 'mn-nso:mid-year-population', folder: 'Population and household', table: 'DT_NSO_0300_002V4', metric: 'population', unit: 'persons', checkChildren: true, note: 'NSO mid-year resident population; table checked: aimag rows and soum rows each add up to the national total' }),
  createDosmPopulationProvider(), // Malaysia: OpenDOSM population_state, unit checked against the World Bank national total
  createWikidataProvider([{ metric: 'population', prop: 'P1082', unit: 'persons' }]),
  createWorldBankProvider([
    { metric: 'population_national', indicator: 'SP.POP.TOTL', unit: 'persons', label: 'total population' },
    { metric: 'working_age_share_national', indicator: 'SP.POP.1564.TO.ZS', unit: '% of total', label: 'ages 15-64' },
    { metric: 'elderly_share_national', indicator: 'SP.POP.65UP.TO.ZS', unit: '% of total', label: 'ages 65+' },
    { metric: 'age_dependency_ratio_national', indicator: 'SP.POP.DPND', unit: 'per 100 working-age', label: 'age dependency ratio' },
    { metric: 'fertility_rate_national', indicator: 'SP.DYN.TFRT.IN', unit: 'births per woman', label: 'total fertility rate' },
  ]),
];

export function derive(rec, nowMs) {
  addRatio(rec, { numerator: 'population_15_64', denominator: 'population', metric: 'working_age_share_pct', unit: '% of total', factor: 100, nowMs });
  addRatio(rec, { numerator: 'population_65_plus', denominator: 'population', metric: 'elderly_share_pct', unit: '% of total', factor: 100, nowMs });
}

export const deriveAll = makeShareDeriveAll({ from: { metric: 'population' }, outMetric: 'population_share_of_country_pct', note: 'share of the sum of the country\'s listed divisions (same source, unit, year)' });

if (isMainScript('seed-subnational-population.mjs')) {
  runCategorySeeder({ slug: SLUG, scriptUrl: import.meta.url, providers, derive, deriveAll, sourceVersion: 'subnational-population-v2' });
}
