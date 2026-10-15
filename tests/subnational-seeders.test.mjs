import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DIVISIONS, DIVISION_COUNT, COUNTRIES, CATEGORIES, CATEGORY_COUNT, TOTAL_CELLS } from '../scripts/subnational/_registry.mjs';
import { mergeObservations, deriveStatus, buildPayload, validatePayload, declareRecords, addRatio, makeDensityDerive } from '../scripts/subnational/_core.mjs';
import { mkdtempSync as __mkTmp } from 'node:fs';
import { tmpdir as __tmpdir } from 'node:os';
import { join as __join } from 'node:path';
// Never read or write the real OECD response cache (.cache/oecd) from tests.
process.env.OECD_CACHE_DIR = __mkTmp(__join(__tmpdir(), 'oecd-test-cache-'));
import { parseJsonStat, indexRows, resolveCode } from '../scripts/subnational/providers/eurostat.mjs';
import { parseWorldBank } from '../scripts/subnational/providers/worldbank.mjs';
import { parseMegawatts, summarizePlants, buildCountQuery, parseCounts, pickBatch } from '../scripts/subnational/providers/overpass.mjs';
import { pickLatest } from '../scripts/subnational/providers/wikidata.mjs';
import { collectCategory } from '../scripts/subnational/_run.mjs';

const SCRIPTS = join(dirname(fileURLToPath(import.meta.url)), '..', 'scripts');
const NOW = Date.UTC(2026, 9, 1);

test('registry: 391 core divisions in 15 countries + the Eurostat NUTS 2 layer + Mongolia and Malaysia, 10 categories', () => {
  const core = DIVISIONS.filter((d) => !d.layer);
  const eu = DIVISIONS.filter((d) => d.layer === 'eu-nuts2');
  const asia = DIVISIONS.filter((d) => d.layer === 'asia-official');
  assert.equal(core.length, 391);
  assert.equal(new Set(core.map((d) => d.country)).size, 15);
  assert.ok(eu.length >= 200 && new Set(eu.map((d) => d.country)).size === 31, `eu layer: ${eu.length}`);
  assert.equal(asia.length, 38);
  assert.equal(DIVISION_COUNT, core.length + eu.length + asia.length);
  assert.equal(new Set(DIVISIONS.map((d) => d.id)).size, DIVISION_COUNT);
  assert.equal(COUNTRIES.length, 48);
  assert.ok(eu.every((d) => /^[A-Z]{2}[A-Z0-9]{2}$/.test(d.nuts) && d.id === `${d.country}-${d.nuts}`), 'EU ids are COUNTRY-NUTS');
  assert.ok(!eu.some((d) => ['DE', 'FR', 'IT', 'GB'].includes(d.country)), 'DE/FR/IT/GB stay in the core layer only');
  assert.equal(CATEGORY_COUNT, 10);
  assert.equal(TOTAL_CELLS, DIVISION_COUNT * 10);
  const perCountry = Object.fromEntries(COUNTRIES.filter((c) => core.some((d) => d.country === c)).map((c) => [c, core.filter((d) => d.country === c).length]));
  assert.deepEqual(perCountry, { US: 51, CN: 33, RU: 83, GB: 4, DE: 16, KR: 17, FR: 18, JP: 47, SA: 13, IL: 6, AE: 7, IN: 36, CA: 13, UA: 27, IT: 20 });
});

test('exactly 10 seed-subnational-*.mjs scripts, one per category', () => {
  const files = readdirSync(SCRIPTS).filter((f) => /^seed-subnational-.*\.mjs$/.test(f)).sort();
  assert.deepEqual(files, Object.keys(CATEGORIES).map((s) => `seed-subnational-${s}.mjs`).sort());
});

test('mergeObservations: first provider wins within a run; worse rank cannot replace fresh better one', () => {
  const obs = [
    { divisionId: 'US-CA', metric: 'm', value: 1, source: 'a', scope: 'division', rank: 0 },
    { divisionId: 'US-CA', metric: 'm', value: 2, source: 'b', scope: 'division', rank: 1 },
  ];
  const first = mergeObservations({}, obs, NOW);
  assert.equal(first['US-CA'].metrics.m.value, 1);
  const later = mergeObservations(first, [{ divisionId: 'US-CA', metric: 'm', value: 9, source: 'b', scope: 'division', rank: 1 }], NOW + 86400_000);
  assert.equal(later['US-CA'].metrics.m.value, 1);
  const old = mergeObservations(first, [{ divisionId: 'US-CA', metric: 'm', value: 9, source: 'b', scope: 'division', rank: 1 }], NOW + 100 * 86400_000);
  assert.equal(old['US-CA'].metrics.m.value, 9);
});

