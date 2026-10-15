#!/usr/bin/env node
// Live reachability + shape probe for every free source the keyless replacements and the
// 10 subnational seeders depend on. Run it ONCE on a machine with internet:
//   node scripts/probe-subnational-sources.mjs
// Each line says PASS / FAIL with the reason. Nothing is written to Redis. Exit code 1 if any FAIL.
// A FAIL means "that provider will be reported as failed in the payload"; the seeder keeps working
// with its other providers, but you should fix or replace the failing source.

import { parseJsonStat, indexRows, resolveCode } from './subnational/providers/eurostat.mjs';
import { parseWorldBank } from './subnational/providers/worldbank.mjs';
import { buildDivisionQuery, pickLatest } from './subnational/providers/wikidata.mjs';
import { buildCountQuery, parseCounts, OVERPASS_URLS } from './subnational/providers/overpass.mjs';
import { COUNTRIES } from './subnational/_registry.mjs';
import { FIRMS_PUBLIC_CSV } from './seed-fire-detections.mjs';
import { buildGedCsvCandidates } from './shared/ucdp-ged-csv.mjs';
import { parseFredCsv, FRED_SERIES } from './seed-eia-petroleum.mjs';
import { parseFredLatest } from './subnational/providers/fred-us-states.mjs';

const UA = 'worldmonitor-faii-probe/1.0';
const results = [];
async function check(name, fn) {
  const t = Date.now();
  try {
    const detail = await fn();
    results.push({ name, ok: true, detail });
    console.log(`PASS  ${name}  (${Date.now() - t}ms)  ${detail ?? ''}`);
  } catch (err) {
    results.push({ name, ok: false, detail: String(err.message ?? err) });
    console.log(`FAIL  ${name}  (${Date.now() - t}ms)  ${String(err.message ?? err).slice(0, 220)}`);
  }
}
const get = async (url, init = {}, ms = 60_000) => {
  const r = await fetch(url, { ...init, headers: { 'User-Agent': UA, ...(init.headers ?? {}) }, signal: AbortSignal.timeout(ms) });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url.slice(0, 90)}`);
  return r;
};

await check('wikidata: P300 join + population (US-CA)', async () => {
  const q = buildDivisionQuery(['US-CA', 'DE-BY', 'JP-13'], 'P1082', false);
  const r = await get('https://query.wikidata.org/sparql', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/sparql-results+json' }, body: `query=${encodeURIComponent(q)}` });
  const m = pickLatest((await r.json()).results.bindings, 'code');
  if (m.size === 0) throw new Error('no rows');
  return `${m.size}/3 divisions returned`;
});

for (const [dataset, query, expect] of [
  ['nama_10r_2gdp', 'unit=MIO_EUR', 'DE2'],
  ['demo_r_d2jan', 'sex=T&age=TOTAL&unit=NR', 'DE2'],
  ['demo_r_pjanaggr3', 'sex=T&age=Y15-64&unit=NR', 'DE2'],
  ['demo_r_pjanaggr3', 'sex=T&age=Y_GE65&unit=NR', 'DE2'],
  ['pat_ep_rtot', 'unit=NR', 'DE21'],
  ['pat_ep_rtec', 'unit=NR&ipc=HT', 'DE21'],
]) {
  await check(`eurostat: ${dataset} ${query}`, async () => {
    const url = `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/${dataset}?format=JSON&lang=EN&lastTimePeriod=5${query ? `&${query}` : ''}`;
    const idx = indexRows(parseJsonStat(await (await get(url, {}, 90_000)).json()));
    if (idx.size === 0) throw new Error('no rows');
    const hit = resolveCode(idx, expect, expect.length + 1);
    return `${idx.size} geos; ${expect} -> ${hit ? `${hit.value} (${hit.year}, ${hit.method})` : 'not resolvable'}`;
  });
}

for (const [ind, src] of [['NY.GDP.MKTP.CD'], ['SP.POP.1564.TO.ZS'], ['GOV_WGI_RL.EST'], ['MS.MIL.XPND.GD.ZS'], ['BX.KLT.DINV.CD.WD'], ['GC.REV.XGRT.GD.ZS'], ['IP.PAT.RESD'], ['EG.IMP.CONS.ZS']]) {
  await check(`worldbank: ${ind}${src ? ` source=${src}` : ''}`, async () => {
    const url = `https://api.worldbank.org/v2/country/${COUNTRIES.join(';')}/indicator/${ind}?format=json&mrnev=1&per_page=200${src ? `&source=${src}` : ''}`;
    const m = parseWorldBank(await (await get(url, {}, 45_000)).json());
    if (m.size === 0) throw new Error('no values');
    return `${m.size}/15 countries have a value`;
  });
}

