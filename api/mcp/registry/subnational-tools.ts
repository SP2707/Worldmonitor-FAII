// Subnational + national data over MCP. Reads the seeded Redis keys only (no HTTP endpoint, no network), same shape as
// render_map / get_sources. Every value carries unit, year, source and scope ('division' | 'national').
import { readJsonFromUpstash } from '../../_upstash-json.js';
import { CATEGORIES } from '../../../scripts/subnational/_registry.mjs';
import { CATEGORY_SLUGS, queryDivisions, queryCoverage, queryNational } from '../../../scripts/subnational/query.mjs';
import type { ToolDef } from '../types';

const NATIONAL_KEY = 'national:indicators:v1';

async function read(key: string): Promise<any | null> {
  try { return (await readJsonFromUpstash(key)) ?? null; } catch { return null; }
}

async function readCategories(slugs: string[]): Promise<Record<string, any>> {
  const out: Record<string, any> = {};
  await Promise.all(slugs.map(async (s) => { const key = CATEGORIES[s]?.key; out[s] = key ? await read(key) : null; }));
  return out;
}

function strList(v: unknown): string[] | undefined | 'invalid' {
  if (v === undefined || v === null) return undefined;
  return Array.isArray(v) && v.every((x) => typeof x === 'string') ? (v as string[]) : 'invalid';
}

const ANNOTATIONS = { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: false } as const;
const metricObj = {
  type: 'object',
  properties: { metric: { type: 'string' }, value: {}, unit: { type: ['string', 'null'] }, year: { type: ['number', 'null'] }, source: { type: ['string', 'null'] }, scope: { type: 'string' } },
};

export const SUBNATIONAL_TOOLS: ToolDef[] = [
  {
    name: 'get_subnational_data',
    _outputBudgetBytes: 262144,
    description:
      'Official first-level subnational statistics (states, provinces, regions) for one country or one division, across 10 categories: grp, fiscal, population, infrastructure, energy, hdi, patents, rule-of-law, fdi, military. 636 divisions in 48 countries; coverage is partial (call get_subnational_coverage first). Every metric carries unit, year, source, sourceUrl and scope. `missingCategories` lists categories not seeded yet, which is NOT the same as "no data exists". Divisions with no value for a metric simply omit it; nothing is estimated.',
    inputSchema: {
      type: 'object',
      properties: {
        country: { type: 'string', description: 'ISO 3166-1 alpha-2, e.g. "MY". Use this or divisionId.' },
        divisionId: { type: 'string', description: 'Division id such as "MY-01". Use this or country.' },
        categories: { type: 'array', items: { type: 'string', enum: [...CATEGORY_SLUGS] }, description: 'Default: all ten.' },
        metrics: { type: 'array', items: { type: 'string' }, description: 'Optional metric-name filter.' },
        limit: { type: 'number', description: 'Max divisions returned (default and cap 120).' },
      },
      required: [],
    },
    outputSchema: {
      type: 'object',
      properties: {
        divisionCount: { type: 'number' }, returned: { type: 'number' }, truncated: { type: 'boolean' },
        missingCategories: { type: 'array', items: { type: 'string' } }, generatedAt: { type: 'object' },
        divisions: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, country: { type: 'string' }, metricCount: { type: 'number' }, metrics: { type: 'array', items: metricObj } } } },
        error: { type: 'string' },
      },
    },
    annotations: ANNOTATIONS,
    _execute: async (params: Record<string, unknown>) => {
      const categories = strList(params.categories); const metrics = strList(params.metrics);
      if (categories === 'invalid' || metrics === 'invalid') return { error: 'categories and metrics must be arrays of strings' };
      const bad = categories?.find((c) => !CATEGORY_SLUGS.includes(c));
      if (bad) return { error: `unknown category "${bad}"; valid: ${CATEGORY_SLUGS.join(', ')}` };
      const payloads = await readCategories(categories?.length ? categories : CATEGORY_SLUGS);
      return queryDivisions(payloads, {
        country: typeof params.country === 'string' ? params.country : undefined,
        divisionId: typeof params.divisionId === 'string' ? params.divisionId : undefined,
        categories, metrics, limit: typeof params.limit === 'number' ? params.limit : undefined,
      });
    },
    _apiPaths: [],
  },
  {
    name: 'get_subnational_coverage',
    _outputBudgetBytes: 32768,
    description:
      'How much of the subnational layer is filled, per category: divisions with status ok / national_only / no_source, whether each category is seeded, and when. Optionally for one country. Call this before get_subnational_data to know what exists.',
    inputSchema: { type: 'object', properties: { country: { type: 'string', description: 'Optional ISO2 country code.' } }, required: [] },
    outputSchema: { type: 'object', properties: { country: { type: ['string', 'null'] }, countriesCovered: { type: 'array', items: { type: 'string' } }, categories: { type: 'array', items: { type: 'object' } }, error: { type: 'string' } } },
    annotations: ANNOTATIONS,
    _execute: async (params: Record<string, unknown>) => queryCoverage(await readCategories(CATEGORY_SLUGS), { country: typeof params.country === 'string' ? params.country : undefined }),
    _apiPaths: [],
  },
  {
    name: 'get_national_indicators',
    _outputBudgetBytes: 131072,
    description:
      'National-level indicators (World Bank, UNDP HDR, IMF; 38 indicators in 10 categories, ~215 economies) for up to 25 countries. All values have scope "national" with unit, year and source. Use alongside get_subnational_data to compare a division with its country.',
    inputSchema: {
      type: 'object',
      properties: {
        countries: { type: 'array', items: { type: 'string' }, description: 'ISO2 or ISO3 codes, max 25.' },
        metrics: { type: 'array', items: { type: 'string' }, description: 'Optional indicator-name filter, e.g. ["gdp_usd"].' },
      },
      required: ['countries'],
    },
    outputSchema: { type: 'object', properties: { generatedAt: { type: ['string', 'null'] }, countries: { type: 'array', items: { type: 'object' } }, unknown: { type: 'array', items: { type: 'string' } }, error: { type: 'string' } } },
    annotations: ANNOTATIONS,
    _execute: async (params: Record<string, unknown>) => {
      const countries = strList(params.countries); const metrics = strList(params.metrics);
      if (countries === 'invalid' || countries === undefined || metrics === 'invalid') return { error: 'countries (required) and metrics must be arrays of strings' };
      return queryNational(await read(NATIONAL_KEY), { countries, metrics });
    },
    _apiPaths: [],
  },
];
