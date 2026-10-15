#!/usr/bin/env node
// Main table: one row per country (name, divisions), one column per category = number of divisions that have at least one
// measured (non-derived), division-scope metric in that category. Reads the local Redis stand-in.
//   node scripts/subnational-main-table.mjs          # markdown table
//   node scripts/subnational-main-table.mjs --csv    # CSV
process.env.UPSTASH_REDIS_REST_URL ||= `http://127.0.0.1:${process.env.PORT_LOCAL_REDIS || 8079}`;
process.env.UPSTASH_REDIS_REST_TOKEN ||= process.env.LOCAL_REDIS_TOKEN || 'local-dev';
const { readCanonicalValue } = await import('./_seed-utils.mjs');
const { CATEGORIES, DIVISIONS } = await import('./subnational/_registry.mjs');
const NAMES = { AE: 'United Arab Emirates', CA: 'Canada', CN: 'China', DE: 'Germany', FR: 'France', GB: 'United Kingdom', IL: 'Israel', IN: 'India', IT: 'Italy', JP: 'Japan', KR: 'South Korea', RU: 'Russia', SA: 'Saudi Arabia', UA: 'Ukraine', US: 'United States' };
const csv = process.argv.includes('--csv');
const countries = [...new Set(DIVISIONS.map((d) => d.country))].sort((a, b) => (NAMES[a] ?? a).localeCompare(NAMES[b] ?? b));
const slugs = Object.keys(CATEGORIES);
const has = {}; // slug -> Set(divisionId) | null when unseeded
for (const slug of slugs) {
  let p = null;
  try { p = await readCanonicalValue(CATEGORIES[slug].key); } catch { /* unseeded */ }
  if (!p?.divisions) { has[slug] = null; continue; }
  has[slug] = new Set(DIVISIONS.filter((d) => Object.values(p.divisions[d.id]?.metrics ?? {}).some((m) => m.scope === 'division' && m.source && !String(m.source).startsWith('derived:'))).map((d) => d.id));
}
const head = ['Country', 'Divisions', ...slugs];
const rows = countries.map((c) => {
  const divs = DIVISIONS.filter((d) => d.country === c);
  return [NAMES[c] ?? c, String(divs.length), ...slugs.map((s) => (has[s] ? String(divs.filter((d) => has[s].has(d.id)).length) : 'n/a'))];
});
rows.push(['TOTAL', String(DIVISIONS.length), ...slugs.map((s) => (has[s] ? String(has[s].size) : 'n/a'))]);
if (csv) console.log([head, ...rows].map((r) => r.join(',')).join('\n'));
else { const line = (r) => `| ${r.join(' | ')} |`; console.log([line(head), line(head.map(() => '---')), ...rows.map(line)].join('\n')); }
console.error('(count = divisions with at least one measured, non-derived, division-scope metric in that category)');
