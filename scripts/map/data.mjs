// Layer data loading for the offline map viewer.
//   static layers  -> scripts/data/map/static-layers.json (+ two JSON files already in scripts/data)
//   live layers    -> Redis keys through an injected `readKey(key)`; payload shapes differ per seeder, so a generic
//                     reader finds the coordinate-bearing records instead of hard-coding shapes
// Everything here is pure except readFileSync of bundled files and the injected readKey.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LAYER_BY_KEY } from './layers.mjs';

// Repository root. Normally two levels above this file; when the MCP server's esbuild bundle inlines this module
// (api/mcp.js, api/mcp/registry/map-tools.js), import.meta.url points at the bundle instead, so fall back to the
// working directory (the server is started from the repo root) or an explicit WORLDMONITOR_ROOT.
const HERE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ROOT = [process.env.WORLDMONITOR_ROOT, HERE_ROOT, process.cwd()]
  .filter(Boolean)
  .find((r) => existsSync(join(r, 'scripts', 'data', 'map', 'static-layers.json'))) ?? HERE_ROOT;
const cache = new Map();
const readJson = (rel) => {
  if (!cache.has(rel)) cache.set(rel, JSON.parse(readFileSync(join(ROOT, rel), 'utf8')));
  return cache.get(rel);
};

export const MAX_FEATURES_DEFAULT = 1500;

// ---- countries (base map + choropleth lookups) ---------------------------------------------------------
export function loadCountries() {
  const g = readJson('public/data/countries.geojson');
  return g.features.map((f) => ({
    name: f.properties.name,
    iso2: f.properties['ISO3166-1-Alpha-2'] && f.properties['ISO3166-1-Alpha-2'] !== '-99' ? f.properties['ISO3166-1-Alpha-2'] : null,
    iso3: f.properties['ISO3166-1-Alpha-3'] && f.properties['ISO3166-1-Alpha-3'] !== '-99' ? f.properties['ISO3166-1-Alpha-3'] : null,
    geometry: f.geometry,
  }));
}

let countryIndex;
function countryLookup() {
  if (countryIndex) return countryIndex;
  countryIndex = new Map();
  for (const c of loadCountries()) {
    if (c.iso2) countryIndex.set(c.iso2.toLowerCase(), c.iso2);
    if (c.iso3) countryIndex.set(c.iso3.toLowerCase(), c.iso2 ?? c.iso3);
    countryIndex.set(c.name.toLowerCase(), c.iso2 ?? c.name);
  }
  return countryIndex;
}
/** Normalise a country identifier (ISO2, ISO3 or English name) to the ISO2 used on the base map, or null. */
export function toIso2(value) {
  if (typeof value !== 'string') return null;
  return countryLookup().get(value.trim().toLowerCase()) ?? null;
}

// ---- generic coordinate reader -------------------------------------------------------------------------
const num = (v) => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
  return null;
};
const validLat = (v) => v !== null && v >= -90 && v <= 90;
const validLon = (v) => v !== null && v >= -180 && v <= 180;

/** [lon, lat] for a record, trying the shapes seen across the seeders; null when it has no usable coordinates. */
export function coordsOf(o, depth = 0) {
  if (!o || typeof o !== 'object' || Array.isArray(o) || depth > 2) return null;
  const lat = num(o.lat ?? o.latitude);
  const lon = num(o.lon ?? o.lng ?? o.long ?? o.longitude);
  if (validLat(lat) && validLon(lon)) return [lon, lat];
  for (const k of ['location', 'position', 'point', 'centroid', 'coordinates', 'geometry', 'coords']) {
    const v = o[k];
    if (Array.isArray(v) && v.length >= 2 && !Array.isArray(v[0])) {
      const a = num(v[0]); const b = num(v[1]);
      if (validLon(a) && validLat(b)) return [a, b]; // GeoJSON order
    } else if (v && typeof v === 'object') {
      if (k === 'geometry' && v.type === 'Point') return coordsOf({ coordinates: v.coordinates }, depth + 1);
      const c = coordsOf(v, depth + 1);
      if (c) return c;
    }
  }
  return null;
}

const LABEL_KEYS = ['title', 'name', 'place', 'headline', 'event', 'description', 'summary', 'location', 'country', 'id'];
const CAT_KEYS = ['severity', 'type', 'category', 'level', 'status', 'confidence', 'alertLevel', 'kind', 'eventType'];
const SIZE_KEYS = ['magnitude', 'mag', 'brightness', 'frp', 'severity', 'score', 'intensity', 'fatalities', 'count', 'bestEstimate', 'value'];

const text = (v) => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : null);
function pick(o, keys, asNumber = false) {
  for (const k of keys) {
    const v = o?.[k];
    if (asNumber) { const n = num(v); if (n !== null) return n; }
    else { const t = text(v); if (t) return t; }
  }
  return undefined;
}

/** Unwrap seed envelopes `{ _seed, data }` and GeoJSON FeatureCollections into plain records. */
function normalize(payload) {
  let p = payload;
  if (p && typeof p === 'object' && '_seed' in p && 'data' in p) p = p.data;
  return p;
}

