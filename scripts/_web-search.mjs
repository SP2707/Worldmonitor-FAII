// Live web search + snippet fetch, self-hosted-first.
//
// Fills the specific gap the RSS digest pipeline can't: sparse state/city-level
// regional news (e.g. Indian state coverage that national/international wires
// skip). This module is a live, on-demand capability — NOT a bulk periodic
// crawl — so it belongs next to the LLM-brief code, not inside the RSS
// pipeline itself. See scripts/seed-regional-search-gaps.mjs for the one
// concrete caller (a seed script that walks a fixed regional watchlist), and
// scripts/seed-insights.mjs / scripts/_insights-brief.mjs for the LLM-brief
// path this can also be called from directly.
//
// Provider chain, self-hosted first (mirrors the LLM_PROVIDERS chain in
// seed-insights.mjs: local/self-hosted before any cloud dependency):
//
//   1. searxng — a self-hosted SearXNG instance (https://docs.searxng.org/).
//      Free, open-source, no account, no proprietary secret — the same shape
//      as OLLAMA_API_URL. This is the ONLY provider a fully self-hosted,
//      zero-external-account install needs. Requires `search: formats: -
//      json` enabled in the instance's settings.yml (off by default on
//      public instances for abuse reasons; safe to turn on for your own).
//   2. brave — reuses BRAVE_API_KEYS, which already exists in this fork's
//      .env.example ("used by the relay's news/search loop"). Not
//      introduced fresh by this module — if you already have a Brave key
//      configured for the relay, this falls back to it automatically. Not
//      self-hostable, so it is never the only option: with neither
//      WEB_SEARCH_URL nor BRAVE_API_KEYS set, webSearch() no-ops.
//
// Both providers are optional. No WorldMonitor-hosted cloud account or
// proprietary secret is ever required or contacted — matching the same rule
// server/_shared/llm.ts's isLocalDeployment()/LOCAL_API_MODE=docker path
// enforces for LLM calls (self-hosted mode never reaches into a WorldMonitor
// cloud backend).

import { CHROME_UA } from './_seed-utils.mjs';

const DEFAULT_MAX_RESULTS = 8;
const DEFAULT_TIMEOUT_MS = 8_000;
const MAX_SNIPPET_CHARS = 2_000;
const SNIPPET_FETCH_TIMEOUT_MS = 6_000;
const MAX_SNIPPET_FETCH_BYTES = 500_000;

function clampMaxResults(value) {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_MAX_RESULTS;
  return Math.min(n, 20);
}

function timeoutMs(envValue, fallback) {
  const n = Number.parseInt(envValue, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Comma-separated key rotation, same shape as EXA_API_KEYS / COMTRADE_API_KEYS
 * elsewhere in scripts/_seed-utils.mjs callers: pick one key per call so a
 * rate-limited key doesn't wedge every subsequent search this process makes.
 */
function pickRotatingKey(csv) {
  const keys = String(csv || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
  if (keys.length === 0) return null;
  return keys[Math.floor(Math.random() * keys.length)];
}

function configuredProviders() {
  const providers = [];
  if (process.env.WEB_SEARCH_URL) providers.push('searxng');
  if (process.env.BRAVE_API_KEYS) providers.push('brave');
  return providers;
}

/**
 * @returns {boolean} true if at least one search backend is configured.
 * Callers should treat an unconfigured search as a disabled optional
 * feature (log + skip), not an error — same as every other optional
 * integration in this codebase (see SELF_HOSTING.md's "Free vs Paid" table).
 */
export function isWebSearchConfigured() {
  return configuredProviders().length > 0;
}

async function searchSearxng(query, { maxResults, timeout }) {
  const baseUrl = process.env.WEB_SEARCH_URL;
  if (!baseUrl) return null;

  const url = new URL('/search', baseUrl.replace(/\/+$/, ''));
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'json');

  const headers = { 'User-Agent': CHROME_UA, Accept: 'application/json' };
  const apiKey = process.env.WEB_SEARCH_API_KEY;
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const resp = await fetch(url, { headers, signal: AbortSignal.timeout(timeout) });
  if (!resp.ok) {
    throw new Error(`searxng ${resp.status} ${resp.statusText}`);
  }
  const data = await resp.json();
  const rawResults = Array.isArray(data?.results) ? data.results : [];

  return rawResults.slice(0, maxResults).map((r) => ({
    title: typeof r?.title === 'string' ? r.title : '',
    url: typeof r?.url === 'string' ? r.url : '',
    // SearXNG's JSON API names the snippet field `content`; fall back to a
    // couple of alternate shapes defensively rather than trusting one exact
    // schema across SearXNG versions/engines.
    snippet: typeof r?.content === 'string' ? r.content : (typeof r?.snippet === 'string' ? r.snippet : ''),
    publishedAt: typeof r?.publishedDate === 'string' ? r.publishedDate : null,
    source: typeof r?.engine === 'string' ? r.engine : 'searxng',
  })).filter((r) => r.url);
}

async function searchBrave(query, { maxResults, timeout }) {
  const key = pickRotatingKey(process.env.BRAVE_API_KEYS);
  if (!key) return null;

  const url = new URL('https://api.search.brave.com/res/v1/web/search');
  url.searchParams.set('q', query);
  url.searchParams.set('count', String(maxResults));

  const resp = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'X-Subscription-Token': key,
      'User-Agent': CHROME_UA,
    },
    signal: AbortSignal.timeout(timeout),
  });
  if (!resp.ok) {
    throw new Error(`brave ${resp.status} ${resp.statusText}`);
  }
  const data = await resp.json();
  const rawResults = Array.isArray(data?.web?.results) ? data.web.results : [];

  return rawResults.slice(0, maxResults).map((r) => ({
    title: typeof r?.title === 'string' ? r.title : '',
    url: typeof r?.url === 'string' ? r.url : '',
    snippet: typeof r?.description === 'string' ? r.description : '',
    publishedAt: typeof r?.age === 'string' ? r.age : null,
    source: 'brave',
  })).filter((r) => r.url);
}

