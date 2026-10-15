#!/usr/bin/env node
// Read-only probe (plain GETs, no keys, no cookies, no evasion): which international-organisation data endpoints answer a script
// with real data? Saves the first 6 KB of each answer under docs/samples/national/probe/global/ so the layout can be read.
// Candidates marked "unverified" are endpoints I have not seen documented; a 404 there is an answer, not a failure.
import { mkdirSync, writeFileSync } from 'node:fs';
import { curlFetch } from './subnational/_curl.mjs';

const T = [
  ['undp-hdr-csv', 'verified URL', 'https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Composite_indices_complete_time_series.csv'],
  ['undp-dataprism-docs', 'verified URL', 'https://prism.hdrdata.org/docs'],
  ['imf-dm-v2-indicators', 'verified base', 'https://www.imf.org/external/datamapper/api/v2/indicators'],
  ['imf-dm-v2-gdp-growth', 'verified pattern', 'https://www.imf.org/external/datamapper/api/v2/NGDP_RPCH/USA/CHN?periods=2022,2023,2024,2025'],
  ['imf-dm-v1-gdp-growth', 'unverified (older version)', 'https://www.imf.org/external/datamapper/api/v1/NGDP_RPCH/USA'],
  ['imf-sdmx-new', 'unverified', 'https://api.imf.org/external/sdmx/2.1/dataflow'],
  ['unctad-bulk-page', 'unverified', 'https://unctadstat.unctad.org/EN/BulkDownload.html'],
  ['unctad-datahub', 'unverified', 'https://unctadstat.unctad.org/datacentre/'],
  ['un-wpp-api', 'unverified', 'https://population.un.org/dataportalapi/api/v1/indicators/?pageSize=5'],
  ['un-sdg-api', 'verified base, test API', 'https://unstats.un.org/SDGAPI/v1/sdg/Goal/List'],
  ['un-mbs-ws', 'verified URL', 'https://unstats.un.org/unsd/mbs/api/wsMbsServices.asmx'],
  ['eurostat-gdp-malta', 'verified API, dataset code from memory', 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nama_10_gdp?geo=MT&na_item=B1GQ&unit=CP_MEUR&time=2023'],
  ['iea-weh-highlights', 'verified page (login wall expected)', 'https://www.iea.org/data-and-statistics/data-product/world-energy-balances-highlights'],
  ['wipo-ipstats', 'verified page (UI only expected)', 'https://www.wipo.int/en/web/ip-statistics'],
];
const BOT = /TSPD|_Incapsula|Request Rejected|support ID|captcha|Access Denied|cf-browser-verification|Just a moment/i;
const out = [];
mkdirSync('docs/samples/national/probe/global', { recursive: true });
for (const [id, note, url] of T) {
  const row = { id, note, url };
  try {
    let res;
    try { res = await curlFetch(url, { timeoutMs: 60_000 }); }
    catch (e) { row.curlError = String(e.message).slice(0, 100); res = await fetch(url, { signal: AbortSignal.timeout(60_000) }); row.transport = 'node-fetch'; }
    const buf = Buffer.from(await res.arrayBuffer());
    const head = buf.subarray(0, 4096).toString('latin1');
    row.status = res.status; row.bytes = buf.length;
    row.kind = head.startsWith('%PDF') ? 'pdf' : head.startsWith('PK') ? 'zip/xlsx' : /^\s*[{[]/.test(head) ? 'json' : /<\?xml|<soap|<wsdl|<definitions/i.test(head) ? 'xml' : /<html|<!doctype/i.test(head) ? 'html' : 'text/csv?';
    row.botCheck = row.kind === 'html' && BOT.test(buf.toString('latin1'));
    writeFileSync(`docs/samples/national/probe/global/${id}.head`, buf.subarray(0, 6144));
  } catch (err) { row.error = String(err.message).slice(0, 160); }
  out.push(row);
  console.log(`${String(row.status ?? 'ERR').padEnd(4)} ${String(row.kind ?? '-').padEnd(9)} ${String(row.bytes ?? '-').padStart(9)}  bot:${String(row.botCheck ?? '-').padEnd(5)} ${id}${row.error ? ` (${row.error})` : ''}${row.curlError ? ` [curl: ${row.curlError}]` : ''}`);
}
writeFileSync('docs/samples/national/probe/global/global-probe.json', JSON.stringify(out, null, 1));
console.log('saved docs/samples/national/probe/global/global-probe.json');
