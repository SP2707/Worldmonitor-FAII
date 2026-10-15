#!/usr/bin/env node
// Live reachability check for docs/subnational-source-catalogue.json (candidate sources, not yet verified).
//   node scripts/probe-source-catalogue.mjs [--out docs/subnational-source-probe.json] [--only grp]
// Plain GET, one request per distinct URL, 4 at a time, honest User-Agent, 25 s timeout, body is never read.
// Goes through the Tor layer automatically when run with:  SEED_TOR=1 node --import ./scripts/shared/tor-preload.mjs ...
// A 2xx/3xx means "the host answered", not "the data is what we want". 401/403/429 often mean bot protection or a key.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const only = arg('--only'); const out = arg('--out');
const cat = JSON.parse(readFileSync(join(ROOT, 'docs/subnational-source-catalogue.json'), 'utf8')).sources.filter((s) => !only || s.category === only);
const urls = [...new Set(cat.map((s) => s.url))];
const UA = process.env.SEED_USER_AGENT || 'worldmonitor-faii-local-probe/1.0';

async function probe(url) {
  const t0 = Date.now(); const ac = new AbortController(); const timer = setTimeout(() => ac.abort(), 25_000);
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: '*/*' }, redirect: 'follow', signal: ac.signal });
    try { await r.body?.cancel(); } catch { /* ignore */ }
    return { status: r.status, ms: Date.now() - t0, final: r.url !== url ? r.url : undefined };
  } catch (e) { return { status: 0, ms: Date.now() - t0, error: String(e?.cause?.code || e?.message || e).slice(0, 80) }; }
  finally { clearTimeout(timer); }
}

const result = {}; let next = 0;
await Promise.all(Array.from({ length: 4 }, async () => { while (next < urls.length) { const u = urls[next++]; result[u] = await probe(u); const r = result[u]; console.log(String(r.status || 'ERR').padEnd(4), String(r.ms).padStart(6) + 'ms', u.slice(0, 110), r.error ?? ''); } }));

const verdict = (s) => (s >= 200 && s < 400 ? 'reachable' : [401, 403, 429].includes(s) ? 'answered-but-restricted' : 'unreachable');
const rows = cat.map((s) => ({ category: s.category, scope: s.scope, name: s.name, url: s.url, status: result[s.url].status, verdict: verdict(result[s.url].status) }));
const per = {};
for (const r of rows) { const p = (per[r.category] ??= { listed: 0, reachable: 0, restricted: 0, unreachable: 0 }); p.listed++; p[r.verdict === 'reachable' ? 'reachable' : r.verdict === 'unreachable' ? 'unreachable' : 'restricted']++; }
console.log('\ncategory           listed reachable restricted unreachable');
for (const [c, p] of Object.entries(per)) console.log(c.padEnd(18), String(p.listed).padStart(6), String(p.reachable).padStart(9), String(p.restricted).padStart(10), String(p.unreachable).padStart(11));
if (out) { writeFileSync(join(ROOT, out), JSON.stringify({ probedAt: new Date().toISOString(), rows }, null, 1)); console.log('wrote', out); }
