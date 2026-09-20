# WorldMonitor-FAII (For AI Integration)

Headless build of WorldMonitor: no frontend, no Docker, no nginx. One Node
process that serves the intelligence-data API and MCP server directly.
Built for Alfred's Recon lane / tool manager.

This is a de-SaaS'd fork — see the parent project's `SELF_HOSTING.md` and
`ARCHITECTURE.md` for background. Clerk (auth) and Dodo Payments (billing)
have been removed; there are no accounts, tiers, or paywalls.

## Run it

```bash
npm install
LOCAL_API_TOKEN=$(openssl rand -hex 32) npm start
```

That's it. No Docker, no Redis account, no Convex are required to boot.
`npm start` compiles the ~150 API handlers (`docker/build-handlers.mjs`,
esbuild, a few seconds), auto-launches a local, in-process, Docker-free
Redis stand-in when `UPSTASH_REDIS_REST_URL` isn't set
(`scripts/local-redis-rest.mjs`, wired in by `scripts/start-with-local-redis.mjs`
— see "What's optional" below), and then starts the server
(`src-tauri/sidecar/local-api-server.mjs`) on `http://127.0.0.1:46123`
(override with `LOCAL_API_PORT`).

Verified this boots clean and serves real MCP tool calls with **zero**
API keys, zero Redis account, zero Convex configured — confirmed by actually
running it, not assumed.

## Auth

Every request needs the same token the server was started with, either as:

- `Authorization: Bearer <LOCAL_API_TOKEN>`, or
- `x-worldmonitor-local-token: <LOCAL_API_TOKEN>`

There is no default token — the server refuses all requests (503) if
`LOCAL_API_TOKEN` isn't set. Generate one random value per launch (or persist
one for Alfred's config) and pass it on every call. This is a local-only
shared secret, not a WorldMonitor account of any kind.

## MCP endpoint

`POST http://127.0.0.1:<port>/api/mcp` — standard MCP Streamable HTTP,
JSON-RPC 2.0. `tools/list` returns the full tool catalog (confirmed working:
real tools, real JSON schemas). This is almost certainly the integration
point for Alfred's tool manager — the upstream project's own CLI describes
its MCP server as "the recommended agent surface."

There's also a plain REST surface under `/api/<domain>/v1/...` (e.g.
`/api/seismology/v1/list-earthquakes`) if Alfred's tool manager prefers
direct REST over MCP.

## What's optional / degrades gracefully

- **Redis** (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`) — powers
  the cached bulk-dataset endpoints and the news digest (`/api/news/v1/list-feed-digest`
  and friends — ~39 of ~150 routes). You don't need to configure anything:
  when `UPSTASH_REDIS_REST_URL` is unset, `npm start` auto-launches
  `scripts/local-redis-rest.mjs`, a pure-Node, in-memory (+ file-persisted to
  `.local-redis-data.json`) stand-in that speaks the same Upstash REST
  protocol this codebase's own Redis client already targets, and points the
  sidecar at it (`scripts/start-with-local-redis.mjs`). No Docker, no
  account, no extra step — confirmed end-to-end: the digest route reaches
  real storage, its on-demand rebuild runs, and results persist across
  requests instead of "unavailable"/`itemsServed: 0`. (Getting real *content*
  in the digest still depends on being able to reach the RSS feed hosts
  themselves over the network — a from-scratch instance with no network
  access to those feeds will see a well-formed but empty digest until a feed
  fetch succeeds, same as before.) Point `UPSTASH_REDIS_REST_URL` /
  `UPSTASH_REDIS_REST_TOKEN` at a free Upstash account instead if you want a
  durable remote store or are running more than one instance against the
  same data; the local stand-in is single-process, dev/self-host scoped.
- **Data-source API keys** (Groq, FRED, EIA, NASA FIRMS, AISSTREAM, Finnhub,
  etc. — see `.env.example`) — each unlocks one feed; everything else keeps
  working without it.
- **Convex** — intentionally **not wired up** in this build. The
  account-scoped features (saved alert rules, followed countries,
  notification channels, saved preferences) live in `convex/` and need a
  separately-running self-hosted Convex backend, which would break the
  single-process contract. If you want those features too, run
  Worldmonitor-Stripped's Docker stack instead, or ask for this to be added
  as a second local process.

## Network calls

Cloud fallback to the original hosted `worldmonitor.app` is **off by
default** (`LOCAL_API_MODE=docker`, set by `npm start`, forces it off
regardless of any other setting) — confirmed in the source, not just
documented. Two narrow, unconditional exceptions in the upstream code:
a marketing "register interest" signup endpoint (only fires if something
explicitly POSTs to it) and YouTube-live-detection (always relays through
the vendor, since YouTube blocks datacenter IPs). Neither fires from normal
data queries.

## What's excluded from this build vs. Worldmonitor-Stripped

No `src/` frontend build tooling used at runtime (the folder is kept because
`server/` and `api/` import a few shared/generated modules from
`src/generated/`, `src/shared/`, `src/config/`, `src/types/`, `src/utils/`
— everything else in `src/` is dead weight here, just unused, not broken).
Also excluded: `pro-test/`, all Docker/nginx files, and the Tauri desktop
shell's Rust code (`src-tauri/src`, `Cargo.toml`, etc.) — only
`src-tauri/sidecar/local-api-server.mjs` is kept, since that's the actual
server.

## Known gaps / not yet verified

- Only smoke-tested a handful of endpoints (`/api/health`,
  `/api/seismology/v1/list-earthquakes`, `/api/mcp` tools/list). The other
  ~150 routes compiled cleanly (0 build failures) but weren't individually
  exercised.
- No TypeScript `tsc --noEmit` typecheck was run, only the esbuild bundle
  step (which is more permissive about type errors than `tsc`).
- `api/mcp/billing-denial.ts` is just an error-classifier for billing-verification
  codes coming back from `server/gateway.ts` — spot-checked it, and since
  gateway.ts's entitlement checks are already neutralized to always pass
  (see the parent project's de-SaaS-ification work), it has nothing to
  classify in practice. `api/mcp/free-account-allowance.ts` (quota bookkeeping
  for anonymous callers) has NOT been individually audited — only `tools/list`
  was tested end-to-end, not an actual `tools/call`, so a quota check on a
  real tool invocation is unverified.
