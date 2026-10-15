#!/usr/bin/env node
// What is the seeder runner actually doing? Reads .seed-status.json (written by seed-on-start.mjs) and the tier config.
//   node scripts/seed-report.mjs                 summary + everything that is not healthy
//   node scripts/seed-report.mjs --unscheduled   also list seed-*.mjs scripts no tier runs
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

export function buildReport(status, config, scripts, now = Date.now()) {
  const entries = Object.entries(config.tiers ?? {}).flatMap(([t, l]) => l.map((e) => ({ ...e, tier: Number(t) })));
  const byName = new Map(entries.map((e) => [e.script, e]));
  const seeders = status.seeders ?? {};
  const problems = [];
  for (const [name, r] of Object.entries(seeders)) {
    const fresh = (byName.get(name)?.freshMinutes ?? config.defaults?.freshMinutes ?? 25) * 60_000;
    const age = r.finishedAt ? now - Date.parse(r.finishedAt) : Infinity;
    if (r.result !== 'OK') problems.push({ name, why: `${r.result}${r.fails ? ` x${r.fails}` : ''}`, note: r.lastLine || '' });
    else if (age > 2 * fresh + (status.refreshMinutes ?? 0) * 60_000) problems.push({ name, why: 'STALE', note: `last OK ${Math.round(age / 3_600_000)} h ago` });
  }
  const neverRun = entries.filter((e) => e.tier <= 2 && !(e.script in seeders)).map((e) => e.script);
  const known = new Set([...byName.keys(), ...Object.keys(config.excluded ?? {})]);
  const unscheduled = scripts.filter((s) => !known.has(s));
  return { counts: status.counts ?? {}, tracked: Object.keys(seeders).length, error: status.error ?? null, problems, neverRun, unscheduled };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = path.join(here, '..');
  const read = (f, d) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return d; } };
  const status = read(process.env.SEED_STATUS_FILE || path.join(root, '.seed-status.json'), null);
  if (!status) { console.log('no .seed-status.json yet: start the server (npm start) so the runner writes it'); process.exit(1); }
  const scripts = readdirSync(here).filter((f) => /^seed-.*\.mjs$/.test(f)).map((f) => f.slice(0, -4));
  const r = buildReport(status, read(path.join(here, 'seed-tiers.config.json'), { tiers: {} }), scripts);
  console.log(`state=${status.state} last pass=${status.lastCompletedAt ?? 'never'} tiers=${(status.tiers ?? []).join(',')}`);
  console.log(`tracked ${r.tracked}: ${JSON.stringify(r.counts)}`);
  if (r.error === 'memory-pressure') console.log('  RUNNER STOPPED EARLY: system RAM was above SEED_MAX_RAM_FRACTION (default 0.875), so seeders at the end of the queue did not run. Raise it in .env.local (e.g. SEED_MAX_RAM_FRACTION=0.95) or free memory.');
  else if (r.error) console.log(`  RUNNER ERROR: ${r.error}`);
  for (const p of r.problems) console.log(`  ${p.why.padEnd(10)} ${p.name}  ${p.note.slice(0, 110)}`);
  if (r.neverRun.length) console.log(`configured (tier 1-2) but never run: ${r.neverRun.join(', ')}`);
  console.log(`${r.unscheduled.length} seed scripts are in no tier and never run (add --unscheduled to list them)`);
  if (process.argv.includes('--unscheduled')) console.log(r.unscheduled.join('\n'));
}
