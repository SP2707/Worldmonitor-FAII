#!/usr/bin/env node
// Subnational seeder 8/10 - Institutional Security & Rule of Law Index.
// No open subnational governance INDEX exists, so no index is invented. Measured security
// signals at division level:
//   Eurostat police-recorded crime per 100k (DE/FR/IT): homicide, robbery, burglary of residences
//   NCRB India murder rate per 100k (Crime in India 2022, Table 2A.1; IPC Sec.302)
//   UCDP armed-conflict events and deaths (all 15 countries, from the live feed, assigned by polygon;
//   lags months and is a capped slice, so only divisions with events carry values)
// National WGI / homicide context from the World Bank is repeated and labelled national.
import { createEurostatProvider } from './subnational/providers/eurostat.mjs';
import { createMongoliaPxProvider } from './subnational/providers/pxweb-mongolia.mjs';
import { createDosmCrimeProvider } from './subnational/providers/dosm-malaysia.mjs';
import { createNcrbMurderProvider } from './subnational/providers/ncrb.mjs';
import { createWorldBankProvider } from './subnational/providers/worldbank.mjs';
import { createLiveEventsProvider } from './subnational/providers/live-events.mjs';
import { seriesFor } from './subnational/providers/oecd-series.mjs';
import { runCategorySeeder, isMainScript } from './subnational/_run.mjs';

export const SLUG = 'rule-of-law';
const CRIME = (iccs, metric) => createEurostatProvider({
  dataset: 'crim_gen_reg', metric, unit: 'per 100,000 inhabitants (police recorded)', query: `iccs=${iccs}&unit=P_HTHAB`, rate: true, id: `eurostat:crim_gen_reg:${iccs}`,
});
export const providers = [
  CRIME('ICCS0101', 'homicide_rate_per_100k'),
  CRIME('ICCS0401', 'robbery_rate_per_100k'),
  CRIME('ICCS050211', 'residential_burglary_rate_per_100k'),
  createMongoliaPxProvider({ id: 'mn-nso:recorded-crimes', folder: 'Justice and crime', table: 'DT_NSO_2300_003V_1', metric: 'recorded_crimes', unit: 'crimes recorded in the year', note: 'NSO count of recorded crimes by aimag; not a rate' }),
  createMongoliaPxProvider({ id: 'mn-nso:crimes-against-life', folder: 'Justice and crime', table: 'DT_NSO_2300_021V1', metric: 'crimes_against_right_to_life', unit: 'crimes recorded in the year', note: 'NSO count (table title: crimes against the human right to life); matched by aimag name because this table numbers aimags differently' }),
  createDosmCrimeProvider(), // Malaysia: police-recorded murders, violent and property crime counts by state
  createNcrbMurderProvider(), // India: NCRB Crime in India 2022 Table 2A.1 (murder rate per lakh), 36 states/UTs
  createLiveEventsProvider('ucdp'),
  ...seriesFor('rule-of-law'), // OECD regional statistics (curl transport, see providers/oecd.mjs)
  createWorldBankProvider([
    { metric: 'rule_of_law_estimate_national', indicator: 'GOV_WGI_RL.EST', unit: 'z-score (-2.5..2.5)', label: 'WGI rule of law' },
    { metric: 'political_stability_estimate_national', indicator: 'GOV_WGI_PV.EST', unit: 'z-score (-2.5..2.5)', label: 'WGI political stability' },
    { metric: 'control_of_corruption_estimate_national', indicator: 'GOV_WGI_CC.EST', unit: 'z-score (-2.5..2.5)', label: 'WGI control of corruption' },
    { metric: 'govt_effectiveness_estimate_national', indicator: 'GOV_WGI_GE.EST', unit: 'z-score (-2.5..2.5)', label: 'WGI government effectiveness' },
    { metric: 'homicide_rate_national', indicator: 'VC.IHR.PSRC.P5', unit: 'per 100k', label: 'intentional homicides' },
  ]),
];

if (isMainScript('seed-subnational-rule-of-law.mjs')) {
  runCategorySeeder({ slug: SLUG, scriptUrl: import.meta.url, providers, sourceVersion: 'subnational-rule-of-law-v3' });
}
