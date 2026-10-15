#!/usr/bin/env node
// Keeps a local history of the subnational values: one SQLite row per (division, quarter, category, metric).
// Redis only holds the latest payload; this is what lets you see change over time.
//   node scripts/history-snapshot.mjs                 snapshot all 10 categories from Redis
//   node scripts/history-snapshot.mjs US-CA grp       print the stored history of one division/category
// Uses Node's built-in node:sqlite (Node >= 22.5, still marked experimental): no new dependency.
// Re-running within a quarter overwrites that quarter's rows. Nothing is ever pruned: it is a few thousand
// rows per quarter, so ponytail: add pruning if the file ever matters.
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_DB = process.env.HISTORY_DB || path.join(here, '..', '.history.db');

export const periodOf = (d) => `${d.getUTCFullYear()}Q${Math.floor(d.getUTCMonth() / 3) + 1}`;

export async function openHistory(file = DEFAULT_DB) {
  const { DatabaseSync } = await import('node:sqlite'); // throws on Node without it; callers report that
  const db = new DatabaseSync(file);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL; PRAGMA cache_size=-32768;
    CREATE TABLE IF NOT EXISTS observations (
      division_id TEXT NOT NULL, period TEXT NOT NULL, category TEXT NOT NULL, metric TEXT NOT NULL,
      value REAL NOT NULL, unit TEXT, scope TEXT, year INTEGER, source TEXT, captured_at TEXT NOT NULL,
      PRIMARY KEY (division_id, period, category, metric)) WITHOUT ROWID;`);
  return db;
}

/** One transaction per category payload; any failure rolls the whole category back. Returns rows written. */
export function snapshotPayload(db, category, payload, now = new Date()) {
  const period = periodOf(now);
  const at = now.toISOString();
  const put = db.prepare(`INSERT OR REPLACE INTO observations
    (division_id, period, category, metric, value, unit, scope, year, source, captured_at) VALUES (?,?,?,?,?,?,?,?,?,?)`);
  let n = 0;
  db.exec('BEGIN');
  try {
    for (const [id, div] of Object.entries(payload?.divisions ?? {})) {
      for (const [metric, o] of Object.entries(div.metrics ?? {})) {
        if (typeof o?.value !== 'number' || !Number.isFinite(o.value)) continue;
        put.run(id, period, category, metric, o.value, o.unit ?? null, o.scope ?? null, Number.isInteger(o.year) ? o.year : null, o.source ?? null, at);
        n += 1;
      }
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  return n;
}

export function readHistory(db, divisionId, category) {
  return db.prepare(`SELECT period, metric, value, unit, scope, year, source FROM observations
    WHERE division_id = ? AND category = ? ORDER BY metric, period`).all(divisionId, category);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.env.UPSTASH_REDIS_REST_URL ||= `http://127.0.0.1:${process.env.PORT_LOCAL_REDIS || 8079}`;
  process.env.UPSTASH_REDIS_REST_TOKEN ||= process.env.LOCAL_REDIS_TOKEN || 'local-dev';
  let db;
  try { db = await openHistory(); } catch (err) { console.log(`node:sqlite unavailable (${err.message}); skipping history snapshot`); process.exit(0); }
  const [divisionId, category] = process.argv.slice(2);
  if (divisionId && category) {
    for (const r of readHistory(db, divisionId, category)) console.log(r.period, r.metric, r.value, r.unit ?? '', `[${r.scope} ${r.year ?? ''} ${r.source ?? ''}]`);
    process.exit(0);
  }
  try {
    const { readCanonicalValue } = await import('./_seed-utils.mjs');
    const { CATEGORIES } = await import('./subnational/_registry.mjs');
    let total = 0;
    for (const [slug, cat] of Object.entries(CATEGORIES)) {
      const p = await readCanonicalValue(cat.key);
      if (!p?.divisions) { console.log(`${slug}: not seeded yet`); continue; }
      const n = snapshotPayload(db, slug, p);
      total += n;
      console.log(`${slug}: ${n} observations`);
    }
    console.log(`history snapshot done: ${total} rows in ${DEFAULT_DB} (${periodOf(new Date())})`);
  } catch (err) {
    console.error(`FATAL: history snapshot failed: ${err.message}`);
    process.exit(1);
  }
}
