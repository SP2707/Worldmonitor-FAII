import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { LAYER_SPECS, LAYER_KEYS, PRESETS, layerSummary } from '../scripts/map/layers.mjs';
import { loadLayer, loadLayers, extractPoints, extractCountryValues, coordsOf, toIso2, loadCountries } from '../scripts/map/data.mjs';
import { equalEarth, makeProjection, linePath, ringPath, subsolarPoint, nightRing } from '../scripts/map/geo.mjs';
import { renderMap, renderMapSvg, renderMapHtml } from '../scripts/map/render.mjs';
import { svgToPng } from '../scripts/map/png.mjs';

const NOW = new Date(Date.UTC(2026, 9, 12, 12, 0, 0));

describe('layer registry', () => {
  it('covers exactly the MapLayers interface keys', () => {
    const f = new URL('../src/types/index.ts', import.meta.url);
    if (!existsSync(f)) return; // the interface lives in the (partly removed) frontend tree
    const src = readFileSync(f, 'utf8');
    const body = /interface MapLayers\s*\{([\s\S]*?)\n\}/.exec(src)?.[1] ?? '';
    const keys = [...body.matchAll(/^\s+(\w+)\??:\s*boolean/gm)].map((m) => m[1]);
    assert.ok(keys.length >= 50, `parsed ${keys.length} keys`);
    assert.deepEqual([...keys].sort(), [...LAYER_KEYS].sort());
  });
  it('has 58 unique keys and a complete classification', () => {
    assert.equal(LAYER_KEYS.length, 58);
    assert.equal(new Set(LAYER_KEYS).size, 58);
    const s = layerSummary();
    assert.equal(s.static + s.live + s.computed + s.unavailable, 58);
    for (const l of LAYER_SPECS) {
      if (l.source === 'unavailable') assert.ok(l.reason && l.reason.length > 20, `${l.key} needs a concrete reason`);
      if (l.source === 'live') assert.ok(l.keys?.length, `${l.key} needs redis keys`);
    }
  });
  it('presets only name known layers', () => {
    for (const [name, keys] of Object.entries(PRESETS)) for (const k of keys) assert.ok(LAYER_KEYS.includes(k), `${name}: ${k}`);
  });
});

describe('static layers', () => {
  it('every static layer loads real, in-range data', async () => {
    const statics = LAYER_SPECS.filter((l) => l.source === 'static');
    const layers = await loadLayers(statics.map((l) => l.key), {});
    for (const l of layers) {
      assert.equal(l.status, 'ok', `${l.key}: ${l.reason ?? l.status}`);
      assert.ok(l.count > 0, l.key);
      if (l.kind === 'points') for (const f of l.features) { assert.ok(Number.isFinite(f.lat) && Math.abs(f.lat) <= 90, `${l.key} lat ${f.name}`); assert.ok(Number.isFinite(f.lon) && Math.abs(f.lon) <= 180, `${l.key} lon ${f.name}`); }
      if (l.kind === 'lines') for (const f of l.features) assert.ok(f.path.length >= 2, `${l.key} ${f.name}`);
      if (l.kind === 'polygons') for (const f of l.features) assert.ok(f.ring.length >= 3, `${l.key} ${f.name}`);
      if (l.kind === 'choropleth') assert.ok([...l.values.keys()].every((k) => /^[A-Z]{2}$/.test(k)));
    }
  });
  it('trade routes resolve ports and chokepoints into multi-point paths', async () => {
    const l = await loadLayer('tradeRoutes', {});
    assert.ok(l.features.every((f) => f.path.length >= 2));
    assert.ok(l.features.some((f) => f.path.length >= 4));
  });
  it('the day/night layer is computed and always ok', async () => {
    const l = await loadLayer('dayNight', { now: NOW });
    assert.equal(l.status, 'ok'); assert.equal(l.kind, 'terminator');
  });
  it('unavailable layers say why instead of drawing nothing silently', async () => {
    const l = await loadLayer('webcams', {});
    assert.equal(l.status, 'unavailable'); assert.match(l.reason, /key/i);
    assert.equal((await loadLayer('nonsense', {})).status, 'unavailable');
  });
});

