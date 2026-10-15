import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PROVIDERS, validateRegistry, providerHosts, KINDS } from '../scripts/providers/registry.mjs';
import { parseBody } from '../scripts/providers/_adapters.mjs';

const allow = JSON.parse(readFileSync(new URL('../scripts/egress-allowlist.json', import.meta.url), 'utf8'));
const approved = new Set(Object.keys(allow.approved).map((h) => h.toLowerCase()));

describe('open-provider registry', () => {
  it('is internally consistent (ids, https, one entry per host, no credentials)', () => {
    assert.deepEqual(validateRegistry(), []);
  });
  it('registers at least 350 distinct hosts and publishers', () => {
    assert.ok(providerHosts().length >= 350, `hosts: ${providerHosts().length}`);
    assert.ok(new Set(PROVIDERS.map((p) => p.publisher)).size >= 350);
  });
  it('covers every kind, and every kind is a known one', () => {
    for (const k of KINDS) assert.ok(PROVIDERS.some((p) => p.kind === k), k);
    assert.ok(PROVIDERS.every((p) => KINDS.includes(p.kind)));
  });
  it('every host is on the egress allowlist', () => {
    const missing = providerHosts().filter((h) => !approved.has(h));
    assert.deepEqual(missing, []);
  });
  it('no provider needs a key (nothing in the registry is marked sensitive)', () => {
    const sensitive = new Set(Object.keys(allow.sensitive ?? {}).map((h) => h.toLowerCase()));
    assert.deepEqual(providerHosts().filter((h) => sensitive.has(h)), []);
  });
  it('bodies are plain JSON-serialisable objects', () => {
    for (const p of PROVIDERS.filter((p) => p.body)) assert.doesNotThrow(() => JSON.stringify(p.body), p.id);
  });
  it('family adapters parse a canonical response for every entry that uses them', () => {
    const canon = {
      ckan: { success: true, result: { count: 1, results: [{ title: 't' }] } },
      socrata: { resultSetSize: 1, results: [{ resource: { name: 'n' } }] },
      ods: { total_count: 1, results: [{ dataset_id: 'd' }] },
      udata: { total: 1, data: [{ title: 't' }] },
      statuspage: { status: { indicator: 'none', description: 'ok' } },
      jsonrpc: { result: '0x1' },
    };
    for (const p of PROVIDERS.filter((p) => canon[p.adapter])) assert.doesNotThrow(() => parseBody(p, JSON.stringify(canon[p.adapter])), p.id);
  });
  it('family endpoints use the documented URL shapes', () => {
    for (const p of PROVIDERS.filter((p) => p.adapter === 'ckan')) assert.match(p.url, /\/api\/3\/action\/package_search\?/, p.id);
    for (const p of PROVIDERS.filter((p) => p.adapter === 'socrata')) assert.match(p.url, /\/api\/catalog\/v1\?/, p.id);
    for (const p of PROVIDERS.filter((p) => p.adapter === 'ods')) assert.match(p.url, /\/api\/explore\/v2\.1\/catalog\/datasets/, p.id);
    for (const p of PROVIDERS.filter((p) => p.adapter === 'statuspage')) assert.match(p.url, /\/api\/v2\/status\.json$/, p.id);
    for (const p of PROVIDERS.filter((p) => p.adapter === 'jsonrpc')) assert.ok(p.body?.method, p.id);
  });
});
