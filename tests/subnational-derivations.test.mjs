// Tests: whole-table derivations (shares, per-capita), polite FRED provider, Eurostat rate mode,
// and the HDI / fiscal / rule-of-law / grp seeders end to end on fake sources.
import test from 'node:test';
import assert from 'node:assert/strict';

import { DIVISIONS, CATEGORIES } from '../scripts/subnational/_registry.mjs';
import { makeShareDeriveAll, makePerCapitaDeriveAll, emptyRecord } from '../scripts/subnational/_core.mjs';
import { resolveCode, indexRows, createEurostatProvider } from '../scripts/subnational/providers/eurostat.mjs';
import { createFredStateProvider, US_FIPS } from '../scripts/subnational/providers/fred-us-states.mjs';
import { collectCategory } from '../scripts/subnational/_run.mjs';

const NOW = Date.UTC(2026, 9, 1);
const noSleep = async () => {};
const blank = () => Object.fromEntries(DIVISIONS.map((d) => [d.id, emptyRecord(d)]));
const put = (divs, id, metric, o) => { divs[id].metrics[metric] = { scope: 'division', year: 2024, unit: 'USD million (current)', source: 'fred:X', ...o }; };

test('share derive: written only for countries where every listed division is comparable', () => {
  const divs = blank();
  const us = DIVISIONS.filter((d) => d.country === 'US');
  us.forEach((d, i) => put(divs, d.id, 'grp', { value: i === 0 ? 300 : 100 }));
  // Germany: one division missing -> no shares for DE at all
  DIVISIONS.filter((d) => d.country === 'DE').slice(1).forEach((d) => put(divs, d.id, 'grp', { value: 10, unit: 'MIO_EUR', source: 'eurostat:x' }));
  // France: units differ -> skipped
  DIVISIONS.filter((d) => d.country === 'FR').forEach((d, i) => put(divs, d.id, 'grp', { value: 10, unit: i ? 'MIO_EUR' : 'EUR', source: 'eurostat:x' }));
  makeShareDeriveAll({ from: { metric: 'grp' }, outMetric: 'share', note: 'n' })(divs, NOW, {});
  const total = 300 + 100 * (us.length - 1);
  assert.ok(Math.abs(divs[us[0].id].metrics.share.value - (300 / total) * 100) < 1e-9);
  const sum = us.reduce((a, d) => a + divs[d.id].metrics.share.value, 0);
  assert.ok(Math.abs(sum - 100) < 1e-9);
  assert.equal(divs['DE-BY'].metrics.share, undefined);
  assert.equal(divs['FR-IDF'].metrics.share, undefined);
  assert.equal(divs[us[0].id].metrics.share.method, 'derived');
});

test('share derive: removes a stale value when the inputs no longer qualify', () => {
  const divs = blank();
  divs['US-CA'].metrics.share = { value: 5, scope: 'division' };
  makeShareDeriveAll({ from: { metric: 'grp' }, outMetric: 'share', note: 'n' })(divs, NOW, {});
  assert.equal(divs['US-CA'].metrics.share, undefined);
});

test('share derive: sibling category as the source', () => {
  const sib = blank();
  DIVISIONS.filter((d) => d.country === 'IT').forEach((d) => put(sib, d.id, 'grp', { value: 50, unit: 'MIO_EUR', source: 'eurostat:n' }));
  const divs = blank();
  makeShareDeriveAll({ from: { category: 'grp', metric: 'grp' }, outMetric: 's', note: 'n' })(divs, NOW, { grp: { divisions: sib } });
  assert.ok(Math.abs(divs['IT-21'].metrics.s.value - 5) < 1e-9, 'IT has 20 divisions -> 5% each');
});

