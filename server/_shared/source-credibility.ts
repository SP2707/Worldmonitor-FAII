/**
 * TS mirror of scripts/_source-credibility.mjs's READ + blend side, for
 * api/mcp/registry/cache-tools.ts (which cannot import a .mjs script file).
 * The WRITE side (applyVerificationOutcome) only ever runs from
 * scripts/seed-news-verification.mjs via the .mjs copy — this file never
 * writes source:credibility:v1, only reads and blends it into a served
 * response.
 *
 * getVerifiedTrackRecordAdjustment here MUST compute byte-identical output
 * to the .mjs copy for the same input — see
 * tests/source-credibility-parity.test.mjs, which calls both from a Node
 * test and asserts parity. Unlike shared/source-tiers.json (a single JSON
 * file both runtimes import), this pair has no shared source file — one
 * side is TS consumed by an edge-safe MCP tool, the other is a plain-JS
 * seed script that cannot import .ts — so parity is enforced by test, not
 * by construction. Change both together, and update that test's fixtures
 * if the formula changes.
 *
 * verificationJoinKey mirrors scripts/_claim-verifier.mjs's copy exactly —
 * see that file's header comment for why this is a plain normalized string
 * rather than a hash (this module's caller, cache-tools.ts's synchronous
 * _postFilter chain, has no async hashing available to it).
 */

export const SOURCE_CREDIBILITY_KEY = 'source:credibility:v1';

export type VerificationVerdict = 'true' | 'substantially_true' | 'false' | 'misleading' | 'unverifiable';

export interface SourceCredibilityEntry {
  score: number | null;
  sampleCount: number;
  verdictCounts: Partial<Record<VerificationVerdict, number>>;
  lastVerdict: VerificationVerdict | null;
  lastConfidence: number | null;
  lastUpdatedAt: string | null;
}

export type SourceCredibilityStore = Record<string, SourceCredibilityEntry>;

// Keep numerically identical to scripts/_source-credibility.mjs's
// MIN_SAMPLES_FOR_ADJUSTMENT / VERDICT_SCORE breakpoint (50).
export const MIN_SAMPLES_FOR_ADJUSTMENT = 3;

/**
 * See scripts/_source-credibility.mjs's getVerifiedTrackRecordAdjustment for
 * the full rationale (asymmetric bound, EWMA neutral point at 50). Returns 0
 * (no-op) until a source has at least MIN_SAMPLES_FOR_ADJUSTMENT verified
 * outcomes.
 */
export function getVerifiedTrackRecordAdjustment(entry: SourceCredibilityEntry | undefined): number {
  if (!entry || entry.score === null || entry.sampleCount < MIN_SAMPLES_FOR_ADJUSTMENT) return 0;
  if (entry.score >= 50) {
    return Math.round(((entry.score - 50) / 50) * 10);
  }
  return Math.round(((entry.score - 50) / 50) * 20);
}

const VALID_VERDICTS = new Set<VerificationVerdict>([
  'true', 'substantially_true', 'false', 'misleading', 'unverifiable',
]);

/**
 * Defensive parse of the raw JSON blob read from source:credibility:v1 (via
 * the tool's _cacheKeys). Never throws — an unreadable or malformed store
 * degrades to "no adjustment for anyone" rather than a tool failure, the
 * same degrade-open behavior addNewsSourceProvenance already uses for bad
 * per-story input in this same file.
 */
export function parseSourceCredibilityStore(raw: unknown): SourceCredibilityStore {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out: SourceCredibilityStore = {};
  for (const [source, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
    const v = value as Record<string, unknown>;
    const score = typeof v.score === 'number' && Number.isFinite(v.score) ? v.score : null;
    const sampleCount = typeof v.sampleCount === 'number' && Number.isFinite(v.sampleCount) ? v.sampleCount : 0;
    const lastVerdict = typeof v.lastVerdict === 'string' && VALID_VERDICTS.has(v.lastVerdict as VerificationVerdict)
      ? (v.lastVerdict as VerificationVerdict)
      : null;
    out[source] = {
      score,
      sampleCount,
      verdictCounts: (v.verdictCounts && typeof v.verdictCounts === 'object' && !Array.isArray(v.verdictCounts)
        ? v.verdictCounts as Partial<Record<VerificationVerdict, number>>
        : {}),
      lastVerdict,
      lastConfidence: typeof v.lastConfidence === 'number' && Number.isFinite(v.lastConfidence) ? v.lastConfidence : null,
      lastUpdatedAt: typeof v.lastUpdatedAt === 'string' ? v.lastUpdatedAt : null,
    };
  }
  return out;
}

/**
 * Join key for news:verification:v1 records — per HEADLINE, not per source
 * (this file's own store above is per SOURCE; different key space). MUST
 * match scripts/_claim-verifier.mjs's verificationJoinKey exactly — a plain
 * normalized string, not a hash, so the two copies are eyeball-verifiable
 * for parity rather than depending on identical hash-algorithm output.
 */
export function verificationJoinKey(source: unknown, title: unknown): string {
  const s = String(source ?? '').trim().toLowerCase();
  const t = String(title ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  return `${s}||${t}`;
}

export interface ClaimVerificationRecord {
  verdict: VerificationVerdict;
  confidence: number;
  reasoning: string;
  verifiedAt: string;
}

const VALID_VERIFICATION_KEYS: ReadonlySet<string> = new Set(['verdict', 'confidence', 'reasoning', 'verifiedAt']);

/**
 * Defensive parse of one news:verification:v1 entry. Never throws.
 */
export function parseClaimVerificationRecord(raw: unknown): ClaimVerificationRecord | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const v = raw as Record<string, unknown>;
  const verdict = typeof v.verdict === 'string' && VALID_VERDICTS.has(v.verdict as VerificationVerdict)
    ? (v.verdict as VerificationVerdict)
    : null;
  if (!verdict) return null;
  const confidence = typeof v.confidence === 'number' && Number.isFinite(v.confidence)
    ? Math.min(1, Math.max(0, v.confidence))
    : null;
  if (confidence === null) return null;
  const reasoning = typeof v.reasoning === 'string' ? v.reasoning.trim() : '';
  if (!reasoning) return null;
  const verifiedAt = typeof v.verifiedAt === 'string' ? v.verifiedAt : null;
  if (!verifiedAt) return null;
  void VALID_VERIFICATION_KEYS; // documents the expected shape; not enforced strictly (forward-compatible with extra fields)
  return { verdict, confidence, reasoning, verifiedAt };
}
