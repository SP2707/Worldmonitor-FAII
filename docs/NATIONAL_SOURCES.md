# National / global open sources for grp and fiscal (register)
Checked: 2026-10-14. "verified" = I read the publisher's own page or a real downloaded sample; "unverified" = not yet seen with my own eyes; nothing here is assumed to be data.

## grp
| Source | Covers (registry) | Newest year seen | Status |
|---|---|---|---|
| OECD DSD_REG_ECO@DF_GDP TL2 (in use) | CA 13, CN 31, DE 16, FR 18, GB 4, IN 33, IT 20, US 51 | 2021 (sample) | Status: verified (sample + live run, 186 divisions) |
| Statistics Canada WDS table 36-10-0222-01 (GDP, expenditure-based, province/territory, annual) | CA 13 | 2024 (marked preliminary), released 2025-11-06 | Status: verified (table page read); API shape per StatCan user guide; parser waits for a real sample (`collect-national-samples.mjs statcan`) |
| DOSE V2.x (Zenodo; MCC-PIK) global subnational output | RU, UA, JP, KR, IN, CN per the data descriptor; SA and IL not mentioned; AE only as a listed source | 2020 (series end) | Status: verified (descriptor read) for coverage claims; file format and region names unverified until sampled. Old vintage: gap filler only, ranked after anything newer |
| ONS regional-gdp-by-year | England, Wales and 9 English regions | last updated 2023-05-24 per the API record | Status: verified, STALE: not wired |
| OECD GDP at TL3 for JP/KR | JP 47, KR 17 | unknown | Status: unverified: `collect-national-samples.mjs oecd-tl3-gdp` answers it |
| Cabinet Office prefectural accounts (ESRI) | JP 47 | unknown | Status: unverified: index page is saved by `collect-national-samples.mjs japan` |
| Rosstat, Ukrstat, GASTAT, SCAD/DSC, Israel CBS | RU 83, UA 27, SA 13, AE 7, IL 6 | unknown | Status: unverified: no API-shaped anonymous source confirmed; do not assume |
| KOSIS (KR), e-Stat (JP), NBS (CN), RBI/MoSPI (IN) | | | Status: unverified: my understanding (not checked) is that KOSIS and e-Stat APIs need a registration key, so they are not anonymous |

## fiscal
| Source | Covers | Newest year | Status |
|---|---|---|---|
| OECD DSD_SNGF_DISAGG@DF_REGOFI (agency OECD.CFE.RDG), regional-government revenue / expenditure / tax revenue, COFOG total | JP 46 of 47, KR 17, CA 13, DE 16, FR 17 of 18, IT 19 of 20 | 2022 | Status: verified (offline replay of the real downloaded file; wired; live run pending) |
| FRED / Census state tax collections (in use) | US 51 | see `scripts/subnational-freshness.mjs` | Status: verified (live) |
| Provincial government finance (StatCan) | CA | | Status: unverified: no table id confirmed; `collect-national-samples.mjs statcan-find` lists candidates |
| Others (GB, IN, CN, RU, UA, SA, AE, IL) | | | Status: unverified: nothing confirmed |

## fdi
No free anonymous division-level source found; OECD FDI is national only. Left at national context.

## How freshness is checked
`node scripts/subnational-freshness.mjs` prints, per category and source, the oldest/newest year and flags anything 3+ years old. Report before assuming a source is current.

## Update 2026-10-14 (after the live run and the sample downloads)
- Live: OECD regional GDP now supplies grp for CN 33, IN 33, RU 83, JP 47 (TL3, to 2022), KR 17 (TL3, to 2024), CA, GB, plus EU/US; stored years 2019-2024. Remaining grp gaps: AE 7, IL 6, SA 13, UA 27 (+3 India).
- Live: OECD REGOFI fiscal gives 129 divisions (JP 47, KR 17, CA 13, DE 16, FR 17, IT 19); the stored years are 2017-2021 (NOT 2022: only a few areas reach 2022). Flagged STALE by `subnational-freshness.mjs`.
- Wired (fixture-tested on real rows, live run pending): `statcan:36-10-0222-01` -> `grp_lcu` for CA (2024, preliminary); `dose:v2.11` (Zenodo record 16313760, CC-BY-4.0, published 2025-08-06) -> Ukraine only, `grp_lcu` (UAH) and `grp_per_capita_usd_market`, years 2014-2019. DOSE has no SA/IL and one 2009 value for AE: not used.
- Dead end: Cabinet Office prefectural-accounts index URL from the catalogue returns HTTP 404. Japan is already covered by OECD TL3.
- StatCan candidate tables for provincial government finance are in `docs/samples/national/statcan_candidate_tables.tsv` (e.g. 10-10-0017, ends 2024); not wired.

## Update 2026-10-14 (fiscal wiring)

| Country | Source | Status |
|---|---|---|
| CA | Statistics Canada 10-10-0017-01 (provincial/territorial government revenue, expense, taxes; CAD million; newest 2024) | WIRED (`providers/statcan-fiscal.mjs`), real-row fixture tests. Excludes local governments. Fresher than OECD REGOFI (ends 2021). |
| GB | HM Treasury Country and Regional Analysis 2025, tables A.1a/A.1b (FY 2024-25) | WIRED (`providers/uk-cra.mjs`). Different measure: public spending allocated to each nation, NOT a regional-government account; metric names say so. URL pinned to the 2025 release hash; update when CRA 2026 is published. |
| IN | RBI "State Finances" e-STATES workbook (release 2026-01-23) | BLOCKED for scripts: download returns an F5 bot-protection HTML page. Not bypassed. Needs a manual browser download into `docs/samples/national/` plus a drop-in provider (not built). |
| CN, RU, UA, SA, AE, IL | none verified | No open anonymous official source confirmed. Third-party aggregators (e.g. statbase.ru) deliberately NOT wired. |

