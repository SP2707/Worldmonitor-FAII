// Tests the Tor layer against a MOCK SOCKS5 server (no real Tor needed). Real-Tor behaviour is
// checked on your machine with `node scripts/tor-check.mjs`.
import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import http from 'node:http';
import zlib from 'node:zlib';

import { createTor, isLocalHost, findTorProxy, socks5Connect } from '../scripts/shared/tor-fetch.mjs';

function listen(server) { return new Promise((res) => server.listen(0, '127.0.0.1', () => res(server.address().port))); }

/** Mock SOCKS5: records requests, maps every destination to `target` (127.0.0.1:port), can refuse hosts. */
async function mockSocks({ target, refuse = [] }) {
  const log = { connects: [], auth: [] };
  const server = net.createServer((c) => {
    let buf = Buffer.alloc(0); let stage = 0;
    c.on('error', () => {});
    c.on('data', (d) => {
      buf = Buffer.concat([buf, d]);
      for (;;) {
        if (stage === 0) {
          if (buf.length < 2 || buf.length < 2 + buf[1]) return;
          const methods = [...buf.subarray(2, 2 + buf[1])]; buf = buf.subarray(2 + buf[1]);
          if (methods.includes(2)) { c.write(Buffer.from([5, 2])); stage = 1; } else { c.write(Buffer.from([5, 0])); stage = 2; }
        } else if (stage === 1) {
          if (buf.length < 2) return; const ul = buf[1]; if (buf.length < 3 + ul) return; const pl = buf[2 + ul]; if (buf.length < 3 + ul + pl) return;
          log.auth.push({ user: buf.subarray(2, 2 + ul).toString(), pass: buf.subarray(3 + ul, 3 + ul + pl).toString() });
          buf = buf.subarray(3 + ul + pl); c.write(Buffer.from([1, 0])); stage = 2;
        } else if (stage === 2) {
          if (buf.length < 5) return; const atyp = buf[3];
          let host; let off;
          if (atyp === 3) { const l = buf[4]; if (buf.length < 5 + l + 2) return; host = buf.subarray(5, 5 + l).toString(); off = 5 + l; }
          else if (atyp === 1) { if (buf.length < 10) return; host = [...buf.subarray(4, 8)].join('.'); off = 8; }
          else return c.destroy();
          const port = buf.readUInt16BE(off); buf = buf.subarray(off + 2);
          log.connects.push({ atyp, host, port });
          if (refuse.includes(host)) { c.write(Buffer.from([5, 5, 0, 1, 0, 0, 0, 0, 0, 0])); return c.end(); }
          const up = net.connect({ host: '127.0.0.1', port: target() });
          up.on('error', () => c.destroy());
          up.once('connect', () => { c.write(Buffer.from([5, 0, 0, 1, 0, 0, 0, 0, 0, 0])); if (buf.length) up.write(buf); c.pipe(up); up.pipe(c); });
          c.removeAllListeners('data'); return;
        }
      }
    });
  });
  const port = await listen(server);
  return { port, log, close: () => new Promise((r) => server.close(r)) };
}

async function setup(envExtra = {}) {
  const hits = [];
  const web = http.createServer(async (req, res) => {
    const chunks = []; for await (const c of req) chunks.push(c);
    hits.push({ method: req.method, url: req.url, host: req.headers.host, ua: req.headers['user-agent'], body: Buffer.concat(chunks).toString() });
    if (req.url === '/redir') { res.writeHead(302, { location: '/final' }); return res.end(); }
    if (req.url === '/gz') { res.writeHead(200, { 'content-encoding': 'gzip', 'content-type': 'application/json' }); return res.end(zlib.gzipSync('{"ok":true}')); }
    if (req.url === '/slow') return; // never answers
    res.writeHead(200, { 'content-type': 'text/plain', 'x-multi': 'a' }); res.end(`hello ${req.url}`);
  });
  const webPort = await listen(web);
  const socks = await mockSocks({ target: () => webPort, refuse: ['blocked.test'] });
  const env = { SEED_TOR: '1', SEED_TOR_SOCKS: `127.0.0.1:${socks.port}`, ...envExtra };
  const realCalls = [];
  const tor = createTor(env, async (...a) => { realCalls.push(a[0]); return new Response('direct'); }, { log: () => {} });
  return { hits, web, socks, tor, realCalls, close: async () => { web.closeAllConnections?.(); await new Promise((r) => web.close(r)); await socks.close(); } };
}

test('tor: a request reaches the origin only through SOCKS5, with the hostname sent to the proxy (no local DNS)', async () => {
  const t = await setup();
  try {
    const r = await t.tor.fetch('http://example.test/path?x=1');
    assert.equal(r.status, 200);
    assert.equal(await r.text(), 'hello /path?x=1');
    assert.equal(r.headers.get('x-multi'), 'a');
    assert.deepEqual(t.socks.log.connects, [{ atyp: 3, host: 'example.test', port: 80 }]);
    assert.equal(t.hits[0].host, 'example.test');
    assert.equal(t.realCalls.length, 0);
  } finally { await t.close(); }
});

