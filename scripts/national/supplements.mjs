// Second-source national data, kept SEPARATE from the World Bank indicators (country.supplements, never merged into
// country.indicators) so a reader can compare sources instead of trusting a silent blend.
//  * UNDP Human Development Report time-series CSV: one row per country, columns <stem>_<year>; ZZ* rows are aggregates.
//  * IMF DataMapper API v2: JSON {indicators:{CODE:{...,'projection-year'?}}, values:{CODE:{ISO3:{year:value}}}}.
//    Years at or after the indicator's projection-year are forecasts and are dropped; the newest remaining year is used
//    (the IMF may still label its newest year an estimate).
// Layouts here were read from real responses saved by scripts/probe-global-sources.mjs (2026-10-15).
// Not used on purpose: IMF capital-flows FDI (DirectIn/DirectAbroad) - its newest year is 2014, last modified 2016.

export const UNDP_CSV_URL = 'https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Composite_indices_complete_time_series.csv';

// [metric, csv stem, unit]
export const UNDP_STEMS = Object.freeze([
  ['undp_hdi', 'hdi', '0-1 index'], ['undp_hdi_rank', 'hdi_rank', 'rank'], ['undp_life_expectancy', 'le', 'years'],
  ['undp_expected_schooling', 'eys', 'years'], ['undp_mean_schooling', 'mys', 'years'], ['undp_gni_pc_ppp', 'gnipc', '2021 PPP $'],
  ['undp_inequality_adjusted_hdi', 'ihdi', '0-1 index'], ['undp_gender_inequality_index', 'gii', '0-1 index'],
]);

// [metric, IMF code, unit]
export const IMF_SERIES = Object.freeze([
  ['imf_gdp_usd_bn', 'NGDPD', 'billion USD'], ['imf_gdp_per_capita_usd', 'NGDPDPC', 'USD'], ['imf_gdp_growth_pct', 'NGDP_RPCH', '% annual'],
  ['imf_population_m', 'LP', 'million persons'], ['imf_govt_gross_debt_pct_gdp', 'GGXWDG_NGDP', '% of GDP'],
  ['imf_govt_net_lending_pct_gdp', 'GGXCNL_NGDP', '% of GDP'], ['imf_govt_revenue_pct_gdp', 'rev', '% of GDP'],
  ['imf_govt_expenditure_pct_gdp', 'exp', '% of GDP'],
]);
export const imfUrl = (code) => `https://www.imf.org/external/datamapper/api/v2/${encodeURIComponent(code)}`;

function splitCsvLine(line) {
  const out = []; let cur = ''; let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
    else if (ch === '"') q = true; else if (ch === ',') { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out;
}

/** UNDP CSV text -> Map ISO3 -> {metric: {value, year, unit, source}}. Aggregates (ZZ*) skipped. Newest non-empty year per stem. */
export function parseUndpCsv(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter(Boolean);
  const header = splitCsvLine(lines[0]);
  if (header[0] !== 'iso3' || !header.some((h) => /^hdi_\d{4}$/.test(h))) throw new Error('UNDP CSV: unexpected header');
  const cols = new Map(); // stem -> [{year, idx}] newest first
  header.forEach((h, idx) => {
    const m = /^(.*)_((?:19|20)\d\d)$/.exec(h);
    if (m) { const a = cols.get(m[1]) ?? []; a.push({ year: Number(m[2]), idx }); cols.set(m[1], a); }
  });
  for (const a of cols.values()) a.sort((x, y) => y.year - x.year);
  const out = new Map();
  for (const line of lines.slice(1)) {
    const c = splitCsvLine(line);
    if (!/^[A-Z]{3}$/.test(c[0])) continue; // ZZA.VHHD etc. are aggregates
    const rec = {};
    for (const [metric, stem, unit] of UNDP_STEMS) {
      for (const { year, idx } of cols.get(stem) ?? []) {
        const raw = c[idx];
        if (raw === undefined || raw === '') continue;
        const v = Number(raw);
        if (Number.isFinite(v)) { rec[metric] = { value: v, year, unit, source: 'undp:HDR25_Composite_indices_complete_time_series' }; break; }
      }
    }
    if (Object.keys(rec).length) out.set(c[0], rec);
  }
  return out;
}

/** IMF DataMapper answer for one code -> Map ISO3 -> {value, year}. Years >= projection-year (forecasts) are dropped. Regional-group codes are filtered later because only World Bank country ISO3s are attached. */
export function parseImfSeries(body, code, { nowYear = new Date().getUTCFullYear() } = {}) {
  const series = body?.values?.[code];
  if (!series || typeof series !== 'object') throw new Error(`IMF ${code}: no values`);
  const proj = Number(body?.indicators?.[code]?.['projection-year']);
  const lastYear = Number.isFinite(proj) ? proj - 1 : nowYear - 1;
  const out = new Map();
  for (const [iso3, years] of Object.entries(series)) {
    let best = null;
    for (const [y, v] of Object.entries(years ?? {})) {
      const year = Number(y);
      if (v == null || !Number.isFinite(Number(v)) || !Number.isFinite(year) || year > lastYear) continue;
      if (!best || year > best.year) best = { value: Number(v), year };
    }
    if (best) out.set(iso3, best);
  }
  return out;
}

/** Attach supplements to a built national payload (mutates country.supplements). Returns per-metric country counts. */
export function attachSupplements(national, { undp = null, imf = new Map() } = {}) {
  const counts = {};
  for (const c of Object.values(national.countries)) {
    const sup = { ...(undp?.get(c.iso3) ?? {}) };
    for (const [metric, code, unit] of IMF_SERIES) {
      const hit = imf.get(metric)?.get(c.iso3);
      if (hit) sup[metric] = { value: hit.value, year: hit.year, unit, source: `imf-datamapper:${code}` };
    }
    c.supplements = sup;
    for (const m of Object.keys(sup)) counts[m] = (counts[m] ?? 0) + 1;
  }
  national.supplementCounts = counts;
  return counts;
}
