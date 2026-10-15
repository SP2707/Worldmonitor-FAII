# Zero-coverage cells: research log (2026-10-15)

Goal: find accurate, official sources for the zero cells of the main coverage table. Rules held throughout: no assumed values, no third-party aggregators, no bypassing bot protection or certificate checks.
Confidence labels: VERIFIED = page content read this session; LEAD = exists per a search result but not opened or not machine-readable; NONE = nothing found.

| Gap | Candidate source | Status | What is still needed |
|---|---|---|---|
| fiscal RU (83) | Ministry of Finance of Russia, "Brief annual information on consolidated regional budgets of the Russian Federation execution (bln. rub.)", minfin.gov.ru/en/document?id_4=119256-... | LEAD (URL from search; my fetch tool is blocked by robots.txt; user machine hit a certificate-chain error on rosstat.gov.ru, minfin.gov.ru untested) | User opens the page in a normal browser, saves the file into docs/samples/national/; then a drop-in provider can be written from the real layout |
| fiscal IN (36) | RBI "State Finances" e-STATES workbook | VERIFIED blocked for scripts (F5 bot page) | User downloads in a browser; save as docs/samples/national/rbi_estates_2026-01-23.xlsx |
| rule-of-law IN (32 more) | NCRB "Crime in India" (official), 2022 volume PDF on ncrb.gov.in | LEAD (PDF URL from search; fetch blocked by robots.txt; table not seen) | User downloads the volume; murder or total-crime rates per state need a PDF table parse |
| fiscal / hdi / patents UA | stat.gov.ua "Regions of Ukraine" statistical yearbook (2023 edition published 2024-02, PDFs) ; Open Budget portal (openbudget.gov.ua, 403 to scripts; mof.gov.ua says the site is in test mode) | LEAD | Manual download; PDF tables; format of local budget exports unknown |
| grp AE (7) | Statistics Centre Abu Dhabi (Abu Dhabi emirate GDP 2024, per press releases) ; Dubai Statistics Center (Dubai GDP 2023 listed on its National Accounts page) | LEAD, covers at most 2 of 7 emirates; both sites reject scripted requests (WAF) | Manual download of the GDP tables; the other five emirates: NONE found |
| fiscal AE, SA | none | NONE | Saudi regional data on DataSaudi (Ministry of Economy and Planning) is population, households, labour, education, health; its GDP series are national only (read this session) |
| grp SA (13), IL (6) | none | NONE | DataSaudi GDP is national only; no Israeli district-GDP release found |
| hdi SA, UA, AE | Global Data Lab Subnational HDI (SHDI) | LEAD: exists and lists subnational HDI worldwide; page could not be fetched, so coverage of SA/UA/AE is unconfirmed; download normally needs a free account (user's own action) | User checks which of SA/UA/AE appear at globaldatalab.org/shdi/table/shdi/ |
| patents SA, UA, AE, GB | none confirmed | NONE | OECD REGPAT covers OECD and selected regions; coverage of these four not confirmed |
| rule-of-law CN, SA, AE | none | NONE | |
| fdi (all 15) | India DPIIT state-wise FDI (page is a JS shell, no data in HTML); China NBS yearbook regional FDI table (host timed out from user machine) | LEAD only | No verified machine-readable source anywhere |

## Not done on purpose
- Playwright/cloudscraper style bypass of RBI's F5 page and Ukraine's Open Budget wall.
- Disabling TLS verification for Rosstat.
- Hardcoding or estimating any value, or wiring statbase.ru / CEIC / Trading Economics style aggregators.

## Update 2026-10-15 - files supplied by the user, checked

| File | Verdict | Action |
|---|---|---|
| `ESTATES23012026….XLSX` (RBI e-STATES, 14 MB, sheet `Data`, 397,575 rows) | VERIFIED real. 31 states/UTs, actuals ("Account") through FY2023-24; Revised/Budget columns ignored. | Provider `rbi-estates.mjs` wired into the fiscal seeder: revenue, expenditure, tax revenue for 31 divisions. 5 UTs (AN, CH, DH, LA, LD) are not in RBI e-STATES and stay empty. Unit INR crore per RBI convention - confirm against RBI's own note. |
| `rbi_estates_2026-01-23.xlsx` (44 KB) | NOT data - it is the RBI bot-check HTML saved with an .xlsx name. | Ignore / delete. |
| `crime-in-india-2022-vol-1/2/3.pdf` (zip from NCRB) | VERIFIED. Vol.1 Table 2A.1 gives murder cases and rate per lakh for all 36 states/UTs. | `extract-ncrb-murder.mjs` -> CSV; provider `ncrb.mjs` wired into the rule-of-law seeder (homicide_rate_per_100k, 2022). IPC murder, not identical to ICCS intentional homicide (stated in the note). |
| `6_subbud_month_eng_—_year.xlsx` (Russian Minfin) | NOT USABLE for divisions: it is the single consolidated total for all Russian regional budgets (Appendix 6.1), no per-region rows. | None. Russia fiscal remains 0. A per-region Minfin table is still needed. |
| `Статистичний збірник Регіони України книга 1.pdf` | This is the 2021 edition, Part I (population, labour, income, health, housing, justice, culture, environment). Fiscal, GRP, science/innovation are in Part II. | None yet. UA fiscal/hdi/patents unchanged. |
| Dubai / Abu Dhabi GDP tables | Not obtained. | Open. |
