#!/usr/bin/env node
// Render the offline map to a file.
//
//   node scripts/render-map.mjs --preset security --out map.svg
//   node scripts/render-map.mjs --layers cables,nuclear,natural,dayNight --out map.html --live
//   node scripts/render-map.mjs --preset all --live --out map.png --width 1600 --theme light
//   node scripts/render-map.mjs --list                      show all 58 layers and whether each can render
//   node scripts/render-map.mjs --bbox -20,30,60,72 ...      zoom to a lon/lat box (minLon,minLat,maxLon,maxLat)
//
// --live reads the seeded Redis keys (needs UPSTASH_REDIS_REST_URL/TOKEN as for the seeders); without it only
// static layers are drawn. Output format follows the --out extension (.svg, .html, .png).

import { writeFileSync } from 'node:fs';
import { loadEnvFile, readCanonicalValue } from './_seed-utils.mjs';
import { LAYER_SPECS, LAYER_KEYS, PRESETS, layerSummary } from './map/layers.mjs';
import { loadLayers } from './map/data.mjs';
import { renderMap } from './map/render.mjs';
import { svgToPng } from './map/png.mjs';

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const flag = (n) => args.includes(`--${n}`);

if (flag('list')) {
  const s = layerSummary();
  console.log(`${s.total} layers: ${s.static} static, ${s.live} live (need a seeded Redis), ${s.computed} computed, ${s.unavailable} unavailable\n`);
  for (const l of LAYER_SPECS) console.log(`${l.key.padEnd(24)} ${l.source.padEnd(12)} ${l.render.padEnd(11)} ${l.source === 'unavailable' ? l.reason : (l.keys ?? []).join(', ')}`);
  console.log(`\npresets: ${Object.keys(PRESETS).join(', ')}`);
  process.exit(0);
}

const out = opt('out');
if (!out) { console.error('usage: node scripts/render-map.mjs (--preset NAME | --layers a,b,c) --out file.(svg|html|png) [--live] [--width N] [--theme dark|light] [--bbox w,s,e,n]\n       node scripts/render-map.mjs --list'); process.exit(2); }

const keys = opt('layers') ? opt('layers').split(',').map((s) => s.trim()).filter(Boolean) : (PRESETS[opt('preset') ?? 'all-static'] ?? null);
if (!keys) { console.error(`unknown preset; choose one of: ${Object.keys(PRESETS).join(', ')}`); process.exit(2); }
const bad = keys.filter((k) => !LAYER_KEYS.includes(k));
if (bad.length) { console.error(`unknown layer(s): ${bad.join(', ')} (run with --list)`); process.exit(2); }

let readKey;
if (flag('live')) {
  loadEnvFile(import.meta.url);
  readKey = (k) => readCanonicalValue(k);
}
const bbox = opt('bbox') ? opt('bbox').split(',').map(Number) : undefined;
if (bbox && (bbox.length !== 4 || bbox.some((n) => !Number.isFinite(n)))) { console.error('--bbox needs four numbers: minLon,minLat,maxLon,maxLat'); process.exit(2); }

const layers = await loadLayers(keys, { readKey });
const width = Number(opt('width')) || 1100;
const result = renderMap(layers, { width, theme: opt('theme') ?? 'dark', bbox, title: opt('title') ?? 'WorldMonitor map' });
if (out.endsWith('.png')) writeFileSync(out, await svgToPng(result.svg));
else if (out.endsWith('.html')) writeFileSync(out, result.html);
else writeFileSync(out, result.svg);

for (const r of result.report) console.log(`${r.status === 'ok' ? 'drew   ' : 'skipped'} ${r.key.padEnd(22)} ${String(r.count).padStart(5)}  ${r.status === 'ok' ? '' : r.reason ?? r.status}`);
console.log(`\nwrote ${out} (${result.width}x${result.height})`);
