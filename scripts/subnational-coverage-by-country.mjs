#!/usr/bin/env node
// Per category x country: divisions with division-level data / total, read from the local Redis stand-in.
//   node scripts/subnational-coverage-by-country.mjs            # table
//   node scripts/subnational-coverage-by-country.mjs grp fiscal # only these categories
process.env.UPSTASH_REDIS_REST_URL ||= `http://127.0.0.1:${process.env.PORT_LOCAL_REDIS || 8079}`;
process.env.UPSTASH_REDIS_REST_TOKEN ||= process.env.LOCAL_REDIS_TOKEN || 'local-dev';
const { readCanonicalValue } = await import('./_seed-utils.mjs');
const { CATEGORIES, DIVISIONS } = await import('./subnational/_registry.mjs');
const want = process.argv.slice(2);
const listMissing = !!process.env.MISSING; // MISSING=CC lists division ids without data for those countries, e.g. MISSING=FR,IT,US
const countries = [...new Set(DIVISIONS.map((d) => d.country))].sort();
const total = Object.fromEntries(countries.map((c) => [c, DIVISIONS.filter((d) => d.country === c).length]));
console.log('category'.padEnd(14), countries.map((c) => c.padStart(6)).join(''), '   all');
for (const [slug, cat] of Object.entries(CATEGORIES)) {
  if (want.length && !want.includes(slug)) continue;
  let p = null;
  try { p = await readCanonicalValue(cat.key); } catch { /* shown below */ }
  if (!p?.divisions) { console.log(slug.padEnd(14), '(not seeded)'); continue; }
  const got = Object.fromEntries(countries.map((c) => [c, 0]));
  for (const d of DIVISIONS) {
    const rec = p.divisions[d.id];
    if (rec && Object.values(rec.metrics ?? {}).some((m) => m.scope === 'division' && m.source && !String(m.source).startsWith('derived:'))) got[d.country]++;
    else if (listMissing && process.env.MISSING.split(',').includes(d.country)) console.log(`  missing ${slug}: ${d.id} (${d.name ?? ''})`);
  }
  const all = Object.values(got).reduce((a, b) => a + b, 0);
  console.log(slug.padEnd(14), countries.map((c) => `${got[c]}/${total[c]}`.padStart(6)).join(''), `${all}/${DIVISIONS.length}`.padStart(8));
}
console.log('(counts divisions with at least one measured, non-derived, division-scope metric)');
