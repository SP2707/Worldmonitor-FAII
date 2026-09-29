#!/usr/bin/env node
//
// The "verifier" component: an LLM-based claim-verification pass over the
// stories seed-insights.mjs already published to news:insights:v1. Runs as
// its own seed script (own lock, own tier-config cadence) rather than being
// folded into seed-insights.mjs's own pipeline, deliberately:
//   - seed-insights.mjs already has a complex, heavily-tested run/LKG/
//     freshness contract (runSeed's contract mode) built around ONE
//     canonical payload; bolting a second LLM pass with its own cost/latency
//     profile onto that same run risks that contract, for no benefit — this
//     script's own failures cannot affect news:insights:v1's freshness.
//   - LLM verification is comparatively expensive and doesn't need to run on
//     news:insights:v1's own refresh cadence (~15min); a separate tier-config
//     entry lets it run less often (see scripts/seed-tiers.config.json).
//   - It reuses seed-insights.mjs's own `callLLM` (provider chain, retries,
//     budget, telemetry) rather than re-implementing any of that — see the
//     import below. See scripts/_claim-verifier.mjs's header for the one
//     caveat this reuse carries: callLLM's telemetry stage is hardcoded to
//     'seed-insights' in that file, so calls from here are not yet
//     separately labeled in llm_call telemetry.
//
// Publishes news:verification:v1 — a per-headline verdict map, joined onto
// news:insights:v1's topStories at MCP-serve time by
// api/mcp/registry/cache-tools.ts (addNewsSourceProvenance's sibling,
// attachClaimVerification), NOT by rewriting news:insights:v1 itself. Also
// updates source:credibility:v1 (scripts/_source-credibility.mjs) as a
// side effect of each successful verification — the feedback-loop half of
// this work: a source's verified track record nudges its FUTURE
// credibilityScore, on top of (never replacing) the static
// tier/propaganda-risk prior in shared/news-credibility.js.

import {
  loadEnvFile,
  runSeed,
  readCanonicalValue,
  writeExtraKey,
} from './_seed-utils.mjs';
import { callLLM } from './seed-insights.mjs';
import {
  buildVerificationPrompt,
  parseVerificationResponse,
  verificationJoinKey,
} from './_claim-verifier.mjs';
import {
  SOURCE_CREDIBILITY_KEY,
  SOURCE_CREDIBILITY_TTL,
  applyVerificationOutcome,
} from './_source-credibility.mjs';

loadEnvFile(import.meta.url);

const VERIFICATION_KEY = 'news:verification:v1';
const VERIFICATION_TTL = 60 * 60 * 24 * 14; // 14 days — well past the re-verify window below
const DEFAULT_MAX_PER_RUN = 12; // bounds LLM cost/latency per run, not a quality judgment
const DEFAULT_REVERIFY_AFTER_HOURS = 24;
const CALL_BUDGET_MS_PER_STORY = 20_000;
// Health/freshness ceiling for this key: default re-verify window (24h) plus
// a full extra day of grace, so an occasional missed run doesn't alarm.
// Fixed, not derived from the env-configurable knobs below — those tune
// operator cost/cadence, this is a design decision about when to alarm.
const FRESHNESS_MAX_STALE_MIN = 1680;

function envInt(name, fallback, min) {
  const raw = Number(process.env[name]);
  return Number.isFinite(raw) ? Math.max(min, Math.floor(raw)) : fallback;
}

const MAX_PER_RUN = envInt('NEWS_VERIFICATION_MAX_PER_RUN', DEFAULT_MAX_PER_RUN, 0);
const REVERIFY_AFTER_MS = envInt(
  'NEWS_VERIFICATION_REVERIFY_AFTER_HOURS',
  DEFAULT_REVERIFY_AFTER_HOURS,
  1,
) * 60 * 60 * 1000;

function needsVerification(existing, nowMs) {
  if (!existing || typeof existing !== 'object') return true;
  const verifiedAtMs = Date.parse(existing.verifiedAt ?? '');
  if (!Number.isFinite(verifiedAtMs)) return true;
  return nowMs - verifiedAtMs > REVERIFY_AFTER_MS;
}

function importanceOf(story) {
  const score = Number(
    story?.effectiveImportanceScore ?? story?.importanceScore ?? story?.upstreamImportanceScore,
  );
  return Number.isFinite(score) ? score : 0;
}

