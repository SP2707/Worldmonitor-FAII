// Malaysia, Department of Statistics (OpenDOSM) open data: annual real GDP by state and sector.
// https://storage.dosm.gov.my/gdp/gdp_state_real_supply.csv  (also .parquet and the api.data.gov.my JSON API)
// Layout read from the real file saved 2026-10-15: columns series,date,state,sector,value; series 'abs' (RM million) and
// 'growth_yoy' (% on the year before); date is the first day of the year (2015-01-01 .. 2025-01-01); sector p0..p6.
// The dataset page states "constant 2015 prices", "RM million" and "production method". p0 is not labelled in the file; it is
// the all-sector total because p1..p6 sum to it (Johor 2025 exactly; W.P. Kuala Lumpur 2025 is off by 1.07 of 265,103 RM million,
// so the check allows 0.1% for rounding / constant-price non-additivity and fails on anything larger).
// State 'Supra' is extra-regio output, not a state, and is dropped.
import { parseCsv } from '../_csv.mjs';
import { curlFetch } from '../_curl.mjs';
import { DIVISIONS } from '../_registry.mjs';

export const DOSM_GDP_CSV = 'https://storage.dosm.gov.my/gdp/gdp_state_real_supply.csv';
export const DOSM_GDP_PAGE = 'https://open.dosm.gov.my/data-catalogue/gdp_state_real_supply';
const MY = DIVISIONS.filter((d) => d.country === 'MY');

/** @returns {{ levels: Map<string,{year:number,value:number}>, growth: Map<string,{year:number,value:number}> }} newest year per state; throws if p1..p6 do not sum to p0 */
export function latestStateGdp(csvText) {
  const rows = parseCsv(csvText);
  if (rows.length === 0 || !('series' in rows[0]) || !('sector' in rows[0]) || !('state' in rows[0])) throw new Error('DOSM GDP csv: unexpected header');
  const bySlot = new Map();
  for (const r of rows) {
    if (r.state === 'Supra') continue;
    const v = Number(r.value);
    if (!Number.isFinite(v) || !/^\d{4}-/.test(r.date)) continue;
    bySlot.set(`${r.series}|${r.state}|${r.date}|${r.sector}`, v);
  }
  const levels = new Map(); const growth = new Map();
  const states = new Set(rows.filter((r) => r.state !== 'Supra').map((r) => r.state));
  for (const s of states) {
    const dates = [...new Set(rows.filter((r) => r.state === s && r.series === 'abs').map((r) => r.date))].sort();
    for (const date of dates.reverse()) {
      const p0 = bySlot.get(`abs|${s}|${date}|p0`);
      if (p0 == null) continue;
      const parts = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].map((k) => bySlot.get(`abs|${s}|${date}|${k}`));
      if (parts.every((x) => x != null)) {
        const sum = parts.reduce((a, b) => a + b, 0);
        if (Math.abs(sum - p0) > 0.001 * Math.abs(p0)) throw new Error(`DOSM GDP ${s} ${date}: sectors sum ${sum.toFixed(3)} != p0 ${p0}; p0 is not the total`);
      }
      levels.set(s, { year: Number(date.slice(0, 4)), value: p0 });
      const gr = bySlot.get(`growth_yoy|${s}|${date}|p0`);
      if (gr != null) growth.set(s, { year: Number(date.slice(0, 4)), value: gr });
      break;
    }
  }
  return { levels, growth };
}

