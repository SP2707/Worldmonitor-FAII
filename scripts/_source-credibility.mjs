// Dynamic, feedback-loop credibility overlay for news sources — the second
// half of the "verifier" component (scripts/seed-news-verification.mjs is
// the first half, doing the actual per-claim LLM verification).
//
// Static credibility (shared/news-credibility.js's computeCredibilityScore,
// server/_shared/source-tiers.ts's SOURCE_TIERS) is an editorially-curated
// PRIOR that never changes on its own — a source's tier/propaganda-risk
// classification is a manual judgment call, reviewed occasionally, not
// derived from outcomes. This module is the POSTERIOR: it tracks, per
// source, how that source's claims have actually verified over time, and
// lets that history nudge future credibility scoring — without touching the
// pure, edge-safe computeCredibilityScore formula itself. See that file's
// header: "Pure function... stays safe on the Vercel edge bundle and in
// Node tests" — this module is Node-only (reads/writes Redis over HTTP) and
// stays entirely on the CALLER's side of that boundary: it produces a
// number, the caller (api/mcp/registry/cache-tools.ts) adds it to
// computeCredibilityScore's output, computeCredibilityScore itself is
// unmodified.
//
// Persisted as ONE JSON blob (source:credibility:v1), like every other
// canonical key in this codebase — not a Redis hash-per-field — so it reads
// through the same envelope/readCanonicalValue path as everything else and
// needs no new Redis command shape.
//
// TS MIRROR: server/_shared/source-credibility.ts re-implements the READ +
// blend side (getVerifiedTrackRecordAdjustment, verificationJoinKey) for
// api/mcp/registry/cache-tools.ts, which cannot import this .mjs file. Keep
// getVerifiedTrackRecordAdjustment's math identical between the two copies —
// tests/source-credibility-parity.test.mjs asserts they produce the same
// adjustment for the same input, since (unlike shared/source-tiers.json,
// which both runtimes import directly) there is no single shared source file
// for this pair: the write path (applyVerificationOutcome below) only ever
// runs from this script, so the .ts copy never needs it.

export const SOURCE_CREDIBILITY_KEY = 'source:credibility:v1';
export const SOURCE_CREDIBILITY_TTL = 60 * 60 * 24 * 90; // 90 days — outlives any realistic re-verify gap

// EWMA smoothing for the running per-source score. Lower alpha = slower to
// move, harder for one bad (or one lucky) verification to swing a source's
// score on its own.
const EWMA_ALPHA = 0.2;
// Don't let a source's very first sample or two move anything — three
// independent verified claims is the minimum before this overlay trusts its
// own signal over "no adjustment."
const MIN_SAMPLES_FOR_ADJUSTMENT = 3;

// Per-verdict score on the same 0-100 scale computeCredibilityScore outputs.
const VERDICT_SCORE = Object.freeze({
  true: 100,
  substantially_true: 80,
  // Slightly below neutral (50): a source that racks up a lot of
  // "unverifiable" claims (vague, unattributed, unfalsifiable framing) is a
  // weak signal against it, not neutral information.
  unverifiable: 45,
  misleading: 20,
  false: 0,
});

function emptyEntry() {
  return {
    score: null, // null until MIN_SAMPLES_FOR_ADJUSTMENT reached — no adjustment yet
    sampleCount: 0,
    verdictCounts: { true: 0, substantially_true: 0, false: 0, misleading: 0, unverifiable: 0 },
    lastVerdict: null,
    lastConfidence: null,
    lastUpdatedAt: null,
  };
}

/**
 * Pure — returns a NEW store (does not mutate `store`) with `source`'s entry
 * updated for one verification outcome. Confidence dampens how much this
 * single outcome moves the EWMA: a low-confidence "false" moves the score
 * less than a high-confidence one, so one shaky LLM call cannot swing a
 * source's history as hard as a confident one.
 * @param {Record<string, ReturnType<typeof emptyEntry>>} store
 * @param {string} source
 * @param {'true'|'substantially_true'|'false'|'misleading'|'unverifiable'} verdict
 * @param {number} confidence 0-1
 * @param {number} [nowMs]
 * @returns {Record<string, ReturnType<typeof emptyEntry>>}
 */
export function applyVerificationOutcome(store, source, verdict, confidence, nowMs = Date.now()) {
  const key = String(source ?? '').trim();
  if (!key || !(verdict in VERDICT_SCORE)) return store;
  const safeConfidence = Number.isFinite(confidence) ? Math.min(1, Math.max(0, confidence)) : 0.5;

  const next = { ...(store || {}) };
  const prior = next[key]
    ? { ...next[key], verdictCounts: { ...next[key].verdictCounts } }
    : emptyEntry();

  const sampleScore = VERDICT_SCORE[verdict];
  const effectiveAlpha = EWMA_ALPHA * safeConfidence;
  prior.score = prior.score === null
    ? sampleScore
    : Math.round(prior.score * (1 - effectiveAlpha) + sampleScore * effectiveAlpha);
  prior.sampleCount += 1;
  prior.verdictCounts[verdict] = (prior.verdictCounts[verdict] ?? 0) + 1;
  prior.lastVerdict = verdict;
  prior.lastConfidence = safeConfidence;
  prior.lastUpdatedAt = new Date(nowMs).toISOString();

  next[key] = prior;
  return next;
}

/**
 * The blend applied on top of computeCredibilityScore's static output.
 * Returns 0 (no-op) until a source has enough verified samples to trust, and
 * is bounded so one source's history can never override the static
 * tier/propaganda-risk signal outright — it nudges, it does not replace.
 * Asymmetric on purpose: a proven-bad source is pulled down harder (-20 max)
 * than a proven-good one is pushed up (+10 max), since the static formula's
 * tier/corroboration weights already reward good sources — this overlay's
 * main job is catching drift downward that the static prior missed.
 *
 * MUST match server/_shared/source-credibility.ts's
 * getVerifiedTrackRecordAdjustment exactly — see
 * tests/source-credibility-parity.test.mjs.
 * @param {ReturnType<typeof emptyEntry> | undefined} entry
 * @returns {number} integer in [-20, 10]
 */
export function getVerifiedTrackRecordAdjustment(entry) {
  if (!entry || entry.score === null || entry.sampleCount < MIN_SAMPLES_FOR_ADJUSTMENT) return 0;
  if (entry.score >= 50) {
    return Math.round(((entry.score - 50) / 50) * 10);
  }
  return Math.round(((entry.score - 50) / 50) * 20);
}
