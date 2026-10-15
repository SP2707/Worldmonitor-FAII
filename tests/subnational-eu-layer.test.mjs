import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createEurostatProvider } from '../scripts/subnational/providers/eurostat.mjs';
import { BY_ID, DIVISIONS } from '../scripts/subnational/_registry.mjs';

const stat = (rows) => ({ id: ['unit', 'geo', 'time'], size: [1, rows.length, 1],
  dimension: { unit: { category: { index: { MIO_EUR: 0 } } }, geo: { category: { index: Object.fromEntries(rows.map(([g], i) => [g, i])) } }, time: { category: { index: { 2024: 0 } } } },
  value: Object.fromEntries(rows.map(([, v], i) => [i, v])) });

test('EU NUTS 2 layer: Eurostat provider fills AT, GR (EL codes) and a single-region country directly', async () => {
  const body = stat([['AT11', 10], ['EL30', 20], ['EE00', 30], ['ATZZ', 99]]);
  const p = createEurostatProvider({ dataset: 'nama_10r_2gdp', metric: 'grp', unit: 'MIO_EUR', query: 'unit=MIO_EUR' });
  const { observations } = await p.run({ fetchFn: async () => new Response(JSON.stringify(body), { status: 200 }) });
  const by = Object.fromEntries(observations.map((o) => [o.divisionId, o]));
  assert.equal(by['AT-AT11'].value, 10);
  assert.equal(by['AT-AT11'].method, 'direct');
  assert.equal(by['GR-EL30'].value, 20, 'Greece uses Eurostat code EL but registry country GR');
  assert.equal(by['EE-EE00'].value, 30);
  assert.ok(!observations.some((o) => /ZZ/.test(o.divisionId)), 'Extra-Regio rows are not divisions');
});

test('EU layer registry: every region has a NUTS code of its own country prefix', () => {
  for (const d of DIVISIONS.filter((x) => x.layer === 'eu-nuts2')) {
    const prefix = d.country === 'GR' ? 'EL' : d.country;
    assert.ok(d.nuts.startsWith(prefix), d.id);
    assert.equal(BY_ID.get(d.id), d);
  }
});