export function createDosmGdpProvider({ id = 'my-dosm:gdp_state_real_supply' } = {}) {
  return {
    id,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? curlFetch;
      const resp = await fetchFn(DOSM_GDP_CSV, { headers: { 'User-Agent': 'worldmonitor-faii-subnational/1.0' }, timeoutMs: 90_000 });
      if (!resp.ok) throw new Error(`DOSM GDP HTTP ${resp.status}`);
      const { levels, growth } = latestStateGdp(await resp.text());
      const observations = [];
      for (const d of MY) {
        const lv = levels.get(d.srcName);
        if (lv) observations.push({ divisionId: d.id, metric: 'grp', value: lv.value, unit: 'MYR million (constant 2015 prices)', year: lv.year, source: id, sourceUrl: DOSM_GDP_PAGE, scope: 'division', method: 'direct', note: 'real GDP, production method, all sectors (p0); OpenDOSM does not say whether the newest year is provisional' });
        const gr = growth.get(d.srcName);
        if (gr) observations.push({ divisionId: d.id, metric: 'grp_growth_pct', value: gr.value, unit: '% year on year (real)', year: gr.year, source: id, sourceUrl: DOSM_GDP_PAGE, scope: 'division', method: 'direct' });
      }
      if (observations.length === 0) throw new Error('DOSM GDP: no state matched');
      return { observations };
    },
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// More OpenDOSM state tables. Download links read from the dataset pages on 2026-10-15; column names read from the API
// samples (population_state, hies_state, lfs_qtr_state) and from the real crime_district.csv head. Every provider
//  * requires its columns (a changed layout fails loudly),
//  * uses ONE common newest date across all states (never mixes years),
//  * drops the 'Malaysia' national row from the divisions but uses it to check that the states add up (table integrity).
// State labels are matched with stateKey(); a state whose label differs is simply missing (never guessed).
// ---------------------------------------------------------------------------------------------------------------------
export const DOSM_URLS = Object.freeze({
  population: 'https://storage.dosm.gov.my/population/population_state.csv',
  hies: 'https://storage.dosm.gov.my/hies/hies_state.csv',
  lfs: 'https://storage.dosm.gov.my/labour/lfs_qtr_state.csv',
  crime: 'https://storage.data.gov.my/publicsafety/crime_district.csv',
});
const PAGE = (id) => `https://open.dosm.gov.my/data-catalogue/${id}`;
const UA = 'worldmonitor-faii-subnational/1.0';

/** 'W.P. Kuala Lumpur' / 'Wilayah Persekutuan Kuala Lumpur' / 'Kuala Lumpur' -> 'kualalumpur'. */
export function stateKey(s) {
  return String(s ?? '').normalize('NFKD').replace(/[^A-Za-z0-9]/g, '').toLowerCase().replace(/^(wilayahpersekutuan|wp)/, '');
}

async function loadRows(fetchFn, url, required) {
  const resp = await fetchFn(url, { headers: { 'User-Agent': UA }, timeoutMs: 120_000 });
  if (!resp.ok) throw new Error(`DOSM ${url.split('/').pop()} HTTP ${resp.status}`);
  const rows = parseCsv(await resp.text());
  const miss = required.filter((c) => !(rows[0] && c in rows[0]));
  if (rows.length === 0 || miss.length) throw new Error(`DOSM ${url.split('/').pop()}: missing column(s) ${miss.join(', ') || '(empty file)'}`);
  return rows;
}

const yearOf = (date) => Number(String(date).slice(0, 4));

/** Rows (already filtered to one series) -> {date, byState: Map(label->number), national: number|null} on the newest date that has data. */
function newestCommon(rows, valueOf) {
  let date = '';
  for (const r of rows) if (Number.isFinite(valueOf(r)) && r.date > date) date = r.date;
  if (!date) throw new Error('DOSM: no dated values');
  const byState = new Map(); let national = null;
  for (const r of rows) {
    if (r.date !== date) continue;
    const v = valueOf(r); if (!Number.isFinite(v)) continue;
    if (r.state === 'Malaysia') national = v; else byState.set(r.state, v);
  }
  return { date, byState, national };
}

function assertAddsUp(what, byState, national, tol) {
  if (national == null) return;
  const sum = [...byState.values()].reduce((a, b) => a + b, 0);
  if (Math.abs(sum - national) > tol * Math.abs(national)) throw new Error(`DOSM ${what}: states add up to ${sum} but the national row says ${national}; table not self-consistent, nothing published`);
}

function emit(id, dataset, date, byState, { metric, unit, note, scale = 1 }) {
  const out = [];
  const wanted = new Map(MY.map((d) => [stateKey(d.srcName), d]));
  for (const [label, v] of byState) {
    const d = wanted.get(stateKey(label)); if (!d) continue;
    out.push({ divisionId: d.id, metric, value: v * scale, unit, year: yearOf(date), source: id, sourceUrl: PAGE(dataset), scope: 'division', method: 'direct', note });
  }
  return out;
}

/** Population in thousands (DOSM), converted to persons; the unit is verified against the World Bank national total (10%). */
export function createDosmPopulationProvider({ id = 'my-dosm:population_state' } = {}) {
  return {
    id,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? curlFetch;
      const rows = (await loadRows(fetchFn, DOSM_URLS.population, ['state', 'date', 'sex', 'age', 'ethnicity', 'population']))
        .filter((r) => r.age === 'overall' && r.sex === 'both' && r.ethnicity === 'overall');
      const { date, byState, national } = newestCommon(rows, (r) => Number(r.population));
      assertAddsUp('population_state', byState, national, 0.01);
      const total = [...byState.values()].reduce((a, b) => a + b, 0) * 1000;
      const wb = await fetchFn('https://api.worldbank.org/v2/country/MY/indicator/SP.POP.TOTL?format=json&mrnev=1', { headers: { 'User-Agent': UA }, timeoutMs: 45_000 });
      if (!wb.ok) throw new Error(`World Bank population check HTTP ${wb.status}`);
      const ref = (await import('./worldbank.mjs')).parseWorldBank(await wb.json()).get('MY');
      if (!ref || !(total / ref.value > 0.9 && total / ref.value < 1.1)) throw new Error(`DOSM population unit check failed (states x 1000 = ${total}, World Bank ${ref?.value}); nothing published`);
      const observations = emit(id, 'population_state', date, byState, { metric: 'population', unit: 'persons', scale: 1000, note: `DOSM population in thousands x 1000; unit verified: states add up to ${(total / ref.value * 100).toFixed(1)}% of the World Bank national total (${ref.date})` });
      if (!observations.length) throw new Error('DOSM population: no state matched');
      return { observations };
    },
  };
}

