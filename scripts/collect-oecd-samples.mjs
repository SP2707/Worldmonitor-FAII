#!/usr/bin/env node
// Downloads one sample per OECD regional dataflow into docs/samples/oecd/ so fetchers can be built against real
// responses. OECD answers HTTP 500 to Node's built-in fetch but serves curl (scripts/oecd-diagnose2.mjs), so this goes
// through curl. For each dataflow it reads the dataflow's structure reference and the data-structure definition, builds a key
// (FREQ=A, TERRITORIAL_LEVEL=TL2, the rest wildcard) and requests that. One request at a time, 8 s apart.
// Usage: node scripts/collect-oecd-samples.mjs [id-substring ...]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { curlFetch } from './subnational/_curl.mjs';

const REST = 'https://sdmx.oecd.org/public/rest';
const UA = 'worldmonitor-faii-subnational/1.0';
const FLOWS = [
  // hdi
  ['OECD.CFE.EDS', 'DSD_REG_DEMO', 'DF_LIFE_EXP'],
  ['OECD.CFE.EDS', 'DSD_REG_ECO', 'DF_INC'],
  ['OECD.CFE.EDS', 'DSD_REG_SOC', 'DF_INCOME_INEQ'],
  ['OECD.CFE.EDS', 'DSD_REG_EDU', 'DF_ATTAIN'],
  ['OECD.CFE.EDS', 'DSD_REG_HEALTH', 'DF_STATUS'],
  ['OECD.CFE.EDS', 'DSD_REG_LAB', 'DF_RATES'],
  // patents
  ['OECD.CFE.EDS', 'DSD_REG_INNOV', 'DF_PAT'],
  ['OECD.CFE.EDS', 'DSD_REG_INNOV', 'DF_RD_GERD'],
  // rule of law
  ['OECD.CFE.EDS', 'DSD_REG_SOC', 'DF_SAFETY'],
  ['OECD.CFE.EDS', 'DSD_REG_SOC', 'DF_VOTER'],
  // fiscal
  ['OECD.CFE.RDG', 'DSD_SNGF_DISAGG', 'DF_REGOFI'],
  ['OECD.CFE.RDG', 'DSD_DASHBOARD', 'REV'],
  ['OECD.CFE.RDG', 'DSD_DASHBOARD', 'TAX_REV'],
  ['OECD.CFE.RDG', 'DSD_DASHBOARD', 'DEBT'],
];
const only = process.argv.slice(2);
const dir = join('docs', 'samples', 'oecd');
mkdirSync(dir, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let first = true;
async function get(url, accept) {
  if (!first) await sleep(8000);
  first = false;
  const r = await curlFetch(url, { headers: { 'User-Agent': UA, ...(accept ? { Accept: accept } : {}) }, timeoutMs: 180_000 });
  return { status: r.status, text: await r.text() };
}
/** The DataStructure a dataflow points at (it is not always the DSD id from the dataflow list, e.g. DF_RATES). */
function structureRef(xml, fallback) {
  const m = /<(?:\w+:)?Structure>\s*<Ref\s+([^>]*?)\/?>/.exec(xml);
  if (!m) return fallback;
  const attr = (n) => new RegExp(`\\b${n}="([^"]+)"`).exec(m[1])?.[1];
  return { agency: attr('agencyID') ?? fallback.agency, id: attr('id') ?? fallback.id };
}
function dimensions(xml) {
  const out = [];
  for (const m of xml.matchAll(/<(?:\w+:)?Dimension\b[^>]*\bid="([^"]+)"[^>]*\bposition="(\d+)"/g)) out.push([Number(m[2]), m[1]]);
  if (out.length === 0) for (const m of xml.matchAll(/<(?:\w+:)?Dimension\b[^>]*\bposition="(\d+)"[^>]*\bid="([^"]+)"/g)) out.push([Number(m[1]), m[2]]);
  return out.sort((a, b) => a[0] - b[0]).map((d) => d[1]);
}
for (const [agency, dsd, df] of FLOWS.filter((f) => only.length === 0 || only.some((o) => f.join(',').includes(o)))) {
  const tag = `${agency},${dsd}@${df}`;
  try {
    const meta = await get(`${REST}/dataflow/${agency}/${dsd}@${df}/latest?references=none`);
    const ref = meta.status === 200 ? structureRef(meta.text, { agency, id: dsd }) : { agency, id: dsd };
    const s = await get(`${REST}/datastructure/${ref.agency}/${ref.id}/latest?references=none`);
    if (s.status !== 200) { console.log(`FAIL  ${tag} structure ${ref.agency}/${ref.id} HTTP ${s.status} (dataflow metadata HTTP ${meta.status})`); continue; }
    const dims = dimensions(s.text);
    if (dims.length === 0) { console.log(`FAIL  ${tag} no dimensions found in structure (${s.text.length} bytes)`); continue; }
    const key = dims.map((d) => (d === 'FREQ' ? 'A' : d === 'TERRITORIAL_LEVEL' ? 'TL2' : '')).join('.');
    const url = `${REST}/data/${agency},${dsd}@${df},/${key}?startPeriod=2019&dimensionAtObservation=AllDimensions&format=csvfilewithlabels`;
    const d = await get(url, 'text/csv');
    if (d.status === 200) {
      const file = join(dir, `${dsd}__${df}.csv`);
      writeFileSync(file, d.text);
      console.log(`OK    ${tag} dims=[${dims.join(',')}] key=${key} ${d.text.length} bytes -> ${file}`);
    } else {
      console.log(`FAIL  ${tag} dims=[${dims.join(',')}] key=${key} HTTP ${d.status} ${d.text.slice(0, 60).replace(/\s+/g, ' ')}`);
    }
  } catch (e) {
    console.log(`FAIL  ${tag} ${e.message}`);
  }
}
console.log('finished');
