#!/usr/bin/env node
// Builds scripts/subnational/divisions-eu-nuts2.json: the NUTS 2 regions of every Eurostat-covered country that is NOT
// already in divisions.json (DE, FR, IT are, at NUTS 1/2 level; GB is, as 4 nations). Source: the region list of Eurostat's
// nama_10r_2gdp (GDP by NUTS 2 region), saved by scripts/probe-eurostat-regional.mjs. Extra-Regio rows (…ZZ) are dropped.
// Eurostat's own country codes differ from ISO for Greece (EL) and the UK (UK); the registry uses ISO 3166-1 alpha-2.
// Usage: node scripts/build-eu-nuts2-divisions.mjs [path-to-nama_10r_2gdp.json]
import { readFileSync, writeFileSync } from 'node:fs';
const src = process.argv[2] ?? 'docs/samples/national/probe/eurostat/nama_10r_2gdp.json';
const OUT = 'scripts/subnational/divisions-eu-nuts2.json';
const ALREADY = new Set(['DE', 'FR', 'IT', 'GB', 'UK']);
const ISO = { EL: 'GR', UK: 'GB' };
const names = new Intl.DisplayNames(['en'], { type: 'region' });
const js = JSON.parse(readFileSync(src, 'utf8'));
const label = js.dimension.geo.category.label;
const divisions = [];
for (const nuts of Object.keys(js.dimension.geo.category.index)) {
  if (!/^[A-Z]{2}[A-Z0-9]{2}$/.test(nuts) || nuts.endsWith('ZZ')) continue;
  const eu = nuts.slice(0, 2);
  const country = ISO[eu] ?? eu;
  if (ALREADY.has(eu) || ALREADY.has(country)) continue;
  divisions.push({ id: `${country}-${nuts}`, country, countryName: names.of(country), name: label[nuts], nuts, layer: 'eu-nuts2' });
}
divisions.sort((a, b) => a.id.localeCompare(b.id));
if (new Set(divisions.map((d) => d.id)).size !== divisions.length) throw new Error('duplicate ids');
writeFileSync(OUT, JSON.stringify({
  generatedFrom: 'Eurostat nama_10r_2gdp region list (NUTS 2021)',
  note: 'NUTS 2 regions of Eurostat-covered countries not in divisions.json. A single-region country appears as one XX00 region (the whole country). Region names are Eurostat\'s own labels (often in the local language).',
  count: divisions.length, divisions,
}, null, 1) + '\n');
const by = divisions.reduce((m, d) => ({ ...m, [d.country]: (m[d.country] ?? 0) + 1 }), {});
console.log(`wrote ${OUT}: ${divisions.length} regions, ${Object.keys(by).length} countries`, JSON.stringify(by));
