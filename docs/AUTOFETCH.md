# Automatic source files (how WorldMonitor fetches whole-file sources)

`scripts/subnational/_autofetch.mjs` gives providers one call, `ensureSourceFile`, for sources published as a file (xlsx/zip/pdf/csv):

1. cached copy in `.cache/sources/` younger than `maxAgeDays` -> used, no network;
2. otherwise each configured URL is fetched with plain `curl` (curl.exe on Windows). The reply is accepted only if it has the right
   magic bytes and size - an HTML error or bot-check page is rejected and never stored;
3. if every URL fails, the last cached copy is used (status `stale-cache`), then the newest hand-dropped file in `docs/samples/national/`;
4. if nothing usable exists the provider fails with a message listing every attempt. Other providers keep running.

Nothing here logs in, solves bot checks, drives a browser or disables TLS verification. A site that blocks scripts stays blocked;
the fallback is the cached/dropped file, and the log line `[rbi-estates] using ... (stale-cache, 140 d old)` says so.

Because the providers call it, it runs whenever Alfred starts WorldMonitor (`npm start` -> seed-on-start -> seeders).

## Per-source status
| Source | Auto-download | Notes |
|---|---|---|
| RBI e-STATES (India fiscal) | yes, untested end-to-end until run on your PC | RBI's publication page (`rbi.org.in/Scripts/AnnualPublications.aspx?head=State Finances...`) lists the workbook under `rbidocs.rbi.org.in/.../ESTATES*.XLSX`. The provider scrapes that page for the link (so the next January release is picked up by itself), with the 2026-01-23 link pinned as last resort. The F5 bot check earlier was on the DBIE site, not on this path. Override with `RBI_ESTATES_URL`. |
| NCRB Crime in India 2022 (India murder rate) | not needed for 2022: the table is committed as CSV (`ncrb_2022_table_2A1_murder.csv`) | A newer edition needs a PDF-table parser (no dependency installed, `pdftotext` is not on Windows) - not built. |
