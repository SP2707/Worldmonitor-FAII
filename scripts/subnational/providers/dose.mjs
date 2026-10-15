// DOSE: global dataset of reported sub-national economic output (MCC-PIK, Zenodo record 16313760, V2.11, published
// 2025-08-06, licence CC-BY-4.0 per the Zenodo record). Region-level GRP as reported by national statistics, but the
// series END IN 2019/2020 depending on country, so everything taken from here is old and says so in its year.
// File: DOSE_V2.11.csv, columns checked on a real download 2026-10-14 (country, region, GID_0, GID_1, year, grp_lcu, pop,
// grp_pc_lcu, grp_pc_usd, ...). Only countries listed in COUNTRIES are used, matched through an explicit name table.
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseCsv } from '../_csv.mjs';
import { curlFetch } from '../_curl.mjs';

export const DOSE_URL = 'https://zenodo.org/api/records/16313760/files/DOSE_V2.11.csv/content';
export const DOSE_RECORD = 'https://zenodo.org/records/16313760';

// DOSE region name -> registry division id. Ukraine: DOSE "Kiev" is the oblast (population ~1.77 M, excludes the city).
export const COUNTRIES = Object.freeze({
  UKR: {
    currency: 'UAH',
    names: {
      'Autonomous Republic of Crimea': 'UA-43', Cherkasy: 'UA-71', Chernihiv: 'UA-74', Chernivtsi: 'UA-77', Dnipropetrovsk: 'UA-12',
      Donetsk: 'UA-14', 'Ivano-Frankivsk': 'UA-26', Kharkiv: 'UA-63', Kherson: 'UA-65', Khmelnytskiy: 'UA-68', Kiev: 'UA-32',
      Kirovohrad: 'UA-35', 'Kyiv City': 'UA-30', Luhansk: 'UA-09', Lviv: 'UA-46', Mykolayiv: 'UA-48', Odesa: 'UA-51', Poltava: 'UA-53',
      Rivne: 'UA-56', Sevastopol: 'UA-40', Sumy: 'UA-59', Ternopil: 'UA-61', Transcarpathia: 'UA-21', Vinnytsya: 'UA-05',
      Volyn: 'UA-07', Zaporizhzhya: 'UA-23', Zhytomyr: 'UA-18',
    },
  },
});

const num = (s) => { if (s === '' || s == null) return null; const v = Number(s); return Number.isFinite(v) ? v : null; };

/** Newest year per region with a value, separately for each variable (a region can have per-capita data later than totals). */
export function extractDose(rows, countries = COUNTRIES) {
  const best = new Map(); // `${divisionId}|${variable}` -> {value, year, region}
  for (const r of rows) {
    const spec = countries[r.GID_0];
    const id = spec?.names[r.region];
    if (!id) continue;
    const year = num(r.year);
    if (year == null) continue;
    for (const variable of ['grp_lcu', 'grp_pc_usd']) {
      const v = num(r[variable]);
      if (v == null) continue;
      const key = `${id}|${variable}`;
      const cur = best.get(key);
      if (!cur || year > cur.year) best.set(key, { divisionId: id, variable, value: v, year, region: r.region, currency: spec.currency });
    }
  }
  return [...best.values()];
}

export function createDoseProvider({ id = 'dose:v2.11', countries = COUNTRIES } = {}) {
  return {
    id,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? curlFetch;
      const nowMs = ctx.nowMs ?? Date.now();
      const dir = ctx.cacheDir === undefined ? (ctx.env?.DOSE_CACHE_DIR || (process.env.NODE_TEST_CONTEXT ? null : join(process.cwd(), '.cache', 'dose'))) : ctx.cacheDir;
      const file = dir ? join(dir, `${createHash('sha1').update(DOSE_URL).digest('hex')}.csv`) : null;
      let text = null;
      if (file) { try { if (nowMs - statSync(file).mtimeMs < 90 * 86400_000) text = readFileSync(file, 'utf8'); } catch { /* miss */ } } // static dataset
      if (text == null) {
        const r = await fetchFn(DOSE_URL, { headers: { 'User-Agent': 'worldmonitor-faii-subnational/1.0' }, timeoutMs: 600_000 });
        if (!r.ok) throw new Error(`DOSE download HTTP ${r.status}`);
        text = await r.text();
        if (file) { try { mkdirSync(dir, { recursive: true }); writeFileSync(file, text); } catch { /* best effort */ } }
      }
      const observations = [];
      for (const e of extractDose(parseCsv(text), countries)) {
        const base = { divisionId: e.divisionId, year: e.year, source: id, sourceUrl: DOSE_RECORD, scope: 'division', method: 'direct',
          note: `DOSE V2.11 (CC-BY-4.0): region GRP as reported by national statistics; series ends ${e.year}, not current` };
        if (e.variable === 'grp_lcu') observations.push({ ...base, metric: 'grp_lcu', value: e.value, unit: `${e.currency} (current prices)` });
        else observations.push({ ...base, metric: 'grp_per_capita_usd_market', value: e.value, unit: 'USD per person (current prices, market exchange rate)' });
      }
      if (!observations.length) throw new Error('DOSE: no configured region found in the file');
      return { observations };
    },
  };
}
