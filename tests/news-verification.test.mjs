// Unit coverage for the news-verification "verifier" component:
// scripts/_claim-verifier.mjs (prompt building + response parsing),
// scripts/_source-credibility.mjs (the feedback-loop math), and the
// server/_shared/source-credibility.ts mirror the MCP tool layer reads.
// Deliberately pure-function-only — no Redis, no LLM call, no MCP dispatch —
// so this stays fast and hermetic. End-to-end wiring (get_news_intelligence
// actually attaching these fields) is exercised indirectly by
// tests/mcp.test.mjs's existing 'get_news_intelligence enriches every top
// story with fail-closed source provenance' test continuing to pass with
// the new _cacheKeys/postFilter additions in place.

import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  VERIFICATION_VERDICTS,
  buildVerificationPrompt,
  parseVerificationResponse,
  verificationJoinKey,
} from '../scripts/_claim-verifier.mjs';
import {
  applyVerificationOutcome,
  getVerifiedTrackRecordAdjustment as getAdjustmentMjs,
} from '../scripts/_source-credibility.mjs';
import {
  getVerifiedTrackRecordAdjustment as getAdjustmentTs,
  parseSourceCredibilityStore,
  parseClaimVerificationRecord,
  verificationJoinKey as verificationJoinKeyTs,
} from '../server/_shared/source-credibility.ts';

describe('scripts/_claim-verifier.mjs', () => {
  it('parseVerificationResponse accepts well-formed JSON', () => {
    const parsed = parseVerificationResponse(
      '{"verdict":"true","confidence":0.9,"reasoning":"Matches official record."}',
    );
    assert.deepEqual(parsed, { verdict: 'true', confidence: 0.9, reasoning: 'Matches official record.' });
  });

  it('parseVerificationResponse strips a markdown code fence', () => {
    const parsed = parseVerificationResponse(
      '```json\n{"verdict":"false","confidence":0.7,"reasoning":"Contradicted by wire reports."}\n```',
    );
    assert.equal(parsed?.verdict, 'false');
  });

  it('parseVerificationResponse rejects an unknown verdict', () => {
    assert.equal(parseVerificationResponse('{"verdict":"mostly_true","confidence":0.5,"reasoning":"x"}'), null);
  });

  it('parseVerificationResponse rejects a response missing confidence', () => {
    assert.equal(parseVerificationResponse('{"verdict":"true","reasoning":"x"}'), null);
  });

  it('parseVerificationResponse rejects malformed JSON', () => {
    assert.equal(parseVerificationResponse('not json'), null);
  });

  it('parseVerificationResponse rejects a response missing reasoning', () => {
    assert.equal(parseVerificationResponse('{"verdict":"true","confidence":0.9}'), null);
  });

  it('parseVerificationResponse clamps out-of-range confidence into [0,1]', () => {
    const parsed = parseVerificationResponse('{"verdict":"true","confidence":1.5,"reasoning":"x"}');
    assert.equal(parsed.confidence, 1);
  });

  it('VERIFICATION_VERDICTS is exactly the five documented verdicts', () => {
    assert.deepEqual(
      [...VERIFICATION_VERDICTS].sort(),
      ['false', 'misleading', 'substantially_true', 'true', 'unverifiable'],
    );
  });

  it('buildVerificationPrompt includes the headline and source', () => {
    const { userPrompt } = buildVerificationPrompt({ primaryTitle: 'Test headline', primarySource: 'Reuters' });
    assert.ok(userPrompt.includes('Test headline'));
    assert.ok(userPrompt.includes('Reuters'));
  });

  it('buildVerificationPrompt includes up to 4 corroborating headlines, excluding the primary', () => {
    const { userPrompt } = buildVerificationPrompt({
      primaryTitle: 'Main headline',
      primarySource: 'AP News',
      memberTitles: [
        'Main headline', 'Corroborating one', 'Corroborating two',
        'Corroborating three', 'Corroborating four', 'Corroborating five',
      ],
    });
    assert.ok(userPrompt.includes('Corroborating one'));
    assert.ok(userPrompt.includes('Corroborating four'));
    assert.ok(!userPrompt.includes('Corroborating five'));
  });

  it('verificationJoinKey normalizes case and whitespace', () => {
    assert.equal(
      verificationJoinKey('Reuters', '  Big   Story  '),
      verificationJoinKey('reuters', 'big story'),
    );
  });
});

