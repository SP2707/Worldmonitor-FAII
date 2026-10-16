#!/usr/bin/env node
// One authenticated MCP round trip against the running server: initialize -> tools/list -> tools/call x3.
// Usage (PowerShell, same window where LOCAL_API_TOKEN is set, server running):  node scripts/mcp-smoke.mjs
// Env: LOCAL_API_TOKEN (required), MCP_URL (default http://127.0.0.1:46123/api/mcp). Prints PASS/FAIL per step; exit 1 on any FAIL.
const URL_ = process.env.MCP_URL || 'http://127.0.0.1:46123/api/mcp';
const token = process.env.LOCAL_API_TOKEN;
if (!token) { console.error('FAIL: LOCAL_API_TOKEN is not set in THIS window. Set it ($env:LOCAL_API_TOKEN="...") to the same value the server was started with.'); process.exit(1); }

let id = 0; let failed = 0;
async function rpc(method, params) {
  const res = await fetch(URL_, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', Authorization: `Bearer ${token}`, 'MCP-Protocol-Version': '2025-06-18' },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params }),
    signal: AbortSignal.timeout(60_000),
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { const m = text.match(/^data: (.+)$/m); try { body = JSON.parse(m?.[1] ?? ''); } catch { body = null; } }
  return { status: res.status, body, text };
}
const report = (name, ok, detail) => { if (!ok) failed++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  - ' + detail : ''}`); };
const payloadOf = (r) => { const t = r.body?.result?.content?.[0]?.text; try { return JSON.parse(t); } catch { return r.body?.result?.structuredContent ?? null; } };

const init = await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'wm-smoke', version: '1' } });
report('initialize', init.status === 200 && !!init.body?.result, init.status === 401 ? '401: token missing/wrong' : init.status === 503 ? '503: server has no LOCAL_API_TOKEN' : `HTTP ${init.status}`);
if (init.status !== 200) process.exit(1);

const list = await rpc('tools/list', {});
const names = (list.body?.result?.tools ?? []).map((t) => t.name);
report('tools/list', names.length > 0, `${names.length} tools`);
for (const n of ['get_subnational_data', 'get_subnational_coverage', 'get_national_indicators']) report(`tool registered: ${n}`, names.includes(n));

const cov = payloadOf(await rpc('tools/call', { name: 'get_subnational_coverage', arguments: { country: 'MY' } }));
const seededCats = (cov?.categories ?? []).filter((c) => c.seeded);
report('get_subnational_coverage (MY)', !!cov && !cov.error, cov?.error ?? `${seededCats.length}/10 categories seeded`);

const div = payloadOf(await rpc('tools/call', { name: 'get_subnational_data', arguments: { country: 'MY', categories: ['population'] } }));
const withData = (div?.divisions ?? []).filter((d) => d.metricCount > 0).length;
report('get_subnational_data (MY population)', !!div && !div.error && withData > 0, div?.error ?? `${withData}/${div?.divisionCount ?? 0} divisions have values${div?.missingCategories?.length ? '; NOT SEEDED: ' + div.missingCategories : ''}`);
const sample = div?.divisions?.find((d) => d.metricCount > 0)?.metrics?.[0];
if (sample) console.log('      sample:', JSON.stringify(sample));

const nat = payloadOf(await rpc('tools/call', { name: 'get_national_indicators', arguments: { countries: ['MY'], metrics: ['population'] } }));
report('get_national_indicators (MY)', !!nat && !nat.error && (nat.countries?.[0]?.indicatorCount ?? 0) > 0, nat?.error ?? JSON.stringify(nat?.countries?.[0]?.indicators?.[0] ?? {}));

const noTok = await fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' }, body: JSON.stringify({ jsonrpc: '2.0', id: 99, method: 'tools/list' }) });
report('unauthenticated call is rejected', noTok.status === 401, `HTTP ${noTok.status}`);

console.log(failed ? `\n${failed} step(s) FAILED` : '\nAll steps passed');
process.exit(failed ? 1 : 0);
