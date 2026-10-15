# Routing the seeders through Tor (optional, off by default)

`SEED_TOR=1` sends every outbound request of `npm start` (sidecar, seeders, local Redis stand-in) through a
local Tor SOCKS5 proxy. No packages are added: the SOCKS5 client is ~150 lines in `scripts/shared/tor-fetch.mjs`.

## Setup (Windows)
1. Start Tor. Either keep **Tor Browser** open (SOCKS on `127.0.0.1:9150`) or run the standalone **tor** expert
   bundle (SOCKS on `127.0.0.1:9050`).
2. Check it: `node scripts/tor-check.mjs` (add `--sources` to see which data sources accept Tor exits).
3. Put `SEED_TOR=1` in `.env.local` (or `$env:SEED_TOR="1"` in the shell) and run `npm start`.

For a single seeder outside `npm start`:
`$env:SEED_TOR="1"; node --import ./scripts/shared/tor-preload.mjs scripts/seed-subnational-population.mjs`

## Settings
| Variable | Meaning |
|---|---|
| `SEED_TOR=1` | turn the layer on |
| `SEED_TOR_SOCKS` | comma list of `host:port` candidates; first reachable is used (default `127.0.0.1:9050,127.0.0.1:9150`) |
| `SEED_TOR_DIRECT_HOSTS` | hosts (suffix match) that deliberately connect directly, for a source that refuses Tor. Printed as a warning at start. |
| `SEED_TOR_ISOLATE=0` | disable per-process circuit isolation (each process otherwise authenticates with random credentials so Tor gives it its own circuit) |
| `SEED_USER_AGENT` | one User-Agent for every `fetch()` made through the layer |

## What is guaranteed (and tested against a mock SOCKS server)
* **Fail closed**: if no SOCKS proxy is reachable, `npm start` refuses to start and requests error out. There is no
  automatic direct fallback. Direct connections exist only for hosts you list in `SEED_TOR_DIRECT_HOSTS`.
* **No DNS leak**: hostnames go to the proxy (SOCKS5 domain addressing); this machine never resolves them.
* **Local traffic stays local**: loopback, private ranges and `*.localhost` (local Redis stand-in, sidecar) never go to Tor.
* Covers global `fetch()` and `node:http`/`node:https` calls that use the default agent.

## What is NOT covered
* Code that opens raw sockets (`node:net`/`tls`), spawns `curl`, or brings its own agent. `node scripts/audit-egress.mjs`
  lists such files.
* The sidecar's own browser-facing traffic. This is about what the *server side* sends out.
* Real Tor was not available when this was written. Run `tor-check.mjs` once to confirm on your machine.

## Expect trade-offs
* Slower, and the bigger downloads (~12 MB CSVs) are noticeably slower.
* Some services block or throttle Tor exits (FRED already blocked one burst from a normal IP). `tor-check.mjs --sources`
  shows which ones refuse; decide per host whether to accept a direct connection.
* A system-level VPN hides your IP from these sites too, with no code involved and fewer failures.

## Egress audit
`node scripts/audit-egress.mjs` lists every host the scheduled seeders can contact and fails if one is not in
`scripts/egress-allowlist.json` (so a new outbound host cannot appear unnoticed), if an e-mail address sits in a
User-Agent/From/Referer line, or if the hosted upstream gateway would be used (`API_BASE_URL` must be local).
It reads source text only; hosts built at runtime and the sidecar are not seen.
