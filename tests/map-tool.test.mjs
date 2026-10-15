// The in-chat map: the render_map MCP tool, its ui:// shell, and the result builder behind both.
// Nothing here touches the network; live layers get an injected reader.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TOOL_REGISTRY } from '../api/mcp/registry/index.ts';
import { UI_RESOURCE_REGISTRY, MAP_UI_URI } from '../api/mcp/ui/registry.ts';
import { buildMapResult, buildGeo, parseBbox, resolveLayerKeys, PRESETS, LAYER_KEYS } from '../scripts/map/index.mjs';

const NOW = new Date(Date.UTC(2026, 9, 12, 12, 0, 0));
const tool = TOOL_REGISTRY.find((t) => t.name === 'render_map');
const call = (params) => tool._execute(params, '', { kind: 'free' });

describe('render_map registration', () => {
  it('is registered with the strict ToolDef fields and no HTTP dependency', () => {
    assert.ok(tool, 'render_map must be in TOOL_REGISTRY');
    assert.equal(typeof tool._outputBudgetBytes, 'number');
    assert.deepEqual(tool._apiPaths, []);
    assert.equal(tool.annotations.readOnlyHint, true);
    assert.equal(tool.annotations.openWorldHint, false);
    assert.equal(tool.inputSchema.required.length, 0);
    assert.ok(!('jmespath' in tool.inputSchema.properties), 'jmespath is injected universally');
  });
  it('advertises exactly the 58 layer keys and the preset names', () => {
    assert.deepEqual(tool.inputSchema.properties.layers.items.enum, LAYER_KEYS);
    assert.deepEqual(tool.inputSchema.properties.preset.enum, Object.keys(PRESETS));
    assert.equal(LAYER_KEYS.length, 58);
  });
  it('links to a registered ui:// shell', () => {
    assert.equal(tool._uiResourceUri, MAP_UI_URI);
    const shell = UI_RESOURCE_REGISTRY.find((r) => r.uri === MAP_UI_URI);
    assert.ok(shell, 'shell must be registered');
    assert.equal(shell.mimeType, 'text/html;profile=mcp-app');
  });
});

