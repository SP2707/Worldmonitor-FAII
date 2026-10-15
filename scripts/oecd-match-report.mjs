#!/usr/bin/env node
// Offline: how many registry divisions would each OECD series match from the downloaded samples?
import { readFileSync } from 'node:fs';
import { parseCsv } from './subnational/_csv.mjs';
import { latestByArea, matchDivisions, ISO3_TO_ISO2 } from './subnational/providers/oecd.mjs';
import { SERIES, seriesFilter } from './subnational/providers/oecd-series.mjs';

const only = process.argv[2];
const cache = new Map();
for (const s of SERIES) {
  if (only && !s.id.includes(only)) continue;
  const file = `docs/samples/oecd/${s.sampleFile}`;
  if (!cache.has(file)) cache.set(file, parseCsv(readFileSync(file, 'utf8')));
  const rows = cache.get(file);
  for (const level of (s.levels ?? [{ level: 'TL2' }, { level: 'TL3' }]).map((l) => (typeof l === 'string' ? l : l.level))) {
    const byArea = latestByArea(rows, { filter: { ...(level ? { TERRITORIAL_LEVEL: level } : {}), ...seriesFilter(s) } });
    const { matched, unmatched } = matchDivisions(byArea, { additive: s.additive !== false, countries: s.countries });
    const per = {};
    for (const m of matched) per[m.div.country] = (per[m.div.country] ?? 0) + 1;
    console.log(`${s.id} ${level}: areas=${byArea.size} matched=${matched.length}`, JSON.stringify(per));
    if (process.env.UNMATCHED) console.log('  unmatched:', unmatched.slice(0, 80).join(' | '));
  }
}