/**
 * Find coordinate-bearing records anywhere in a payload (depth-limited). Returns the largest array of such
 * records; ties keep the first found. Records are mapped to {name, lat, lon, cat?, size?, info?}.
 */
export function extractPoints(payload, { maxDepth = 5 } = {}) {
  const root = normalize(payload);
  const found = [];
  const seen = new Set();
  const visit = (v, d) => {
    if (!v || typeof v !== 'object' || d > maxDepth || seen.has(v)) return;
    seen.add(v);
    if (Array.isArray(v)) {
      const withCoords = [];
      let probed = 0;
      for (const item of v) {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          const c = coordsOf(item);
          if (c) withCoords.push([item, c]);
          probed++;
        }
        // Only give up on a long array that has shown no coordinates at all; short or mixed arrays (e.g. tech events,
        // where most records are unlocated) are scanned in full.
        if (probed >= 200 && withCoords.length === 0) break;
      }
      if (withCoords.length) {
        // Re-scan the whole array once it looks like a record list.
        const all = [];
        for (const item of v) { const c = item && typeof item === 'object' && !Array.isArray(item) ? coordsOf(item) : null; if (c) all.push([item, c]); }
        found.push(all);
      }
      for (const item of v) if (item && typeof item === 'object') visit(item, d + 1);
    } else {
      if (v.type === 'FeatureCollection' && Array.isArray(v.features)) {
        found.push(v.features.map((f) => [{ ...(f.properties ?? {}), geometry: f.geometry }, coordsOf({ geometry: f.geometry })]).filter(([, c]) => c));
      }
      for (const k of Object.keys(v)) visit(v[k], d + 1);
    }
  };
  visit(root, 0);
  if (!found.length) return [];
  const best = found.reduce((a, b) => (b.length > a.length ? b : a));
  return best.map(([o, [lon, lat]]) => ({
    name: pick(o, LABEL_KEYS) ?? '',
    lat: Math.round(lat * 1e4) / 1e4,
    lon: Math.round(lon * 1e4) / 1e4,
    cat: pick(o, CAT_KEYS),
    size: pick(o, SIZE_KEYS, true),
    info: undefined,
  }));
}

/**
 * Country -> value map from a payload: either an object keyed by ISO2/ISO3/name with numeric values, or an array of
 * records carrying a country identifier and a numeric score/count.
 */
export function extractCountryValues(payload, { maxDepth = 4 } = {}) {
  const root = normalize(payload);
  const out = new Map();
  const put = (id, value) => { const iso = toIso2(id); if (iso && value !== null && !out.has(iso)) out.set(iso, value); };
  const ID_KEYS = ['iso2', 'countryCode', 'country_code', 'code', 'iso', 'country', 'countryName', 'name', 'iso3', 'region'];
  const VAL_KEYS = ['score', 'value', 'overallScore', 'overall', 'cii', 'combinedScore', 'totalDisplaced', 'count', 'total', 'pressure', 'level', 'displaced', 'severity', 'rank'];
  const seen = new Set();
  const visit = (v, d) => {
    if (!v || typeof v !== 'object' || d > maxDepth || seen.has(v)) return;
    seen.add(v);
    if (Array.isArray(v)) {
      for (const item of v) {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          const id = ID_KEYS.map((k) => (typeof item[k] === 'string' ? item[k] : null)).find((x) => x && toIso2(x));
          const val = VAL_KEYS.map((k) => num(item[k])).find((x) => x !== null);
          if (id && val !== undefined) put(id, val);
        }
        visit(item, d + 1);
      }
    } else {
      const keys = Object.keys(v);
      const numericEntries = keys.filter((k) => num(v[k]) !== null && toIso2(k));
      if (numericEntries.length >= 3) for (const k of numericEntries) put(k, num(v[k]));
      for (const k of keys) {
        const child = v[k];
        if (child && typeof child === 'object' && !Array.isArray(child) && toIso2(k)) {
          const val = VAL_KEYS.map((vk) => num(child[vk])).find((x) => x !== null);
          if (val !== undefined) put(k, val);
        }
        visit(child, d + 1);
      }
    }
  };
  visit(root, 0);
  return out;
}

// ---- layer loading -------------------------------------------------------------------------------------
const staticLayers = () => readJson('scripts/data/map/static-layers.json').layers;

function loadFileLayer(spec) {
  if (spec.key === 'storageFacilities') {
    const j = readJson(spec.file);
    const features = Object.values(j.facilities ?? {})
      .filter((f) => f.location && Number.isFinite(f.location.lat) && Number.isFinite(f.location.lon))
      .map((f) => ({ name: f.name, lat: f.location.lat, lon: f.location.lon, cat: f.facilityType, info: [f.country, f.operator].filter(Boolean).join(' · ') }));
    return { kind: 'points', source: `${spec.file} (curated: operator disclosures, GIE, EIA, GEM)`, features };
  }
  if (spec.key === 'fuelShortages') {
    const j = readJson(spec.file);
    const values = new Map();
    for (const s of Object.values(j.shortages ?? {})) {
      const iso = toIso2(s.country);
      if (iso) values.set(iso, (values.get(iso) ?? 0) + 1);
    }
    return { kind: 'choropleth', source: `${spec.file} (curated regulator advisories)`, values, valueLabel: 'recorded shortage events' };
  }
  return null;
}

