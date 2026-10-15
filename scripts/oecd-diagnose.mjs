#!/usr/bin/env node
// Diagnoses why OECD answers HTTP 500 for some requests. Runs one request at a time, 8 s apart.
// Case 1 is a control that returned 200 before; if it fails now the service/IP is being throttled, not our requests.
const B = 'https://sdmx.oecd.org/public/rest';
const UA = 'worldmonitor-faii-subnational/1.0';
const CSV = 'format=csvfilewithlabels&dimensionAtObservation=AllDimensions';
const cases = [
  ['1 control GDP key, Accept text/csv', `${B}/data/OECD.CFE.EDS,DSD_REG_ECO@DF_GDP,/A.TL2...GDP._T.V.USD_PPP?startPeriod=2022&${CSV}`, { Accept: 'text/csv' }],
  ['2 GDP /all one year, Accept text/csv', `${B}/data/OECD.CFE.EDS,DSD_REG_ECO@DF_GDP,/all?startPeriod=2021&endPeriod=2021&${CSV}`, { Accept: 'text/csv' }],
  ['3 LIFE_EXP /all one year, Accept text/csv', `${B}/data/OECD.CFE.EDS,DSD_REG_DEMO@DF_LIFE_EXP,/all?startPeriod=2020&endPeriod=2020&${CSV}`, { Accept: 'text/csv' }],
  ['4 LIFE_EXP /all one year, no Accept', `${B}/data/OECD.CFE.EDS,DSD_REG_DEMO@DF_LIFE_EXP,/all?startPeriod=2020&endPeriod=2020&${CSV}`, {}],
  ['5 LIFE_EXP explicit version 2.4', `${B}/data/OECD.CFE.EDS,DSD_REG_DEMO@DF_LIFE_EXP,2.4/all?startPeriod=2020&endPeriod=2020&${CSV}`, { Accept: 'text/csv' }],
  ['6 LIFE_EXP sdmx-csv Accept, no format param', `${B}/data/OECD.CFE.EDS,DSD_REG_DEMO@DF_LIFE_EXP,/all?startPeriod=2020&endPeriod=2020&dimensionAtObservation=AllDimensions`, { Accept: 'application/vnd.sdmx.data+csv; charset=utf-8; urn=true; labels=both' }],
  ['7 LIFE_EXP dataflow metadata', `${B}/dataflow/OECD.CFE.EDS/DSD_REG_DEMO@DF_LIFE_EXP/latest?references=none`, {}],
  ['8 LIFE_EXP structure (DSD) metadata', `${B}/dataflow/OECD.CFE.EDS/DSD_REG_DEMO@DF_LIFE_EXP/latest?references=descendants&detail=full`, {}],
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const want = /^(retry-after|x-ratelimit.*|ratelimit.*|x-rate.*|content-type|content-length|server|via|x-request-id)$/i;
let n = 0;
for (const [name, url, extra] of cases) {
  if (n++) await sleep(8000);
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, ...extra }, signal: AbortSignal.timeout(180_000) });
    const t = await r.text();
    const hdr = [...r.headers].filter(([k]) => want.test(k)).map(([k, v]) => `${k}=${v}`).join('; ');
    console.log(`${r.status}  ${name}  bytes=${t.length}${r.ok ? '' : '  body=' + t.slice(0, 100).replace(/\s+/g, ' ')}${hdr ? '\n      headers: ' + hdr : ''}`);
  } catch (e) {
    console.log(`ERR  ${name}  ${e.message}`);
  }
}
