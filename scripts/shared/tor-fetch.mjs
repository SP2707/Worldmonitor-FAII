// Dependency-free Tor routing for every outbound request this project makes.
//
//   SEED_TOR=1                       route all non-local traffic through a local Tor SOCKS5 proxy
//   SEED_TOR_SOCKS=127.0.0.1:9050,127.0.0.1:9150   candidates, first reachable wins
//                                    (9050 = standalone tor, 9150 = Tor Browser)
//   SEED_TOR_DIRECT_HOSTS=a.com,b.org   hosts (suffix match) that go DIRECT on purpose, e.g. a source
//                                    that refuses Tor exits. Nothing else ever goes direct.
//   SEED_TOR_ISOLATE=0               disable per-process circuit isolation (default: on)
//   SEED_USER_AGENT=...              one User-Agent for every fetch() made through this layer
//
// Guarantees (tested against a mock SOCKS5 server, see tests/tor-fetch.test.mjs):
//   * FAIL CLOSED: if Tor is unreachable the request rejects. It never falls back to a direct connection.
//   * No DNS leak: hostnames are sent to the proxy (SOCKS5 "domain" address type); we never resolve them.
//   * Loopback / private-network / *.localhost hosts always go direct (the local Redis stand-in and the
//     sidecar live there and must not be sent to Tor).
//   * Covers global fetch() AND node:http / node:https calls that use the default agent.
//   * Circuit isolation: every process authenticates to the SOCKS port with its own random credentials,
//     which makes Tor use a separate circuit (so different seeders leave through different exits).
// NOT covered: code that opens raw sockets (node:net/tls directly), spawns curl, or uses a custom agent.
// `scripts/audit-egress.mjs` lists such places.

import net from 'node:net';
import tls from 'node:tls';
import http from 'node:http';
import https from 'node:https';
import zlib from 'node:zlib';
import { randomBytes } from 'node:crypto';
import { Readable } from 'node:stream';

const SOCKS_ERRORS = {
  1: 'general SOCKS server failure', 2: 'connection not allowed by ruleset', 3: 'network unreachable', 4: 'host unreachable',
  5: 'connection refused', 6: 'TTL expired', 7: 'command not supported', 8: 'address type not supported',
};

export function parseHostPort(s, defPort = 9050) {
  const [h, p] = String(s).trim().split(':');
  return { host: h || '127.0.0.1', port: Number(p) || defPort };
}

/** True for hosts that must never be sent to Tor (local services). */
export function isLocalHost(host, directHosts = []) {
  const h = String(host).toLowerCase().replace(/^\[|\]$/g, '');
  if (h === 'localhost' || h.endsWith('.localhost') || h === '::1' || h === '::') return true;
  if (/^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h) || /^169\.254\./.test(h) || /^0\.0\.0\.0$/.test(h)) return true;
  const m = /^172\.(\d+)\./.exec(h);
  if (m && Number(m[1]) >= 16 && Number(m[1]) <= 31) return true;
  if (/^f[cd][0-9a-f]{2}:/.test(h) || /^fe80:/.test(h)) return true;
  return directHosts.some((d) => h === d || h.endsWith(`.${d}`));
}

function readExact(socket, state, n) {
  // Resolve with exactly n bytes; leftover bytes stay in state.buf.
  return new Promise((resolve, reject) => {
    const tryTake = () => {
      if (state.buf.length >= n) { const out = state.buf.subarray(0, n); state.buf = state.buf.subarray(n); cleanup(); resolve(out); }
    };
    const onData = (d) => { state.buf = Buffer.concat([state.buf, d]); tryTake(); };
    const onErr = (e) => { cleanup(); reject(e); };
    const onEnd = () => { cleanup(); reject(new Error('SOCKS proxy closed the connection')); };
    const cleanup = () => { socket.off('data', onData); socket.off('error', onErr); socket.off('end', onEnd); socket.off('close', onEnd); };
    socket.on('data', onData); socket.on('error', onErr); socket.on('end', onEnd); socket.on('close', onEnd);
    tryTake();
  });
}

