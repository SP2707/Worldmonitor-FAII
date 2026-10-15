#!/usr/bin/env node
// Subnational seeder 2/10 - Fiscal Autonomy & Revenue Contribution.
// No open source for sub-national budgets, own-source revenue or transfers was verified for these
// 15 countries, so FISCAL AUTONOMY is a stated gap. What IS computed (and labelled a PROXY for
// revenue contribution) is each division's economic weight:
//   grp_share_of_country_pct      share of the country's GRP (from the GRP seeder; only where all
//                                 divisions of the country share source, unit and year: US, DE, FR, IT)
//   population_share_of_country_pct   (from the population seeder)
//   contribution_index            GRP share / population share (>1 = produces more than its headcount)
//   US states only (FRED/Census, verified live for CA and TX): total state tax collections and
//   individual-income-tax collections (FRED publishes these in thousands of USD; converted), the
//   tax-to-GRP ratio, and tax per head - a measured fiscal-capacity signal, not 'autonomy' as such.
// plus national World Bank fiscal context labelled national.
import { createWorldBankProvider } from './subnational/providers/worldbank.mjs';
import { createFredStateProvider } from './subnational/providers/fred-us-states.mjs';
import { makeShareDeriveAll, makePerCapitaDeriveAll } from './subnational/_core.mjs';
import { createMongoliaPxProvider } from './subnational/providers/pxweb-mongolia.mjs';
import { createStatCanFiscalProvider } from './subnational/providers/statcan-fiscal.mjs';
import { createIsraelLocalAuthProvider } from './subnational/providers/israel-localauth.mjs';
import { createRbiEstatesProvider } from './subnational/providers/rbi-estates.mjs';
import { createUkCraProvider } from './subnational/providers/uk-cra.mjs';
import { seriesFor } from './subnational/providers/oecd-series.mjs';
import { runCategorySeeder, isMainScript } from './subnational/_run.mjs';
import { DIVISIONS } from './subnational/_registry.mjs';

export const SLUG = 'fiscal';
export const providers = [
  createFredStateProvider({ metric: 'state_tax_collections_usd', suffix: 'TOTLTAX', scale: 1000, unit: 'USD', label: 'Census state tax collections, total (FRED, thousands of USD x 1000)' }),
  createFredStateProvider({ metric: 'state_income_tax_collections_usd', suffix: 'INCTAX', scale: 1000, unit: 'USD', label: 'Census state individual income tax collections (FRED, thousands of USD x 1000); absent for states without one' }),
  ...seriesFor('fiscal'), // OECD REGOFI: regional-government revenue/expenditure for JP, KR, CA, DE, FR, IT
  createStatCanFiscalProvider(), // Canada provinces/territories, newest year (OECD REGOFI above ends 2021)
  createRbiEstatesProvider(), // India states: RBI e-STATES workbook (manual download; skipped with an error if absent)
  createMongoliaPxProvider({ id: 'mn-nso:local-government-revenue', folder: 'Government budget', table: 'DT_NSO_0800_031V1', metric: 'local_government_revenue', unit: 'MNT (the NSO table does not print its unit)', note: 'revenue of the aimag/capital local government, newest year; unit not stated by the table, do not compare across countries' }),
  createMongoliaPxProvider({ id: 'mn-nso:local-government-expenditure', folder: 'Government budget', table: 'DT_NSO_0800_029V1', metric: 'local_government_expenditure', unit: 'MNT (the NSO table does not print its unit)', note: 'expenditure of the aimag/capital local government, newest year; unit not stated by the table, do not compare across countries' }),
  createIsraelLocalAuthProvider(), // Israel districts: SUM of municipal budgets (labelled), 2024 audited statements
  createUkCraProvider(), // UK nations: public spending ALLOCATED to the nation (different measure, labelled)
  createWorldBankProvider([
    { metric: 'govt_revenue_pct_gdp_national', indicator: 'GC.REV.XGRT.GD.ZS', unit: '% of GDP', label: 'central govt revenue excl. grants' },
    { metric: 'tax_revenue_pct_gdp_national', indicator: 'GC.TAX.TOTL.GD.ZS', unit: '% of GDP', label: 'tax revenue' },
    { metric: 'govt_expense_pct_gdp_national', indicator: 'GC.XPN.TOTL.GD.ZS', unit: '% of GDP', label: 'central govt expense' },
  ]),
];
export const siblings = ['grp', 'population'];

const taxShare = makeShareDeriveAll({ from: { metric: 'state_tax_collections_usd' }, outMetric: 'state_tax_share_of_country_pct', note: 'share of the sum of the 51 US divisions\' state tax collections (same source, unit, year)' });
const taxPerCapita = makePerCapitaDeriveAll({ metric: 'state_tax_collections_usd', sibling: 'population', siblingMetric: 'population', outMetric: 'state_tax_per_capita_usd' });
const shareOfGrp = makeShareDeriveAll({
  from: { category: 'grp', metric: 'grp' }, outMetric: 'grp_share_of_country_pct',
  note: 'PROXY for revenue contribution: share of the sum of the country\'s listed divisions (same source, unit, year)',
});
export function deriveAll(divisions, nowMs, sib = {}) {
  shareOfGrp(divisions, nowMs, sib);
  taxShare(divisions, nowMs, sib);
  taxPerCapita(divisions, nowMs, sib);
  for (const d of DIVISIONS) {
    const rec = divisions[d.id];
    delete rec.metrics.population_share_of_country_pct;
    delete rec.metrics.contribution_index;
    delete rec.metrics.state_tax_pct_of_grp;
    const tax = rec.metrics.state_tax_collections_usd;
    const grp = sib.grp?.divisions?.[d.id]?.metrics?.grp;
    if (tax?.scope === 'division' && grp?.scope === 'division' && /USD/.test(grp.unit ?? '') && /million/i.test(grp.unit) && grp.value > 0 && Math.abs(Number(tax.year) - Number(grp.year)) <= 1) {
      rec.metrics.state_tax_pct_of_grp = {
        value: (tax.value / (grp.value * 1e6)) * 100, unit: '% of GRP', year: tax.year ?? null, source: 'derived:state_tax_collections_usd/grp', sourceUrl: null,
        scope: 'division', method: 'derived', note: `DERIVED: state tax collections (${tax.year}) / GRP (${grp.year}); state-level taxes only, local taxes excluded`, rank: 0, fetchedAt: nowMs,
      };
    }
    const popShare = sib.population?.divisions?.[d.id]?.metrics?.population_share_of_country_pct;
    if (popShare?.scope === 'division') {
      rec.metrics.population_share_of_country_pct = { ...popShare, rank: 0, fetchedAt: nowMs };
    }
    const g = rec.metrics.grp_share_of_country_pct;
    if (g && popShare?.scope === 'division' && popShare.value > 0) {
      rec.metrics.contribution_index = {
        value: g.value / popShare.value, unit: 'ratio (1 = proportional)', year: g.year ?? null,
        source: 'derived:grp_share/population_share', sourceUrl: null, scope: 'division', method: 'derived',
        note: 'DERIVED proxy: GRP share / population share; vintages may differ', rank: 0, fetchedAt: nowMs,
      };
    }
  }
}

if (isMainScript('seed-subnational-fiscal.mjs')) {
  runCategorySeeder({ slug: SLUG, scriptUrl: import.meta.url, providers, deriveAll, siblings, budgetMs: 800_000, sourceVersion: 'subnational-fiscal-v3' });
}