describe('generic payload reader', () => {
  it('reads the shapes the seeders use', () => {
    const quakes = { earthquakes: [{ place: 'X', magnitude: 5.2, location: { latitude: 10, longitude: 20 } }, { place: 'Y', magnitude: 4, location: { latitude: -5, longitude: 100 } }] };
    const pts = extractPoints(quakes);
    assert.equal(pts.length, 2); assert.equal(pts[0].name, 'X'); assert.equal(pts[0].size, 5.2); assert.deepEqual([pts[0].lat, pts[0].lon], [10, 20]);
    assert.equal(extractPoints({ fireDetections: [{ location: { latitude: 1, longitude: 2 }, brightness: 330 }] })[0].size, 330);
    assert.equal(extractPoints({ events: [{ title: 'a', lat: '12.5', lng: '-3.5' }] })[0].lon, -3.5);
    assert.deepEqual(extractPoints({ items: [{ name: 'g', coordinates: [30, 40] }] }).map((p) => [p.lon, p.lat]), [[30, 40]]);
  });
  it('reads GeoJSON and unwraps seed envelopes', () => {
    const gj = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: { title: 'P', mag: 3 }, geometry: { type: 'Point', coordinates: [5, 6] } }] };
    assert.deepEqual(extractPoints(gj).map((p) => [p.name, p.lon, p.lat]), [['P', 5, 6]]);
    assert.equal(extractPoints({ _seed: { v: 1 }, data: { list: [{ lat: 1, lon: 2 }] } }).length, 1);
  });
  it('picks the largest record list and ignores lists without coordinates', () => {
    const p = { tags: [{ name: 'a' }, { name: 'b' }], small: [{ lat: 1, lon: 1 }], big: [{ lat: 1, lon: 1 }, { lat: 2, lon: 2 }, { lat: 3, lon: 3 }] };
    assert.equal(extractPoints(p).length, 3);
    assert.deepEqual(extractPoints({ a: [{ name: 'no coords' }] }), []);
  });
  it('rejects out-of-range and non-numeric coordinates', () => {
    assert.equal(coordsOf({ lat: 91, lon: 0 }), null);
    assert.equal(coordsOf({ lat: 'x', lon: 0 }), null);
    assert.equal(coordsOf({ lat: 0, lon: 181 }), null);
    assert.deepEqual(coordsOf({ lat: '0', lon: '0' }), [0, 0]);
  });
  it('country values from maps and record lists, by ISO2, ISO3 or name', () => {
    assert.equal(extractCountryValues({ US: 5, DE: 3, FR: 9 }).get('FR'), 9);
    const m = extractCountryValues({ rows: [{ countryCode: 'JP', score: 40 }, { country: 'Germany', value: 12 }, { iso3: 'BRA', count: 7 }] });
    assert.equal(m.get('JP'), 40); assert.equal(m.get('DE'), 12); assert.equal(m.get('BR'), 7);
    assert.equal(toIso2('france'), 'FR'); assert.equal(toIso2('zzz'), null);
    assert.equal(extractCountryValues({ foo: 'bar' }).size, 0);
  });
  it('the base map has ISO2 codes for the countries used in choropleths', () => {
    const iso = new Set(loadCountries().map((c) => c.iso2));
    for (const c of ['US', 'DE', 'FR', 'CN', 'IN', 'BR', 'NG', 'AU']) assert.ok(iso.has(c), c);
  });
});

describe('live layers', () => {
  const quakes = { earthquakes: [{ place: 'Q1', magnitude: 6, location: { latitude: 35, longitude: 139 } }] };
  it('reads Redis keys through readKey and combines feeds', async () => {
    const store = { 'seismology:earthquakes:v1': quakes, 'natural:events:v1': { events: [{ title: 'Storm', lat: 20, lon: -80 }] } };
    const l = await loadLayer('natural', { readKey: async (k) => store[k] ?? null });
    assert.equal(l.status, 'ok'); assert.equal(l.count, 2); assert.equal(l.live, true);
  });
  it('explains empty, coordinate-less and unreadable cases', async () => {
    const none = await loadLayer('fires', { readKey: async () => null });
    assert.equal(none.status, 'no_data'); assert.match(none.reason, /seeder has not run/);
    const nocoords = await loadLayer('fires', { readKey: async () => ({ rows: [{ a: 1 }] }) });
    assert.match(nocoords.reason, /no records with coordinates/);
    const throws = await loadLayer('fires', { readKey: async () => { throw new Error('redis down'); } });
    assert.equal(throws.status, 'no_data');
    const offline = await loadLayer('fires', {});
    assert.match(offline.reason, /no Redis connection/);
  });
  it('caps large live layers keeping the biggest records', async () => {
    const rows = Array.from({ length: 50 }, (_, i) => ({ lat: i - 25, lon: i, brightness: i }));
    const l = await loadLayer('fires', { readKey: async () => ({ fireDetections: rows }), maxFeatures: 10 });
    assert.equal(l.count, 50); assert.equal(l.features.length, 10); assert.equal(l.truncated, true); assert.equal(l.features[0].size, 49);
  });
  it('choropleth layers read country values', async () => {
    const l = await loadLayer('sanctions', { readKey: async () => ({ US: 4, RU: 20, IR: 15 }) });
    assert.equal(l.status, 'ok'); assert.equal(l.values.get('RU'), 20);
  });
  it('a static layer is enriched with live points when its keys exist', async () => {
    const l = await loadLayer('flights', { readKey: async (k) => (k === 'aviation:delays:faa:v1' ? { airports: [{ name: 'Delay X', lat: 1, lon: 1 }] } : null) });
    assert.equal(l.liveAdded, 1);
  });
});

