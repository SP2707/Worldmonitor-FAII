// OECD regional statistics via the SDMX REST API (open, no key).
// Dataflows live under agency OECD.CFE.EDS. The data key follows the DSD
// dimension order: FREQ.TERRITORIAL_LEVEL.REF_AREA.TERRITORIAL_TYPE.MEASURE.ACTIVITY.PRICES.UNIT_MEASURE
// (checked against the downloaded DSD for DSD_REG_ECO@DF_GDP).
//
// Regions are matched to our divisions conservatively:
//   1. the division's NUTS code equals the OECD REF_AREA (DE, FR, IT), else
//   2. the normalised region name equals the normalised division name or an alias.
// Anything that does not match is skipped, never guessed.

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIVISIONS } from '../_registry.mjs';
import { parseCsv } from '../_csv.mjs';
import { curlFetch } from '../_curl.mjs';

const BASE = 'https://sdmx.oecd.org/public/rest/data';

export const ISO3_TO_ISO2 = Object.freeze({
  ARE: 'AE', CAN: 'CA', CHN: 'CN', DEU: 'DE', FRA: 'FR', GBR: 'GB', ISR: 'IL', IND: 'IN',
  ITA: 'IT', JPN: 'JP', KOR: 'KR', RUS: 'RU', SAU: 'SA', UKR: 'UA', USA: 'US',
});

// OECD name -> our division name, only where the two genuinely differ.
// Extend from the "unmatched" list printed by `node scripts/oecd-match-report.mjs`.
export const NAME_ALIASES = Object.freeze({
  'IN:national capital territory of delhi': 'delhi',
  'IN:orissa': 'odisha',
  'IN:uttaranchal': 'uttarakhand',
  'JP:gunma': 'gumma', // REGOFI spells it Gunma, other OECD files Gumma
});

export const ISO2_TO_ISO3 = Object.freeze(Object.fromEntries(Object.entries(ISO3_TO_ISO2).map(([a, b]) => [b, a])));

// OECD REF_AREA code -> registry division id, for regions whose names collide or differ too much for name matching
// (e.g. "Moscow Oblast" and "City of Moscow" both normalise to "moscow"). A division listed here is NEVER name-matched.
// Several codes = the division is the sum of those OECD regions (only used by additive series).
export const CODE_MAP = Object.freeze({
  'RU-MOW': ['RU18'], 'RU-MOS': ['RU10'], 'RU-SPE': ['RU29'], 'RU-CU': ['RU48'], 'RU-UD': ['RU47'], 'RU-ME': ['RU44'],
  'RU-BA': ['RU43'], 'RU-CE': ['RU41'], 'RU-KC': ['RU39'], 'RU-KB': ['RU38'], 'RU-CHU': ['RU83'], 'RU-SA': ['RU75'],
  'RU-TY': ['RU65'], 'RU-BU': ['RU64'], 'RU-AL': ['RU63'], 'RU-KHM': ['RU60'], 'RU-ULY': ['RU56'], 'RU-KO': ['RU20'],
  'RU-KK': ['RU66'], 'RU-AD': ['RU30'], 'RU-KL': ['RU31'], 'RU-DA': ['RU36'], 'RU-IN': ['RU37'], 'RU-SE': ['RU40'],
  'RU-KR': ['RU19'], 'RU-MO': ['RU45'], 'RU-TA': ['RU46'], 'RU-ALT': ['RU67'], 'RU-KEM': ['RU71'], 'RU-NEN': ['RU22'],
  'RU-YAN': ['RU61'], 'RU-ZAB': ['RU68'], 'RU-YEV': ['RU82'], 'RU-KAM': ['RU76'],
  'GB-ENG': ['UKC', 'UKD', 'UKE', 'UKF', 'UKG', 'UKH', 'UKI', 'UKJ', 'UKK'], // England = its nine regions (additive series only)
  'GB-SCT': ['UKM'], 'GB-WLS': ['UKL'], 'GB-NIR': ['UKN'],
});

export function normName(s) {
  return String(s ?? '')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/\b(prefecture|province|state|region|autonomous|municipality|oblast|republic of|of)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, '');
}

function divisionNameKeys(div) {
  const keys = new Set([normName(div.name)]);
  const paren = /\(([^)]+)\)/.exec(div.name);
  if (paren) keys.add(normName(paren[1]));
  return keys;
}

/**
 * Pick the newest numeric observation per REF_AREA from parsed CSV rows.
 * @returns {Map<string,{value:number,year:number,name:string,country:string,level:string}>}
 */
export function latestByArea(rows, { filter = {}, minYear = 0 } = {}) {
  const best = new Map();
  for (const r of rows) {
    let ok = true;
    for (const [k, v] of Object.entries(filter)) if (Array.isArray(v) ? !v.includes(r[k]) : r[k] !== v) { ok = false; break; }
    if (!ok) continue;
    const raw = r.OBS_VALUE;
    if (raw === '' || raw == null) continue;
    let v = Number(raw);
    if (!Number.isFinite(v)) continue;
    const year = Number(r.TIME_PERIOD);
    if (!Number.isFinite(year) || year < minYear) continue;
    const mult = Number(r.UNIT_MULT);
    if (Number.isFinite(mult) && mult !== 0) v *= 10 ** mult;
    const cur = best.get(r.REF_AREA);
    if (!cur || year > cur.year) {
      best.set(r.REF_AREA, { value: v, year, name: r['Reference area'] || r.REF_AREA, country: r.COUNTRY || ISO2_TO_ISO3[String(r.REF_AREA).slice(0, 2)], level: r.TERRITORIAL_LEVEL });
    }
  }
  return best;
}