/**
 * Open a TCP stream to host:port THROUGH a SOCKS5 proxy. Resolves with a connected socket.
 * auth: { user, pass } enables RFC 1929 username/password (Tor uses it for circuit isolation).
 */
export async function socks5Connect({ proxy, host, port, auth = null, timeoutMs = 60_000 }) {
  const socket = net.connect({ host: proxy.host, port: proxy.port });
  socket.setNoDelay(true);
  const timer = setTimeout(() => socket.destroy(new Error(`SOCKS connect timed out after ${timeoutMs} ms`)), timeoutMs);
  const state = { buf: Buffer.alloc(0) };
  try {
    await new Promise((res, rej) => { socket.once('connect', res); socket.once('error', rej); });
    socket.write(auth ? Buffer.from([5, 2, 0, 2]) : Buffer.from([5, 1, 0]));
    const [ver, method] = await readExact(socket, state, 2);
    if (ver !== 5) throw new Error('not a SOCKS5 proxy');
    if (method === 2) {
      if (!auth) throw new Error('proxy demands username/password');
      const u = Buffer.from(auth.user); const p = Buffer.from(auth.pass);
      socket.write(Buffer.concat([Buffer.from([1, u.length]), u, Buffer.from([p.length]), p]));
      const [, status] = await readExact(socket, state, 2);
      if (status !== 0) throw new Error('SOCKS authentication rejected');
    } else if (method !== 0) {
      throw new Error(`SOCKS proxy offered unsupported auth method ${method}`);
    }
    let addr;
    const ip4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
    if (ip4) addr = Buffer.from([1, ...host.split('.').map(Number)]);
    else if (net.isIPv6(host)) {
      const parts = []; // expand via URL parser semantics
      const full = new URL(`http://[${host}]/`).hostname.replace(/^\[|\]$/g, '');
      for (const g of full.split(':')) { const v = parseInt(g || '0', 16); parts.push(v >> 8, v & 255); }
      addr = Buffer.from([4, ...parts]);
    } else {
      const name = Buffer.from(host);
      if (name.length > 255) throw new Error('hostname too long for SOCKS5');
      addr = Buffer.concat([Buffer.from([3, name.length]), name]); // remote DNS: no local lookup, no leak
    }
    socket.write(Buffer.concat([Buffer.from([5, 1, 0]), addr, Buffer.from([port >> 8, port & 255])]));
    const [v2, rep, , atyp] = await readExact(socket, state, 4);
    if (v2 !== 5) throw new Error('bad SOCKS reply');
    if (rep !== 0) throw new Error(`SOCKS connect failed: ${SOCKS_ERRORS[rep] ?? `code ${rep}`}`);
    const rest = atyp === 1 ? 6 : atyp === 4 ? 18 : (await readExact(socket, state, 1))[0] + 2;
    await readExact(socket, state, rest); // bound address + port: not needed
    clearTimeout(timer);
    if (state.buf.length) socket.unshift(state.buf);
    return socket;
  } catch (err) {
    clearTimeout(timer);
    socket.destroy();
    throw err;
  }
}

/** Find the first reachable SOCKS candidate; throws a clear error otherwise. */
export async function findTorProxy(candidates, probeMs = 1500) {
  const errors = [];
  for (const c of candidates) {
    const proxy = parseHostPort(c);
    try {
      await new Promise((res, rej) => {
        const s = net.connect({ host: proxy.host, port: proxy.port });
        const t = setTimeout(() => { s.destroy(); rej(new Error('timeout')); }, probeMs);
        s.once('connect', () => { clearTimeout(t); s.destroy(); res(); });
        s.once('error', (e) => { clearTimeout(t); rej(e); });
      });
      return proxy;
    } catch (e) { errors.push(`${proxy.host}:${proxy.port} (${e.code || e.message})`); }
  }
  throw new Error(`Tor required (SEED_TOR=1) but no SOCKS proxy is reachable: ${errors.join(', ')}. Start Tor (Tor Browser, or "tor" on 9050); not falling back to a direct connection.`);
}

