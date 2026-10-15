// Geometry helpers for the offline map viewer: Equal Earth projection, path building with simplification,
// and the day/night terminator. Dependency-free (no d3, no topojson) so the viewer keeps working after the
// frontend packages are removed from the project.

const A1 = 1.340264;
const A2 = -0.081106;
const A3 = 0.000893;
const A4 = 0.003796;
const SQRT3_2 = Math.sqrt(3) / 2;
const RAD = Math.PI / 180;

/** Equal Earth projection (Savric et al. 2018). Returns unit-less planar coordinates, y up. */
export function equalEarth(lon, lat) {
  const phi = lat * RAD;
  const lam = lon * RAD;
  const theta = Math.asin(SQRT3_2 * Math.sin(phi));
  const t2 = theta * theta;
  const t6 = t2 * t2 * t2;
  const x = (2 * Math.sqrt(3) * lam * Math.cos(theta)) / (3 * (9 * A4 * t6 * t2 + 7 * A3 * t6 + 3 * A2 * t2 + A1));
  const y = theta * (A1 + A2 * t2 + t6 * (A3 + A4 * t2));
  return [x, y];
}

const WORLD_X = equalEarth(180, 0)[0];
const WORLD_Y = equalEarth(0, 90)[1];

/**
 * Fit a lon/lat box (default: the whole world) into a width x height canvas.
 * bbox = [minLon, minLat, maxLon, maxLat]. Height defaults to the aspect of the box.
 */
export function makeProjection({ width = 1000, height, bbox, pad = 8 } = {}) {
  let minX; let maxX; let minY; let maxY;
  if (bbox) {
    const [w, s, e, n] = bbox;
    minX = Infinity; maxX = -Infinity; minY = Infinity; maxY = -Infinity;
    for (let i = 0; i <= 8; i++) {
      for (let j = 0; j <= 8; j++) {
        const [x, y] = equalEarth(w + ((e - w) * i) / 8, s + ((n - s) * j) / 8);
        if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  } else { minX = -WORLD_X; maxX = WORLD_X; minY = -WORLD_Y; maxY = WORLD_Y; }
  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const h = height ?? Math.round((width - 2 * pad) * (spanY / spanX) + 2 * pad);
  const scale = Math.min((width - 2 * pad) / spanX, (h - 2 * pad) / spanY);
  const offX = (width - spanX * scale) / 2 - minX * scale;
  const offY = (h - spanY * scale) / 2 + maxY * scale;
  const project = (lon, lat) => {
    const [x, y] = equalEarth(lon, lat);
    return [offX + x * scale, offY - y * scale];
  };
  return { project, width, height: h, scale };
}

const f1 = (n) => (Math.round(n * 10) / 10).toString();

/**
 * Polyline path 'M x y L x y ...'. Splits where consecutive points jump more than 180 degrees of longitude
 * (the antimeridian), so a Pacific cable does not draw a streak across the whole map.
 */
export function linePath(points, project, minStepPx = 0.6) {
  let d = '';
  let prev = null;
  let last = null;
  for (const [lon, lat] of points) {
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
    const [x, y] = project(lon, lat);
    const jump = prev && Math.abs(lon - prev[0]) > 180;
    if (!prev || jump) { d += `M${f1(x)} ${f1(y)}`; last = [x, y]; }
    else if (Math.abs(x - last[0]) + Math.abs(y - last[1]) >= minStepPx) { d += `L${f1(x)} ${f1(y)}`; last = [x, y]; }
    prev = [lon, lat];
  }
  return d;
}

/** Closed ring path with simplification; returns '' for rings that collapse to (almost) nothing. */
export function ringPath(ring, project, { minStepPx = 0.7, minAreaPx = 1.2 } = {}) {
  const pts = [];
  let last = null;
  for (const [lon, lat] of ring) {
    const [x, y] = project(lon, lat);
    if (!last || Math.abs(x - last[0]) + Math.abs(y - last[1]) >= minStepPx) { pts.push([x, y]); last = [x, y]; }
  }
  if (pts.length < 3) return '';
  let a = 0;
  for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i]; const [x2, y2] = pts[(i + 1) % pts.length]; a += x1 * y2 - x2 * y1; }
  if (Math.abs(a / 2) < minAreaPx) return '';
  return `M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L')}Z`;
}

/** Path for a GeoJSON Polygon/MultiPolygon geometry. */
export function geometryPath(geometry, project, opts) {
  if (!geometry) return '';
  const polys = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.type === 'MultiPolygon' ? geometry.coordinates : [];
  return polys.map((poly) => poly.map((ring) => ringPath(ring, project, opts)).join('')).join('');
}

/** Approximate subsolar point (declination from the day of year, equation of time from a standard series). */
export function subsolarPoint(date = new Date()) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = (date.getTime() - start) / 86_400_000;
  const g = (2 * Math.PI / 365) * (dayOfYear - 1 + (date.getUTCHours() - 12) / 24);
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const eotMin = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  let lon = -15 * (utcHours - 12 + eotMin / 60);
  lon = ((lon + 540) % 360) - 180;
  return { lat: decl / RAD, lon };
}

/** Night-side polygon ring as [lon, lat] pairs (the pole in darkness closes the shape). */
export function nightRing(date = new Date(), stepDeg = 3) {
  const { lat: sunLat, lon: sunLon } = subsolarPoint(date);
  const decl = sunLat * RAD;
  const ring = [];
  for (let lon = -180; lon <= 180; lon += stepDeg) {
    const h = (lon - sunLon) * RAD;
    // Terminator latitude where the sun is on the horizon; guard the equinox (tan(decl) -> 0).
    const lat = Math.abs(decl) < 1e-6 ? (Math.cos(h) > 0 ? -90 : 90) : Math.atan(-Math.cos(h) / Math.tan(decl)) / RAD;
    ring.push([lon, lat]);
  }
  const nightPole = sunLat >= 0 ? -90 : 90;
  ring.push([180, nightPole], [-180, nightPole]);
  return ring;
}
