// World Bank Indicators API v2 (open, no key). NATIONAL values only: each is
// attached to every division of that country with scope 'national' so that
// consumers can see country context but cannot mistake it for division data.

import { DIVISIONS, COUNTRIES } from '../_registry.mjs';

/** WB v2 returns [meta, rows]; each row has country.id (ISO2), date, value. Keeps newest non-null per country. */
export function parseWorldBank(body) {
  const rows = Array.isArray(body) && Array.isArray(body[1]) ? body[1] : [];
  const best = new Map();
  for (const r of rows) {
    const cc = r?.country?.id;
    const v = Number(r?.value);
    if (!cc || r?.value == null || !Number.isFinite(v)) continue;
    const date = String(r.date ?? '');
    const cur = best.get(cc);
    if (!cur || date > cur.date) best.set(cc, { value: v, date });
  }
  return best;
}

/**
 * @param {{ metric:string, indicator:string, unit:string, source?:number, label?:string }[]} specs
 */
export function createWorldBankProvider(specs, { id = 'worldbank' } = {}) {
  return {
    id,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? globalThis.fetch;
      const observations = [];
      const errors = [];
      for (const spec of specs) {
        try {
          const url = `https://api.worldbank.org/v2/country/${COUNTRIES.join(';')}/indicator/${spec.indicator}`
            + `?format=json&mrnev=1&per_page=200${spec.source ? `&source=${spec.source}` : ''}`;
          const resp = await fetchFn(url, {
            headers: { Accept: 'application/json', 'User-Agent': 'worldmonitor-faii-subnational/1.0' },
            signal: AbortSignal.timeout(45_000),
          });
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const byCountry = parseWorldBank(await resp.json());
          for (const div of DIVISIONS) {
            const hit = byCountry.get(div.country);
            if (!hit) continue;
            observations.push({
              divisionId: div.id,
              metric: spec.metric,
              value: hit.value,
              unit: spec.unit,
              year: Number(hit.date) || null,
              source: `worldbank:${spec.indicator}`,
              sourceUrl: `https://data.worldbank.org/indicator/${spec.indicator}`,
              scope: 'national',
              method: 'direct',
              note: spec.label ? `national: ${spec.label}` : 'national value, not subnational',
            });
          }
        } catch (err) {
          errors.push(`${spec.indicator}: ${err.message}`);
        }
      }
      if (observations.length === 0 && errors.length > 0) throw new Error(errors.join('; '));
      return { observations, note: errors.length ? `partial: ${errors.join('; ')}` : undefined };
    },
  };
}
