// Statistics Canada Web Data Service (open, no key): table 36-10-0222-01, GDP expenditure-based, provincial and
// territorial, annual, millions of Canadian dollars. GET getFullTableDownloadCSV/<productId>/en returns JSON whose
// `object` is the URL of a zip holding the full-table CSV (columns checked on a real download 2026-10-14):
//   REF_DATE, GEO, DGUID, Prices, Estimates, UOM, UOM_ID, SCALAR_FACTOR, ..., VALUE, STATUS, SYMBOL, ...
// We keep Prices='Current prices' and Estimates='Gross domestic product at market prices'.
// Statistics Canada's table page marks the newest reference year as preliminary.
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseCsv } from '../_csv.mjs';
import { unzip } from '../_zip.mjs';
import { curlFetch } from '../_curl.mjs';
import { matchDivisions } from './oecd.mjs';

export const STATCAN_META_URL = 'https://www150.statcan.gc.ca/t1/wds/rest/getFullTableDownloadCSV/36100222/en';
export const TABLE_PAGE = 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3610022201';
const EXCLUDE = new Set(['Canada', 'Outside Canada', 'Northwest Territories including Nunavut']);

/** Keep only the header and the GDP-at-market-prices current-price rows (the full file is ~30 MB). */
export function filterGdpLines(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/);
  const out = [lines[0]];
  for (let i = 1; i < lines.length; i++) {
    const l = lines[i];
    if (l.includes('"Current prices"') && l.includes('"Gross domestic product at market prices"')) out.push(l);
  }
  return out.join('\n');
}

/** @returns {Map<string,{value:number,year:number,name:string,country:string,preliminary:boolean}>} newest numeric year per province */
export function latestGdpByGeo(csvText) {
  const rows = parseCsv(filterGdpLines(csvText));
  const best = new Map();
  let maxYear = 0;
  for (const r of rows) {
    if (r.Prices !== 'Current prices' || r.Estimates !== 'Gross domestic product at market prices') continue;
    if (EXCLUDE.has(r.GEO) || r.VALUE === '' || r.VALUE == null) continue;
    const v = Number(r.VALUE);
    const year = Number(r.REF_DATE);
    if (!Number.isFinite(v) || !Number.isFinite(year)) continue;
    maxYear = Math.max(maxYear, year);
    const cur = best.get(r.GEO);
    if (!cur || year > cur.year) best.set(r.GEO, { value: v, year, name: r.GEO, country: 'CAN' });
  }
  for (const e of best.values()) e.preliminary = e.year === maxYear;
  return best;
}

function cacheFile(dir, key) { return join(dir, `${createHash('sha1').update(key).digest('hex')}.bin`); }

/** Download (or read from the 12 h disk cache) the full-table CSV of a StatCan product id. */
export async function loadStatCanCsv(productId, ctx) {
  const fetchFn = ctx.fetchFn ?? curlFetch;
  const nowMs = ctx.nowMs ?? Date.now();
  const dir = ctx.cacheDir === undefined ? (ctx.env?.STATCAN_CACHE_DIR || (process.env.NODE_TEST_CONTEXT ? null : join(process.cwd(), '.cache', 'statcan'))) : ctx.cacheDir;
  const metaUrl = `https://www150.statcan.gc.ca/t1/wds/rest/getFullTableDownloadCSV/${productId}/en`;
  const maxAge = 12 * 3600_000;
  if (dir) { try { const f = cacheFile(dir, metaUrl); if (nowMs - statSync(f).mtimeMs < maxAge) return readFileSync(f, 'utf8'); } catch { /* miss */ } }
  const meta = await fetchFn(metaUrl, { headers: { 'User-Agent': 'worldmonitor-faii-subnational/1.0' }, timeoutMs: 60_000 });
  if (!meta.ok) throw new Error(`StatCan metadata HTTP ${meta.status}`);
  const j = await meta.json();
  if (j.status !== 'SUCCESS' || typeof j.object !== 'string') throw new Error(`StatCan metadata unexpected: ${JSON.stringify(j).slice(0, 120)}`);
  const z = await fetchFn(j.object, { headers: { 'User-Agent': 'worldmonitor-faii-subnational/1.0' }, timeoutMs: 180_000 });
  if (!z.ok) throw new Error(`StatCan zip HTTP ${z.status}`);
  const files = unzip(Buffer.from(await z.arrayBuffer()));
  const name = [...files.keys()].find((n) => /^\d+\.csv$/i.test(n));
  if (!name) throw new Error(`StatCan zip has no data csv (${[...files.keys()].join(', ')})`);
  const csv = files.get(name).toString('utf8');
  if (dir) { try { mkdirSync(dir, { recursive: true }); writeFileSync(cacheFile(dir, metaUrl), csv); } catch { /* best effort */ } }
  return csv;
}

export function createStatCanGdpProvider({ id = 'statcan:36-10-0222-01' } = {}) {
  return {
    id,
    async run(ctx) {
      const csv = await loadStatCanCsv('36100222', ctx);
      const byGeo = latestGdpByGeo(csv);
      const { matched } = matchDivisions(byGeo, { additive: false, countries: ['CA'] });
      const observations = matched.map((m) => ({
        divisionId: m.div.id, metric: 'grp_lcu', value: m.value, unit: 'CAD million (current prices)', year: m.year,
        source: id, sourceUrl: TABLE_PAGE, scope: 'division', method: 'direct',
        ...(byGeo.get(m.regions[0])?.preliminary ? { note: 'Statistics Canada marks the newest reference year of this table as preliminary' } : {}),
      }));
      if (!observations.length) throw new Error('StatCan: no province matched the registry');
      return { observations };
    },
  };
}
