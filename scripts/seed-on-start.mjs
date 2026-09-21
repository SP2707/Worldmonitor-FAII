#!/usr/bin/env node
// Background seed runner for `npm start` (spawned by start-with-local-redis.mjs).
//
// NOT a replacement for scripts/run-seeders.sh (that one is a sequential,
// Docker-stack-oriented shell loop). This runs seeders in priority tiers with
// a small concurrency limit and a per-seeder timeout, records results in
// .seed-status.json (read by the sidecar's /api/seed-status route), skips
// seeders whose last OK run is still fresh, and optionally refreshes on a timer.
//
// Env:
//   SEED_TIERS=1,2            tiers to run (3 = heavy/regional, off by default)
//   SEED_CONCURRENCY=2        parallel seeders (default from config, 2)
//   SEED_TIMEOUT_SECONDS=120  per-seeder timeout (default from config)
//   SEED_REFRESH_MINUTES=30   re-run stale seeders every N min; 0 = off
//   SEED_STATUS_FILE=...      default <repo>/.seed-status.json
//   SEED_CONFIG=...           default scripts/seed-tiers.config.json
//   SEED_ON_START=0           (checked by start-with-local-redis.mjs) disables this runner
//
// No telemetry: the only network traffic is what each seed-*.mjs does itself,
// plus loopback calls to Redis and the sidecar's health probe.

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, renameSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.join(__dirname, '..');
const MARKER_KEY = 'seed-runner:marker';

// Same heuristic as scripts/run-seeders.sh: grep -qi "skip\|not set\|missing.*key\|not found"
// against the seeder's last output line.
export const SKIP_RE = /skip|not set|missing.*key|not found/i;

export function classify({ timedOut, code, lastLine }) {
  if (timedOut) return 'TIMEOUT';
  if (SKIP_RE.test(lastLine || '')) return 'SKIP';
  if (code === 0) return 'OK';
  return 'FAIL';
}

export function loadConfig(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

export function parseTiers(raw) {
  const tiers = String(raw ?? '1,2').split(',').map((s) => s.trim()).filter(Boolean);
  return tiers.filter((t) => /^\d+$/.test(t));
}

/** Ordered list of {name, tier, entry} for the enabled tiers. */
export function selectEntries(config, tiers) {
  const out = [];
  for (const t of tiers) {
    for (const entry of config.tiers?.[t] ?? []) {
      if (config.excluded && entry.script in config.excluded) continue;
      out.push({ name: entry.script, tier: Number(t), entry });
    }
  }
  return out;
}

export function missingRequiredEnv(entry, env) {
  const any = entry.requiresAnyEnv;
  if (!Array.isArray(any) || any.length === 0) return null;
  return any.some((k) => (env[k] ?? '').trim() !== '') ? null : any;
}

function lastNonEmptyLine(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return lines.length ? lines[lines.length - 1].slice(0, 300) : '';
}

/** Run one seeder to completion (or timeout). Never rejects. */
export function runSeeder(file, { timeoutMs, env, cwd }) {
  return new Promise((resolve) => {
    const started = Date.now();
    let tail = '';
    let timedOut = false;
    let settled = false;
    const child = spawn(process.execPath, [file], { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
    const onData = (buf) => {
      tail = (tail + buf.toString('utf8')).slice(-4096);
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    const finish = (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(killTimer);
      resolve({ timedOut, code, lastLine: lastNonEmptyLine(tail), durationMs: Date.now() - started });
    };
    let killTimer = null;
    const timer = setTimeout(() => {
      timedOut = true;
      try { child.kill('SIGTERM'); } catch { /* gone */ }
      killTimer = setTimeout(() => {
        try { child.kill('SIGKILL'); } catch { /* gone */ }
        // If it still never reports exit, stop waiting.
        setTimeout(() => finish(null), 2000).unref?.();
      }, 5000);
    }, timeoutMs);
    child.on('error', (err) => {
      tail += `\nspawn error: ${err.message}`;
      finish(1);
    });
    child.on('close', (code) => finish(code));
  });
}

export async function waitForRedis(url, token, timeoutMs, fetchImpl = fetch) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetchImpl(`${url}/get/__seed_runner_probe__`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(2000),
      });
      if (r.ok) return true;
    } catch { /* retry */ }
    await new Promise((r) => setTimeout(r, 300));
  }
  return false;
}