await check('overpass: ISO3166-2 area + count (DE-BE airports with IATA)', async () => {
  // Small area on purpose; every mirror is tried and reported, PASS if at least one answers.
  const log = [];
  let good = null;
  for (const base of OVERPASS_URLS) {
    try {
      const r = await get(base, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `data=${encodeURIComponent(buildCountQuery('DE-BE', [['["aeroway"="aerodrome"]["iata"]']]))}` }, 150_000);
      const c = parseCounts(await r.json());
      if (c.length !== 1) throw new Error('unexpected response shape');
      log.push(`${base.split('/')[2]}=OK(${c[0]})`);
      good ??= base;
    } catch (e) { log.push(`${base.split('/')[2]}=${String(e.message).slice(0, 40)}`); }
  }
  if (!good) throw new Error(`no mirror answered: ${log.join(', ')}`);
  return log.join(', ') + ' (a count of 0 would mean the ISO3166-2 area did not resolve)';
});

for (const [k, spec] of Object.entries(FRED_SERIES)) {
  await check(`fred csv: ${k} (${spec.id})`, async () => {
    const txt = await (await get(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${spec.id}&cosd=${new Date(Date.now() - 60 * 86400_000).toISOString().slice(0, 10)}`)).text();
    const p = parseFredCsv(txt, spec.unit);
    if (!p) throw new Error('no parsable observation');
    return `latest ${p.current} on ${p.date}`;
  });
}

for (const [src, url] of Object.entries(FIRMS_PUBLIC_CSV)) {
  await check(`firms public csv: ${src}`, async () => {
    const r = await get(url, { headers: { Range: 'bytes=0-400' } }, 60_000);
    const head = (await r.text()).split('\n')[0];
    if (!/latitude/i.test(head)) throw new Error(`first line is not a FIRMS header: ${head.slice(0, 80)}`);
    return 'header ok';
  });
}

await check('ucdp ged csv zip (any candidate)', async () => {
  const tried = [];
  for (const { url } of buildGedCsvCandidates()) {
    try { const r = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) }); tried.push(`${r.status} ${url.split('/').pop()}`); if (r.ok) return `found ${url}`; }
    catch (e) { tried.push(`ERR ${url.split('/').pop()}`); }
  }
  throw new Error(`none reachable: ${tried.join(', ')}`);
});

// ---- Phase C datasets (airports, power plants) and extra regional series ----
for (const [name, url, marker] of [
  ['ourairports airports.csv', 'https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv', /iso_region/],
  ['wri gppd csv', 'https://raw.githubusercontent.com/wri/global-power-plant-database/master/output_database/global_power_plant_database.csv', /capacity_mw/],
]) {
  await check(name, async () => {
    const r = await get(url, { headers: { Range: 'bytes=0-2000' } }, 60_000);
    const head = (await r.text()).split('\n')[0];
    if (!marker.test(head)) throw new Error(`unexpected header: ${head.slice(0, 80)}`);
    return 'header ok';
  });
}
for (const id of ['CAPCPI', 'MEHOINUSCAA646N', 'GCT1502CA', 'CAUR', 'PPAACA06000A156NCEN', 'CATOTLTAX']) {
  await check(`fred csv: ${id}`, async () => {
    const r = await get(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}&cosd=2020-01-01`, {}, 30_000);
    const p = parseFredLatest(await r.text());
    if (!p) throw new Error('no numeric rows');
    await new Promise((res) => setTimeout(res, 500));
    return `latest ${p.value} on ${p.date}`;
  });
}
for (const [dataset, query] of [
  ['demo_r_mlifexp', 'sex=T&age=Y_LT1&geo=DE2'], ['edat_lfse_04', 'sex=T&age=Y25-64&isced11=ED5-8&geo=DE2'],
  ['lfst_r_lfu3rt', 'sex=T&age=Y15-74&unit=PC&geo=DE2'], ['crim_gen_reg', 'iccs=ICCS0101&unit=P_HTHAB&geo=DE2'],
  ['rd_e_gerdreg', 'sectperf=TOTAL&unit=PC_GDP&geo=ITC1'],
]) {
  await check(`eurostat: ${dataset} ${query}`, async () => {
    const r = await get(`https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/${dataset}?${query}&lastTimePeriod=1&lang=en`, {}, 60_000);
    const j = await r.json();
    const v = j.value ? Object.values(j.value)[0] : null;
    if (v == null) throw new Error('no value');
    return `value ${v}`;
  });
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} probes passed.`);
process.exit(failed.length ? 1 : 0);
