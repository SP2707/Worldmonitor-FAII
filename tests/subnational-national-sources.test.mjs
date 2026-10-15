import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { unzip } from '../scripts/subnational/_zip.mjs';
import { createStatCanGdpProvider, latestGdpByGeo, STATCAN_META_URL } from '../scripts/subnational/providers/statcan.mjs';
import { createDoseProvider, extractDose } from '../scripts/subnational/providers/dose.mjs';
import { parseCsv } from '../scripts/subnational/_csv.mjs';

const read = (f) => readFileSync(new URL(`./fixtures/${f}`, import.meta.url));

test('zip reader extracts a deflated entry from a real zip', () => {
  const files = unzip(read('statcan_36100222_sample.zip'));
  assert.ok(files.has('36100222.csv'));
  assert.match(files.get('36100222.csv').toString('utf8'), /REF_DATE/);
});

test('StatCan: newest current-price GDP per province from real rows; combined/aggregate geos excluded', () => {
  const by = latestGdpByGeo(read('statcan_36100222_sample.csv').toString('utf8'));
  assert.equal(by.get('Ontario').value, 1197020);
  assert.equal(by.get('Ontario').year, 2024);
  assert.equal(by.get('Quebec').value, 616771);
  assert.equal(by.get('Nunavut').value, 5668);
  assert.equal(by.has('Canada'), false);
  assert.equal(by.has('Outside Canada'), false);
  assert.equal(by.has('Northwest Territories including Nunavut'), false);
});

test('StatCan provider: WDS metadata -> zip -> registry divisions, CAD million, preliminary note', async () => {
  const urls = [];
  const fetchFn = async (u) => {
    urls.push(String(u));
    if (String(u) === STATCAN_META_URL) return new Response(JSON.stringify({ status: 'SUCCESS', object: 'https://www150.statcan.gc.ca/n1/tbl/csv/36100222-eng.zip' }), { status: 200 });
    return new Response(read('statcan_36100222_sample.zip'), { status: 200 });
  };
  const out = await createStatCanGdpProvider().run({ fetchFn, cacheDir: null, nowMs: Date.UTC(2026, 9, 14) });
  const by = Object.fromEntries(out.observations.map((o) => [o.divisionId, o]));
  assert.equal(by['CA-ON'].value, 1197020);
  assert.equal(by['CA-ON'].unit, 'CAD million (current prices)');
  assert.equal(by['CA-ON'].year, 2024);
  assert.match(by['CA-ON'].note, /preliminary/);
  assert.ok(by['CA-YT'] && by['CA-NT'] && by['CA-NU']);
  assert.equal(urls.length, 2);
});

test('StatCan provider fails loudly on an unexpected metadata answer', async () => {
  const fetchFn = async () => new Response(JSON.stringify({ status: 'FAILED', object: 'x' }), { status: 200 });
  await assert.rejects(createStatCanGdpProvider().run({ fetchFn, cacheDir: null }), /unexpected/);
});

test('DOSE: only configured countries, newest year per variable, never an empty value', () => {
  const rows = parseCsv(read('dose_v2_11_sample.csv').toString('utf8'));
  const got = extractDose(rows);
  const f = (id, v) => got.find((e) => e.divisionId === id && e.variable === v);
  assert.equal(f('UA-32', 'grp_lcu').year, 2019);
  assert.equal(f('UA-32', 'grp_lcu').value, 218737044966);
  assert.equal(f('UA-30', 'grp_lcu').year, 2014, 'Kyiv City total GRP is blank after 2014');
  assert.equal(f('UA-30', 'grp_pc_usd').year, 2019, 'per-capita series is newer for Kyiv City');
  assert.equal(got.some((e) => e.divisionId.startsWith('RU')), false, 'Russia is not configured');
});

test('DOSE provider: observations carry unit, source record and an explicit "not current" note', async () => {
  const fetchFn = async () => new Response(read('dose_v2_11_sample.csv'), { status: 200 });
  const out = await createDoseProvider().run({ fetchFn, cacheDir: null });
  const o = out.observations.find((x) => x.divisionId === 'UA-46' && x.metric === 'grp_lcu');
  assert.equal(o.value, 214000000000);
  assert.equal(o.unit, 'UAH (current prices)');
  assert.match(o.note, /not current/);
  assert.match(o.sourceUrl, /zenodo\.org\/records\/16313760/);
  assert.ok(out.observations.some((x) => x.metric === 'grp_per_capita_usd_market'));
});