async function verifyOneStory(story) {
  const { systemPrompt, userPrompt } = buildVerificationPrompt(story);
  let parsed = null;
  // NOTE: `stage` is not threaded through to this file's callLLM (see the
  // module header) — telemetry from this call shows up tagged
  // stage: 'seed-insights', not a distinct 'news-verification' stage.
  const result = await callLLM(null, {
    systemPrompt,
    userPrompt,
    maxTokens: 180,
    callBudgetMs: CALL_BUDGET_MS_PER_STORY,
    accept: (text) => {
      parsed = parseVerificationResponse(text);
      return parsed !== null;
    },
  });
  if (!result || !parsed) return null;
  return { ...parsed, model: result.model, provider: result.provider };
}

async function fetchVerifications() {
  const insights = await readCanonicalValue('news:insights:v1');
  const topStories = Array.isArray(insights?.topStories) ? insights.topStories : [];
  if (topStories.length === 0) {
    console.log('  news:insights:v1 has no topStories yet — nothing to verify this run');
    return {};
  }

  const existingVerifications = (await readCanonicalValue(VERIFICATION_KEY)) || {};
  const nowMs = Date.now();

  const candidates = topStories
    .filter((story) => story && typeof story === 'object'
      && typeof story.primaryTitle === 'string' && story.primaryTitle.trim())
    .map((story) => ({ story, joinKey: verificationJoinKey(story.primarySource, story.primaryTitle) }))
    .filter(({ joinKey }) => needsVerification(existingVerifications[joinKey], nowMs))
    .sort((a, b) => importanceOf(b.story) - importanceOf(a.story))
    .slice(0, MAX_PER_RUN);

  console.log(`  ${topStories.length} topStories, ${candidates.length} selected for verification (cap ${MAX_PER_RUN})`);

  if (candidates.length === 0) return existingVerifications;

  const nextVerifications = { ...existingVerifications };
  let credibilityStore = (await readCanonicalValue(SOURCE_CREDIBILITY_KEY)) || {};
  let verifiedCount = 0;
  let failedCount = 0;

  for (const { story, joinKey } of candidates) {
    try {
      const outcome = await verifyOneStory(story);
      if (!outcome) {
        failedCount += 1;
        console.warn(`  SKIP (no usable LLM verdict): "${String(story.primaryTitle).slice(0, 80)}"`);
        continue;
      }
      nextVerifications[joinKey] = {
        verdict: outcome.verdict,
        confidence: outcome.confidence,
        reasoning: outcome.reasoning,
        model: outcome.model,
        provider: outcome.provider,
        verifiedAt: new Date(nowMs).toISOString(),
      };
      const sourceName = typeof story.primarySource === 'string' ? story.primarySource.trim() : '';
      if (sourceName) {
        credibilityStore = applyVerificationOutcome(
          credibilityStore, sourceName, outcome.verdict, outcome.confidence, nowMs,
        );
      }
      verifiedCount += 1;
      console.log(`  ${outcome.verdict} (${outcome.confidence.toFixed(2)}) via ${outcome.provider}: "${String(story.primaryTitle).slice(0, 80)}"`);
    } catch (err) {
      failedCount += 1;
      console.warn(`  FAILED "${String(story.primaryTitle).slice(0, 80)}": ${err.message}`);
    }
  }

  console.log(`  verified ${verifiedCount}, failed/skipped ${failedCount}`);

  // Only write the credibility store when at least one outcome landed —
  // an all-failed run (e.g. no LLM provider configured) must not touch it.
  if (verifiedCount > 0) {
    await writeExtraKey(SOURCE_CREDIBILITY_KEY, credibilityStore, SOURCE_CREDIBILITY_TTL);
  }

  return nextVerifications;
}

export function declareRecords(data) {
  return data && typeof data === 'object' && !Array.isArray(data) ? Object.keys(data).length : 0;
}

if (process.argv[1]?.endsWith('seed-news-verification.mjs')) {
  runSeed('news', 'verification', VERIFICATION_KEY, fetchVerifications, {
    ttlSeconds: VERIFICATION_TTL,
    validateFn: (data) => data !== null && typeof data === 'object' && !Array.isArray(data),
    recordCount: declareRecords,
    declareRecords,
    sourceVersion: 'claim-verifier-v1',
    schemaVersion: 1,
    maxStaleMin: FRESHNESS_MAX_STALE_MIN,
    zeroIsValid: true,
  }).catch((err) => { console.error('FATAL:', err.message || err); process.exit(1); });
}
