// A seeded key must survive a full stop/start of the local Redis stand-in (the 4-minute hdi seed must not repeat).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import net from 'node:net';

const freePort = () => new Promise((res) => { const s = net.createServer().listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); }); });

function start(port, file) {
  const env = { ...process.env, PORT: String(port), LOCAL_REDIS_DATA_FILE: file };
  delete env.LOCAL_REDIS_TOKEN;
  const child = spawn(process.execPath, ['scripts/local-redis-rest.mjs'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('stand-in did not start')), 10_000);
    child.stdout.on('data', (b) => { if (String(b).includes('listening')) { clearTimeout(t); resolve(child); } });
    child.on('error', reject);
  });
}
const cmd = (port, args) => fetch(`http://127.0.0.1:${port}`, { method: 'POST', headers: { Authorization: 'Bearer x', 'Content-Type': 'application/json' }, body: JSON.stringify(args) }).then((r) => r.json());
const stop = (c) => new Promise((r) => { c.once('exit', r); c.kill(); });

test('a large JSON key survives stop and start', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'lrp-'));
  const file = path.join(dir, 'data.json');
  const payload = JSON.stringify({ divisions: Object.fromEntries(Array.from({ length: 636 }, (_, i) => [`D-${i}`, { metrics: { v: { value: i, year: 2024 } } }])) });
  try {
    const port = await freePort();
    let c = await start(port, file);
    assert.equal((await cmd(port, ['SET', 'subnational:test:v1', payload])).result, 'OK');
    await new Promise((r) => setTimeout(r, 600)); // save is debounced 200 ms
    await stop(c);
    c = await start(port, file);
    const got = await cmd(port, ['GET', 'subnational:test:v1']);
    await stop(c);
    assert.equal(got.result, payload);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
