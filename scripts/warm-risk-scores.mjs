#!/usr/bin/env node
// Fills `risk:scores:sebuf:v8` (and its stale twin), which the ciiChoropleth map layer reads.
// The server computes that key itself the first time anything calls get-risk-scores (600 s TTL),
// so no seeder ever wrote it. This asks the LOCAL sidecar once; run it every few minutes
// (scripts/seed-tiers.config.json does). Loopback only.
import { loadEnvFile } from './_seed-utils.mjs';

loadEnvFile(import.meta.url);
const token = process.env.LOCAL_API_TOKEN;
if (!token) {
  console.log('LOCAL_API_TOKEN not set - skipping (the sidecar refuses requests without it)');
  process.exit(0);
}
const url = `http://127.0.0.1:${process.env.LOCAL_API_PORT || '46123'}/api/intelligence/v1/get-risk-scores`;
try {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(90_000) });
  const body = await r.text();
  if (!r.ok) throw new Error(`HTTP ${r.status} ${body.slice(0, 120)}`);
  console.log(`warmed risk scores (${body.length} bytes)`);
} catch (err) {
  console.error(`FATAL: could not warm risk scores: ${err.message}`);
  process.exit(1);
}