describe('projection and geometry', () => {
  it('Equal Earth maps the origin to the origin and is odd-symmetric', () => {
    assert.deepEqual(equalEarth(0, 0).map((v) => Math.abs(v) < 1e-12), [true, true]);
    const [x, y] = equalEarth(40, 30); const [x2, y2] = equalEarth(-40, -30);
    assert.ok(Math.abs(x + x2) < 1e-12 && Math.abs(y + y2) < 1e-12);
  });
  it('fits the whole world inside the canvas with the padding', () => {
    const p = makeProjection({ width: 1000 });
    for (const [lon, lat] of [[-180, 0], [180, 0], [0, 90], [0, -90], [-180, 60], [180, -60]]) {
      const [x, y] = p.project(lon, lat);
      assert.ok(x >= 0 && x <= p.width && y >= 0 && y <= p.height, `${lon},${lat} -> ${x},${y}`);
    }
    assert.ok(p.height > 400 && p.height < 600);
  });
  it('a bounding box zooms in (a European box places Paris well inside the canvas)', () => {
    const p = makeProjection({ width: 800, bbox: [-20, 30, 60, 72] });
    const [x, y] = p.project(2.35, 48.85);
    assert.ok(x > 50 && x < 400 && y > 50 && y < p.height - 50);
  });
  it('linePath breaks at the antimeridian instead of streaking across the map', () => {
    const p = makeProjection({ width: 1000 });
    const d = linePath([[170, 0], [179, 1], [-179, 1], [-170, 0]], p.project);
    assert.equal((d.match(/M/g) ?? []).length, 2);
  });
  it('ringPath drops degenerate rings', () => {
    const p = makeProjection({ width: 1000 });
    assert.equal(ringPath([[0, 0], [0.001, 0], [0.001, 0.001]], p.project), '');
    assert.match(ringPath([[0, 0], [30, 0], [30, 30], [0, 30]], p.project), /^M.*Z$/);
  });
  it('the subsolar point matches the solstice and equinox', () => {
    const june = subsolarPoint(new Date(Date.UTC(2026, 5, 21, 12, 0, 0)));
    assert.ok(Math.abs(june.lat - 23.44) < 0.4, `lat ${june.lat}`); assert.ok(Math.abs(june.lon) < 2, `lon ${june.lon}`);
    const march = subsolarPoint(new Date(Date.UTC(2026, 2, 20, 18, 0, 0)));
    assert.ok(Math.abs(march.lat) < 0.8); assert.ok(Math.abs(march.lon - -90) < 3, `lon ${march.lon}`);
    const dec = subsolarPoint(new Date(Date.UTC(2026, 11, 21, 12, 0, 0)));
    assert.ok(dec.lat < -23);
  });
  it('the night ring is finite everywhere, including at an equinox', () => {
    for (const d of [new Date(Date.UTC(2026, 2, 20, 12)), NOW, new Date(Date.UTC(2026, 5, 21, 3))]) {
      const ring = nightRing(d);
      assert.ok(ring.every(([lon, lat]) => Number.isFinite(lon) && Number.isFinite(lat) && Math.abs(lat) <= 90));
      assert.ok(ring.length > 100);
    }
  });
});

