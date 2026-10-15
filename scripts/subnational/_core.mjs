// Pure helpers shared by the 10 subnational seeders: observation merge,
// status derivation, coverage summary, provider orchestration.
//
// Honesty rules baked in here (do not weaken them):
//   * A value is only ever written because a provider returned it. Nothing is
//     estimated, interpolated or copied from memory.
//   * `scope` says what the number describes. 'division' = that subnational
//     unit. 'national' = the whole country, repeated on each division for
//     context only. Never treat a national value as a division value.
//   * A division with no division-scope metric is reported as 'national_only'
//     or 'no_source' - never silently padded.

import { DIVISIONS, DIVISION_COUNT, COUNTRIES } from './_registry.mjs';

/**
 * @typedef {Object} Observation
 * @property {string} divisionId
 * @property {string} metric
 * @property {number} value
 * @property {string} [unit]
 * @property {number|string|null} [year]
 * @property {string} source        e.g. 'wikidata', 'eurostat:nama_10r_2gdp'
 * @property {string} [sourceUrl]
 * @property {'division'|'national'} scope
 * @property {string} [method]      'direct' | 'sum_of_children' | 'derived'
 * @property {string} [note]
 * @property {number} [rank]        provider priority, lower wins
 */

const STALE_REPLACE_MS = 90 * 86400_000;

export function emptyRecord(div) {
  return { id: div.id, name: div.name, country: div.country, status: 'no_source', metrics: {} };
}

/** Status from the metrics a record carries. */
export function deriveStatus(record, auxMetrics = []) {
  const entries = Object.entries(record.metrics || {});
  const obs = entries.map(([, o]) => o);
  // auxMetrics (e.g. area, population used only as a denominator) never make a division 'ok':
  // otherwise a category whose real source failed would still report full coverage.
  if (entries.some(([name, o]) => o.scope === 'division' && !auxMetrics.includes(name))) return 'ok';
  if (obs.length > 0) return 'national_only';
  return 'no_source';
}

/**
 * Merge new observations onto the previous payload's divisions.
 * Within one run, the first provider to supply a (division, metric) wins
 * (providers are listed best-first). Across runs a new value replaces an old
 * one only if its rank is as good or better, or the old one is >90 days old,
 * so a flaky high-quality provider cannot be overwritten by a worse one.
 */
export function mergeObservations(previousDivisions, observations, nowMs) {
  const out = {};
  for (const div of DIVISIONS) {
    const prev = previousDivisions?.[div.id];
    out[div.id] = prev && prev.metrics
      ? { ...emptyRecord(div), metrics: { ...prev.metrics } }
      : emptyRecord(div);
  }
  const winnersThisRun = new Set();
  for (const o of observations) {
    const rec = out[o.divisionId];
    if (!rec || !Number.isFinite(o.value)) continue;
    const slot = `${o.divisionId}|${o.metric}`;
    if (winnersThisRun.has(slot)) continue;
    const old = rec.metrics[o.metric];
    const newRank = o.rank ?? 0;
    const oldRank = old?.rank ?? 0;
    const oldAge = old?.fetchedAt ? nowMs - old.fetchedAt : Infinity;
    // A worse-ranked source may not overwrite a fresh better one, but the SAME source can always
    // refresh itself (provider order changes between releases shift ranks).
    if (old && newRank > oldRank && oldAge < STALE_REPLACE_MS && old.source !== o.source) continue;
    winnersThisRun.add(slot);
    rec.metrics[o.metric] = {
      value: o.value,
      unit: o.unit ?? null,
      year: o.year ?? null,
      source: o.source,
      sourceUrl: o.sourceUrl ?? null,
      scope: o.scope,
      method: o.method ?? 'direct',
      ...(o.note ? { note: o.note } : {}),
      rank: newRank,
      fetchedAt: nowMs,
    };
  }
  for (const rec of Object.values(out)) rec.status = deriveStatus(rec);
  return out;
}

