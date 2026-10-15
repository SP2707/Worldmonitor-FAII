#!/usr/bin/env node
// National layer for every country the World Bank reports (~215 economies, aggregates dropped): 10 categories x ~38 indicators.
// Key national:indicators:v1. Run it in the second PowerShell window while `npm start` is running (needs local Redis).
import { runSeed, loadEnvFile } from './_seed-utils.mjs';
import { ALL } from './national/indicators.mjs';
import { parseCountryList, parseIndicator, buildNational } from './national/_core.mjs';
import { UNDP_CSV_URL, IMF_SERIES, imfUrl, parseUndpCsv, parseImfSeries, attachSupplements } from './national/supplements.mjs';
import { ensureSourceFile } from './subnational/_autofetch.mjs';
import { readFileSync } from 'node:fs';

export const KEY = 'national:indicators:v1';
const WB = 'https://api.worldbank.org/v2';
const headers = { Accept: 'application/json', 'User-Agent': 'worldmonitor-faii-national/1.0' };

async function getJson(url, fetchFn, attempts = 3) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetchFn(url, { headers, signal: AbortSignal.timeout(60_000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (err) { last = err; await new Promise((res) => setTimeout(res, 1500 * (i + 1))); }
  }
  throw last;
}

export async function collect({ fetchFn = globalThis.fetch, nowMs = Date.now(), supplements = true, undpFile = null } = {}) {
  const countries = parseCountryList(await getJson(`${WB}/country?format=json&per_page=400`, fetchFn));
  if (countries.size < 150) throw new Error(`World Bank country list too short (${countries.size})`);
  const byMetric = new Map(); const errors = [];
  for (const spec of ALL) {
    try { byMetric.set(spec.metric, parseIndicator(await getJson(`${WB}/country/all/indicator/${spec.code}?format=json&mrnev=1&per_page=400`, fetchFn))); }
    catch (err) { errors.push(`${spec.code}: ${err.message}`); }
  }
  if (byMetric.size === 0) throw new Error(`no indicator loaded: ${errors.join('; ')}`);
  const national = buildNational({ countries, byMetric, errors, nowMs });
  if (supplements) await addSupplements(national, { fetchFn, errors, undpFile });
  return national;
}

// Second sources (UNDP, IMF). Each failure is recorded in `errors` and never aborts the World Bank layer.
async function addSupplements(national, { fetchFn, errors, undpFile }) {
  let undp = null;
  try {
    const path = undpFile ?? (await ensureSourceFile({ id: 'undp-hdr25', kind: 'csv', urls: [UNDP_CSV_URL], maxAgeDays: 30, minBytes: 100_000 })).path;
    undp = parseUndpCsv(readFileSync(path, 'utf8'));
  } catch (err) { errors.push(`UNDP HDR: ${String(err.message).slice(0, 200)}`); }
  const imf = new Map();
  for (const [metric, code] of IMF_SERIES) {
    try { imf.set(metric, parseImfSeries(await getJson(imfUrl(code), fetchFn), code, { nowYear: new Date(nowMsOf(national)).getUTCFullYear() })); }
    catch (err) { errors.push(`IMF ${code}: ${String(err.message).slice(0, 200)}`); }
  }
  attachSupplements(national, { undp, imf });
}
const nowMsOf = (n) => Date.parse(n.generatedAt);

if (process.argv[1]?.endsWith('seed-national.mjs')) {
  loadEnvFile(import.meta.url);
  runSeed('national', 'indicators', KEY, () => collect(), {
    validateFn: (d) => d && typeof d === 'object' && d.countryCount >= 150,
    ttlSeconds: 30 * 86400, lockTtlMs: 420_000,
    declareRecords: (d) => d.countryCount, sourceVersion: 'national-wb-v1', schemaVersion: 1, maxStaleMin: 14 * 24 * 60,
  }).catch((err) => { console.error('FATAL:', err.message || err); process.exit(1); });
}
