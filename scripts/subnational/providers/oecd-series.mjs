// OECD regional series used by the subnational seeders. One entry = one SDMX query + one client-side filter.
// Dimension order after REF_AREA/TERRITORIAL_TYPE comes from the CSV column order of the downloaded samples
// (docs/samples/oecd/*), which follows the DSD order. Codes were read from those samples, not guessed.
// Rates and shares are NOT additive (a division made of several OECD regions is skipped, never averaged blindly).
import { createOecdProvider } from './oecd.mjs';

const AGENCY_FLOWS = {
  lifeexp: 'DSD_REG_DEMO@DF_LIFE_EXP',
  status: 'DSD_REG_HEALTH@DF_STATUS',
  rates: 'DSD_REG_LAB@DF_RATES',
  inc: 'DSD_REG_ECO@DF_INC',
  attain: 'DSD_REG_EDU@DF_ATTAIN',
  safety: 'DSD_REG_SOC@DF_SAFETY',
  pat: 'DSD_REG_INNOV@DF_PAT',
};
const sample = (flow) => `${flow.replace('@', '__')}.csv`;

// pairs: [column, value] in DSD order after the 4 leading dims (FREQ, TERRITORIAL_LEVEL, REF_AREA, TERRITORIAL_TYPE).
const S = (category, flowKey, metric, unit, pairs, extra = {}) => ({
  id: `oecd:${flowKey}:${metric}`, category, dataflow: AGENCY_FLOWS[flowKey], sampleFile: sample(AGENCY_FLOWS[flowKey]),
  metric, unit, pairs, additive: false, ...extra,
});

export const SERIES = [
  // --- hdi: health, labour, income, education components
  S('hdi', 'lifeexp', 'life_expectancy_years', 'years', [['MEASURE', 'LFEXP'], ['AGE', 'Y0'], ['SEX', '_T'], ['UNIT_MEASURE', 'Y']]),
  S('hdi', 'status', 'infant_mortality_per_1000', 'deaths per 1,000 live births', [['MEASURE', 'MORT_INFANT'], ['AGE', 'Y_LT1'], ['SEX', '_T'], ['UNIT_MEASURE', 'DT_10P3BR_L']]),
  S('hdi', 'rates', 'unemployment_rate_pct', '% of labour force, age 15-64', [['MEASURE', 'UNE_RATE'], ['AGE', 'Y15T64'], ['SEX', '_T'], ['UNIT_MEASURE', 'PT_LF_SUB']], { wild: ['MEASURE', 'UNIT_MEASURE'] }),
  S('hdi', 'rates', 'employment_rate_pct', '% of population, age 15-64', [['MEASURE', 'EMP_RATIO'], ['AGE', 'Y15T64'], ['SEX', '_T'], ['UNIT_MEASURE', 'PT_POP_SUB']], { wild: ['MEASURE', 'UNIT_MEASURE'] }),
  S('hdi', 'inc', 'disposable_income_per_capita_usd_ppp', 'USD PPP per head (current prices)', [['MEASURE', 'B6N'], ['ACTIVITY', '_T'], ['PRICES', 'V'], ['UNIT_MEASURE', 'USD_PPP_PS']]),
  S('hdi', 'attain', 'tertiary_attainment_pct', '% of age 25-64 (ISCED 5-8)', [['MEASURE', 'NEAC_SHARE_EA'], ['AGE', 'Y25T64'], ['SEX', '_T'], ['EDUCATION_LEV', 'ISCED11_5T8'], ['STATISTICAL_OPERATION', 'MEAN'], ['UNIT_MEASURE', 'PT_POP_SEX_AGE']]),
  // --- patents (PCT = Patent Cooperation Treaty applications, by inventor region, all technologies)
  S('patents', 'pat', 'pct_patent_applications', 'applications (PCT, inventor region)', [['PATENT_AUTHORITIES', '9P50_1'], ['DATE_TYPE', 'APPLICATION'], ['MEASURE', 'PCT_PAT'], ['AGENT_ROLE', 'INVENTOR'], ['OECD_TECHNOLOGY_PATENT', '_T'], ['SECT_PERF', '_Z'], ['PRICES', '_Z'], ['SEX', '_Z'], ['UNIT_MEASURE', 'PATN']], { additive: true, wild: ['UNIT_MEASURE'] }),
  S('patents', 'pat', 'pct_patent_applications_per_million', 'applications per million inhabitants (OECD unit 10P6HB)', [['PATENT_AUTHORITIES', '9P50_1'], ['DATE_TYPE', 'APPLICATION'], ['MEASURE', 'PCT_PAT'], ['AGENT_ROLE', 'INVENTOR'], ['OECD_TECHNOLOGY_PATENT', '_T'], ['SECT_PERF', '_Z'], ['PRICES', '_Z'], ['SEX', '_Z'], ['UNIT_MEASURE', '10P6HB']], { wild: ['UNIT_MEASURE'] }),
  // --- rule-of-law: recorded homicide rate
  S('rule-of-law', 'safety', 'homicide_rate_per_100k', 'deaths per 100,000 inhabitants', [['MEASURE', 'HOMIC'], ['AGE', '_T'], ['SEX', '_T'], ['UNIT_MEASURE', 'CS_10P5PS']]),
];

