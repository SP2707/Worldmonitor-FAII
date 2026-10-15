// Aggregates the open-provider registry and enforces its invariants.
import { PORTALS } from './registry-portals.mjs';
import { INDICATORS } from './registry-indicators.mjs';
import { FEEDS } from './registry-feeds.mjs';
import { INFRA } from './registry-infra.mjs';
import { MARKETS } from './registry-markets.mjs';

export const ADAPTERS = ['json', 'csv', 'rss', 'text', 'ckan', 'socrata', 'ods', 'udata', 'statuspage', 'jsonrpc'];
export const KINDS = ['catalog', 'indicator', 'feed', 'status', 'chain', 'market'];

export const PROVIDERS = [...PORTALS, ...INDICATORS, ...FEEDS, ...INFRA, ...MARKETS];

export function hostOfUrl(url) {
  return new URL(url.replace(/\{[^}]*\}/g, 'x')).hostname.toLowerCase();
}

/** Returns a list of human-readable problems; empty when the registry is consistent. */
export function validateRegistry(list = PROVIDERS) {
  const problems = [];
  const ids = new Set();
  const hosts = new Set();
  for (const p of list) {
    const where = p?.id ?? JSON.stringify(p).slice(0, 60);
    if (!p.id || !/^[a-z0-9][a-z0-9-]*$/.test(p.id)) problems.push(`${where}: bad id`);
    if (ids.has(p.id)) problems.push(`${where}: duplicate id`);
    ids.add(p.id);
    if (!p.name || !p.publisher) problems.push(`${where}: name/publisher required`);
    if (!KINDS.includes(p.kind)) problems.push(`${where}: bad kind ${p.kind}`);
    if (!ADAPTERS.includes(p.adapter)) problems.push(`${where}: bad adapter ${p.adapter}`);
    if (!['h', 'm', 'l'].includes(p.conf)) problems.push(`${where}: bad conf`);
    if (typeof p.url !== 'string' || !p.url.startsWith('https://')) { problems.push(`${where}: url must be https`); continue; }
    let host;
    try { host = hostOfUrl(p.url); } catch { problems.push(`${where}: unparsable url`); continue; }
    if (hosts.has(host)) problems.push(`${where}: second entry for host ${host}`);
    hosts.add(host);
    if (/[?&](api_?key|apikey|token|access_token|key)=/i.test(p.url)) problems.push(`${where}: credential-looking query parameter`);
    if (p.headers && Object.keys(p.headers).some((h) => /^(authorization|x-api-key|cookie)$/i.test(h))) problems.push(`${where}: credential header`);
  }
  return problems;
}

export const providerHosts = (list = PROVIDERS) => [...new Set(list.map((p) => hostOfUrl(p.url)))].sort();
