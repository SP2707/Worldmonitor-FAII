#!/usr/bin/env node
// Downloads REAL samples from national / global open sources so parsers can be written against what the servers
// actually return (nothing here is parsed into the pipeline). Each step is independent; a failure never stops the rest.
//   node scripts/collect-national-samples.mjs            # all steps
//   node scripts/collect-national-samples.mjs statcan    # one step: statcan | statcan-gfs | rbi | uk-cra | statcan-find | dose | japan | oecd-tl3-gdp
// Output: docs/samples/national/*   and a one-line verdict per step.
import { writeFileSync, mkdirSync } from 'node:fs';
import { curlFetch } from './subnational/_curl.mjs';

const OUT = 'docs/samples/national';
mkdirSync(OUT, { recursive: true });
const only = process.argv[2];
const UA = { 'User-Agent': 'worldmonitor-faii-subnational/1.0 (sample collection)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const step = async (name, fn) => {
  if (only && only !== name) return;
  try { console.log(`[${name}]`, await fn()); } catch (e) { console.log(`[${name}] FAILED: ${e.message}`); }
};
const get = (url, headers = {}, timeoutMs = 180_000) => curlFetch(url, { headers: { ...UA, ...headers }, timeoutMs });

await step('statcan', async () => {
  // Table 36-10-0222-01: GDP, expenditure-based, provincial and territorial, annual (1981-2024 when checked 2026-10-14).
  const meta = await get('https://www150.statcan.gc.ca/t1/wds/rest/getFullTableDownloadCSV/36100222/en');
  if (!meta.ok) return `metadata HTTP ${meta.status}`;
  const j = await meta.json();
  writeFileSync(`${OUT}/statcan_36100222_link.json`, JSON.stringify(j, null, 2));
  const zip = await get(j.object);
  if (!zip.ok) return `zip HTTP ${zip.status} (${j.object})`;
  const buf = Buffer.from(await zip.arrayBuffer());
  const { unzipSync } = await import('fflate');
  const files = unzipSync(new Uint8Array(buf));
  const names = Object.keys(files);
  for (const n of names) writeFileSync(`${OUT}/statcan_36100222_${n.replace(/[^A-Za-z0-9._-]/g, '_')}`, Buffer.from(files[n]));
  return `OK ${names.join(', ')} (${buf.length} bytes zip)`;
});

await step('statcan-gfs', async () => {
  // Table 10-10-0017-01: Canadian government finance statistics for the provincial and territorial governments (ends 2024 per the table list).
  const meta = await get('https://www150.statcan.gc.ca/t1/wds/rest/getFullTableDownloadCSV/10100017/en');
  if (!meta.ok) return `metadata HTTP ${meta.status}`;
  const j = await meta.json();
  const zip = await get(j.object);
  if (!zip.ok) return `zip HTTP ${zip.status} (${j.object})`;
  const { unzipSync } = await import('fflate');
  const files = unzipSync(new Uint8Array(Buffer.from(await zip.arrayBuffer())));
  for (const n of Object.keys(files)) writeFileSync(`${OUT}/statcan_10100017_${n.replace(/[^A-Za-z0-9._-]/g, '_')}`, Buffer.from(files[n]));
  return `OK ${Object.keys(files).join(', ')}`;
});

await step('rbi', async () => {
  // RBI "State Finances: A Study of Budgets" (published 2026-01-23): the e-STATES database workbook (link read from the RBI publication page).
  const url = 'https://rbidocs.rbi.org.in/rdocs/Publications/docs/ESTATES23012026AB138FB463474EBFBCC03A8FC878C45A.xlsx';
  const r = await get(url);
  if (!r.ok) return `HTTP ${r.status}`;
  const buf = Buffer.from(await r.arrayBuffer());
  writeFileSync(`${OUT}/rbi_estates_2026-01-23.xlsx`, buf);
  return `OK ${buf.length} bytes`;
});

await step('uk-cra', async () => {
  // HM Treasury Country and Regional Analysis 2025 (published 2025-11-19): chapter A tables and the database workbook.
  const files = {
    'uk_cra_2025_chapter_a.xlsx': 'https://assets.publishing.service.gov.uk/media/691b0990d140bbbaa59a28ad/CRA_2025_Chapter_A_tables.xlsx',
    'uk_cra_2025_database.xlsx': 'https://assets.publishing.service.gov.uk/media/691b09e484a267da57d705d2/CRA_2025_Database_for_Publication.xlsx',
  };
  const out = [];
  for (const [name, url] of Object.entries(files)) {
    const r = await get(url);
    if (!r.ok) { out.push(`${name}: HTTP ${r.status}`); continue; }
    const buf = Buffer.from(await r.arrayBuffer());
    writeFileSync(`${OUT}/${name}`, buf);
    out.push(`${name}: ${buf.length} bytes`);
  }
  return out.join('; ');
});

