// Tests for the point-in-division layers: boundary assignment, OurAirports, WRI GPPD, live events.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { locate, loadGeo } from '../scripts/subnational/geo/geo.mjs';
import { parseCsv } from '../scripts/subnational/_csv.mjs';
import { aggregateAirports } from '../scripts/subnational/providers/ourairports.mjs';
import { aggregatePlants, createGppdProvider } from '../scripts/subnational/providers/gppd.mjs';
import { aggregateLive, createLiveEventsProvider } from '../scripts/subnational/providers/live-events.mjs';
import { DIVISIONS } from '../scripts/subnational/_registry.mjs';
import { mergeObservations } from '../scripts/subnational/_core.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const NOW = Date.UTC(2026, 9, 1);

test('geo: every registry division has boundary polygons', () => {
  const g = loadGeo();
  const has = (d) => (g.polysById.get ? g.polysById.get(d.id)?.length : g.polysById[d.id]?.length);
  for (const d of DIVISIONS.filter((x) => !x.layer)) assert.ok(has(d), d.id);
  // The Eurostat NUTS 2 layer has no boundary polygons yet: point-in-region layers (airports, power plants) cannot place anything there.
  assert.ok(DIVISIONS.filter((x) => x.layer).every((d) => !has(d)));
});

test('geo: known cities land in the right division (incl. Moscow city vs oblast)', () => {
  const cases = [
    [-118.24, 34.05, 'US', 'US-CA'], [37.62, 55.75, 'RU', 'RU-MOW'], [36.0, 55.6, 'RU', 'RU-MOS'],
    [30.31, 59.94, 'RU', 'RU-SPE'], [11.58, 48.14, 'DE', 'DE-BY'], [114.06, 22.54, 'CN', 'CN-GD'],
    [72.88, 19.07, 'IN', 'IN-MH'], [139.69, 35.68, 'JP', 'JP-13'], [55.27, 25.2, 'AE', 'AE-DU'],
  ];
  for (const [x, y, c, want] of cases) assert.equal(locate(x, y, { country: c })?.id, want, `${x},${y}`);
});

test('geo: open ocean is unassigned; near-coast falls back to nearest in the SAME country only', () => {
  assert.equal(locate(-140, 30, { country: 'US' }), null);
  const near = locate(-117.3, 32.6, { country: 'US' });
  assert.equal(near?.id, 'US-CA');
  assert.equal(near?.method, 'nearest');
  // a point in the sea next to Germany must never be assigned to a French division
  const sea = locate(7.0, 54.0, { country: 'FR' });
  assert.equal(sea, null);
});

test('csv: RFC4180 quotes, embedded commas/newlines and escaped quotes', () => {
  const rows = parseCsv('a,b,c\n1,"x, y",3\n"4","he said ""hi""","l1\nl2"\n');
  assert.equal(rows.length, 2);
  assert.equal(rows[0].b, 'x, y');
  assert.equal(rows[1].b, 'he said "hi"');
  assert.equal(rows[1].c, 'l1\nl2');
});

const AIR_HEAD = ['id', 'ident', 'type', 'name', 'latitude_deg', 'longitude_deg', 'iso_country', 'iso_region', 'scheduled_service', 'iata_code'];
const air = (o) => Object.fromEntries(AIR_HEAD.map((k) => [k, o[k] ?? '']));