/**
 * Match latest-by-area entries to registry divisions.
 * @param {Map} byArea
 * @param {{ additive?:boolean, countries?:string[] }} opts additive=false means a multi-code division is skipped
 * @returns {{ matched: {div:object, value:number, year:number, regions:string[]}[], unmatched: string[] }}
 */
export function matchDivisions(byArea, { additive = true, countries } = {}) {
  const byName = new Map(); // `${iso2}:${normName}` -> area code
  const claimed = new Set(Object.values(CODE_MAP).flat()); // areas reserved for explicit mappings are never name-matched
  for (const [code, e] of byArea) {
    if (claimed.has(code)) continue;
    const iso2 = ISO3_TO_ISO2[e.country];
    if (!iso2) continue;
    const key = `${iso2}:${normName(e.name)}`;
    if (!byName.has(key)) byName.set(key, code);
  }
  const used = new Set();
  const matched = [];
  for (const div of DIVISIONS) {
    if (countries && !countries.includes(div.country)) continue;
    let codes = null;
    const mapped = CODE_MAP[div.id];
    if (mapped) {
      if (mapped.every((c) => byArea.has(c)) && (additive || mapped.length === 1)) codes = mapped;
    } else if (div.nuts) {
      const want = Array.isArray(div.nuts) ? div.nuts : [div.nuts];
      if (want.every((c) => byArea.has(c)) && (additive || want.length === 1)) codes = want;
    }
    if (!codes && !mapped) {
      let code = null;
      for (const k of divisionNameKeys(div)) {
        code = byName.get(`${div.country}:${k}`) ?? null;
        if (code) break;
      }
      if (!code) {
        for (const [alias, target] of Object.entries(NAME_ALIASES)) {
          const [cc, from] = alias.split(':');
          if (cc === div.country && divisionNameKeys(div).has(normName(target))) {
            code = byName.get(`${cc}:${normName(from)}`) ?? null;
            if (code) break;
          }
        }
      }
      if (code) codes = [code];
    }
    if (!codes) continue;
    const parts = codes.map((c) => byArea.get(c));
    if (new Set(parts.map((p) => p.year)).size !== 1) continue; // never add different years
    for (const c of codes) used.add(c);
    matched.push({ div, value: parts.reduce((a, p) => a + p.value, 0), year: parts[0].year, regions: codes });
  }
  const unmatched = [...byArea.entries()]
    .filter(([code, e]) => !used.has(code) && (!countries || countries.includes(ISO3_TO_ISO2[e.country])) && ISO3_TO_ISO2[e.country])
    .map(([code, e]) => `${e.country} ${code} ${e.name}`);
  return { matched, unmatched };
}

/** Build the SDMX key and the matching client-side filter for the regional DSDs (all share the same 8 dimensions). */
export function oecdSeries({ measure, prices, unit, activity = '_T', fallbackKeys = [] }) {
  const plain = (level) => `A.${level}...${measure}.${activity}.${prices}.${unit}`;
  return {
    keys: [plain, ...fallbackKeys], // tried in order; the first that answers wins
    filter: { MEASURE: measure, ACTIVITY: activity, PRICES: prices, UNIT_MEASURE: unit },
  };
}

/**
 * One request for several series at once, using SDMX '+' lists. NOT verified against OECD: a live run answered
 * HTTP 500 for it, so it is only ever a fallback after the plain single-series key.
 */
export const GDP_FLOW_KEY = (level) => `A.${level}...GDP+POP._T.V+_Z.USD_PPP+USD_PPP_PS+PS`;

export const MIN_GAP_MS = 6000;           // pause between OECD network requests (OECD throttles bursts; limit unknown)
export const RETRY_DELAYS_MS = [8_000, 20_000]; // after HTTP 429 / 5xx
let requestedBefore = false;              // module-wide: first request of the process goes out immediately

