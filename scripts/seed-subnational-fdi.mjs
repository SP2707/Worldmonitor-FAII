#!/usr/bin/env node
// Subnational seeder 9/10 - Foreign Direct Investment (FDI) Inflow.
// No keyless subnational FDI source was verified. National World Bank/IMF-BoP context only.
import { createWorldBankProvider } from './subnational/providers/worldbank.mjs';
import { runCategorySeeder, isMainScript } from './subnational/_run.mjs';

export const SLUG = 'fdi';
export const providers = [
  createWorldBankProvider([
    { metric: 'fdi_net_inflow_usd_national', indicator: 'BX.KLT.DINV.CD.WD', unit: 'USD', label: 'FDI net inflows' },
    { metric: 'fdi_net_inflow_pct_gdp_national', indicator: 'BX.KLT.DINV.WD.GD.ZS', unit: '% of GDP', label: 'FDI net inflows' },
  ]),
];

if (isMainScript('seed-subnational-fdi.mjs')) {
  runCategorySeeder({ slug: SLUG, scriptUrl: import.meta.url, providers, sourceVersion: 'subnational-fdi-v1' });
}