test('ourairports: counts by type, closed excluded, region direct else located, military-by-name heuristic', () => {
  const rows = [
    air({ type: 'large_airport', name: 'Los Angeles Intl', latitude_deg: '33.94', longitude_deg: '-118.4', iso_country: 'US', iso_region: 'US-CA', scheduled_service: 'yes', iata_code: 'LAX' }),
    air({ type: 'closed', name: 'Gone', iso_country: 'US', iso_region: 'US-CA' }),
    air({ type: 'heliport', name: 'Pad', iso_country: 'US', iso_region: 'US-CA', scheduled_service: 'no' }),
    // Chinese numeric region code -> located from coordinates
    air({ type: 'medium_airport', name: 'Shenzhen Bao an', latitude_deg: '22.64', longitude_deg: '113.81', iso_country: 'CN', iso_region: 'CN-44', scheduled_service: 'yes', iata_code: 'SZX' }),
    air({ type: 'small_airport', name: 'Edwards Air Force Base', latitude_deg: '34.9', longitude_deg: '-117.9', iso_country: 'US', iso_region: 'US-CA' }),
    air({ type: 'large_airport', name: 'Elsewhere', iso_country: 'ZZ', iso_region: 'ZZ-1' }),
  ];
  const { counts, stats } = aggregateAirports(rows);
  const ca = counts.get('US-CA');
  assert.equal(ca.airports_large, 1);
  assert.equal(ca.heliports, 1);
  assert.equal(ca.airports_small, 1);
  assert.equal(ca.airports_with_iata, 1);
  assert.equal(ca.airports_scheduled_service, 1);
  assert.equal(ca.airfields_military_by_name, 1);
  assert.equal(counts.get('CN-GD').airports_medium, 1);
  assert.equal(stats.considered, 4);
  assert.equal(counts.get('DE-BY').airports_large, 0, 'zero-filled');
});

const GPPD_HEAD = ['country', 'name', 'capacity_mw', 'latitude', 'longitude', 'primary_fuel', 'estimated_generation_gwh_2017'];
const plant = (o) => Object.fromEntries(GPPD_HEAD.map((k) => [k, o[k] ?? '']));

test('gppd: capacity by fuel group per division, bad rows skipped, other countries ignored', () => {
  const rows = [
    plant({ country: 'DEU', capacity_mw: '1485', latitude: '48.60', longitude: '12.29', primary_fuel: 'Nuclear', estimated_generation_gwh_2017: '10000' }),
    plant({ country: 'DEU', capacity_mw: '100', latitude: '48.2', longitude: '11.6', primary_fuel: 'Solar' }),
    plant({ country: 'DEU', capacity_mw: 'n/a', latitude: '48.2', longitude: '11.6', primary_fuel: 'Gas' }),
    plant({ country: 'BRA', capacity_mw: '500', latitude: '-10', longitude: '-50', primary_fuel: 'Hydro' }),
    plant({ country: 'USA', capacity_mw: '2000', latitude: '34.05', longitude: '-118.24', primary_fuel: 'Gas' }),
  ];
  const { agg, stats } = aggregatePlants(rows);
  const by = agg.get('DE-BY');
  assert.equal(by.total_mw, 1585);
  assert.equal(by.count, 2);
  assert.equal(by.by.nuclear, 1485);
  assert.equal(by.by.solar, 100);
  assert.equal(by.gen_gwh_2017, 10000);
  assert.equal(agg.get('US-CA').by.gas, 2000);
  assert.equal(stats.considered, 3);
});

test('gppd provider: rejects an unexpected CSV, honours the metric filter, labels vintage', async () => {
  const head = GPPD_HEAD.join(',');
  const body = [head, ...Array.from({ length: 1200 }, (_, i) => `ZZZ,p${i},1,0,0,Gas,`), 'DEU,Isar,1485,48.60,12.29,Nuclear,10000'].join('\n');
  const ok = async () => new Response(body, { status: 200 });
  const { observations } = await createGppdProvider({ only: ['installed_mw_total', 'plants_count'] }).run({ fetchFn: ok });
  const metrics = new Set(observations.map((o) => o.metric));
  assert.deepEqual([...metrics].sort(), ['installed_mw_total', 'plants_count']);
  const o = observations.find((x) => x.divisionId === 'DE-BY' && x.metric === 'installed_mw_total');
  assert.equal(o.value, 1485);
  assert.equal(o.year, 2021);
  assert.match(o.note, /unmaintained|snapshot/i);
  await assert.rejects(createGppdProvider().run({ fetchFn: async () => new Response('a,b\n1,2\n') }), /unexpected CSV/);
  await assert.rejects(createGppdProvider().run({ fetchFn: async () => new Response('x', { status: 503 }) }), /HTTP 503/);
});

const ev = (lon, lat, extra = {}) => ({ location: { longitude: lon, latitude: lat }, ...extra });

