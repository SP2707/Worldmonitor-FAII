#!/usr/bin/env node
// Print the stored metrics of divisions. Usage: node scripts/subnational-show.mjs <category> <divisionId>[,<id>...] [metricSubstring]
//   node scripts/subnational-show.mjs fiscal IL-D,IL-HA,IL-JM,IL-M,IL-TA,IL-Z local_authorities
process.env.UPSTASH_REDIS_REST_URL ||= `http://127.0.0.1:${process.env.PORT_LOCAL_REDIS || 8079}`;
process.env.UPSTASH_REDIS_REST_TOKEN ||= process.env.LOCAL_REDIS_TOKEN || 'local-dev';
const { readCanonicalValue } = await import('./_seed-utils.mjs');
const { CATEGORIES } = await import('./subnational/_registry.mjs');
const [cat, ids = '', filter = ''] = process.argv.slice(2);
const p = await readCanonicalValue(CATEGORIES[cat].key);
for (const id of ids.split(',').filter(Boolean)) {
  for (const [m, v] of Object.entries(p.divisions?.[id]?.metrics ?? {})) {
    if (filter && !m.includes(filter)) continue;
    console.log(`${id} | ${m} = ${v.value} ${v.unit ?? ''} (${v.year}) [${v.source}]\n    ${v.note ?? ''}`);
  }
}
