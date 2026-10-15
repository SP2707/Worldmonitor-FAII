# Subnational source catalogue (candidates)

Status: **a candidate list written from my own knowledge on 2026-10-12. None of it was verified live by me** (my environment cannot reach these hosts). Entries marked "in use" are the ones your own seeder runs already exercised. Run `node scripts/probe-source-catalogue.mjs` on your machine to get a live HTTP status for every URL before relying on any of it.

Columns: **Grain** D = division-level in that country/region, P = partial or coarser than our 391 divisions, N = national only. **Access**: open = keyless API or file you can fetch directly; web = HTML pages or spreadsheets that need scraping/parsing, no sign-up; key = free key needs sign-up; acct = account/registration. **Trust** is a heuristic from the publisher type (official statistics offices and intergovernmental bodies vs community, academic or modelled data); it is not a quality audit.

## Summary

| Category | Listed | Division-level | Open API/files, no sign-up (D or P) | Already in use | Need key/account |
|---|---|---|---|---|---|
| Gross Regional Product | 21 | 17 | 8 | 4 | 2 |
| Fiscal Autonomy & Revenue | 22 | 13 | 6 | 2 | 1 |
| Population & Demographics | 24 | 21 | 9 | 4 | 3 |
| Critical Infrastructure | 23 | 16 | 15 | 6 | 1 |
| Energy & Strategic Resources | 22 | 12 | 7 | 3 | 0 |
| Human Development | 23 | 19 | 7 | 4 | 4 |
| Innovation & Patents | 23 | 15 | 4 | 3 | 3 |
| Rule of Law & Security | 22 | 18 | 7 | 4 | 4 |
| Foreign Direct Investment | 21 | 7 | 2 | 1 | 1 |
| Geostrategic & Military Footprint | 22 | 10 | 8 | 5 | 3 |
| **Total** | 223 | 148 | 73 | 36 | 22 |

## Gross Regional Product (`grp`)

