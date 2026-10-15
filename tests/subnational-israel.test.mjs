import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { joinAuthorities, sumByDistrict, createIsraelLocalAuthProvider, normName } from '../scripts/subnational/providers/israel-localauth.mjs';

const j = (f) => JSON.parse(readFileSync(new URL(`./fixtures/${f}`, import.meta.url), 'utf8'));

test('Israel join: real authority lists, code+name first, unique-name fallback, rest dropped', () => {
  const { matched, dropped } = joinAuthorities(j('il_municipal_authorities.json'), j('il_finance_authorities_2024.json'));
  assert.equal(matched.size + dropped.length, 260);
  assert.ok(matched.size >= 250, `matched ${matched.size}`);
  // Judea & Samaria style spelling variant that only the code resolves
  const a = [...matched.values()].find((m) => m.finance.name === 'אבו גוש');
  assert.equal(a.lookup.LocalAuthorityCode, 472);
  assert.ok(dropped.some((d) => d.code === 'NULL'), 'authority with no code and no name match is dropped, not guessed');
});

test('Israel: names normalise doubled yod/vav', () => {
  assert.equal(normName('הרצליה'), normName('הרצלייה'));
});

test('Israel provider: summed per district with child count; unmatched districts absent', async () => {
  const lookup = j('il_municipal_authorities.json');
  const totals = j('il_abu_ghosh_totals.json');
  const fetchFn = async (u) => {
    const q = new URL(String(u)).searchParams;
    if (q.get('resource_id') === 'c4916937-f5d3-4295-a22e-88a1af5cde6a') return new Response(JSON.stringify({ success: true, result: { records: lookup } }), { status: 200 });
    const f = JSON.parse(q.get('filters'));
    return new Response(JSON.stringify({ success: true, result: { records: totals.filter((r) => r['שורה'] === f['שורה']) } }), { status: 200 });
  };
  const out = await createIsraelLocalAuthProvider().run({ fetchFn });
  const rev = out.observations.find((o) => o.metric === 'local_authorities_revenue_ils_thousand');
  const exp = out.observations.find((o) => o.metric === 'local_authorities_expenditure_ils_thousand');
  assert.equal(rev.value, 77719);
  assert.equal(exp.value, 77800);
  assert.equal(rev.year, 2024);
  assert.equal(rev.method, 'sum_of_children');
  assert.match(rev.note, /not a district-government account/);
  assert.equal(out.observations.length, 2);
});

test('sumByDistrict ignores authorities outside the six districts', () => {
  const m = new Map([[1, { lookup: { LocalAuthorityDistrict: 'אזור יהודה והשומרון' }, finance: { lamas: 1 } }]]);
  assert.equal(sumByDistrict(m, new Map([[1, { revenue: 5, expenditure: 5, year: 2024 }]])).size, 0);
});
