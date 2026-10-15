// Reserve Bank of India "e-STATES" database (Handbook-of-Statistics-style state finances), workbook downloaded by hand from
// the RBI site because RBI's web server serves a bot-check page to scripts. Checked on a real download 2026-10-15
// (ESTATES23012026….XLSX): sheet 'Data' with columns Appendix, State/UT, Budget Head, Fiscal Year ('2023-2024'),
// Account (actuals), Revised, Budget. Amounts are INR crore (RBI e-STATES convention - verify against the RBI note on first use).
// Only the ACTUALS column ('Account') is used; Revised/Budget Estimates are never read. 'All States/UT' is excluded.
// Scope: the state government's own accounts (not local bodies).
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { iterSheetRows } from '../_xlsx.mjs';
import { ensureSourceFile, scrapeLinkUrl } from '../_autofetch.mjs';

// Public publication page (plain HTML, answered 200 to a script on 2026-10-15) that lists the e-STATES workbook under rbidocs.rbi.org.in.
export const RBI_PUBLICATION_PAGE = 'https://rbi.org.in/Scripts/AnnualPublications.aspx?head=State%20Finances%20:%20A%20Study%20of%20Budgets';
export const ESTATES_LINK = /rbidocs\.rbi\.org\.in\/rdocs\/Publications\/DOCs\/ESTATES[0-9A-Za-z]+\.XLSX$/i;
// The 2026-01-23 release link as listed on that page; last-resort URL if the page layout changes.
export const ESTATES_PINNED = 'https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/ESTATES23012026AB138FB463474EBFBCC03A8FC878C45A.XLSX';
export const RBI_PAGE = 'https://data.rbi.org.in/DBIE/#/dbie/estates';
export const HEADS = Object.freeze({
  'Total: TOTAL REVENUE (I+II)': ['subnational_govt_revenue_inr_crore', 'INR crore (state government revenue receipts, actuals)'],
  'Total: TOTAL EXPENDITURE (I+II+III)': ['subnational_govt_expenditure_inr_crore', 'INR crore (state government total expenditure, actuals)'],
  'I: TAX REVENUE (A+B)': ['subnational_govt_tax_revenue_inr_crore', 'INR crore (state government tax revenue incl. share in central taxes, actuals)'],
});
export const STATE_IDS = Object.freeze({
  'Andhra Pradesh': 'IN-AP', 'Arunachal Pradesh': 'IN-AR', Assam: 'IN-AS', Bihar: 'IN-BR', Chhattisgarh: 'IN-CG', Goa: 'IN-GA',
  Gujarat: 'IN-GJ', Haryana: 'IN-HR', 'Himachal Pradesh': 'IN-HP', 'Jammu and Kashmir': 'IN-JK', Jharkhand: 'IN-JH',
  Karnataka: 'IN-KA', Kerala: 'IN-KL', 'Madhya Pradesh': 'IN-MP', Maharashtra: 'IN-MH', Manipur: 'IN-MN', Meghalaya: 'IN-ML',
  Mizoram: 'IN-MZ', 'NCT Delhi': 'IN-DL', Nagaland: 'IN-NL', Odisha: 'IN-OD', Puducherry: 'IN-PY', Punjab: 'IN-PB',
  Rajasthan: 'IN-RJ', Sikkim: 'IN-SK', 'Tamil Nadu': 'IN-TN', Telangana: 'IN-TS', Tripura: 'IN-TR', 'Uttar Pradesh': 'IN-UP',
  Uttarakhand: 'IN-UK', 'West Bengal': 'IN-WB',
});