| # | Scope | Source | Grain | Access | Trust | Note |
|---|---|---|---|---|---|---|
| 1 | EU | [Eurostat nama_10r_2gdp (GDP at NUTS 2)](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nama_10r_2gdp?lang=en&unit=MIO_EUR&geo=DE21) | division-level | open (no sign-up) | official | in use; DE FR IT |
| 2 | OECD | [OECD Regional Statistics (TL2 GDP, SDMX)](https://sdmx.oecd.org/public/rest/dataflow/all) | division-level | open (no sign-up) | official | US CA DE FR GB IL IT JP KR |
| 3 | GLOBAL | [DOSE global subnational economic output (Zenodo)](https://zenodo.org/search?q=DOSE%20subnational%20economic%20output) | division-level | open (no sign-up) | community | academic compilation, ~80 countries, ends ~2020 |
| 4 | GLOBAL | [Kummu et al. gridded + admin-1 GDP/HDI (Dryad)](https://datadryad.org/search?q=Kummu%20GDP%20HDI) | division-level | open (no sign-up) | community | academic, rescaled, not official stats |
| 5 | GLOBAL | [Wikidata (P2131 / P2132)](https://query.wikidata.org/sparql) | partial/coarser | open (no sign-up) | community | in use; ~48 of 391 divisions |
| 6 | GLOBAL | [World Bank WDI (national GDP, for scaling)](https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json&per_page=1) | national only | open (no sign-up) | official | in use |
| 7 | US | [BEA regional GDP via FRED (NGSP)](https://api.stlouisfed.org/) | division-level | free key (sign-up) | official | in use; WAF blocks bursts |
| 8 | CA | [Statistics Canada WDS (GDP by province, table 36-10-0222)](https://www150.statcan.gc.ca/t1/wds/rest/getCubeMetadata) | division-level | open (no sign-up) | official |  |
| 9 | DE | [Statistikportal VGR der Länder](https://www.statistikportal.de/de/vgrdl) | division-level | web pages/files | official | xlsx downloads |
| 10 | FR | [INSEE regional accounts (PIB régional)](https://www.insee.fr/fr/statistiques) | division-level | web pages/files | official | open CSV/xlsx; API needs sign-up |
| 11 | GB | [ONS regional GDP (API)](https://api.beta.ons.gov.uk/v1/datasets) | division-level | open (no sign-up) | official | ITL1 only; 4 of our GB divisions |
| 12 | IT | [ISTAT dati (SDMX)](https://esploradati.istat.it/SDMXWS/rest/dataflow/IT1) | division-level | open (no sign-up) | official |  |
| 13 | JP | [Cabinet Office prefectural accounts (ESRI)](https://www.esri.cao.go.jp/jp/sna/data/data_list/kenmin/files/kenmin_top.html) | division-level | web pages/files | official | xlsx |
| 14 | KR | [KOSIS regional GRDP](https://kosis.kr/eng/) | division-level | free key (sign-up) | official | OpenAPI needs free key |
| 15 | IN | [RBI Handbook of Statistics on Indian States](https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook+of+Statistics+on+Indian+States) | division-level | web pages/files | official | xlsx/pdf |
| 16 | CN | [NBS China (data.stats.gov.cn, provincial GDP)](https://data.stats.gov.cn/english/) | division-level | web pages/files | official | awkward query interface |
| 17 | RU | [Rosstat regional statistics](https://rosstat.gov.ru/statistics/accounts) | division-level | web pages/files | official | xlsx |
| 18 | UA | [State Statistics Service of Ukraine (GRP by region)](https://www.ukrstat.gov.ua/) | division-level | web pages/files | official | xlsx |
| 19 | IL | [Israel CBS](https://www.cbs.gov.il/en/Pages/default.aspx) | partial/coarser | web pages/files | official | district level |
| 20 | SA | [GASTAT national accounts](https://www.stats.gov.sa/en) | partial/coarser | web pages/files | official | regional GDP published at coarse level |
| 21 | AE | [Dubai Statistics Center / SCAD Abu Dhabi](https://www.dsc.gov.ae/en-us/Pages/default.aspx) | division-level | web pages/files | official | emirates published separately |

## Fiscal Autonomy & Revenue (`fiscal`)

| # | Scope | Source | Grain | Access | Trust | Note |
|---|---|---|---|---|---|---|
| 1 | GLOBAL | [World Bank WDI (national tax and revenue)](https://api.worldbank.org/v2/country/all/indicator/GC.TAX.TOTL.GD.ZS?format=json&per_page=1) | national only | open (no sign-up) | official | in use |
| 2 | GLOBAL | [IMF Government Finance Statistics (SDMX)](https://dataservices.imf.org/REST/SDMX_JSON.svc/Dataflow) | national only | open (no sign-up) | official | national, some sub-sector |
| 3 | OECD | [OECD Revenue Statistics / fiscal decentralisation](https://sdmx.oecd.org/public/rest/dataflow/all) | partial/coarser | open (no sign-up) | official | sub-national government share per country |
| 4 | GLOBAL | [OECD-UCLG SNG-WOFI (sub-national finance)](https://www.sng-wofi.org/) | partial/coarser | web pages/files | official | country aggregate of regions |
| 5 | EU | [Eurostat government finance (gov_10a_main)](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/dataflow/ESTAT/all) | partial/coarser | open (no sign-up) | official | national + sub-sector |
| 6 | GLOBAL | [Wikidata](https://query.wikidata.org/sparql) | partial/coarser | open (no sign-up) | community | sparse budget properties |
| 7 | US | [Census state tax collections via FRED (TOTLTAX, INCTAX)](https://api.stlouisfed.org/) | division-level | free key (sign-up) | official | in use |
| 8 | US | [Census State Government Finances](https://www.census.gov/programs-surveys/state/data/tables.html) | division-level | web pages/files | official | xlsx |
| 9 | CA | [Statistics Canada provincial government finance](https://www150.statcan.gc.ca/t1/wds/rest/getCubeMetadata) | division-level | open (no sign-up) | official |  |
| 10 | DE | [Destatis / Statistikportal Länderfinanzen](https://www.statistikportal.de/de) | division-level | web pages/files | official |  |
| 11 | FR | [OFGL local finance observatory](https://www.ofgl.fr/) | division-level | web pages/files | official | departments and regions |
| 12 | GB | [HM Treasury Country and Regional Analysis (PESA)](https://www.gov.uk/government/collections/country-and-regional-analysis) | division-level | web pages/files | official | xlsx |
| 13 | IT | [OpenBDAP / Conti Pubblici Territoriali](https://www.contipubbliciterritoriali.it/) | division-level | web pages/files | official |  |
| 14 | JP | [MIC local public finance statistics](https://www.soumu.go.jp/iken/zaisei/index.html) | division-level | web pages/files | official |  |
| 15 | KR | [LOFIN local finance integrated open system](https://lofin365.go.kr/) | division-level | web pages/files | official |  |
| 16 | IN | [RBI State Finances: A Study of Budgets](https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=State+Finances+%3a+A+Study+of+Budgets) | division-level | web pages/files | official | xlsx |
| 17 | CN | [Ministry of Finance / NBS provincial fiscal data](https://data.stats.gov.cn/english/) | division-level | web pages/files | official |  |
| 18 | RU | [Ministry of Finance Electronic Budget](https://budget.gov.ru/) | division-level | web pages/files | official |  |
| 19 | UA | [Open Budget Ukraine](https://openbudget.gov.ua/) | division-level | open (no sign-up) | official | local budgets, open API |
| 20 | IL | [Ministry of Interior local authority finance (data.gov.il)](https://data.gov.il/) | partial/coarser | open (no sign-up) | official | municipal not district |
| 21 | SA | [Ministry of Finance Saudi Arabia](https://www.mof.gov.sa/en/Pages/default.aspx) | national only | web pages/files | official | no division-level fiscal data expected |
| 22 | AE | [Dubai / Abu Dhabi finance departments](https://www.dof.gov.ae/) | partial/coarser | web pages/files | official | emirate budgets |

## Population & Demographics (`population`)

| # | Scope | Source | Grain | Access | Trust | Note |
|---|---|---|---|---|---|---|
| 1 | EU | [Eurostat demo_r_d2jan / demo_r_pjanaggr3](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_r_d2jan?lang=en&sex=T&age=TOTAL&geo=DE21) | division-level | open (no sign-up) | official | in use |
| 2 | GLOBAL | [WorldPop admin-level aggregates](https://hub.worldpop.org/) | division-level | open (no sign-up) | community | modelled gridded estimates |
| 3 | GLOBAL | [JRC Global Human Settlement Layer](https://ghsl.jrc.ec.europa.eu/) | division-level | open (no sign-up) | community | modelled grids |
| 4 | GLOBAL | [UN OCHA HDX population statistics (COD-PS)](https://data.humdata.org/api/3/action/package_search?q=population%20statistics&rows=1) | partial/coarser | open (no sign-up) | official | patchy by country |
| 5 | OECD | [OECD Regional demography (TL2)](https://sdmx.oecd.org/public/rest/dataflow/all) | division-level | open (no sign-up) | official |  |
| 6 | GLOBAL | [Wikidata (P1082)](https://query.wikidata.org/sparql) | division-level | open (no sign-up) | community | in use |
| 7 | GLOBAL | [World Bank WDI (SP.POP.TOTL)](https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=1) | national only | open (no sign-up) | official | in use |
| 8 | GLOBAL | [UN World Population Prospects](https://population.un.org/dataportalapi/api/v1/) | national only | open (no sign-up) | official | national |
| 9 | US | [Census Bureau API (population estimates)](https://api.census.gov/data.html) | division-level | open (no sign-up) | official | light use keyless |
| 10 | US | [FRED state population series](https://api.stlouisfed.org/) | division-level | free key (sign-up) | official | in use |
| 11 | CA | [Statistics Canada population estimates](https://www150.statcan.gc.ca/t1/wds/rest/getCubeMetadata) | division-level | open (no sign-up) | official |  |
| 12 | DE | [Destatis GENESIS / Regionaldatenbank](https://www-genesis.destatis.de/) | division-level | account/registration | official | free account needed |
| 13 | FR | [INSEE population légale](https://www.insee.fr/fr/statistiques) | division-level | web pages/files | official |  |
| 14 | GB | [ONS mid-year estimates](https://api.beta.ons.gov.uk/v1/datasets) | division-level | open (no sign-up) | official |  |
| 15 | IT | [ISTAT demografia](https://demo.istat.it/) | division-level | web pages/files | official |  |
| 16 | JP | [Statistics Bureau of Japan](https://www.stat.go.jp/english/data/index.html) | division-level | web pages/files | official | e-Stat API needs appId |
| 17 | KR | [KOSIS resident registration population](https://kosis.kr/eng/) | division-level | free key (sign-up) | official |  |
| 18 | IN | [Census of India](https://censusindia.gov.in/) | division-level | web pages/files | official | 2011 census; later census delayed |
| 19 | CN | [NBS population census / yearbook](https://data.stats.gov.cn/english/) | division-level | web pages/files | official |  |
| 20 | RU | [Rosstat population](https://rosstat.gov.ru/folder/12781) | division-level | web pages/files | official |  |
| 21 | UA | [Ukrstat population](https://www.ukrstat.gov.ua/) | division-level | web pages/files | official | post-2022 data incomplete |
| 22 | IL | [Israel CBS population](https://www.cbs.gov.il/en/Pages/default.aspx) | division-level | web pages/files | official |  |
| 23 | SA | [GASTAT population estimates](https://www.stats.gov.sa/en) | division-level | web pages/files | official |  |
| 24 | AE | [FCSC / Dubai Statistics Center](https://fcsc.gov.ae/en-us) | division-level | web pages/files | official |  |

## Critical Infrastructure (`infrastructure`)

| # | Scope | Source | Grain | Access | Trust | Note |
|---|---|---|---|---|---|---|
| 1 | GLOBAL | [OpenStreetMap via Overpass API](https://overpass-api.de/api/status) | division-level | open (no sign-up) | community | in use; mirrors often down |
| 2 | GLOBAL | [Geofabrik OSM regional extracts](https://download.geofabrik.de/) | division-level | open (no sign-up) | community | bulk, avoids Overpass limits |
| 3 | GLOBAL | [OurAirports](https://davidmegginson.github.io/ourairports-data/airports.csv) | division-level | open (no sign-up) | community | in use |
| 4 | GLOBAL | [Global Power Plant Database (WRI)](https://datasets.wri.org/dataset/globalpowerplantdatabase) | division-level | open (no sign-up) | community | in use; snapshot |
| 5 | GLOBAL | [USGS earthquake feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson) | division-level | open (no sign-up) | official | hazard, in use |
| 6 | GLOBAL | [NASA FIRMS active fires](https://firms.modaps.eosdis.nasa.gov/) | division-level | free key (sign-up) | community | hazard, in use via seeder |
| 7 | GLOBAL | [Natural Earth (ports, rail, roads, airports)](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/) | partial/coarser | open (no sign-up) | community | coarse |
| 8 | GLOBAL | [NGA World Port Index](https://msi.nga.mil/Publications/WPI) | division-level | web pages/files | official | ports |
| 9 | GLOBAL | [Global Roads Inventory Project (GRIP)](https://www.globio.info/download-grip-dataset) | division-level | web pages/files | community |  |
| 10 | GLOBAL | [UN OCHA HDX infrastructure datasets](https://data.humdata.org/api/3/action/package_search?q=infrastructure&rows=1) | partial/coarser | open (no sign-up) | official |  |
| 11 | GLOBAL | [World Bank WDI (national infrastructure indicators)](https://api.worldbank.org/v2/country/all/indicator/IS.RRS.TOTL.KM?format=json&per_page=1) | national only | open (no sign-up) | official | in use |
| 12 | EU | [Eurostat regional transport (tran_r_*)](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/dataflow/ESTAT/all) | division-level | open (no sign-up) | official | NUTS2 |
| 13 | US | [BTS National Transportation Atlas Database](https://geodata.bts.gov/) | division-level | open (no sign-up) | official |  |
| 14 | US | [HIFLD open data (critical infrastructure)](https://hifld-geoplatform.hub.arcgis.com/) | division-level | open (no sign-up) | official | some layers withdrawn |
| 15 | CA | [Open Government Canada geospatial](https://open.canada.ca/data/en/dataset) | division-level | open (no sign-up) | official |  |
| 16 | DE | [BKG / GeoBasis-DE](https://gdz.bkg.bund.de/) | division-level | open (no sign-up) | official |  |
| 17 | FR | [data.gouv.fr (IGN BD TOPO)](https://www.data.gouv.fr/) | division-level | open (no sign-up) | official |  |
| 18 | GB | [DfT statistics + OS Open Roads](https://www.gov.uk/government/organisations/department-for-transport/about/statistics) | division-level | web pages/files | official |  |
| 19 | JP | [MLIT National Land Numerical Information](https://nlftp.mlit.go.jp/ksj/index.html) | division-level | web pages/files | official |  |
| 20 | UA | [Ukraine open data portal (CKAN)](https://data.gov.ua/) | partial/coarser | open (no sign-up) | official |  |
| 21 | IL | [Israel government data (CKAN)](https://data.gov.il/) | partial/coarser | open (no sign-up) | official |  |
| 22 | AE | [UAE Bayanat open data](https://bayanat.ae/) | partial/coarser | web pages/files | official |  |
| 23 | SA | [Saudi open data platform](https://data.gov.sa/) | partial/coarser | web pages/files | official |  |

## Energy & Strategic Resources (`energy`)

| # | Scope | Source | Grain | Access | Trust | Note |
|---|---|---|---|---|---|---|
| 1 | GLOBAL | [Global Power Plant Database (WRI)](https://datasets.wri.org/dataset/globalpowerplantdatabase) | division-level | open (no sign-up) | community | in use |
| 2 | GLOBAL | [OSM Overpass (power=plant/generator, oil, gas)](https://overpass-api.de/api/status) | division-level | open (no sign-up) | community | in use |
| 3 | GLOBAL | [Global Energy Monitor trackers](https://globalenergymonitor.org/projects/) | division-level | web pages/files | community | CC BY; some via request form |
| 4 | GLOBAL | [Ember electricity data](https://ember-energy.org/data/) | partial/coarser | open (no sign-up) | community | national plus some states |
| 5 | GLOBAL | [Energy Institute Statistical Review](https://www.energyinst.org/statistical-review) | national only | web pages/files | official | national xlsx |
| 6 | GLOBAL | [IRENA PxWeb statistics](https://pxweb.irena.org/pxweb/en) | national only | open (no sign-up) | official | national |
| 7 | GLOBAL | [Global Solar Atlas](https://globalsolaratlas.info/) | division-level | web pages/files | community | resource potential |
| 8 | GLOBAL | [Global Wind Atlas](https://globalwindatlas.info/) | division-level | web pages/files | community | resource potential |
| 9 | GLOBAL | [World Bank WDI energy](https://api.worldbank.org/v2/country/all/indicator/EG.USE.PCAP.KG.OE?format=json&per_page=1) | national only | open (no sign-up) | official | in use |
| 10 | EU | [Eurostat energy (nrg_*)](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/dataflow/ESTAT/all) | partial/coarser | open (no sign-up) | official | mostly national |
| 11 | US | [EIA State Energy Data System](https://www.eia.gov/state/seds/) | division-level | web pages/files | official | EIA API needs free key |
| 12 | CA | [Statistics Canada energy supply and demand](https://www150.statcan.gc.ca/t1/wds/rest/getCubeMetadata) | division-level | open (no sign-up) | official |  |
| 13 | DE | [Marktstammdatenregister (plant register)](https://www.marktstammdatenregister.de/MaStR) | division-level | open (no sign-up) | official | plant-level with location |
| 14 | FR | [RTE / ODRE registre des installations](https://odre.opendatasoft.com/) | division-level | open (no sign-up) | official |  |
| 15 | GB | [DESNZ sub-national energy statistics](https://www.gov.uk/government/collections/sub-national-electricity-and-gas-consumption-statistics) | division-level | web pages/files | official |  |
| 16 | IT | [Terna open data](https://www.terna.it/en/electric-system/transparency-report) | division-level | web pages/files | official |  |
| 17 | JP | [ANRE energy statistics](https://www.enecho.meti.go.jp/en/) | partial/coarser | web pages/files | official |  |
| 18 | IN | [Central Electricity Authority](https://cea.nic.in/) | division-level | web pages/files | official | state-wise installed capacity |
| 19 | CN | [National Energy Administration](https://www.nea.gov.cn/) | partial/coarser | web pages/files | official | mostly Chinese-language |
| 20 | UA | [Ukrenergo](https://ua.energy/en/) | partial/coarser | web pages/files | official |  |
| 21 | IL | [Israel Ministry of Energy](https://www.gov.il/en/departments/ministry_of_energy) | national only | web pages/files | official |  |
| 22 | SA | [ECRA Saudi electricity regulator](https://www.ecra.gov.sa/en-us/Pages/default.aspx) | partial/coarser | web pages/files | official |  |

## Human Development (`hdi`)

| # | Scope | Source | Grain | Access | Trust | Note |
|---|---|---|---|---|---|---|
| 1 | GLOBAL | [Global Data Lab Subnational HDI](https://globaldatalab.org/shdi/) | division-level | account/registration | community | free; bulk download needs registration |
| 2 | GLOBAL | [UNDP Human Development Report (national)](https://hdr.undp.org/data-center) | national only | open (no sign-up) | official |  |
| 3 | GLOBAL | [Kummu et al. subnational HDI (Dryad)](https://datadryad.org/search?q=Kummu%20GDP%20HDI) | division-level | open (no sign-up) | community | modelled |
| 4 | GLOBAL | [DHS Program API (subnational health/education)](https://api.dhsprogram.com/rest/dhs/data?f=json&perpage=1) | division-level | open (no sign-up) | official | IN, UA surveys; not all countries |
| 5 | OECD | [OECD Regional Well-Being (TL2)](https://sdmx.oecd.org/public/rest/dataflow/all) | division-level | open (no sign-up) | official |  |
| 6 | EU | [Eurostat regional life expectancy, education, unemployment](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_r_mlifexp?lang=en&sex=T&age=Y_LT1&geo=DE21) | division-level | open (no sign-up) | official | in use |
| 7 | GLOBAL | [World Bank WDI (national)](https://api.worldbank.org/v2/country/all/indicator/SP.DYN.LE00.IN?format=json&per_page=1) | national only | open (no sign-up) | official | in use |
| 8 | GLOBAL | [WHO Global Health Observatory](https://ghoapi.azureedge.net/api/Indicator?$top=1) | national only | open (no sign-up) | official | national |
| 9 | GLOBAL | [IHME GBD results tool](https://vizhub.healthdata.org/gbd-results/) | division-level | account/registration | community | subnational for several countries |
| 10 | GLOBAL | [Wikidata (P1081)](https://query.wikidata.org/sparql) | partial/coarser | open (no sign-up) | community | in use |
| 11 | US | [FRED/BEA/Census income, poverty, education series](https://api.stlouisfed.org/) | division-level | free key (sign-up) | official | in use |
| 12 | CA | [Statistics Canada health and income tables](https://www150.statcan.gc.ca/t1/wds/rest/getCubeMetadata) | division-level | open (no sign-up) | official |  |
| 13 | DE | [Destatis life tables by Land](https://www.destatis.de/EN/Themes/Society-Environment/Population/Deaths-Life-Expectancy/_node.html) | division-level | web pages/files | official |  |
| 14 | FR | [INSEE life expectancy by department](https://www.insee.fr/fr/statistiques) | division-level | web pages/files | official |  |
| 15 | GB | [ONS life expectancy and deprivation](https://api.beta.ons.gov.uk/v1/datasets) | division-level | open (no sign-up) | official |  |
| 16 | IT | [ISTAT BES / well-being by region](https://www.istat.it/en/well-being-and-sustainability) | division-level | web pages/files | official |  |
| 17 | JP | [MHLW prefectural life tables](https://www.mhlw.go.jp/english/database/db-hw/index.html) | division-level | web pages/files | official |  |
| 18 | KR | [KOSIS life tables by region](https://kosis.kr/eng/) | division-level | free key (sign-up) | official |  |
| 19 | IN | [NFHS (National Family Health Survey) state fact sheets](https://rchiips.org/nfhs/) | division-level | web pages/files | official |  |
| 20 | IN | [NITI Aayog Multidimensional Poverty Index](https://niti.gov.in/) | division-level | web pages/files | official |  |
| 21 | CN | [NBS provincial indicators](https://data.stats.gov.cn/english/) | division-level | web pages/files | official |  |
| 22 | RU | [Rosstat regional social indicators](https://rosstat.gov.ru/folder/210/document/13204) | division-level | web pages/files | official |  |
| 23 | UA | [Ukrstat social indicators](https://www.ukrstat.gov.ua/) | division-level | web pages/files | official |  |

## Innovation & Patents (`patents`)

| # | Scope | Source | Grain | Access | Trust | Note |
|---|---|---|---|---|---|---|
| 1 | EU | [Eurostat pat_ep_rtot / pat_ep_rtec (EPO by region)](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/pat_ep_rtot?lang=en&unit=NR&geo=DE21) | division-level | open (no sign-up) | official | in use; stops 2012 |
| 2 | EU | [Eurostat rd_e_gerdreg (regional R&D intensity)](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/rd_e_gerdreg?lang=en&geo=DE21) | division-level | open (no sign-up) | official | in use |
| 3 | OECD | [OECD REGPAT / regional innovation statistics](https://sdmx.oecd.org/public/rest/dataflow/all) | division-level | open (no sign-up) | official | TL2 for OECD members |
| 4 | GLOBAL | [WIPO IP Statistics Data Center](https://www3.wipo.int/ipstats/) | national only | web pages/files | official | by country; no regions |
| 5 | GLOBAL | [WIPO Global Innovation Index (science and tech clusters)](https://www.wipo.int/global_innovation_index/en/) | partial/coarser | web pages/files | official | top clusters by city/region |
| 6 | GLOBAL | [EPO Open Patent Services / Espacenet](https://www.epo.org/en/searching-for-patents/data/web-services/ops) | division-level | free key (sign-up) | official | free key, quota |
| 7 | GLOBAL | [WIPO PATENTSCOPE](https://patentscope.wipo.int/search/en/search.jsf) | division-level | web pages/files | official | search UI |
| 8 | GLOBAL | [World Bank WDI patent indicators](https://api.worldbank.org/v2/country/all/indicator/IP.PAT.RESD?format=json&per_page=1) | national only | open (no sign-up) | official | in use |
| 9 | GLOBAL | [Wikidata](https://query.wikidata.org/sparql) | national only | open (no sign-up) | community | no patent counts |
| 10 | US | [USPTO PatentsView](https://patentsview.org/apis/purpose) | division-level | free key (sign-up) | official | state and city of inventors |
| 11 | CA | [CIPO open patent data](https://ised-isde.canada.ca/site/canadian-intellectual-property-office/en/canadian-intellectual-property-statistics) | division-level | web pages/files | official |  |
| 12 | DE | [DPMA statistics by Land](https://www.dpma.de/english/service/statistics/index.html) | division-level | web pages/files | official |  |
| 13 | FR | [INPI data](https://data.inpi.fr/) | division-level | web pages/files | official |  |
| 14 | GB | [UK IPO statistics](https://www.gov.uk/government/organisations/intellectual-property-office/about/statistics) | partial/coarser | web pages/files | official |  |
| 15 | IT | [UIBM / MIMIT statistics](https://uibm.mise.gov.it/index.php/en/) | division-level | web pages/files | official |  |
| 16 | JP | [JPO statistics](https://www.jpo.go.jp/e/resources/statistics/index.html) | division-level | web pages/files | official |  |
| 17 | KR | [KIPO KIPRIS](https://www.kipris.or.kr/enghome/main.do) | division-level | free key (sign-up) | official |  |
| 18 | IN | [IP India annual reports](https://ipindia.gov.in/annual-reports.htm) | division-level | web pages/files | official | state of applicant |
| 19 | CN | [CNIPA statistics](https://english.cnipa.gov.cn/) | division-level | web pages/files | official | provincial tables |
| 20 | RU | [Rospatent annual reports](https://rospatent.gov.ru/en) | division-level | web pages/files | official |  |
| 21 | UA | [Ukrainian Intellectual Property Institute](https://ukrpatent.org/en) | partial/coarser | web pages/files | official |  |
| 22 | IL | [Israel Patent Office (data.gov.il)](https://data.gov.il/) | partial/coarser | open (no sign-up) | official |  |
| 23 | SA | [SAIP](https://www.saip.gov.sa/en/) | national only | web pages/files | official |  |

## Rule of Law & Security (`rule-of-law`)

| # | Scope | Source | Grain | Access | Trust | Note |
|---|---|---|---|---|---|---|
| 1 | EU | [Eurostat crim_gen_reg (police-recorded crime by region)](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/crim_gen_reg?lang=en&unit=P_HTHAB&iccs=ICCS0101&geo=DE2) | division-level | open (no sign-up) | official | in use |
| 2 | EU | [EU Quality of Government Index (Gothenburg)](https://www.gu.se/en/quality-government/qog-data/data-downloads/european-quality-of-government-index) | division-level | web pages/files | community | NUTS regions, DE FR IT GB |
| 3 | GLOBAL | [UCDP Georeferenced Event Dataset](https://ucdpapi.pcr.uu.se/api/gedevents/24.1?pagesize=1) | division-level | open (no sign-up) | official | in use |
| 4 | GLOBAL | [ACLED](https://acleddata.com/) | division-level | account/registration | official | free account, OAuth; not in use |
| 5 | GLOBAL | [GDELT Project](https://api.gdeltproject.org/api/v2/doc/doc?query=protest&mode=artlist&format=json&maxrecords=1) | division-level | open (no sign-up) | community | geo-coded news events |
| 6 | GLOBAL | [UNODC data portal](https://dataunodc.un.org/) | national only | web pages/files | official | national |
| 7 | GLOBAL | [World Bank Worldwide Governance Indicators](https://api.worldbank.org/v2/country/all/indicator/RL.EST?format=json&per_page=1) | national only | open (no sign-up) | official | in use |
| 8 | GLOBAL | [World Justice Project Rule of Law Index](https://worldjusticeproject.org/rule-of-law-index/) | national only | web pages/files | official | national |
| 9 | GLOBAL | [Transparency International CPI](https://www.transparency.org/en/cpi) | national only | web pages/files | official | national |
| 10 | GLOBAL | [START Global Terrorism Database](https://www.start.umd.edu/gtd/) | division-level | account/registration | community | free request form |
| 11 | OECD | [OECD Regional Well-Being: safety (homicide rate)](https://sdmx.oecd.org/public/rest/dataflow/all) | division-level | open (no sign-up) | official |  |
| 12 | US | [FBI Crime Data Explorer API](https://cde.ucr.cjis.gov/) | division-level | free key (sign-up) | official | free key |
| 13 | CA | [Statistics Canada crime (Juristat)](https://www150.statcan.gc.ca/t1/wds/rest/getCubeMetadata) | division-level | open (no sign-up) | official |  |
| 14 | DE | [BKA Polizeiliche Kriminalstatistik (Länder)](https://www.bka.de/DE/AktuelleInformationen/StatistikenLagebilder/PolizeilicheKriminalstatistik/pks_node.html) | division-level | web pages/files | official |  |
| 15 | FR | [SSMSI crimes et délits par département (data.gouv.fr)](https://www.data.gouv.fr/) | division-level | open (no sign-up) | official |  |
| 16 | GB | [ONS / Home Office police force area crime](https://api.beta.ons.gov.uk/v1/datasets) | division-level | open (no sign-up) | official |  |
| 17 | IT | [ISTAT / Ministry of Interior crime statistics](https://www.istat.it/en/) | division-level | web pages/files | official |  |
| 18 | JP | [National Police Agency crime statistics](https://www.npa.go.jp/english/index.html) | division-level | web pages/files | official |  |
| 19 | KR | [KOSIS crime statistics](https://kosis.kr/eng/) | division-level | free key (sign-up) | official |  |
| 20 | IN | [NCRB Crime in India (state-wise)](https://ncrb.gov.in/) | division-level | web pages/files | official |  |
| 21 | RU | [Prosecutor General crime statistics](https://crimestat.ru/) | division-level | web pages/files | official | Russian-language |
| 22 | UA | [Office of the Prosecutor General registers](https://gp.gov.ua/) | division-level | web pages/files | official |  |

## Foreign Direct Investment (`fdi`)

| # | Scope | Source | Grain | Access | Trust | Note |
|---|---|---|---|---|---|---|
| 1 | GLOBAL | [UNCTAD FDI statistics](https://unctadstat.unctad.org/) | national only | web pages/files | official | national |
| 2 | GLOBAL | [IMF Coordinated Direct Investment Survey](https://data.imf.org/) | national only | web pages/files | official | national |
| 3 | OECD | [OECD FDI statistics](https://sdmx.oecd.org/public/rest/dataflow/all) | national only | open (no sign-up) | official | national |
| 4 | GLOBAL | [World Bank WDI FDI net inflows](https://api.worldbank.org/v2/country/all/indicator/BX.KLT.DINV.CD.WD?format=json&per_page=1) | national only | open (no sign-up) | official | in use; national |
| 5 | GLOBAL | [UN Comtrade (trade, a proxy not FDI)](https://comtradeplus.un.org/) | national only | free key (sign-up) | official |  |
| 6 | US | [BEA New FDI in the US / FDIUS by state](https://www.bea.gov/data/intl-trade-investment/foreign-direct-investment-united-states) | division-level | web pages/files | official |  |
| 7 | US | [USAspending (federal awards to foreign-owned firms; proxy)](https://api.usaspending.gov/api/v2/references/toptier_agencies/) | division-level | open (no sign-up) | community | proxy only |
| 8 | CA | [Statistics Canada FDI by province](https://www150.statcan.gc.ca/t1/wds/rest/getCubeMetadata) | partial/coarser | open (no sign-up) | official | check coverage |
| 9 | DE | [Bundesbank direct investment statistics](https://www.bundesbank.de/en/statistics) | national only | web pages/files | official |  |
| 10 | FR | [Business France investment report](https://www.businessfrance.fr/) | partial/coarser | web pages/files | community | by region, reports |
| 11 | GB | [DBT inward investment results](https://www.gov.uk/government/collections/inward-investment-results) | division-level | web pages/files | official | projects by region |
| 12 | IT | [ISTAT / ICE foreign-controlled firms by region](https://www.istat.it/en/) | partial/coarser | web pages/files | community |  |
| 13 | JP | [JETRO FDI statistics](https://www.jetro.go.jp/en/invest/investment_environment/ijre.html) | partial/coarser | web pages/files | community |  |
| 14 | KR | [MOTIE/KOTRA FDI statistics](https://www.investkorea.org/ik-en/index.do) | partial/coarser | web pages/files | official |  |
| 15 | IN | [DPIIT FDI equity inflows, state-wise fact sheet](https://dpiit.gov.in/publications/fdi-statistics) | division-level | web pages/files | official |  |
| 16 | CN | [MOFCOM actual use of FDI by region](https://data.mofcom.gov.cn/) | division-level | web pages/files | official |  |
| 17 | RU | [Rosstat foreign investment by region](https://rosstat.gov.ru/investment_nonfinancial) | division-level | web pages/files | official |  |
| 18 | UA | [Ukrstat foreign direct investment by region](https://www.ukrstat.gov.ua/) | division-level | web pages/files | official |  |
| 19 | IL | [CBS / Bank of Israel FDI](https://www.cbs.gov.il/en/Pages/default.aspx) | national only | web pages/files | official |  |
| 20 | SA | [MISA Saudi investment](https://misa.gov.sa/en) | national only | web pages/files | official |  |
| 21 | AE | [Dubai FDI Monitor / FCSC](https://fcsc.gov.ae/en-us) | partial/coarser | web pages/files | official |  |

## Geostrategic & Military Footprint (`military`)

| # | Scope | Source | Grain | Access | Trust | Note |
|---|---|---|---|---|---|---|
| 1 | GLOBAL | [UCDP Georeferenced Event Dataset](https://ucdpapi.pcr.uu.se/api/gedevents/24.1?pagesize=1) | division-level | open (no sign-up) | official | in use |
| 2 | GLOBAL | [ACLED](https://acleddata.com/) | division-level | account/registration | official | free account, OAuth; not in use |
| 3 | GLOBAL | [GDELT Project](https://api.gdeltproject.org/api/v2/doc/doc?query=military&mode=artlist&format=json&maxrecords=1) | division-level | open (no sign-up) | community | geo-coded news events |
| 4 | GLOBAL | [OSM Overpass (landuse=military, military=*)](https://overpass-api.de/api/status) | division-level | open (no sign-up) | community | in use |
| 5 | GLOBAL | [OurAirports (military airfields by name)](https://davidmegginson.github.io/ourairports-data/airports.csv) | division-level | open (no sign-up) | community | in use; heuristic |
| 6 | GLOBAL | [NASA FIRMS thermal anomalies](https://firms.modaps.eosdis.nasa.gov/) | division-level | free key (sign-up) | community |  |
| 7 | GLOBAL | [SIPRI Military Expenditure Database](https://www.sipri.org/databases/milex) | national only | web pages/files | official | national |
| 8 | GLOBAL | [World Bank WDI military expenditure](https://api.worldbank.org/v2/country/all/indicator/MS.MIL.XPND.GD.ZS?format=json&per_page=1) | national only | open (no sign-up) | official | in use |
| 9 | GLOBAL | [UNHCR operational data (displacement)](https://api.unhcr.org/population/v1/population/?limit=1) | national only | open (no sign-up) | official |  |
| 10 | GLOBAL | [IOM Displacement Tracking Matrix](https://dtm.iom.int/) | partial/coarser | web pages/files | community | UA, others |
| 11 | GLOBAL | [UN OCHA HDX conflict datasets](https://data.humdata.org/api/3/action/package_search?q=conflict&rows=1) | partial/coarser | open (no sign-up) | official |  |
| 12 | GLOBAL | [ReliefWeb API](https://api.reliefweb.int/v1/reports?appname=probe&limit=1) | partial/coarser | free key (sign-up) | official | appname registration |
| 13 | GLOBAL | [Wikidata (military bases, P31)](https://query.wikidata.org/sparql) | partial/coarser | open (no sign-up) | community |  |
| 14 | GLOBAL | [ISW assessments (Ukraine, Russia)](https://understandingwar.org/) | partial/coarser | web pages/files | community | analysis, not data |
| 15 | US | [DoD Base Structure Report / DMDC workforce by state](https://dwp.dmdc.osd.mil/dwp/app/dod-data-reports/workforce-reports) | division-level | web pages/files | official |  |
| 16 | US | [USAspending defence contracts by state](https://api.usaspending.gov/api/v2/references/toptier_agencies/) | division-level | open (no sign-up) | official |  |
| 17 | GB | [MoD Armed Forces personnel statistics](https://www.gov.uk/government/collections/uk-armed-forces-quarterly-service-personnel-statistics) | partial/coarser | web pages/files | official | by region |
| 18 | DE | [Bundeswehr Standorte](https://www.bundeswehr.de/) | division-level | web pages/files | official |  |
| 19 | FR | [Ministère des Armées open data](https://www.data.gouv.fr/) | partial/coarser | open (no sign-up) | official |  |
| 20 | JP | [MOD Defense of Japan (US forces facilities by prefecture)](https://www.mod.go.jp/en/publ/w_paper/index.html) | division-level | web pages/files | official |  |
| 21 | KR | [USFK / MND installations](https://www.usfk.mil/) | partial/coarser | web pages/files | official |  |
| 22 | RU | [Conflict Intelligence Team / ISW](https://citeam.org/) | partial/coarser | web pages/files | community | analysis |

## Additions 2026-10-12 (from your list and the OECD Regional Economy metadata PDF)
Added to `subnational-source-catalogue.json` with `usable_now: false` until probed: World Bank Subnational Population (population),
data.gov.in (population; key, not reachable by my fetcher), BEA GDP by state and BEA SA51 disposable income (grp, hdi),
e-Stat Japan (grp), India state domestic product (grp), OECD regional database (hdi, patents).
Not added: Kaggle (account needed, mostly one-off uploads), Our World in Data (not checked; as far as I know mostly national),
stats.gov.cn English front page (showed only news; `data.stats.gov.cn` is already listed under grp/population/hdi/fiscal).
The 2015 PDF's data end in 2013-2014; use it as a map of data owners, not as current data.
