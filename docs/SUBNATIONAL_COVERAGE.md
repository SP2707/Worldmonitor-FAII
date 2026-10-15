# Subnational seeders: 391 divisions x 10 categories

The md list has 392 lines, but "Adygea" appears twice, so there are **391 unique first-level divisions**
in 15 countries, i.e. **3,910 division-category cells** (not 3,920). The registry is
`scripts/subnational/divisions.json` (ISO 3166-2 ids; NUTS 2021 codes for DE/FR/IT).

Each category is ONE seeder that loops over all 391 divisions and writes ONE Redis key
(`subnational:<slug>:v1`) holding a record per division:

| # | Script | Redis key |
|---|--------|-----------|
| 1 | `seed-subnational-grp.mjs` | `subnational:grp:v1` |
| 2 | `seed-subnational-fiscal.mjs` | `subnational:fiscal:v1` |
| 3 | `seed-subnational-population.mjs` | `subnational:population:v1` |
| 4 | `seed-subnational-infrastructure.mjs` | `subnational:infrastructure:v1` |
| 5 | `seed-subnational-energy.mjs` | `subnational:energy:v1` |
| 6 | `seed-subnational-hdi.mjs` | `subnational:hdi:v1` |
| 7 | `seed-subnational-patents.mjs` | `subnational:patents:v1` |
| 8 | `seed-subnational-rule-of-law.mjs` | `subnational:rule-of-law:v1` |
| 9 | `seed-subnational-fdi.mjs` | `subnational:fdi:v1` |
| 10 | `seed-subnational-military.mjs` | `subnational:military:v1` |

## Honesty rules
* A value is written only if a provider returned it. Nothing is estimated or typed in from memory.
* Every metric carries `scope`: `division` (that unit) or `national` (whole-country context repeated on each
  division; never a substitute for a division value), plus `source`, `sourceUrl`, `year`, `method`.
* A division's `status` is `ok` (has >=1 division-scope metric), `national_only`, or `no_source`.
  `coverage` in each payload counts these per country.
* If every provider fails the seeder throws, so the last good payload is kept.
* A worse-ranked provider cannot overwrite a better one's value younger than 90 days.
* Derived numbers (densities, shares, per-capita, capacity mix) are labelled `method: derived` with their inputs' years;
  a share of a country total is written only where every listed division shares source, unit and year.
* Rates and indices (life expectancy, crime per 100k, ...) are taken as direct values only: never summed over child
  regions, never averaged across a division made of several NUTS regions.
* A source can always refresh its own values; a worse-ranked source cannot overwrite a fresher better one.

## What each category delivers (free, keyless)

Legend: **V** = checked live in a browser or on real downloaded data on 2026-10-11/12; **U** = not checked live.

### Point datasets assigned to divisions by boundary polygons (no network call per division)
`scripts/subnational/geo/` vendors Natural Earth 10m admin-1 boundaries (public domain) mapped to the
registry ids (all 391 have polygons; Moscow city/oblast codes are swapped in Natural Earth and corrected,
with a test). A point is assigned to the polygon containing it; a point within 0.3 degrees of a
coastline/border falls back to the nearest division of the SAME country (method `nearest`), else it is dropped.

| Layer | Source | Check | Used by |
|---|---|---|---|
| Airfields by type, scheduled service, IATA, heliports | OurAirports (public domain), 41,050 open airfields | V real data: 40,113 by ISO region, 890 located by polygon, 36 nearest, 11 unassigned | infrastructure, military |
| Military airfields **by name** | same register, name pattern (air base/AFB/naval air/...) | HEURISTIC, a floor not a census; 214 of 391 divisions non-zero | military |
| Power plants: capacity by fuel, count, 2017 generation estimate | WRI Global Power Plant Database v1.3.0 (CC BY 4.0), 24,869 plants in these countries | V real data; **a ~2021 snapshot, unmaintained since 2022** (capacity, not current output) | energy, infrastructure |
| M4.5+ earthquakes, past week | USGS via the live `seed-earthquakes` key | V; complete for that threshold, so zero-filled | infrastructure |
| Fire detections, last 10 days | NASA FIRMS/CWFIS via the live `seed-fire-detections` key | V; capped sample, so **never zero-filled** | infrastructure |
| UCDP armed-conflict events and deaths | UCDP GED via the live `seed-ucdp-events` key | V; lags months, capped slice, never zero-filled | military, rule-of-law |

### Per category

