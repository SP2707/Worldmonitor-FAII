// Statistics Canada table 10-10-0017-01: statement of operations of PROVINCIAL AND TERRITORIAL governments (annual, CAD millions).
// Columns checked on a real download 2026-10-14: REF_DATE, GEO, 'Public sector components', 'Display value',
// 'Statement of operations and balance sheet', UOM, SCALAR_FACTOR ('millions'), VALUE, STATUS. 'Display value' has
// 'Stocks' and 'Transactions and other economic flows'; revenue/expense/taxes are flows. Newest year seen: 2024.
// Government scope is the provincial/territorial government only (no local governments).
import { parseCsv } from '../_csv.mjs';
import { loadStatCanCsv } from './statcan.mjs';
import { matchDivisions } from './oecd.mjs';

export const FISCAL_TABLE_PAGE = 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1010001701';
export const FLOW = 'Transactions and other economic flows';
export const ITEMS = Object.freeze([
  ['Revenue [1]', 'subnational_govt_revenue_cad_million', 'CAD million (provincial/territorial government revenue)'],
  ['Expense [2]', 'subnational_govt_expenditure_cad_million', 'CAD million (provincial/territorial government expense)'],
  ['Taxes [11]', 'subnational_govt_tax_revenue_cad_million', 'CAD million (provincial/territorial government tax revenue)'],
]);
const EXCLUDE = new Set(['Canada']);

/** @returns {Map<string,Map<string,{value:number,year:number,name:string,country:string}>>} item -> GEO -> newest numeric flow value */
export function latestFiscalByItem(csvText) {
  const wanted = new Set(ITEMS.map((i) => i[0]));
  const lines = csvText.replace(/^﻿/, '').split(/\r?\n/);
  const keep = [lines[0]];
  for (let i = 1; i < lines.length; i++) if (lines[i].includes(`"${FLOW}"`)) keep.push(lines[i]);
  const out = new Map(ITEMS.map((i) => [i[0], new Map()]));
  for (const r of parseCsv(keep.join('\n'))) {
    const item = r['Statement of operations and balance sheet'];
    if (!wanted.has(item) || r['Display value'] !== FLOW || EXCLUDE.has(r.GEO) || r.VALUE === '' || r.VALUE == null) continue;
    if (r.SCALAR_FACTOR !== 'millions') continue;
    const v = Number(r.VALUE); const year = Number(r.REF_DATE);
    if (!Number.isFinite(v) || !Number.isFinite(year)) continue;
    const m = out.get(item); const cur = m.get(r.GEO);
    if (!cur || year > cur.year) m.set(r.GEO, { value: v, year, name: r.GEO, country: 'CAN' });
  }
  return out;
}

export function createStatCanFiscalProvider({ id = 'statcan:10-10-0017-01' } = {}) {
  return {
    id,
    async run(ctx) {
      const csv = await loadStatCanCsv('10100017', ctx);
      const byItem = latestFiscalByItem(csv);
      const observations = [];
      for (const [item, metric, unit] of ITEMS) {
        const m = byItem.get(item);
        const { matched } = matchDivisions(m, { additive: false, countries: ['CA'] });
        for (const x of matched) {
          observations.push({
            divisionId: x.div.id, metric, value: x.value, unit, year: x.year, source: id, sourceUrl: FISCAL_TABLE_PAGE,
            scope: 'division', method: 'direct',
            note: 'Statistics Canada statement of operations, provincial/territorial government only (excludes local governments); reference year as published',
          });
        }
      }
      if (!observations.length) throw new Error('StatCan fiscal: no province matched the registry');
      return { observations };
    },
  };
}
