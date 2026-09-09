#!/usr/bin/env node
// Batch-runs every scripts/seed-*.mjs against the currently-configured
// local stack (local-redis-rest.mjs + npm start sidecar, whatever env vars
// are already set in THIS shell) and classifies each by the exact bookend
// line scripts/_seed-utils.mjs's shared runSeed() always prints:
//   "=== Done ... ==="              -> completed (may still be degraded,
//                                      see the parenthetical: NO SOURCE /
//                                      RETRY FAILED / no write)
//   "=== Failed gracefully ... ==="  -> ran, but failed (still exits 0 --
//                                      that's deliberate, for cron)
// A script matching neither, or that times out, or that exits non-zero
// (a genuine crash, not the deliberate graceful-exit path) is flagged
// separately rather than silently miscounted.
//
// For every non-clean outcome, greps the captured output for the
// "Missing <NAME>" / "not set" / env-var-shaped patterns this codebase's
// scripts already print (getRedisCredentials, RELAY_API_KEY notes, etc.)
// so the report surfaces WHICH credential each failure is actually
// blocked on, not just that it failed.
//
// Usage:
//   node batch-seed-test.mjs [--limit N] [--concurrency N] [--timeout-ms N] [--filter substring]
//
// Must be run from the Worldmonitor-FAII repo root, in a shell that already
// has UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN / API_BASE_URL /
// LOCAL_API_TOKEN / WORLDMONITOR_VALID_KEYS (and GROQ_API_KEY or an Ollama
// config) set -- exactly the env this session already proved works for
// seed-insights.mjs. Every child process inherits this shell's env as-is.

import { spawn } from 'node:child_process';
import { readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
function argVal(name, def) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] !== undefined ? args[i + 1] : def;
}
const LIMIT = parseInt(argVal('limit', '0'), 10) || Infinity;
const CONCURRENCY = parseInt(argVal('concurrency', '3'), 10) || 3;
const TIMEOUT_MS = parseInt(argVal('timeout-ms', '90000'), 10) || 90000;
const FILTER = argVal('filter', '');

const REPO_ROOT = process.cwd();
const SCRIPTS_DIR = path.join(REPO_ROOT, 'scripts');

let files = readdirSync(SCRIPTS_DIR)
  .filter((f) => f.startsWith('seed-') && f.endsWith('.mjs'))
  .sort();
if (FILTER) files = files.filter((f) => f.includes(FILTER));
files = files.slice(0, LIMIT === Infinity ? files.length : LIMIT);

console.log(`[batch] ${files.length} seed script(s) queued, concurrency=${CONCURRENCY}, timeout=${TIMEOUT_MS}ms`);
console.log(`[batch] env check: UPSTASH_REDIS_REST_URL=${process.env.UPSTASH_REDIS_REST_URL || '(unset)'} API_BASE_URL=${process.env.API_BASE_URL || '(unset)'} GROQ_API_KEY=${process.env.GROQ_API_KEY ? '(set)' : '(unset)'} OLLAMA_API_URL=${process.env.OLLAMA_API_URL || '(unset)'}`);
console.log('');

const MISSING_CRED_PATTERNS = [
  /Missing\s+([A-Z][A-Z0-9_]{3,})/g,
  /([A-Z][A-Z0-9_]{3,})\s+(?:is\s+)?not\s+set/g,
  /([A-Z][A-Z0-9_]{3,})\s+not\s+configured/g,
  /no\s+([A-Z][A-Z0-9_]{3,})\s+set/gi,
];
function extractMissingCreds(text) {
  const found = new Set();
  for (const re of MISSING_CRED_PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text))) {
      const name = m[1].toUpperCase();
      // Filter obvious non-credential false positives (short/common words caught by the regex).
      if (name.length >= 4 && /_/.test(name) || /^[A-Z0-9_]{6,}$/.test(name)) found.add(name);
    }
  }
  return [...found];
}

