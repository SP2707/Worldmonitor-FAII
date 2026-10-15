import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { listSheets, readSheet } from '../scripts/subnational/_xlsx.mjs';
import { parseCraSheet, createUkCraProvider, CRA_URL } from '../scripts/subnational/providers/uk-cra.mjs';
import { createStatCanFiscalProvider, latestFiscalByItem } from '../scripts/subnational/providers/statcan-fiscal.mjs';

const read = (f) => readFileSync(new URL(`./fixtures/${f}`, import.meta.url));

test('xlsx reader lists sheets and reads rows', () => {
  const b = read('uk_cra_chapter_a_sample.xlsx');
  assert.ok(listSheets(b).includes('A.1a'));
  assert.ok(readSheet(b, 'A.1a').length > 4);
});

test('UK CRA: newest year of the FIRST (money) block, not the per-cent/index block', () => {
  const b = read('uk_cra_chapter_a_sample.xlsx');
  const a = parseCraSheet(readSheet(b, 'A.1a'));
  assert.equal(a.year, 2025);
  assert.equal(a.values.get('GB-ENG'), 769898);
  assert.equal(a.values.get('GB-SCT'), 86328);
  const h = parseCraSheet(readSheet(b, 'A.1b'));
  assert.equal(h.values.get('GB-NIR'), 16116);
});

test('UK CRA provider: nations only, labelled as allocated spending', async () => {
  const fetchFn = async (u) => { assert.equal(String(u), CRA_URL); return new Response(read('uk_cra_chapter_a_sample.xlsx'), { status: 200 }); };
  const out = await createUkCraProvider().run({ fetchFn });
  const o = out.observations.find((x) => x.divisionId === 'GB-WLS' && x.metric === 'public_expenditure_identifiable_gbp_million');
  assert.equal(o.value, 48293);
  assert.match(o.note, /not a regional-government account/);
});

test('StatCan fiscal: newest flow values per province from real rows; stocks ignored', () => {
  const m = latestFiscalByItem(read('statcan_10100017_sample.csv').toString('utf8'));
  assert.equal(m.get('Revenue [1]').get('Ontario').value, 205479);
  assert.equal(m.get('Expense [2]').get('Quebec').value, 187760);
  assert.equal(m.get('Taxes [11]').get('Nunavut').value, 181);
  assert.equal(m.get('Revenue [1]').get('Ontario').year, 2024);
});

test('StatCan fiscal provider: metadata -> zip -> registry divisions', async () => {
  const fetchFn = async (u) => String(u).includes('getFullTableDownloadCSV')
    ? new Response(JSON.stringify({ status: 'SUCCESS', object: 'https://x/10100017-eng.zip' }), { status: 200 })
    : new Response(read('statcan_10100017_sample.zip'), { status: 200 });
  const out = await createStatCanFiscalProvider().run({ fetchFn, cacheDir: null });
  const rev = out.observations.filter((o) => o.metric === 'subnational_govt_revenue_cad_million');
  assert.equal(rev.length, 13);
  assert.equal(rev.find((o) => o.divisionId === 'CA-ON').value, 205479);
  assert.equal(rev.find((o) => o.divisionId === 'CA-ON').year, 2024);
  assert.match(rev[0].note, /excludes local governments/);
});

import { createRbiEstatesProvider } from '../scripts/subnational/providers/rbi-estates.mjs';

test('RBI e-STATES: newest ACTUAL only (never Revised/Budget), All States excluded', async () => {
  const p = createRbiEstatesProvider({ path: fileURLToPath(new URL('./fixtures/rbi_estates_sample.xlsx', import.meta.url)) });
  const { observations } = await p.run();
  const mh = observations.find((o) => o.divisionId === 'IN-MH' && o.metric === 'subnational_govt_revenue_inr_crore');
  assert.equal(mh.value, 430596.4617); // 2023-24 account; 2024-25 has only revised/budget
  assert.equal(mh.year, 2024);
  assert.ok(!observations.some((o) => /All States/.test(o.divisionId)));
  assert.ok(observations.some((o) => o.divisionId === 'IN-DL'));
  assert.equal(new Set(observations.map((o) => o.divisionId)).size, 3);
});

import { parseMurderTable, createNcrbMurderProvider } from '../scripts/subnational/providers/ncrb.mjs';

test('NCRB Table 2A.1: 36 states/UTs incl. the wrapped Daman & Diu label; values match the PDF', async () => {
  const rows = parseMurderTable(readFileSync(new URL('./fixtures/ncrb_table_2a1_excerpt.txt', import.meta.url), 'utf8'));
  assert.equal(rows.length, 36);
  assert.deepEqual(rows.find((r) => r.name === 'D&N Haveli and Daman & Diu'), { name: 'D&N Haveli and Daman & Diu', cases2022: 16, population_lakh: 12, rate: 1.3 });
  assert.equal(rows.find((r) => r.name === 'Maharashtra').rate, 1.8);
  const out = await createNcrbMurderProvider({ path: fileURLToPath(new URL('./fixtures/ncrb_2022_table_2A1_murder.csv', import.meta.url)) }).run();
  assert.equal(out.observations.length, 36);
  assert.equal(new Set(out.observations.map((o) => o.divisionId)).size, 36);
});
