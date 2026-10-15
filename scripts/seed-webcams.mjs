#!/usr/bin/env node
/**
 * Seed webcam camera metadata from OpenStreetMap (Overpass API, ODbL, no key).
 * Replaces the WINDY_API_KEY-gated Windy Webcams v3 source. OSM only has the
 * cameras mappers tagged with `contact:webcam`, so coverage is sparser than
 * Windy's; every entry carries its source URL.
 * Writes versioned geo+meta keys to Redis for spatial queries.
 *
 * Usage: node scripts/seed-webcams.mjs
 * Env:   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const PREFIX = process.env.KEY_PREFIX || '';
const OVERPASS_URLS = [
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];
const OVERPASS_QUERY = '[out:json][timeout:180];nwr["contact:webcam"];out center tags;';
const PAGE_LIMIT = 50;
const BATCH_SIZE = 500;
const GEO_TTL = 86400;
const MAX_OFFSET = 10000;

async function pipelineRequest(commands) {
  const resp = await fetch(`${REDIS_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });
  if (!resp.ok) throw new Error(`Redis pipeline failed: ${resp.status}`);
  return resp.json();
}

export function mapOsmElements(elements) {
  const cameras = [];
  for (const el of Array.isArray(elements) ? elements : []) {
    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    const tags = el.tags || {};
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !tags['contact:webcam']) continue;
    cameras.push({
      webcamId: `osm-${el.type}-${el.id}`,
      title: tags.name || tags['name:en'] || tags.operator || 'Webcam',
      lat,
      lng,
      category: tags.tourism || tags.natural || tags.amenity || 'other',
      country: tags['addr:country'] || '',
      region: tags['addr:state'] || '',
      status: 'active',
      url: tags['contact:webcam'],
    });
  }
  return cameras;
}

async function fetchOsmWebcams() {
  let lastErr = null;
  for (const endpoint of OVERPASS_URLS) {
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'worldmonitor-faii webcam seeder' },
        body: 'data=' + encodeURIComponent(OVERPASS_QUERY),
        signal: AbortSignal.timeout(200_000),
      });
      if (!resp.ok) { lastErr = new Error(`Overpass ${endpoint}: HTTP ${resp.status}`); continue; }
      const data = await resp.json();
      return mapOsmElements(data.elements);
    } catch (err) {
      lastErr = err;
      console.warn(`  [Overpass] ${endpoint}: ${err.message}`);
    }
  }
  throw lastErr ?? new Error('Overpass unavailable');
}

async function seedGeo(geoKey, cameras) {
  for (let i = 0; i < cameras.length; i += BATCH_SIZE) {
    const batch = cameras.slice(i, i + BATCH_SIZE);
    const args = [];
    for (const c of batch) {
      args.push(String(c.lng), String(c.lat), c.webcamId);
    }
    await pipelineRequest([['GEOADD', geoKey, ...args]]);
  }
}

async function seedMeta(metaKey, cameras) {
  for (let i = 0; i < cameras.length; i += BATCH_SIZE) {
    const batch = cameras.slice(i, i + BATCH_SIZE);
    const args = [];
    for (const c of batch) {
      const { webcamId, ...meta } = c;
      args.push(webcamId, JSON.stringify(meta));
    }
    await pipelineRequest([['HSET', metaKey, ...args]]);
  }
}

async function main() {
  if (!REDIS_URL || !REDIS_TOKEN) {
    console.error('Redis credentials not set');
    process.exit(1);
  }
  console.log('seed-webcams: starting...');

  const allCameras = await fetchOsmWebcams();
  console.log(`  OSM: ${allCameras.length} cameras`);

  // Deduplicate by webcamId
  const seen = new Set();
  const unique = [];
  for (const c of allCameras) {
    if (!seen.has(c.webcamId)) {
      seen.add(c.webcamId);
      unique.push(c);
    }
  }
  console.log(`  Total unique: ${unique.length}`);

  if (unique.length === 0) {
    console.log('seed-webcams: no cameras found, skipping');
    return;
  }

  // Versioned write
  const version = Date.now();
  const geoKey = `${PREFIX}webcam:cameras:geo:${version}`;
  const metaKey = `${PREFIX}webcam:cameras:meta:${version}`;
  const activeKey = `${PREFIX}webcam:cameras:active`;

  console.log(`  Writing geo index (${unique.length} entries)...`);
  await seedGeo(geoKey, unique);

  console.log(`  Writing metadata...`);
  await seedMeta(metaKey, unique);

  // Set TTL on data keys
  await pipelineRequest([
    ['EXPIRE', geoKey, String(GEO_TTL)],
    ['EXPIRE', metaKey, String(GEO_TTL)],
  ]);

  // Atomic pointer swap
  const oldVersion = await pipelineRequest([['GET', activeKey]]);
  await pipelineRequest([['SET', activeKey, String(version)]]);
  // Set TTL on active pointer AFTER the SET — 30h outlives the 24h data keys
  await pipelineRequest([
    ['EXPIRE', activeKey, String(GEO_TTL + 21600)],  // 30h — outlives data keys
  ]);
  console.log(`  Activated version ${version}`);

  // Clean up old version
  const prev = oldVersion?.[0]?.result;
  if (prev && String(prev) !== String(version)) {
    await pipelineRequest([
      ['DEL', `${PREFIX}webcam:cameras:geo:${prev}`],
      ['DEL', `${PREFIX}webcam:cameras:meta:${prev}`],
    ]);
    console.log(`  Cleaned up old version ${prev}`);
  }

  const seedMetaKey = `${PREFIX}seed-meta:webcam:cameras:geo`;
  const seedMetaVal = JSON.stringify({ fetchedAt: Date.now(), recordCount: unique.length });
  await pipelineRequest([['SET', seedMetaKey, seedMetaVal, 'EX', '604800']]);

  console.log(`seed-webcams: done (${unique.length} cameras seeded)`);
}

if (process.argv[1]?.endsWith('seed-webcams.mjs')) {
  main().then(() => {
    process.exit(0);
  }).catch(err => {
    console.error('seed-webcams: fatal error:', err.message);
    process.exit(1);
  });
}
