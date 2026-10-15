import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildReport } from '../scripts/seed-report.mjs';

test('seed report flags failures, stale OKs, never-run and unscheduled seeders', () => {
  const now = Date.parse('2026-10-12T12:00:00Z');
  const ago = (min) => new Date(now - min * 60_000).toISOString();
  const config = { defaults: { freshMinutes: 25 }, excluded: { 'seed-x': 'no' }, tiers: { 1: [{ script: 'a' }, { script: 'b' }, { script: 'c' }, { script: 'd' }], 3: [{ script: 'e' }] } };
  const status = { refreshMinutes: 30, counts: { OK: 2 }, seeders: {
    a: { result: 'OK', finishedAt: ago(10) },
    b: { result: 'FAIL', fails: 3, lastLine: 'boom', finishedAt: ago(5) },
    c: { result: 'OK', finishedAt: ago(600) },
  } };
  const r = buildReport(status, config, ['a', 'b', 'c', 'd', 'e', 'f', 'seed-x'], now);
  assert.deepEqual(r.problems.map((p) => [p.name, p.why]), [['b', 'FAIL x3'], ['c', 'STALE']]);
  assert.deepEqual(r.neverRun, ['d']);
  assert.deepEqual(r.unscheduled, ['f']);
  assert.equal(r.error, null);
  assert.equal(buildReport({ ...status, error: 'memory-pressure' }, config, [], now).error, 'memory-pressure');
});
