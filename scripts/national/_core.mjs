// Pure functions for the national layer (no network): parse World Bank answers, build the payload, score data depth, rank.
import { ALL, CATEGORY_ORDER, INDICATORS } from './indicators.mjs';

/** Country list answer -> Map ISO3 -> {iso3, iso2, name, region, income}. Aggregates (region id "NA") are dropped. */
export function parseCountryList(body) {
  const rows = Array.isArray(body) && Array.isArray(body[1]) ? body[1] : [];
  const out = new Map();
  for (const r of rows) {
    if (!r?.id || !/^[A-Z]{3}$/.test(r.id) || r.region?.id === 'NA') continue;
    out.set(r.id, { iso3: r.id, iso2: r.iso2Code ?? null, name: r.name, region: r.region?.value ?? null, income: r.incomeLevel?.value ?? null });
  }
  return out;
}

/** Indicator answer (all countries, mrnev=1) -> Map ISO3 -> {value, year}. A World Bank error body ([{message}]) throws. */
export function parseIndicator(body) {
  if (Array.isArray(body) && body[0]?.message) throw new Error(`World Bank: ${body[0].message.map((m) => m.value ?? m.key).join('; ')}`);
  const rows = Array.isArray(body) && Array.isArray(body[1]) ? body[1] : [];
  const out = new Map();
  for (const r of rows) {
    const iso3 = r?.countryiso3code;
    const v = r?.value == null ? NaN : Number(r.value);
    if (!iso3 || !Number.isFinite(v)) continue;
    const year = Number(r.date);
    const cur = out.get(iso3);
    if (!cur || year > cur.year) out.set(iso3, { value: v, year: Number.isFinite(year) ? year : null });
  }
  return out;
}

// World Bank economies that are territories / special administrative regions, not sovereign states (judgement call:
// West Bank and Gaza (PSE) and Kosovo (XKX) are kept as countries). 22 of the 217 entries; 202 - 22 = 180 ranked countries.
export const NON_SOVEREIGN = Object.freeze(new Set(['ABW', 'ASM', 'BMU', 'CHI', 'CUW', 'CYM', 'FRO', 'GIB', 'GRL', 'GUM', 'HKG', 'IMN', 'MAC', 'MAF', 'MNP', 'NCL', 'PRI', 'PYF', 'SXM', 'TCA', 'VGB', 'VIR']));

export const tierOf = (score) => (score >= 90 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'D');

/** @param {Map} countries @param {Map<string, Map>} byMetric metric -> (ISO3 -> {value,year}) */
export function buildNational({ countries, byMetric, errors = [], nowMs = Date.now() }) {
  const out = {};
  for (const c of countries.values()) {
    const indicators = {};
    for (const { metric, code, unit } of ALL) {
      const hit = byMetric.get(metric)?.get(c.iso3);
      if (hit) indicators[metric] = { value: hit.value, year: hit.year, unit, source: `worldbank:${code}` };
    }
    out[c.iso3] = { ...c, indicators };
  }
  return { generatedAt: new Date(nowMs).toISOString(), indicatorCount: ALL.length, countryCount: countries.size, errors, countries: out };
}

/**
 * Depth score 0-100 for one country: per category, the share of its indicators that have a value (a value older than
 * `staleBeforeYear` counts half); the score is the mean over all ten categories. Equal weights, no judgement about importance.
 */
export function depthScore(country, { currentYear = new Date().getUTCFullYear(), maxAgeYears = 5 } = {}) {
  const perCategory = {};
  let sum = 0;
  for (const cat of CATEGORY_ORDER) {
    const specs = INDICATORS[cat];
    let got = 0;
    for (const [metric] of specs) {
      const ind = country.indicators[metric];
      if (!ind) continue;
      got += ind.year != null && currentYear - ind.year > maxAgeYears ? 0.5 : 1;
    }
    perCategory[cat] = got / specs.length;
    sum += perCategory[cat];
  }
  const years = Object.values(country.indicators).map((i) => i.year).filter((y) => Number.isFinite(y));
  const avgYear = years.length ? years.reduce((a, b) => a + b, 0) / years.length : 0;
  const filled = Object.keys(country.indicators).length;
  const score = (sum / CATEGORY_ORDER.length) * 100;
  return { score, tier: tierOf(score), perCategory, filled, total: ALL.length, avgYear };
}

export function rankCountries(national, { exclude = new Set(), ...opts } = {}) {
  const rows = Object.values(national.countries).filter((c) => !exclude.has(c.iso3))
    .map((c) => ({ iso3: c.iso3, name: c.name, region: c.region, income: c.income, ...depthScore(c, opts) }));
  rows.sort((a, b) => b.score - a.score || b.filled - a.filled || b.avgYear - a.avgYear || a.name.localeCompare(b.name));
  return rows.map((r, i) => ({ rank: i + 1, ...r }));
}