function classify(stdout, stderr, exitCode, timedOut) {
  const combined = stdout + '\n' + stderr;
  if (timedOut) return { status: 'TIMEOUT', detail: `exceeded ${TIMEOUT_MS}ms` };
  const doneMatch = combined.match(/=== Done \(([^)]*)\) ===/);
  const failedMatch = combined.match(/=== Failed gracefully \(([^)]*)\) ===/);
  if (doneMatch) {
    const paren = doneMatch[1];
    const degraded = /NO SOURCE|RETRY FAILED|no write/.test(paren);
    return { status: degraded ? 'DONE_DEGRADED' : 'DONE_OK', detail: paren };
  }
  if (failedMatch) return { status: 'FAILED_GRACEFULLY', detail: failedMatch[1] };
  if (exitCode !== 0) return { status: 'CRASHED', detail: `exit code ${exitCode}` };
  return { status: 'UNKNOWN', detail: 'no recognized bookend line (may not use runSeed())' };
}

function runOne(file) {
  return new Promise((resolve) => {
    const fullPath = path.join(SCRIPTS_DIR, file);
    const child = spawn(process.execPath, [fullPath], {
      cwd: REPO_ROOT,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, TIMEOUT_MS);
    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    const start = Date.now();
    child.on('close', (exitCode) => {
      clearTimeout(timer);
      const wallMs = Date.now() - start;
      const { status, detail } = classify(stdout, stderr, exitCode, timedOut);
      const missingCreds = extractMissingCreds(stdout + '\n' + stderr);
      resolve({
        file,
        status,
        detail,
        wallMs,
        exitCode,
        missingCreds,
        tail: (stdout + '\n' + stderr).split('\n').filter(Boolean).slice(-15).join('\n'),
      });
    });
  });
}

async function runPool(items, concurrency, worker) {
  const results = [];
  let idx = 0;
  let doneCount = 0;
  async function next() {
    while (idx < items.length) {
      const i = idx++;
      const item = items[i];
      const r = await worker(item);
      results[i] = r;
      doneCount++;
      const icon = r.status === 'DONE_OK' ? 'OK  ' : r.status === 'DONE_DEGRADED' ? 'DEGR' : r.status === 'FAILED_GRACEFULLY' ? 'FAIL' : r.status === 'TIMEOUT' ? 'TOUT' : r.status === 'CRASHED' ? 'CRSH' : 'UNK ';
      console.log(`[${String(doneCount).padStart(3)}/${items.length}] ${icon} ${(r.wallMs / 1000).toFixed(1).padStart(6)}s  ${r.file}${r.missingCreds.length ? '  missing=' + r.missingCreds.join(',') : ''}`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, next));
  return results;
}

const startedAt = new Date();
const results = await runPool(files, CONCURRENCY, runOne);
const finishedAt = new Date();

const summary = { DONE_OK: 0, DONE_DEGRADED: 0, FAILED_GRACEFULLY: 0, TIMEOUT: 0, CRASHED: 0, UNKNOWN: 0 };
for (const r of results) summary[r.status] = (summary[r.status] || 0) + 1;

const allMissingCreds = new Map();
for (const r of results) {
  for (const c of r.missingCreds) {
    if (!allMissingCreds.has(c)) allMissingCreds.set(c, []);
    allMissingCreds.get(c).push(r.file);
  }
}

console.log('\n=== Summary ===');
for (const [status, count] of Object.entries(summary)) {
  console.log(`  ${status.padEnd(18)} ${count}`);
}
console.log(`  TOTAL              ${results.length}`);
console.log(`  Wall time: ${((finishedAt - startedAt) / 1000).toFixed(0)}s`);

if (allMissingCreds.size) {
  console.log('\n=== Missing credentials, by env var (across all non-OK scripts) ===');
  const sorted = [...allMissingCreds.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [cred, scripts] of sorted) {
    console.log(`  ${cred.padEnd(30)} blocks ${scripts.length} script(s): ${scripts.slice(0, 5).join(', ')}${scripts.length > 5 ? ', ...' : ''}`);
  }
}

const reportPath = path.join(REPO_ROOT, 'scripts', '_seed-batch-report.json');
writeFileSync(reportPath, JSON.stringify({
  startedAt: startedAt.toISOString(),
  finishedAt: finishedAt.toISOString(),
  wallMs: finishedAt - startedAt,
  concurrency: CONCURRENCY,
  timeoutMs: TIMEOUT_MS,
  totalScripts: results.length,
  summary,
  missingCredentials: Object.fromEntries([...allMissingCreds.entries()].map(([k, v]) => [k, v])),
  results,
}, null, 2), 'utf8');
console.log(`\n[batch] full report written to scripts/_seed-batch-report.json`);