await step('statcan-find', async () => {
  // Lists StatCan tables whose title looks like provincial GDP or provincial government finance (title + end date only).
  const r = await get('https://www150.statcan.gc.ca/t1/wds/rest/getAllCubesListLite');
  if (!r.ok) return `HTTP ${r.status}`;
  const cubes = await r.json();
  const hits = cubes.filter((c) => /(provincial|province).*(government|gross domestic|revenue|expen)|government.*(provincial)|gross domestic product.*provincial/i.test(c.cubeTitleEn ?? ''));
  const lines = hits.map((c) => `${c.productId}\t${c.cubeEndDate}\t${c.cubeTitleEn}`);
  writeFileSync(`${OUT}/statcan_candidate_tables.tsv`, lines.join('\n'));
  return `OK ${hits.length} candidate tables of ${cubes.length} -> ${OUT}/statcan_candidate_tables.tsv`;
});

await step('dose', async () => {
  // DOSE: global subnational economic output (Zenodo). Try the newer record first, then the original.
  for (const rec of ['16313760', '7573249']) {
    const r = await get(`https://zenodo.org/api/records/${rec}`);
    if (!r.ok) { console.log(`  record ${rec}: HTTP ${r.status}`); continue; }
    const j = await r.json();
    const files = (j.files ?? []).map((f) => ({ key: f.key, size: f.size, link: f.links?.self }));
    writeFileSync(`${OUT}/dose_record_${rec}.json`, JSON.stringify({ title: j.metadata?.title, version: j.metadata?.version, published: j.metadata?.publication_date, license: j.metadata?.license, files }, null, 2));
    const csv = files.find((f) => /DOSE.*\.csv$/i.test(f.key));
    console.log(`  record ${rec}: ${j.metadata?.version ?? '?'} ${j.metadata?.publication_date ?? '?'} files: ${files.map((f) => `${f.key} (${f.size})`).join(', ')}`);
    if (!csv) continue;
    const d = await get(csv.link, {}, 600_000);
    if (!d.ok) { console.log(`  download HTTP ${d.status}`); continue; }
    writeFileSync(`${OUT}/${csv.key}`, Buffer.from(await d.arrayBuffer()));
    return `OK ${csv.key} from record ${rec}`;
  }
  return 'no DOSE csv obtained';
});

await step('japan', async () => {
  // Cabinet Office prefectural accounts index page: save it and list spreadsheet links (nothing is downloaded blindly).
  const r = await get('https://www.esri.cao.go.jp/jp/sna/data/data_list/kenmin/files/kenmin_top.html');
  if (!r.ok) return `HTTP ${r.status}`;
  const html = Buffer.from(await r.arrayBuffer());
  writeFileSync(`${OUT}/esri_kenmin_top.html`, html);
  const links = [...html.toString('utf8').matchAll(/href="([^"]+\.(?:xlsx?|zip|csv))"/gi)].map((m) => m[1]);
  writeFileSync(`${OUT}/esri_kenmin_links.txt`, links.join('\n'));
  return `OK ${links.length} spreadsheet/zip links -> ${OUT}/esri_kenmin_links.txt`;
});

await step('oecd-tl3-gdp', async () => {
  // Does OECD publish regional GDP at TL3 for Japan / Korea? One request; counts areas by country.
  await sleep(1000);
  const url = 'https://sdmx.oecd.org/public/rest/data/OECD.CFE.EDS,DSD_REG_ECO@DF_GDP,/A.TL3...GDP._T.V.USD_PPP?startPeriod=2016&dimensionAtObservation=AllDimensions&format=csvfilewithlabels';
  const r = await get(url, { Accept: 'text/csv' });
  if (!r.ok) return `HTTP ${r.status}`;
  const text = await r.text();
  writeFileSync(`${OUT}/oecd_gdp_tl3.csv`, text);
  const { parseCsv } = await import('./subnational/_csv.mjs');
  const rows = parseCsv(text);
  const by = {};
  for (const x of rows) { (by[x.COUNTRY] ??= { areas: new Set(), maxYear: 0 }); by[x.COUNTRY].areas.add(x.REF_AREA); by[x.COUNTRY].maxYear = Math.max(by[x.COUNTRY].maxYear, Number(x.TIME_PERIOD)); }
  return `OK ${rows.length} rows; JPN ${by.JPN?.areas.size ?? 0} areas (to ${by.JPN?.maxYear ?? '-'}), KOR ${by.KOR?.areas.size ?? 0} (to ${by.KOR?.maxYear ?? '-'}), IND ${by.IND?.areas.size ?? 0}, CHN ${by.CHN?.areas.size ?? 0}`;
});
