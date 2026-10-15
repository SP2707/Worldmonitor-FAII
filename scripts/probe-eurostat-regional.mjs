#!/usr/bin/env node
// Read-only probe: which Eurostat REGIONAL (NUTS2) datasets exist and how many regions/countries each really covers.
// Dataset codes are from memory of the Eurostat catalogue - a 404/400 here means the code is wrong or the filter is
// not accepted, and nothing is built on it. Output: one line per dataset + docs/samples/national/probe/eurostat-regional.json.
import { mkdirSync, writeFileSync } from 'node:fs';
const BASE = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';
// [category, dataset, what I believe it is]
const SETS = [
  ['grp', 'nama_10r_2gdp', 'GDP by NUTS2'], ['grp', 'nama_10r_3gdp', 'GDP by NUTS3'],
  ['fiscal', 'nama_10r_2gfcf', 'gross fixed capital formation NUTS2'],
  ['population', 'demo_r_d2jan', 'population 1 Jan NUTS2'],
  ['infrastructure', 'tran_r_avpa_nm', 'air passengers by NUTS2'], ['infrastructure', 'isoc_r_broad_h', 'household broadband NUTS2'],
  ['energy', 'nrg_ind_ren', 'renewables share (national, control)'],
  ['hdi', 'demo_r_mlifexp', 'life expectancy NUTS2'], ['hdi', 'edat_lfse_04', 'tertiary attainment NUTS2'],
  ['patents', 'pat_ep_rtot', 'EPO patent applications by region'], ['patents', 'rd_e_gerdreg', 'R&D expenditure NUTS2'],
  ['rule-of-law', 'crim_gen_reg', 'police-recorded offences by NUTS3'],
  ['fdi', 'fdi_*', '(none expected at regional level)'], ['military', 'mil_*', '(none expected)'],
];
const out = [];
for (const [cat, code, note] of SETS) {
  if (code.includes('*')) { out.push({ cat, code, note, status: 'skipped (no known regional dataset)' }); console.log(`${cat.padEnd(14)} ${code.padEnd(18)} skipped`); continue; }
  const url = `${BASE}/${code}?format=JSON&lang=EN&lastTimePeriod=1&geoLevel=nuts2`;
  const row = { cat, code, note, url };
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'worldmonitor-faii-probe/1.0', Accept: 'application/json' }, signal: AbortSignal.timeout(120_000) });
    row.http = r.status;
    const txt = await r.text();
    row.bytes = txt.length;
    if (r.status === 200) { mkdirSync('docs/samples/national/probe/eurostat', { recursive: true }); writeFileSync(`docs/samples/national/probe/eurostat/${code}.json`, txt); }
    if (r.status === 200) {
      const j = JSON.parse(txt);
      const geo = Object.keys(j.dimension?.geo?.category?.index ?? {});
      const vals = Object.values(j.value ?? {}).filter((v) => v != null).length;
      const time = Object.keys(j.dimension?.time?.category?.index ?? {});
      row.dims = j.id; row.geoCount = geo.length; row.countries = [...new Set(geo.map((g) => g.slice(0, 2)))].length;
      row.values = vals; row.time = time; row.updated = j.updated; row.label = j.label;
    } else row.error = txt.slice(0, 160);
  } catch (e) { row.error = String(e.message).slice(0, 160); }
  out.push(row);
  console.log(`${cat.padEnd(14)} ${code.padEnd(18)} http=${row.http ?? 'ERR'} regions=${row.geoCount ?? '-'} countries=${row.countries ?? '-'} values=${row.values ?? '-'} time=${(row.time ?? []).join('/')} ${row.error ? '| ' + row.error : ''}`);
}
mkdirSync('docs/samples/national/probe', { recursive: true });
writeFileSync('docs/samples/national/probe/eurostat-regional.json', JSON.stringify(out, null, 1));
console.log('wrote docs/samples/national/probe/eurostat-regional.json');
