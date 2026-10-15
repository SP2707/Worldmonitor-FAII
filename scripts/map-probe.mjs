#!/usr/bin/env node
// Show what the map reader sees in a Redis key (or a JSON file), so a layer that draws nothing can be diagnosed.
//
//   node scripts/map-probe.mjs displacement:summary:v1:2026
//   node scripts/map-probe.mjs --file payload.json
//
// Prints the payload's structure (keys, array lengths, a trimmed first record) and how many points / country values
// the generic reader extracts from it. Read-only.

import { readFileSync } from 'node:fs';
import { loadEnvFile, readCanonicalValue } from './_seed-utils.mjs';
import { extractPoints, extractCountryValues } from './map/data.mjs';

const args = process.argv.slice(2);
const fileIdx = args.indexOf('--file');
let payload;
let label;
if (fileIdx >= 0) {
  label = args[fileIdx + 1];
  payload = JSON.parse(readFileSync(label, 'utf8'));
} else if (args[0]) {
  label = args[0];
  loadEnvFile(import.meta.url);
  payload = await readCanonicalValue(label);
} else {
  console.error('usage: node scripts/map-probe.mjs <redis-key> | --file payload.json');
  process.exit(2);
}
if (payload == null) { console.log(`${label}: nothing found (missing, expired, or Redis unreachable)`); process.exit(0); }

const clip = (v, n = 90) => { const s = JSON.stringify(v); return s.length > n ? `${s.slice(0, n)}…` : s; };
function shape(v, path = '$', depth = 0, out = []) {
  if (depth > 4 || out.length > 60) return out;
  if (Array.isArray(v)) {
    out.push(`${path}  array[${v.length}]`);
    const first = v.find((x) => x && typeof x === 'object');
    if (first && !Array.isArray(first)) out.push(`${path}[0]  ${clip(Object.fromEntries(Object.entries(first).slice(0, 12).map(([k, x]) => [k, typeof x === 'object' ? (Array.isArray(x) ? `array[${x.length}]` : '{…}') : x])), 260)}`);
    if (first) shape(first, `${path}[0]`, depth + 1, out);
  } else if (v && typeof v === 'object') {
    const keys = Object.keys(v);
    out.push(`${path}  object{${keys.slice(0, 15).join(', ')}${keys.length > 15 ? `, … ${keys.length} keys` : ''}}`);
    for (const k of keys.slice(0, 12)) if (v[k] && typeof v[k] === 'object') shape(v[k], `${path}.${k}`, depth + 1, out);
  }
  return out;
}

console.log(`${label}  (${JSON.stringify(payload).length} bytes)\n`);
console.log(shape(payload).join('\n'));
const pts = extractPoints(payload);
const vals = extractCountryValues(payload);
console.log(`\nreader found: ${pts.length} points with coordinates, ${vals.size} country values`);
if (pts.length) console.log('first point:', clip(pts[0], 200));
if (vals.size) console.log('first values:', clip([...vals.entries()].slice(0, 5), 200));
