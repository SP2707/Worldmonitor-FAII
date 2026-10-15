#!/usr/bin/env node
// Wires every scripts/seed-*.mjs that no tier runs into tier 4 of scripts/seed-tiers.config.json (idempotent: tier-4 entries
// written by this script carry "auto": true and are regenerated on each run; hand-written entries are never touched).
// Left out on purpose, each with a reason recorded in the config's "excluded" map:
//   * seed-bundle-*      run groups of the same seeders that are wired individually (would run everything twice)
//   * helpers / CI / on-demand jobs that are not data seeders (the runner itself, the report, benchmarks, locked-disabled jobs)
//   * seed-digest-notifications  sends user notifications (a side effect), not data
//   * warm-pings of the upstream hosted gateway (api.worldmonitor.app): seeds nothing locally and would send requests to a non-local host
// A seeder that needs a key you do not have is not filtered here: the runner records it as SKIP/FAIL and backs off.
// Usage: node scripts/wire-all-seeders.mjs [--dry]
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = dirname(fileURLToPath(import.meta.url));
const FILE = join(dir, 'seed-tiers.config.json');
const cfg = JSON.parse(readFileSync(FILE, 'utf8'));
const NOT_SEEDERS = {
  'seed-on-start': 'the runner itself', 'seed-report': 'status report tool, not a seeder', 'seed-recall-benchmark': 'CI benchmark job (feed-validation workflow)',
  'seed-gta-update': 'locked disabled upstream', 'seed-tps-open-data': 'on-demand fetch, not a scheduled seeder',
  'seed-digest-notifications': 'sends alert-digest notifications (side effect), not data',
};
const UPSTREAM_HOST = /api\.worldmonitor\.app/;
const manual = new Set(Object.entries(cfg.tiers).flatMap(([t, es]) => es.filter((e) => !e.auto).map((e) => e.script)));
const all = readdirSync(dir).filter((f) => /^seed-.*\.mjs$/.test(f)).map((f) => f.replace(/\.mjs$/, '')).sort();
cfg.excluded ??= {};
for (const k of Object.keys(cfg.excluded)) if (cfg.excluded[k].startsWith('[auto]')) delete cfg.excluded[k];
const tier4 = [];
for (const name of all) {
  if (manual.has(name) || name in cfg.excluded) continue;
  const src = readFileSync(join(dir, `${name}.mjs`), 'utf8');
  if (/^seed-bundle-/.test(name)) { cfg.excluded[name] = '[auto] bundle: runs seeders that are wired individually (would double-run them)'; continue; }
  if (NOT_SEEDERS[name]) { cfg.excluded[name] = `[auto] ${NOT_SEEDERS[name]}`; continue; }
  if (UPSTREAM_HOST.test(src)) { cfg.excluded[name] = '[auto] warm-pings the upstream hosted gateway (api.worldmonitor.app); seeds nothing locally'; continue; }
  tier4.push({ script: name, freshMinutes: 360, timeoutSec: 180, auto: true });
}
cfg.tiers['4'] = [...(cfg.tiers['4'] ?? []).filter((e) => !e.auto && !all.includes(e.script)), ...tier4];
if (process.argv.includes('--dry')) { console.log(`would wire ${tier4.length} seeders into tier 4; exclude ${Object.keys(cfg.excluded).filter((k) => cfg.excluded[k].startsWith('[auto]')).length}`); process.exit(0); }
writeFileSync(FILE, JSON.stringify(cfg, null, 2) + '\n');
console.log(`tier 4: ${tier4.length} seeders wired; auto-excluded: ${Object.keys(cfg.excluded).filter((k) => cfg.excluded[k].startsWith('[auto]')).length}`);