/** Counts by status, per country and overall. */
export function summarizeCoverage(divisionsById) {
  const byCountry = {};
  for (const c of COUNTRIES) byCountry[c] = { total: 0, ok: 0, national_only: 0, no_source: 0 };
  const total = { total: 0, ok: 0, national_only: 0, no_source: 0 };
  for (const div of DIVISIONS) {
    const st = divisionsById[div.id]?.status ?? 'no_source';
    for (const bucket of [byCountry[div.country], total]) {
      bucket.total += 1;
      bucket[st] += 1;
    }
  }
  return { total, byCountry };
}

/**
 * Run providers in order. A throwing provider is recorded, not fatal.
 * @param {Array<{id:string, run:(ctx:object)=>Promise<{observations:Observation[], note?:string}>}>} providers
 */
export async function runProviders(providers, ctx) {
  const observations = [];
  const reports = [];
  for (let rank = 0; rank < providers.length; rank++) {
    const p = providers[rank];
    const started = Date.now();
    try {
      const res = await p.run(ctx);
      const obs = (res?.observations ?? []).map((o) => ({ ...o, rank }));
      observations.push(...obs);
      reports.push({ id: p.id, ok: true, observations: obs.length, ms: Date.now() - started, ...(res?.note ? { note: res.note } : {}) });
    } catch (err) {
      reports.push({ id: p.id, ok: false, error: String(err?.message ?? err).slice(0, 300), ms: Date.now() - started });
    }
  }
  return { observations, reports };
}

/**
 * Build the Redis payload. Throws when every provider failed so runSeed keeps
 * the last-good payload instead of replacing it with an empty one.
 */
export function buildPayload({ category, title, previous, observations, reports, nowMs, derive, deriveAll, siblings = {}, auxMetrics = [] }) {
  if (reports.length > 0 && reports.every((r) => !r.ok)) {
    throw new Error(`all providers failed: ${reports.map((r) => `${r.id}: ${r.error}`).join(' | ')}`);
  }
  const divisions = mergeObservations(previous?.divisions, observations, nowMs);
  if (typeof derive === 'function') {
    for (const rec of Object.values(divisions)) derive(rec, nowMs);
  }
  // Whole-table derivations (country totals, cross-category ratios) run after per-record ones.
  if (typeof deriveAll === 'function') deriveAll(divisions, nowMs, siblings);
  for (const rec of Object.values(divisions)) rec.status = deriveStatus(rec, auxMetrics);
  return {
    category,
    title,
    generatedAt: new Date(nowMs).toISOString(),
    divisionCount: DIVISION_COUNT,
    auxMetrics,
    coverage: summarizeCoverage(divisions),
    providers: reports,
    divisions,
  };
}

export function validatePayload(data) {
  return !!data && typeof data === 'object'
    && Object.keys(data.divisions || {}).length === DIVISION_COUNT
    && Array.isArray(data.providers);
}

/** Records that carry any data (what runSeed counts as records). */
export function declareRecords(data) {
  return Object.values(data?.divisions ?? {}).filter((d) => d.status !== 'no_source').length;
}

/** Add `<metric>_per_<n>` style derived metrics when both inputs exist and share scope. */
export function addRatio(record, { numerator, denominator, metric, unit, factor = 1, nowMs, note }) {
  const n = record.metrics[numerator];
  const d = record.metrics[denominator];
  if (!n || !d || n.scope !== 'division' || d.scope !== 'division') return;
  if (!(d.value > 0)) return;
  record.metrics[metric] = {
    value: (n.value / d.value) * factor,
    unit,
    year: n.year ?? null,
    source: `derived:${numerator}/${denominator}`,
    sourceUrl: null,
    scope: 'division',
    method: 'derived',
    ...(note ? { note } : {}),
    rank: 0,
    fetchedAt: nowMs,
  };
}

/**
 * Derive `<metric>_per_1000km2` for the given count metrics from a Wikidata
 * `area_km2` metric. Skipped unless the area's unit label says square kilometres,
 * so a hectare/m2 value is never silently misread. Stale derived values are
 * removed first so they cannot outlive their inputs.
 */