async function fetchWithRetry(fetchFn, url, { sleep }) {
  let lastErr;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    if (requestedBefore) await sleep(attempt === 0 ? MIN_GAP_MS : RETRY_DELAYS_MS[attempt - 1]);
    else if (attempt > 0) await sleep(RETRY_DELAYS_MS[attempt - 1]);
    requestedBefore = true;
    try {
      const resp = await fetchFn(url, {
        // Accept: text/csv is required: with no Accept header OECD answers 500 (checked live from Node with scripts/oecd-live-check.mjs).
        headers: { Accept: 'text/csv', 'User-Agent': 'worldmonitor-faii-subnational/1.0' },
        signal: AbortSignal.timeout(120_000),
        timeoutMs: 120_000,
      });
      if (resp.ok) return await resp.text();
      lastErr = new Error(resp.status === 429 ? 'HTTP 429 (OECD rate limit)' : `HTTP ${resp.status}`);
      if (resp.status !== 429 && resp.status < 500) break; // 4xx other than 429 will not improve on retry
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

const DEFAULT_CACHE_DIR = join(process.cwd(), '.cache', 'oecd');
const STALE_OK_MS = 30 * 86400_000;

function cachePath(dir, url) {
  return join(dir, `${createHash('sha1').update(url).digest('hex')}.csv`);
}
function readCache(dir, url, maxAgeMs, nowMs) {
  if (!dir) return null;
  try {
    const f = cachePath(dir, url);
    if (nowMs - statSync(f).mtimeMs > maxAgeMs) return null;
    return readFileSync(f, 'utf8');
  } catch { return null; }
}
function writeCache(dir, url, text) {
  if (!dir) return;
  try { mkdirSync(dir, { recursive: true }); writeFileSync(cachePath(dir, url), text); } catch { /* cache is best effort */ }
}

/**
 * @param {{ id?:string, dataflow:string, metric:string, unit:string, key:(level:string)=>string,
 *   filter?:object, levels?:{level:string,countries?:string[]}[], additive?:boolean, yearsBack?:number,
 *   scale?:number }} spec
 *   dataflow e.g. 'DSD_REG_ECO@DF_GDP'. levels default: TL2 for all, TL3 only for JP and KR (their first-level divisions are OECD TL3).
 */
export function createOecdProvider(spec) {
  const id = spec.id ?? `oecd:${spec.dataflow}:${spec.metric}`;
  const keys = spec.keys ?? [spec.key];
  const levels = spec.levels ?? [{ level: 'TL2' }, { level: 'TL3', countries: ['JP', 'KR'] }];
  return {
    id,
    async run(ctx) {
      // OECD rejects Node's built-in fetch (HTTP 500) but serves curl; see _curl.mjs.
      const fetchFn = ctx.fetchFn ?? curlFetch;
      const sleep = ctx.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
      const thisYear = new Date(ctx.nowMs ?? Date.now()).getUTCFullYear();
      const start = thisYear - (spec.yearsBack ?? 10);
      const nowMs = ctx.nowMs ?? Date.now();
      const cacheDir = ctx.cacheDir === undefined ? (ctx.env?.OECD_CACHE_DIR || (process.env.NODE_TEST_CONTEXT ? null : DEFAULT_CACHE_DIR)) : ctx.cacheDir; // under node --test the real cache is never read
      const freshMs = (Number(ctx.env?.OECD_CACHE_HOURS) || 12) * 3600_000;
      const observations = [];
      const taken = new Set();
      const errors = [];
      const memo = new Map(); // same URL for several levels/series in this run = one network request
      for (const lv of levels) {
        try {
          let text = null;
          const failures = [];
          for (const keyFn of keys) {
            const url = `${BASE}/${spec.agency ?? 'OECD.CFE.EDS'},${spec.dataflow},/${keyFn(lv.level)}`
              + `?startPeriod=${start}&dimensionAtObservation=AllDimensions&format=csvfilewithlabels`;
            text = memo.get(url) ?? readCache(cacheDir, url, freshMs, nowMs);
            if (text != null) { memo.set(url, text); break; }
            if (ctx.deadlineMs && Date.now() > ctx.deadlineMs) { failures.push('category time budget exhausted'); break; }
            try {
              text = await fetchWithRetry(fetchFn, url, { sleep });
              writeCache(cacheDir, url, text);
              memo.set(url, text);
              break;
            } catch (err) {
              failures.push(err.message);
              text = readCache(cacheDir, url, STALE_OK_MS, nowMs); // serve older data rather than none
              if (text != null) break;
            }
          }
          if (text == null) throw new Error(failures.join(' / '));
          const rows = parseCsv(text);
          const byArea = latestByArea(rows, { filter: { ...(lv.level ? { TERRITORIAL_LEVEL: lv.level } : {}), ...(spec.filter ?? {}) } });
          const { matched } = matchDivisions(byArea, { additive: spec.additive !== false, countries: lv.countries });
          for (const m of matched) {
            if (taken.has(m.div.id)) continue;
            taken.add(m.div.id);
            observations.push({
              divisionId: m.div.id,
              metric: spec.metric,
              value: m.value * (spec.scale ?? 1),
              unit: spec.unit,
              year: m.year,
              source: id,
              sourceUrl: `https://data-explorer.oecd.org/?lc=en&df[ds]=dsDisseminateFinalDMZ&df[id]=${encodeURIComponent(spec.dataflow)}&df[ag]=${spec.agency ?? 'OECD.CFE.EDS'}`,
              scope: 'division',
              method: m.regions.length > 1 ? 'sum_of_children' : 'direct',
            });
          }
        } catch (err) {
          errors.push(`${lv.level}: ${err.message}`);
        }
      }
      if (observations.length === 0 && errors.length) throw new Error(`OECD ${spec.dataflow}: ${errors.join('; ')}`);
      return { observations };
    },
  };
}
