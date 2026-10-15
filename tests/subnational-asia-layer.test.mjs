// Mongolia (NSO PxWeb) and Malaysia (OpenDOSM) providers, tested against real responses saved on 2026-10-15
// (tests/fixtures/subnational-asia). The population totals used in the unit-check tests are synthetic and marked as such.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DIVISIONS, COUNTRIES, BY_ID } from '../scripts/subnational/_registry.mjs';
import { fetchTable, placeRows, createMongoliaPxProvider, createMongoliaGrpProvider, tableUrl } from '../scripts/subnational/providers/pxweb-mongolia.mjs';
import { latestStateGdp, createDosmGdpProvider } from '../scripts/subnational/providers/dosm-malaysia.mjs';
import { buildCurlArgs } from '../scripts/subnational/_curl.mjs';

const FX = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'subnational-asia');
const read = (f) => readFileSync(join(FX, f), 'utf8').replace(/^﻿/, '');
const meta = (id) => JSON.parse(read(`${id}.json`));

/** Fake PxWeb server: GET -> saved metadata; POST -> saved data when we have it, else a synthetic table built from the metadata. */
function pxFetch({ synthetic = () => 1, overrides = {} } = {}) {
  const calls = [];
  const fn = async (url, init = {}) => {
    const id = /(DT_NSO_[A-Za-z0-9_]+)\.px/.exec(url)[1];
    calls.push({ id, method: init.method ?? 'GET' });
    if (!init.method || init.method === 'GET') return new Response(read(`${id}.json`), { status: 200 });
    if (overrides[id]) return new Response(JSON.stringify(overrides[id](JSON.parse(init.body))), { status: 200 });
    try { return new Response(read(`data-${id}.json`), { status: 200 }); } catch { /* no saved data: synthetic */ }
    const m = meta(id);
    const q = JSON.parse(init.body).query;
    const regionVar = m.variables.find((v) => v.text === 'Region');
    const yearCodes = q.find((x) => x.code !== regionVar.code).selection.values;
    const data = [];
    for (const rc of regionVar.values) for (const yc of yearCodes) data.push({ key: [rc, yc], values: [String(synthetic(rc, yc))] });
    return new Response(JSON.stringify({ columns: [{ code: regionVar.code }, { code: 'Он' }, { code: 'v' }], data }), { status: 200 });
  };
  fn.calls = calls;
  return fn;
}

test('asia layer: 22 Mongolian + 16 Malaysian divisions with ISO 3166-2 ids and a source label', () => {
  const asia = DIVISIONS.filter((d) => d.layer === 'asia-official');
  assert.equal(asia.length, 38);
  assert.equal(asia.filter((d) => d.country === 'MN').length, 22);
  assert.equal(asia.filter((d) => d.country === 'MY').length, 16);
  assert.ok(asia.every((d) => d.id.startsWith(`${d.country}-`) && d.srcName && BY_ID.get(d.id) === d));
  assert.ok(COUNTRIES.includes('MN') && COUNTRIES.includes('MY'));
  assert.equal(new Set(asia.map((d) => d.srcName)).size, 38);
});

test('Mongolia: GDP table (real response) fills all 22 divisions by name, newest year, groups and total excluded', async () => {
  const rows = await fetchTable(pxFetch(), 'National accounts', 'DT_NSO_0500_007V1');
  const placed = placeRows(rows);
  assert.equal(placed.size, 22);
  assert.deepEqual(placed.get('MN-1'), { value: 62846257.1, year: 2025, code: '711' }, 'Ulaanbaatar uses the 3-digit row, not the region group');
  assert.equal(placed.get('MN-073').value, 1134648.9);
  assert.equal(placed.get('MN-073').year, 2025);
});

test('Mongolia: a table with an extra variable is refused (series would be mixed)', async () => {
  await assert.rejects(() => fetchTable(pxFetch(), 'Infrastructure, housing', 'DT_NSO_3500_001V1'), /refusing to mix series/);
});

test('Mongolia: matching is by NAME because the life-crimes table numbers aimags differently (Khuvsgul 262 there, 367 in GDP)', async () => {
  const f = pxFetch({ synthetic: (rc) => Number(rc) });
  const rows = await fetchTable(f, 'Justice and crime', 'DT_NSO_2300_021V1');
  const placed = placeRows(rows);
  assert.equal(placed.get('MN-041').code, '262');
  assert.equal(placed.get('MN-073').code, '265');
  assert.equal(placed.get('MN-1').code, '7', 'Ulaanbaatar exists only as the 1-digit row in this table');
  assert.equal(placed.size, 22, "the 'Other' row (511) is not a division and nothing is guessed for it");
  assert.ok(![...placed.values()].some((p) => p.code === '511'));
});

