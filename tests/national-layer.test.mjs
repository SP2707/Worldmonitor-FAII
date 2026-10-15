import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCountryList, parseIndicator, buildNational, depthScore, rankCountries } from '../scripts/national/_core.mjs';
import { collect } from '../scripts/seed-national.mjs';
import { ALL, INDICATORS, CATEGORY_ORDER } from '../scripts/national/indicators.mjs';

const countryBody = [{ page: 1 }, [
  { id: 'IND', iso2Code: 'IN', name: 'India', region: { id: 'SAS', value: 'South Asia' }, incomeLevel: { value: 'Lower middle income' } },
  { id: 'MLT', iso2Code: 'MT', name: 'Malta', region: { id: 'ECS', value: 'Europe & Central Asia' }, incomeLevel: { value: 'High income' } },
  { id: 'TUV', iso2Code: 'TV', name: 'Tuvalu', region: { id: 'EAS', value: 'East Asia & Pacific' }, incomeLevel: { value: 'Upper middle income' } },
  { id: 'WLD', iso2Code: '1W', name: 'World', region: { id: 'NA', value: 'Aggregates' }, incomeLevel: { value: 'Aggregates' } },
]];
const ind = (rows) => [{ page: 1 }, rows.map(([iso3, date, value]) => ({ countryiso3code: iso3, date: String(date), value }))];

test('country list drops aggregates; indicator parser keeps newest non-null, ignores nulls, throws on WB error body', () => {
  const c = parseCountryList(countryBody);
  assert.deepEqual([...c.keys()], ['IND', 'MLT', 'TUV']);
  const p = parseIndicator(ind([['IND', 2022, 5], ['IND', 2023, null], ['IND', 2021, 4], ['MLT', 2020, 1]]));
  assert.deepEqual(p.get('IND'), { value: 5, year: 2022 });
  assert.ok(!p.has('TUV'));
  assert.throws(() => parseIndicator([{ message: [{ id: '120', key: 'Invalid value', value: 'The provided parameter value is not valid' }] }]), /not valid/);
});

test('collect(): one failing indicator is reported, others kept', async () => {
  const iso = (i) => `${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + (Math.floor(i / 26) % 26))}${String.fromCharCode(65 + Math.floor(i / 676))}`;
  const list = Array.from({ length: 160 }, (_, i) => ({ id: iso(i), iso2Code: 'XX', name: `n${i}`, region: { id: 'X', value: 'r' }, incomeLevel: { value: 'i' } }));
  const fetchFn = async (url) => {
    const u = String(url);
    if (u.includes('/country?')) return new Response(JSON.stringify([{ page: 1 }, list]), { status: 200 });
    if (u.includes('LP.LPI.OVRL.XQ')) return new Response(JSON.stringify([{ message: [{ id: '175', key: 'Invalid format', value: 'The indicator was not found' }] }]), { status: 200 });
    return new Response(JSON.stringify(ind(list.slice(0, 100).map((c) => [c.id, 2023, 7]))), { status: 200 });
  };
  const n = await collect({ fetchFn, supplements: false });
  assert.equal(n.countryCount, 160);
  assert.equal(n.errors.length, 1);
  assert.match(n.errors[0], /LP\.LPI\.OVRL\.XQ/);
  assert.equal(Object.keys(n.countries[iso(0)].indicators).length, ALL.length - 1);
  assert.equal(Object.keys(n.countries[iso(150)].indicators).length, 0);
});

test('depth score: complete country 100, empty 0, stale values count half; ranking is stable and excludes given ISO3', () => {
  const countries = parseCountryList(countryBody);
  const byMetric = new Map();
  for (const { metric } of ALL) byMetric.set(metric, new Map([['MLT', { value: 1, year: 2023 }]]));
  byMetric.set('population', new Map([['IND', { value: 1, year: 2023 }], ['MLT', { value: 1, year: 2023 }]]));
  const n = buildNational({ countries, byMetric, nowMs: Date.UTC(2026, 9, 15) });
  const opts = { currentYear: 2026 };
  assert.equal(depthScore(n.countries.MLT, opts).score, 100);
  assert.equal(depthScore(n.countries.TUV, opts).score, 0);
  const old = structuredClone(n.countries.MLT); for (const k of Object.keys(old.indicators)) old.indicators[k].year = 2015;
  assert.equal(depthScore(old, opts).score, 50);
  const r = rankCountries(n, { exclude: new Set(['MLT']), currentYear: 2026 });
  assert.deepEqual(r.map((x) => x.iso3), ['IND', 'TUV']);
  assert.equal(r[0].rank, 1);
  assert.equal(CATEGORY_ORDER.length, 10);
  assert.ok(CATEGORY_ORDER.every((c) => INDICATORS[c].length >= 2));
});

