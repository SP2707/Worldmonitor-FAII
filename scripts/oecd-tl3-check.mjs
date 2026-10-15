#!/usr/bin/env node
// Live check: do OECD TL3 regions of Japan and Korea match our prefectures/provinces?
// Usage: node scripts/oecd-tl3-check.mjs     (one request, saved to docs/samples/oecd/TL3_LIFE_EXP.csv)
import { writeFileSync } from 'node:fs';
import { curlFetch } from './subnational/_curl.mjs';
import { parseCsv } from './subnational/_csv.mjs';
import { latestByArea, matchDivisions } from './subnational/providers/oecd.mjs';

const url = 'https://sdmx.oecd.org/public/rest/data/OECD.CFE.EDS,DSD_REG_DEMO@DF_LIFE_EXP,/A.TL3...LFEXP.Y0._T.Y?startPeriod=2018&dimensionAtObservation=AllDimensions&format=csvfilewithlabels';
const resp = await curlFetch(url, { headers: { Accept: 'text/csv' }, timeoutMs: 180_000 });
console.log('HTTP', resp.status);
if (!resp.ok) process.exit(1);
const text = await resp.text();
writeFileSync('docs/samples/oecd/TL3_LIFE_EXP.csv', text);
const rows = parseCsv(text);
const by = latestByArea(rows, { filter: { TERRITORIAL_LEVEL: 'TL3' } });
const { matched, unmatched } = matchDivisions(by, { additive: false, countries: ['JP', 'KR', 'GB', 'IN', 'CN', 'CA', 'IL'] });
const per = {};
for (const m of matched) per[m.div.country] = (per[m.div.country] ?? 0) + 1;
console.log('TL3 areas', by.size, 'matched', matched.length, JSON.stringify(per));
console.log('unmatched JP/KR:', unmatched.filter((u) => /^(JPN|KOR)/.test(u)).join(' | '));