| Category | Division-level data | Expected division-level coverage | National context |
|---|---|---|---|
| GRP | FRED `{ST}NGSP` (US, V), Eurostat `nama_10r_2gdp` (DE/FR/IT), Wikidata P2131 (CN 30, CA 13, a few more); derived share of country GRP and GRP per head (needs the population seeder) | ~150 of 391 | World Bank GDP |
| Fiscal | **Fiscal autonomy: no open source found (stated gap).** US: FRED state tax collections (total, individual income; V for CA/TX, FRED units are thousands of USD, converted), tax per head, tax as % of GRP. All of US/DE/FR/IT: GRP share, population share, contribution index (a proxy for revenue contribution, labelled) | 51 US + up to 54 EU | World Bank revenue/tax/expense |
| Population | FRED POP, Eurostat totals and age groups, Wikidata P1082; derived working-age/elderly shares and population share of country | most of 391 | World Bank demographics |
| Infrastructure | OurAirports, GPPD plant count and MW, quakes, fires (above) for **all 391**; OSM ports/rail/hospitals/substations/dams/data centres only when an Overpass mirror answers; densities per 1,000 km2 need Wikidata area | 391 (OSM-only metrics partial) | none |
| Energy | GPPD installed MW by fuel, plant count, 2017 generation estimate for **all 391**; derived renewable/fossil/nuclear capacity shares, W per head (needs Wikidata population); OSM wells/refineries/mines best effort | 391 (372 with a non-zero capacity base) | World Bank energy |
| HDI | **No composite index is computed.** Measured components: life expectancy, tertiary attainment, unemployment, standardised death rate (Eurostat NUTS, DE/FR/IT; direct values only, never summed or averaged); US states: per-capita income, median household income, bachelor's+, unemployment, poverty (FRED) | ~100 | World Bank life expectancy, GNI, enrolment |
| Patents | Eurostat EPO applications (**data end in 2012**) + regional R&D intensity `rd_e_gerdreg` (more recent, partial) | up to ~54 | World Bank patents, R&D |
| Rule of law | **No open subnational governance index exists.** Eurostat police-recorded homicide, robbery, residential burglary per 100k (DE/FR/IT); UCDP events/deaths (25 divisions in the current slice) | ~60-80 | World Bank WGI via `GOV_WGI_*` |
| FDI | **none found (stated gap)** | 0 | World Bank BX.KLT.DINV |
| Military | OurAirports military-by-name (heuristic), UCDP events, OSM military features best effort | 391 (heuristic zeros) / 25 with conflict events | World Bank SIPRI series |

Remaining honest gaps: FDI and fiscal autonomy at division level, HDI outside US/EU, crime outside EU,
patents after 2012, GRP for most of CN/IN/RU/JP/KR/SA/UA/IL/AE/GB. These need sources not verified keyless
(OECD regional SDMX, StatCan/e-Stat/KOSIS/ONS APIs, UNDP Global Data Lab, national yearbooks).
Add them as providers in `scripts/subnational/providers/`, best-first in the relevant seeder.

### FRED politeness
FRED sits behind a WAF. A burst of ~50 parallel requests earned the tester's IP an "Access Denied" for a
few minutes. The provider is strictly sequential (400 ms apart) and stops at the first 403/429, keeping
what it already read; HDI makes ~255 requests and fiscal ~100 per run, so they run at most daily.

## Fixed after the live check
* World Bank WGI: indicator ids must be `GOV_WGI_RL.EST` etc., without `source=3`.
* Eurostat: `pat_ep_rtot`/`pat_ep_rtec` need pinned `unit` (and `ipc`); the parser now refuses unpinned
  dimensions instead of mixing series. `demo_r_d2jan` has single-year ages, so broad age groups use `demo_r_pjanaggr3`.
* FRED: `WCRFPUS2` and `WCESTUS1` return 404, so `seed-eia-petroleum` now serves WTI and Brent only.

## Running
```
node scripts/probe-subnational-sources.mjs          # reachability/shape check of every source (needs internet)
node scripts/seed-subnational-grp.mjs               # any single seeder (needs the local Redis from `npm start`)
SUBNATIONAL_OSM_BATCH=391 node scripts/seed-subnational-infrastructure.mjs   # one long Overpass run
node --test tests/subnational-seeders.test.mjs
```
The OSM part of infrastructure/energy/military is best effort: it refreshes the stalest 40 divisions per run and
stops after 3 consecutive failures; the airport, power-plant and live-event layers do not depend on it.
Test suites: `tests/subnational-seeders.test.mjs`, `tests/subnational-geo-layers.test.mjs`, `tests/subnational-derivations.test.mjs`.

## OECD regional series (providers/oecd-series.mjs)
Offline prediction from `docs/samples/oecd` (run `node scripts/oecd-match-report.mjs`; `UNMATCHED=1` lists skipped regions):
life expectancy ~240 divisions (RU 83, CN 31, CA 12, IL 6, US 51, DE/FR/IT), infant mortality ~241, unemployment/employment ~207,
disposable income ~127, tertiary attainment ~125, PCT patents ~264 (adds IN 32, CN 31, RU 77), homicide rate ~210.
JP (47 prefectures) and KR (17 provinces) need OECD TL3; check with `node scripts/oecd-tl3-check.mjs`. England is a sum of nine
OECD regions, used for count series only. Predictions are NOT live results until `subnational-status` confirms them.
Not covered by OECD: fiscal (REGOFI is code-only, no region names; unmapped), fdi (national only).
