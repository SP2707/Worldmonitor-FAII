# Running it unattended

`npm start` launches the server, the local Redis stand-in and the seed runner (`scripts/seed-on-start.mjs`).
The runner re-checks every `SEED_REFRESH_MINUTES` (default 30) and runs only seeders whose last OK result is older than their
`freshMinutes` in `scripts/seed-tiers.config.json`. Tiers 1 and 2 run by default; `SEED_TIERS=1,2,3` adds tier 3
(military flights, forecasts, Canada, China).

* **Failures back off**: a seeder that fails, times out or exits silently ("NOOP") is retried after 15 min, then 30, 60 ... up to 24 h,
  and resets on its first OK. This keeps a rate-limited source (Open-Meteo climate) from being hammered.
* **RAM guard**: no new seeder starts while system RAM use is above `SEED_MAX_RAM_FRACTION` (default 0.875, i.e. 14 of 16 GB);
  `.seed-status.json` shows `error: "memory-pressure"` and the next pass retries. The runner first waits up to 3 minutes for memory to drop,
  and each pass runs the least recently run seeders first, so a pass cut short cannot starve the same ones. `SEED_CONCURRENCY=1` lowers peak memory.
* **Env gates**: `requiresAnyEnv` (one of) and `requiresEnv` (all of). `seed-insights` and `seed-resilience-scores` require `API_BASE_URL`
  because their default is the hosted upstream, and `seed-resilience-scores` would send `WORLDMONITOR_SEED_REFRESH_KEY` there.

```
node scripts/seed-report.mjs                  what failed, what is stale, what never ran
node scripts/seed-report.mjs --unscheduled    seed scripts that no tier runs (about 150; each needs a decision)
node scripts/history-snapshot.mjs             append the subnational values to .history.db (the runner does this daily)
node scripts/history-snapshot.mjs US-CA grp   one division's stored history
pm2 start ecosystem.config.cjs                headless with automatic restart (npm i -g pm2 first)
```

## Things only you can supply
* `LOCAL_API_TOKEN` in `.env.local` (the sidecar refuses every request without it); `warm-risk-scores` uses it to fill the CII layer.
* `WORLDMONITOR_SEED_REFRESH_KEY` (any long random string you generate) plus `API_BASE_URL=http://127.0.0.1:46123` for resilience scores.
* ACLED credentials are optional for protests; without them only GDELT events are used.
* `OLLAMA_API_URL` / `OLLAMA_MODEL` (or a provider key) for `seed-insights`, which feeds `seed-news-verification`.
