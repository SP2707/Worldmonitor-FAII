#!/usr/bin/env node
// Live check of the Tor layer on YOUR machine (the unit tests only use a mock SOCKS server).
//   node scripts/tor-check.mjs            is Tor reachable, and is traffic really leaving through it?
//   node scripts/tor-check.mjs --sources  also try each main data source through Tor and say which refuse it
//   node scripts/tor-check.mjs --compare  also ask check.torproject.org for your DIRECT IP (reveals your IP to them)
// Honours SEED_TOR_SOCKS (default 127.0.0.1:9050,127.0.0.1:9150). Always runs with the Tor layer on.
import { installTor, findTorProxy } from './shared/tor-fetch.mjs';

const realFetch = globalThis.fetch;
process.env.SEED_TOR = '1';
const t = installTor(process.env);
const flag = (f) => process.argv.includes(f);
let failed = false;
const line = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) failed = true; };

try {
  const p = await findTorProxy(t.candidates);
  line(true, `SOCKS proxy reachable at ${p.host}:${p.port}`);
} catch (e) { line(false, e.message); process.exit(1); }

try {
  const j = await (await fetch('https://check.torproject.org/api/ip', { signal: AbortSignal.timeout(60_000) })).json();
  line(j.IsTor === true, `check.torproject.org says IsTor=${j.IsTor}, exit IP ${j.IP}`);
  if (flag('--compare')) {
    const d = await (await realFetch('https://check.torproject.org/api/ip', { signal: AbortSignal.timeout(30_000) })).json();
    line(d.IP !== j.IP, `direct IP ${d.IP} differs from exit IP ${j.IP}`);
  }
} catch (e) { line(false, `could not reach check.torproject.org through Tor: ${e.cause?.message ?? e.message}`); }

if (flag('--sources')) {
  const probes = [
    ['World Bank', 'https://api.worldbank.org/v2/country/US/indicator/SP.POP.TOTL?format=json&per_page=1'],
    ['Eurostat', 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_r_mlifexp?sex=T&age=Y_LT1&geo=DE2&lastTimePeriod=1'],
    ['FRED', 'https://fred.stlouisfed.org/graph/fredgraph.csv?id=CAPOP&cosd=2024-01-01'],
    ['USGS', 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson'],
    ['Wikidata SPARQL', 'https://query.wikidata.org/sparql?format=json&query=SELECT%20%3Fx%20WHERE%20%7B%3Fx%20wdt%3AP31%20wd%3AQ5%7D%20LIMIT%201'],
    ['Overpass (lz4)', 'https://lz4.overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%3Bnode(1)%3Bout%20ids%3B'],
    ['GitHub raw (OurAirports)', 'https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv'],
  ];
  const refused = [];
  for (const [name, url] of probes) {
    try {
      const r = await fetch(url, { headers: { Range: 'bytes=0-512' }, signal: AbortSignal.timeout(60_000) });
      const ok = r.status < 400;
      line(ok, `${name}: HTTP ${r.status}`);
      if (!ok) refused.push(new URL(url).hostname);
      await r.body?.cancel();
    } catch (e) { line(false, `${name}: ${e.cause?.message ?? e.message}`); refused.push(new URL(url).hostname); }
    await new Promise((r) => setTimeout(r, 1500));
  }
  if (refused.length) console.log(`\nSources that refused or failed over Tor: ${refused.join(', ')}\nIf they keep failing you may list them, knowingly, as SEED_TOR_DIRECT_HOSTS=${refused.join(',')} (those would then connect directly).`);
}
process.exit(failed ? 1 : 0);
