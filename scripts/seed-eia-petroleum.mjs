#!/usr/bin/env node
// @ts-check

import { loadEnvFile, runSeed } from './_seed-utils.mjs';

loadEnvFile(import.meta.url);

export const CANONICAL_KEY = 'energy:eia-petroleum:v1';
const TTL_SECONDS = 7 * 86400; // 7d — covers one weekly EIA cycle + buffer
const FETCH_TIMEOUT_MS = 15_000;

export const SERIES = /** @type {const} */ ({
  wti:        'PET.RWTC.W',    // WTI spot price, weekly
  brent:      'PET.RBRTE.W',   // Brent spot price, weekly
  production: 'PET.WCRFPUS2.W',// US crude oil production, weekly
  inventory:  'PET.WCESTUS1.W',// US commercial crude inventory, weekly
});

/**
 * @typedef {{ current: number, previous: number | null, date: string, unit: string }} SeriesPoint
 * @typedef {Partial<Record<keyof typeof SERIES, SeriesPoint>>} EiaPetroleum
 */

/**
 * Parse a single EIA `/v2/seriesid/:id?num=2` response into a SeriesPoint.
 * Returns null when the response has no usable current value.
 *
 * @param {unknown} payload
 * @returns {SeriesPoint | null}
 */
export function parseSeries(payload) {
  const values = /** @type {any} */ (payload)?.response?.data;
  if (!Array.isArray(values) || values.length === 0) return null;
  const current = Number(values[0]?.value);
  if (!Number.isFinite(current)) return null;
  const previousRaw = values[1]?.value;
  const previous = previousRaw == null ? null : (() => {
    const n = Number(previousRaw);
    return Number.isFinite(n) ? n : null;
  })();
  return {
    current,
    previous,
    date: String(values[0]?.period ?? ''),
    unit: String(values[0]?.unit ?? ''),
  };
}

/**
 * @param {EiaPetroleum | null | undefined} agg
 * @returns {number}
 */
export function countSeries(agg) {
  if (!agg) return 0;
  return Object.values(agg).filter(v => v != null).length;
}

/**
 * Accept when at least one of the four series returned a usable point.
 * Rejects only the fully-empty case (all 4 upstream calls failed).
 *
 * @param {EiaPetroleum | null | undefined} agg
 */
export function validatePetroleum(agg) {
  return countSeries(agg) >= 1;
}

/**
 * FRED mirrors the same EIA weekly petroleum series and serves them as CSV
 * from fredgraph.csv with NO API key and no account. This replaces the old
 * EIA_API_KEY-gated api.eia.gov/v2 call; payload shape is unchanged.
 * Units are kept in EIA's own spelling so existing consumers see no change.
 */
export const FRED_SERIES = /** @type {const} */ ({
  wti:        { id: 'WCOILWTICO',   unit: '$/BBL' },
  brent:      { id: 'WCOILBRENTEU', unit: '$/BBL' },
});

/**
 * Checked live against fredgraph.csv: WCRFPUS2 (US crude production) and WCESTUS1
 * (US crude stocks) return HTTP 404 - FRED no longer carries them, and the EIA
 * API that does needs a key. They are therefore omitted rather than requested on
 * every run; the payload simply has no `production` / `inventory` until a keyless
 * source is found. wti and brent were confirmed live (HTTP 200, current data).
 */
export const UNAVAILABLE_KEYLESS = /** @type {const} */ (['production', 'inventory']);

/**
 * Parse a FRED fredgraph.csv body ("observation_date,ID" or "DATE,ID" header,
 * "." for missing values) into the two newest usable observations.
 *
 * @param {string} csv
 * @param {string} unit
 * @returns {SeriesPoint | null}
 */
export function parseFredCsv(csv, unit) {
  if (typeof csv !== 'string') return null;
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return null;
  const rows = [];
  for (let i = lines.length - 1; i >= 1 && rows.length < 2; i--) {
    const [date, raw] = lines[i].split(',');
    const n = Number(raw);
    if (!date || raw == null || raw.trim() === '' || raw.trim() === '.' || !Number.isFinite(n)) continue;
    rows.push({ date: date.trim(), value: n });
  }
  if (rows.length === 0) return null;
  return { current: rows[0].value, previous: rows[1]?.value ?? null, date: rows[0].date, unit };
}

/**
 * @param {string} key
 * @param {{ id: string, unit: string }} spec
 * @returns {Promise<SeriesPoint | null>}
 */
async function fetchOne(key, spec) {
  const since = new Date(Date.now() - 120 * 86400_000).toISOString().slice(0, 10);
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${spec.id}&cosd=${since}`;
  try {
    const resp = await fetch(url, {
      headers: { Accept: 'text/csv', 'User-Agent': 'Mozilla/5.0 (compatible; worldmonitor-faii)' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!resp.ok) {
      console.warn(`  [FRED] ${key} HTTP ${resp.status}`);
      return null;
    }
    const parsed = parseFredCsv(await resp.text(), spec.unit);
    if (!parsed) console.warn(`  [FRED] ${key} no usable values`);
    return parsed;
  } catch (err) {
    console.warn(`  [FRED] ${key} fetch error: ${(err instanceof Error ? err.message : String(err))}`);
    return null;
  }
}

/**
 * @returns {Promise<EiaPetroleum>}
 */
async function fetchEiaPetroleum() {
  const entries = /** @type {[keyof typeof FRED_SERIES, { id: string, unit: string }][]} */ (Object.entries(FRED_SERIES));
  const pairs = await Promise.all(
    entries.map(async ([key, spec]) => /** @type {const} */ ([key, await fetchOne(key, spec)])),
  );

  /** @type {EiaPetroleum} */
  const agg = {};
  for (const [key, value] of pairs) {
    if (value) agg[key] = value;
  }
  return agg;
}

/**
 * @param {EiaPetroleum} data
 */
export function declareRecords(data) {
  return countSeries(data);
}

const isMain = process.argv[1]?.endsWith('seed-eia-petroleum.mjs');

if (isMain) {
  runSeed('energy', 'eia-petroleum', CANONICAL_KEY, fetchEiaPetroleum, {
    validateFn: validatePetroleum,
    ttlSeconds: TTL_SECONDS,
    sourceVersion: 'fred-eia-petroleum-v3',
    recordCount: (data) => countSeries(data),
    declareRecords,
    schemaVersion: 1,
    maxStaleMin: 4320, // 72h — daily bundle; tolerates 3 missed ticks
  }).catch((err) => {
    const cause = err.cause ? ` (cause: ${err.cause.message || err.cause.code || err.cause})` : '';
    console.error('FATAL:', (err.message || err) + cause);
    process.exit(1);
  });
}