import { NON_SOVEREIGN, tierOf } from '../scripts/national/_core.mjs';
test('territory list and tiers', () => {
  assert.equal(NON_SOVEREIGN.size, 22);
  assert.ok(!NON_SOVEREIGN.has('PSE') && !NON_SOVEREIGN.has('XKX'));
  assert.deepEqual([100, 90, 89.9, 70, 50, 49.9].map(tierOf), ['A', 'A', 'B', 'B', 'C', 'D']);
});

import { parseUndpCsv, parseImfSeries, attachSupplements } from '../scripts/national/supplements.mjs';

test('UNDP CSV: newest non-empty year per stem, aggregates dropped, quoted names ok', () => {
  const csv = 'iso3,country,hdicode,region,hdi_rank_2022,hdi_rank_2023,hdi_2022,hdi_2023,le_2022,le_2023\n'
    + 'AAA,"Alpha, Republic of",High,X,10,11,0.8,0.81,70,\n'
    + 'BBB,Beta,Low,Y,,,0.3,,50,51\n'
    + 'ZZA.VHHD,Very high,,,,,0.9,0.91,80,81\n';
  const m = parseUndpCsv(csv);
  assert.deepEqual([...m.keys()], ['AAA', 'BBB']);
  assert.equal(m.get('AAA').undp_hdi.value, 0.81);
  assert.equal(m.get('AAA').undp_life_expectancy.year, 2022); // 2023 empty -> falls back to 2022
  assert.equal(m.get('BBB').undp_hdi.year, 2022);
  assert.ok(!m.get('BBB').undp_hdi_rank);
  assert.throws(() => parseUndpCsv('<html>bot check</html>'), /unexpected header/);
});

test('IMF series: forecast years (>= projection-year) dropped; null skipped; missing code throws', () => {
  const body = { indicators: { NGDPD: { 'projection-year': 2026 } }, values: { NGDPD: { AAA: { 2024: 1, 2025: 2, 2026: 3, 2027: 4 }, BBB: { 2025: null, 2023: 5 } } } };
  const p = parseImfSeries(body, 'NGDPD');
  assert.deepEqual(p.get('AAA'), { value: 2, year: 2025 });
  assert.deepEqual(p.get('BBB'), { value: 5, year: 2023 });
  const noProj = { indicators: { rev: {} }, values: { rev: { AAA: { 2024: 9, 2026: 8 } } } };
  assert.deepEqual(parseImfSeries(noProj, 'rev', { nowYear: 2026 }).get('AAA'), { value: 9, year: 2024 });
  assert.throws(() => parseImfSeries({ values: {} }, 'NGDPD'), /no values/);
});

test('attachSupplements keeps sources separate from World Bank indicators and counts per metric', () => {
  const national = { countries: { AAA: { iso3: 'AAA', indicators: { gdp_usd: { value: 1 } } }, BBB: { iso3: 'BBB', indicators: {} } } };
  const undp = parseUndpCsv('iso3,country,hdicode,region,hdi_2023\nAAA,A,High,X,0.8\n');
  const imf = new Map([['imf_gdp_usd_bn', new Map([['AAA', { value: 2, year: 2025 }], ['ZZZ', { value: 9, year: 2025 }]])]]);
  const counts = attachSupplements(national, { undp, imf });
  assert.equal(national.countries.AAA.indicators.gdp_usd.value, 1);
  assert.equal(national.countries.AAA.supplements.imf_gdp_usd_bn.source, 'imf-datamapper:NGDPD');
  assert.deepEqual(national.countries.BBB.supplements, {});
  assert.equal(counts.undp_hdi, 1);
  assert.equal(counts.imf_gdp_usd_bn, 1);
});
