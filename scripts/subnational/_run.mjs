// Shared runner used by the 10 thin seed-subnational-*.mjs scripts. Each script
// only declares its providers (best source first) and optional derive hook.

import { runSeed, readCanonicalValue, loadEnvFile } from '../_seed-utils.mjs';
import { CATEGORIES } from './_registry.mjs';
import { runProviders, buildPayload, validatePayload, declareRecords } from './_core.mjs';

export const TTL_SECONDS = 30 * 86400;        // data outlives the 14d staleness gate
export const MAX_STALE_MIN = 14 * 24 * 60;

const defaultRead = (key) => readCanonicalValue(key);

/** Pure-ish collection step (tests inject fetchFn/previous/nowMs). */
export async function collectCategory({ slug, providers, derive, deriveAll, siblings: siblingSlugs = [], auxMetrics, previous = null, budgetMs = 240_000, env = process.env, fetchFn, nowMs = Date.now(), sleep, readKey }) {
  const cat = CATEGORIES[slug];
  if (!cat) throw new Error(`unknown subnational category ${slug}`);
  const ctx = { fetchFn, env, previous, nowMs, deadlineMs: Date.now() + budgetMs, sleep, readKey };
  const { observations, reports } = await runProviders(providers, ctx);
  // Other categories' last-good payloads, for cross-category derivations (best effort).
  const siblings = {};
  for (const sib of siblingSlugs) {
    try { siblings[sib] = await (readKey ?? defaultRead)(CATEGORIES[sib].key); } catch { /* derivation is skipped */ }
  }
  return buildPayload({ category: slug, title: cat.title, previous, observations, reports, nowMs, derive, deriveAll, siblings, auxMetrics });
}

export function runCategorySeeder({ slug, scriptUrl, providers, derive, deriveAll, siblings, auxMetrics, budgetMs = 240_000, sourceVersion }) {
  loadEnvFile(scriptUrl);
  const cat = CATEGORIES[slug];
  return runSeed('subnational', slug, cat.key, async () => {
    let previous = null;
    try { previous = await readCanonicalValue(cat.key); } catch { /* first run or redis unavailable */ }
    return collectCategory({ slug, providers, derive, deriveAll, siblings, auxMetrics, previous, budgetMs });
  }, {
    validateFn: validatePayload,
    ttlSeconds: TTL_SECONDS,
    lockTtlMs: budgetMs + 120_000,
    declareRecords,
    sourceVersion,
    schemaVersion: 1,
    maxStaleMin: MAX_STALE_MIN,
  }).catch((err) => {
    const cause = err.cause ? ` (cause: ${err.cause.message || err.cause.code || err.cause})` : '';
    console.error('FATAL:', (err.message || err) + cause);
    process.exit(1);
  });
}

export function isMainScript(name) {
  return process.argv[1]?.endsWith(name);
}
