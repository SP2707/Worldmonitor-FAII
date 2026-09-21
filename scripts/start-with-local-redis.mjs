#!/usr/bin/env node
// `npm start` entrypoint. Wraps the real start chain (docker/build-handlers.mjs
// -> src-tauri/sidecar/local-api-server.mjs) and, only when no Redis is
// already configured, transparently launches this fork's local, in-process
// Upstash-REST-compatible stand-in (scripts/local-redis-rest.mjs) first and
// points the sidecar at it.
//
// Why this exists: a bare `npm install && npm start` with no env vars and no
// external account previously left every Redis-backed route (including
// /api/news/v1/list-feed-digest, the one route Alfred's Recon lane actually
// queries) returning `coverage.state: "unavailable"` — there was nowhere for
// digest state to persist between requests. This fork is explicitly
// Docker-free and account-free (README: "npm install && npm start, that's
// it"), so the fix has to be a plain Node process, not a container.
//
// What this script does, in order:
//   1. Load .env (same loader every seeder uses) so an operator-configured
//      UPSTASH_REDIS_REST_URL (real Upstash, or their own Redis stand-in) is
//      visible before deciding anything.
//   2. If UPSTASH_REDIS_REST_URL is already set: do nothing extra — run the
//      normal start chain. Redis-backed routes talk to whatever the operator
//      configured, same as always.
//   3. Otherwise: spawn scripts/local-redis-rest.mjs as a background child,
//      wait for it to accept connections, and inject
//      UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN into the
//      environment the sidecar chain inherits. The sidecar's own SSRF guard
//      (src-tauri/sidecar/local-api-server.mjs) already special-cases a
//      loopback UPSTASH_REDIS_REST_URL for exactly this shim (see the
//      addConfiguredPrivateOrigin('UPSTASH_REDIS_REST_URL', ...) comment
//      there), so no further wiring is needed on that side.
//   4. Run `node docker/build-handlers.mjs` to completion, then exec
//      `node src-tauri/sidecar/local-api-server.mjs` with the (possibly
//      augmented) environment, stdio inherited.
//   4b. Right after the sidecar is spawned, launch scripts/seed-on-start.mjs in
//      the background (non-blocking; waits for the sidecar health probe and
//      Redis itself). Progress: GET /api/seed-status (auth required).
//   5. On the sidecar process exiting or this process receiving
//      SIGINT/SIGTERM, stop the local Redis shim too (it's not durable
//      infrastructure — it's dev/self-hosted scaffolding for this process's
//      own lifetime, and its data is preserved on disk between runs).
//
// Opt out entirely by setting UPSTASH_REDIS_REST_URL yourself (env or
// .env) — pointing it at real Upstash, or your own already-running
// instance of this shim, or docker/redis-rest-proxy.mjs if you've chosen to
// run this fork with Docker after all.

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from './_seed-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.join(__dirname, '..');
const LOCAL_REDIS_PORT = Number.parseInt(process.env.PORT_LOCAL_REDIS || '8079', 10);
const LOCAL_REDIS_URL = `http://127.0.0.1:${LOCAL_REDIS_PORT}`;
const LOCAL_REDIS_TOKEN = process.env.LOCAL_REDIS_TOKEN || 'local-dev';
const READY_TIMEOUT_MS = 10_000;
const READY_POLL_INTERVAL_MS = 150;

// Loads .env / .env.local into process.env (same convention every seed
// script uses) so an operator's own UPSTASH_REDIS_REST_URL is honored.
loadEnvFile(import.meta.url);

// Both the seed runner and the sidecar's /api/seed-status route read this file.
process.env.SEED_STATUS_FILE ||= path.join(PROJECT_DIR, '.seed-status.json');

let redisChild = null;
let seedChild = null;