describe('scripts/_source-credibility.mjs', () => {
  it('applyVerificationOutcome is pure — does not mutate the input store', () => {
    const store = {};
    const next = applyVerificationOutcome(store, 'Reuters', 'true', 0.9);
    assert.deepEqual(store, {});
    assert.ok(next.Reuters);
  });

  it('getVerifiedTrackRecordAdjustment returns 0 below the minimum sample count', () => {
    const store = applyVerificationOutcome({}, 'New Outlet', 'false', 0.9);
    assert.equal(getAdjustmentMjs(store['New Outlet']), 0);
  });

  it('getVerifiedTrackRecordAdjustment returns 0 for an unknown source', () => {
    assert.equal(getAdjustmentMjs(undefined), 0);
  });

  it('a source with a consistently false track record gets a bounded negative adjustment', () => {
    let store = {};
    for (let i = 0; i < 6; i += 1) store = applyVerificationOutcome(store, 'Bad Outlet', 'false', 0.95);
    const adjustment = getAdjustmentMjs(store['Bad Outlet']);
    assert.ok(adjustment < 0, `expected a negative adjustment, got ${adjustment}`);
    assert.ok(adjustment >= -20, `adjustment must stay within the documented [-20,10] bound, got ${adjustment}`);
  });

  it('a source with a consistently true track record gets a bounded positive adjustment', () => {
    let store = {};
    for (let i = 0; i < 6; i += 1) store = applyVerificationOutcome(store, 'Good Outlet', 'true', 0.95);
    const adjustment = getAdjustmentMjs(store['Good Outlet']);
    assert.ok(adjustment > 0, `expected a positive adjustment, got ${adjustment}`);
    assert.ok(adjustment <= 10, `adjustment must stay within the documented [-20,10] bound, got ${adjustment}`);
  });

  it('a low-confidence outcome moves the score less than a high-confidence one', () => {
    const lowConfidence = applyVerificationOutcome({ X: { score: 100, sampleCount: 5, verdictCounts: {}, lastVerdict: null, lastConfidence: null, lastUpdatedAt: null } }, 'X', 'false', 0.1);
    const highConfidence = applyVerificationOutcome({ X: { score: 100, sampleCount: 5, verdictCounts: {}, lastVerdict: null, lastConfidence: null, lastUpdatedAt: null } }, 'X', 'false', 0.9);
    assert.ok(lowConfidence.X.score > highConfidence.X.score);
  });
});

describe('server/_shared/source-credibility.ts <-> scripts/_source-credibility.mjs parity', () => {
  it('getVerifiedTrackRecordAdjustment agrees between the .mjs and .ts copies for the same entry', () => {
    let store = {};
    const verdicts = ['misleading', 'substantially_true', 'true', 'misleading', 'true', 'false'];
    for (const verdict of verdicts) store = applyVerificationOutcome(store, 'Parity Outlet', verdict, 0.8);
    const entry = store['Parity Outlet'];
    assert.equal(getAdjustmentTs(entry), getAdjustmentMjs(entry));
  });

  it('parity holds across the whole score range, not just one sample path', () => {
    for (const verdict of VERIFICATION_VERDICTS) {
      let store = {};
      for (let i = 0; i < 8; i += 1) store = applyVerificationOutcome(store, 'Sweep', verdict, 0.5 + i * 0.05);
      const entry = store.Sweep;
      assert.equal(
        getAdjustmentTs(entry), getAdjustmentMjs(entry),
        `mismatch for an all-"${verdict}" track record: ts=${getAdjustmentTs(entry)} mjs=${getAdjustmentMjs(entry)}`,
      );
    }
  });

  it('parseSourceCredibilityStore round-trips a store produced by applyVerificationOutcome', () => {
    const store = applyVerificationOutcome({}, 'Round Trip Outlet', 'true', 0.9);
    const parsed = parseSourceCredibilityStore(store);
    assert.equal(parsed['Round Trip Outlet'].score, store['Round Trip Outlet'].score);
    assert.equal(parsed['Round Trip Outlet'].sampleCount, 1);
  });

  it('parseSourceCredibilityStore degrades to {} on malformed input rather than throwing', () => {
    assert.deepEqual(parseSourceCredibilityStore(null), {});
    assert.deepEqual(parseSourceCredibilityStore('not an object'), {});
    assert.deepEqual(parseSourceCredibilityStore([1, 2, 3]), {});
  });

  it('parseClaimVerificationRecord accepts a well-formed record and rejects malformed ones', () => {
    assert.deepEqual(
      parseClaimVerificationRecord({
        verdict: 'true', confidence: 0.8, reasoning: 'x', verifiedAt: '2026-01-01T00:00:00.000Z',
      }),
      { verdict: 'true', confidence: 0.8, reasoning: 'x', verifiedAt: '2026-01-01T00:00:00.000Z' },
    );
    assert.equal(parseClaimVerificationRecord({ verdict: 'not-a-verdict' }), null);
    assert.equal(parseClaimVerificationRecord(null), null);
    assert.equal(parseClaimVerificationRecord({ verdict: 'true', confidence: 0.8 }), null); // missing reasoning/verifiedAt
  });

  it('verificationJoinKey is identical between the .mjs and .ts copies', () => {
    assert.equal(verificationJoinKeyTs('Reuters', 'A Story'), verificationJoinKey('Reuters', 'A Story'));
    assert.equal(verificationJoinKeyTs('  REUTERS  ', 'a   story'), verificationJoinKey('reuters', 'A STORY'));
  });
});
