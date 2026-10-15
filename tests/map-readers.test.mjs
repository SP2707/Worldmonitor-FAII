import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractCountryValues } from '../scripts/map/data.mjs';

test('CII payload shape (region + combinedScore) and displacement shape (code + totalDisplaced) both read', () => {
  const cii = { ciiScores: [{ region: 'UA', combinedScore: 91, staticBaseline: 50 }, { region: 'SD', combinedScore: 78 }], strategicRisks: [], degraded: false, stale: false };
  assert.deepEqual([...extractCountryValues(cii)].sort(), [['SD', 78], ['UA', 91]]);
  const disp = { summary: { countries: [{ code: 'SDN', name: 'Sudan', totalDisplaced: 12900343, location: { latitude: 15.5, longitude: 32.5 } }] } };
  assert.deepEqual([...extractCountryValues(disp)], [['SD', 12900343]]);
});
