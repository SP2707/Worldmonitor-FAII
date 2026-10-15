// Mongolian National Statistics Office, PxWeb API (https://data.1212.mn/api/v1/en/NSO/Regional development/<folder>/<table>.px).
// Layouts read from real responses saved 2026-10-15 (docs/samples/probe-nontier/mongolia):
//  * GET table  -> {title, variables:[{code,text,values,valueTexts,...}]}; every table used here has exactly two variables,
//    "Region" (code 'Бүс') and "Year" (code 'Он'). A table with any other variable is refused (never mix series).
//  * POST {query:[...], response:{format:'json'}} -> {columns:[{code,...}], data:[{key:[region,year], values:[v]}]}.
//  * Region codes are 1 digit (region groups and the '0' total), 3 digits (aimags and Ulaanbaatar '711') or 5 digits (soums/districts).
//    The code scheme is NOT the same in every table (the "crimes against the right to life" table numbers aimags differently),
//    so divisions are matched by NAME (valueTexts), never by code. A name that is missing or ambiguous drops that division.
//  * Year codes are positions, not years ('0' is the newest year); the year comes from valueTexts.
//  * Blank values are '..'.
// Units are NOT printed in the table metadata; each provider states what it knows and flags the rest in the note.
import { DIVISIONS } from '../_registry.mjs';
import { curlFetch } from '../_curl.mjs';

export const PX_ROOT = 'https://data.1212.mn/api/v1/en/NSO/Regional%20development';
const MN = DIVISIONS.filter((d) => d.country === 'MN');
const UA = 'worldmonitor-faii-subnational/1.0';

export const norm = (s) => String(s ?? '').normalize('NFKD').replace(/[^A-Za-z0-9]/g, '').toLowerCase();
export const tableUrl = (folder, table) => `${PX_ROOT}/${encodeURIComponent(folder)}/${table}.px`;

async function readJson(resp, what) {
  if (!resp.ok) throw new Error(`${what} HTTP ${resp.status}`);
  return JSON.parse((await resp.text()).replace(/^﻿/, ''));
}

/** @returns {Promise<{code:string,name:string,year:number,value:number}[]>} non-blank cells of the newest `years` years, all regions */
export async function fetchTable(fetchFn, folder, table, { years = 3 } = {}) {
  const url = tableUrl(folder, table);
  const meta = await readJson(await fetchFn(url, { headers: { Accept: 'application/json', 'User-Agent': UA }, timeoutMs: 60_000 }), `PxWeb ${table} metadata`);
  const vars = meta.variables ?? [];
  const rv = vars.find((v) => v.text === 'Region');
  const yv = vars.find((v) => v.text === 'Year');
  if (!rv || !yv || vars.length !== 2) throw new Error(`PxWeb ${table}: expected exactly the Region and Year variables, got [${vars.map((v) => v.text).join(', ')}]; refusing to mix series`);
  const names = new Map(rv.values.map((c, i) => [c, String(rv.valueTexts?.[i] ?? '').trim()]));
  const yearOf = new Map(yv.values.map((c, i) => [c, Number(String(yv.valueTexts?.[i] ?? '').trim())]));
  // Some tables (mid-year population) publish blank codes for every year but the newest; a blank code cannot be selected, so it is skipped.
  const picked = [...yearOf].filter(([c, y]) => c !== '' && Number.isInteger(y) && y >= 1900 && y <= 2100).sort((a, b) => b[1] - a[1]).slice(0, years);
  if (picked.length === 0) throw new Error(`PxWeb ${table}: no year values`);
  const body = JSON.stringify({
    query: [
      { code: rv.code, selection: { filter: 'all', values: ['*'] } },
      { code: yv.code, selection: { filter: 'item', values: picked.map(([c]) => c) } },
    ],
    response: { format: 'json' },
  });
  const js = await readJson(await fetchFn(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': UA }, body, timeoutMs: 120_000,
  }), `PxWeb ${table} data`);
  const cols = (js.columns ?? []).map((c) => c.code);
  const ri = cols.indexOf(rv.code);
  const yi = cols.indexOf(yv.code);
  if (ri < 0 || yi < 0 || !Array.isArray(js.data)) throw new Error(`PxWeb ${table}: unexpected response layout`);
  const rows = [];
  for (const r of js.data) {
    const raw = String(r.values?.[0] ?? '').trim();
    if (raw === '' || /^\.+$|^-$/.test(raw)) continue;
    const value = Number(raw);
    const year = yearOf.get(r.key[yi]);
    if (!Number.isFinite(value) || !Number.isInteger(year)) continue;
    rows.push({ code: r.key[ri], name: names.get(r.key[ri]) ?? '', year, value });
  }
  return rows;
}

/**
 * divisionId -> {value, year, code}: the newest filled year of the region row whose name matches the division.
 * Aimags and Ulaanbaatar are 3-digit rows. Ulaanbaatar is also published as the 1-digit group '7' (same figures) and, in a few
 * tables, ONLY as '7'; a 1-digit row is therefore accepted when its name equals a division name, but a 3-digit row wins when both exist.
 * Soum/district rows (5 digits) and the '0' total never match.
 */
export function placeRows(rows) {
  const cands = rows.filter((r) => r.code !== '0' && r.code.length <= 3);
  const out = new Map();
  for (const d of MN) {
    let mine = cands.filter((r) => norm(r.name) === norm(d.srcName));
    if (new Set(mine.map((r) => r.code)).size > 1) mine = mine.filter((r) => r.code.length === 3);
    if (new Set(mine.map((r) => r.code)).size !== 1) continue; // missing or ambiguous: never guess
    const best = mine.reduce((a, b) => (b.year > a.year ? b : a));
    out.set(d.id, { value: best.value, year: best.year, code: best.code });
  }
  return out;
}