/** Household Income & Expenditure Survey by state: Gini, poverty incidence, mean and median monthly household income. */
export function createDosmHiesProvider({ id = 'my-dosm:hies_state' } = {}) {
  const SPECS = [
    ['gini', 'gini_index', 'index 0-1', 'DOSM HIES household income Gini'],
    ['poverty', 'poverty_incidence_pct', '% (DOSM absolute poverty incidence, HIES)', 'DOSM HIES poverty incidence'],
    ['income_mean', 'household_income_mean_monthly', 'MYR per month (unit inferred from magnitude, not printed in the file)', 'DOSM HIES mean household income'],
    ['income_median', 'household_income_median_monthly', 'MYR per month (unit inferred from magnitude, not printed in the file)', 'DOSM HIES median household income'],
  ];
  return {
    id,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? curlFetch;
      const rows = await loadRows(fetchFn, DOSM_URLS.hies, ['state', 'date', ...SPECS.map((s) => s[0])]);
      const observations = [];
      for (const [col, metric, unit, note] of SPECS) {
        const { date, byState } = newestCommon(rows, (r) => (r[col] === '' ? NaN : Number(r[col])));
        observations.push(...emit(id, 'hies_state', date, byState, { metric, unit, note }));
      }
      if (!observations.length) throw new Error('DOSM HIES: no state matched');
      return { observations };
    },
  };
}

/** Labour Force Survey, quarterly, by state: unemployment rate of the newest quarter. */
export function createDosmUnemploymentProvider({ id = 'my-dosm:lfs_qtr_state' } = {}) {
  return {
    id,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? curlFetch;
      const rows = await loadRows(fetchFn, DOSM_URLS.lfs, ['state', 'date', 'u_rate']);
      const { date, byState } = newestCommon(rows, (r) => (r.u_rate === '' ? NaN : Number(r.u_rate)));
      const observations = emit(id, 'lfs_qtr_state', date, byState, { metric: 'unemployment_rate_pct', unit: '% of labour force', note: `DOSM Labour Force Survey, quarter starting ${date}` });
      if (!observations.length) throw new Error('DOSM LFS: no state matched');
      return { observations };
    },
  };
}

/** Police-recorded crime by state (the district 'All' rows). Counts, not rates; states must add up to the national row (2%). */
export function createDosmCrimeProvider({ id = 'my-dosm:crime_district' } = {}) {
  const SPECS = [
    ['assault', 'murder', 'murder_count', 'police-recorded murders'],
    ['assault', 'all', 'violent_crime_count', 'police-recorded crimes in the DOSM "assault" category (murder, rape, robbery, causing injury)'],
    ['property', 'all', 'property_crime_count', 'police-recorded crimes in the DOSM "property" category (break-in, theft)'],
  ];
  return {
    id,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? curlFetch;
      const rows = (await loadRows(fetchFn, DOSM_URLS.crime, ['state', 'district', 'category', 'type', 'date', 'crimes'])).filter((r) => r.district === 'All');
      const observations = [];
      for (const [category, type, metric, note] of SPECS) {
        const sel = rows.filter((r) => r.category === category && r.type === type);
        const { date, byState, national } = newestCommon(sel, (r) => (r.crimes === '' ? NaN : Number(r.crimes)));
        assertAddsUp(`crime_district ${category}/${type}`, byState, national, 0.02);
        observations.push(...emit(id, 'crime_district', date, byState, { metric, unit: 'crimes recorded in the year', note: `${note}; counts, not a rate` }));
      }
      if (!observations.length) throw new Error('DOSM crime: no state matched');
      return { observations };
    },
  };
}
