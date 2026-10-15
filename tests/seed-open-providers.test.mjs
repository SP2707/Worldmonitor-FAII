import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runAll, buildPayload, validatePayload, declareRecords, statusReport, hostOf } from '../scripts/providers/_runner.mjs';
import { selectProviders } from '../scripts/seed-open-providers.mjs';

const NOW = new Date(Date.UTC(2026, 9, 12));
const json = (o, status = 200) => new Response(JSON.stringify(o), { status });
const mk = (id, host, extra = {}) => ({ id, name: id, publisher: `pub-${id}`, kind: 'indicator', cat: 'x', cc: '', conf: 'h', adapter: 'json', url: `https://${host}/${id}`, ...extra });
const sleep = () => Promise.resolve();

describe('runAll', () => {
  it('never runs two requests against one host at the same time, but overlaps different hosts', async () => {
    const entries = [mk('a1', 'a.test'), mk('a2', 'a.test'), mk('a3', 'a.test'), mk('b1', 'b.test'), mk('c1', 'c.test')];
    const active = new Map(); let maxA = 0; let maxAll = 0; let total = 0;
    const fetchFn = async (u) => {
      const h = new URL(u).hostname; active.set(h, (active.get(h) ?? 0) + 1); total++;
      maxA = Math.max(maxA, active.get('a.test') ?? 0); maxAll = Math.max(maxAll, total);
      await new Promise((r) => setTimeout(r, 15));
      active.set(h, active.get(h) - 1); total--;
      return json({ v: 1 });
    };
    const results = await runAll(entries, { fetchFn, concurrency: 5, perHostGapMs: 0, now: NOW, sleep });
    assert.equal(maxA, 1); assert.ok(maxAll >= 2); assert.ok(results.every((r) => r.ok));
    assert.deepEqual(results.map((r) => r.id), entries.map((e) => e.id)); // order preserved
  });
  it('reports entries starting after the deadline as skipped, not as silently missing', async () => {
    const results = await runAll([mk('a', 'a.test'), mk('b', 'b.test')], { fetchFn: async () => json({ v: 1 }), deadlineMs: Date.now() - 1, perHostGapMs: 0, sleep });
    assert.deepEqual(results.map((r) => r.error), ['skipped_deadline', 'skipped_deadline']);
  });
});

describe('buildPayload', () => {
  const entries = [mk('ok', 'ok.test'), mk('bad', 'bad.test', { kind: 'feed' })];
  const good = { id: 'ok', ok: true, status: 200, ms: 5, bytes: 10, error: null, data: { v: 1 } };
  const fail = { id: 'bad', ok: false, status: 500, ms: 5, bytes: 0, error: 'http_500', data: null };
  it('counts successes by kind and exposes errors', () => {
    const p = buildPayload({ entries, results: [good, fail], nowMs: 1000 });
    assert.equal(p.total, 2); assert.equal(p.ok, 1); assert.equal(p.failed, 1);
    assert.deepEqual(p.byKind, { indicator: { total: 1, ok: 1 }, feed: { total: 1, ok: 0 } });
    assert.equal(p.providers.bad.error, 'http_500'); assert.equal(p.providers.bad.consecutiveFailures, 1); assert.equal(p.providers.bad.host, 'bad.test');
  });
  it('keeps last-good data (flagged stale) when a provider starts failing, and counts consecutive failures', () => {
    const first = buildPayload({ entries, results: [good, { ...fail, ok: true, error: null, data: { v: 9 } }], nowMs: 1000 });
    const second = buildPayload({ entries, results: [good, fail], previous: first, nowMs: 2000 });
    assert.deepEqual(second.providers.bad.data, { v: 9 }); assert.equal(second.providers.bad.stale, true); assert.equal(second.providers.bad.lastOkAt, 1000);
    const third = buildPayload({ entries, results: [good, fail], previous: second, nowMs: 3000 });
    assert.equal(third.providers.bad.consecutiveFailures, 2);
  });
  it('a success resets the failure streak', () => {
    const prev = buildPayload({ entries, results: [good, fail], nowMs: 1 });
    const next = buildPayload({ entries, results: [good, { ...good, id: 'bad' }], previous: prev, nowMs: 2 });
    assert.equal(next.providers.bad.consecutiveFailures, 0); assert.equal(next.providers.bad.stale, undefined);
  });
});

describe('validatePayload / declareRecords', () => {
  it('refuses to publish an (almost) all-failed run so last-good data survives', () => {
    assert.equal(validatePayload({ providers: { a: {} }, ok: 4 }), false);
    assert.equal(validatePayload({ providers: { a: {} }, ok: 5 }), true);
    assert.equal(validatePayload(null), false);
    assert.equal(declareRecords({ ok: 7 }), 7);
  });
});

describe('statusReport', () => {
  it('groups failures by reason and counts distinct connected publishers', () => {
    const entries = [mk('a', 'a.test'), mk('b', 'b.test'), mk('c', 'c.test')];
    const ok = (id) => ({ id, ok: true, status: 200, ms: 1, bytes: 1, error: null, data: { v: 1 } });
    const p = buildPayload({ entries, results: [ok('a'), { id: 'b', ok: false, status: 403, ms: 1, bytes: 0, error: 'http_403', data: null }, { id: 'c', ok: false, status: null, ms: 1, bytes: 0, error: 'network:ENOTFOUND', data: null }], nowMs: 1 });
    const r = statusReport(p);
    assert.equal(r.ok, 1); assert.equal(r.connectedPublishers, 1); assert.deepEqual(r.failuresByReason, { http_403: 1, network: 1 });
    assert.equal(r.failing.length, 2);
  });
});

describe('selectProviders / hostOf', () => {
  const list = [mk('a', 'a.test'), mk('b', 'b.test', { kind: 'chain' }), mk('c', 'c.test', { cat: 'energy' })];
  it('filters by id, kind or category', () => {
    assert.deepEqual(selectProviders(list, 'a').map((p) => p.id), ['a']);
    assert.deepEqual(selectProviders(list, 'chain,energy').map((p) => p.id), ['b', 'c']);
    assert.equal(selectProviders(list, '').length, 3);
  });
  it('hostOf lower-cases and tolerates junk', () => { assert.equal(hostOf('https://EXAMPLE.test/x'), 'example.test'); assert.equal(hostOf('nope'), ''); });
});
