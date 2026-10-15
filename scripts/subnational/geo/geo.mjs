// Point -> division assignment from vendored Natural Earth admin-1 boundaries
// (public domain). `divisions-geo.json.gz` holds, per registry id, its polygons
// (bbox + rings, coordinates rounded to 3 decimals ~ 100 m). Natural Earth is a
// 1:10m generalisation, so points within a few km of a coast or border may miss
// every polygon; those fall back to the nearest division of the SAME country
// within MAX_NEAREST_DEG and are reported with method 'nearest'. Never guesses
// across countries.

import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BY_ID } from '../_registry.mjs';

const here = dirname(fileURLToPath(import.meta.url));
export const MAX_NEAREST_DEG = 0.3;
const CELL = 10;

function pointInRing(x, y, ring) {
  let inside = false;
  const n = ring.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = ring[2 * i], yi = ring[2 * i + 1], xj = ring[2 * j], yj = ring[2 * j + 1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function pointInPoly(x, y, poly) {
  const b = poly.bbox;
  if (x < b[0] || x > b[2] || y < b[1] || y > b[3]) return false;
  if (!pointInRing(x, y, poly.rings[0])) return false;
  for (let h = 1; h < poly.rings.length; h++) if (pointInRing(x, y, poly.rings[h])) return false;
  return true;
}

let cached = null;
export function loadGeo(path = join(here, 'divisions-geo.json.gz')) {
  if (cached && path === cached.path) return cached;
  const meta = JSON.parse(gunzipSync(readFileSync(path)).toString('utf8'));
  const grid = new Map();
  const polysById = new Map();
  for (const [id, polys] of Object.entries(meta.divisions)) {
    polysById.set(id, polys);
    for (const poly of polys) {
      const [x0, y0, x1, y1] = poly.bbox;
      for (let cx = Math.floor(x0 / CELL); cx <= Math.floor(x1 / CELL); cx++) {
        for (let cy = Math.floor(y0 / CELL); cy <= Math.floor(y1 / CELL); cy++) {
          const k = `${cx},${cy}`;
          if (!grid.has(k)) grid.set(k, []);
          grid.get(k).push({ id, poly });
        }
      }
    }
  }
  cached = { path, meta, grid, polysById };
  return cached;
}

/** Degrees (equirectangular) from a point to the nearest vertex of any ring of a division. */
function nearestVertexDeg(x, y, polys) {
  let best = Infinity;
  const kx = Math.cos((y * Math.PI) / 180);
  for (const poly of polys) {
    const r = poly.rings[0];
    for (let i = 0; i < r.length; i += 2) {
      const dx = (r[i] - x) * kx, dy = r[i + 1] - y;
      const d = Math.hypot(dx, dy);
      if (d < best) best = d;
    }
  }
  return best;
}

/**
 * @returns {{id:string, method:'contains'|'nearest'}|null}
 * @param {number} lon @param {number} lat
 * @param {{country?:string}} [opts] ISO2; required for the nearest fallback
 */
export function locate(lon, lat, opts = {}) {
  if (!Number.isFinite(lon) || !Number.isFinite(lat) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  const { grid, polysById } = loadGeo();
  const cell = grid.get(`${Math.floor(lon / CELL)},${Math.floor(lat / CELL)}`) ?? [];
  // Overlaps happen (e.g. Moscow city inside Moscow Oblast): prefer the smallest containing polygon.
  let hit = null;
  for (const { id, poly } of cell) {
    if (!pointInPoly(lon, lat, poly)) continue;
    const area = (poly.bbox[2] - poly.bbox[0]) * (poly.bbox[3] - poly.bbox[1]);
    if (!hit || area < hit.area) hit = { id, area };
  }
  if (hit) return { id: hit.id, method: 'contains' };
  if (opts.country) {
    let best = null;
    for (const [id, polys] of polysById) {
      if (BY_ID.get(id)?.country !== opts.country) continue;
      const d = nearestVertexDeg(lon, lat, polys);
      if (d <= MAX_NEAREST_DEG && (!best || d < best.d)) best = { id, d };
    }
    if (best) return { id: best.id, method: 'nearest' };
  }
  return null;
}
