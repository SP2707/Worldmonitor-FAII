import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { buildCurlArgs, curlBinary, curlFetch } from '../scripts/subnational/_curl.mjs';

const hasCurl = spawnSync(curlBinary(), ['--version']).status === 0;

describe('curl transport', () => {
  it('builds args: output file, status code, one -H per header, url last', () => {
    const a = buildCurlArgs('https://x.test/a?b=1', { headers: { Accept: 'text/csv', 'User-Agent': 'ua' }, timeoutSec: 30, outFile: '/tmp/o' });
    assert.deepEqual(a.slice(0, 9), ['-sS', '-L', '--compressed', '--max-time', '30', '-o', '/tmp/o', '-w', '%{http_code}']);
    assert.ok(a.includes('Accept: text/csv') && a.includes('User-Agent: ua'));
    assert.equal(a.at(-1), 'https://x.test/a?b=1');
    assert.equal(curlBinary('win32'), 'curl.exe');
    assert.equal(curlBinary('linux'), 'curl');
  });

  it('falls back to the built-in fetch when curl is not installed', async () => {
    let called = null;
    const r = await curlFetch('https://x.test/', { headers: { A: 'b' } }, {
      bin: 'definitely-not-a-real-binary',
      fallback: async (u, i) => { called = [u, i.headers]; return new Response('fb', { status: 200 }); },
    });
    assert.equal(await r.text(), 'fb');
    assert.deepEqual(called, ['https://x.test/', { A: 'b' }]);
  });

  it('returns status and body from a real HTTP exchange, including non-200', { skip: !hasCurl && 'curl not available' }, async () => {
    const seen = [];
    const server = createServer((req, res) => {
      seen.push({ url: req.url, accept: req.headers.accept });
      if (req.url.startsWith('/bad')) { res.statusCode = 500; res.end('Internal server error'); return; }
      res.setHeader('content-type', 'text/csv');
      res.end('a,b\n1,2\n');
    });
    await new Promise((r) => server.listen(0, '127.0.0.1', r));
    const base = `http://127.0.0.1:${server.address().port}`;
    try {
      const ok = await curlFetch(`${base}/data?x=1&y=2`, { headers: { Accept: 'text/csv' } });
      assert.equal(ok.status, 200);
      assert.equal(await ok.text(), 'a,b\n1,2\n');
      assert.equal(seen[0].url, '/data?x=1&y=2');
      assert.equal(seen[0].accept, 'text/csv');
      const bad = await curlFetch(`${base}/bad`);
      assert.equal(bad.status, 500);
      assert.equal(await bad.text(), 'Internal server error');
    } finally { server.close(); }
  });

  it('throws on a transport failure instead of returning a fake response', { skip: !hasCurl && 'curl not available' }, async () => {
    await assert.rejects(curlFetch('http://127.0.0.1:1/'), /curl failed/);
  });
});
