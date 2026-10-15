// `render_map` — the offline map viewer as an MCP tool, so a chat client can show the map inline instead of
// opening a window. No network call and no tile server: geometry is bundled (scripts/map) and live layers are read
// from the seeded Redis keys through the same reader the cache tools use.
//
// Result modes (see `output`):
//   scene (default)  compact projected scene; the linked ui:// shell draws it with DOM calls only
//   svg              one self-contained SVG string, for hosts that render SVG inline
//   html             a self-contained, CSP-locked HTML page with layer toggles, for hosts that render sandboxed HTML
import { readJsonFromUpstash } from '../../_upstash-json.js';
import { buildMapResult, DEFAULT_MAX_FEATURES, LAYER_KEYS, OUTPUT_MODES, PRESETS } from '../../../scripts/map/index.mjs';
import { argNum, argStr } from '../filters';
import type { ToolDef } from '../types';
import { MAP_UI_URI } from '../ui/registry';

const PRESET_NAMES = Object.keys(PRESETS);

function argStrArray(value: unknown): string[] | undefined | 'invalid' {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value) || value.some((v) => typeof v !== 'string')) return 'invalid';
  return value as string[];
}

function argBbox(value: unknown): number[] | undefined | 'invalid' {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value) || value.length !== 4) return 'invalid';
  const nums = value.map((v) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : v));
  return nums.every((n) => typeof n === 'number' && Number.isFinite(n)) ? (nums as number[]) : 'invalid';
}

export const MAP_TOOLS: ToolDef[] = [
  {
    name: 'render_map',
    _outputBudgetBytes: 262144,
    _uiResourceUri: MAP_UI_URI,
    description:
      'Draw a world map with chosen intelligence layers (conflict zones, bases, cables, pipelines, nuclear sites, earthquakes, fires, sanctions, exchanges and more; 58 layer keys, `layers` or a `preset`). Returns a compact scene that an MCP-Apps host shows inline in the conversation, or an SVG/HTML string with output=svg|html. Static layers are bundled datasets; live layers draw only when their seeder has run, and every layer that could not be drawn is listed with the reason. Fully offline: no tile servers, no third-party requests. Keep selections small for the model context: the default overview is ~60 KB, all static layers ~190 KB.',
    inputSchema: {
      type: 'object',
      properties: {
        layers: { type: 'array', items: { type: 'string', enum: [...LAYER_KEYS] }, description: 'Layer keys to draw. Combined with `preset` when both are given. Defaults to the overview preset when neither is given.' },
        preset: { type: 'string', enum: [...PRESET_NAMES], description: 'Named layer bundle: overview (default), security, infrastructure, hazards, economy, tech, all-static, all. all-static is large; all adds the live layers.' },
        bbox: { type: 'array', items: { type: 'number' }, minItems: 4, maxItems: 4, description: 'Zoom to a box [minLon, minLat, maxLon, maxLat], e.g. [-20, 30, 60, 72] for Europe and the Middle East.' },
        theme: { type: 'string', enum: ['dark', 'light'], description: 'Colour theme. Defaults to dark.' },
        output: { type: 'string', enum: [...OUTPUT_MODES], description: 'scene (default) for MCP-Apps hosts; svg or html for hosts that render those directly. svg/html results are much larger than scene for the same layers.' },
        width: { type: 'integer', minimum: 400, maximum: 2400, description: 'Pixel width for output=svg|html. Ignored for scene, which is fixed at 1000.' },
        max_features: { type: 'integer', minimum: 1, maximum: 1500, description: `Cap on drawn features per layer (largest kept when a size is known). Defaults to ${DEFAULT_MAX_FEATURES}. Lower it to shrink the result.` },
      },
      required: [],
    },
    outputSchema: {
      type: 'object',
      required: ['view', 'summary', 'layers'],
      properties: {
        view: { type: 'string', enum: ['map'] },
        generatedAt: { type: 'string' },
        output: { type: 'string', enum: [...OUTPUT_MODES] },
        theme: { type: 'string' },
        bbox: { type: 'array', items: { type: 'number' } },
        width: { type: 'number' },
        height: { type: 'number' },
        summary: {
          type: 'object',
          required: ['requested', 'drawn', 'skipped', 'features'],
          properties: {
            requested: { type: 'number' },
            drawn: { type: 'number', description: 'Layers that produced data.' },
            skipped: { type: 'number', description: 'Layers that could not be drawn; see `skipped` for each reason.' },
            features: { type: 'number', description: 'Total features across drawn layers (before max_features capping).' },
          },
        },
        layers: {
          type: 'array',
          description: 'One row per requested layer, in request order.',
          items: {
            type: 'object',
            required: ['key', 'label', 'status', 'count'],
            properties: {
              key: { type: 'string' },
              label: { type: 'string' },
              status: { type: 'string', enum: ['ok', 'empty', 'no_data', 'unavailable'] },
              count: { type: 'number' },
              truncated: { type: 'boolean' },
              liveAdded: { type: 'number' },
              source: { type: 'string' },
              reason: { type: 'string' },
            },
          },
        },
        skipped: { type: 'array', items: { type: 'object' }, description: 'Layers not drawn, each with a plain-language reason.' },
        scene: { type: 'array', description: 'output=scene only: drawable layers with projected coordinates (pts / paths / values / night).', items: { type: 'object' } },
        geo: { type: 'object', description: 'output=scene with bbox only: base geometry for the zoomed projection.' },
        svg: { type: 'string', description: 'output=svg only: a complete SVG document.' },
        html: { type: 'string', description: 'output=html only: a complete self-contained HTML page.' },
        note: { type: 'string' },
        error: { type: 'string', description: 'Present when input validation fails; nothing is drawn.' },
      },
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    _execute: async (params) => {
      const layers = argStrArray(params.layers);
      if (layers === 'invalid') return { error: 'layers must be an array of layer keys' };
      const bbox = argBbox(params.bbox);
      if (bbox === 'invalid') return { error: 'bbox must be four numbers: [minLon, minLat, maxLon, maxLat]' };
      const maxFeatures = argNum(params.max_features);
      const width = argNum(params.width);
      // Anything unexpected (missing bundled data, a bad payload) becomes a plain error result, not a thrown tool error.
      try {
        return await buildMapResult({
          layers,
          preset: argStr(params.preset) || undefined,
          bbox,
          theme: argStr(params.theme) || undefined,
          output: argStr(params.output) || undefined,
          width: width === null ? undefined : width,
          maxFeatures: maxFeatures === null ? undefined : maxFeatures,
          // A missing key or an unreachable Redis must degrade to "no data" for that layer, never fail the whole map.
          readKey: async (key: string) => {
            try { return await readJsonFromUpstash(key); } catch { return null; }
          },
        });
      } catch (err) {
        return { error: `render_map failed: ${err instanceof Error ? err.message : String(err)}` };
      }
    },
    // Reads bundled geometry and Redis cache keys only; no HTTP endpoint (same shape as get_sources).
    _apiPaths: [],
  },
];
