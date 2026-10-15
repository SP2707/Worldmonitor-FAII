#!/usr/bin/env node
// Subnational seeder 7/10 - Innovation & High-Tech Patent Output.
// Division level: Eurostat EPO applications (DE/FR/IT only). Other countries: WB national context.
import { createEurostatProvider } from './subnational/providers/eurostat.mjs';
import { createWorldBankProvider } from './subnational/providers/worldbank.mjs';
import { seriesFor } from './subnational/providers/oecd-series.mjs';
import { runCategorySeeder, isMainScript } from './subnational/_run.mjs';

export const SLUG = 'patents';
export const providers = [
  createEurostatProvider({ dataset: 'pat_ep_rtot', metric: 'epo_patent_applications', unit: 'applications', query: 'unit=NR', leafLength: 5 }),
  createEurostatProvider({ dataset: 'pat_ep_rtec', metric: 'epo_hightech_patent_applications', unit: 'applications', query: 'unit=NR&ipc=HT', leafLength: 5 }),
  // Regional R&D intensity is far more current than the EPO patent tables (which stop in 2012).
  createEurostatProvider({ dataset: 'rd_e_gerdreg', metric: 'rnd_expenditure_pct_grp', unit: '% of regional GDP', query: 'sectperf=TOTAL&unit=PC_GDP', rate: true }),
  ...seriesFor('patents'), // OECD regional statistics (curl transport, see providers/oecd.mjs)
  createWorldBankProvider([
    { metric: 'patent_applications_residents_national', indicator: 'IP.PAT.RESD', unit: 'applications', label: 'patent applications, residents' },
    { metric: 'patent_applications_nonresidents_national', indicator: 'IP.PAT.NRES', unit: 'applications', label: 'patent applications, nonresidents' },
    { metric: 'rnd_pct_gdp_national', indicator: 'GB.XPD.RSDV.GD.ZS', unit: '% of GDP', label: 'R&D expenditure' },
    { metric: 'hightech_exports_pct_national', indicator: 'TX.VAL.TECH.MF.ZS', unit: '% of manufactured exports', label: 'high-tech exports' },
  ]),
];

if (isMainScript('seed-subnational-patents.mjs')) {
  runCategorySeeder({ slug: SLUG, scriptUrl: import.meta.url, providers, sourceVersion: 'subnational-patents-v2' });
}
