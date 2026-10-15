#!/usr/bin/env node
// Subnational seeder 1/10 - Gross Regional Product (GRP) for all 391 divisions.
// Sources (keyless): Eurostat NUTS tables (DE/FR/IT), Wikidata P2131/P2132, World Bank national GDP.
import { createEurostatProvider } from './subnational/providers/eurostat.mjs';
import { createFredStateProvider } from './subnational/providers/fred-us-states.mjs';
import { createOecdProvider, oecdSeries, GDP_FLOW_KEY } from './subnational/providers/oecd.mjs';
import { createStatCanGdpProvider } from './subnational/providers/statcan.mjs';
import { createDoseProvider } from './subnational/providers/dose.mjs';
import { createMongoliaGrpProvider } from './subnational/providers/pxweb-mongolia.mjs';
import { createDosmGdpProvider } from './subnational/providers/dosm-malaysia.mjs';
import { createWikidataProvider } from './subnational/providers/wikidata.mjs';
import { createWorldBankProvider } from './subnational/providers/worldbank.mjs';
import { makeShareDeriveAll, makePerCapitaDeriveAll } from './subnational/_core.mjs';
import { runCategorySeeder, isMainScript } from './subnational/_run.mjs';

export const SLUG = 'grp';
export const providers = [
  createEurostatProvider({ dataset: 'nama_10r_2gdp', metric: 'grp', unit: 'MIO_EUR', query: 'unit=MIO_EUR' }),
  createFredStateProvider({ metric: 'grp', suffix: 'NGSP', unit: 'USD million (current)', label: 'FRED/BEA nominal GDP by state' }),
  // OECD regional database: adds CA, CN, IN, JP, KR and Scotland/Wales/N. Ireland (DE/FR/IT/US already covered above).
  // Values are PPP-adjusted USD, so they are never mixed with nominal figures for the same country.
  createOecdProvider({ dataflow: 'DSD_REG_ECO@DF_GDP', metric: 'grp', unit: 'USD PPP million (current prices)', scale: 1e-6, id: 'oecd:regional-gdp', ...oecdSeries({ measure: 'GDP', prices: 'V', unit: 'USD_PPP', fallbackKeys: [GDP_FLOW_KEY] }) }),
  // Live check: Wikidata P2131 covers only ~48 of the 391 divisions (CN 30, CA 13, a few US/FR/GB) and P2132 none.
  createStatCanGdpProvider(), // Canada, newest year 2024 (OECD above carries older vintages in USD PPP)
  createMongoliaGrpProvider(), // Mongolia: NSO PxWeb, 21 aimags + Ulaanbaatar, newest year 2025; unit checked against population
  createDosmGdpProvider(), // Malaysia: OpenDOSM real GDP by state (constant 2015 prices)
  createDoseProvider(), // Ukraine only, series ends 2019 - labelled old on every observation
  createWikidataProvider([
    { metric: 'grp', prop: 'P2131', withUnit: true },
    { metric: 'grp_per_capita', prop: 'P2132', withUnit: true },
  ]),
  createWorldBankProvider([
    { metric: 'gdp_national_usd', indicator: 'NY.GDP.MKTP.CD', unit: 'USD', label: 'GDP, current US$' },
    { metric: 'gdp_per_capita_national_usd', indicator: 'NY.GDP.PCAP.CD', unit: 'USD', label: 'GDP per capita, current US$' },
  ]),
];

// Whole-table derivations: share of the country's GRP, and GRP per head (needs the population seeder).
export const siblings = ['population'];
const share = makeShareDeriveAll({ from: { metric: 'grp' }, outMetric: 'grp_share_of_country_pct', note: 'share of the sum of the country\'s listed divisions (same source, unit, year)' });
const perCapita = makePerCapitaDeriveAll({ metric: 'grp', sibling: 'population', siblingMetric: 'population', outMetric: 'grp_per_capita_derived' });
export function deriveAll(divisions, nowMs, sib) { share(divisions, nowMs, sib); perCapita(divisions, nowMs, sib); }

if (isMainScript('seed-subnational-grp.mjs')) {
  runCategorySeeder({ slug: SLUG, scriptUrl: import.meta.url, providers, deriveAll, siblings, sourceVersion: 'subnational-grp-v2' });
}