test('status: national-only is never reported as ok', () => {
  assert.equal(deriveStatus({ metrics: {} }), 'no_source');
  assert.equal(deriveStatus({ metrics: { a: { scope: 'national' } } }), 'national_only');
  assert.equal(deriveStatus({ metrics: { a: { scope: 'national' }, b: { scope: 'division' } } }), 'ok');
});

test('buildPayload throws when every provider failed (keeps last-good)', () => {
  assert.throws(() => buildPayload({ category: 'x', title: 'x', previous: null, observations: [], reports: [{ id: 'p', ok: false, error: 'boom' }], nowMs: NOW }), /all providers failed/);
});

test('addRatio refuses mixed scope or zero denominator', () => {
  const rec = { metrics: { n: { value: 10, scope: 'division' }, d: { value: 0, scope: 'division' } } };
  addRatio(rec, { numerator: 'n', denominator: 'd', metric: 'r', unit: 'x', nowMs: NOW });
  assert.equal(rec.metrics.r, undefined);
  rec.metrics.d = { value: 5, scope: 'national' };
  addRatio(rec, { numerator: 'n', denominator: 'd', metric: 'r', unit: 'x', nowMs: NOW });
  assert.equal(rec.metrics.r, undefined);
  rec.metrics.d = { value: 5, scope: 'division' };
  addRatio(rec, { numerator: 'n', denominator: 'd', metric: 'r', unit: 'x', factor: 100, nowMs: NOW });
  assert.equal(rec.metrics.r.value, 200);
  assert.equal(rec.metrics.r.method, 'derived');
});

test('density derive ignores non-km2 area units and clears stale derived values', () => {
  const derive = makeDensityDerive(['c']);
  const rec = { metrics: { c: { value: 4, scope: 'division' }, area_km2: { value: 2, unit: 'hectare', scope: 'division' }, c_per_1000km2: { value: 1 } } };
  derive(rec, NOW);
  assert.equal(rec.metrics.c_per_1000km2, undefined);
  rec.metrics.area_km2.unit = 'square kilometre';
  derive(rec, NOW);
  assert.equal(rec.metrics.c_per_1000km2.value, 2000);
});

test('parseJsonStat + resolveCode: direct, sum_of_children, and refusal of unpinned dims', () => {
  const js = { id: ['geo', 'time'], size: [3, 2],
    dimension: { geo: { category: { index: { DE11: 0, DE12: 1, DE2: 2 } } }, time: { category: { index: { 2020: 0, 2021: 1 } } } },
    value: { 0: 10, 1: 11, 2: 20, 3: 21, 4: 100, 5: 101 } };
  const idx = indexRows(parseJsonStat(js));
  assert.deepEqual(resolveCode(idx, 'DE2'), { value: 101, year: '2021', method: 'direct' });
  const sum = resolveCode(idx, 'DE1', 4);
  assert.equal(sum.value, 32); assert.equal(sum.method, 'sum_of_children');
  assert.throws(() => parseJsonStat({ ...js, id: ['unit', 'geo', 'time'], size: [2, 3, 2] }), /unpinned/);
});

test('parseWorldBank keeps newest non-null per country', () => {
  const m = parseWorldBank([{}, [
    { country: { id: 'DE' }, date: '2022', value: 1 }, { country: { id: 'DE' }, date: '2023', value: 2 },
    { country: { id: 'DE' }, date: '2024', value: null }, { country: { id: 'FR' }, date: '2021', value: 5 }]]);
  assert.deepEqual(m.get('DE'), { value: 2, date: '2023' });
  assert.equal(m.get('FR').value, 5);
});

