#!/usr/bin/env node
// Read-only reachability probe for CANDIDATE national/regional statistics pages (all UNVERIFIED leads).
// Saves each response body (max 2 MB) under docs/samples/national/probe/ so it can be read offline. GET only, no forms, no login.
//   node scripts/probe-national-candidates.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { curlFetch } from './subnational/_curl.mjs';

const CANDIDATES = [
  ['il-datagov-localities-he', 'https://data.gov.il/api/3/action/package_search?q=%D7%99%D7%99%D7%A9%D7%95%D7%91%D7%99%D7%9D%20%D7%9E%D7%97%D7%95%D7%96&rows=20', 'Israel CKAN: localities with district (mehoz) lookup, Hebrew query'],
  ['il-datagov-localities-en', 'https://data.gov.il/api/3/action/package_search?q=localities%20district&rows=20', 'Israel CKAN: localities with district lookup, English query'],
  ['il-datagov-muni-list', 'https://data.gov.il/api/3/action/package_search?q=%D7%A8%D7%A9%D7%95%D7%99%D7%95%D7%AA%20%D7%9E%D7%A7%D7%95%D7%9E%D7%99%D7%95%D7%AA%20%D7%9E%D7%97%D7%95%D7%96&rows=20', 'Israel CKAN: local authorities with district'],
  ['ae-bayanat', 'https://bayanat.ae/', 'UAE open data portal (Bayanat) front page; unverified whether it has emirate-level fiscal/GDP data'],
  ['cn-nbs-yearbook-2024', 'https://www.stats.gov.cn/sj/ndsj/2024/indexeh.htm', 'China NBS yearbook 2024 English index: look for local fiscal revenue/expenditure and FDI by region tables'],
  ['cn-nbs-yearbook-2025', 'https://www.stats.gov.cn/sj/ndsj/2025/indexeh.htm', 'same, 2025 edition if published'],
  ['ua-openbudget', 'https://openbudget.gov.ua/local-budget', 'Ukraine Ministry of Finance local budgets portal (format/API unknown)'],
  ['il-datagov-localauth', 'https://data.gov.il/api/3/action/package_search?q=local%20authorities%20budget&rows=20', 'Israel open-data CKAN search for local-authority budgets'],
  ['il-datagov-regional-gdp', 'https://data.gov.il/api/3/action/package_search?q=GDP%20district&rows=20', 'Israel open-data CKAN search for district GDP'],
  ['in-dpiit-factsheet', 'https://dpiit.gov.in/publications/fdi-statistics', 'India DPIIT FDI statistics page (state-wise FDI)'],
  ['ae-dubai-stats', 'https://www.dsc.gov.ae/en-us/Pages/default.aspx', 'Dubai Statistics Center (emirate-level GDP)'],
  ['ae-abudhabi-scad', 'https://www.scad.gov.ae/en/pages/GeneralPublications.aspx', 'Statistics Centre Abu Dhabi publications (emirate-level GDP)'],
  ['sa-gastat-gdp', 'https://www.stats.gov.sa/en/w/gdp-by-region', 'Saudi GASTAT regional GDP page (URL guessed)'],
  ['ru-rosstat-regions', 'https://rosstat.gov.ru/folder/210/document/13204', 'Rosstat regions of Russia statistical book page (URL guessed)'],
];
const dir = join('docs', 'samples', 'national', 'probe');
mkdirSync(dir, { recursive: true });
for (const [id, url, why] of CANDIDATES) {
  try {
    const r = await curlFetch(url, { headers: { 'User-Agent': 'worldmonitor-faii-subnational/1.0' }, timeoutMs: 30_000 });
    const buf = Buffer.from(await r.arrayBuffer()).subarray(0, 2_000_000);
    writeFileSync(join(dir, `${id}.html`), buf);
    const head = buf.toString('utf8', 0, 200).replace(/\s+/g, ' ');
    const botWall = /TSPD|_Incapsula_|captcha|Access Denied|Just a moment/i.test(buf.toString('utf8', 0, 4000));
    console.log(`[${id}] HTTP ${r.status}, ${buf.length} bytes${botWall ? ', LOOKS LIKE BOT WALL' : ''} | ${why}\n    ${head.slice(0, 120)}`);
  } catch (e) { console.log(`[${id}] FAILED ${String(e.message ?? e).slice(0, 100)} | ${why}`); }
}