async function redisCmd(url, token, cmd) {
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(cmd),
      signal: AbortSignal.timeout(3000),
    });
    if (!r.ok) return null;
    return (await r.json()).result ?? null;
  } catch {
    return null;
  }
}

function emptyCounts() {
  return { OK: 0, SKIP: 0, FAIL: 0, TIMEOUT: 0, FRESH: 0 };
}

export function createRunner(opts) {
  const env = opts.env ?? process.env;
  const scriptsDir = opts.scriptsDir ?? __dirname;
  const statusFile = opts.statusFile ?? env.SEED_STATUS_FILE ?? path.join(PROJECT_DIR, '.seed-status.json');
  const config = opts.config;
  const tiers = opts.tiers ?? parseTiers(env.SEED_TIERS);
  const concurrency = Math.max(1, Number(env.SEED_CONCURRENCY) || config.defaults?.concurrency || 2);
  const defaultTimeoutSec = Number(env.SEED_TIMEOUT_SECONDS) || config.defaults?.timeoutSec || 120;
  const defaultFreshMin = config.defaults?.freshMinutes ?? 25;
  const redisUrl = env.UPSTASH_REDIS_REST_URL;
  const redisToken = env.UPSTASH_REDIS_REST_TOKEN || '';
  const log = opts.log ?? ((m) => console.log(`[seed] ${m}`));

  let prev = { seeders: {} };
  try { prev = JSON.parse(readFileSync(statusFile, 'utf8')); } catch { /* first run */ }

  const status = {
    state: 'idle',
    tiers,
    currentTier: null,
    marker: prev.marker ?? null,
    startedAt: null,
    lastCompletedAt: prev.lastCompletedAt ?? null,
    refreshMinutes: Number(env.SEED_REFRESH_MINUTES ?? 30) || 0,
    counts: emptyCounts(),
    running: [],
    seeders: { ...(prev.seeders ?? {}) },
  };
  let running = false;
  let saveTimer = null;

  function save(immediate = false) {
    const write = () => {
      saveTimer = null;
      try {
        mkdirSync(path.dirname(statusFile), { recursive: true });
        const tmp = `${statusFile}.${process.pid}.tmp`;
        writeFileSync(tmp, JSON.stringify(status));
        renameSync(tmp, statusFile);
      } catch (err) {
        log(`could not write status file: ${err.message}`);
      }
    };
    if (immediate) { if (saveTimer) clearTimeout(saveTimer); write(); return; }
    if (!saveTimer) { saveTimer = setTimeout(write, 200); saveTimer.unref?.(); }
  }

  async function pass() {
    if (running) return status;
    running = true;
    status.state = 'running';
    status.startedAt = new Date().toISOString();
    status.counts = emptyCounts();
    status.running = [];
    save(true);

    // Freshness is only trusted if Redis still holds what the last run wrote.
    // The marker key is written after a pass; if Redis lost it (data file
    // deleted, different instance), forget prior results and reseed.
    let trustPrev = true;
    if (redisUrl) {
      const ready = await waitForRedis(redisUrl, redisToken, opts.redisWaitMs ?? 60_000);
      if (!ready) {
        status.state = 'done';
        status.error = 'redis-unreachable';
        status.lastCompletedAt = new Date().toISOString();
        log(`Redis at ${redisUrl} did not answer; seeding skipped this pass.`);
        save(true);
        running = false;
        return status;
      }
      delete status.error;
      const marker = await redisCmd(redisUrl, redisToken, ['GET', MARKER_KEY]);
      trustPrev = marker != null && marker === status.marker;
    } else {
      status.error = 'UPSTASH_REDIS_REST_URL not set';
      status.state = 'done';
      status.lastCompletedAt = new Date().toISOString();
      save(true);
      running = false;
      return status;
    }

    const now = opts.now ?? Date.now;
    for (const t of tiers) {
      const entries = selectEntries(config, [t]);
      if (entries.length === 0) continue;
      status.currentTier = Number(t);
      log(`tier ${t}: ${entries.length} seeder(s)`);
      const queue = entries.slice();
      const worker = async () => {
        while (queue.length) {
          const { name, tier, entry } = queue.shift();
          const record = (result, extra = {}) => {
            status.counts[result] = (status.counts[result] ?? 0) + 1;
            status.seeders[name] = {
              tier, result, lastLine: extra.lastLine ?? '',
              finishedAt: extra.finishedAt ?? new Date().toISOString(),
              durationMs: extra.durationMs ?? 0,
              ...(extra.fresh ? { fresh: true } : {}),
            };
            save();
          };
          const file = path.join(scriptsDir, `${name}.mjs`);
          if (!existsSync(file)) { record('FAIL', { lastLine: 'script file not found' }); log(`${name}: FAIL (missing file)`); continue; }
          const missing = missingRequiredEnv(entry, env);
          if (missing) { record('SKIP', { lastLine: `needs one of: ${missing.join(', ')}` }); log(`${name}: SKIP (needs ${missing.join('/')})`); continue; }
          const prior = trustPrev ? status.seeders[name] : null;
          const freshMs = (entry.freshMinutes ?? defaultFreshMin) * 60_000;
          if (prior && prior.result === 'OK' && prior.finishedAt && now() - Date.parse(prior.finishedAt) < freshMs) {
            status.counts.FRESH += 1;
            status.seeders[name] = { ...prior, fresh: true };
            save();
            log(`${name}: fresh, skipped`);
            continue;
          }
          status.running.push(name);
          save();
          const timeoutMs = (env.SEED_TIMEOUT_SECONDS ? defaultTimeoutSec : (entry.timeoutSec ?? defaultTimeoutSec)) * 1000;
          // Belt and braces for "no telemetry": scripts/lib/llm-telemetry.cjs only
          // posts to Axiom when USAGE_TELEMETRY=1 and AXIOM_API_TOKEN are set.
          const childEnv = { ...env, USAGE_TELEMETRY: '0' };
          const r = await runSeeder(file, { timeoutMs, env: childEnv, cwd: PROJECT_DIR });
          status.running = status.running.filter((n) => n !== name);
          const result = classify(r);
          record(result, { lastLine: r.lastLine, durationMs: r.durationMs });
          log(`${name}: ${result} (${Math.round(r.durationMs / 1000)}s)${result === 'OK' ? '' : ` ${r.lastLine}`}`);
        }
      };
      await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, worker));
    }

    status.currentTier = null;
    status.running = [];
    status.state = 'done';
    status.lastCompletedAt = new Date().toISOString();
    status.marker = status.marker && trustPrev ? status.marker : randomBytes(8).toString('hex');
    await redisCmd(redisUrl, redisToken, ['SET', MARKER_KEY, status.marker]);
    save(true);
    log(`pass complete: ${JSON.stringify(status.counts)}`);
    running = false;
    return status;
  }

  return { pass, status, isRunning: () => running };
}

