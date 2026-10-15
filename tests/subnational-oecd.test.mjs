import { describe, it } from 'node:test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { parseCsv } from '../scripts/subnational/_csv.mjs';
import { createOecdProvider, GDP_FLOW_KEY, latestByArea, matchDivisions, normName, oecdSeries } from '../scripts/subnational/providers/oecd.mjs';

const HEAD = 'STRUCTURE,REF_AREA,Reference area,TERRITORIAL_LEVEL,MEASURE,ACTIVITY,PRICES,UNIT_MEASURE,TIME_PERIOD,OBS_VALUE,COUNTRY,UNIT_MULT';
const row = (ref, name, level, measure, prices, unit, year, value, country, mult = 6) =>
  `DATAFLOW,${ref},"${name}",${level},${measure},_T,${prices},${unit},${year},${value},${country},${mult}`;
const CSV = [
  HEAD,
  row('DE1', 'Baden-Württemberg', 'TL2', 'GDP', 'V', 'USD_PPP', 2021, 700000, 'DEU'),
  row('IN27', 'Orissa', 'TL2', 'GDP', 'V', 'USD_PPP', 2020, 100, 'IND'),
  row('IN27', 'Orissa', 'TL2', 'GDP', 'V', 'USD_PPP', 2021, 120, 'IND'),
  row('IN03', 'National Capital Territory of Delhi', 'TL2', 'GDP', 'V', 'USD_PPP', 2021, 250, 'IND'),
  row('CN05', 'Inner Mongolia', 'TL2', 'GDP', 'V', 'USD_PPP', 2021, 300, 'CHN'),
  row('JPA', 'Hokkaido', 'TL2', 'GDP', 'V', 'USD_PPP', 2021, 5, 'JPN'),
  row('JPB', 'Tohoku', 'TL2', 'GDP', 'V', 'USD_PPP', 2021, 6, 'JPN'),
  row('JPE18', 'Fukui', 'TL3', 'GDP', 'V', 'USD_PPP', 2021, 7, 'JPN'),
  row('IN27', 'Orissa', 'TL2', 'GDP', 'Q', 'USD_PPP', 2021, 999, 'IND'),   // wrong price base
  row('XX1', 'Nowhere', 'TL2', 'GDP', 'V', 'USD_PPP', 2021, '', 'XXX'),    // empty observation
].join('\n');

