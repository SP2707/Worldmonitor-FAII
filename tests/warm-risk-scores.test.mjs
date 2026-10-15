import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../scripts/warm-risk-scores.mjs', import.meta.url));
const run = (env) => new Promise((resolve) => {
  const c = spawn(process.execPath, [script], { env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
  let out = ''; c.stdout.on('data', (d) => { out += d; }); c.stderr.on('data', (d) => { out += d; });
  c.on('close', (code) => resolve({ code, out }));
});

test('warm-risk-scores: skips without a token, sends the bearer token, fails loudly on HTTP errors', async () => {
  const seen = [];
  let status = 200;
  const srv = http.createServer((req, res) => { seen.push([req.url, req.headers.authorization]); res.statusCode = status; res.end('{"ciiScores":[]}'); });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const port = String(srv.address().port);
  try {
    const none = await run({ LOCAL_API_TOKEN: '', LOCAL_API_PORT: port });
    assert.equal(none.code, 0); assert.match(none.out, /not set/); assert.equal(seen.length, 0);
    const ok = await run({ LOCAL_API_TOKEN: 'tok', LOCAL_API_PORT: port });
    assert.equal(ok.code, 0); assert.match(ok.out, /warmed risk scores/);
    assert.deepEqual(seen[0], ['/api/intelligence/v1/get-risk-scores', 'Bearer tok']);
    status = 500;
    const bad = await run({ LOCAL_API_TOKEN: 'tok', LOCAL_API_PORT: port });
    assert.equal(bad.code, 1); assert.match(bad.out, /HTTP 500/);
  } finally { await new Promise((r) => srv.close(r)); }
});