test('overpass helpers', () => {
  assert.equal(parseMegawatts('1.5 GW'), 1500); assert.equal(parseMegawatts('500 kW'), 0.5); assert.equal(parseMegawatts('abc'), null);
  const s = summarizePlants({ elements: [{ tags: { 'plant:output:electricity': '100 MW', 'plant:source': 'wind' } }, { tags: { 'plant:output:electricity': '2 MW' } }, { tags: {} }] });
  assert.equal(s.total.mw, 102); assert.equal(s.total.count, 2); assert.equal(s.bySource.wind, 100); assert.equal(s.bySource.other, 2);
  const q = buildCountQuery('US-CA', [['["a"="b"]'], ['["c"="d"]', '["e"="f"]']]);
  assert.match(q, /area\["ISO3166-2"="US-CA"\]/);
  assert.equal((q.match(/out count/g) ?? []).length, 2);
  assert.deepEqual(parseCounts({ elements: [{ type: 'count', tags: { total: '3' } }, { type: 'node' }, { type: 'count', tags: { total: '0' } }] }), [3, 0]);
  const prev = { 'US-CA': { metrics: { m: { fetchedAt: 5 } } } };
  assert.notEqual(pickBatch(prev, 'm', 1)[0].id, 'US-CA');
});

test('wikidata pickLatest prefers newest point-in-time', () => {
  const m = pickLatest([
    { code: { value: 'X' }, v: { value: '1' }, t: { value: '2019-01-01' } },
    { code: { value: 'X' }, v: { value: '2' }, t: { value: '2022-01-01' } },
    { code: { value: 'X' }, v: { value: '3' } }], 'code');
  assert.equal(m.get('X').v, 2);
});

// ---- end-to-end with a routed fake fetch --------------------------------------------
function fakeFetch(failHosts = []) {
  return async (url, init = {}) => {
    const u = String(url);
    if (failHosts.some((h) => u.includes(h))) return new Response('nope', { status: 503 });
    const json = (o) => new Response(JSON.stringify(o), { status: 200, headers: { 'content-type': 'application/json' } });
    if (u.includes('query.wikidata.org')) {
      const q = decodeURIComponent(String(init.body).replace(/^query=/, ''));
      if (q.includes('wdt:P297')) return json({ results: { bindings: [{ cc: { value: 'US' }, item: { value: 'http://www.wikidata.org/entity/Q30' }, v: { value: '0.92' }, t: { value: '2022-01-01T00:00:00Z' } }] } });
      const prop = /p:(P\d+)/.exec(q)[1];
      const val = { P1082: '39000000', P2131: '3000000000000', P1081: '0.9', P2046: '423970' }[prop] ?? '1';
      return json({ results: { bindings: [{ code: { value: 'US-CA' }, item: { value: 'http://www.wikidata.org/entity/Q99' }, v: { value: val }, t: { value: '2021-01-01T00:00:00Z' }, ul: { value: prop === 'P2046' ? 'square kilometre' : 'United States dollar' } }] } });
    }
    if (u.includes('api.worldbank.org')) {
      const rows = COUNTRIES.map((c) => ({ country: { id: c }, date: '2023', value: 7 }));
      return json([{ page: 1 }, rows]);
    }
    if (u.includes('fred.stlouisfed.org')) {
      return new Response('observation_date,X\n2023-01-01,1000\n2024-01-01,2000\n', { status: 200 });
    }
    if (u.includes('eurostat')) {
      return json({ id: ['geo', 'time'], size: [1, 1], dimension: { geo: { category: { index: { DE2: 0 } } }, time: { category: { index: { 2022: 0 } } } }, value: { 0: 777 } });
    }
    if (u.includes('ourairports-data')) {
      const head = 'id,ident,type,name,latitude_deg,longitude_deg,iso_country,iso_region,scheduled_service,iata_code';
      const pad = Array.from({ length: 1200 }, (_, i) => `${i},P${i},small_airport,Pad ${i},0,0,ZZ,ZZ-1,no,`);
      return new Response([head, ...pad, '9,KLAX,large_airport,Los Angeles Intl,33.94,-118.4,US,US-CA,yes,LAX', '10,KEDW,small_airport,Edwards Air Force Base,34.9,-117.9,US,US-CA,no,'].join('\n'), { status: 200 });
    }
    if (u.includes('global-power-plant-database')) {
      const head = 'country,name,capacity_mw,latitude,longitude,primary_fuel,estimated_generation_gwh_2017';
      const pad = Array.from({ length: 1200 }, (_, i) => `ZZZ,p${i},1,0,0,Gas,`);
      return new Response([head, ...pad, 'USA,LA Gas,1000,34.05,-118.24,Gas,5000'].join('\n'), { status: 200 });
    }
    if (u.includes('overpass')) {
      const q = decodeURIComponent(String(init.body).replace(/^data=/, ''));
      if (q.includes('"power"="plant"')) return json({ elements: [{ tags: { 'plant:output:electricity': '1 GW', 'plant:source': 'gas' } }] });
      const n = (q.match(/out count/g) ?? []).length;
      return json({ elements: Array.from({ length: n }, (_, i) => ({ type: 'count', tags: { total: String(i + 1) } })) });
    }
    return new Response('unexpected ' + u, { status: 404 });
  };
}
const noSleep = async () => {};
const FAKE_KEYS = {
  'seismology:earthquakes:v1': { earthquakes: [{ location: { longitude: -118.24, latitude: 34.05 }, magnitude: 4.8, occurredAt: NOW }] },
  'wildfire:fires:v1': { fireDetections: [{ location: { longitude: -118.24, latitude: 34.05 }, frp: 10, confidence: 'FIRE_CONFIDENCE_HIGH', detectedAt: NOW }] },
  'conflict:ucdp-events:v1': { events: [{ location: { longitude: 30.52, latitude: 50.45 }, deathsBest: 4, dateStart: NOW }] },
};
const readKey = async (k) => FAKE_KEYS[k] ?? null;

