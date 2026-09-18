#!/usr/bin/env node
/**
 * Regional search-gap seeder. Live web search, NOT RSS.
 *
 * The RSS digest pipeline (seed-insights.mjs + friends) is built on a fixed
 * set of national/international wire feeds. That misses sparse state/city
 * level regional news — e.g. an Indian state-level story that no national
 * wire picked up. This seeder walks a small configurable watchlist of such
 * regions, runs a live web search per region (scripts/_web-search.mjs),
 * fetches a short snippet for each top result, and writes the result to
 * Redis as its own namespace (news:regional-search:v1:*) — a sibling to the
 * RSS digest, not a change to it.
 *
 * Runs on a periodic cron (e.g. every few hours — regional coverage does not
 * need the RSS digest's ~15min cadence) or manually via:
 *
 *   node scripts/seed-regional-search-gaps.mjs
 *
 * Entirely optional: with no search backend configured (see
 * scripts/_web-search.mjs — WEB_SEARCH_URL for a self-hosted SearXNG
 * instance, or the already-existing BRAVE_API_KEYS as a fallback), this
 * seeder no-ops cleanly, same as every other optional integration in this
 * codebase (SELF_HOSTING.md's "Free vs Paid" table).
 */

import { pathToFileURL } from 'node:url';

import { loadEnvFile, allSettledWithConcurrency, writeExtraKey, writeExtraKeyWithMeta } from './_seed-utils.mjs';
import { isWebSearchConfigured, webSearch, fetchSnippet } from './_web-search.mjs';

loadEnvFile(import.meta.url);

const REGION_KEY_PREFIX = 'news:regional-search:v1:';
const SUMMARY_KEY = 'news:regional-search:summary:v1';
const SEED_META_KEY = 'regional-search-gaps';
const REGION_TTL = 10_800; // 3h — matches seed-insights.mjs's CACHE_TTL cadence for comparable freshness.
const RESULTS_PER_REGION = 5;
const SNIPPET_FETCH_CONCURRENCY = 3;

// Default watchlist: Indian states, the motivating example (national/
// international wires routinely skip state-level stories). Override with
// WEB_SEARCH_REGIONS to point this at any other set of state/city/province
// level regions — format is comma-separated `Name:ISO3166-alpha2` pairs,
// e.g. `WEB_SEARCH_REGIONS=Bavaria:DE,Catalonia:ES,Ontario:CA`.
const DEFAULT_REGIONS = [
  ['Maharashtra', 'IN'],
  ['Uttar Pradesh', 'IN'],
  ['Karnataka', 'IN'],
  ['Tamil Nadu', 'IN'],
  ['West Bengal', 'IN'],
  ['Gujarat', 'IN'],
  ['Kerala', 'IN'],
  ['Punjab', 'IN'],
  ['Rajasthan', 'IN'],
  ['Bihar', 'IN'],
];

function parseRegionsEnv(raw) {
  if (!raw || !raw.trim()) return null;
  const parsed = raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [name, cc] = entry.split(':').map((s) => s?.trim());
      return name ? [name, cc || ''] : null;
    })
    .filter(Boolean);
  return parsed.length > 0 ? parsed : null;
}

function regionSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * @param {[string, string]} region [name, countryCode]
 */
async function searchRegion([name, countryCode]) {
  const query = countryCode ? `${name} ${countryCode} news today` : `${name} news today`;
  const search = await webSearch(query, { maxResults: RESULTS_PER_REGION });
  if (!search.ok) {
    return { name, countryCode, status: 'search_failed', reason: search.reason, items: [] };
  }

  const enriched = await allSettledWithConcurrency(search.results, SNIPPET_FETCH_CONCURRENCY, async (result) => {
    const snippet = await fetchSnippet(result.url);
    return {
      title: result.title,
      url: result.url,
      snippet: snippet.ok ? snippet.text.slice(0, 600) : result.snippet,
      publishedAt: result.publishedAt,
      source: result.source,
    };
  });

  const items = enriched
    .filter((r) => r.status === 'fulfilled' && r.value?.url)
    .map((r) => r.value);

  return {
    name,
    countryCode,
    status: 'ok',
    provider: search.provider,
    items,
  };
}

async function main() {
  const t0 = Date.now();

  if (!isWebSearchConfigured()) {
    console.log('[regional-search-gaps] SKIP: no search backend configured (set WEB_SEARCH_URL for self-hosted SearXNG, or BRAVE_API_KEYS)');
    return;
  }

  const regions = parseRegionsEnv(process.env.WEB_SEARCH_REGIONS) ?? DEFAULT_REGIONS;
  console.log(`[regional-search-gaps] Starting live search for ${regions.length} region(s)`);

  let ok = 0;
  let failed = 0;
  const writtenRegions = [];

  for (const region of regions) {
    const [name] = region;
    try {
      const result = await searchRegion(region);
      if (result.status !== 'ok' || result.items.length === 0) {
        failed += 1;
        console.log(`[${name}] no results (${result.status === 'ok' ? 'empty' : result.reason})`);
        continue;
      }

      const slug = regionSlug(name);
      const key = `${REGION_KEY_PREFIX}${slug}`;
      await writeExtraKey(key, {
        name: result.name,
        countryCode: result.countryCode,
        provider: result.provider,
        fetchedAt: Date.now(),
        items: result.items,
      }, REGION_TTL);

      ok += 1;
      writtenRegions.push(slug);
      console.log(`[${name}] wrote ${result.items.length} item(s) via ${result.provider}`);
    } catch (err) {
      failed += 1;
      console.error(`[${name}] FAILED: ${err?.message ?? err}`);
    }
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  await writeExtraKeyWithMeta(
    SUMMARY_KEY,
    { generatedAt: Date.now(), regionsOk: ok, regionsFailed: failed, regions: writtenRegions },
    REGION_TTL,
    ok,
    `seed-meta:${SEED_META_KEY}`,
    REGION_TTL,
  );

  console.log(`[regional-search-gaps] Done in ${elapsed}s: ok=${ok} failed=${failed}`);
  // Every configured region failing is a real problem (backend misconfigured,
  // provider down) worth a non-zero exit for run-seeders.sh's failure count.
  // Partial failure (some regions ok) is not — a single sparse region
  // returning no results is expected, not exceptional.
  if (ok === 0 && failed > 0) {
    throw new Error(`regional-search-gaps: all ${failed} region(s) failed`);
  }
}

const isMain = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) main().catch((err) => { console.error(err); process.exit(1); });

export { main, searchRegion, parseRegionsEnv, regionSlug };
