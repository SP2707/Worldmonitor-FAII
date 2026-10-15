import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { openHistory, snapshotPayload, readHistory, periodOf } from '../scripts/history-snapshot.mjs';

const payload = (v) => ({ divisions: {
  'US-CA': { metrics: { grp: { value: v, unit: 'USD', scope: 'division', year: 2024, source: 'FRED' }, note: { value: 'text' } } },
  'DE-BY': { metrics: { grp: { value: 5, scope: 'national' }, bad: { value: Number.NaN } } },
} });

test('history: quarter key, idempotent within a quarter, new rows next quarter, WAL, rollback on error', async () => {
  const db = await openHistory(':memory:');
  assert.equal(periodOf(new Date(Date.UTC(2026, 9, 12))), '2026Q4');
  assert.equal(snapshotPayload(db, 'grp', payload(100), new Date(Date.UTC(2026, 9, 1))), 2); // text and NaN skipped
  assert.equal(snapshotPayload(db, 'grp', payload(110), new Date(Date.UTC(2026, 10, 1))), 2); // same quarter: replaced
  assert.equal(db.prepare('SELECT count(*) c FROM observations').get().c, 2);
  assert.equal(readHistory(db, 'US-CA', 'grp')[0].value, 110);
  snapshotPayload(db, 'grp', payload(120), new Date(Date.UTC(2027, 0, 5)));
  assert.deepEqual(readHistory(db, 'US-CA', 'grp').map((r) => [r.period, r.value]), [['2026Q4', 110], ['2027Q1', 120]]);

  const boom = { divisions: { A: { metrics: { m: { value: 1 } } }, get B() { throw new Error('boom'); } } };
  assert.throws(() => snapshotPayload(db, 'x', boom), /boom/);
  assert.equal(db.prepare("SELECT count(*) c FROM observations WHERE category='x'").get().c, 0);
});

test('history file database runs in WAL mode', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'hist-'));
  const db = await openHistory(path.join(dir, 'h.db'));
  assert.equal(db.prepare('PRAGMA journal_mode').get().journal_mode, 'wal');
  db.close(); rmSync(dir, { recursive: true, force: true });
});
