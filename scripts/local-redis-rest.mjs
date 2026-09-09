#!/usr/bin/env node
// A minimal, fully-local, no-cloud, no-Docker, no-external-binary stand-in
// for Upstash's REST API — implementing exactly the subset of that protocol
// this codebase's seed scripts (scripts/_seed-utils.mjs) and the sidecar's
// read-fallback (server/_shared/redis.ts's getCachedJsonBatch) actually use.
// Verified against the real call sites, not guessed:
//   - GET  /get/:key                 (server/_shared/redis.ts reads, scripts/_seed-utils.mjs redisGet)
//   - POST /                         (single command: ['GET'|'SET'|'DEL'|'EVAL', ...])
//   - POST /pipeline                 (batched commands, used by getCachedJsonBatch)
//
// Storage: an in-memory Map (so the always-running instance behaves like a
// real remote store between requests, exactly like Upstash would), mirrored
// to a JSON file on every write so a restart of THIS process doesn't lose
// seeded data — sidecar-cache.ts (the sidecar's own in-memory cache) has no
// such durability and doesn't need it, but this process stands in for a
// persistent remote store, so it should behave like one.
//
// Auth: any non-empty Bearer token is accepted by default (loopback-only,
// no cloud secret to protect) unless LOCAL_REDIS_TOKEN is set, in which
// case the token must match exactly — same optional-strictness pattern as
// this fork's LOCAL_API_TOKEN.
//
// Usage:
//   node scripts/local-redis-rest.mjs                  # port 8079, ./local-redis-data.json
//   PORT=9000 node scripts/local-redis-rest.mjs
//   LOCAL_REDIS_DATA_FILE=/path/to/file.json node scripts/local-redis-rest.mjs

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = parseInt(process.env.PORT || '8079', 10);
const REQUIRED_TOKEN = process.env.LOCAL_REDIS_TOKEN || null;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = process.env.LOCAL_REDIS_DATA_FILE || path.join(__dirname, '..', '.local-redis-data.json');

/** @type {Map<string, {value: string, expiresAt: number|null}>} */
const store = new Map();

function loadFromDisk() {
  try {
    if (!fs.existsSync(DATA_FILE)) return;
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const now = Date.now();
    let loaded = 0;
    for (const [key, entry] of Object.entries(raw)) {
      if (entry.expiresAt != null && entry.expiresAt <= now) continue; // drop expired on load
      store.set(key, entry);
      loaded++;
    }
    console.log(`[local-redis-rest] loaded ${loaded} key(s) from ${DATA_FILE}`);
  } catch (err) {
    console.warn(`[local-redis-rest] could not load ${DATA_FILE}: ${err.message} (starting empty)`);
  }
}

let saveTimer = null;
function scheduleSave() {
  // Debounce: a seed run can write several keys in quick succession
  // (staging key, canonical key, cleanup). Coalesce into one disk write.
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      const obj = Object.fromEntries(store.entries());
      fs.writeFileSync(DATA_FILE, JSON.stringify(obj), 'utf8');
    } catch (err) {
      console.warn(`[local-redis-rest] save failed: ${err.message}`);
    }
  }, 200);
  if (saveTimer.unref) saveTimer.unref();
}

function getEntry(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expiresAt != null && entry.expiresAt <= Date.now()) {
    store.delete(key);
    scheduleSave();
    return null;
  }
  return entry;
}

// The one Lua script this codebase actually sends (scripts/_seed-utils.mjs
// releaseLock): "if redis.call('get',KEYS[1])==ARGV[1] then return
// redis.call('del',KEYS[1]) else return 0 end" — a compare-and-delete lock
// release. Implemented directly rather than via a Lua interpreter: this is
// the only EVAL shape any call site sends (confirmed by grep), and the
// caller already treats EVAL as best-effort (wrapped in try/catch, TTL is
// the real safety net) — so a server that doesn't recognize a DIFFERENT
// script simply no-ops (matching how a Redis EVAL error would be caught
// and ignored by that same try/catch) rather than crashing.
function handleEval(cmd) {
  const [, script, numkeysRaw, ...rest] = cmd;
  const numkeys = Number(numkeysRaw) || 0;
  const keys = rest.slice(0, numkeys);
  const argv = rest.slice(numkeys);
  const isCompareAndDelete = typeof script === 'string' && script.includes('redis.call("get",KEYS[1])');
  if (isCompareAndDelete && keys.length === 1 && argv.length === 1) {
    const entry = getEntry(keys[0]);
    if (entry && entry.value === argv[0]) {
      store.delete(keys[0]);
      scheduleSave();
      return 1;
    }
    return 0;
  }
  // Unrecognized script: no-op, matching the try/catch degrade at every
  // real caller of EVAL in this codebase.
  return null;
}