test('Mongolia: recorded crimes drops blank cells and non-division rows', async () => {
  const p = createMongoliaPxProvider({ id: 'mn-nso:recorded-crimes', folder: 'Justice and crime', table: 'DT_NSO_2300_003V_1', metric: 'recorded_crimes', unit: 'crimes' });
  const { observations } = await p.run({ fetchFn: pxFetch() });
  assert.ok(observations.length >= 20 && observations.length <= 22);
  assert.ok(observations.every((o) => o.scope === 'division' && o.metric === 'recorded_crimes' && o.year >= 2024 && o.value >= 0));
  assert.ok(observations.every((o) => o.sourceUrl === tableUrl('Justice and crime', 'DT_NSO_2300_003V_1')));
});

test('Mongolia: HDI observations carry year 2024 and plausible 0-1 values', async () => {
  const p = createMongoliaPxProvider({ id: 'mn-nso:hdi', folder: 'Human development', table: 'DT_NSO_2700_001V1', metric: 'hdi', unit: 'index 0-1' });
  const { observations } = await p.run({ fetchFn: pxFetch() });
  assert.equal(observations.length, 22);
  assert.ok(observations.every((o) => o.year === 2024 && o.value > 0.5 && o.value < 1));
});

test('Mongolia: population table is checked globally (aimags and soums each add up to the national total), not by soum-code prefix (synthetic soum data)', async () => {
  const m = meta('DT_NSO_0300_002V4');
  const regionVar = m.variables.find((v) => v.text === 'Region');
  /** soums = 100 each; aimag = sum of the soums with its prefix, unless `moved` re-labels one soum under another aimag's prefix */
  const make = ({ moved = false, inflate = 0 } = {}) => () => {
    const soums = regionVar.values.filter((c) => c.length === 5).map((c) => ({ code: c, v: 100 }));
    const aimags = regionVar.values.filter((c) => c.length === 3).map((c) => ({ code: c, v: soums.filter((s) => s.code.startsWith(c)).length * 100 }));
    if (moved) { // one Arkhangai soum is coded under Bulgan's prefix but still counted in Arkhangai's aimag total
      const s = soums.find((x) => x.code.startsWith('165')); s.code = '363' + s.code.slice(3);
    }
    if (inflate) soums[0].v += inflate;
    const data = [...aimags, ...soums].map((r) => ({ key: [r.code, '2025'], values: [String(r.v)] }));
    data.push({ key: ['0', '2025'], values: [String(aimags.reduce((a, r) => a + r.v, 0))] });
    return { columns: [{ code: regionVar.code }, { code: 'Он' }, { code: 'v' }], data };
  };
  const spec = { id: 'mn-nso:pop', folder: 'Population and household', table: 'DT_NSO_0300_002V4', metric: 'population', unit: 'persons', checkChildren: true };
  const run = (opts) => createMongoliaPxProvider(spec).run({ fetchFn: pxFetch({ overrides: { DT_NSO_0300_002V4: make(opts) } }) });
  const ok = await run();
  assert.equal(ok.observations.length, 22);
  assert.equal(ok.note, undefined);
  // offsetting prefix mismatch (what the live data shows): all 22 are published and the gap is only reported
  const moved = await run({ moved: true });
  assert.equal(moved.observations.length, 22);
  assert.match(moved.note, /MN-073 -100/);
  assert.match(moved.note, /MN-067 \+100/);
  // a soum value that makes the soums disagree with the national total: nothing is published
  await assert.rejects(() => run({ inflate: 5000 }), /soum rows sum/);
});

test('Mongolia: blank year codes in the population metadata are skipped, only the selectable year is requested', async () => {
  const f = pxFetch();
  const bodies = [];
  const wrapped = async (url, init) => { if (init?.method === 'POST') bodies.push(JSON.parse(init.body)); return f(url, init); };
  await fetchTable(wrapped, 'Population and household', 'DT_NSO_0300_002V4');
  const yearSel = bodies[0].query[1].selection.values;
  assert.deepEqual(yearSel, ['2025']);
});

