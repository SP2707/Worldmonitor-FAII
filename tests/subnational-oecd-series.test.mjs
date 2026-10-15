import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SERIES, seriesKey, seriesKeys, seriesFilter, seriesFor, oecdSeriesProvider } from '../scripts/subnational/providers/oecd-series.mjs';
import { latestByArea, matchDivisions } from '../scripts/subnational/providers/oecd.mjs';

const HEAD = 'TERRITORIAL_LEVEL,REF_AREA,Reference area,MEASURE,AGE,SEX,UNIT_MEASURE,TIME_PERIOD,OBS_VALUE,COUNTRY,UNIT_MULT';
const csv = (lines) => [HEAD, ...lines].join('\n');

test('series keys have the dimension count of their DSD and unique ids', () => {
  assert.equal(new Set(SERIES.map((s) => s.id)).size, SERIES.length);
  const life = SERIES.find((s) => s.metric === 'life_expectancy_years');
  assert.equal(seriesKey(life)('TL2'), 'A.TL2...LFEXP.Y0._T.Y');
  assert.equal(seriesKeys(life)[0]('TL2'), 'A....LFEXP.Y0._T.Y'); // all levels in one request
  assert.deepEqual(seriesFilter(life), { MEASURE: 'LFEXP', AGE: 'Y0', SEX: '_T', UNIT_MEASURE: 'Y' });
  const pat = SERIES.find((s) => s.metric === 'pct_patent_applications');
  assert.equal(seriesKey(pat)('TL2').split('.').length, 4 + 9 + 0 - 0); // FREQ,TL,REF,TT + 9 filtered dims
});

test('seriesFor returns one provider per series of the category', () => {
  assert.equal(seriesFor('hdi').length, SERIES.filter((s) => s.category === 'hdi').length);
  assert.ok(seriesFor('patents').length >= 2 && seriesFor('rule-of-law').length >= 1);
  assert.throws(() => oecdSeriesProvider('nope'));
});

test('Moscow city, Moscow oblast and St Petersburg are matched by code, not by colliding names', () => {
  const parsed = [
    { TERRITORIAL_LEVEL: 'TL2', REF_AREA: 'RU18', 'Reference area': 'City of Moscow', MEASURE: 'LFEXP', OBS_VALUE: '78', TIME_PERIOD: '2022', COUNTRY: 'RUS' },
    { TERRITORIAL_LEVEL: 'TL2', REF_AREA: 'RU10', 'Reference area': 'Moscow Oblast', MEASURE: 'LFEXP', OBS_VALUE: '75', TIME_PERIOD: '2022', COUNTRY: 'RUS' },
    { TERRITORIAL_LEVEL: 'TL2', REF_AREA: 'RU29', 'Reference area': 'Federal City of Saint Petersburg', MEASURE: 'LFEXP', OBS_VALUE: '77', TIME_PERIOD: '2022', COUNTRY: 'RUS' },
  ];
  const { matched } = matchDivisions(latestByArea(parsed), { countries: ['RU'] });
  const by = Object.fromEntries(matched.map((m) => [m.div.id, m.value]));
  assert.equal(by['RU-MOW'], 78);
  assert.equal(by['RU-MOS'], 75);
  assert.equal(by['RU-SPE'], 77);
});

test('England is the sum of its regions for counts but skipped for rates', () => {
  const codes = ['UKC', 'UKD', 'UKE', 'UKF', 'UKG', 'UKH', 'UKI', 'UKJ', 'UKK'];
  const parsed = codes.map((c) => ({ TERRITORIAL_LEVEL: 'TL2', REF_AREA: c, 'Reference area': c, OBS_VALUE: '10', TIME_PERIOD: '2022', COUNTRY: 'GBR' }));
  const by = latestByArea(parsed);
  assert.equal(matchDivisions(by, { additive: true, countries: ['GB'] }).matched.find((m) => m.div.id === 'GB-ENG').value, 90);
  assert.equal(matchDivisions(by, { additive: false, countries: ['GB'] }).matched.find((m) => m.div.id === 'GB-ENG'), undefined);
});