/** Expand `{YEAR}` in a key to this year and last year (seeders such as displacement suffix their key with the year). */
function expandKeys(keys, year = new Date().getUTCFullYear()) {
  return keys.flatMap((k) => (k.includes('{YEAR}') ? [k.replace('{YEAR}', year), k.replace('{YEAR}', year - 1)] : [k]));
}

/**
 * Load one layer. Returns { key, status, kind, features|values, count, source, reason?, truncated? }.
 * status: 'ok' | 'empty' | 'no_data' | 'unavailable'.
 */
export async function loadLayer(key, { readKey, now = new Date(), maxFeatures = MAX_FEATURES_DEFAULT } = {}) {
  const spec = LAYER_BY_KEY[key];
  if (!spec) return { key, status: 'unavailable', count: 0, reason: `unknown layer "${key}"` };
  if (spec.source === 'unavailable') return { key, status: 'unavailable', kind: spec.render, count: 0, reason: spec.reason };
  if (spec.source === 'computed') return { key, status: 'ok', kind: 'terminator', count: 1, source: 'computed from the current UTC time', now };

  let result;
  if (spec.source === 'static') {
    if (spec.file) result = loadFileLayer(spec);
    else {
      const l = staticLayers()[key];
      if (!l) return { key, status: 'unavailable', kind: spec.render, count: 0, reason: 'static dataset missing from scripts/data/map/static-layers.json' };
      result = { kind: l.kind, source: l.source, features: l.features };
    }
  }

  const live = { features: [], values: new Map(), keysRead: [], keysMissing: [] };
  if (spec.keys && readKey) {
    for (const k of expandKeys(spec.keys)) {
      if (spec.firstOf && (live.features.length || live.values.size)) break; // later keys are stale copies of the same data
      let payload = null;
      try { payload = await readKey(k); } catch { payload = null; }
      if (payload == null) { live.keysMissing.push(k); continue; }
      live.keysRead.push(k);
      if (spec.render === 'choropleth') {
        for (const [iso, v] of extractCountryValues(payload)) if (!live.values.has(iso)) live.values.set(iso, v);
      } else {
        live.features.push(...extractPoints(payload)); // keep reading the other keys: "natural" combines two feeds
      }
    }
  }

  if (spec.source === 'live') {
    if (spec.render === 'choropleth') {
      const count = live.values.size;
      if (!count) return noData(key, spec, live, readKey);
      return { key, status: 'ok', kind: 'choropleth', values: live.values, count, source: `Redis ${live.keysRead.join(', ')}` };
    }
    if (!live.features.length) return noData(key, spec, live, readKey);
    const { features, truncated } = cap(live.features, maxFeatures);
    return { key, status: 'ok', kind: 'points', features, count: live.features.length, truncated, source: `Redis ${live.keysRead.join(', ')}`, live: true };
  }

  // static (optionally enriched by live points)
  if (result.kind === 'choropleth') return { key, status: result.values.size ? 'ok' : 'empty', kind: 'choropleth', values: result.values, count: result.values.size, source: result.source, valueLabel: result.valueLabel };
  let features = result.features;
  let liveAdded = 0;
  if (live.features.length) { features = [...features, ...live.features.map((f) => ({ ...f, cat: f.cat ?? 'live' }))]; liveAdded = live.features.length; }
  const { features: capped, truncated } = cap(features, maxFeatures);
  return { key, status: capped.length ? 'ok' : 'empty', kind: result.kind, features: capped, count: features.length, truncated, source: result.source, liveAdded: liveAdded || undefined };
}

function noData(key, spec, live, readKey) {
  const why = !readKey
    ? 'live layer: no Redis connection was provided to the renderer'
    : live.keysRead.length
      ? `payload from ${live.keysRead.join(', ')} contained no ${spec.render === 'choropleth' ? 'country/value pairs' : 'records with coordinates'}`
      : `no data in Redis (${live.keysMissing.join(', ')}); the seeder has not run, the key is empty, or Redis is not reachable`;
  return { key, status: 'no_data', kind: spec.render, count: 0, reason: why };
}

function cap(features, max) {
  if (features.length <= max) return { features, truncated: false };
  // Keep the largest records when a size is known, else the first N.
  const sized = features.some((f) => typeof f.size === 'number');
  const sorted = sized ? [...features].sort((a, b) => (b.size ?? -Infinity) - (a.size ?? -Infinity)) : features;
  return { features: sorted.slice(0, max), truncated: true };
}

export async function loadLayers(keys, opts) {
  const out = [];
  for (const k of keys) out.push(await loadLayer(k, opts));
  return out;
}