test('tor: circuit isolation credentials are sent, per process', async () => {
  const t = await setup();
  try {
    await t.tor.fetch('http://example.test/a');
    assert.equal(t.socks.log.auth.length, 1);
    assert.match(t.socks.log.auth[0].user, /^wm-\d+$/);
    assert.equal(t.socks.log.auth[0].pass.length, 16);
  } finally { await t.close(); }
  const t2 = await setup({ SEED_TOR_ISOLATE: '0' });
  try { await t2.tor.fetch('http://example.test/a'); assert.equal(t2.socks.log.auth.length, 0); } finally { await t2.close(); }
});

test('tor: POST body, redirects (302 -> GET), gzip decoding, one User-Agent for everything', async () => {
  const t = await setup({ SEED_USER_AGENT: 'wm-test-ua' });
  try {
    const p = await t.tor.fetch('http://example.test/post', { method: 'POST', body: 'data=1', headers: { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': 'something-identifying' } });
    assert.equal(await p.text(), 'hello /post');
    assert.equal(t.hits[0].body, 'data=1');
    assert.equal(t.hits[0].ua, 'wm-test-ua', 'caller UA replaced when SEED_USER_AGENT is set');
    const r = await t.tor.fetch('http://example.test/redir');
    assert.equal(await r.text(), 'hello /final');
    assert.equal(r.url, 'http://example.test/final');
    const g = await t.tor.fetch('http://example.test/gz');
    assert.deepEqual(await g.json(), { ok: true });
  } finally { await t.close(); }
});

test('tor: FAIL CLOSED - proxy down means the request errors and the origin is never contacted', async () => {
  const hits = [];
  const web = http.createServer((req, res) => { hits.push(req.url); res.end('x'); });
  const port = await listen(web);
  try {
    const tor = createTor({ SEED_TOR: '1', SEED_TOR_SOCKS: '127.0.0.1:1' }, async () => new Response('direct'), { log: () => {} });
    await assert.rejects(tor.fetch(`http://example.test:${port}/`), (e) => /no SOCKS proxy is reachable|not falling back/i.test(String(e.cause?.message ?? e.message)));
    assert.deepEqual(hits, []);
    await assert.rejects(findTorProxy(['127.0.0.1:1']), /not falling back to a direct connection/);
  } finally { await new Promise((r) => web.close(r)); }
});

test('tor: loopback and private hosts bypass Tor (local Redis stand-in must keep working); listed direct hosts too', async () => {
  const t = await setup({ SEED_TOR_DIRECT_HOSTS: 'refuses-tor.example' });
  try {
    await t.tor.fetch('http://127.0.0.1:8079/get/x');
    await t.tor.fetch('http://localhost:8079/');
    await t.tor.fetch('http://192.168.1.5/');
    await t.tor.fetch('https://api.refuses-tor.example/v1');
    assert.equal(t.realCalls.length, 4);
    assert.equal(t.socks.log.connects.length, 0);
    assert.equal(isLocalHost('8.8.8.8'), false);
    assert.equal(isLocalHost('172.20.1.1'), true);
    assert.equal(isLocalHost('172.32.1.1'), false);
    assert.equal(isLocalHost('foo.localhost'), true);
    assert.equal(isLocalHost('fd12:3456::1'), true);
    assert.equal(isLocalHost('example.org'), false);
  } finally { await t.close(); }
});

test('tor: a SOCKS refusal surfaces as an error', async () => {
  const t = await setup();
  try { await assert.rejects(t.tor.fetch('http://blocked.test/'), (e) => /connection refused/.test(String(e.cause?.message ?? e.message))); } finally { await t.close(); }
});

test('tor: AbortSignal.timeout aborts a stalled request', async () => {
  const t = await setup();
  try { await assert.rejects(t.tor.fetch('http://example.test/slow', { signal: AbortSignal.timeout(300) })); } finally { await t.close(); }
});

test('tor: unsupported body types are refused rather than sent around Tor', async () => {
  const t = await setup();
  try {
    await assert.rejects(t.tor.fetch('http://example.test/', { method: 'POST', body: new ReadableStream() }), /unsupported request body/);
    await assert.rejects(t.tor.fetch('ftp://example.test/'), /unsupported protocol/);
  } finally { await t.close(); }
});

test('tor: node:http requests with the Tor agent also go through SOCKS', async () => {
  const t = await setup();
  try {
    const body = await new Promise((resolve, reject) => {
      http.get({ host: 'agent.test', port: 80, path: '/via-agent', agent: t.tor.agents.http }, (res) => { let s = ''; res.on('data', (d) => { s += d; }); res.on('end', () => resolve(s)); }).on('error', reject);
    });
    assert.equal(body, 'hello /via-agent');
    assert.equal(t.socks.log.connects[0].host, 'agent.test');
  } finally { await t.close(); }
});

test('socks5Connect: IPv4 literal uses address type 1', async () => {
  const t = await setup();
  try {
    const s = await socks5Connect({ proxy: { host: '127.0.0.1', port: t.socks.port }, host: '93.184.216.34', port: 80 });
    s.destroy();
    assert.equal(t.socks.log.connects[0].atyp, 1);
    assert.equal(t.socks.log.connects[0].host, '93.184.216.34');
  } finally { await t.close(); }
});