const observation = (d, spec, id, hit, url) => ({
  divisionId: d, metric: spec.metric, value: hit.value, unit: spec.unit, year: hit.year,
  source: id, sourceUrl: url, scope: 'division', method: 'direct', note: spec.note,
});

/**
 * One PxWeb table -> one metric for the 22 Mongolian divisions.
 * @param {{ id:string, folder:string, table:string, metric:string, unit:string, note?:string, checkChildren?:boolean }} spec
 *   checkChildren (soum-level tables): table integrity is checked GLOBALLY in the newest year - the 3-digit aimag rows must add up to the
 *   '0' national total and so must the 5-digit soum rows (0.1%); if either fails nothing is published. It is deliberately NOT checked
 *   aimag by aimag from the soum code prefix: live data showed some soums carry another aimag's prefix (Orkhon +7,622 / Bulgan -7,622,
 *   Ulaanbaatar +15,025 / Tuv -15,025: exactly offsetting), so a per-prefix sum would wrongly reject correct aimag totals.
 *   The prefix gaps are reported in the run note for information.
 */
export function createMongoliaPxProvider(spec) {
  const id = spec.id ?? `mn-nso:${spec.table}`;
  return {
    id,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? curlFetch;
      const rows = await fetchTable(fetchFn, spec.folder, spec.table);
      const placed = placeRows(rows);
      const url = tableUrl(spec.folder, spec.table);
      const notes = [];
      if (spec.checkChildren) {
        const year = Math.max(...rows.map((r) => r.year));
        const at = (pred) => rows.filter((r) => r.year === year && pred(r));
        const total = at((r) => r.code === '0')[0];
        const sumOf = (list) => list.reduce((a, r) => a + r.value, 0);
        const aimags = at((r) => r.code.length === 3);
        const soums = at((r) => r.code.length === 5);
        if (!total) throw new Error(`Mongolia NSO ${spec.table}: no national total row for ${year}`);
        for (const [what, list] of [['aimag rows', aimags], ['soum rows', soums]]) {
          if (list.length && Math.abs(sumOf(list) - total.value) > 0.001 * total.value) throw new Error(`Mongolia NSO ${spec.table}: ${what} sum ${sumOf(list)} != national total ${total.value} (${year}); table not self-consistent, nothing published`);
        }
        const gaps = [];
        for (const [divisionId, hit] of placed) {
          const kids = rows.filter((r) => r.code.length === 5 && r.code.startsWith(hit.code) && r.year === hit.year);
          const gap = kids.reduce((a, r) => a + r.value, 0) - hit.value;
          if (kids.length && Math.abs(gap) > 0.005 * Math.abs(hit.value)) gaps.push(`${divisionId} ${gap > 0 ? '+' : ''}${gap}`);
        }
        if (gaps.length) notes.push(`soum-code prefix sums differ from the aimag row for: ${gaps.join(', ')} (offsetting; aimag rows and national total agree)`);
      }
      const observations = [...placed].map(([divisionId, hit]) => observation(divisionId, spec, id, hit, url));
      if (observations.length === 0) throw new Error(`Mongolia NSO ${spec.table}: no division matched`);
      return { observations, note: notes.length ? notes.join('; ') : undefined };
    },
  };
}

/**
 * GDP and GDP per capita come with no printed unit. Before publishing them as MNT million / MNT thousand this provider
 * checks the national total against mid-year population: GDP x 1000 / population must equal GDP per capita within 5%.
 * If it does not, nothing is published (the unit assumption would be wrong).
 */
export function createMongoliaGrpProvider({ id = 'mn-nso:gdp-by-aimag' } = {}) {
  const NA = 'National accounts';
  return {
    id,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? curlFetch;
      const [gdp, pc, pop] = await Promise.all([
        fetchTable(fetchFn, NA, 'DT_NSO_0500_007V1'),
        fetchTable(fetchFn, NA, 'DT_NSO_0500_011V1'),
        fetchTable(fetchFn, 'Population and household', 'DT_NSO_0300_002V4'),
      ]);
      const total = (rows) => { const t = rows.filter((r) => r.code === '0'); return t.length ? t.reduce((a, b) => (b.year > a.year ? b : a)) : null; };
      const g = total(gdp); const c = total(pc);
      const p = pop.find((r) => r.code === '0' && r.year === g?.year);
      if (!g || !c || !p || g.year !== c.year) throw new Error('Mongolia GDP unit check: national totals for GDP, GDP per capita and population do not share a year');
      const ratio = (g.value * 1000 / p.value) / c.value;
      if (!(ratio > 0.95 && ratio < 1.05)) throw new Error(`Mongolia GDP unit check failed (GDP*1000/population / GDP-per-capita = ${ratio.toFixed(3)}); units are not MNT million / MNT thousand, nothing published`);
      const check = `unit verified: national GDP x 1000 / mid-year population = ${(ratio * 100).toFixed(1)}% of the published GDP per capita (${g.year})`;
      const observations = [];
      const emit = (rows, metric, unit) => {
        const spec = { metric, unit, note: `NSO table does not print its unit; ${check}` };
        const url = tableUrl(NA, metric === 'grp' ? 'DT_NSO_0500_007V1' : 'DT_NSO_0500_011V1');
        for (const [divisionId, hit] of placeRows(rows)) observations.push(observation(divisionId, spec, id, hit, url));
      };
      emit(gdp, 'grp', 'MNT million');
      emit(pc, 'grp_per_capita', 'MNT thousand');
      if (observations.length === 0) throw new Error('Mongolia NSO GDP: no division matched');
      return { observations };
    },
  };
}
