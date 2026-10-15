#!/usr/bin/env node
// Usage: node scripts/extract-ncrb-murder.mjs <crime-in-india-2022-vol-1.pdf> [out.csv]   (needs `pdftotext` from poppler)
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { parseMurderTable, NAME_TO_ID } from './subnational/providers/ncrb.mjs';
const [pdf, out = 'docs/samples/national/ncrb_2022_table_2A1_murder.csv'] = process.argv.slice(2);
if (!pdf) { console.error('usage: extract-ncrb-murder.mjs <vol-1.pdf> [out.csv]'); process.exit(2); }
const text = execFileSync('pdftotext', ['-layout', pdf, '-'], { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 });
const rows = parseMurderTable(text);
const missing = Object.keys(NAME_TO_ID).filter((n) => !rows.some((r) => r.name === n));
if (rows.length !== 36 || missing.length) { console.error(`expected 36 rows, got ${rows.length}; missing: ${missing.join(', ')}`); process.exit(1); }
writeFileSync(out, ['state_ut,cases_2022,population_lakh,rate_per_lakh', ...rows.map((r) => `"${r.name}",${r.cases2022},${r.population_lakh},${r.rate}`)].join('\n') + '\n');
console.log(`wrote ${rows.length} rows to ${out}`);