async function load(slug) { return import(`../scripts/seed-subnational-${slug}.mjs`); }

test('all 10 seeders build a valid payload covering every registered division from fake sources', async () => {
  for (const slug of Object.keys(CATEGORIES)) {
    const mod = await load(slug);
    const payload = await collectCategory({ slug, providers: mod.providers, derive: mod.derive, fetchFn: fakeFetch(), nowMs: NOW, sleep: noSleep, readKey, env: { SUBNATIONAL_OSM_BATCH: '2' } });
    assert.ok(validatePayload(payload), slug);
    assert.equal(payload.category, slug);
    assert.equal(Object.keys(payload.divisions).length, DIVISION_COUNT);
    assert.ok(declareRecords(payload) > 0, `${slug} has records`);
    assert.equal(payload.coverage.total.total, DIVISION_COUNT);
  }
});

test('national-only categories never mark any division ok', async () => {
  for (const slug of ['fdi']) { // the only category with no keyless division-level source
    const mod = await load(slug);
    const payload = await collectCategory({ slug, providers: mod.providers, fetchFn: fakeFetch(), nowMs: NOW });
    assert.equal(payload.coverage.total.ok, 0, slug);
    assert.equal(payload.coverage.total.national_only, DIVISION_COUNT, slug);
  }
});

test('grp: Eurostat beats Wikidata for the same division; Wikidata still fills others', async () => {
  const mod = await load('grp');
  const p = await collectCategory({ slug: 'grp', providers: mod.providers, fetchFn: fakeFetch(), nowMs: NOW, sleep: noSleep });
  assert.equal(p.divisions['DE-BY'].metrics.grp.source, 'eurostat:nama_10r_2gdp');
  assert.equal(p.divisions['DE-BY'].metrics.grp.value, 777);
  assert.equal(p.divisions['US-CA'].metrics.grp.source, 'fred:CANGSP');
  assert.equal(p.divisions['US-CA'].metrics.grp.value, 2000);
  assert.equal(p.divisions['US-CA'].metrics.grp.year, 2024);
  assert.equal(p.divisions['US-CA'].metrics.gdp_national_usd.scope, 'national');
});

test('a failing provider is reported but does not sink the run; all failing throws', async () => {
  const mod = await load('grp');
  const p = await collectCategory({ slug: 'grp', providers: mod.providers, fetchFn: fakeFetch(['eurostat']), nowMs: NOW, sleep: noSleep });
  assert.equal(p.providers.find((r) => r.id === 'eurostat:nama_10r_2gdp').ok, false);
  assert.equal(p.divisions['US-CA'].status, 'ok');
  await assert.rejects(collectCategory({ slug: 'grp', providers: mod.providers, fetchFn: fakeFetch(['eurostat', 'wikidata', 'worldbank', 'stlouisfed']), nowMs: NOW, sleep: noSleep }), /all providers failed/);
});

