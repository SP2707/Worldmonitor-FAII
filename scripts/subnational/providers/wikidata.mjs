// Wikidata SPARQL provider (CC0, no key). Divisions are matched by their
// ISO 3166-2 code (property P300) - a deterministic join, not name guessing.
// Values are community-curated and sometimes stale; every observation keeps its
// reference year (P585) and a link to the item so the vintage is visible.

import { DIVISIONS, COUNTRIES, isExtraLayer } from '../_registry.mjs';

const ENDPOINT = 'https://query.wikidata.org/sparql';
const UA = 'worldmonitor-faii-subnational/1.0 (self-hosted research tool)';

/**
 * @param {string[]} codes ISO 3166-2 codes
 * @param {string} prop    e.g. 'P1082'
 * @param {boolean} withUnit read quantity unit via the value node
 */
export function buildDivisionQuery(codes, prop, withUnit) {
  const values = codes.map((c) => `"${c}"`).join(' ');
  const valuePart = withUnit
    ? `?st psv:${prop} ?vn . ?vn wikibase:quantityAmount ?v ; wikibase:quantityUnit ?u .
       OPTIONAL { ?u rdfs:label ?ul . FILTER(LANG(?ul) = "en") }`
    : `?st ps:${prop} ?v .`;
  return `SELECT ?code ?item ?v ?t ${withUnit ? '?ul' : ''} WHERE {
  VALUES ?code { ${values} }
  ?item wdt:P300 ?code .
  ?item p:${prop} ?st .
  ${valuePart}
  ?st wikibase:rank ?rank . FILTER(?rank != wikibase:DeprecatedRank)
  OPTIONAL { ?st pq:P585 ?t }
}`;
}

export function buildCountryQuery(iso2List, prop) {
  const values = iso2List.map((c) => `"${c}"`).join(' ');
  return `SELECT ?cc ?item ?v ?t WHERE {
  VALUES ?cc { ${values} }
  ?item wdt:P297 ?cc .
  ?item p:${prop} ?st . ?st ps:${prop} ?v .
  ?st wikibase:rank ?rank . FILTER(?rank != wikibase:DeprecatedRank)
  OPTIONAL { ?st pq:P585 ?t }
}`;
}

/** Keep, per key, the binding with the newest P585 (undated loses to dated). */
export function pickLatest(bindings, keyField) {
  const best = new Map();
  for (const b of bindings) {
    const key = b[keyField]?.value;
    const v = Number(b.v?.value);
    if (!key || !Number.isFinite(v)) continue;
    const t = b.t?.value ?? '';
    const cur = best.get(key);
    if (!cur || t > cur.t) best.set(key, { v, t, item: b.item?.value ?? '', unit: b.ul?.value ?? null });
  }
  return best;
}

async function sparql(fetchFn, query, timeoutMs = 60_000) {
  const resp = await fetchFn(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/sparql-results+json',
      'User-Agent': UA,
    },
    body: `query=${encodeURIComponent(query)}`,
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!resp.ok) throw new Error(`Wikidata SPARQL HTTP ${resp.status}`);
  const json = await resp.json();
  return json?.results?.bindings ?? [];
}

const qid = (uri) => String(uri).split('/').pop();
const yearOf = (t) => (t ? Number(String(t).slice(0, 4)) || null : null);

/**
 * @param {{ metric:string, prop:string, unit?:string, withUnit?:boolean, nationalMetric?:string }[]} specs
 *   nationalMetric: also read the same property from country items (P297) and
 *   attach it to every division of that country with scope 'national'.
 */
export function createWikidataProvider(specs, { id = 'wikidata' } = {}) {
  return {
    id,
    async run(ctx) {
      const fetchFn = ctx.fetchFn ?? globalThis.fetch;
      const codes = DIVISIONS.filter((d) => !isExtraLayer(d)).map((d) => d.id);
      const observations = [];
      const errors = [];
      for (const spec of specs) {
        try {
          const rows = await sparql(fetchFn, buildDivisionQuery(codes, spec.prop, !!spec.withUnit));
          const latest = pickLatest(rows, 'code');
          for (const [code, hit] of latest) {
            observations.push({
              divisionId: code,
              metric: spec.metric,
              value: hit.v,
              unit: spec.withUnit ? (hit.unit ?? 'unknown currency') : (spec.unit ?? null),
              year: yearOf(hit.t),
              source: `wikidata:${spec.prop}`,
              sourceUrl: hit.item ? `https://www.wikidata.org/wiki/${qid(hit.item)}` : null,
              scope: 'division',
              method: 'direct',
              note: 'community-curated; check year',
            });
          }
          if (spec.nationalMetric) {
            const crows = await sparql(fetchFn, buildCountryQuery([...COUNTRIES], spec.prop));
            const clatest = pickLatest(crows, 'cc');
            for (const div of DIVISIONS) {
              const hit = clatest.get(div.country);
              if (!hit) continue;
              observations.push({
                divisionId: div.id,
                metric: spec.nationalMetric,
                value: hit.v,
                unit: spec.unit ?? null,
                year: yearOf(hit.t),
                source: `wikidata:${spec.prop}`,
                sourceUrl: hit.item ? `https://www.wikidata.org/wiki/${qid(hit.item)}` : null,
                scope: 'national',
                method: 'direct',
              });
            }
          }
        } catch (err) {
          errors.push(`${spec.metric}: ${err.message}`);
        }
      }
      if (observations.length === 0 && errors.length > 0) throw new Error(errors.join('; '));
      return { observations, note: errors.length ? `partial: ${errors.join('; ')}` : undefined };
    },
  };
}
