#!/usr/bin/env node
// Read-only probe (plain GET through curl, like the providers): can these official/mirror pages be fetched by a script, and do they expose file links?
// Usage: node scripts/probe-source-urls.mjs      -> prints a table and writes docs/samples/national/probe/autofetch-probe.json
import { mkdirSync, writeFileSync } from 'node:fs';
import { curlFetch } from './subnational/_curl.mjs';

const TARGETS = [
  ['RBI state statistics page', 'https://rbi.org.in/Scripts/StateStatisticsFinances.aspx'],
  ['RBI website (new) state statistics', 'https://website.rbi.org.in/ar/web/rbi/statistics/state-statistics-and-finance'],
  ['RBI DBIE', 'https://data.rbi.org.in/DBIE/'],
  ['Open City CKAN: Crime in India 2022 (API)', 'https://data.opencity.in/api/3/action/package_show?id=crime-in-india-2022'],
  ['Open City direct: Crime in India 2022 Vol 1 PDF (HEAD-ish: first bytes)', 'https://data.opencity.in/dataset/fcb23738-6a70-42d4-9aa9-6a5e1aa5ce18/resource/2f0461a6-7f09-47f1-ae1e-43b68d888599/download/1701607577crimeinindia2022book1.pdf'],
];
const BOT = /TSPD|_Incapsula|Request Rejected|bobcmn|support ID|captcha|Access Denied/i;
const out = [];
for (const [name, url] of TARGETS) {
  const row = { name, url };
  try {
    const res = await curlFetch(url, { timeoutMs: 90_000 });
    const buf = Buffer.from(await res.arrayBuffer());
    const head = buf.subarray(0, 4096).toString('latin1');
    row.status = res.status; row.bytes = buf.length;
    row.kind = head.startsWith('%PDF') ? 'pdf' : head.startsWith('PK') ? 'zip/xlsx' : /<html|<!doctype/i.test(head) ? 'html' : /^\s*[{[]/.test(head) ? 'json' : 'other';
    row.botCheck = row.kind === 'html' && BOT.test(buf.toString('latin1'));
    if (row.kind === 'html') {
      const links = [...buf.toString('latin1').matchAll(/href="([^"]+\.(?:xlsx?|zip|csv))"/gi)].map((m) => m[1]);
      row.fileLinks = [...new Set(links)].slice(0, 25);
    }
    if (row.kind === 'json') { try { row.resources = (JSON.parse(buf.toString('utf8')).result?.resources ?? []).map((r) => `${r.name} -> ${r.url}`); } catch { /* not JSON */ } }
  } catch (err) { row.error = String(err.message).slice(0, 200); }
  out.push(row);
  console.log(`${row.status ?? 'ERR'}\t${row.kind ?? '-'}\t${row.bytes ?? '-'}\tbot:${row.botCheck ?? '-'}\t${name}${row.error ? ` (${row.error})` : ''}`);
  for (const l of row.fileLinks ?? []) console.log(`      link: ${l}`);
  for (const l of row.resources ?? []) console.log(`      resource: ${l}`);
}
mkdirSync('docs/samples/national/probe', { recursive: true });
writeFileSync('docs/samples/national/probe/autofetch-probe.json', JSON.stringify(out, null, 1));
console.log('saved docs/samples/national/probe/autofetch-probe.json');
