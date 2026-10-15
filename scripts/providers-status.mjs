#!/usr/bin/env node
// How many open providers actually return data?
//
//   node scripts/providers-status.mjs              read the last seeded result from Redis
//   node scripts/providers-status.mjs --live       fetch everything right now (no Redis needed), then report
//   node scripts/providers-status.mjs --live --only catalog,status --out result.json
//   node scripts/providers-status.mjs --json       machine-readable report
//   node scripts/providers-status.mjs --failing    also list every failing provider with its reason
//
// "Connected" means HTTP 2xx AND the adapter extracted real data. Run it on the machine that will run the
// seeders (with SEED_TOR=1 and --import scripts/shared/tor-preload.mjs if you use Tor) - the numbers depend on
// that network path, not on the code.

import { writeFileSync } from 'node:fs';
import { loadEnvFile, readCanonicalValue, CHROME_UA } from './_seed-utils.mjs';
import { PROVIDERS } from './providers/registry.mjs';
import { collect, statusReport, KEY } from './providers/_runner.mjs';
import { selectProviders } from './seed-open-providers.mjs';

loadEnvFile(import.meta.url);
const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };

let payload;
if (flag('live')) {
  const entries = selectProviders(PROVIDERS, opt('only'));
  console.error(`Fetching ${entries.length} providers (this takes a few minutes)...`);
  payload = await collect({ entries, userAgent: CHROME_UA, concurrency: Number(opt('concurrency')) || 12, deadlineMs: Date.now() + 15 * 60_000 });
} else {
  payload = await readCanonicalValue(KEY);
  if (!payload) { console.error(`No ${KEY} in Redis yet. Run the seeder (node scripts/seed-open-providers.mjs) or use --live.`); process.exit(2); }
}
if (opt('out')) writeFileSync(opt('out'), JSON.stringify(payload, null, 2));
const rep = statusReport(payload);
if (flag('json')) { console.log(JSON.stringify(rep, null, 2)); process.exit(0); }

const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '-');
console.log(`Open providers: ${rep.ok}/${rep.total} connected (${pct(rep.ok, rep.total)}) - ${rep.connectedPublishers} distinct publishers, ${rep.connectedHosts} hosts`);
console.log('\nBy kind');
for (const [k, v] of Object.entries(rep.byKind)) console.log(`  ${k.padEnd(10)} ${String(v.ok).padStart(4)}/${String(v.total).padEnd(4)} ${pct(v.ok, v.total)}`);
console.log('\nBy my confidence label (h = confident, m = believed, l = low)');
for (const [k, v] of Object.entries(rep.byConf)) console.log(`  ${k.padEnd(10)} ${String(v.ok).padStart(4)}/${String(v.total).padEnd(4)} ${pct(v.ok, v.total)}`);
console.log('\nFailures by reason');
for (const [k, n] of Object.entries(rep.failuresByReason).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${k}`);
if (flag('failing')) {
  console.log('\nFailing providers');
  for (const f of rep.failing) console.log(`  ${f.id.padEnd(48)} ${String(f.error).padEnd(28)} ${f.host}${f.consecutiveFailures > 1 ? `  (x${f.consecutiveFailures})` : ''}`);
} else if (rep.failed) console.log('\nRe-run with --failing to list them.');
console.log(rep.ok >= 350 ? '\nTarget of 350 connected providers: MET on this network.' : `\nTarget of 350 connected providers: NOT met (${350 - rep.ok} short). Prune or fix the failing entries.`);