// Request budget: OECD answers HTTP 429 after a modest number of queries (a live run did, after ~20 in a few hours; the exact
// limit is not documented here). So one request per dataflow family: all territorial levels in one answer (empty level = wildcard)
// and the dimensions that differ between sibling series (`wild`) left open; the client-side filter picks the exact series.
// Identical URLs are served from the disk cache, so sibling series share one download.
const keyOf = (s, level, openWild) => ['A', level, '', '', ...s.pairs.map(([c, v]) => (openWild && (s.wild ?? []).includes(c) ? '' : v))].join('.');
// --- fiscal: OECD disaggregated regional government finance (REGOFI). Different agency and dimensions
// (REF_AREA.MEASURE.SECTOR.COFOG.UNIT_MEASURE, no frequency / territorial level). COFOG '_Z' = total, not by function.
// Sector S1313RG (regional government) for JP, KR, FR, IT; S1312 (state government) for CA and DE: no registry country has both.
// Figures describe the REGIONAL GOVERNMENT's own accounts, not all public money spent in the region. Newest year in the file is 2022.
const REGOFI = { agency: 'OECD.CFE.RDG', dataflow: 'DSD_SNGF_DISAGG@DF_REGOFI', sampleFile: 'DSD_SNGF_DISAGG__DF_REGOFI.csv', levels: [{ level: null }], additive: false };
const F = (metric, measure, unit, label) => ({
  id: `oecd:regofi:${metric}`, category: 'fiscal', ...REGOFI, metric, unit: label, scale: 1,
  keys: [() => '..._Z.'], filter: { MEASURE: measure, SECTOR: ['S1313RG', 'S1312'], COFOG: '_Z', UNIT_MEASURE: unit }, explicit: true, pairs: [],
});
SERIES.push(
  F('subnational_govt_revenue_usd_ppp', 'R1', 'USD_PPP', 'USD PPP (regional government revenue)'),
  F('subnational_govt_expenditure_usd_ppp', 'E1', 'USD_PPP', 'USD PPP (regional government expenditure)'),
  F('subnational_govt_tax_revenue_usd_ppp', 'R11', 'USD_PPP', 'USD PPP (regional government tax revenue)'),
  F('subnational_govt_revenue_per_head_usd_ppp', 'R1', 'USD_PPP_PS', 'USD PPP per inhabitant (regional government revenue)'),
  F('subnational_govt_expenditure_per_head_usd_ppp', 'E1', 'USD_PPP_PS', 'USD PPP per inhabitant (regional government expenditure)'),
);

export function seriesKey(s) { return (level) => keyOf(s, level, false); }
export function seriesKeys(s) {
  const keys = [() => keyOf(s, '', true)]; // first: every level at once, siblings share the URL
  keys.push((level) => keyOf(s, level, false)); // fallback: exact key per level
  return keys;
}
export function seriesFilter(s) { return s.explicit ? s.filter : Object.fromEntries(s.pairs); }

export function oecdSeriesProvider(id, overrides = {}) {
  const s = SERIES.find((x) => x.id === id);
  if (!s) throw new Error(`unknown OECD series ${id}`);
  return createOecdProvider({
    id: s.id, dataflow: s.dataflow, metric: s.metric, unit: s.unit, agency: s.agency, levels: s.levels,
    keys: s.explicit ? s.keys : seriesKeys(s), filter: s.explicit ? s.filter : seriesFilter(s), additive: s.additive, ...overrides,
  });
}
export const seriesFor = (category) => SERIES.filter((s) => s.category === category).map((s) => oecdSeriesProvider(s.id));
