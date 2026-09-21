#!/usr/bin/env node
// A minimal, fully-local, no-cloud, no-Docker, no-external-binary stand-in
// for Upstash's REST API — implementing the subset of Redis commands this
// codebase's server routes (server/_shared/redis.ts and its callers, most
// importantly server/worldmonitor/news/v1/list-feed-digest.ts) and seed
// scripts (scripts/_seed-utils.mjs, scripts/*.mjs) actually send.
//
// Command coverage was derived by grepping every `['COMMAND', ...]` array
// literal built anywhere under server/, scripts/, and api/ against real
// Redis/Upstash semantics — not guessed. Supported:
//
//   Strings : GET, SET (NX/EX/PX), SETEX, MGET, DEL, EXISTS, EXPIRE, TTL,
//             INCR, INCRBY, DECR, DECRBY
//   Hashes  : HSET, HSETNX, HGET, HMGET, HGETALL, HINCRBY, HLEN
//   Sets    : SADD, SMEMBERS
//   Sorted  : ZADD (NX/XX/GT/LT/CH), ZRANGE, ZREVRANGE, ZREM,
//   sets      ZREMRANGEBYSCORE, ZREMRANGEBYRANK, ZCARD, ZCOUNT, ZSCORE
//   Lists   : LPUSH, RPUSH, LRANGE, LREM, LTRIM, LLEN
//   Geo     : GEOADD, GEOSEARCH (FROMLONLAT ... BYBOX|BYRADIUS ... ASC|DESC
//             ... COUNT ...) — member-list result only (no WITHCOORD/
//             WITHDIST caller in this codebase today)
//   Scripts : EVAL — only the one Lua shape this codebase actually sends
//             (scripts/_seed-utils.mjs releaseLock's compare-and-delete);
//             every other script no-ops, matching how a real EVAL error on
//             an unrecognized script would be caught by that same
//             try/catch at every real call site.
//
// Endpoints (matching Upstash's REST shape exactly, since server/_shared/
// redis.ts and the seed scripts talk to a configured UPSTASH_REDIS_REST_URL
// as if it were real Upstash):
//   GET  /get/:key   — single GET shortcut
//   POST /           — single command: ['CMD', ...args]
//   POST /pipeline   — batched commands: [['CMD', ...args], ...], each
//                      entry in the response is either {result} or {error}
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
//   node scripts/local-redis-rest.mjs                  # port 8079, ./.local-redis-data.json
//   PORT=9000 node scripts/local-redis-rest.mjs
//   LOCAL_REDIS_DATA_FILE=/path/to/file.json node scripts/local-redis-rest.mjs
//
// Normally you don't run this directly: `npm start` auto-launches it (see
// scripts/start-with-local-redis.mjs) whenever UPSTASH_REDIS_REST_URL isn't
// already set, so a bare `npm install && npm start` gets a populated,
// working store with zero configuration. Set UPSTASH_REDIS_REST_URL /
// UPSTASH_REDIS_REST_TOKEN yourself (real Upstash, or your own instance of
// this shim) to opt out of the auto-launch.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = parseInt(process.env.PORT || '8079', 10);
const REQUIRED_TOKEN = process.env.LOCAL_REDIS_TOKEN || null;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = process.env.LOCAL_REDIS_DATA_FILE || path.join(__dirname, '..', '.local-redis-data.json');

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------
//
// Each entry: { type: 'string'|'hash'|'set'|'zset'|'list'|'geo', expiresAt:
// number|null, data: <type-specific> }
//   string -> data: string
//   hash   -> data: Record<string,string>
//   set    -> data: Set<string>
//   zset   -> data: Map<string, number>            (member -> score)
//   list   -> data: string[]
//   geo    -> data: Map<string, [lon, lat]>         (member -> coords)
//
/** @type {Map<string, {type: string, expiresAt: number|null, data: any}>} */
const store = new Map();