async function waitForSidecar(timeoutMs) {
  const port = process.env.LOCAL_API_PORT || '46123';
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/api/sidecar-health`, { signal: AbortSignal.timeout(1000) });
      if (r.ok) return true;
    } catch { /* retry */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function main() {
  try {
    const { loadEnvFile } = await import('./_seed-utils.mjs');
    loadEnvFile(import.meta.url);
  } catch (err) {
    console.log(`[seed] could not load .env via _seed-utils (${err.message}); using process env only`);
  }
  const configFile = process.env.SEED_CONFIG || path.join(__dirname, 'seed-tiers.config.json');
  const config = loadConfig(configFile);
  // Start after the sidecar answers so the server never competes with us for
  // startup; if it never answers, seed anyway (seeding does not need it).
  if (process.env.SEED_WAIT_FOR_SIDECAR !== '0') {
    const up = await waitForSidecar(60_000);
    if (!up) console.log('[seed] sidecar health probe did not answer within 60s; seeding anyway');
  }
  const runner = createRunner({ config });
  await runner.pass();
  const refreshMin = Number(process.env.SEED_REFRESH_MINUTES ?? 30) || 0;
  if (refreshMin > 0) {
    console.log(`[seed] refresh every ${refreshMin} min (stale seeders only)`);
    setInterval(() => { runner.pass().catch((e) => console.log(`[seed] refresh failed: ${e.message}`)); }, refreshMin * 60_000);
  } else {
    process.exit(0);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((err) => { console.error(`[seed] runner crashed: ${err?.stack ?? err}`); process.exit(1); });
}
