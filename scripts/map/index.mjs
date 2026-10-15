// Single entry point for callers outside scripts/map (the MCP `render_map` tool and the CLI):
// resolves layer selection, loads the data, and builds the requested output.
//
//   output 'scene'  compact projected scene for the in-chat shell (default; small, no land geometry)
//   output 'svg'    one self-contained SVG string (for hosts that render SVG inline)
//   output 'html'   a self-contained HTML page with layer toggles (for hosts that render sandboxed HTML inline)
//
// Everything is dependency-free and offline; live layers read through the injected `readKey`.

import { LAYER_BY_KEY, LAYER_KEYS, LAYER_SPECS, PRESETS, layerSummary } from './layers.mjs';
import { loadLayers } from './data.mjs';
import { buildGeo, buildScene, renderMap, SCENE_WIDTH } from './render.mjs';

export { LAYER_KEYS, LAYER_SPECS, PRESETS, layerSummary, buildGeo, SCENE_WIDTH };

export const OUTPUT_MODES = ['scene', 'svg', 'html'];
export const DEFAULT_MAX_FEATURES = 500;
const MAX_LAYERS = 58;

/** Validate and normalise a bbox given as [minLon, minLat, maxLon, maxLat]; returns { bbox } or { error }. */
export function parseBbox(value) {
  if (value === undefined || value === null) return { bbox: undefined };
  if (!Array.isArray(value) || value.length !== 4 || value.some((n) => typeof n !== 'number' || !Number.isFinite(n))) {
    return { error: 'bbox must be four numbers: [minLon, minLat, maxLon, maxLat]' };
  }
  const [w, s, e, n] = value;
  if (w < -180 || e > 180 || s < -90 || n > 90 || w >= e || s >= n) {
    return { error: 'bbox out of range: need -180 <= minLon < maxLon <= 180 and -90 <= minLat < maxLat <= 90' };
  }
  return { bbox: [w, s, e, n] };
}

/** Resolve `layers` (explicit keys) and/or `preset` into a de-duplicated key list, or an error. */
export function resolveLayerKeys({ layers, preset } = {}) {
  let keys = [];
  if (preset !== undefined) {
    if (!Object.hasOwn(PRESETS, preset)) return { error: `unknown preset "${preset}"; choose one of: ${Object.keys(PRESETS).join(', ')}` };
    keys.push(...PRESETS[preset]);
  }
  if (layers !== undefined) {
    if (!Array.isArray(layers) || layers.some((k) => typeof k !== 'string')) return { error: 'layers must be an array of layer keys' };
    keys.push(...layers);
  }
  if (!keys.length) keys = [...PRESETS.overview];
  const bad = keys.filter((k) => !LAYER_KEYS.includes(k));
  if (bad.length) return { error: `unknown layer(s): ${[...new Set(bad)].join(', ')}; valid keys: ${LAYER_KEYS.join(', ')}` };
  keys = [...new Set(keys)];
  if (keys.length > MAX_LAYERS) return { error: `at most ${MAX_LAYERS} layers` };
  return { keys };
}

const reportRow = (l) => {
  const spec = LAYER_BY_KEY[l.key];
  return {
    key: l.key,
    label: spec?.label ?? l.key,
    status: l.status,
    count: l.count ?? 0,
    ...(l.truncated ? { truncated: true } : {}),
    ...(l.liveAdded ? { liveAdded: l.liveAdded } : {}),
    ...(l.source ? { source: l.source } : {}),
    ...(l.status !== 'ok' && l.reason ? { reason: l.reason } : {}),
  };
};

/**
 * Build a map. Returns a plain JSON-safe object; on bad input returns { error } and nothing else is computed.
 * opts: { layers, preset, bbox, theme, output, width, maxFeatures, readKey, now }
 */
export async function buildMapResult(opts = {}) {
  const output = opts.output ?? 'scene';
  if (!OUTPUT_MODES.includes(output)) return { error: `output must be one of: ${OUTPUT_MODES.join(', ')}` };
  const theme = opts.theme ?? 'dark';
  if (theme !== 'dark' && theme !== 'light') return { error: 'theme must be "dark" or "light"' };
  const sel = resolveLayerKeys(opts);
  if (sel.error) return { error: sel.error };
  const bb = parseBbox(opts.bbox);
  if (bb.error) return { error: bb.error };
  const maxFeatures = Number.isInteger(opts.maxFeatures) && opts.maxFeatures >= 1 ? Math.min(opts.maxFeatures, 1500) : DEFAULT_MAX_FEATURES;
  const now = opts.now ?? new Date();

  const loaded = await loadLayers(sel.keys, { readKey: opts.readKey, now, maxFeatures });
  const layers = loaded.map(reportRow);
  const drawn = layers.filter((l) => l.status === 'ok');
  const skipped = layers.filter((l) => l.status !== 'ok').map(({ key, label, status, reason }) => ({ key, label, status, reason }));
  const meta = {
    view: 'map',
    generatedAt: now.toISOString(),
    output,
    theme,
    ...(bb.bbox ? { bbox: bb.bbox } : {}),
    summary: { requested: sel.keys.length, drawn: drawn.length, skipped: skipped.length, features: drawn.reduce((n, l) => n + l.count, 0) },
    layers,
    ...(skipped.length ? { skipped } : {}),
    note: 'Layers marked live are only drawn when their seeder has populated Redis; skipped layers say why. Static datasets are curated bundles, not live feeds.',
  };

  if (output === 'scene') {
    const scene = buildScene(loaded, { bbox: bb.bbox, now });
    return { ...meta, width: scene.width, height: scene.height, scene: scene.layers, ...(bb.bbox ? { geo: buildGeo({ bbox: bb.bbox }) } : {}) };
  }
  const width = Number.isInteger(opts.width) && opts.width >= 400 && opts.width <= 2400 ? opts.width : 1000;
  const r = renderMap(loaded, { width, theme, bbox: bb.bbox, now, detail: 'low', legend: output === 'svg', tooltips: output === 'html', title: opts.title ?? 'WorldMonitor map' });
  return { ...meta, width: r.width, height: r.height, ...(output === 'svg' ? { svg: r.svg } : { html: r.html }) };
}