describe('renderer', () => {
  const sample = async (keys, readKey) => loadLayers(keys, { readKey, now: NOW });
  const balanced = (svg) => {
    const stack = [];
    for (const m of svg.matchAll(/<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g)) {
      const [, close, tag, , self] = m;
      if (self) continue;
      if (close) assert.equal(stack.pop(), tag, `unbalanced </${tag}>`); else stack.push(tag);
    }
    assert.deepEqual(stack, []);
  };

  it('draws static layers into well-formed, self-contained SVG', async () => {
    const layers = await sample(['cables', 'nuclear', 'conflicts', 'dayNight', 'tradeRoutes']);
    const r = renderMapSvg(layers, { now: NOW });
    balanced(r.svg);
    assert.match(r.svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.equal((r.svg.match(/https?:\/\//g) ?? []).length, 1, 'only the xmlns URL');
    assert.doesNotMatch(r.svg, /<image|<script|url\(|xlink:href|@import/);
    for (const k of ['cables', 'nuclear', 'conflicts', 'dayNight', 'tradeRoutes']) assert.ok(r.svg.includes(`id="wmm-layer-${k}"`), k);
    assert.ok(r.report.every((x) => x.status === 'ok' && x.drawn > 0));
  });
  it('escapes everything that comes from data', async () => {
    const evil = { key: 'natural', status: 'ok', kind: 'points', count: 1, features: [{ name: '<script>alert(1)</script>&"\'', lat: 1, lon: 1, cat: '"><img src=x onerror=1>' }] };
    const r = renderMap([evil], { now: NOW, title: '<b>t</b>' });
    for (const out of [r.svg, r.html]) {
      assert.doesNotMatch(out.replace(/<script>\s*\(function[\s\S]*?<\/script>/, ''), /<script>alert|<img src=x|<b>t<\/b>/);
    }
    balanced(r.svg);
  });
  it('HTML wrapper: CSP forbids network, one toggle per drawn layer, notes list undrawn layers', async () => {
    const layers = await sample(['cables', 'nuclear', 'webcams', 'fires'], async () => null);
    const r = renderMap(layers, { now: NOW });
    assert.match(r.html, /<meta http-equiv="Content-Security-Policy" content="default-src 'none'/);
    assert.doesNotMatch(r.html, /<(?:script|link|img|iframe)[^>]+(?:src|href)=["']https?:/i);
    assert.equal((r.html.match(/<input type="checkbox"/g) ?? []).length, 2);
    assert.match(r.html, /2 requested layers not drawn/);
    assert.match(r.html, /Webcams<\/b> — Webcam listings need/);
    assert.match(r.html, /fires|Wildfires/);
    assert.doesNotMatch(r.html, /eval\(|new Function|innerHTML|document\.write/);
  });
  it('choropleth layers fill countries with value-scaled opacity', async () => {
    const l = await loadLayer('ciiChoropleth', { readKey: async () => ({ rows: [{ countryCode: 'RU', score: 80 }, { countryCode: 'FR', score: 20 }, { countryCode: 'DE', score: 10 }] }) });
    const r = renderMapSvg([l], { now: NOW });
    assert.match(r.svg, /fill-opacity="0\.90"/); // top value
    assert.match(r.svg, /data-n="Russia"|data-n="Russian Federation"/);
    assert.equal(r.report[0].drawn, 3);
  });
  it('marks truncated layers and shows the size scale', async () => {
    const rows = Array.from({ length: 30 }, (_, i) => ({ lat: i, lon: i, magnitude: i }));
    const l = await loadLayer('natural', { readKey: async () => ({ earthquakes: rows }), maxFeatures: 5 });
    const r = renderMap([l], { now: NOW });
    assert.equal(r.report[0].truncated, true);
    assert.match(r.html, /class="wmm-count">\d+\+</);
  });
  it('bbox clips points outside the box', async () => {
    const l = await loadLayer('nuclear', {});
    const world = renderMapSvg([l], { now: NOW });
    const eu = renderMapSvg([l], { now: NOW, bbox: [-20, 30, 60, 72] });
    assert.ok((eu.svg.match(/<circle/g) ?? []).length < (world.svg.match(/<circle/g) ?? []).length);
  });
  it('all static layers together stay within a sane size budget', async () => {
    const layers = await sample(PRESETS['all-static']);
    const r = renderMap(layers, { now: NOW });
    balanced(r.svg);
    assert.ok(r.svg.length < 1_300_000, `svg ${r.svg.length}`);
    assert.ok(r.html.length < 1_450_000);
  });
  it('dark and light themes both render with concrete colours', async () => {
    const layers = await sample(['cables']);
    for (const theme of ['dark', 'light']) assert.doesNotMatch(renderMapSvg(layers, { theme, now: NOW }).svg, /var\(--/);
  });
  it('renderMapHtml works from just svg + report', () => {
    const html = renderMapHtml({ svg: '<svg xmlns="http://www.w3.org/2000/svg"></svg>', report: [] });
    assert.match(html, /<!doctype html>/);
  });
});

describe('png', () => {
  it('rasterises the SVG when sharp is available', async (t) => {
    let sharpOk = true;
    try { await import('sharp'); } catch { sharpOk = false; }
    if (!sharpOk) { t.skip('sharp not installed'); return; }
    const layers = await loadLayers(['cables', 'nuclear'], {});
    const png = await svgToPng(renderMapSvg(layers, { now: NOW, width: 900 }).svg);
    assert.deepEqual([...png.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    assert.ok(png.length > 5000);
  });
});