function serializeEntry(entry) {
  switch (entry.type) {
    case 'set':
      return { type: entry.type, expiresAt: entry.expiresAt, data: Array.from(entry.data) };
    case 'zset':
    case 'geo':
      return { type: entry.type, expiresAt: entry.expiresAt, data: Array.from(entry.data.entries()) };
    default:
      return entry;
  }
}

function deserializeEntry(raw) {
  switch (raw.type) {
    case 'set':
      return { type: 'set', expiresAt: raw.expiresAt, data: new Set(raw.data) };
    case 'zset':
    case 'geo':
      return { type: raw.type, expiresAt: raw.expiresAt, data: new Map(raw.data) };
    case 'hash':
      return { type: 'hash', expiresAt: raw.expiresAt, data: raw.data || {} };
    case 'list':
      return { type: 'list', expiresAt: raw.expiresAt, data: Array.isArray(raw.data) ? raw.data : [] };
    default:
      // Legacy shape from the earlier GET/SET-only prototype:
      // { value: string, expiresAt } with no `type`/`data`.
      if (raw.type === undefined && typeof raw.value === 'string') {
        return { type: 'string', expiresAt: raw.expiresAt ?? null, data: raw.value };
      }
      return { type: 'string', expiresAt: raw.expiresAt ?? null, data: String(raw.data ?? '') };
  }
}

function loadFromDisk() {
  try {
    if (!fs.existsSync(DATA_FILE)) return;
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const now = Date.now();
    let loaded = 0;
    for (const [key, rawEntry] of Object.entries(raw)) {
      if (rawEntry.expiresAt != null && rawEntry.expiresAt <= now) continue; // drop expired on load
      store.set(key, deserializeEntry(rawEntry));
      loaded++;
    }
    console.log(`[local-redis-rest] loaded ${loaded} key(s) from ${DATA_FILE}`);
  } catch (err) {
    console.warn(`[local-redis-rest] could not load ${DATA_FILE}: ${err.message} (starting empty)`);
  }
}

let saveTimer = null;
function scheduleSave() {
  // Debounce: a seed run (or a single digest tick, which fires HINCRBY/
  // HSET/HSETNX/EXPIRE/ZADD/SADD in a single pipeline call) can touch
  // several keys in quick succession. Coalesce into one disk write.
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      const obj = {};
      for (const [key, entry] of store.entries()) obj[key] = serializeEntry(entry);
      fs.writeFileSync(DATA_FILE, JSON.stringify(obj), 'utf8');
    } catch (err) {
      console.warn(`[local-redis-rest] save failed: ${err.message}`);
    }
  }, 200);
  if (saveTimer.unref) saveTimer.unref();
}

/** Live (non-expired) entry, or null. Deletes + persists on lazy expiry. */
function getEntry(key, expectedType) {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expiresAt != null && entry.expiresAt <= Date.now()) {
    store.delete(key);
    scheduleSave();
    return null;
  }
  if (expectedType && entry.type !== expectedType) {
    // A real Redis server would return a WRONGTYPE error here. This shim
    // only ever sees commands this codebase itself generates against keys
    // it itself created with a consistent type, so treat a mismatch as the
    // caller having changed key shape (e.g. a schema migration) rather than
    // crash the request: drop the stale entry and behave as if absent.
    store.delete(key);
    scheduleSave();
    return null;
  }
  return entry;
}

function touch(key, type, expiresAt) {
  let entry = store.get(key);
  if (!entry || entry.type !== type || (entry.expiresAt != null && entry.expiresAt <= Date.now())) {
    const data =
      type === 'hash' ? {} : type === 'set' ? new Set() : type === 'zset' || type === 'geo' ? new Map() : type === 'list' ? [] : '';
    entry = { type, expiresAt: expiresAt ?? null, data };
    store.set(key, entry);
  } else if (expiresAt !== undefined) {
    entry.expiresAt = expiresAt;
  }
  return entry;
}

// ---------------------------------------------------------------------------
// Shared arg parsing helpers
// ---------------------------------------------------------------------------