### Gap analysis 2026-10-14 (fiscal 183/391)
- FR-YT Mayotte: absent from OECD REGOFI (FR areas FR1, FRB-FRM, FRY1-FRY4 only). Left empty; nothing assumed.
- IT-32 Trentino-Alto Adige: REGOFI reports only "ITH2 Autonomous prov. Trento" (no Bolzano). Mapping Trento to the whole region would be wrong, so left empty.
- US DC: CONFIRMED 2026-10-14 on the user's machine: FRED `DCTOTLTAX` returns HTTP 404 while `ALTOTLTAX` returns 200. FRED has no DC state-tax series, so DC stays empty (not a bug).
- UA: the Ministry of Finance publishes local budgets on the Open Budget portal (openbudget.gov.ua/local-budget, per decentralization.ua news item); data format/API NOT verified; the VM cannot reach the host. Candidate only, not wired.
- RU: only statbase.ru (third-party aggregator of Rosstat series) surfaced in search; official Rosstat/Treasury file URLs not verified; not wired.
- CN: only commercial aggregators (CEIC, Alphacast, Moody's) surfaced; NBS data.stats.gov.cn not reachable from the VM, API unverified; not wired.
- SA, AE, IL: searches found no regional-government fiscal dataset (SA GASTAT and UAE federal pages are national budget only).

### Probe results 2026-10-14 (user machine)
- IL: data.gov.il CKAN is reachable. Dataset `local-authorities` (Ministry of Interior, "audited financial statements of local authorities by year", modified 2026-08-04) has resources for 2018, 2019, 2022, 2023, 2024 (datastore_active=True). Municipality-level, NOT district-level: the 6 IL registry divisions are districts, so use requires a municipality->district mapping that is not yet verified. Column layout not yet inspected.
- IN DPIIT page: client-rendered shell, no data in the HTML; unusable by script.
- UA openbudget.gov.ua: HTTP 403 Access Denied to scripts (bot wall, not bypassed).
- CN stats.gov.cn: connection timed out from the user's machine (cause unknown).
- RU rosstat.gov.ru: TLS error SEC_E_UNTRUSTED_ROOT (certificate chain not trusted by Windows; Russian CA). Not worked around.
- AE Dubai Statistics Center: request rejected; Abu Dhabi SCAD: Access Denied page (bot wall); SA GASTAT guessed URL 404.
- IL local-authorities dataset inspected (2024 resource, 1,024,770 rows): long format with columns authority name (Hebrew), authority code, report year, data year, report, sheet, row label (Hebrew), column label, code, value. NO district column. Value units not stated in the sampled rows. Using it for the 6 district divisions would need a separate, verified authority->district mapping (e.g. from the Israel CBS) plus Hebrew line-item selection. Not wired.
- IL district-lookup candidates found 2026-10-14 (CKAN, datastore-active): `municipal-authorities` (National Digital Agency, "unified list of municipal authorities", CSV, resource c4916937-f5d3-4295-a22e-88a1af5cde6a, modified 2025-12-10) and `district-locator` (Ministry of Labour, "find district by locality", XLSX, resource 75c2333e-c3d5-41ac-b144-f5f16d820981, modified 2025-07-09; its districts may be Labour-ministry regions, not the Interior-ministry Mehozot). Columns not yet inspected. Separate per-type audited-statement datasets also exist (cities audit-cities, regional councils local_council, local councils local-council-1; years up to 2021), but the main `local-authorities` dataset already has 2024.
- AE Bayanat (bayanat.ae) front page loads (HTTP 200); sections /en/Datasets and /en/Geo-Data exist; emirate-level fiscal/GDP content not verified.
- IL WIRED 2026-10-14 (`providers/israel-localauth.mjs`): Ministry of Interior audited statements 2024 (sheet 'דוח לתושב', rows 'סהכ הכנסות'/'סהכ הוצאות', column 'ביצוע שנה נוכחית', ILS thousand — verified via Abu Ghosh per-capita consistency) summed per district through the National Digital Agency `municipal-authorities` list. Join: finance authority code mod 10000 = lookup code AND similar name, else unique normalised name; 254/260 joined offline, 6 dropped; Judea and Samaria authorities not in the six districts are dropped. Metric names and notes say "sum of municipal budgets", not a district-government account. Finance resource id pinned to report year 2024.
- IL live result 2026-10-15: 6/6 districts, report year 2024. Authorities summed per district: South 40, Haifa 30, Jerusalem 6, Central 52, Tel Aviv 12, North 92 (232 of the 233 lookup authorities that sit in these six districts; one North authority dropped). Revenue sums (ILS thousand): D 15.72M, HA 11.49M, JM 11.08M, M 22.75M, TA 18.15M, Z 13.89M. Plausibility only (not independently verified against an external total). Fiscal coverage 189/391.