test('infrastructure: airports/plants/live layers fill every division; densities derived from Wikidata area', async () => {
  const mod = await load('infrastructure');
  const p = await collectCategory({ slug: 'infrastructure', providers: mod.providers, derive: mod.derive, auxMetrics: mod.auxMetrics, fetchFn: fakeFetch(), nowMs: NOW, sleep: noSleep, readKey, env: { SUBNATIONAL_OSM_BATCH: '400' } });
  const ca = p.divisions['US-CA'].metrics;
  assert.equal(ca.airports_large.value, 1);
  assert.equal(ca.airports_with_iata.value, 1);
  assert.equal(ca.plants_count.value, 1);
  assert.equal(ca.quakes_m45_week.value, 1);
  assert.equal(ca.fires_detections.value, 1);
  assert.equal(ca.rail_stations.value, 2);
  assert.equal(ca.airports_large_per_1000km2.method, 'derived');
  assert.ok(Math.abs(ca.airports_large_per_1000km2.value - 1000 / 423970) < 1e-9);
  assert.equal(p.divisions['DE-BY'].metrics.airports_large.value, 0, 'register layers are zero-filled');
  assert.equal(p.divisions['DE-BY'].metrics.fires_detections, undefined, 'capped sample is never zero-filled');
  assert.equal(p.coverage.total.ok, 391, 'only core divisions can be placed on a map; the NUTS 2 layer must not be zero-filled');
  assert.equal(p.divisions['AT-AT11'].metrics.airports_large, undefined);
});

test('infrastructure still has real data when every OSM mirror is down', async () => {
  const mod = await load('infrastructure');
  const p = await collectCategory({ slug: 'infrastructure', providers: mod.providers, derive: mod.derive, auxMetrics: mod.auxMetrics, fetchFn: fakeFetch(['overpass']), nowMs: NOW, sleep: noSleep, readKey });
  assert.equal(p.providers.find((r) => r.id === 'osm:infrastructure').ok, false);
  assert.equal(p.coverage.total.ok, 391);
});

test('aux metrics do not count as coverage: with every real provider failing, nothing is ok', async () => {
  for (const slug of ['infrastructure', 'energy', 'military']) {
    const mod = await load(slug);
    const p = await collectCategory({ slug, providers: mod.providers, derive: mod.derive, auxMetrics: mod.auxMetrics, fetchFn: fakeFetch(['overpass', 'raw.githubusercontent.com', 'worldbank']), nowMs: NOW, sleep: noSleep, readKey: async () => null });
    assert.equal(p.coverage.total.ok, 0, slug);
    assert.ok(p.coverage.total.national_only > 0, slug);
  }
});

test('energy: GPPD backbone, derived per-capita and mix are labelled, snapshot vintage disclosed', async () => {
  const mod = await load('energy');
  const p = await collectCategory({ slug: 'energy', providers: mod.providers, derive: mod.derive, auxMetrics: mod.auxMetrics, fetchFn: fakeFetch(), nowMs: NOW, sleep: noSleep, readKey, env: { SUBNATIONAL_OSM_BATCH: '400' } });
  const m = p.divisions['US-CA'].metrics;
  assert.equal(m.installed_mw_total.value, 1000);
  assert.equal(m.installed_mw_total.year, 2021);
  assert.equal(m.installed_mw_gas.value, 1000);
  assert.equal(m.fossil_capacity_share_pct.value, 100);
  assert.equal(m.renewable_capacity_share_pct.value, 0);
  assert.match(m.installed_w_per_capita.note, /DERIVED/);
  assert.ok(Math.abs(m.installed_w_per_capita.value - (1000 / 39000000) * 1e6) < 1e-6);
  assert.equal(m.petroleum_wells.value, 1, 'OSM still adds wells when a mirror answers');
  assert.equal(p.divisions['DE-BY'].metrics.fossil_capacity_share_pct, undefined, 'no share without capacity');
});

test('military: name-heuristic airfields and UCDP events are labelled, never zero-filled for UCDP', async () => {
  const mod = await load('military');
  const p = await collectCategory({ slug: 'military', providers: mod.providers, derive: mod.derive, auxMetrics: mod.auxMetrics, fetchFn: fakeFetch(['overpass']), nowMs: NOW, sleep: noSleep, readKey });
  assert.equal(p.divisions['US-CA'].metrics.airfields_military_by_name.value, 1);
  assert.match(p.divisions['US-CA'].metrics.airfields_military_by_name.note, /HEURISTIC/);
  assert.equal(p.divisions['UA-30'].metrics.ucdp_events.value, 1);
  assert.equal(p.divisions['US-CA'].metrics.ucdp_events, undefined);
});

test('population derive makes working-age share only when both Eurostat inputs exist', async () => {
  const { derive } = await load('population');
  const rec = { metrics: { population: { value: 200, scope: 'division' }, population_15_64: { value: 130, scope: 'division' } } };
  derive(rec, NOW);
  assert.equal(rec.metrics.working_age_share_pct.value, 65);
  assert.equal(rec.metrics.elderly_share_pct, undefined);
});
