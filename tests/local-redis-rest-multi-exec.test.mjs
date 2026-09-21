// /multi-exec on the local Upstash-REST stand-in. server/_shared/redis.ts
// (runRedisTransaction, prependCachedJsonList) POSTs command arrays there; before
// this route existed it fell through to 404 and every atomic publish silently failed.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const dir = mkdtempSync(path.join(tmpdir(), 'lrr-'));
process.env.LOCAL_REDIS_DATA_FILE = path.join(dir, 'data.json'); // never touch the real store
delete process.env.LOCAL_REDIS_TOKEN;
const { server } = await import('../scripts/local-redis-rest.mjs');

let base;
before(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((r) => server.close(r));
  rmSync(dir, { recursive: true, force: true });
});

const post = (p, body, token = 'x') =>
  fetch(base + p, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

test('POST /multi-exec returns one {result} per command and applies them in order', async () => {
  const res = await post('/multi-exec', [
    ['SET', 'me:a', 'one', 'EX', '60'],
    ['SET', 'me:b', JSON.stringify('__WM_NEG__'), 'EX', '60'],
    ['GET', 'me:a'],
  ]);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data));
  assert.equal(data.length, 3);
  assert.deepEqual(data[0], { result: 'OK' });
  assert.deepEqual(data[1], { result: 'OK' });
  assert.deepEqual(data[2], { result: 'one' });
});

test('response shape matches /pipeline for the same commands', async () => {
  const cmds = [['SET', 'me:p', 'v'], ['GET', 'me:p']];
  const a = await (await post('/pipeline', cmds)).json();
  const b = await (await post('/multi-exec', cmds)).json();
  assert.deepEqual(b, a);
});

test('satisfies the checks in runRedisTransaction / _lastgood-store transactionSucceeded', async () => {
  const data = await (await post('/multi-exec', [['SET', 'me:x', '1'], ['SET', 'me:y', '2']])).json();
  assert.equal(data.length, 2);
  assert.ok(data.every((r) => !r.error && r.result !== null));
});

test('malformed body is rejected whole, with no partial execution', async () => {
  const res = await post('/multi-exec', [['SET', 'me:partial', 'x'], 'not-a-command']);
  assert.equal(res.status, 400);
  const got = await (await fetch(`${base}/get/me:partial`, { headers: { Authorization: 'Bearer x' } })).json();
  assert.equal(got.result, null);
});

test('non-array body is a 400', async () => {
  assert.equal((await post('/multi-exec', { nope: 1 })).status, 400);
});

test('auth still applies', async () => {
  const res = await fetch(`${base}/multi-exec`, { method: 'POST', body: '[]' });
  assert.equal(res.status, 401);
});