const PROVIDERS = { searxng: searchSearxng, brave: searchBrave };

/**
 * Live web search. Self-hosted SearXNG first, then the already-configured
 * BRAVE_API_KEYS (if present) as fallback. Never throws — a missing config
 * or a failed provider degrades to `{ ok: false }` so a caller can treat
 * search as an optional enrichment, matching every other optional
 * integration in this codebase.
 *
 * @param {string} query
 * @param {{ maxResults?: number, timeoutMs?: number }} [options]
 * @returns {Promise<{ ok: true, provider: string, query: string, results: Array<{title:string,url:string,snippet:string,publishedAt:string|null,source:string}> } | { ok: false, reason: string }>}
 */
export async function webSearch(query, options = {}) {
  const trimmedQuery = String(query || '').trim();
  if (!trimmedQuery) return { ok: false, reason: 'empty_query' };

  const providers = configuredProviders();
  if (providers.length === 0) {
    return { ok: false, reason: 'not_configured' };
  }

  const maxResults = clampMaxResults(options.maxResults ?? process.env.WEB_SEARCH_MAX_RESULTS ?? DEFAULT_MAX_RESULTS);
  const timeout = timeoutMs(options.timeoutMs ?? process.env.WEB_SEARCH_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);

  let lastError = null;
  for (const providerName of providers) {
    try {
      const results = await PROVIDERS[providerName](trimmedQuery, { maxResults, timeout });
      if (results && results.length > 0) {
        return { ok: true, provider: providerName, query: trimmedQuery, results };
      }
      // Empty-but-successful response — try the next provider rather than
      // reporting a hard failure, same "advance the chain" behavior as the
      // LLM provider fallback in seed-insights.mjs.
    } catch (err) {
      lastError = err;
      console.warn(`[web-search] ${providerName} failed: ${err?.message ?? err}`);
    }
  }

  return { ok: false, reason: lastError ? 'provider_error' : 'no_results' };
}

function stripHtmlToText(html) {
  const withoutNoise = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  const text = withoutNoise
    .replace(/<\/(p|div|li|h[1-6]|br)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return text;
}

/**
 * Fetch a candidate result URL and return a bounded plain-text snippet.
 * Byte-capped read (MAX_SNIPPET_FETCH_BYTES) so a large or slow page can't
 * stall or blow up memory for what's meant to be a short excerpt — same
 * defensive shape as api/_md-url-twin.ts's readSiblingBody, reimplemented
 * locally because scripts/ ships standalone into Railway's nixpacks
 * rootDirectory=scripts container and cannot import from api/ or shared/
 * (see the import-path warning at the top of scripts/seed-insights.mjs).
 *
 * @param {string} url
 * @param {{ timeoutMs?: number, maxChars?: number }} [options]
 * @returns {Promise<{ ok: true, url: string, text: string } | { ok: false, url: string, reason: string }>}
 */
export async function fetchSnippet(url, options = {}) {
  const timeout = timeoutMs(options.timeoutMs, SNIPPET_FETCH_TIMEOUT_MS);
  const maxChars = Number.isFinite(options.maxChars) ? options.maxChars : MAX_SNIPPET_CHARS;

  let resp;
  try {
    resp = await fetch(url, {
      headers: { 'User-Agent': CHROME_UA, Accept: 'text/html,application/xhtml+xml' },
      signal: AbortSignal.timeout(timeout),
      redirect: 'follow',
    });
  } catch (err) {
    return { ok: false, url, reason: `fetch_failed: ${err?.message ?? err}` };
  }
  if (!resp.ok) {
    return { ok: false, url, reason: `http_${resp.status}` };
  }

  const contentType = resp.headers.get('content-type') || '';
  if (!/html|text/i.test(contentType)) {
    return { ok: false, url, reason: `unsupported_content_type: ${contentType}` };
  }

  if (!resp.body) {
    return { ok: false, url, reason: 'empty_body' };
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let html = '';
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      totalBytes += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (totalBytes >= MAX_SNIPPET_FETCH_BYTES) {
        try { await reader.cancel('snippet byte cap reached'); } catch { /* already closing */ }
        break;
      }
    }
  } catch (err) {
    return { ok: false, url, reason: `stream_failed: ${err?.message ?? err}` };
  } finally {
    html += decoder.decode(); // flush any pending multi-byte tail
    try { reader.releaseLock(); } catch { /* already released */ }
  }

  const text = stripHtmlToText(html).slice(0, maxChars);
  if (!text) return { ok: false, url, reason: 'no_extractable_text' };
  return { ok: true, url, text };
}