test('Mongolia GDP: unit check passes when GDP x 1000 / population matches GDP per capita (synthetic population total)', async () => {
  const gdpTot = 89937127.6; const pcTot = 26167.3;
  const popTotal = (gdpTot * 1000) / pcTot;
  const popOverride = () => ({ columns: [{ code: 'Бүс' }, { code: 'Он' }, { code: 'v' }], data: [{ key: ['0', '2025'], values: [String(popTotal)] }] });
  const p = createMongoliaGrpProvider();
  const { observations } = await p.run({ fetchFn: pxFetch({ overrides: { DT_NSO_0300_002V4: popOverride } }) });
  const grp = observations.filter((o) => o.metric === 'grp');
  const pc = observations.filter((o) => o.metric === 'grp_per_capita');
  assert.equal(grp.length, 22); assert.equal(pc.length, 22);
  assert.equal(grp[0].unit, 'MNT million'); assert.equal(pc[0].unit, 'MNT thousand');
  assert.match(grp[0].note, /unit verified/);
});

test('Mongolia GDP: publishes NOTHING when the unit check fails (population 3x too large)', async () => {
  const popOverride = () => ({ columns: [{ code: 'Бүс' }, { code: 'Он' }, { code: 'v' }], data: [{ key: ['0', '2025'], values: [String(3 * 89937127.6 * 1000 / 26167.3)] }] });
  await assert.rejects(() => createMongoliaGrpProvider().run({ fetchFn: pxFetch({ overrides: { DT_NSO_0300_002V4: popOverride } }) }), /unit check failed/);
});

test('Malaysia: newest year per state, Supra dropped, p0 verified as the sum of p1..p6', () => {
  const { levels, growth } = latestStateGdp(read('gdp_state_real_supply.sample.csv'));
  assert.ok(!levels.has('Supra'));
  assert.equal(levels.get('Johor').year, 2025);
  assert.ok(levels.get('Johor').value > 100000);
  assert.ok(growth.get('Johor').year === 2025 && Math.abs(growth.get('Johor').value) < 30);
  assert.ok(levels.has('W.P. Kuala Lumpur'));
});

test('Malaysia: a file where the sectors do not add up to p0 is refused', () => {
  const csv = read('gdp_state_real_supply.sample.csv').split('\n').map((l) => (/^abs,2025-01-01,Johor,p3,/.test(l) ? 'abs,2025-01-01,Johor,p3,1' : l)).join('\n');
  assert.throws(() => latestStateGdp(csv), /not the total/);
});

test('Malaysia provider: maps DOSM state labels to registry ids and states the unit', async () => {
  const fetchFn = async () => new Response(read('gdp_state_real_supply.sample.csv'), { status: 200 });
  const { observations } = await createDosmGdpProvider().run({ fetchFn });
  const johor = observations.find((o) => o.divisionId === 'MY-01' && o.metric === 'grp');
  assert.equal(johor.unit, 'MYR million (constant 2015 prices)');
  assert.ok(observations.some((o) => o.divisionId === 'MY-14' && o.metric === 'grp'), 'W.P. Kuala Lumpur -> MY-14');
  assert.ok(observations.every((o) => o.scope === 'division'));
});

test('curl args: a request body is sent as a POST from a file', () => {
  const a = buildCurlArgs('https://x', { outFile: 'o', bodyFile: 'b', headers: {} });
  assert.deepEqual(a.slice(a.indexOf('-X'), a.indexOf('-X') + 4), ['-X', 'POST', '--data-binary', '@b']);
  assert.ok(!buildCurlArgs('https://x', { outFile: 'o' }).includes('-X'));
});

// ---- Malaysia: more OpenDOSM state tables. CSV bodies below are SYNTHETIC (real column names from the API samples / crime head). ----
import { stateKey, createDosmPopulationProvider, createDosmHiesProvider, createDosmUnemploymentProvider, createDosmCrimeProvider } from '../scripts/subnational/providers/dosm-malaysia.mjs';

