// Scheduler + payload builder for the open-provider seeder. Pure apart from the injected fetchFn/sleep,
// so tests can drive it with fixtures.

import { fetchProvider } from './_adapters.mjs';

export const PAYLOAD_VERSION = 1;
export const KEY = 'providers:open-data:v1';

export function hostOf(url) {
  try { return new URL(url).hostname.toLowerCase(); } catch { return ''; }
}

/**
 * Run every entry with a global concurrency cap and one request at a time per host (with a small gap),
 * so a dozen entries on the same host never burst it. Entries that would start after the deadline are
 * reported as skipped rather than silently dropped.
 */
export async function runAll(entries, { concurrency = 12, perHostGapMs = 400, deadlineMs = Infinity, fetchFn, userAgent, now = new Date(), sleep = (ms) => new Promise((r) => setTimeout(r, ms)), onResult } = {}) {
  const results = new Array(entries.length);
  const hostTail = new Map();
  let next = 0;
  async function worker() {
    for (;;) {
      const i = next++;
      if (i >= entries.length) return;
      const entry = entries[i];
      const host = hostOf(entry.url);
      const prev = hostTail.get(host) ?? Promise.resolve();
      const run = prev.then(async () => {
        if (Date.now() > deadlineMs) return { id: entry.id, ok: false, status: null, ms: 0, bytes: 0, error: 'skipped_deadline', data: null };
        const r = await fetchProvider(entry, { fetchFn, userAgent, now, sleep });
        if (perHostGapMs > 0) await sleep(perHostGapMs);
        return r;
      });
      hostTail.set(host, run.catch(() => {}));
      results[i] = await run;
      onResult?.(results[i], entry);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(concurrency, entries.length)) }, worker));
  return results;
}

/**
 * Merge this run into the previous payload. A provider that fails keeps its last good data (marked stale),
 * so one flaky endpoint does not erase what we know; consecutiveFailures says how long it has been broken.
 */
export function buildPayload({ entries, results, previous = null, nowMs = Date.now() }) {
  const prevProviders = previous?.providers ?? {};
  const providers = {};
  const byKind = {};
  let ok = 0;
  entries.forEach((entry, i) => {
    const r = results[i];
    const prev = prevProviders[entry.id];
    const base = { id: entry.id, name: entry.name, publisher: entry.publisher, kind: entry.kind, category: entry.cat, country: entry.cc, host: hostOf(entry.url), confidence: entry.conf };
    const rec = r.ok
      ? { ...base, ok: true, status: r.status, ms: r.ms, fetchedAt: nowMs, lastOkAt: nowMs, consecutiveFailures: 0, error: null, data: r.data }
      : { ...base, ok: false, status: r.status, ms: r.ms, fetchedAt: nowMs, lastOkAt: prev?.lastOkAt ?? null, consecutiveFailures: (prev?.consecutiveFailures ?? 0) + 1, error: r.error, data: prev?.data ?? null, stale: prev?.data ? true : undefined };
    providers[entry.id] = rec;
    const bk = (byKind[entry.kind] ??= { total: 0, ok: 0 });
    bk.total++;
    if (rec.ok) { bk.ok++; ok++; }
  });
  return { version: PAYLOAD_VERSION, generatedAt: nowMs, total: entries.length, ok, failed: entries.length - ok, byKind, providers };
}

export function validatePayload(data) {
  return !!data && typeof data === 'object' && data.providers && typeof data.providers === 'object'
    && Object.keys(data.providers).length > 0 && data.ok >= 5; // an all-failed run (offline, Tor down) must not overwrite last-good data
}

export const declareRecords = (data) => data?.ok ?? 0;

export async function collect({ entries, previous = null, fetchFn, userAgent, concurrency, perHostGapMs, deadlineMs, now = new Date(), sleep }) {
  const results = await runAll(entries, { fetchFn, userAgent, concurrency, perHostGapMs, deadlineMs, now, sleep });
  return buildPayload({ entries, results, previous, nowMs: now.getTime() });
}

/** Aggregate view used by providers-status.mjs (and its tests). */
export function statusReport(payload) {
  const list = Object.values(payload?.providers ?? {});
  const byKind = {};
  const byConf = {};
  const failuresByReason = {};
  const failing = [];
  for (const p of list) {
    (byKind[p.kind] ??= { total: 0, ok: 0 }).total++;
    (byConf[p.confidence ?? '?'] ??= { total: 0, ok: 0 }).total++;
    if (p.ok) { byKind[p.kind].ok++; byConf[p.confidence ?? '?'].ok++; continue; }
    const reason = String(p.error ?? 'unknown').replace(/:.*/, '');
    failuresByReason[reason] = (failuresByReason[reason] ?? 0) + 1;
    failing.push({ id: p.id, host: p.host, error: p.error, status: p.status, consecutiveFailures: p.consecutiveFailures ?? 1, lastOkAt: p.lastOkAt ?? null });
  }
  failing.sort((a, b) => b.consecutiveFailures - a.consecutiveFailures || a.id.localeCompare(b.id));
  const ok = list.filter((p) => p.ok).length;
  const publishers = new Set(list.filter((p) => p.ok).map((p) => p.publisher));
  const hosts = new Set(list.filter((p) => p.ok).map((p) => p.host));
  return { total: list.length, ok, failed: list.length - ok, connectedPublishers: publishers.size, connectedHosts: hosts.size, byKind, byConf, failuresByReason, failing };
}
