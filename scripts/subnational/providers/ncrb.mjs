// NCRB "Crime in India 2022", Chapter 2A, Table 2A.1 "Murder Cases - 2020-2022" (State/UT-wise, 36 rows).
// The table was extracted from the official Volume 1 PDF (published 2023-12-08, ncrb.gov.in) into
// docs/samples/national/ncrb_2022_table_2A1_murder.csv by scripts/extract-ncrb-murder.mjs; the provider reads that CSV.
// 'Rate of Murder (2022)' is NCRB's own figure: cases per one lakh (100,000) mid-year projected population (2022), IPC Sec.302.
// Definition differs slightly from Eurostat ICCS0101 (intentional homicide); flagged in the note.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseCsv } from '../_csv.mjs';

export const NCRB_PAGE = 'https://ncrb.gov.in/crime-in-india-year-wise.html?year=2022&keyword=';
export const NAME_TO_ID = Object.freeze({
  'Andhra Pradesh': 'IN-AP', 'Arunachal Pradesh': 'IN-AR', Assam: 'IN-AS', Bihar: 'IN-BR', Chhattisgarh: 'IN-CG', Goa: 'IN-GA',
  Gujarat: 'IN-GJ', Haryana: 'IN-HR', 'Himachal Pradesh': 'IN-HP', Jharkhand: 'IN-JH', Karnataka: 'IN-KA', Kerala: 'IN-KL',
  'Madhya Pradesh': 'IN-MP', Maharashtra: 'IN-MH', Manipur: 'IN-MN', Meghalaya: 'IN-ML', Mizoram: 'IN-MZ', Nagaland: 'IN-NL',
  Odisha: 'IN-OD', Punjab: 'IN-PB', Rajasthan: 'IN-RJ', Sikkim: 'IN-SK', 'Tamil Nadu': 'IN-TN', Telangana: 'IN-TS', Tripura: 'IN-TR',
  'Uttar Pradesh': 'IN-UP', Uttarakhand: 'IN-UK', 'West Bengal': 'IN-WB', 'A&N Islands': 'IN-AN', Chandigarh: 'IN-CH',
  'D&N Haveli and Daman & Diu': 'IN-DH', Delhi: 'IN-DL', 'Jammu & Kashmir': 'IN-JK', Ladakh: 'IN-LA', Lakshadweep: 'IN-LD',
  Puducherry: 'IN-PY',
});

/** Parse text from `pdftotext -layout` of Volume 1 -> [{name, cases2022, population_lakh, rate}] (Table 2A.1 only). */
export function parseMurderTable(text) {
  const start = text.indexOf('Murder Cases - 2020-2022', text.indexOf('TABLE 2A.1'));
  if (start < 0) throw new Error('NCRB: Table 2A.1 not found');
  const end = text.indexOf('TOTAL ALL INDIA', start);
  const lines = text.slice(start, end).split('\n');
  const rows = [];
  let pendingName = null;
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    const num = /^\s*(\d{1,2})\s+([A-Za-z].*?)\s{2,}(\d+)\s+(\d+)\s+(\d+)\s+([\d.]+)\s+([\d.]+)\s+(-|[\d.]+)\s*$/.exec(ln);
    if (num) { rows.push({ name: num[2].trim(), cases2022: Number(num[5]), population_lakh: Number(num[6]), rate: Number(num[7]) }); pendingName = null; continue; }
    // wrapped label: "D&N Haveli and" / "31   Daman & Diu   13 14 16 12.0 1.3 88.9"
    const cont = /^\s*(\d{1,2})\s{2,}(\d+)\s+(\d+)\s+(\d+)\s+([\d.]+)\s+([\d.]+)\s+(-|[\d.]+)\s*$/.exec(ln);
    if (cont && pendingName) { rows.push({ name: pendingName, cases2022: Number(cont[4]), population_lakh: Number(cont[5]), rate: Number(cont[6]) }); pendingName = null; continue; }
    const t = ln.trim();
    if (/^D&N Haveli and$/.test(t)) pendingName = 'D&N Haveli and Daman & Diu';
  }
  return rows;
}

export function createNcrbMurderProvider({ id = 'ncrb:crime-in-india-2022:2A.1', path = null } = {}) {
  return {
    id,
    async run() {
      const file = path ?? resolve(process.cwd(), 'docs/samples/national/ncrb_2022_table_2A1_murder.csv');
      if (!existsSync(file)) throw new Error('NCRB table CSV missing: run scripts/extract-ncrb-murder.mjs on the Crime in India 2022 Vol.1 PDF');
      const observations = [];
      for (const r of parseCsv(readFileSync(file, 'utf8'))) {
        const divisionId = NAME_TO_ID[r.state_ut];
        const rate = Number(r.rate_per_lakh);
        if (!divisionId || !Number.isFinite(rate)) continue;
        observations.push({
          divisionId, metric: 'homicide_rate_per_100k', value: rate, unit: 'murder cases per 100,000 mid-year projected population (NCRB, IPC Sec.302)',
          year: 2022, source: id, sourceUrl: NCRB_PAGE, scope: 'division', method: 'direct',
          note: `NCRB Crime in India 2022 Table 2A.1 (${r.cases_2022} cases, population ${r.population_lakh} lakh); IPC murder as registered by state police - not identical to ICCS intentional homicide`,
        });
      }
      if (!observations.length) throw new Error('NCRB: no rows matched');
      return { observations };
    },
  };
}
