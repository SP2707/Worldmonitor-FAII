#!/usr/bin/env node
// Subnational seeder 6/10 - Human Development Index (HDI).
// UNDP's subnational HDI is not available keyless, and Wikidata P1081 is essentially empty for
// these divisions. Instead of a fabricated index this seeder supplies the real MEASURED
// COMPONENTS that HDI is built from, where an official open source publishes them:
//   health     life expectancy at birth (Eurostat NUTS), standardised death rate
//   education  tertiary attainment of 25-64 (Eurostat NUTS), bachelor's+ share (FRED/Census, US)
//   income     per-capita personal income and median household income (FRED/BEA/Census, US)
//   context    unemployment (Eurostat; FRED/BLS), poverty rate (FRED/Census, US)
// Coverage is DE/FR/IT (Eurostat) and the 51 US states; other countries carry national World
// Bank context only. No composite index is computed because the inputs are not comparable.
import { createEurostatProvider } from './subnational/providers/eurostat.mjs';
import { createFredStateProvider } from './subnational/providers/fred-us-states.mjs';
import { createMongoliaPxProvider } from './subnational/providers/pxweb-mongolia.mjs';
import { createDosmHiesProvider, createDosmUnemploymentProvider } from './subnational/providers/dosm-malaysia.mjs';
import { createWikidataProvider } from './subnational/providers/wikidata.mjs';
import { createWorldBankProvider } from './subnational/providers/worldbank.mjs';
import { seriesFor } from './subnational/providers/oecd-series.mjs';
import { runCategorySeeder, isMainScript } from './subnational/_run.mjs';

export const SLUG = 'hdi';
const ES = (dataset, metric, unit, query, extra = {}) => createEurostatProvider({ dataset, metric, unit, query, rate: true, ...extra });
export const providers = [
  ES('demo_r_mlifexp', 'life_expectancy_years', 'years', 'sex=T&age=Y_LT1'),
  ES('edat_lfse_04', 'tertiary_attainment_pct', '% of age 25-64', 'sex=T&age=Y25-64&isced11=ED5-8'),
  ES('lfst_r_lfu3rt', 'unemployment_rate_pct', '% of labour force 15-74', 'sex=T&age=Y15-74&unit=PC&isced11=TOTAL'), // isced11 splits by education level; TOTAL = all levels (checked live)
  ES('hlth_cd_asdr2', 'standardised_death_rate_per_100k', 'per 100,000 (standardised)', 'sex=T&age=TOTAL&icd10=TOTAL&unit=RT'),
  createFredStateProvider({ metric: 'personal_income_per_capita_usd', suffix: 'PCPI', unit: 'USD', label: 'BEA per-capita personal income (via FRED)' }),
  createFredStateProvider({ metric: 'median_household_income_usd', idFn: (st) => `MEHOINUS${st}A646N`, unit: 'USD', label: 'Census median household income (via FRED)' }),
  createFredStateProvider({ metric: 'bachelors_or_higher_pct', idFn: (st) => `GCT1502${st}`, unit: '% of age 25+', label: 'Census ACS bachelor\'s degree or higher (via FRED)' }),
  createFredStateProvider({ metric: 'unemployment_rate_pct', suffix: 'UR', unit: '% of labour force', label: 'BLS unemployment rate, monthly (via FRED)' }),
  createFredStateProvider({ metric: 'poverty_rate_pct', idFn: (st, fips) => `PPAA${st}${fips}000A156NCEN`, unit: '% of people', label: 'Census SAIPE poverty rate (via FRED)' }),
  ...seriesFor('hdi'), // OECD regional statistics (curl transport, see providers/oecd.mjs)
  createMongoliaPxProvider({ id: 'mn-nso:hdi-by-aimag', folder: 'Human development', table: 'DT_NSO_2700_001V1', metric: 'hdi', unit: 'index 0-1', note: 'Mongolian NSO subnational HDI (official); its method was not checked against UNDP\'s, so do not compare it with national UNDP figures' }),
  createDosmHiesProvider(), // Malaysia: HIES Gini, poverty incidence, household income (no official state HDI exists in the sources found)
  createDosmUnemploymentProvider(), // Malaysia: LFS quarterly unemployment rate
  createWikidataProvider([{ metric: 'hdi', prop: 'P1081', unit: 'index 0-1', nationalMetric: 'hdi_national' }]),
  createWorldBankProvider([
    { metric: 'life_expectancy_national', indicator: 'SP.DYN.LE00.IN', unit: 'years', label: 'life expectancy at birth' },
    { metric: 'gni_per_capita_ppp_national', indicator: 'NY.GNP.PCAP.PP.CD', unit: 'intl $', label: 'GNI per capita PPP' },
    { metric: 'school_enrollment_tertiary_national', indicator: 'SE.TER.ENRR', unit: '% gross', label: 'tertiary enrollment' },
  ]),
];

if (isMainScript('seed-subnational-hdi.mjs')) {
  runCategorySeeder({ slug: SLUG, scriptUrl: import.meta.url, providers, budgetMs: 800_000, sourceVersion: 'subnational-hdi-v2' });
}
