// The 391 first-level divisions of the 15 countries in top_15_countries_states_list.md (the md has 392 entries only
// because "Adygea" is listed twice), plus the NUTS 2 regions of 31 further Eurostat-covered countries, plus Mongolia and
// Malaysia (layer 'asia-official', ISO 3166-2 ids), plus the 10 analytic categories.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// When the MCP server's esbuild bundle inlines this module (api/mcp.js), import.meta.url points at the bundle, so the
// JSON files are looked up under the repo root too (WORLDMONITOR_ROOT, or the working directory the server starts from).
const own = dirname(fileURLToPath(import.meta.url));
const here = [own, process.env.WORLDMONITOR_ROOT && join(process.env.WORLDMONITOR_ROOT, 'scripts', 'subnational'), join(process.cwd(), 'scripts', 'subnational')]
  .filter(Boolean).find((d) => existsSync(join(d, 'divisions.json'))) ?? own;
const raw = JSON.parse(readFileSync(join(here, 'divisions.json'), 'utf8'));
// NUTS 2 regions of the other Eurostat-covered countries (layer 'eu-nuts2'); built by scripts/build-eu-nuts2-divisions.mjs.
const eu = JSON.parse(readFileSync(join(here, 'divisions-eu-nuts2.json'), 'utf8'));
// Mongolia + Malaysia (layer 'asia-official'): first non-European countries added from the Tier A source research.
const asia = JSON.parse(readFileSync(join(here, 'divisions-asia-official.json'), 'utf8'));

/** @type {ReadonlyArray<{id:string,country:string,countryName:string,name:string,nuts?:string|string[]}>} */
export const CORE_DIVISION_COUNT = raw.divisions.length;
export const DIVISIONS = Object.freeze([...raw.divisions, ...eu.divisions, ...asia.divisions]);
/** Divisions that exist only in the Eurostat NUTS 2 layer: their ids are NUTS-based, not ISO 3166-2, so ISO-keyed providers (Wikidata, Overpass) skip them. */
export const isEuLayer = (d) => d.layer === 'eu-nuts2';
/** Any division outside the 391-division core (EU NUTS 2 or asia-official). ISO-keyed and polygon-based providers skip these so they are never zero-filled falsely; the core providers were built and tested for the core list only. */
export const isExtraLayer = (d) => d.layer != null;
export const DIVISION_COUNT = DIVISIONS.length;
export const BY_ID = new Map(DIVISIONS.map((d) => [d.id, d]));
export const COUNTRIES = Object.freeze([...new Set(DIVISIONS.map((d) => d.country))]);

export const CATEGORIES = Object.freeze({
  grp:            { title: 'Gross Regional Product (GRP)',                        key: 'subnational:grp:v1' },
  fiscal:         { title: 'Fiscal Autonomy & Revenue Contribution',              key: 'subnational:fiscal:v1' },
  population:     { title: 'Population Size and Demographic Dividend',            key: 'subnational:population:v1' },
  infrastructure: { title: 'Critical Infrastructure Density',                     key: 'subnational:infrastructure:v1' },
  energy:         { title: 'Energy and Strategic Resource Sufficiency',           key: 'subnational:energy:v1' },
  hdi:            { title: 'Human Development Index (HDI)',                       key: 'subnational:hdi:v1' },
  patents:        { title: 'Innovation & High-Tech Patent Output',                key: 'subnational:patents:v1' },
  'rule-of-law':  { title: 'Institutional Security & Rule of Law Index',          key: 'subnational:rule-of-law:v1' },
  fdi:            { title: 'Foreign Direct Investment (FDI) Inflow',              key: 'subnational:fdi:v1' },
  military:       { title: 'Geostrategic and Military Footprint',                 key: 'subnational:military:v1' },
});
export const CATEGORY_COUNT = Object.keys(CATEGORIES).length;
export const TOTAL_CELLS = DIVISION_COUNT * CATEGORY_COUNT;