test('per-capita derive: currency from the unit, million expanded, year gap > 1 refused', () => {
  const divs = blank(); const pops = blank();
  put(divs, 'US-CA', 'grp', { value: 4000000, year: 2025 });                 // USD million
  put(pops, 'US-CA', 'population', { value: 40000000, unit: 'persons', year: 2025, source: 'fred:CAPOP' });
  put(divs, 'DE-BY', 'grp', { value: 700000, unit: 'MIO_EUR', year: 2023, source: 'eurostat:n' });
  put(pops, 'DE-BY', 'population', { value: 13000000, unit: 'persons', year: 2024, source: 'eurostat:n' });
  put(divs, 'FR-IDF', 'grp', { value: 1, unit: 'MIO_EUR', year: 2020, source: 'eurostat:n' });
  put(pops, 'FR-IDF', 'population', { value: 1, unit: 'persons', year: 2024, source: 'eurostat:n' });
  put(divs, 'JP-13', 'grp', { value: 1, unit: 'JPY million', year: 2024, source: 'wikidata' });
  put(pops, 'JP-13', 'population', { value: 1, unit: 'persons', year: 2024, source: 'wikidata' });
  makePerCapitaDeriveAll({ metric: 'grp', sibling: 'population', siblingMetric: 'population', outMetric: 'pc' })(divs, NOW, { population: { divisions: pops } });
  assert.equal(divs['US-CA'].metrics.pc.value, 100000);
  assert.equal(divs['US-CA'].metrics.pc.unit, 'USD per person');
  assert.ok(Math.abs(divs['DE-BY'].metrics.pc.value - (700000e6 / 13000000)) < 1e-6);
  assert.equal(divs['FR-IDF'].metrics.pc, undefined, 'years 4 apart');
  assert.equal(divs['JP-13'].metrics.pc, undefined, 'unknown currency');
});

test('eurostat rate mode: never sums children, never uses multi-code divisions', async () => {
  const idx = indexRows([{ geo: 'ITH1', time: '2024', value: 10 }, { geo: 'ITH2', time: '2024', value: 20 }]);
  assert.equal(resolveCode(idx, 'ITH', 4).value, 30, 'default mode sums');
  assert.equal(resolveCode(idx, 'ITH', 4, true), null, 'rate mode refuses');
  const js = (geos, vals) => ({ id: ['geo', 'time'], size: [geos.length, 1], dimension: { geo: { category: { index: Object.fromEntries(geos.map((g, i) => [g, i])) } }, time: { category: { index: { 2024: 0 } } } }, value: vals });
  const fetchFn = async () => new Response(JSON.stringify(js(['ITC1', 'ITH1', 'ITH2', 'DE2'], { 0: 83.7, 1: 85, 2: 84, 3: 81.9 })), { status: 200 });
  const { observations } = await createEurostatProvider({ dataset: 'x', metric: 'le', unit: 'years', rate: true }).run({ fetchFn });
  const ids = new Set(observations.map((o) => o.divisionId));
  assert.ok(ids.has('IT-21') && ids.has('DE-BY'));
  assert.ok(!ids.has('IT-32'), 'IT-32 is ITH1+ITH2: an average of two rates cannot be formed here');
});

const csv = (v) => `observation_date,X\n2023-01-01,${v - 1}\n2024-01-01,${v}\n`;

test('FRED provider: custom id function, FIPS table, 404 = not published, partial result kept on 403', async () => {
  assert.equal(Object.keys(US_FIPS).length, 51);
  const seen = [];
  const fetchFn = async (url) => {
    const id = new URL(url).searchParams.get('id'); seen.push(id);
    if (id === 'PPAATX48000A156NCEN') return new Response('nf', { status: 404 });
    if (seen.length > 10) return new Response('denied', { status: 403 });
    return new Response(csv(7), { status: 200 });
  };
  const p = createFredStateProvider({ metric: 'pov', idFn: (st, fips) => `PPAA${st}${fips}000A156NCEN`, unit: '%', label: 'l' });
  const res = await p.run({ fetchFn, sleep: noSleep });
  assert.ok(seen.includes('PPAAAL01000A156NCEN'));
  assert.equal(seen.length, 11, 'stops at the first 403, no hammering');
  assert.equal(res.observations.length, 10);
  assert.match(res.note, /FRED refused/);
  const all403 = createFredStateProvider({ metric: 'm', suffix: 'UR', unit: '%', label: 'l' });
  await assert.rejects(all403.run({ fetchFn: async () => new Response('x', { status: 403 }), sleep: noSleep }), /FRED refused/);
});