async function waitUntilReady(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastErr = null;
  while (Date.now() < deadline) {
    try {
      const resp = await fetch(`${url}/get/__local_redis_ready_probe__`, {
        headers: { Authorization: `Bearer ${LOCAL_REDIS_TOKEN}` },
        signal: AbortSignal.timeout(1_000),
      });
      if (resp.ok || resp.status === 401) return true; // reachable either way
    } catch (err) {
      lastErr = err;
    }
    await new Promise((r) => setTimeout(r, READY_POLL_INTERVAL_MS));
  }
  throw new Error(`local-redis-rest did not become ready within ${timeoutMs}ms: ${lastErr?.message ?? 'no response'}`);
}

function launchLocalRedisShim() {
  const child = spawn(process.execPath, [path.join(__dirname, 'local-redis-rest.mjs')], {
    cwd: PROJECT_DIR,
    env: {
      ...process.env,
      PORT: String(LOCAL_REDIS_PORT),
      LOCAL_REDIS_TOKEN,
    },
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  child.on('exit', (code, signal) => {
    if (code !== null && code !== 0) {
      console.warn(`[start] local-redis-rest exited early (code=${code}, signal=${signal ?? 'none'})`);
    }
  });
  return child;
}

function runToCompletion(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: PROJECT_DIR, env: process.env, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`))));
  });
}

// Background seeding (scripts/seed-on-start.mjs). Never awaited: the sidecar is
// already serving by the time this runs, and the runner has its own timeouts.
// Opt out with SEED_ON_START=0. It waits for Redis itself, so this behaves the
// same whether the stand-in was launched above or UPSTASH_REDIS_REST_URL was
// preset by the caller.
function launchSeedRunner() {
  if (process.env.SEED_ON_START === '0') {
    console.log('[start] SEED_ON_START=0 — background seeding disabled.');
    return;
  }
  seedChild = spawn(process.execPath, [path.join(__dirname, 'seed-on-start.mjs')], {
    cwd: PROJECT_DIR,
    env: process.env,
    stdio: 'inherit',
  });
  seedChild.on('error', (err) => console.warn(`[start] could not launch seed runner: ${err.message}`));
  seedChild.on('exit', (code) => {
    if (code !== null && code !== 0) console.warn(`[start] seed runner exited (code=${code}); server unaffected.`);
  });
}

function stopSeedRunner() {
  if (seedChild && !seedChild.killed) {
    try { seedChild.kill(); } catch { /* already gone */ }
  }
}

function stopRedisShim() {
  if (redisChild && !redisChild.killed) {
    try {
      redisChild.kill();
    } catch {
      /* already gone */
    }
  }
}

async function main() {
  if (process.env.UPSTASH_REDIS_REST_URL) {
    console.log('[start] UPSTASH_REDIS_REST_URL already configured — using it, not launching the local Redis stand-in.');
  } else {
    console.log(`[start] No Redis configured — auto-launching the local, in-process stand-in on ${LOCAL_REDIS_URL} (no Docker, no account).`);
    redisChild = launchLocalRedisShim();
    await waitUntilReady(LOCAL_REDIS_URL, READY_TIMEOUT_MS);
    process.env.UPSTASH_REDIS_REST_URL = LOCAL_REDIS_URL;
    process.env.UPSTASH_REDIS_REST_TOKEN = LOCAL_REDIS_TOKEN;
    console.log('[start] local Redis stand-in ready; digest, tracking, and every other Redis-backed route now have real storage.');
  }

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
      stopSeedRunner();
      stopRedisShim();
      process.exit(0);
    });
  }

  try {
    await runToCompletion(process.execPath, [path.join(PROJECT_DIR, 'docker', 'build-handlers.mjs')]);
  } catch (err) {
    stopRedisShim();
    console.error(`[start] build-handlers failed: ${err.message}`);
    process.exit(1);
  }

  const sidecar = spawn(process.execPath, [path.join(PROJECT_DIR, 'src-tauri', 'sidecar', 'local-api-server.mjs')], {
    cwd: PROJECT_DIR,
    env: process.env,
    stdio: 'inherit',
  });
  launchSeedRunner();
  sidecar.on('exit', (code) => {
    stopSeedRunner();
    stopRedisShim();
    process.exit(code ?? 0);
  });
}

main().catch((err) => {
  console.error(`[start] ${err?.stack ?? err}`);
  stopRedisShim();
  process.exit(1);
});
