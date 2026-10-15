# Open data providers

`scripts/providers/` holds a keyless provider layer: a registry of public endpoints, five shared adapters, and one seeder that fetches them all and writes a single summary document.

* Registry: `scripts/providers/registry*.mjs` — **489 entries on 489 distinct hosts** (483 distinct publishers), 486 of them new to `scripts/egress-allowlist.json`.
* Seeder: `scripts/seed-open-providers.mjs` (tier 2 in `scripts/seed-tiers.config.json`), canonical key `providers:open-data:v1`.
* Report: `node scripts/providers-status.mjs`.

## What "working" means, and what has not been verified

A provider counts as **connected** only if the request returns HTTP 2xx *and* the adapter extracts real data (HTML error pages, truncated JSON and empty bodies count as failures).

**No endpoint in the registry has been fetched yet.** The build environment had no outbound internet, so everything is tested against fixtures and URL-shape rules, not live responses. I registered 489 rather than 350 so that a ~72% hit rate would still
reach 350; the real rate is unknown until you run it on your network:

```
node scripts/providers-status.mjs --live --failing      # fetch everything now, list every failure with its reason (a few minutes)
node scripts/seed-open-providers.mjs                    # write providers:open-data:v1
node scripts/providers-status.mjs                       # read the last seeded result
```

Each entry carries `conf` (h/m/l), which is **my own estimate** of how likely the URL and response shape are correct, not a measurement: 296 high, 190 medium, 3 low.
Expect the medium group to contain most of the misses (renamed datasets, moved APIs, rate limits).

## What is in it

| Kind | Entries | What each one yields |
| --- | ---: | --- |
| `indicator` | 164 | A real number or series (weather, hazards, energy, transport, cyber, health, science feeds). The most useful group. |
| `catalog` | 125 | Open-data portals (CKAN, Socrata, OpenDataSoft, uData): dataset counts and recent dataset names. Proves the portal is reachable; says little by itself. |
| `feed` | 62 | RSS/Atom/RDF headlines (government, agencies, research). |
| `chain` | 58 | Public blockchain node heads (JSON-RPC). Reachability / block height only. |
| `market` | 55 | Exchange and trading-venue public tickers/status. Reachability / a price or status. |
| `status` | 25 | Service status pages (Statuspage). Outage signal, low analytic value. |

By my own judgement, 226 (indicators + feeds) carry substantive content and 263 (catalogue counts, chain heads, exchange tickers, status pages) mostly prove reachability. If you count "providers" strictly as sources of substantive data, the honest target is the 226, not the 489.

Rules enforced by `tests/providers-registry.test.mjs`: every host is on the egress allowlist, no sensitive host, no credentials or API keys in URLs, no auth headers, unique ids, and the URL shape for each portal family (CKAN `package_search`, Socrata `/api/views`, etc.).

## Adapters (`scripts/providers/_adapters.mjs`)

`ckan`, `socrata`, `ods`, `udata` (portal families), `json` (JSON path extraction / summary), `text`, `csv`, `rss`, `statuspage`, `jsonrpc`. URL templates support `{YMD}`, `{YMD-N}`, `{YYYYMMDD}`, `{Y}`, `{M}`, `{D}`.
A 400 ms gap between requests to the same host, one retry on 408/425/5xx/timeout/network error, one fixed `User-Agent` (the project's `CHROME_UA`, never rotated), 4 MB cap per response body.

## Privacy and network behaviour

No credentials, no account creation, no residential proxies. Traffic uses the normal `fetch`, so `SEED_TOR=1` routes it through Tor like every other seeder (Tor remains opt-in; some public portals block Tor exit nodes, which will show up as failures).

## Adding a provider

Add an entry to the matching `registry-*.mjs` with a literal `url:` (the attribution scanner reads it), run `node --test tests/providers-registry.test.mjs`, add the host to `scripts/egress-allowlist.json`, then `node scripts/providers-status.mjs --live --only <id>`. Do not add a key-bearing endpoint; the validator will reject it.

## Known gaps

* The payload is a summary document. **No MCP tool exposes `providers:open-data:v1` yet**; read it with `providers-status.mjs` or add a cache tool.
* `shared/source-attribution-manifest.json` is **out of sync with the scanner** (199 manifest hosts no longer scanned, 557 scanned hosts missing) and `docs/source-attribution.mdx` is absent. This predates the provider layer and was not regenerated: `node scripts/source-attribution.mjs --write` needs an explicit `--retire <host>` per removed host, which is your call.
* Licences differ per publisher. This fork is AGPL-3.0-only; data terms are the publishers' own and have not been reviewed host by host.
