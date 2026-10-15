#!/usr/bin/env node
// Prints, for each of the 10 subnational keys, how many of the 391 divisions have real
// division-level data / national-only context / nothing, plus provider health.
// Reads the local Redis stand-in that `npm start` launches (defaults to 127.0.0.1:8079, token local-dev
// unless UPSTASH_REDIS_REST_URL / _TOKEN are already set).
//   node scripts/subnational-status.mjs            # summary
//   node scripts/subnational-status.mjs US-CA      # also dump one division across all categories
process.env.UPSTASH_REDIS_REST_URL ||= `http://127.0.0.1:${process.env.PORT_LOCAL_REDIS || 8079}`;
process.env.UPSTASH_REDIS_REST_TOKEN ||= process.env.LOCAL_REDIS_TOKEN || 'local-dev';

const { readCanonicalValue } = await import('./_seed-utils.mjs');
const { CATEGORIES } = await import('./subnational/_registry.mjs');
const divisionId = process.argv[2];

console.log('category'.padEnd(16), 'ok'.padStart(5), 'nat-only'.padStart(9), 'none'.padStart(6), '  generatedAt / providers');
for (const [slug, cat] of Object.entries(CATEGORIES)) {
  let p = null;
  try { p = await readCanonicalValue(cat.key); } catch (e) { console.log(slug.padEnd(16), `redis error: ${e.message}`); continue; }
  if (!p?.coverage) { console.log(slug.padEnd(16), '  (not seeded yet)'); continue; }
  const t = p.coverage.total;
  const prov = (p.providers || []).map((r) => `${r.id}:${r.ok ? r.observations : 'FAIL'}`).join(' ');
  for (const r of p.providers || []) if (!r.ok) console.log('    FAILED', r.id, '->', r.error);
  console.log(slug.padEnd(16), String(t.ok).padStart(5), String(t.national_only).padStart(9), String(t.no_source).padStart(6), ' ', p.generatedAt, prov);
  if (divisionId) {
    const d = p.divisions?.[divisionId];
    if (d) for (const [m, o] of Object.entries(d.metrics)) console.log('    ', divisionId, m, o.value, o.unit ?? '', `[${o.scope}${o.year ? ' ' + o.year : ''} ${o.source}]`);
  }
}
