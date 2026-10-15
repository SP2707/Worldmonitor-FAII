// HM Treasury "Country and Regional Analysis 2025" (published 2025-11-19, Accredited Official Statistics).
// Chapter A tables, workbook CRA_2025_Chapter_A_tables.xlsx (checked on a real download 2026-10-14):
//   A.1a  Total identifiable expenditure on services, GBP million, one column per year 2020-21 .. 2024-25 (outturn)
//   A.1b  the same, GBP per head
// Rows: nine English regions, 'Total England', Scotland, Wales, Northern Ireland. This is PUBLIC SPENDING ALLOCATED TO the
// nation (central + local government), not the accounts of a regional government: it is a different measure from OECD REGOFI.
// The URL is pinned to the 2025 release (the file name carries a release hash); update it when CRA 2026 appears.
import { curlFetch } from '../_curl.mjs';
import { readSheet } from '../_xlsx.mjs';

export const CRA_URL = 'https://assets.publishing.service.gov.uk/media/691b0990d140bbbaa59a28ad/CRA_2025_Chapter_A_tables.xlsx';
export const CRA_PAGE = 'https://www.gov.uk/government/statistics/country-and-regional-analysis-2025';
export const ROWS = Object.freeze({
  'Total England': 'GB-ENG', England: 'GB-ENG', Scotland: 'GB-SCT', Wales: 'GB-WLS', 'Northern Ireland': 'GB-NIR',
});

/** Parse one A.1a / A.1b sheet: newest financial-year column (first block) per division. */
export function parseCraSheet(rows) {
  const header = rows.find((r) => r.filter((c) => typeof c === 'string' && /^\d{4}-\d{2}\b/.test(c)).length >= 2);
  if (!header) throw new Error('CRA sheet: year header row not found');
  // newest column of the FIRST block of year headers (the right-hand block repeats the same labels for per cent / index)
  const years = [];
  const seen = new Set();
  for (let i = 0; i < header.length; i++) {
    const c = header[i];
    if (typeof c === 'string' && /^\d{4}-\d{2}\b/.test(c)) {
      const key = c.replace(/\s+/g, ' ').trim();
      if (seen.has(key)) break;
      seen.add(key);
      years.push(i);
    } else if (years.length) break;
  }
  const col = years[years.length - 1];
  const label = String(header[col]).replace(/\s+/g, ' ').trim();
  const fy = /^(\d{4})-(\d{2})/.exec(label);
  const out = new Map();
  for (const r of rows) {
    const id = typeof r[0] === 'string' ? ROWS[r[0].trim()] : null;
    const v = r[col];
    if (id && typeof v === 'number' && !out.has(id)) out.set(id, v);
  }
  return { values: out, financialYear: `${fy[1]}-${fy[2]}`, year: Number(fy[1]) + 1, label };
}

export function createUkCraProvider({ id = 'hmt:cra-2025' } = {}) {
  return {
    id,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? curlFetch;
      const r = await fetchFn(CRA_URL, { headers: { 'User-Agent': 'worldmonitor-faii-subnational/1.0' }, timeoutMs: 120_000 });
      if (!r.ok) throw new Error(`HM Treasury CRA HTTP ${r.status}`);
      const buf = Buffer.from(await r.arrayBuffer());
      const observations = [];
      for (const [sheet, metric, unit] of [
        ['A.1a', 'public_expenditure_identifiable_gbp_million', 'GBP million (total identifiable public expenditure on services allocated to the nation)'],
        ['A.1b', 'public_expenditure_identifiable_per_head_gbp', 'GBP per head (total identifiable public expenditure on services)'],
      ]) {
        const parsed = parseCraSheet(readSheet(buf, sheet));
        for (const [divisionId, value] of parsed.values) {
          observations.push({
            divisionId, metric, value, unit, year: parsed.year, source: id, sourceUrl: CRA_PAGE, scope: 'division', method: 'direct',
            note: `financial year ${parsed.financialYear} outturn; public spending allocated to the nation (central + local), not a regional-government account; England is the nine-region total`,
          });
        }
      }
      if (!observations.length) throw new Error('HM Treasury CRA: no nation row recognised');
      return { observations };
    },
  };
}