/** @param {Iterable<[number, any[]]>} rows @returns {Map<string, {value:number, year:number}>} key `${divisionId}|${head}` -> newest ACTUAL */
export function latestActuals(rows) {
  const out = new Map();
  let cols = null;
  for (const [, r] of rows) {
    if (!cols) {
      if (r[1] === 'State/UT' && r[2] === 'Budget Head' && r[3] === 'Fiscal Year' && r[4] === 'Account') cols = true;
      continue;
    }
    const id = STATE_IDS[r[1]];
    const head = r[2];
    if (!id || !(head in HEADS) || typeof r[4] !== 'number') continue;
    const m = /^(\d{4})-(\d{4})$/.exec(String(r[3]));
    if (!m) continue;
    const year = Number(m[2]); // fiscal year ends in this calendar year (2023-2024 -> 2024)
    const key = `${id}|${head}`;
    const cur = out.get(key);
    if (!cur || year > cur.year) out.set(key, { value: r[4], year });
  }
  if (!cols) throw new Error("RBI e-STATES: header row (State/UT, Budget Head, Fiscal Year, Account) not found");
  return out;
}

/** Hand-dropped copies (the RBI site serves a bot-check page to scripts, so a browser download is the fallback). */
function dropped(cwd = process.cwd()) {
  const dir = resolve(cwd, 'docs/samples/national');
  return existsSync(dir) ? readdirSync(dir).filter((n) => /^estates.*\.xlsx$/i.test(n)).map((n) => join(dir, n)) : [];
}

// Download order: RBI_ESTATES_URL override (comma-separated) -> the link found on RBI's publication page (so a new January
// release is picked up by itself) -> the pinned 2026-01-23 link. If all fail, the cached copy, then a hand-dropped
// ESTATES*.XLSX in docs/samples/national. A bot-check page is never accepted as the workbook (magic-byte check).
export function createRbiEstatesProvider({ id = 'rbi:e-states', path = null, ensureFn = ensureSourceFile, cacheDir } = {}) {
  return {
    id,
    async run() {
      let file = path ?? process.env.RBI_ESTATES_XLSX ?? null;
      let how = 'explicit path';
      if (!file) {
        const urls = [
          ...(process.env.RBI_ESTATES_URL ?? '').split(',').map((u) => u.trim()).filter(Boolean),
          () => scrapeLinkUrl({ pageUrl: RBI_PUBLICATION_PAGE, match: ESTATES_LINK }),
          ESTATES_PINNED,
        ];
        const got = await ensureFn({ id: 'rbi-estates', kind: 'xlsx', urls, localFiles: dropped(), maxAgeDays: 120, minBytes: 1_000_000, cacheDir });
        file = got.path;
        if (got.status !== 'downloaded' && got.status !== 'fresh-cache' && got.attempts.some((a) => /bot-check|exit 56/.test(a))) {
          const link = got.attempts.map((a) => /^(https:\/\/rbidocs\S+?) ->/.exec(a)?.[1]).find(Boolean) ?? RBI_PUBLICATION_PAGE;
          console.log(`[rbi-estates] NOTE: RBI's file server refuses scripted downloads (bot check), which is not bypassed. Using ${got.status} copy (${Math.round(got.ageDays ?? 0)} d old). When RBI publishes a new edition (usually January), save ${link} from a browser into docs/samples/national/ - the newest ESTATES*.XLSX there is picked up automatically.`);
        }
        how = `${got.status}${got.ageDays != null ? `, ${Math.round(got.ageDays)} d old` : ''}${got.attempts.length ? `; attempts: ${got.attempts.join(' | ')}` : ''}`;
      }
      if (!existsSync(file)) throw new Error(`RBI e-STATES workbook not found at ${file}`);
      console.log(`[rbi-estates] using ${file} (${how})`);
      const best = latestActuals(iterSheetRows(readFileSync(file), 'Data'));
      const observations = [];
      for (const [key, { value, year }] of best) {
        const [divisionId, head] = key.split('|');
        const [metric, unit] = HEADS[head];
        observations.push({
          divisionId, metric, value, unit, year, source: id, sourceUrl: RBI_PAGE, scope: 'division', method: 'direct',
          note: 'RBI e-STATES, state government accounts (actuals; fiscal year ending in the stated year); excludes local bodies',
        });
      }
      if (!observations.length) throw new Error('RBI e-STATES: no state rows matched');
      return { observations };
    },
  };
}