describe('render_map results', () => {
  it('default call draws the overview preset as a scene and stays well inside the output budget', async () => {
    const r = await call({});
    assert.equal(r.view, 'map');
    assert.equal(r.output, 'scene');
    assert.ok(Array.isArray(r.scene) && r.scene.length > 0);
    assert.ok(JSON.stringify(r).length < tool._outputBudgetBytes / 2, `default result is ${JSON.stringify(r).length} bytes`);
  });
  it('the largest static selection (all-static) still fits the budget', async () => {
    const r = await call({ preset: 'all-static' });
    assert.equal(r.summary.drawn, 28);
    assert.equal(r.summary.skipped, 0);
    assert.ok(Buffer.byteLength(JSON.stringify(r)) <= tool._outputBudgetBytes, `all-static is ${Buffer.byteLength(JSON.stringify(r))} bytes`);
  });
  it('scene carries no land geometry and no markup', async () => {
    const r = await call({ layers: ['cables', 'bases', 'conflicts', 'dayNight', 'fuelShortages'] });
    const text = JSON.stringify(r);
    assert.ok(!('geo' in r), 'world scenes rely on the shell geometry');
    assert.ok(!/<svg|<script|<path/i.test(text), 'scene must be data, not markup');
    for (const l of r.scene) {
      assert.ok(l.pts || l.paths || l.values || l.night, `${l.key} has drawable data`);
      assert.match(l.color, /^#[0-9a-f]{6}$/i);
    }
  });
  it('lists every layer that could not be drawn with a reason (no silent drops)', async () => {
    const r = await call({ layers: ['ais', 'satellites', 'sanctions', 'bases'] });
    assert.equal(r.summary.requested, 4);
    assert.equal(r.summary.drawn, 1);
    assert.equal(r.skipped.length, 3);
    for (const s of r.skipped) assert.ok(s.reason && s.reason.length > 10, `${s.key} needs a reason`);
    assert.equal(r.skipped.find((s) => s.key === 'ais').status, 'unavailable');
  });
  it('a live layer is drawn when its key has coordinates, and reported no_data when it does not', async () => {
    const seismology = { earthquakes: [{ place: 'Test quake', magnitude: 6.1, location: { latitude: 35.2, longitude: 139.7 } }] };
    const ok = await buildMapResult({ layers: ['natural'], now: NOW, readKey: async (k) => (k === 'seismology:earthquakes:v1' ? seismology : null) });
    assert.equal(ok.summary.drawn, 1);
    assert.equal(ok.scene[0].pts.length, 1);
    assert.match(ok.scene[0].pts[0][3], /Test quake/);
    const none = await buildMapResult({ layers: ['natural'], now: NOW, readKey: async () => null });
    assert.equal(none.summary.drawn, 0);
    assert.equal(none.skipped[0].status, 'no_data');
    const throwing = await buildMapResult({ layers: ['natural'], now: NOW, readKey: async () => { throw new Error('redis down'); } });
    assert.equal(throwing.skipped[0].status, 'no_data', 'an unreachable Redis degrades to no_data, never a failed map');
  });
  it('bbox returns zoomed base geometry; points outside the box are not sent', async () => {
    const r = await buildMapResult({ layers: ['bases'], bbox: [-20, 30, 60, 72], now: NOW });
    assert.ok(r.geo && r.geo.countries.length > 50);
    const all = await buildMapResult({ layers: ['bases'], now: NOW });
    assert.ok(r.scene[0].pts.length < all.scene[0].pts.length);
    for (const [x, y] of r.scene[0].pts) assert.ok(x >= -10 && x <= r.width + 10 && y >= -10 && y <= r.height + 10);
  });
  it('svg and html modes return one self-contained document and no scene', async () => {
    const svg = await buildMapResult({ layers: ['conflicts', 'bases'], output: 'svg', now: NOW });
    assert.ok(svg.svg.startsWith('<svg') && !svg.scene && !svg.html);
    assert.ok(!/<image|href=|url\(|https?:\/\//.test(svg.svg.replace('http://www.w3.org/2000/svg', '')), 'svg must not reference anything external');
    const html = await buildMapResult({ layers: ['conflicts'], output: 'html', now: NOW });
    assert.ok(html.html.startsWith('<!doctype html>') && html.html.includes("default-src 'none'"));
  });
  it('rejects bad input with an error and draws nothing', async () => {
    for (const bad of [
      { layers: ['nope'] }, { preset: 'nope' }, { layers: 'bases' }, { bbox: [1, 2, 3] }, { bbox: [10, 0, -10, 5] },
      { output: 'png' }, { theme: 'blue' },
    ]) {
      const r = await call(bad);
      assert.equal(typeof r.error, 'string', JSON.stringify(bad));
      assert.ok(!r.scene && !r.svg && !r.html);
    }
  });
  it('de-duplicates layers and combines layers with a preset', () => {
    const r = resolveLayerKeys({ layers: ['bases', 'bases', 'cables'], preset: 'security' });
    assert.equal(new Set(r.keys).size, r.keys.length);
    assert.ok(r.keys.includes('cables') && r.keys.includes('conflicts'));
    assert.deepEqual(parseBbox(undefined), { bbox: undefined });
  });
});

describe('ui:// shell', () => {
  const shell = UI_RESOURCE_REGISTRY.find((r) => r.uri === MAP_UI_URI);
  const body = shell.html;
  it('is self-contained and locked down', () => {
    assert.match(body, /Content-Security-Policy/);
    assert.match(body, /default-src 'none'/);
    assert.ok(!/<script[^>]*\ssrc=|<link[^>]*href=|<img[^>]*src=\s*"http/i.test(body), 'no external loads');
    assert.ok(!/https?:\/\/(?!www\.w3\.org\/2000\/svg|worldmonitor\.app|www\.worldmonitor\.app|chatgpt\.com|claude\.ai|claude\.com)/.test(body), 'no unexpected hosts');
  });
  it('renders with DOM calls only (no innerHTML / eval)', () => {
    assert.ok(!/innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|new Function/.test(body));
    assert.match(body, /createElementNS/);
  });
  it('embeds the world geometry once and uses the shared bridge', () => {
    assert.match(body, /var GEO = \{/);
    assert.equal(buildGeo().countries.length > 100, true);
    assert.match(body, /function softError/);
    assert.match(body, /ui\/notifications\/tool-result/);
  });
});

describe('bundled build (docker/build-handlers.mjs inlines this tool into api/mcp.js)', () => {
  it('still finds its bundled data when the bundle lives outside scripts/map', async () => {
    const { build } = await import('esbuild');
    const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs');
    const { tmpdir } = await import('node:os');
    const { join } = await import('node:path');
    const { pathToFileURL, fileURLToPath } = await import('node:url');
    const out = await build({
      entryPoints: [fileURLToPath(new URL('../api/mcp/registry/map-tools.ts', import.meta.url))],
      bundle: true, format: 'esm', platform: 'node', target: 'node20', loader: { '.ts': 'ts' }, write: false, logLevel: 'silent',
    });
    const dir = mkdtempSync(join(tmpdir(), 'wm-map-bundle-'));
    try {
      const file = join(dir, 'map-tools.mjs');
      writeFileSync(file, out.outputFiles[0].text);
      const bundled = await import(pathToFileURL(file).href);
      const r = await bundled.MAP_TOOLS[0]._execute({ preset: 'security' }, '', { kind: 'free' });
      assert.equal(r.error, undefined, r.error);
      assert.ok(r.summary.drawn >= 4, 'static security layers must draw from the bundle (cwd = repo root)');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
