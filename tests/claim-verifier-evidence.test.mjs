// Evidence grounding for scripts/_claim-verifier.mjs: pure functions only, no network.
import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  NO_EVIDENCE_CONFIDENCE_CAP,
  applyEvidenceBasis,
  buildEvidenceQuery,
  buildVerificationPrompt,
  gatherEvidence,
} from '../scripts/_claim-verifier.mjs';
import { parseClaimVerificationRecord } from '../server/_shared/source-credibility.ts';

const story = { primaryTitle: 'Port X closed after explosion', primarySource: 'Example News', pubDate: '2026-10-01' };
const ok = (results) => async () => ({ ok: true, provider: 'test', query: 'q', results });
const hit = (url, snippet = 'Port X was closed.') => ({ title: 't', url, snippet, publishedAt: null, source: 'test' });

describe('evidence retrieval', () => {
  it('queries with the headline only (not the outlet)', () => {
    assert.equal(buildEvidenceQuery(story), 'Port X closed after explosion');
  });

  it('returns [] when search is missing, fails, throws, or is unconfigured', async () => {
    assert.deepEqual(await gatherEvidence(story, undefined), []);
    assert.deepEqual(await gatherEvidence(story, async () => ({ ok: false, reason: 'not_configured' })), []);
    assert.deepEqual(await gatherEvidence(story, async () => { throw new Error('boom'); }), []);
  });

  it("drops the claim's own outlet and duplicate hosts, and caps at 4", async () => {
    const ev = await gatherEvidence(story, ok([
      hit('https://www.examplenews.com/a'),
      hit('https://reuters.com/a'),
      hit('https://reuters.com/b'),
      hit('https://bbc.com/a'),
      hit('https://apnews.com/a'),
      hit('https://dw.com/a'),
      hit('https://france24.com/a'),
    ]));
    assert.deepEqual(ev.map((e) => e.url), [
      'https://reuters.com/a', 'https://bbc.com/a', 'https://apnews.com/a', 'https://dw.com/a',
    ]);
  });

  it('skips results with empty snippets', async () => {
    assert.deepEqual(await gatherEvidence(story, ok([hit('https://reuters.com/a', '  ')])), []);
  });
});

describe('prompt', () => {
  it('includes an evidence section only when evidence exists', () => {
    const none = buildVerificationPrompt(story).userPrompt;
    assert.ok(!none.includes('Independent evidence'));
    const withEv = buildVerificationPrompt({ ...story, evidence: [hit('https://reuters.com/a')] }).userPrompt;
    assert.ok(withEv.includes('Independent evidence'));
    assert.ok(withEv.includes('https://reuters.com/a'));
  });
});

describe('applyEvidenceBasis', () => {
  const parsed = { verdict: 'true', confidence: 0.95, reasoning: 'Matches.' };

  it('caps confidence and flags evidenceBased:false with no evidence', () => {
    const r = applyEvidenceBasis(parsed, []);
    assert.equal(r.confidence, NO_EVIDENCE_CONFIDENCE_CAP);
    assert.equal(r.evidenceBased, false);
    assert.deepEqual(r.evidence, []);
  });

  it('keeps confidence and records sources when evidence exists', () => {
    const r = applyEvidenceBasis(parsed, [hit('https://reuters.com/a')]);
    assert.equal(r.confidence, 0.95);
    assert.equal(r.evidenceBased, true);
    assert.deepEqual(r.evidence, [{ title: 't', url: 'https://reuters.com/a' }]);
  });

  it('never raises a low confidence', () => {
    assert.equal(applyEvidenceBasis({ ...parsed, confidence: 0.2 }, []).confidence, 0.2);
  });
});

describe('MCP-side record parsing', () => {
  const base = { verdict: 'true', confidence: 0.8, reasoning: 'r', verifiedAt: '2026-10-01T00:00:00Z' };

  it('reads legacy records (no evidence fields) as evidenceBased:false', () => {
    const r = parseClaimVerificationRecord(base);
    assert.equal(r.evidenceBased, false);
    assert.deepEqual(r.evidence, []);
  });

  it('does not trust evidenceBased:true without sources', () => {
    assert.equal(parseClaimVerificationRecord({ ...base, evidenceBased: true }).evidenceBased, false);
  });

  it('passes evidence through', () => {
    const r = parseClaimVerificationRecord({ ...base, evidenceBased: true, evidence: [{ title: 'a', url: 'https://x.test' }] });
    assert.equal(r.evidenceBased, true);
    assert.equal(r.evidence[0].url, 'https://x.test');
  });
});
