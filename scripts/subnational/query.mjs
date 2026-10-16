// Pure read-side helpers for the subnational + national layers (no network, no Redis): the MCP tools call these with
// payloads already read from the seeded keys. Every value is returned with its unit, year, source and scope, so a caller
// can never mistake a national figure for a division figure.
import { DIVISIONS, BY_ID, COUNTRIES, CATEGORIES } from './_registry.mjs';

export const CATEGORY_SLUGS = Object.freeze(Object.keys(CATEGORIES));
const MAX_DIVISIONS = 120;

const clean = (m) => (m && typeof m === 'object' ? m : null);

/** Resolve a country argument (ISO2, any case) or null. */
export const normCountry = (s) => (typeof s === 'string' && /^[A-Za-z]{2}$/.test(s.trim()) ? s.trim().toUpperCase() : null);

/**
 * @param {Record<string, any>} payloads category slug -> seeded payload (or null when the key is missing)
 * @param {{country?: string, divisionId?: string, categories?: string[], metrics?: string[], limit?: number}} q
 */
export function queryDivisions(payloads, q = {}) {
  const country = q.country == null ? null : normCountry(q.country);
  if (q.country != null && !country) return { error: 'country must be a 2-letter ISO code, e.g. "MY"' };
  if (country && !COUNTRIES.includes(country)) return { error: `no divisions for country ${country}; covered: ${COUNTRIES.join(', ')}` };
  const divisionId = typeof q.divisionId === 'string' && q.divisionId ? q.divisionId.trim().toUpperCase() : null;
  if (divisionId && !BY_ID.has(divisionId)) return { error: `unknown divisionId ${divisionId}` };
  if (!country && !divisionId) return { error: 'give country (ISO2) or divisionId' };
  const cats = q.categories?.length ? q.categories : CATEGORY_SLUGS;
  const badCat = cats.find((c) => !CATEGORY_SLUGS.includes(c));
  if (badCat) return { error: `unknown category "${badCat}"; valid: ${CATEGORY_SLUGS.join(', ')}` };
  const wanted = q.metrics?.length ? new Set(q.metrics) : null;
  const limit = Math.min(Math.max(Number.isFinite(q.limit) ? Math.trunc(q.limit) : MAX_DIVISIONS, 1), MAX_DIVISIONS);

  const list = DIVISIONS.filter((d) => (divisionId ? d.id === divisionId : d.country === country));
  const missingCategories = cats.filter((c) => !payloads[c]);
  const divisions = list.slice(0, limit).map((d) => {
    const metrics = [];
    for (const c of cats) {
      const ms = clean(payloads[c]?.divisions?.[d.id]?.metrics);
      if (!ms) continue;
      for (const [name, m] of Object.entries(ms)) {
        if (wanted && !wanted.has(name)) continue;
        if (!m || m.value == null) continue;
        metrics.push({ category: c, metric: name, value: m.value, unit: m.unit ?? null, year: m.year ?? null, source: m.source ?? null, sourceUrl: m.sourceUrl ?? null, scope: m.scope ?? 'division', note: m.note ?? null });
      }
    }
    return { id: d.id, name: d.name, country: d.country, countryName: d.countryName, metricCount: metrics.length, metrics };
  });
  return {
    divisionCount: list.length, returned: divisions.length, truncated: list.length > divisions.length,
    missingCategories, // categories whose Redis key is not seeded yet (empty != "no data exists")
    generatedAt: Object.fromEntries(cats.filter((c) => payloads[c]).map((c) => [c, payloads[c].generatedAt ?? null])),
    divisions,
  };
}

/** Coverage per category (and per country when given): divisions with status ok / national_only / no_source. */
export function queryCoverage(payloads, { country } = {}) {
  const iso = country == null ? null : normCountry(country);
  if (country != null && !iso) return { error: 'country must be a 2-letter ISO code' };
  const rows = CATEGORY_SLUGS.map((c) => {
    const p = payloads[c];
    if (!p) return { category: c, title: CATEGORIES[c].title, seeded: false };
    const t = iso ? p.coverage?.byCountry?.[iso] : p.coverage?.total;
    return { category: c, title: CATEGORIES[c].title, seeded: true, generatedAt: p.generatedAt ?? null, ...(t ?? { total: 0, ok: 0, national_only: 0, no_source: 0 }) };
  });
  return { country: iso, countriesCovered: COUNTRIES, categories: rows };
}

/** National indicators for one or more countries. `national` is the national:indicators:v1 payload. */
export function queryNational(national, q = {}) {
  if (!national?.countries) return { error: 'national layer not seeded yet (run scripts/seed-national.mjs)' };
  const codes = (q.countries ?? []).map((s) => String(s).trim().toUpperCase()).filter(Boolean);
  if (!codes.length) return { error: 'give countries: ISO2 or ISO3 codes' };
  if (codes.length > 25) return { error: 'at most 25 countries per call' };
  const all = Object.values(national.countries);
  const wanted = q.metrics?.length ? new Set(q.metrics) : null;
  const out = []; const unknown = [];
  for (const code of codes) {
    const c = national.countries[code] ?? all.find((x) => x.iso2 === code);
    if (!c) { unknown.push(code); continue; }
    const indicators = Object.entries(c.indicators ?? {})
      .filter(([m]) => !wanted || wanted.has(m))
      .map(([metric, v]) => ({ metric, value: v.value, unit: v.unit ?? null, year: v.year ?? null, source: v.source ?? null, scope: 'national' }));
    out.push({ iso3: c.iso3, iso2: c.iso2, name: c.name, region: c.region, income: c.income, indicatorCount: indicators.length, indicators });
  }
  return { generatedAt: national.generatedAt ?? null, countries: out, unknown };
}