// ---- seeders end to end on fake sources --------------------------------------------------
function fetchFor(slugHost = []) {
  return async (url, init = {}) => {
    const u = String(url);
    if (slugHost.some((h) => u.includes(h))) return new Response('no', { status: 503 });
    if (u.includes('fred.stlouisfed.org')) return new Response(csv(2000), { status: 200 });
    if (u.includes('eurostat')) {
      const geos = ['DE2', 'ITC1', 'FRK', 'DE1'];
      return new Response(JSON.stringify({ id: ['geo', 'time'], size: [4, 1], dimension: { geo: { category: { index: Object.fromEntries(geos.map((g, i) => [g, i])) } }, time: { category: { index: { 2024: 0 } } } }, value: { 0: 81.9, 1: 83.7, 2: 83.9, 3: 80.5 } }), { status: 200 });
    }
    if (u.includes('query.wikidata.org')) return new Response(JSON.stringify({ results: { bindings: [] } }), { status: 200 });
    if (u.includes('api.worldbank.org')) return new Response(JSON.stringify([{ page: 1 }, [{ country: { id: 'US' }, date: '2023', value: 5 }]]), { status: 200 });
    return new Response('unexpected ' + u, { status: 404 });
  };
}
const load = (slug) => import(`../scripts/seed-subnational-${slug}.mjs`);

test('hdi: Eurostat components + FRED state components land at division scope with units and sources', async () => {
  const mod = await load('hdi');
  const p = await collectCategory({ slug: 'hdi', providers: mod.providers, fetchFn: fetchFor(), nowMs: NOW, sleep: noSleep, readKey: async () => null });
  const by = p.divisions['DE-BY'].metrics;
  assert.equal(by.life_expectancy_years.value, 81.9);
  assert.equal(by.life_expectancy_years.scope, 'division');
  assert.equal(p.divisions['IT-21'].metrics.tertiary_attainment_pct.value, 83.7);
  assert.equal(p.divisions['IT-32'].metrics.life_expectancy_years, undefined, 'two-region division not averaged');
  const ca = p.divisions['US-CA'].metrics;
  for (const m of ['personal_income_per_capita_usd', 'median_household_income_usd', 'bachelors_or_higher_pct', 'unemployment_rate_pct', 'poverty_rate_pct']) assert.equal(ca[m].value, 2000, m);
  assert.equal(ca.poverty_rate_pct.source, 'fred:PPAACA06000A156NCEN');
  assert.ok(p.coverage.total.ok >= 51 + 3);
});

test('rule-of-law: crime rates direct-only; no index is invented', async () => {
  const mod = await load('rule-of-law');
  const p = await collectCategory({ slug: 'rule-of-law', providers: mod.providers, fetchFn: fetchFor(), nowMs: NOW, sleep: noSleep, readKey: async () => null });
  assert.equal(p.divisions["DE-BY"].metrics.homicide_rate_per_100k.value, 81.9);
  assert.ok(!Object.keys(p.divisions['DE-BY'].metrics).some((m) => /index$/.test(m)));
  assert.equal(p.providers.find((r) => r.id === 'live:ucdp').ok, false, 'empty feed is reported, not faked');
});