function handleCommand(cmd) {
  if (!Array.isArray(cmd) || cmd.length === 0) return { result: null };
  const name = String(cmd[0]).toUpperCase();

  if (name === 'GET') {
    const [, key] = cmd;
    const entry = getEntry(key);
    return { result: entry ? entry.value : null };
  }

  if (name === 'SET') {
    const [, key, value, ...flags] = cmd;
    const upperFlags = flags.map((f) => String(f).toUpperCase());
    const nxIdx = upperFlags.indexOf('NX');
    const exIdx = upperFlags.indexOf('EX');
    const pxIdx = upperFlags.indexOf('PX');

    if (nxIdx !== -1) {
      const existing = getEntry(key);
      if (existing) return { result: null }; // NX: key already exists and hasn't expired
    }

    let expiresAt = null;
    if (exIdx !== -1) expiresAt = Date.now() + Number(flags[exIdx + 1]) * 1000;
    else if (pxIdx !== -1) expiresAt = Date.now() + Number(flags[pxIdx + 1]);

    store.set(key, { value: String(value), expiresAt });
    scheduleSave();
    return { result: 'OK' };
  }

  if (name === 'DEL') {
    const [, key] = cmd;
    const had = getEntry(key) !== null;
    store.delete(key);
    if (had) scheduleSave();
    return { result: had ? 1 : 0 };
  }

  if (name === 'EXPIRE') {
    const [, key, seconds] = cmd;
    const entry = getEntry(key);
    if (!entry) return { result: 0 };
    entry.expiresAt = Date.now() + Number(seconds) * 1000;
    scheduleSave();
    return { result: 1 };
  }

  if (name === 'EVAL') {
    return { result: handleEval(cmd) };
  }

  // Any other command this codebase doesn't currently send: report a clear
  // "unsupported" result rather than silently pretending success, so a
  // future new call site fails loudly during development instead of
  // quietly losing data.
  return { error: `local-redis-rest: unsupported command '${name}'` };
}

function checkAuth(req) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return false;
  if (REQUIRED_TOKEN) return token === REQUIRED_TOKEN;
  return true; // any non-empty bearer token accepted (loopback-only server)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function json(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(text) });
  res.end(text);
}

const server = http.createServer(async (req, res) => {
  if (!checkAuth(req)) return json(res, 401, { error: 'unauthorized' });

  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (req.method === 'GET' && url.pathname.startsWith('/get/')) {
      const key = decodeURIComponent(url.pathname.slice('/get/'.length));
      return json(res, 200, handleCommand(['GET', key]));
    }

    if (req.method === 'POST' && url.pathname === '/pipeline') {
      const body = await readBody(req);
      const commands = JSON.parse(body || '[]');
      if (!Array.isArray(commands)) return json(res, 400, { error: 'pipeline body must be an array of commands' });
      return json(res, 200, commands.map(handleCommand));
    }

    if (req.method === 'POST' && url.pathname === '/') {
      const body = await readBody(req);
      const cmd = JSON.parse(body || '[]');
      return json(res, 200, handleCommand(cmd));
    }

    return json(res, 404, { error: 'not found' });
  } catch (err) {
    return json(res, 500, { error: err.message || 'internal error' });
  }
});

loadFromDisk();
server.listen(PORT, '127.0.0.1', () => {
  console.log(`[local-redis-rest] listening on http://127.0.0.1:${PORT}`);
  console.log(`[local-redis-rest] data file: ${DATA_FILE}`);
  console.log('[local-redis-rest] set these before starting the seeder AND the sidecar (npm start):');
  console.log(`  $env:UPSTASH_REDIS_REST_URL = "http://127.0.0.1:${PORT}"`);
  console.log(`  $env:UPSTASH_REDIS_REST_TOKEN = "local-dev"`);
});