function makeAgents(getProxy, auth, directHosts) {
  const connectVia = async (options, secure) => {
    const host = options.host || options.hostname;
    const port = Number(options.port) || (secure ? 443 : 80);
    if (isLocalHost(host, directHosts)) {
      return secure ? tls.connect({ host, port, servername: options.servername || host }) : net.connect({ host, port });
    }
    const proxy = await getProxy();
    const raw = await socks5Connect({ proxy, host, port, auth });
    return secure ? tls.connect({ socket: raw, servername: options.servername || host }) : raw;
  };
  class SocksHttpAgent extends http.Agent {
    createConnection(options, cb) { connectVia(options, false).then((s) => cb(null, s), (e) => cb(e)); }
  }
  class SocksHttpsAgent extends https.Agent {
    createConnection(options, cb) { connectVia(options, true).then((s) => cb(null, s), (e) => cb(e)); }
  }
  return { http: new SocksHttpAgent({ keepAlive: false }), https: new SocksHttpsAgent({ keepAlive: false }) };
}

function decodeBody(res) {
  const enc = String(res.headers['content-encoding'] || '').toLowerCase();
  if (enc === 'gzip' || enc === 'x-gzip') return res.pipe(zlib.createGunzip());
  if (enc === 'deflate') return res.pipe(zlib.createInflate());
  if (enc === 'br') return res.pipe(zlib.createBrotliDecompress());
  return res;
}

async function bodyToBuffer(body) {
  if (body == null) return null;
  if (typeof body === 'string') return Buffer.from(body);
  if (body instanceof URLSearchParams) return Buffer.from(body.toString());
  if (Buffer.isBuffer(body)) return body;
  if (body instanceof ArrayBuffer) return Buffer.from(body);
  if (ArrayBuffer.isView(body)) return Buffer.from(body.buffer, body.byteOffset, body.byteLength);
  if (typeof Blob !== 'undefined' && body instanceof Blob) return Buffer.from(await body.arrayBuffer());
  throw new TypeError('Tor fetch: unsupported request body type (streams/FormData); refusing rather than bypassing Tor');
}

/**
 * Build a fetch() that goes through Tor. `agents` come from makeAgents (injectable for tests).
 */
