#!/usr/bin/env node
// For each category and provider: newest / oldest observation year and how many divisions it covers.
// Shows which sources are stale. Uses only what is stored in Redis; nothing is estimated.
//   node scripts/subnational-freshness.mjs [category...]
process.env.UPSTASH_REDIS_REST_URL ||= `http://127.0.0.1:${process.env.PORT_LOCAL_REDIS || 8079}`;
process.env.UPSTASH_REDIS_REST_TOKEN ||= process.env.LOCAL_REDIS_TOKEN || 'local-dev';
const { readCanonicalValue } = await import('./_seed-utils.mjs');
const { CATEGORIES } = await import('./subnational/_registry.mjs');
const want = process.argv.slice(2);
const nowYear = new Date().getUTCFullYear();
for (const [slug, cat] of Object.entries(CATEGORIES)) {
  if (want.length && !want.includes(slug)) continue;
  let p = null;
  try { p = await readCanonicalValue(cat.key); } catch { /* skip */ }
  if (!p?.divisions) { console.log(`${slug}: (not seeded)`); continue; }
  const bySource = new Map();
  for (const [id, rec] of Object.entries(p.divisions)) {
    for (const [metric, m] of Object.entries(rec.metrics ?? {})) {
      if (m.scope !== 'division' || !m.source) continue;
      const key = `${m.source} | ${metric}`;
      const e = bySource.get(key) ?? { n: 0, min: Infinity, max: -Infinity, ids: new Set() };
      e.n++; e.ids.add(id);
      if (Number.isFinite(m.year)) { e.min = Math.min(e.min, m.year); e.max = Math.max(e.max, m.year); }
      bySource.set(key, e);
    }
  }
  console.log(`\n== ${slug} (generated ${p.generatedAt})`);
  for (const [k, e] of [...bySource].sort((a, b) => a[0].localeCompare(b[0]))) {
    const yrs = Number.isFinite(e.max) ? (e.min === e.max ? `${e.max}` : `${e.min}-${e.max}`) : 'no year';
    const age = Number.isFinite(e.max) ? nowYear - e.max : null;
    console.log(`  ${k.padEnd(78)} ${String(e.ids.size).padStart(4)} div  year ${yrs.padEnd(10)}${age != null && age >= 3 ? `  STALE (${age} y old)` : ''}`);
  }
}