test('a provider run over a canned life-expectancy CSV yields division observations', async () => {
  const body = csv([
    'TL2,CN01,Beijing,LFEXP,Y0,_T,Y,2022,82.5,CHN,0',
    'TL2,CN01,Beijing,LFEXP,Y0,F,Y,2022,84.5,CHN,0',
    'TL2,CN02,Tianjin,LFEXP,Y0,_T,Y,2021,81.1,CHN,0',
  ]);
  const p = oecdSeriesProvider('oecd:lifeexp:life_expectancy_years');
  const out = await p.run({ fetchFn: async () => new Response(body, { status: 200 }), sleep: async () => {}, cacheDir: null, nowMs: Date.UTC(2026, 9, 1) });
  const by = Object.fromEntries(out.observations.map((o) => [o.divisionId, o]));
  assert.equal(by['CN-BJ'].value, 82.5); // the _T row, not the female row
  assert.equal(by['CN-TJ'].year, 2021);
  assert.equal(by['CN-BJ'].scope, 'division');
});

test('sibling series share one request URL (request budget)', () => {
  const urls = (id) => seriesKeys(SERIES.find((s) => s.id === id))[0]('TL2');
  assert.equal(urls('oecd:rates:unemployment_rate_pct'), urls('oecd:rates:employment_rate_pct'));
  assert.equal(urls('oecd:pat:pct_patent_applications'), urls('oecd:pat:pct_patent_applications_per_million'));
});

test('two levels, one network request', async () => {
  let calls = 0;
  const body = csv(['TL2,CN01,Beijing,LFEXP,Y0,_T,Y,2020,82.5,CHN,0']);
  const p = oecdSeriesProvider('oecd:lifeexp:life_expectancy_years');
  await p.run({ fetchFn: async () => { calls++; return new Response(body, { status: 200 }); }, sleep: async () => {}, cacheDir: null, nowMs: Date.UTC(2026, 9, 1) });
  assert.equal(calls, 1);
});

test('REGOFI: total-function rows only, either government sector, areas without COUNTRY column resolved by code prefix', async () => {
  const head = 'REF_AREA,Reference area,MEASURE,SECTOR,COFOG,UNIT_MEASURE,TIME_PERIOD,OBS_VALUE,UNIT_MULT';
  const body = [head,
    'JPD13,Tokyo,R1,S1313RG,_Z,USD_PPP,2021,500,0',
    'JPD13,Tokyo,R1,S1313RG,GF01,USD_PPP,2021,7,0', // a by-function row must never be used
    'JPD13,Tokyo,R1,S1313RG,_Z,USD_PPP,2022,600,0',
    'JPC10,Gunma,R1,S1313RG,_Z,USD_PPP,2022,50,0',
    'CA35,Ontario,R1,S1312,_Z,USD_PPP,2022,900,0',
  ].join('\n');
  const p = oecdSeriesProvider('oecd:regofi:subnational_govt_revenue_usd_ppp');
  let url = '';
  const out = await p.run({ fetchFn: async (u) => { url = u; return new Response(body, { status: 200 }); }, sleep: async () => {}, cacheDir: null, nowMs: Date.UTC(2026, 9, 1) });
  assert.match(url, /OECD\.CFE\.RDG,DSD_SNGF_DISAGG@DF_REGOFI,\/\.\.\._Z\./);
  const by = Object.fromEntries(out.observations.map((o) => [o.divisionId, o]));
  assert.equal(by['JP-13'].value, 600);
  assert.equal(by['JP-13'].year, 2022);
  assert.equal(by['JP-10'].value, 50); // Gunma/Gumma alias
  assert.equal(by['CA-ON'].value, 900);
});