test('live: quakes are zero-filled, capped-sample feeds (fires, ucdp) are not', () => {
  const quakes = aggregateLive('quakes', { earthquakes: [ev(-118.24, 34.05, { magnitude: 4.7, occurredAt: NOW }), ev(-118.3, 34.1, { magnitude: 5.1, occurredAt: NOW })] }, NOW);
  const ca = quakes.observations.filter((o) => o.divisionId === 'US-CA');
  assert.equal(ca.find((o) => o.metric === 'quakes_m45_week').value, 2);
  assert.equal(ca.find((o) => o.metric === 'quake_max_magnitude').value, 5.1);
  assert.equal(quakes.observations.find((o) => o.divisionId === 'DE-BY' && o.metric === 'quakes_m45_week').value, 0);

  const fires = aggregateLive('fires', { fireDetections: [ev(-118.24, 34.05, { frp: 12, confidence: 'FIRE_CONFIDENCE_HIGH', detectedAt: NOW })] }, NOW);
  assert.equal(fires.observations.filter((o) => o.divisionId === 'DE-BY').length, 0, 'no zero for a capped sample');
  assert.equal(fires.observations.find((o) => o.divisionId === 'US-CA' && o.metric === 'fires_detections').value, 1);
  assert.match(fires.observations[0].note, /capped/i);
  const mixed = aggregateLive('fires', { fireDetections: [ev(-118.24, 34.05, { frp: 1, detectedAt: NOW }), ev(-118.24, 34.05, { frp: 1, detectedAt: NOW - 400 * 86400_000 })] }, NOW);
  assert.equal(mixed.observations.find((o) => o.divisionId === 'US-CA' && o.metric === 'fires_detections').value, 1, 'detections older than 10 days are ignored');

  const ucdp = aggregateLive('ucdp', { events: [ev(30.52, 50.45, { deathsBest: 7, dateStart: NOW }), ev(30.6, 50.4, { deathsBest: 3, dateStart: NOW }), ev(0, 0, { deathsBest: 1 })] }, NOW);
  assert.equal(ucdp.observations.find((o) => o.metric === 'ucdp_deaths_best').value, 10);
  assert.equal(ucdp.stats.outside, 1);
});

test('live provider: reads through ctx.readKey and fails clearly when the feed is empty', async () => {
  const p = createLiveEventsProvider('quakes');
  const res = await p.run({ nowMs: NOW, readKey: async (k) => { assert.equal(k, 'seismology:earthquakes:v1'); return { earthquakes: [ev(139.69, 35.68, { magnitude: 4.6, occurredAt: NOW })] }; } });
  assert.equal(res.observations.find((o) => o.divisionId === 'JP-13' && o.metric === 'quakes_m45_week').value, 1);
  await assert.rejects(p.run({ readKey: async () => null }), /is empty/);
});

test('merge: the same source can always refresh itself even if its provider rank got worse', () => {
  const first = mergeObservations({}, [{ divisionId: 'US-CA', metric: 'm', value: 1, source: 'wb', scope: 'national', rank: 2 }], NOW);
  const again = mergeObservations(first, [{ divisionId: 'US-CA', metric: 'm', value: 5, source: 'wb', scope: 'national', rank: 3 }], NOW + 86400_000);
  assert.equal(again['US-CA'].metrics.m.value, 5);
});

// Runs only where the app has been run before (its local Redis snapshot exists).
const SNAP = join(ROOT, '.local-redis-data.json');
test('live: real seeded feeds aggregate without errors (skipped when no local snapshot)', { skip: !existsSync(SNAP) }, async (t) => {
  let snap;
  try { snap = JSON.parse(readFileSync(SNAP, 'utf8')); } catch (err) { t.skip(`snapshot unreadable (probably being written): ${err.message}`); return; }
  for (const kind of ['quakes', 'fires', 'ucdp']) {
    const key = { quakes: 'seismology:earthquakes:v1', fires: 'wildfire:fires:v1', ucdp: 'conflict:ucdp-events:v1' }[kind];
    if (!snap[key]) continue;
    let data;
    try { data = JSON.parse(snap[key].data); } catch { continue; }
    const r = aggregateLive(kind, data, Date.now());
    assert.ok(r.stats.assigned <= r.stats.events, kind);
    for (const o of r.observations) assert.ok(Number.isFinite(o.value), `${kind} ${o.metric}`);
  }
});
