// Claim-verification prompt + response parsing for the news-verification
// seed pass (scripts/seed-news-verification.mjs). Deliberately split from
// the LLM-calling mechanics (callLLM, imported from ./seed-insights.mjs) so
// prompt construction and response parsing stay unit-testable without a
// network call, and so the mechanics themselves — provider chain, retries,
// budget, telemetry — are never duplicated (single implementation lives in
// seed-insights.mjs, already exported as `callLLM`).
//
// Scope: this classifies the claim carried by a headline using the same
// signal set list-feed-digest.ts's classifyOpinion/classifyFeelGood already
// rely on (title, source, corroborating headlines, publish date) plus the
// insights clustering pipeline's corroboration breadth. It does not fetch
// external evidence — the model's own knowledge is the only fact-check
// source, so a verdict here is a second, independent signal alongside
// sourceTier/propagandaRisk/corroboration, not a ground-truth oracle. Every
// verdict carries a `reasoning` string a caller can weigh — matching this
// fork's "-32003 over fake success" honesty principle
// (api/mcp/source-unavailable.ts): an unreviewable verdict is worse than no
// verdict.

export const VERIFICATION_VERDICTS = Object.freeze([
  'true',
  'substantially_true',
  'false',
  'misleading',
  'unverifiable',
]);

const VERDICT_SET = new Set(VERIFICATION_VERDICTS);

const SYSTEM_PROMPT = `You are a careful fact-checking analyst. You are given a news headline (and sometimes related corroborating headlines from other outlets) and must classify the CENTRAL FACTUAL CLAIM the headline makes.

Verdicts (choose exactly one):
- "true": the claim is accurate and not misleading.
- "substantially_true": the core claim is accurate but a detail is imprecise, unconfirmed, or oversimplified.
- "false": the claim is factually incorrect.
- "misleading": the claim uses technically-true facts framed to imply something false or unsupported.
- "unverifiable": there is not enough information (in the headline or your knowledge) to judge — this is the correct answer when you are unsure, NOT a guess.

Respond with ONLY a single JSON object, no prose before or after, no markdown code fence:
{"verdict": "<one of the five above>", "confidence": <number 0-1>, "reasoning": "<one sentence, under 200 characters, stating WHY>"}

Be conservative: prefer "unverifiable" over a confident-sounding guess. "confidence" reflects how sure you are of the VERDICT, not how important the story is.`;

function truncate(text, max) {
  const s = String(text ?? '').trim();
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

/**
 * @param {{ primaryTitle?: string, primarySource?: string, memberTitles?: string[], pubDate?: string }} story
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
export function buildVerificationPrompt(story) {
  const title = truncate(story?.primaryTitle, 400);
  const source = truncate(story?.primarySource, 120);
  const pubDate = truncate(story?.pubDate, 60);
  const corroborating = Array.isArray(story?.memberTitles)
    ? story.memberTitles
      .filter((t) => typeof t === 'string' && t.trim() && t.trim() !== title)
      .slice(0, 4)
    : [];

  const lines = [
    `Headline: "${title}"`,
    source ? `Reported by: ${source}` : null,
    pubDate ? `Published: ${pubDate}` : null,
    corroborating.length > 0
      ? `Also reported (other outlets, may corroborate or add nuance):\n${corroborating.map((t) => `- "${truncate(t, 300)}"`).join('\n')}`
      : null,
  ].filter(Boolean);

  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: lines.join('\n'),
  };
}

/**
 * Strict parse + validate. Returns null (never throws) on anything
 * malformed — safe to use directly as callLLM's `accept` gate, so malformed
 * output makes callLLM try the next provider rather than accept garbage.
 * @param {string} text
 * @returns {{ verdict: string, confidence: number, reasoning: string } | null}
 */
export function parseVerificationResponse(text) {
  if (typeof text !== 'string') return null;
  // Providers occasionally wrap JSON in a code fence despite the instruction
  // not to; strip one if present before parsing rather than rejecting outright.
  const cleaned = text.trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  const verdict = typeof parsed.verdict === 'string' ? parsed.verdict.trim().toLowerCase() : '';
  if (!VERDICT_SET.has(verdict)) return null;
  const confidenceRaw = Number(parsed.confidence);
  if (!Number.isFinite(confidenceRaw)) return null;
  const confidence = Math.min(1, Math.max(0, confidenceRaw));
  const reasoning = truncate(parsed.reasoning, 240);
  if (!reasoning) return null;
  return { verdict, confidence, reasoning };
}

/**
 * Join key for news:verification:v1 records — per HEADLINE, not per source
 * (server/_shared/source-credibility.ts's store is per SOURCE; this is a
 * different key space). Deliberately a plain normalized string, not a hash:
 * this codebase's other hashers (server/_shared/hash.ts's sha256Hex,
 * mcp-internal-hmac.ts's sha256Hex) are async Web-Crypto based for edge
 * safety, and threading an async join key through api/mcp/registry's
 * synchronous _postFilter chain (addNewsSourceProvenance, mapNested,
 * narrowNested — none of them async) would be a bigger change than the join
 * key needs. A plain string is trivial to keep byte-identical between this
 * file and server/_shared/source-credibility.ts's copy — eyeball-verifiable,
 * unlike a hash algorithm — see tests/source-credibility-parity.test.mjs.
 * @param {string} source
 * @param {string} title
 * @returns {string}
 */
export function verificationJoinKey(source, title) {
  const s = String(source ?? '').trim().toLowerCase();
  const t = String(title ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  return `${s}||${t}`;
}