export function makeDensityDerive(countMetrics) {
  return function derive(rec, nowMs) {
    for (const m of countMetrics) delete rec.metrics[`${m}_per_1000km2`];
    const a = rec.metrics.area_km2;
    if (!a || a.scope !== 'division' || !/square kilomet|km/i.test(a.unit ?? '')) return;
    for (const m of countMetrics) {
      addRatio(rec, { numerator: m, denominator: 'area_km2', metric: `${m}_per_1000km2`, unit: 'per 1,000 km2', factor: 1000, nowMs, note: 'OSM count / Wikidata area' });
    }
  };
}

const familyOf = (o) => String(o.source ?? '').split(':')[0];

/**
 * Whole-table derive: each division's share (%) of the sum over ITS COUNTRY's listed divisions.
 * Written only for a country whose every listed division has the metric at division scope with the
 * same unit, source family and year - otherwise the sum would mix incomparable numbers.
 * `from` = { category?: sibling category slug, metric }.
 */
export function makeShareDeriveAll({ from, outMetric, note }) {
  return function deriveAll(divisions, nowMs, siblings = {}) {
    for (const rec of Object.values(divisions)) delete rec.metrics[outMetric];
    const src = from.category ? siblings[from.category]?.divisions : divisions;
    if (!src) return;
    for (const country of COUNTRIES) {
      const divs = DIVISIONS.filter((d) => d.country === country);
      const obs = divs.map((d) => src[d.id]?.metrics?.[from.metric]);
      if (obs.some((o) => !o || o.scope !== 'division' || !(o.value >= 0))) continue;
      const key = (o) => `${o.unit}|${familyOf(o)}|${o.year}`;
      if (new Set(obs.map(key)).size !== 1) continue;
      const total = obs.reduce((a, o) => a + o.value, 0);
      if (!(total > 0)) continue;
      divs.forEach((d, i) => {
        divisions[d.id].metrics[outMetric] = {
          value: (obs[i].value / total) * 100, unit: '% of listed divisions', year: obs[i].year ?? null,
          source: `derived:${from.category ?? 'self'}.${from.metric}`, sourceUrl: null, scope: 'division', method: 'derived',
          note, rank: 0, fetchedAt: nowMs,
        };
      });
    }
  };
}

/**
 * Whole-table derive: amount / population from a sibling category's payload (e.g. GRP / population).
 * Currency is taken from the unit label (EUR or USD only); million-scaled units are expanded.
 * Years may differ by at most one and both are disclosed in the note.
 */
export function makePerCapitaDeriveAll({ metric, sibling, siblingMetric, outMetric }) {
  return function deriveAll(divisions, nowMs, siblings = {}) {
    for (const rec of Object.values(divisions)) delete rec.metrics[outMetric];
    const pops = siblings[sibling]?.divisions;
    if (!pops) return;
    for (const d of DIVISIONS) {
      const a = divisions[d.id]?.metrics?.[metric];
      const p = pops[d.id]?.metrics?.[siblingMetric];
      if (!a || !p || a.scope !== 'division' || p.scope !== 'division' || !(p.value > 0)) continue;
      const cur = /EUR/i.test(a.unit ?? '') ? 'EUR' : /USD/i.test(a.unit ?? '') ? 'USD' : null;
      if (!cur) continue;
      if (a.year != null && p.year != null && Math.abs(Number(a.year) - Number(p.year)) > 1) continue;
      const mult = /million|MIO/i.test(a.unit) ? 1e6 : 1;
      divisions[d.id].metrics[outMetric] = {
        value: (a.value * mult) / p.value, unit: `${cur} per person`, year: a.year ?? null,
        source: `derived:${metric}/${sibling}.${siblingMetric}`, sourceUrl: null, scope: 'division', method: 'derived',
        note: `DERIVED: ${metric} (${a.year}) / population (${p.year}, ${p.source}); vintages may differ by a year`, rank: 0, fetchedAt: nowMs,
      };
    }
  };
}
