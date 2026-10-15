#!/usr/bin/env node
// Collect Israel samples (read-only GETs on data.gov.il CKAN datastore) into docs/samples/national/:
//  1. municipal-authorities full list (259 rows: authority code, name, district)
//  2. all 2024 audited-statement rows for ONE authority (Abu Ghosh, kod_lamas 2937) to see the sheet/row/column labels
//  3. distinct authority list of the 2024 table (via sql-free paging of one row-label filter)
import { writeFileSync } from 'node:fs';
import { curlFetch } from './subnational/_curl.mjs';
const H = { headers: { 'User-Agent': 'worldmonitor-faii-subnational/1.0' }, timeoutMs: 120_000 };
const B = 'https://data.gov.il/api/3/action/datastore_search';
const FIN = '6e153ddd-d4d4-4450-a78c-20f594a7986a';
const out = (n, o) => writeFileSync(`docs/samples/national/${n}`, JSON.stringify(o));
async function get(url) { const r = await curlFetch(url, H); if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }
try {
  const m = await get(`${B}?resource_id=c4916937-f5d3-4295-a22e-88a1af5cde6a&limit=1000`);
  out('il_municipal_authorities_full.json', m); console.log('[authorities]', m.result.records.length, 'rows');
} catch (e) { console.log('[authorities] FAILED', e.message); }
try {
  const f = encodeURIComponent(JSON.stringify({ 'קוד_למס': 2937 }));
  const a = await get(`${B}?resource_id=${FIN}&filters=${f}&limit=5000`);
  out('il_localauth_2024_abu_ghosh.json', a); console.log('[abu-ghosh rows]', a.result.records.length, 'of total', a.result.total);
} catch (e) { console.log('[abu-ghosh rows] FAILED', e.message); }
try {
  const f = encodeURIComponent(JSON.stringify({ 'שורה': 'יתרה לתחילת שנה', 'עמודה': 'שנה נוכחית' }));
  const a = await get(`${B}?resource_id=${FIN}&filters=${f}&limit=1000&fields=${encodeURIComponent('קוד_למס,שם_רשות,קוד_רשות,שנת_דוח,גליון')}`);
  out('il_localauth_2024_authority_list.json', a); console.log('[authority list]', a.result.records.length, 'rows, total', a.result.total);
} catch (e) { console.log('[authority list] FAILED', e.message); }
