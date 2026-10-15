#!/usr/bin/env node
// Ranks the countries NOT already in the subnational layer by national data depth. Reads national:indicators:v1 from Redis
// (run scripts/seed-national.mjs first). Writes docs/NATIONAL_RANKING.csv and prints the table.
// Usage: node scripts/national-ranking.mjs [--top N] [--all] [--with-territories]
//   default: the 180 sovereign countries not in the subnational layer; --all adds those 15; --with-territories adds the 22 territories
import { writeFileSync } from 'node:fs';
import { readCanonicalValue, loadEnvFile } from './_seed-utils.mjs';
import { COUNTRIES } from './subnational/_registry.mjs';
import { rankCountries, NON_SOVEREIGN } from './national/_core.mjs';
import { CATEGORY_ORDER } from './national/indicators.mjs';

loadEnvFile(import.meta.url);
const args = process.argv.slice(2);
const top = Number(args[args.indexOf('--top') + 1]) || null;
const national = await readCanonicalValue('national:indicators:v1');
if (!national?.countries) { console.error('national:indicators:v1 not found - run: node scripts/seed-national.mjs'); process.exit(1); }
const iso2 = new Set(COUNTRIES); // every country with divisions in the registry (core 15 + Eurostat NUTS 2 layer)
const covered = new Set(Object.values(national.countries).filter((c) => iso2.has(c.iso2)).map((c) => c.iso3));
const exclude = new Set([...(args.includes('--all') ? [] : covered), ...(args.includes('--with-territories') ? [] : NON_SOVEREIGN)]);
const rows = rankCountries(national, { exclude });
const header = ['rank', 'iso3', 'country', 'region', 'income', 'score', 'tier', 'indicators', 'avg_data_year', ...CATEGORY_ORDER];
const csv = [header.join(','), ...rows.map((r) => [r.rank, r.iso3, `"${r.name}"`, `"${r.region ?? ''}"`, `"${r.income ?? ''}"`, r.score.toFixed(1), r.tier, `${r.filled}/${r.total}`, r.avgYear.toFixed(1), ...CATEGORY_ORDER.map((c) => Math.round(r.perCategory[c] * 100))].join(','))];
writeFileSync('docs/NATIONAL_RANKING.csv', csv.join('\n') + '\n');
for (const r of (top ? rows.slice(0, top) : rows)) console.log(`${String(r.rank).padStart(3)}  ${r.iso3}  ${r.tier}  ${r.score.toFixed(1).padStart(5)}  ${String(r.filled).padStart(2)}/${r.total}  ${r.avgYear.toFixed(1)}  ${r.name}`);
const tiers = rows.reduce((m, r) => ({ ...m, [r.tier]: (m[r.tier] ?? 0) + 1 }), {});
console.log(`\ntiers: ${JSON.stringify(tiers)}`);
console.log(`${rows.length} countries ranked${args.includes('--all') ? '' : ` (excluding the ${covered.size} already covered subnationally)`}; errors while loading: ${national.errors.length ? national.errors.join(' | ') : 'none'}`);
console.log('wrote docs/NATIONAL_RANKING.csv');
