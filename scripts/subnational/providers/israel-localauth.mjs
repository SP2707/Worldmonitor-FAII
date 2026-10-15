// Israel: audited financial statements of local authorities (Ministry of Interior, data.gov.il dataset `local-authorities`),
// summed per district using the National Digital Agency's `municipal-authorities` list (authority -> district).
// Checked on real downloads 2026-10-14:
//  * finance rows: sheet 'דוח לתושב' (resident report), rows 'סהכ הכנסות' / 'סהכ הוצאות', column 'ביצוע שנה נוכחית' (actual, current year).
//    Units are ILS THOUSAND: Abu Ghosh total expense 77,800 and the sheet's own per-capita figure 8,817.86 over 8,823 residents agree (77,800,000 / 8,823).
//  * join: finance 'קוד_רשות' = prefix digit(s) + 4-digit authority code (92710 -> 2710); accepted only when the names are also similar.
//    Otherwise a unique normalised-name match; anything else is DROPPED (never guessed).
//  * 'אזור יהודה והשומרון' (Judea and Samaria) authorities and authorities with no district are not in the six district divisions and are dropped.
// This is the sum of MUNICIPAL budgets in each district - not the accounts of a district government.
export const DATASTORE = 'https://data.gov.il/api/3/action/datastore_search';
export const AUTHORITIES_RESOURCE = 'c4916937-f5d3-4295-a22e-88a1af5cde6a';
export const FINANCE_RESOURCE = '6e153ddd-d4d4-4450-a78c-20f594a7986a'; // audited statements, report year 2024 (pinned; update when 2025 appears)
export const DATASET_PAGE = 'https://data.gov.il/dataset/local-authorities';
export const DISTRICT_IDS = Object.freeze({
  'הצפון': 'IL-Z', 'חיפה': 'IL-HA', 'המרכז': 'IL-M', 'תל אביב': 'IL-TA', 'ירושלים': 'IL-JM', 'הדרום': 'IL-D',
});
const SHEET = 'דוח לתושב';
const COLUMN = 'ביצוע שנה נוכחית';
const ROWS = Object.freeze({ 'סהכ הכנסות': 'revenue', 'סהכ הוצאות': 'expenditure' });

export function normName(s) { return String(s ?? '').replace(/[\s\-־"'״׳]/g, '').replace(/יי/g, 'י').replace(/וו/g, 'ו'); }
function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
const similar = (a, b) => a === b || a.includes(b) || b.includes(a) || lev(a, b) <= 2;
function codeOf(raw) { const n = Number.parseFloat(raw); return Number.isFinite(n) ? n % 10000 : null; }

/** @returns {{matched: Map<number, object>, dropped: object[]}} finance authority keyed by lookup LocalAuthorityCode */
export function joinAuthorities(lookup, financeAuthorities) {
  const byCode = new Map(lookup.map((a) => [a.LocalAuthorityCode, a]));
  const byName = new Map();
  for (const a of lookup) { const k = normName(a.LocalAuthorityName); byName.set(k, [...(byName.get(k) ?? []), a]); }
  const matched = new Map(); const dropped = [];
  for (const f of financeAuthorities) {
    const n = normName(f.name);
    let hit = null;
    const c = codeOf(f.code);
    const byC = c == null ? null : byCode.get(c);
    if (byC && similar(n, normName(byC.LocalAuthorityName))) hit = byC;
    else { const cand = byName.get(n) ?? []; if (cand.length === 1) hit = cand[0]; }
    if (hit && !matched.has(hit.LocalAuthorityCode)) matched.set(hit.LocalAuthorityCode, { lookup: hit, finance: f });
    else dropped.push(f);
  }
  return { matched, dropped };
}

/** Sum revenue/expenditure per district from joined authorities; each entry: {revenue, expenditure, n, year}. */
export function sumByDistrict(matched, totalsByLamas) {
  const out = new Map();
  for (const { lookup, finance } of matched.values()) {
    const id = DISTRICT_IDS[lookup.LocalAuthorityDistrict];
    const t = totalsByLamas.get(finance.lamas);
    if (!id || !t || t.revenue == null || t.expenditure == null) continue;
    const e = out.get(id) ?? { revenue: 0, expenditure: 0, n: 0, year: t.year };
    e.revenue += t.revenue; e.expenditure += t.expenditure; e.n += 1; e.year = Math.max(e.year, t.year);
    out.set(id, e);
  }
  return out;
}

async function page(fetchFn, params) {
  const r = await fetchFn(`${DATASTORE}?${new URLSearchParams(params)}`, { headers: { 'User-Agent': 'worldmonitor-faii-subnational/1.0' }, timeoutMs: 120_000 });
  if (!r.ok) throw new Error(`data.gov.il HTTP ${r.status}`);
  const j = await r.json();
  if (!j.success) throw new Error('data.gov.il: success=false');
  return j.result;
}

export function createIsraelLocalAuthProvider({ id = 'il-moi:local-authorities-2024' } = {}) {
  return {
    id,
    async run(ctx) {
      const { curlFetch } = await import('../_curl.mjs');
      const fetchFn = ctx.fetchFn ?? curlFetch;
      const lookup = (await page(fetchFn, { resource_id: AUTHORITIES_RESOURCE, limit: '1000' })).records;
      const totalsByLamas = new Map(); const authorities = new Map();
      for (const [row, key] of Object.entries(ROWS)) {
        const res = await page(fetchFn, {
          resource_id: FINANCE_RESOURCE, limit: '2000',
          filters: JSON.stringify({ 'גליון': SHEET, 'שורה': row, 'עמודה': COLUMN }),
        });
        for (const r of res.records) {
          const v = Number(r['ערך']); if (!Number.isFinite(v)) continue;
          const t = totalsByLamas.get(r['קוד_למס']) ?? { year: Number(r['שנת_נתונים']) };
          if (t[key] == null) t[key] = v; // first row only; duplicates would be a data fault
          totalsByLamas.set(r['קוד_למס'], t);
          authorities.set(r['קוד_למס'], { lamas: r['קוד_למס'], name: r['שם_רשות'], code: r['קוד_רשות'] });
        }
      }
      const { matched } = joinAuthorities(lookup, [...authorities.values()]);
      const sums = sumByDistrict(matched, totalsByLamas);
      const observations = [];
      for (const [divisionId, s] of sums) {
        for (const [key, metric] of [['revenue', 'local_authorities_revenue_ils_thousand'], ['expenditure', 'local_authorities_expenditure_ils_thousand']]) {
          observations.push({
            divisionId, metric, value: s[key], unit: 'ILS thousand (sum of municipal budgets in the district, actual)', year: s.year,
            source: id, sourceUrl: DATASET_PAGE, scope: 'division', method: 'sum_of_children',
            note: `sum of ${s.n} local authorities matched to this district (of ${authorities.size} reporting nationally; unmatched dropped); municipal budgets, not a district-government account`,
          });
        }
      }
      if (!observations.length) throw new Error('Israel local authorities: nothing joined to a district');
      return { observations };
    },
  };
}
