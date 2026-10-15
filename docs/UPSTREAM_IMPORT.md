# Upstream seeder import (2026-10-12)

The 25 seeders that the public upstream project (`koala73/worldmonitor`, commit `968eac6bb03a`, 2026-10-10) had and this repo did not were copied in, together with every helper file they need (31 files) and the tests that run without upstream's server code (7 files). After the copy this repo has 231 `scripts/seed-*.mjs` files (upstream: 217). Nothing here fetches from upstream at runtime; the only upstream-hosted endpoint the code can reach is `api.worldmonitor.app`, and `node scripts/audit-egress.mjs` fails unless `API_BASE_URL` is local.

**Licence.** Upstream is AGPL-3.0-only (see `LICENSE`). Copied files keep their original headers. If you ever offer this software to other people as a network service, AGPL section 13 requires you to give those users the corresponding source, including your changes.

## What was copied
- Seeders: `seed-bundle-yield-curves`, `seed-yield-curve-{au,ca,ch,de,gb,jp,no,se}`, `seed-yield-curves-shared` (library), `seed-us-cpi`, `seed-us-interest-rates`, `seed-us-treasury-par-yield`, `seed-world-cpi-{abs,estat,eurostat,imf}`, `seed-oecd-lt-rates`, `seed-cross-border-arrivals`, `seed-dtm-displacement`, `seed-imd-cyclone-marine`, `seed-live-video-resolved`, `seed-supply-vulnerability`, `seed-five-factor-scorecard`, `seed-market-alert-ledger`.
- One existing file was replaced by upstream's newer version: `seed-hs2-chokepoint-exposure.mjs` (needed by the supply-vulnerability registry).
- Shared core files that differ from upstream (`_seed-utils.mjs`, `_seed-contract.mjs`, `_upstash-rest.mjs`, `_bundle-runner.mjs`, `_content-age-helpers.mjs`, `lib/_upstash-pipeline.mjs`, `shared/publisher-families.js`) were NOT overwritten; every name the new seeders import from them was checked to exist in this repo's versions.

## Scheduling (`scripts/seed-tiers.config.json`)
- Tier 2: yield-curve bundle, US Treasury par yield, three keyless world-CPI seeders, cross-border arrivals, and five seeders gated by `requiresAnyEnv` (FRED_API_KEY, ESTAT_APPID, DTM_API_KEY, IMD_API_KEY, LIVE_VIDEO_PROXY_URL/PROXY_URL). Without those variables they are recorded as SKIP.
- Tier 3: supply-vulnerability, five-factor scorecard, market-alert ledger (derived; need other seeded keys).
- Not scheduled: files that are libraries, and `seed-oecd-lt-rates` (the yield-curve bundle already runs it).

## Known gaps
- `seed-live-video-resolved` passes 27 of 28 tests; the failing one expects upstream's stricter Redis HTTP 500 handling in `_upstash-rest.mjs`.
- None of the new seeders has been run against live sources from this environment; run them with `node scripts/seed-<name>.mjs` and check `node scripts/subnational-status.mjs`-style output before relying on them.
