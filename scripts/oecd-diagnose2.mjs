#!/usr/bin/env node
// Same OECD URL through different HTTP clients, to see whether the 500 depends on the client (Windows only for 2-4).
import { spawnSync } from 'node:child_process';
const URL_ = 'https://sdmx.oecd.org/public/rest/data/OECD.CFE.EDS,DSD_REG_DEMO@DF_LIFE_EXP,/A.TL2......?startPeriod=2020&endPeriod=2020&dimensionAtObservation=AllDimensions&format=csvfilewithlabels';
const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const show = (name, status, extra = '') => console.log(`${String(status).padEnd(4)} ${name}${extra ? '  ' + extra : ''}`);
async function node(name, headers) {
  try { const r = await fetch(URL_, { headers, signal: AbortSignal.timeout(120_000) }); const t = await r.text(); show(name, r.status, `bytes=${t.length}`); }
  catch (e) { show(name, 'ERR', e.message); }
}
function run(name, cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', timeout: 120_000 });
  show(name, (r.stdout || '').trim().slice(0, 40) || 'ERR', r.error ? r.error.message : (r.stderr || '').trim().slice(0, 100));
}
await node('A node, custom UA, Accept text/csv', { 'User-Agent': 'worldmonitor-faii-subnational/1.0', Accept: 'text/csv' });
await sleep(8000);
await node('B node, browser UA, Accept text/csv', { 'User-Agent': BROWSER_UA, Accept: 'text/csv' });
await sleep(8000);
await node('C node, browser UA, no Accept', { 'User-Agent': BROWSER_UA });
await sleep(8000);
run('D powershell Invoke-WebRequest', 'powershell', ['-NoProfile', '-Command', `try { (Invoke-WebRequest -UseBasicParsing '${URL_}').StatusCode } catch { $_.Exception.Response.StatusCode.value__ }`]);
await sleep(8000);
run('E curl.exe, no headers', 'curl.exe', ['-s', '-o', 'NUL', '-w', '%{http_code}', URL_]);
await sleep(8000);
run('F curl.exe, Accept text/csv', 'curl.exe', ['-s', '-o', 'NUL', '-w', '%{http_code}', '-H', 'Accept: text/csv', URL_]);