/** '-inf' | '+inf' | '(<num>' (exclusive) | '<num>' (inclusive) */
function parseScoreBound(raw) {
  const s = String(raw);
  if (s === '-inf' || s === '-Inf' || s === '-INF') return { value: -Infinity, exclusive: false };
  if (s === '+inf' || s === '+Inf' || s === '+INF' || s === 'inf' || s === 'Inf' || s === 'INF') {
    return { value: Infinity, exclusive: false };
  }
  if (s.startsWith('(')) return { value: Number(s.slice(1)), exclusive: true };
  return { value: Number(s), exclusive: false };
}

function scoreInRange(score, min, max) {
  const lo = min.exclusive ? score > min.value : score >= min.value;
  const hi = max.exclusive ? score < max.value : score <= max.value;
  return lo && hi;
}

/** Python-style negative index resolution against a length, clamped to [0, length]. */
function resolveRange(start, stop, length) {
  let s = Number(start);
  let e = Number(stop);
  if (s < 0) s = Math.max(length + s, 0);
  if (e < 0) e = length + e;
  e = Math.min(e, length - 1);
  if (s > e || length === 0) return null;
  return { start: s, end: e };
}

function haversineKm(lon1, lat1, lon2, lat2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// ---------------------------------------------------------------------------
// EVAL — the one Lua script this codebase actually sends (scripts/
// _seed-utils.mjs releaseLock): "if redis.call('get',KEYS[1])==ARGV[1] then
// return redis.call('del',KEYS[1]) else return 0 end" — a compare-and-delete
// lock release. Implemented directly rather than via a Lua interpreter: this
// is the only EVAL shape any call site sends (confirmed by grep), and the
// caller already treats EVAL as best-effort (wrapped in try/catch, TTL is
// the real safety net) — so a server that doesn't recognize a DIFFERENT
// script simply no-ops (matching how a real Redis EVAL error would be caught
// and ignored by that same try/catch) rather than crashing.
// ---------------------------------------------------------------------------
function handleEval(cmd) {
  const [, script, numkeysRaw, ...rest] = cmd;
  const numkeys = Number(numkeysRaw) || 0;
  const keys = rest.slice(0, numkeys);
  const argv = rest.slice(numkeys);
  const isCompareAndDelete =
    typeof script === 'string' &&
    (script.includes('redis.call("get",KEYS[1])') || script.includes("redis.call('get',KEYS[1])"));
  if (isCompareAndDelete && keys.length === 1 && argv.length === 1) {
    const entry = getEntry(keys[0], 'string');
    if (entry && entry.data === argv[0]) {
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

// ---------------------------------------------------------------------------
// Command dispatch
// ---------------------------------------------------------------------------

function handleCommand(cmd) {
  if (!Array.isArray(cmd) || cmd.length === 0) return { result: null };
  const name = String(cmd[0]).toUpperCase();

  try {
    switch (name) {
      // ---------------------------------------------------------------- strings
      case 'GET': {
        const [, key] = cmd;
        const entry = getEntry(key, 'string');
        return { result: entry ? entry.data : null };
      }

      case 'SET': {
        const [, key, value, ...flags] = cmd;
        const upperFlags = flags.map((f) => String(f).toUpperCase());
        const nxIdx = upperFlags.indexOf('NX');
        const exIdx = upperFlags.indexOf('EX');
        const pxIdx = upperFlags.indexOf('PX');

        if (nxIdx !== -1) {
          const existing = getEntry(key, 'string');
          if (existing) return { result: null }; // NX: key already exists and hasn't expired
        }

        let expiresAt = null;
        if (exIdx !== -1) expiresAt = Date.now() + Number(flags[exIdx + 1]) * 1000;
        else if (pxIdx !== -1) expiresAt = Date.now() + Number(flags[pxIdx + 1]);

        store.set(key, { type: 'string', expiresAt, data: String(value) });
        scheduleSave();
        return { result: 'OK' };
      }

      case 'SETEX': {
        const [, key, seconds, value] = cmd;
        store.set(key, { type: 'string', expiresAt: Date.now() + Number(seconds) * 1000, data: String(value) });
        scheduleSave();
        return { result: 'OK' };
      }

      case 'MGET': {
        const keys = cmd.slice(1);
        return { result: keys.map((k) => getEntry(k, 'string')?.data ?? null) };
      }

      case 'DEL': {
        const keys = cmd.slice(1);
        let removed = 0;
        for (const key of keys) {
          if (getEntry(key) !== null) removed++;
          if (store.delete(key)) scheduleSave();
        }
        return { result: removed };
      }

      case 'EXISTS': {
        const keys = cmd.slice(1);
        return { result: keys.filter((k) => getEntry(k) !== null).length };
      }

      case 'EXPIRE': {
        const [, key, seconds] = cmd;
        const entry = getEntry(key);
        if (!entry) return { result: 0 };
        entry.expiresAt = Date.now() + Number(seconds) * 1000;
        scheduleSave();
        return { result: 1 };
      }

      case 'TTL': {
        const [, key] = cmd;
        const entry = getEntry(key);
        if (!entry) return { result: -2 };
        if (entry.expiresAt == null) return { result: -1 };
        return { result: Math.max(0, Math.round((entry.expiresAt - Date.now()) / 1000)) };
      }

      case 'INCR':
      case 'INCRBY':
      case 'DECR':
      case 'DECRBY': {
        const [, key, amountRaw] = cmd;
        const delta = name === 'INCR' ? 1 : name === 'DECR' ? -1 : name === 'DECRBY' ? -Number(amountRaw) : Number(amountRaw);
        const entry = getEntry(key, 'string');
        const current = entry ? Number(entry.data) || 0 : 0;
        const next = current + delta;
        const preservedExpiry = entry ? entry.expiresAt : null;
        store.set(key, { type: 'string', expiresAt: preservedExpiry, data: String(next) });
        scheduleSave();
        return { result: next };
      }

      // ------------------------------------------------------------------ hashes
      case 'HSET': {
        const [, key, ...pairs] = cmd;
        const entry = touch(key, 'hash');
        let added = 0;
        for (let i = 0; i < pairs.length; i += 2) {
          const field = String(pairs[i]);
          if (!(field in entry.data)) added++;
          entry.data[field] = String(pairs[i + 1]);
        }
        scheduleSave();
        return { result: added };
      }

      case 'HSETNX': {
        const [, key, field, value] = cmd;
        const entry = touch(key, 'hash');
        if (field in entry.data) return { result: 0 };
        entry.data[field] = String(value);
        scheduleSave();
        return { result: 1 };
      }

      case 'HGET': {
        const [, key, field] = cmd;
        const entry = getEntry(key, 'hash');
        return { result: entry && field in entry.data ? entry.data[field] : null };
      }

      case 'HMGET': {
        const [, key, ...fields] = cmd;
        const entry = getEntry(key, 'hash');
        return { result: fields.map((f) => (entry && f in entry.data ? entry.data[f] : null)) };
      }

      case 'HGETALL': {
        const [, key] = cmd;
        const entry = getEntry(key, 'hash');
        if (!entry) return { result: [] };
        // Flat [field, value, field, value, ...] — matches real Redis/
        // Upstash RESP2 wire shape, which this codebase's callers parse.
        const flat = [];
        for (const [field, value] of Object.entries(entry.data)) flat.push(field, value);
        return { result: flat };
      }

      case 'HINCRBY': {
        const [, key, field, amountRaw] = cmd;
        const entry = touch(key, 'hash');
        const current = field in entry.data ? Number(entry.data[field]) || 0 : 0;
        const next = current + Number(amountRaw);
        entry.data[field] = String(next);
        scheduleSave();
        return { result: next };
      }

      case 'HLEN': {
        const [, key] = cmd;
        const entry = getEntry(key, 'hash');
        return { result: entry ? Object.keys(entry.data).length : 0 };
      }

      // -------------------------------------------------------------------- sets
      case 'SADD': {
        const [, key, ...members] = cmd;
        const entry = touch(key, 'set');
        let added = 0;
        for (const m of members) {
          const s = String(m);
          if (!entry.data.has(s)) {
            entry.data.add(s);
            added++;
          }
        }
        scheduleSave();
        return { result: added };
      }

      case 'SMEMBERS': {
        const [, key] = cmd;
        const entry = getEntry(key, 'set');
        return { result: entry ? Array.from(entry.data) : [] };
      }

      // ------------------------------------------------------------- sorted sets
      case 'ZADD': {
        const [, key, ...rest] = cmd;
        const FLAGS = new Set(['NX', 'XX', 'GT', 'LT', 'CH']);
        let i = 0;
        const flags = new Set();
        while (i < rest.length && FLAGS.has(String(rest[i]).toUpperCase())) {
          flags.add(String(rest[i]).toUpperCase());
          i++;
        }
        const entry = touch(key, 'zset');
        let added = 0;
        let changed = 0;
        for (; i < rest.length; i += 2) {
          const score = Number(rest[i]);
          const member = String(rest[i + 1]);
          const exists = entry.data.has(member);
          if (exists && flags.has('NX')) continue;
          if (!exists && flags.has('XX')) continue;
          if (exists) {
            const prev = entry.data.get(member);
            if (flags.has('GT') && !(score > prev)) continue;
            if (flags.has('LT') && !(score < prev)) continue;
            if (score !== prev) {
              entry.data.set(member, score);
              changed++;
            }
          } else {
            entry.data.set(member, score);
            added++;
            changed++;
          }
        }
        scheduleSave();
        return { result: flags.has('CH') ? changed : added };
      }

      case 'ZRANGE':
      case 'ZREVRANGE': {
        const [, key, startRaw, stopRaw, ...flags] = cmd;
        const withScores = flags.some((f) => String(f).toUpperCase() === 'WITHSCORES');
        const entry = getEntry(key, 'zset');
        const members = entry ? Array.from(entry.data.entries()) : [];
        members.sort((a, b) => (a[1] - b[1]) || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
        if (name === 'ZREVRANGE') members.reverse();
        const range = resolveRange(startRaw, stopRaw, members.length);
        const slice = range ? members.slice(range.start, range.end + 1) : [];
        if (withScores) {
          const flat = [];
          for (const [member, score] of slice) flat.push(member, String(score));
          return { result: flat };
        }
        return { result: slice.map(([member]) => member) };
      }

      case 'ZREM': {
        const [, key, ...members] = cmd;
        const entry = getEntry(key, 'zset');
        if (!entry) return { result: 0 };
        let removed = 0;
        for (const m of members) {
          if (entry.data.delete(String(m))) removed++;
        }
        if (removed) scheduleSave();
        return { result: removed };
      }

      case 'ZREMRANGEBYSCORE':
      case 'ZCOUNT': {
        const [, key, minRaw, maxRaw] = cmd;
        const entry = getEntry(key, 'zset');
        if (!entry) return { result: 0 };
        const min = parseScoreBound(minRaw);
        const max = parseScoreBound(maxRaw);
        const matching = Array.from(entry.data.entries()).filter(([, score]) => scoreInRange(score, min, max));
        if (name === 'ZCOUNT') return { result: matching.length };
        for (const [member] of matching) entry.data.delete(member);
        if (matching.length) scheduleSave();
        return { result: matching.length };
      }

      case 'ZREMRANGEBYRANK': {
        const [, key, startRaw, stopRaw] = cmd;
        const entry = getEntry(key, 'zset');
        if (!entry) return { result: 0 };
        const members = Array.from(entry.data.entries()).sort((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
        const range = resolveRange(startRaw, stopRaw, members.length);
        if (!range) return { result: 0 };
        const toRemove = members.slice(range.start, range.end + 1);
        for (const [member] of toRemove) entry.data.delete(member);
        if (toRemove.length) scheduleSave();
        return { result: toRemove.length };
      }

      case 'ZCARD': {
        const [, key] = cmd;
        const entry = getEntry(key, 'zset');
        return { result: entry ? entry.data.size : 0 };
      }

      case 'ZSCORE': {
        const [, key, member] = cmd;
        const entry = getEntry(key, 'zset');
        const score = entry?.data.get(String(member));
        return { result: score === undefined ? null : String(score) };
      }

      // ------------------------------------------------------------------- lists
      case 'LPUSH': {
        const [, key, ...values] = cmd;
        const entry = touch(key, 'list');
        for (const v of values) entry.data.unshift(String(v));
        scheduleSave();
        return { result: entry.data.length };
      }

      case 'RPUSH': {
        const [, key, ...values] = cmd;
        const entry = touch(key, 'list');
        for (const v of values) entry.data.push(String(v));
        scheduleSave();
        return { result: entry.data.length };
      }

      case 'LRANGE': {
        const [, key, startRaw, stopRaw] = cmd;
        const entry = getEntry(key, 'list');
        const list = entry ? entry.data : [];
        const range = resolveRange(startRaw, stopRaw, list.length);
        return { result: range ? list.slice(range.start, range.end + 1) : [] };
      }

      case 'LREM': {
        const [, key, countRaw, value] = cmd;
        const entry = getEntry(key, 'list');
        if (!entry) return { result: 0 };
        const count = Number(countRaw);
        const target = String(value);
        let removed = 0;
        if (count === 0) {
          const before = entry.data.length;
          entry.data = entry.data.filter((v) => v !== target);
          removed = before - entry.data.length;
        } else if (count > 0) {
          const next = [];
          for (const v of entry.data) {
            if (v === target && removed < count) {
              removed++;
              continue;
            }
            next.push(v);
          }
          entry.data = next;
        } else {
          const limit = -count;
          const next = [];
          for (let idx = entry.data.length - 1; idx >= 0; idx--) {
            const v = entry.data[idx];
            if (v === target && removed < limit) {
              removed++;
              continue;
            }
            next.unshift(v);
          }
          entry.data = next;
        }
        store.set(key, entry);
        if (removed) scheduleSave();
        return { result: removed };
      }

      case 'LTRIM': {
        const [, key, startRaw, stopRaw] = cmd;
        const entry = getEntry(key, 'list');
        if (!entry) return { result: 'OK' };
        const range = resolveRange(startRaw, stopRaw, entry.data.length);
        entry.data = range ? entry.data.slice(range.start, range.end + 1) : [];
        store.set(key, entry);
        scheduleSave();
        return { result: 'OK' };
      }

      case 'LLEN': {
        const [, key] = cmd;
        const entry = getEntry(key, 'list');
        return { result: entry ? entry.data.length : 0 };
      }

      // --------------------------------------------------------------------- geo
      case 'GEOADD': {
        const [, key, ...rest] = cmd;
        const entry = touch(key, 'geo');
        let added = 0;
        for (let i = 0; i < rest.length; i += 3) {
          const lon = Number(rest[i]);
          const lat = Number(rest[i + 1]);
          const member = String(rest[i + 2]);
          if (!entry.data.has(member)) added++;
          entry.data.set(member, [lon, lat]);
        }
        scheduleSave();
        return { result: added };
      }

      case 'GEOSEARCH': {
        // GEOSEARCH key FROMLONLAT lon lat (BYBOX w h unit | BYRADIUS r unit)
        //   [ASC|DESC] [COUNT n] [WITHCOORD] [WITHDIST]
        const [, key, ...rest] = cmd;
        const upper = rest.map((r) => String(r).toUpperCase());
        const fromIdx = upper.indexOf('FROMLONLAT');
        if (fromIdx === -1) return { result: [] };
        const lon = Number(rest[fromIdx + 1]);
        const lat = Number(rest[fromIdx + 2]);

        const entry = getEntry(key, 'geo');
        const all = entry ? Array.from(entry.data.entries()) : [];

        let withDistance = all.map(([member, [mLon, mLat]]) => ({
          member,
          distKm: haversineKm(lon, lat, mLon, mLat),
        }));

        const byBoxIdx = upper.indexOf('BYBOX');
        const byRadiusIdx = upper.indexOf('BYRADIUS');
        if (byBoxIdx !== -1) {
          const widthKm = Number(rest[byBoxIdx + 1]);
          const heightKm = Number(rest[byBoxIdx + 2]);
          // Approximate box membership via a bounding-box in degrees derived
          // from the requested half-width/height in km — adequate for this
          // codebase's "nearby facilities" search radius (tens to low
          // hundreds of km), not survey-grade geodesy.
          const halfWidthDeg = widthKm / 2 / (111.32 * Math.cos((lat * Math.PI) / 180) || 1);
          const halfHeightDeg = heightKm / 2 / 110.57;
          withDistance = withDistance.filter(({ member }) => {
            const [mLon, mLat] = entry.data.get(member);
            return Math.abs(mLon - lon) <= halfWidthDeg && Math.abs(mLat - lat) <= halfHeightDeg;
          });
        } else if (byRadiusIdx !== -1) {
          const radiusKm = Number(rest[byRadiusIdx + 1]);
          withDistance = withDistance.filter(({ distKm }) => distKm <= radiusKm);
        }

        const desc = upper.includes('DESC');
        withDistance.sort((a, b) => (desc ? b.distKm - a.distKm : a.distKm - b.distKm));

        const countIdx = upper.indexOf('COUNT');
        if (countIdx !== -1) {
          const n = Number(rest[countIdx + 1]);
          if (Number.isFinite(n) && n > 0) withDistance = withDistance.slice(0, n);
        }

        return { result: withDistance.map((r) => r.member) };
      }

      // ------------------------------------------------------------------- eval
      case 'EVAL':
        return { result: handleEval(cmd) };

      default:
        // Any other command this codebase doesn't currently send: report a
        // clear "unsupported" result rather than silently pretending
        // success, so a future new call site fails loudly during
        // development instead of quietly losing data.
        return { error: `local-redis-rest: unsupported command '${name}'` };
    }
  } catch (err) {
    return { error: `local-redis-rest: ${name} failed: ${err?.message ?? err}` };
  }
}

// ---------------------------------------------------------------------------
// HTTP server (Upstash REST-compatible surface)
// ---------------------------------------------------------------------------

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

    // Upstash MULTI/EXEC transaction endpoint. Same request body as /pipeline
    // (array of command arrays) and same response shape (array of
    // {result}|{error}, one per command). Atomicity comes for free: handleCommand
    // is fully synchronous and Node is single-threaded, so no other request can
    // interleave between the commands. Unlike /pipeline this validates every
    // entry up front and rejects the whole batch (no partial execution), which
    // matches Upstash returning a single top-level {error} for a bad transaction.
    if (req.method === 'POST' && url.pathname === '/multi-exec') {
      const body = await readBody(req);
      const commands = JSON.parse(body || '[]');
      if (!Array.isArray(commands) || !commands.every((c) => Array.isArray(c) && c.length > 0)) {
        return json(res, 400, { error: 'multi-exec body must be an array of non-empty command arrays' });
      }
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

// Only actually bind + log when this file is executed directly (`node
// scripts/local-redis-rest.mjs`) or spawned as a child process. When
// imported for its exports (tests), stay inert.
const isMain = (() => {
  try {
    return import.meta.url === new URL(process.argv[1], 'file:').href || process.argv[1]?.endsWith('local-redis-rest.mjs');
  } catch {
    return false;
  }
})();

if (isMain) {
  loadFromDisk();
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`[local-redis-rest] listening on http://127.0.0.1:${PORT}`);
    console.log(`[local-redis-rest] data file: ${DATA_FILE}`);
    console.log('[local-redis-rest] set these before starting the seeder AND the sidecar (npm start) if launching standalone:');
    console.log(`  UPSTASH_REDIS_REST_URL=http://127.0.0.1:${PORT}`);
    console.log('  UPSTASH_REDIS_REST_TOKEN=local-dev');
    console.log('[local-redis-rest] (npm start auto-launches and wires this up for you — see scripts/start-with-local-redis.mjs)');
  });
}

export { handleCommand, store, server, PORT };