describe('oecd provider', () => {
  const series = oecdSeries({ measure: 'GDP', prices: 'V', unit: 'USD_PPP' });

  it('builds the key in DSD dimension order', () => {
    assert.equal(series.keys[0]('TL2'), 'A.TL2...GDP._T.V.USD_PPP');
  });

  it('keeps the newest year, applies UNIT_MULT and the filter', () => {
    const by = latestByArea(parseCsv(CSV), { filter: { TERRITORIAL_LEVEL: 'TL2', ...series.filter } });
    assert.equal(by.get('IN27').year, 2021);
    assert.equal(by.get('IN27').value, 120e6);
    assert.equal(by.has('XX1'), false);
    assert.equal(by.has('JPE18'), false);
  });

  it('matches by NUTS code, by name and by alias; skips what it cannot match', () => {
    const by = latestByArea(parseCsv(CSV), { filter: { TERRITORIAL_LEVEL: 'TL2', ...series.filter } });
    const { matched, unmatched } = matchDivisions(by);
    const ids = new Map(matched.map((m) => [m.div.id, m]));
    assert.ok(ids.has('DE-BW'), 'NUTS code DE1');
    assert.ok(ids.has('IN-OD'), 'alias Orissa -> Odisha');
    assert.ok(ids.has('IN-DL'), 'alias Delhi');
    assert.ok(ids.has('JP-01'), 'name Hokkaido');
    assert.ok(unmatched.some((u) => u.includes('Tohoku')), 'aggregate region is reported, not guessed');
  });

  it('normalises names', () => {
    assert.equal(normName('Baden-Württemberg'), normName('Baden Wurttemberg'));
    assert.equal(normName('Brittany (Bretagne)'), 'brittany');
  });

  it('fetches TL2 and TL3, de-duplicates divisions, converts units', async () => {
    const urls = [];
    const provider = createOecdProvider({
      dataflow: 'DSD_REG_ECO@DF_GDP', metric: 'grp', unit: 'USD PPP million', scale: 1e-6, ...series,
    });
    const res = await provider.run({
      nowMs: Date.UTC(2026, 9, 1), cacheDir: null, sleep: async () => {},
      fetchFn: async (url) => { urls.push(url); return new Response(CSV, { status: 200 }); },
    });
    assert.equal(urls.length, 2);
    assert.match(urls[0], /OECD\.CFE\.EDS,DSD_REG_ECO@DF_GDP,\/A\.TL2\.\.\.GDP\._T\.V\.USD_PPP\?startPeriod=2016/);
    assert.match(urls[1], /A\.TL3\.\.\./);
    const byId = new Map(res.observations.map((o) => [o.divisionId, o]));
    assert.equal(byId.get('IN-OD').value, 120);
    assert.equal(byId.get('IN-OD').year, 2021);
    assert.equal(byId.get('IN-OD').scope, 'division');
    assert.equal(byId.get('JP-18').value, 7); // Fukui from TL3
    assert.equal(res.observations.filter((o) => o.divisionId === 'JP-01').length, 1);
  });

  it('reports a 429 as a retryable error when nothing was fetched', async () => {
    const provider = createOecdProvider({ dataflow: 'DSD_REG_ECO@DF_GDP', metric: 'grp', unit: 'u', ...series });
    await assert.rejects(provider.run({ cacheDir: null, sleep: async () => {}, fetchFn: async () => new Response('', { status: 429 }) }), /429/);
  });

  it('sends Accept: text/csv (OECD answers 500 without it)', async () => {
    let accept = null;
    const provider = createOecdProvider({ dataflow: 'DSD_REG_ECO@DF_GDP', metric: 'grp', unit: 'u', ...series });
    await provider.run({ nowMs: Date.UTC(2026, 9, 1), cacheDir: null, sleep: async () => {}, fetchFn: async (_u, init) => { accept = init.headers.Accept; return new Response(CSV, { status: 200 }); } });
    assert.equal(accept, 'text/csv');
  });

  it('shares one cached response across providers and serves stale data when OECD errors', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'oecd-cache-'));
    let calls = 0;
    const ok = async () => { calls++; return new Response(CSV, { status: 200 }); };
    const mk = (metric, unit) => createOecdProvider({ dataflow: 'DSD_REG_ECO@DF_GDP', metric, unit: 'u', ...oecdSeries({ measure: 'GDP', prices: 'V', unit }) });
    const ctx = { nowMs: Date.UTC(2026, 9, 1), cacheDir: dir, sleep: async () => {} };
    await mk('grp', 'USD_PPP').run({ ...ctx, fetchFn: ok });
    await mk('grp2', 'USD_PPP').run({ ...ctx, fetchFn: ok });
    assert.equal(calls, 2, 'two levels, fetched once each, second provider is served from disk');
    // expired cache + failing server -> stale data still served
    const later = { nowMs: Date.UTC(2026, 9, 1) + 3 * 86400_000, cacheDir: dir, sleep: async () => {}, env: { OECD_CACHE_HOURS: '1' } };
    const res = await mk('grp', 'USD_PPP').run({ ...later, fetchFn: async () => new Response('', { status: 500 }) });
    assert.ok(res.observations.length > 0);
  });

  it('retries a 500 with backoff, then falls back to the next key', async () => {
    const seen = [];
    const sleeps = [];
    const provider = createOecdProvider({
      dataflow: 'DSD_REG_ECO@DF_GDP', metric: 'grp', unit: 'u',
      ...oecdSeries({ measure: 'GDP', prices: 'V', unit: 'USD_PPP', fallbackKeys: [GDP_FLOW_KEY] }),
      levels: [{ level: 'TL2' }],
    });
    const res = await provider.run({
      nowMs: Date.UTC(2026, 9, 1), cacheDir: null, sleep: async (ms) => { sleeps.push(ms); },
      fetchFn: async (url) => { seen.push(url); return url.includes('GDP+POP') ? new Response(CSV, { status: 200 }) : new Response('x', { status: 500 }); },
    });
    assert.equal(seen.filter((x) => !x.includes('GDP+POP')).length, 3, 'plain key tried 3 times (1 + 2 retries)');
    assert.equal(seen.filter((x) => x.includes('GDP+POP')).length, 1);
    assert.ok(res.observations.length > 0);
    assert.ok(sleeps.includes(8_000) && sleeps.includes(20_000), 'backoff delays used');
  });

  it('does not retry a 404', async () => {
    let calls = 0;
    const provider = createOecdProvider({ dataflow: 'X', metric: 'm', unit: 'u', ...series, levels: [{ level: 'TL2' }] });
    await assert.rejects(provider.run({ cacheDir: null, sleep: async () => {}, fetchFn: async () => { calls++; return new Response('', { status: 404 }); } }), /404/);
    assert.equal(calls, 1);
  });
});
