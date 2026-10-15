#!/usr/bin/env node
// Live check of the OECD request variants from Node (the seeder's HTTP stack). Prints status only.
const url = 'https://sdmx.oecd.org/public/rest/data/OECD.CFE.EDS,DSD_REG_ECO@DF_GDP,/A.TL2...GDP._T.V.USD_PPP?startPeriod=2022&dimensionAtObservation=AllDimensions&format=csvfilewithlabels';
const variants = {
  'no headers': {},
  'UA only': { 'User-Agent': 'worldmonitor-faii-subnational/1.0' },
  'UA + Accept text/csv': { 'User-Agent': 'worldmonitor-faii-subnational/1.0', Accept: 'text/csv' },
};
for (const [name, headers] of Object.entries(variants)) {
  try {
    const r = await fetch(url, { headers, signal: AbortSignal.timeout(60_000) });
    const t = await r.text();
    console.log(`${name} -> ${r.status} bytes=${t.length}${r.ok ? '' : ' body=' + t.slice(0, 160).replace(/\s+/g, ' ')}`);
  } catch (e) {
    console.log(`${name} -> ${e.message}`);
  }
}
