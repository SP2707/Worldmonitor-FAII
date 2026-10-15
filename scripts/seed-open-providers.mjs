#!/usr/bin/env node
// Open-provider seeder: fetches every keyless endpoint in scripts/providers/registry*.mjs through the shared
// adapters and writes one summary document to `providers:open-data:v1`.
//
//   OPEN_PROVIDERS_ONLY=catalog,chain   run only those kinds / ids (comma separated)
//   OPEN_PROVIDERS_CONCURRENCY=12       global concurrency (one request at a time per host regardless)
//
// All traffic goes through the normal fetch, so SEED_TOR=1 routes it through Tor like every other seeder.
// No credentials are involved: the registry validator rejects key-bearing URLs and auth headers.

import { loadEnvFile, runSeed, readCanonicalValue, CHROME_UA } from './_seed-utils.mjs';
import { PROVIDERS } from './providers/registry.mjs';
import { collect, validatePayload, declareRecords, KEY } from './providers/_runner.mjs';

export const CANONICAL_KEY = KEY;
export const TTL_SECONDS = 3 * 86400;
export const MAX_STALE_MIN = 24 * 60;
export const BUDGET_MS = 8 * 60_000;

export function selectProviders(list, only) {
  const wanted = String(only ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!wanted.length) return list;
  return list.filter((p) => wanted.includes(p.id) || wanted.includes(p.kind) || wanted.includes(p.cat));
}

export async function run(env = process.env) {
  loadEnvFile(import.meta.url);
  const entries = selectProviders(PROVIDERS, env.OPEN_PROVIDERS_ONLY);
  const concurrency = Math.max(1, Number(env.OPEN_PROVIDERS_CONCURRENCY) || 12);
  return runSeed('providers', 'open-data', CANONICAL_KEY, async () => {
    let previous = null;
    try { previous = await readCanonicalValue(CANONICAL_KEY); } catch { /* first run, or Redis unavailable */ }
    return collect({ entries, previous, userAgent: CHROME_UA, concurrency, deadlineMs: Date.now() + BUDGET_MS });
  }, {
    validateFn: validatePayload,
    ttlSeconds: TTL_SECONDS,
    lockTtlMs: BUDGET_MS + 180_000,
    declareRecords,
    sourceVersion: 'open-providers-registry-v1',
    schemaVersion: 1,
    maxStaleMin: MAX_STALE_MIN,
  }).catch((err) => {
    console.error('FATAL:', err.message || err);
    process.exit(1);
  });
}

if (process.argv[1]?.endsWith('seed-open-providers.mjs')) run();