test('fiscal + grp: shares and contribution index only from comparable sibling data', async () => {
  const grp = await load('grp');
  const g = await collectCategory({ slug: 'grp', providers: grp.providers, deriveAll: grp.deriveAll, siblings: grp.siblings, fetchFn: fetchFor(), nowMs: NOW, sleep: noSleep, readKey: async () => null });
  assert.ok(Math.abs(g.divisions['US-CA'].metrics.grp_share_of_country_pct.value - 100 / 51) < 1e-9, '51 equal states');
  assert.equal(g.divisions['US-CA'].metrics.grp_per_capita_derived, undefined, 'no population sibling -> no per-capita');

  const pop = await load('population');
  const p = await collectCategory({ slug: 'population', providers: pop.providers, derive: pop.derive, deriveAll: pop.deriveAll, fetchFn: fetchFor(), nowMs: NOW, sleep: noSleep });
  assert.ok(Math.abs(p.divisions['US-CA'].metrics.population_share_of_country_pct.value - 100 / 51) < 1e-9);

  const g2 = await collectCategory({ slug: 'grp', providers: grp.providers, deriveAll: grp.deriveAll, siblings: grp.siblings, fetchFn: fetchFor(), nowMs: NOW, sleep: noSleep, readKey: async (k) => (k === CATEGORIES.population.key ? p : null) });
  assert.equal(g2.divisions['US-CA'].metrics.grp_per_capita_derived.unit, 'USD per person');

  const fiscal = await load('fiscal');
  const f = await collectCategory({ slug: 'fiscal', providers: fiscal.providers, deriveAll: fiscal.deriveAll, siblings: fiscal.siblings, fetchFn: fetchFor(), nowMs: NOW, sleep: noSleep, readKey: async (k) => (k === CATEGORIES.grp.key ? g : k === CATEGORIES.population.key ? p : null) });
  const ca = f.divisions['US-CA'].metrics;
  assert.ok(Math.abs(ca.contribution_index.value - 1) < 1e-9);
  assert.match(ca.grp_share_of_country_pct.note, /PROXY/);
  assert.equal(ca.state_tax_collections_usd.value, 2000 * 1000, 'FRED thousands converted');
  assert.ok(Math.abs(ca.state_tax_share_of_country_pct.value - 100 / 51) < 1e-9);
  assert.equal(ca.state_tax_per_capita_usd.value, 1);
  assert.ok(Math.abs(ca.state_tax_pct_of_grp.value - 0.1) < 1e-9);
  assert.equal(f.divisions['JP-13'].metrics.grp_share_of_country_pct, undefined);
  assert.ok(f.coverage.total.ok >= 51);
});

test('hdi: every Eurostat query pins all extra dimensions (unemployment needs isced11=TOTAL)', async () => {
  const mod = await load('hdi');
  const urls = [];
  await collectCategory({ slug: 'hdi', providers: mod.providers.filter((p) => p.id.startsWith('eurostat')), fetchFn: async (u) => { urls.push(String(u)); return fetchFor()(u); }, nowMs: NOW, sleep: noSleep });
  const lfu = urls.find((u) => u.includes('lfst_r_lfu3rt'));
  assert.ok(lfu && lfu.includes('isced11=TOTAL'), lfu);
});

test('overpass: a failed preflight skips the per-division loop entirely (no 20-minute timeout burn)', async () => {
  const { createOverpassProvider, resetOverpassState } = await import('../scripts/subnational/providers/overpass.mjs');
  resetOverpassState();
  let calls = 0;
  const fetchFn = async () => { calls++; return new Response('down', { status: 504 }); };
  const p = createOverpassProvider({ id: 'osm:x', counts: [{ metric: 'm', filters: ['["a"="b"]'] }], markerMetric: 'm', batchSize: 40 });
  await assert.rejects(p.run({ fetchFn, sleep: noSleep, env: {} }), /preflight failed on every mirror/);
  assert.equal(calls, 5, 'one pass over the five mirrors, nothing more');
});

test('overpass: the mirror that answered is tried first next time', async () => {
  const { createOverpassProvider, resetOverpassState, OVERPASS_URLS } = await import('../scripts/subnational/providers/overpass.mjs');
  resetOverpassState();
  const seen = [];
  const good = OVERPASS_URLS[2];
  const fetchFn = async (url, init) => {
    seen.push(String(url));
    if (String(url) !== good) return new Response('down', { status: 504 });
    const q = decodeURIComponent(String(init.body).replace(/^data=/, ''));
    const n = (q.match(/out count/g) ?? []).length;
    return new Response(JSON.stringify({ elements: n ? Array.from({ length: n }, () => ({ type: 'count', tags: { total: '3' } })) : [{ type: 'node', id: 1 }] }), { status: 200 });
  };
  const p = createOverpassProvider({ id: 'osm:x', counts: [{ metric: 'm', filters: ['["a"="b"]'] }], markerMetric: 'm', batchSize: 2, delayMs: 0 });
  const res = await p.run({ fetchFn, sleep: noSleep, env: {}, previous: null });
  assert.equal(res.observations.length, 2);
  // preflight needed 3 tries (mirrors 0,1 fail, 2 answers); the 2 divisions then hit mirror 2 first each time
  assert.equal(seen.filter((u) => u === good).length, 3);
  assert.equal(seen.length, 5);
});