const MY_LABELS = ['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'W.P. Kuala Lumpur', 'W.P. Labuan', 'W.P. Putrajaya'];
const csvFetch = (map) => async (url) => {
  for (const [needle, body] of Object.entries(map)) if (url.includes(needle)) return new Response(body, { status: 200 });
  throw new Error(`unexpected url ${url}`);
};

test('stateKey: federal-territory labels match with or without the W.P. prefix', () => {
  assert.equal(stateKey('W.P. Kuala Lumpur'), stateKey('Kuala Lumpur'));
  assert.equal(stateKey('Wilayah Persekutuan Labuan'), stateKey('W.P. Labuan'));
  assert.notEqual(stateKey('Perak'), stateKey('Perlis'));
});

test('Malaysia population: thousands -> persons, common newest year, unit verified against the World Bank total (synthetic CSV)', async () => {
  const lines = ['state,date,sex,age,ethnicity,population'];
  for (const s of MY_LABELS) { lines.push(`${s},2024-01-01,both,overall,overall,2000`); lines.push(`${s},2024-01-01,both,0-4,overall,150`); lines.push(`${s},2023-01-01,both,overall,overall,1900`); }
  lines.push('Malaysia,2024-01-01,both,overall,overall,32000');
  const wb = JSON.stringify([{}, [{ country: { id: 'MY' }, date: '2024', value: 33_500_000 }]]);
  const fetchFn = csvFetch({ 'population_state.csv': lines.join('\n'), 'api.worldbank.org': wb });
  const { observations } = await createDosmPopulationProvider().run({ fetchFn });
  assert.equal(observations.length, 16);
  assert.ok(observations.every((o) => o.value === 2_000_000 && o.year === 2024 && o.unit === 'persons'), 'only the overall row of the newest year');
  // wrong unit (if the file were in persons already) is caught by the World Bank check
  const bad = csvFetch({ 'population_state.csv': lines.join('\n').replace(/,2000$/gm, ',2000000').replace('32000', '32000000'), 'api.worldbank.org': wb });
  await assert.rejects(() => createDosmPopulationProvider().run({ fetchFn: bad }), /unit check failed/);
  // states that do not add up to the national row
  const broken = csvFetch({ 'population_state.csv': lines.join('\n').replace('Malaysia,2024-01-01,both,overall,overall,32000', 'Malaysia,2024-01-01,both,overall,overall,40000'), 'api.worldbank.org': wb });
  await assert.rejects(() => createDosmPopulationProvider().run({ fetchFn: broken }), /not self-consistent/);
});

test('Malaysia HIES + unemployment: metrics, units, blank cells skipped (synthetic CSV)', async () => {
  const hies = ['date,state,gini,poverty,income_mean,income_median,expenditure_mean', ...MY_LABELS.map((s, i) => `2024-01-01,${s},0.35,${i === 0 ? '' : '4.5'},9000,7000,5000`), '2022-01-01,Johor,0.366,4.6,8517,6879,5342'].join('\n');
  const lfs = ['lf,date,state,p_rate,u_rate,lf_outside,lf_employed,lf_unemployed', ...MY_LABELS.map((s) => `1000,2025-10-01,${s},67,3.1,800,970,30`), '1000,2025-07-01,Johor,67,3.9,800,970,30'].join('\n');
  const h = (await createDosmHiesProvider().run({ fetchFn: csvFetch({ 'hies_state.csv': hies }) })).observations;
  assert.equal(h.filter((o) => o.metric === 'gini_index').length, 16);
  assert.equal(h.filter((o) => o.metric === 'poverty_incidence_pct').length, 15, 'blank poverty cell for Johor is skipped, not zero-filled');
  assert.ok(h.every((o) => o.year === 2024));
  assert.match(h.find((o) => o.metric === 'household_income_mean_monthly').unit, /inferred/);
  const u = (await createDosmUnemploymentProvider().run({ fetchFn: csvFetch({ 'lfs_qtr_state.csv': lfs }) })).observations;
  assert.equal(u.length, 16);
  assert.ok(u.every((o) => o.value === 3.1 && o.year === 2025 && o.metric === 'unemployment_rate_pct'));
});

test('Malaysia crime: state rows (district All), murder/violent/property counts; states must add up to the national row (synthetic CSV)', async () => {
  const head = 'state,district,category,type,date,crimes';
  const body = (murderNational) => {
    const l = [head];
    for (const s of MY_LABELS) { l.push(`${s},All,assault,murder,2023-01-01,10`); l.push(`${s},All,assault,all,2023-01-01,100`); l.push(`${s},All,property,all,2023-01-01,500`); l.push(`${s},Some District,assault,murder,2023-01-01,3`); }
    l.push(`Malaysia,All,assault,murder,2023-01-01,${murderNational}`, 'Malaysia,All,assault,all,2023-01-01,1600', 'Malaysia,All,property,all,2023-01-01,8000');
    return l.join('\n');
  };
  const { observations } = await createDosmCrimeProvider().run({ fetchFn: csvFetch({ 'crime_district.csv': body(160) }) });
  assert.equal(observations.length, 48);
  assert.ok(observations.filter((o) => o.metric === 'murder_count').every((o) => o.value === 10 && o.year === 2023));
  await assert.rejects(() => createDosmCrimeProvider().run({ fetchFn: csvFetch({ 'crime_district.csv': body(400) }) }), /not self-consistent/);
});
