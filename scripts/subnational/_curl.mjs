// Fetch through the system curl binary (curl.exe ships with Windows 10+). The OECD SDMX API answers HTTP 500 to
// Node's built-in fetch for the same requests that curl serves with 200 (verified with scripts/oecd-diagnose2.mjs),
// so providers that talk to it use this instead. Falls back to the built-in fetch when curl is not installed.
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const curlBinary = (platform = process.platform) => (platform === 'win32' ? 'curl.exe' : 'curl');

export function buildCurlArgs(url, { headers = {}, timeoutSec = 120, outFile, method, bodyFile }) {
  const args = ['-sS', '-L', '--compressed', '--max-time', String(timeoutSec), '-o', outFile, '-w', '%{http_code}'];
  // Request body (e.g. PxWeb queries) goes through a temp file so quoting and size are never a shell concern.
  if (bodyFile) args.push('-X', method ?? 'POST', '--data-binary', `@${bodyFile}`);
  for (const [k, v] of Object.entries(headers)) args.push('-H', `${k}: ${v}`);
  args.push(url);
  return args;
}

/** fetch()-compatible subset: returns a Response with status and body; throws on transport errors. */
export async function curlFetch(url, init = {}, { bin = curlBinary(), spawnFn = spawn, fallback = globalThis.fetch } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'wm-curl-'));
  const outFile = join(dir, 'body');
  let bodyFile;
  if (init.body != null) { bodyFile = join(dir, 'request'); writeFileSync(bodyFile, init.body); }
  const timeoutSec = Math.max(5, Math.ceil(((init.timeoutMs ?? 120_000)) / 1000));
  try {
    const { code, stdout, stderr, missing } = await new Promise((resolve) => {
      let child;
      try { child = spawnFn(bin, buildCurlArgs(url, { headers: init.headers ?? {}, timeoutSec, outFile, method: init.method, bodyFile }), { stdio: ['ignore', 'pipe', 'pipe'] }); }
      catch (err) { resolve({ code: -1, stdout: '', stderr: err.message, missing: err.code === 'ENOENT' }); return; }
      let out = ''; let err = '';
      child.stdout.on('data', (b) => { out += b; });
      child.stderr.on('data', (b) => { err += b; });
      child.on('error', (e) => resolve({ code: -1, stdout: out, stderr: e.message, missing: e.code === 'ENOENT' }));
      child.on('close', (c) => resolve({ code: c, stdout: out, stderr: err }));
    });
    if (missing) return fallback(url, { headers: init.headers, signal: init.signal, method: init.method, body: init.body });
    const status = Number(String(stdout).trim().slice(-3));
    if (code !== 0 || !Number.isInteger(status) || status < 100) throw new Error(`curl failed (exit ${code}): ${String(stderr).trim().slice(0, 200)}`);
    return new Response(readFileSync(outFile), { status });
  } finally {
    try { rmSync(dir, { recursive: true, force: true }); } catch { /* temp dir cleanup is best effort */ }
  }
}