export function createTorFetch({ agents, userAgent = null, maxRedirects = 10 }) {
  return async function torFetch(input, init = {}) {
    let url; let method; let headers; let body; let signal;
    if (input instanceof Request) {
      url = new URL(input.url); method = init.method || input.method; headers = new Headers(init.headers || input.headers);
      body = init.body !== undefined ? init.body : (input.body ? await input.clone().arrayBuffer() : null); signal = init.signal || input.signal;
    } else {
      url = new URL(String(input)); method = init.method || 'GET'; headers = new Headers(init.headers || {}); body = init.body ?? null; signal = init.signal;
    }
    method = String(method).toUpperCase();
    let payload = await bodyToBuffer(body);
    if (!['http:', 'https:'].includes(url.protocol)) throw new TypeError(`Tor fetch: unsupported protocol ${url.protocol}`);
    if (userAgent) headers.set('user-agent', userAgent);
    else if (!headers.has('user-agent')) headers.set('user-agent', 'worldmonitor-faii');
    if (!headers.has('accept-encoding')) headers.set('accept-encoding', 'gzip, deflate, br');
    if (!headers.has('accept')) headers.set('accept', '*/*');

    for (let hop = 0; ; hop++) {
      const secure = url.protocol === 'https:';
      const result = await new Promise((resolve, reject) => {
        if (signal?.aborted) return reject(signal.reason ?? new DOMException('aborted', 'AbortError'));
        const h = Object.fromEntries(headers.entries());
        if (payload && !h['content-length']) h['content-length'] = String(payload.length);
        const req = (secure ? https : http).request({
          protocol: url.protocol, hostname: url.hostname.replace(/^\[|\]$/g, ''), port: url.port || (secure ? 443 : 80),
          path: url.pathname + url.search, method, headers: h, agent: secure ? agents.https : agents.http,
        }, resolve);
        const onAbort = () => req.destroy(signal.reason ?? new DOMException('aborted', 'AbortError'));
        signal?.addEventListener('abort', onAbort, { once: true });
        req.once('error', (e) => reject(e.cause ? e : Object.assign(new TypeError('fetch failed'), { cause: e })));
        req.once('close', () => signal?.removeEventListener('abort', onAbort));
        if (payload) req.write(payload);
        req.end();
      });
      const status = result.statusCode;
      if ([301, 302, 303, 307, 308].includes(status) && result.headers.location && hop < maxRedirects) {
        result.resume();
        url = new URL(result.headers.location, url);
        if (status === 303 || ((status === 301 || status === 302) && method === 'POST')) { method = 'GET'; payload = null; headers.delete('content-length'); headers.delete('content-type'); }
        continue;
      }
      const resHeaders = new Headers();
      for (const [k, v] of Object.entries(result.headers)) { if (k === 'content-encoding' || k === 'content-length') continue; for (const vv of [].concat(v)) resHeaders.append(k, vv); }
      const nullBody = method === 'HEAD' || [204, 205, 304].includes(status);
      if (nullBody) result.resume();
      const stream = nullBody ? null : Readable.toWeb(decodeBody(result));
      const response = new Response(stream, { status, statusText: result.statusMessage || '', headers: resHeaders });
      Object.defineProperty(response, 'url', { value: url.href });
      return response;
    }
  };
}

/** Build the Tor layer (no globals touched). `realFetch` handles local hosts. */
export function createTor(env = process.env, realFetch = globalThis.fetch, { log = console.warn } = {}) {
  const candidates = String(env.SEED_TOR_SOCKS || '127.0.0.1:9050,127.0.0.1:9150').split(',').map((s) => s.trim()).filter(Boolean);
  const directHosts = String(env.SEED_TOR_DIRECT_HOSTS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  const auth = env.SEED_TOR_ISOLATE === '0' ? null : { user: `wm-${process.pid}`, pass: randomBytes(8).toString('hex') };
  let proxyPromise = null;
  const getProxy = () => (proxyPromise ??= findTorProxy(candidates).catch((e) => { proxyPromise = null; throw e; }));
  const agents = makeAgents(getProxy, auth, directHosts);
  const torFetch = createTorFetch({ agents, userAgent: env.SEED_USER_AGENT || null });
  const routedFetch = (input, init) => {
    const u = input instanceof Request ? input.url : String(input);
    let host = '';
    try { host = new URL(u).hostname; } catch { /* torFetch throws a proper error */ }
    if (host && isLocalHost(host, directHosts)) return realFetch(input, init);
    return torFetch(input, init);
  };
  if (directHosts.length) log(`[tor] WARNING: these hosts bypass Tor on purpose: ${directHosts.join(', ')}`);
  return { fetch: routedFetch, agents, candidates, directHosts, isolate: !!auth, auth };
}

let installed = null;

/** Install the Tor layer into this process when env asks for it. */
export function installTor(env = process.env, opts) {
  if (installed) return installed;
  if (String(env.SEED_TOR ?? '') !== '1') return { enabled: false };
  const t = createTor(env, globalThis.fetch, opts);
  globalThis.fetch = t.fetch;
  http.globalAgent = t.agents.http;
  https.globalAgent = t.agents.https;
  installed = { enabled: true, ...t };
  return installed;
}
