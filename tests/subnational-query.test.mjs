import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { queryDivisions, queryCoverage, queryNational, CATEGORY_SLUGS } from '../scripts/subnational/query.mjs';

const payloads = {
  population: {
    generatedAt: '2026-10-16T00:00:00Z',
    coverage: { total: { total: 636, ok: 10, national_only: 0, no_source: 626 }, byCountry: { MY: { total: 16, ok: 16, national_only: 0, no_source: 0 } } },
    divisions: { 'MY-01': { metrics: { population: { value: 4000000, unit: 'persons', year: 2024, source: 'OpenDOSM', sourceUrl: 'https://open.dosm.gov.my', scope: 'division' }, empty: { value: null } } } },
  },
};

describe('queryDivisions', () => {
  it('returns values with provenance and reports unseeded categories', () => {
    const r = queryDivisions(payloads, { country: 'my', categories: ['population', 'grp'] });
    assert.equal(r.divisionCount, 16);
    const johor = r.divisions.find((d) => d.id === 'MY-01');
    assert.equal(johor.metricCount, 1);
    assert.deepEqual([johor.metrics[0].source, johor.metrics[0].year, johor.metrics[0].scope], ['OpenDOSM', 2024, 'division']);
    assert.deepEqual(r.missingCategories, ['grp']);
  });
  it('rejects bad input instead of guessing', () => {
    assert.match(queryDivisions(payloads, {}).error, /country/);
    assert.match(queryDivisions(payloads, { country: 'ZZ' }).error, /no divisions/);
    assert.match(queryDivisions(payloads, { divisionId: 'NOPE' }).error, /unknown divisionId/);
    assert.match(queryDivisions(payloads, { country: 'MY', categories: ['x'] }).error, /unknown category/);
  });
  it('filters by metric and honours limit', () => {
    assert.equal(queryDivisions(payloads, { country: 'MY', metrics: ['other'] }).divisions[0].metricCount, 0);
    const r = queryDivisions(payloads, { country: 'MY', limit: 3 });
    assert.equal(r.returned, 3); assert.equal(r.truncated, true);
  });
});

describe('queryCoverage', () => {
  it('marks unseeded categories and uses per-country buckets', () => {
    const r = queryCoverage(payloads, { country: 'MY' });
    assert.equal(r.categories.length, CATEGORY_SLUGS.length);
    assert.equal(r.categories.find((c) => c.category === 'population').ok, 16);
    assert.equal(r.categories.find((c) => c.category === 'grp').seeded, false);
  });
});

describe('queryNational', () => {
  const nat = { generatedAt: 'x', countries: { MYS: { iso3: 'MYS', iso2: 'MY', name: 'Malaysia', region: 'EAP', income: 'UMC', indicators: { population: { value: 1, year: 2023, unit: 'persons', source: 'worldbank:SP.POP.TOTL' } } } } };
  it('accepts ISO2 or ISO3, tags scope national, lists unknown codes', () => {
    const r = queryNational(nat, { countries: ['MY', 'mys', 'QQ'] });
    assert.equal(r.countries.length, 2); assert.deepEqual(r.unknown, ['QQ']);
    assert.equal(r.countries[0].indicators[0].scope, 'national');
  });
  it('errors when unseeded', () => assert.match(queryNational(null, { countries: ['MY'] }).error, /not seeded/));
});
