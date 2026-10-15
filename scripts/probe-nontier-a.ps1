# Probe the candidate source URLs from "Non European Tier A subnational sources".
# Read-only: GET only, one request at a time, honest User-Agent, no TLS bypass, no bot-wall bypass, max ~256 KB per URL.
# Run from the repo root:   powershell -ExecutionPolicy Bypass -File scripts\probe-nontier-a.ps1
# Optional:  -Only 19,20,21   (probe just those row numbers)
param(
  [int[]]$Only = @(),
  [int]$TimeoutSec = 30,
  [int]$DelayMs = 1500,
  [int]$MaxBytes = 262144
)
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$Out = Join-Path $Root 'docs\samples\probe-nontier'
$Heads = Join-Path $Out 'heads'
$Robots = Join-Path $Out 'robots'
New-Item -ItemType Directory -Force -Path $Heads, $Robots | Out-Null
try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch {}
Add-Type -AssemblyName System.Net.Http

$handler = New-Object System.Net.Http.HttpClientHandler
$handler.AllowAutoRedirect = $true
$handler.MaxAutomaticRedirections = 8
$handler.AutomaticDecompression = [System.Net.DecompressionMethods]::GZip -bor [System.Net.DecompressionMethods]::Deflate
$client = New-Object System.Net.Http.HttpClient($handler)
$client.Timeout = [TimeSpan]::FromSeconds($TimeoutSec)
[void]$client.DefaultRequestHeaders.UserAgent.ParseAdd('Worldmonitor-FAII-probe/1.0 (personal research; read-only)')
[void]$client.DefaultRequestHeaders.Accept.ParseAdd('*/*')

$urls = @(
  @(1, 'https://www.dane.gov.co/index.php/estadisticas-por-tema/cuentas-nacionales/cuentas-nacionales-departamentales', 'Colombia', 'HTML page; scrape for XLSX links'),
  @(2, 'https://www.dane.gov.co/files/operaciones/PIB/anex-PIBDep-TotalDep-2025pr.xlsx', 'Colombia dept GDP 2005-2025p', 'XLSX'),
  @(3, 'https://www.dane.gov.co/files/operaciones/PIB/anex-PIBDep-departamento-2025pr.xlsx', 'Colombia, by department', 'XLSX'),
  @(4, 'https://www.dane.gov.co/files/operaciones/PIB/anex-PIBDep-Activecono-2025pr.xlsx', 'Colombia, by activity', 'XLSX'),
  @(5, 'https://www.dane.gov.co/files/operaciones/PIB/anex-PIBDep-Regiones-2025pr.xlsx', 'Colombia, by region 2014-2025', 'XLSX'),
  @(6, 'https://www.dane.gov.co/files/operaciones/PIB/anex-PIBDep-RetropoDepart-2025pr.xlsx', 'Colombia, backcast 1980-2025', 'XLSX'),
  @(7, 'https://www.dane.gov.co/files/operaciones/PIB/anex-PIBDep-ValorAgreMuni-2011-2024p.xlsx', 'Colombia, municipal value added', 'XLSX'),
  @(8, 'https://www.dane.gov.co/files/operaciones/PIB/bol-PIBDep-2025pr.pdf', 'Colombia bulletin', 'PDF'),
  @(9, 'https://www.dane.gov.co/files/operaciones/PIB/departamental/DSO-PIB-DEP-MET-001-V8.pdf', 'Colombia methodology', 'PDF'),
  @(10, 'https://dnp.gov.co/LaEntidad_/subdireccion-general-descentralizacion-desarrollo-territorial/direccion-ordenamiento-desarrollo-territorial/Paginas/sistema-de-estadisticas-territoriales-terridata.aspx', 'Colombia TerriData (robots-disallowed to WebFetch)', 'HTML; download format unknown'),
  @(11, 'https://www.datos.gov.co/resource/<id>.json', 'Colombia Socrata pattern (recalled; ids unknown)', 'JSON'),
  @(12, 'https://siat.stat.uz/data/1901/?lang=en', 'Uzbekistan fixed-asset foreign investment', 'CSV/JSON/XML/XLSX/PDF plus SDMX'),
  @(13, 'https://siat.stat.uz/data/1959/?lang=en', 'Uzbekistan FDI per capita', 'same as above'),
  @(14, 'https://siat.stat.uz/data/2633/?lang=en', 'Uzbekistan, related indicator', 'same as above'),
  @(15, 'https://siat.stat.uz/data/1336/?lang=en', 'Uzbekistan, related indicator', 'same as above'),
  @(16, 'https://stat.uz/img/news/analitika-vrp_eng_p89375.pdf', 'Uzbekistan GRP Jan-Dec 2025 prelim', 'PDF'),
  @(17, 'https://stat.uz/images/uploads/reliz2024/VRP_pressreliz2024yen.pdf', 'Uzbekistan GRP 2024', 'PDF'),
  @(18, 'https://stat.uz/img/vrp_press-reliz-yanvar-mart-2024-eng_p23664.pdf', 'Uzbekistan GRP Q1 2024', 'PDF'),
  @(19, 'https://storage.dosm.gov.my/gdp/gdp_state_real_supply.csv', 'Malaysia state GDP', 'CSV'),
  @(20, 'https://storage.dosm.gov.my/gdp/gdp_state_real_supply.parquet', 'Malaysia state GDP', 'Parquet'),
  @(21, 'https://api.data.gov.my/data-catalogue?id=gdp_state_real_supply&limit=3', 'Malaysia state GDP', 'JSON API'),
  @(22, 'https://open.dosm.gov.my/data-catalogue/gdp_state_real_supply', 'Malaysia dataset page', 'HTML'),
  @(23, 'https://open.dosm.gov.my/data-catalogue', 'Malaysia catalogue (population_state, fdi_flows, electricity listings)', 'HTML'),
  @(24, 'https://storage.data.gov.my/publicsafety/crime_district.csv', 'Malaysia crime by district', 'CSV'),
  @(25, 'https://storage.data.gov.my/publicsafety/crime_district.parquet', 'Malaysia crime by district', 'Parquet'),
  @(26, 'https://open.dosm.gov.my/data-catalogue/crime_district', 'Malaysia dataset page', 'HTML'),
  @(27, 'https://developer.data.gov.my/static-api/opendosm', 'Malaysia API docs (seen only in page text)', 'HTML'),
  @(28, 'https://archive.data.gov.my/data/dataset/gross-domestic-product-gdp-by-state-at-current-prices', 'Malaysia archive, current-price state GDP', 'HTML (older portal)'),
  @(29, 'https://www.stat.gov.kg/en/opendata/category/29', 'Kyrgyzstan GRP 2020-2024', 'HTML with XLSX, SDMX-XML, JSON links'),
  @(30, 'https://stat.gov.kg/en/opendata/category/28/', 'Kyrgyzstan GRP per capita', 'same'),
  @(31, 'https://stat.gov.kg/en/opendata/category/3381', 'Kyrgyzstan GRP growth by activity 2015-2019', 'same'),
  @(32, 'https://stat.gov.kg/en/opendata/category/6249/', 'Kyrgyzstan GRP by activity (also 5804, 6248, 6250, 6254)', 'same'),
  @(33, 'https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/1002000001/es/00/false/BISE/2.0/{TOKEN}?type=json', 'Mexico INEGI API; swap 00 for 99 for states', 'JSON (token required)'),
  @(34, 'https://inegi.org.mx/servicios/api_indicadores.html', 'Mexico API docs', 'HTML'),
  @(35, 'https://www.inegi.org.mx/programas/pibent/2018/', 'Mexico PIBE data page', 'HTML; XLSX/CSV expected'),
  @(36, 'https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2025/pibent/PIBE2024_CP.pdf', 'Mexico PIBE 2024 release', 'PDF'),
  @(37, 'https://www.inegi.org.mx/app/estatal/', 'Mexico state dashboard', 'interactive; check network calls for JSON'),
  @(38, 'https://www.gob.mx/sesnsp/acciones-y-programas/datos-abiertos-de-incidencia-delictiva', 'Mexico SESNSP crime (recalled or derived, not opened)', 'HTML linking CSV/ZIP'),
  @(39, 'https://statistics.cepal.org/portal/cepalstat/subnational-statistics.html?lang=en', 'CEPALSTAT subnational root', 'HTML'),
  @(40, 'https://statistics.cepal.org/portal/cepalstat/dashboard.html?area_id=2598&lang=en', 'CEPALSTAT subnational GDP', 'dashboard; look for export'),
  @(41, 'https://statistics.cepal.org/portal/cepalstat/dashboard.html?area_id=2318&lang=en', 'CEPALSTAT subnational population', 'dashboard; look for export'),
  @(42, 'https://statistics.cepal.org/portal/cepalstat/index.html?lang=en', 'CEPALSTAT index', 'HTML'),
  @(43, 'https://data-explorer.oecd.org/vis?df[ag]=OECD.CFE.EDS&df[ds]=DisseminateFinalDMZ&df[id]=DSD_REG_ECO@DF_GDP', 'OECD regional GDP', 'SDMX behind the explorer (recalled)'),
  @(44, 'https://db.nomics.world/OECD/DSD_REG_ECO@DF_GDP', 'OECD regional GDP via DBnomics (unofficial mirror)', 'JSON/API'),
  @(45, 'https://statistics.gov.rw/sites/default/files/documents/2025-04/EICV7_Tables_MainIndicatorReport.xlsx', 'Rwanda EICV7', 'XLSX'),
  @(46, 'https://statistics.gov.rw/statistical-publications/poverty-and-social-protection/eicv7-main-indicators-report-202324', 'Rwanda EICV7 page', 'HTML'),
  @(47, 'https://statistics.gov.rw/sites/default/files/documents/2025-07/EICV7_Main%20Indicator%20Report.pdf', 'Rwanda EICV7', 'PDF'),
  @(48, 'https://www.knbs.or.ke/reports/gross-county-product-2024/', 'Kenya GCP 2019-2023', 'HTML; find PDF link'),
  @(49, 'https://www.knbs.or.ke/reports/gross-county-product-2023/', 'Kenya GCP earlier edition', 'HTML'),
  @(50, 'https://migori.go.ke/wp-content/uploads/2026/04/CBIRR-2024-25-24.02.2025-DR-25225-b-1.pdf', 'Kenya Controller of Budget, 47 counties', 'PDF'),
  @(51, 'https://libraryir.parliament.go.ke/items/84620892-8e31-4146-9287-c635c1f4eb5f', 'Kenya CoB earlier editions', 'HTML'),
  @(52, 'https://data.humdata.org/group/ken?page=12', 'Kenya HDX group (stale items)', 'HTML'),
  @(53, 'https://www.nbs.go.tz/uploads/statistics/documents/en-1769087518-National%20Accounts%20of%20Mainland%20Tanzania%202018%20-%202024.pdf', 'Tanzania regional GDP Tables 26-28', 'PDF'),
  @(54, 'https://www.nbs.go.tz/statistics/topic/regional-gdp-reports', 'Tanzania topic page', 'HTML'),
  @(55, 'https://www.nbs.go.tz/uploads/statistics/documents/en-1705429385-Regional_GDP_Reports.zip', 'Tanzania 2012 regional GDP', 'ZIP'),
  @(56, 'https://www.ubos.org/wp-content/uploads/publications/Population-Projections-2025_2050.pdf', 'Uganda district Table 5', 'PDF'),
  @(57, 'https://statistics.ubos.org/nphc/resources/Population-Projections-2025-2050.pdf', 'Uganda mirror', 'PDF'),
  @(58, 'https://www.instat.mg/documents/upload/main/INSTAT_EDSMD-V_Indicateurs-cles_18-11-2021.pdf', 'Madagascar DHS 2021, 22 regions', 'PDF'),
  @(59, 'https://www.instat.mg/documents/upload/main/Projection%202050.pdf', 'Madagascar projections', 'PDF'),
  @(60, 'https://statsbots.org.bw/publication-by-sector/154', 'Botswana publications', 'HTML listing of PDFs'),
  @(61, 'https://www.statssa.gov.za/?p=16650', 'South Africa provincial GDP', 'HTML'),
  @(62, 'https://www.statssa.gov.za/?page_id=1854&PPN=D0441.1&SCH=73625', 'South Africa D0441.1 download page (not opened)', 'HTML'),
  @(63, 'https://www.treasury.gov.za/publications/igfr/2025/Provincial%20Budgets%20and%20Expenditure%20Review%202020-21%20-%202026-27.pdf', 'South Africa provincial budgets', 'PDF'),
  @(64, 'https://www.dhsprogram.com/publications/publication-FR389-DHS-Final-Reports.cfm', 'Mozambique DHS 2022-23', 'HTML/PDF'),
  @(65, 'https://api.dhsprogram.com/rest/dhs/data?countryIds=KE,MG,MZ,RW,TZ,UG,ZM,ET&breakdown=subnational&f=json', 'DHS API, East/Southern Africa (params from rdhs docs)', 'JSON'),
  @(66, 'https://api.dhsprogram.com/rest/dhs/surveys?countryIds=GH,CI,CD,EG,JO,MA&f=json', 'DHS API, West/MENA (params LOW)', 'JSON'),
  @(67, 'https://api.dhsprogram.com/rest/dhs/dataupdates', 'DHS API health check', 'JSON'),
  @(68, 'https://globaldatalab.org/shdi/download_files/', 'GDL SHDI download page (v8.4 data and labels)', 'HTML; CSV after registration'),
  @(69, 'https://globaldatalab.org/shdi/archive/', 'GDL version table (v10.2)', 'HTML'),
  @(70, 'https://globaldatalab.org/shdi/metadata/', 'GDL metadata (probably stale)', 'HTML'),
  @(71, 'https://globaldatalab.org/shdi', 'GDL SHDI main page', 'HTML; CSV/Excel after registration'),
  @(72, 'https://data.humdata.org/m/dataset/cod-ab-gha', 'Ghana COD-AB', 'XLSX/SHP/GDB'),
  @(73, 'https://data.humdata.org/dataset/cod-ab-kgz', 'Kyrgyzstan COD-AB', 'SHP/KMZ'),
  @(74, 'https://data.humdata.org/api/3/action/package_search', 'HDX CKAN API (recalled)', 'JSON'),
  @(75, 'https://statsghana.gov.gh/releases/upcoming/gdp-release', 'Ghana page linking StatsBank and microdata', 'HTML'),
  @(76, 'https://census2021.statsghana.gov.gh/gssmain/fileUpload/reportthemelist/Volume%203%20Highlights.pdf', 'Ghana 2021 PHC Vol. 3', 'PDF'),
  @(77, 'https://www.hcp.ma/file/245068/', 'Morocco regional accounts 2023 (French)', 'PDF'),
  @(78, 'https://www.hcp.ma/Les-comptes-regionaux-Produit-interieur-brut-et-depenses-de-consommation-finale-des-menages-2023_a4168.html', 'Morocco HCP page', 'HTML'),
  @(79, 'https://opendata.gov.jo/dataset/MIGRATED-72-2018', 'Jordan governorate population', 'CSV/XLSX/JSON/XML'),
  @(80, 'https://www.mped.gov.eg/GrossDomestic?lang=en', 'Egypt GDP by governorate', 'interactive; check network calls for JSON'),
  @(81, 'https://www.amar.org.ir/en/news', 'Iran SCI (test from Iran-friendly IP)', 'HTML'),
  @(82, 'https://www.tresor.economie.gouv.fr/Pays/CG/recensement-2023-au-congo-brazzaville', 'Congo department census summary', 'HTML'),
  @(83, 'https://www.data.gov.bh/', 'Bahrain portal', 'API/CSV/GeoJSON/Excel (per secondary description)'),
  @(84, 'https://openstat.psa.gov.ph/Database/Economic-Accounts/Provincial-Product-Accounts', 'Philippines provincial GDP', 'PxWeb-style (recalled), format unconfirmed'),
  @(85, 'https://psa.gov.ph/statistics/ppa/tables', 'Philippines provincial GDP', 'HTML tables'),
  @(86, 'https://www.nso.go.th/public/e-book/Statistical-Yearbook/SYB-2025_webPage/File%20SYB/2025/10/T%2010.15%202025.pdf', 'Thailand GPP 2021-2023', 'PDF'),
  @(87, 'https://indicator.api.abs.gov.au/v1/dataflows/json', 'Australia ABS Indicator API (needs x-api-key)', 'JSON'),
  @(88, 'https://data.gov.sg/datasets/d_d95ae740c0f8961a0b10435836660ce0/view', 'Singapore planning-area population', 'CSV'),
  @(89, 'https://stat.gov.kz/en/industries/economy/national-accounts/publications/367813/', 'Kazakhstan GRP 2024 prelim', 'HTML table (check robots.txt)'),
  @(90, 'https://stat.gov.kz/api/iblock/element/507192/file/en/', 'Kazakhstan national-accounts attachment', 'unknown file type'),
  @(91, 'https://www.geostat.ge/media/67721/Regional-Gross-Domestic-Product---2023.pdf', 'Georgia regional GDP 2022-23', 'PDF'),
  @(92, 'https://regions.geostat.ge/regions/comparison/regionComp.php?lang=en', 'Georgia regions portal', 'interactive HTML; check network calls'),
  @(93, 'http://opendata.1212.mn/en/doc', 'Mongolia NSO REST API docs; then GET /api/Itms (inferred, LOW)', 'HTML, then JSON'),
  @(94, 'https://data.1212.mn/', 'Mongolia NSO PXWeb root', 'JSON metadata expected (LOW)'),
  @(95, 'https://banguat.gob.gt/sites/default/files/banguat/Publica/PIB_Regional/2024_PIB_Regional_y_Departamental_Informe.pdf', 'Guatemala departmental GDP', 'PDF'),
  @(96, 'https://www.banguat.gob.gt/sites/default/files/banguat/Publica/PIB_Regional/5_PIB_total_por_departamento.pdf', 'Guatemala table', 'PDF'),
  @(97, 'https://www.banguat.gob.gt/sites/default/files/banguat/Publica/PIB_Regional/8_PIB_Per_Capita_por_departamento.pdf', 'Guatemala table', 'PDF'),
  @(98, 'https://www.inec.gob.pa/archivos/P0705547520241120142153COMENTARIOS.pdf', 'Panama provincial GDP 2018-2023', 'PDF'),
  @(99, 'https://www.inec.gob.pa/archivos/P0579518620240529130901Cuadro%2045.pdf', 'Panama municipal expenditure by province, 2022', 'PDF'),
  @(100, 'https://si3.bcentral.cl/estadisticas/Principal1/Excel/CCNN/regional/xls/PIBR.xls', 'Chile regional GDP (year unknown)', 'XLS'),
  @(101, 'https://si3.bcentral.cl/estadisticas/Principal1/Excel/CCNN/regional/xls/PIBR_Act.xls', 'Chile, by activity and region', 'XLS'),
  @(102, 'https://si3.bcentral.cl/estadisticas/Principal1/Excel/CCNN/regional/excel.html', 'Chile Excel hub', 'HTML'),
  @(103, 'https://www.bcp.gov.py/documents/20117/1935346/Informe+CRA.pdf', 'Paraguay CRA 2021-2023', 'PDF'),
  @(104, 'https://www.ibge.gov.br/estatisticas/economicas/contas-nacionais/9054-contas-regionais-do-brasil.html?edicao=45139&t=resultados', 'Brazil regional accounts', 'HTML; find XLS/SIDRA links'),
  @(105, 'https://apisidra.ibge.gov.br/values/t/{table}/n3/all/v/{var}/p/last', 'Brazil SIDRA API pattern (table number unknown)', 'JSON'),
  @(106, 'https://www.gov.br/tesouronacional/pt-br/central-de-conteudo/apis', 'Brazil Tesouro APIs index', 'HTML'),
  @(107, 'https://www.gub.uy/ministerio-interior/sites/ministerio-interior/files/documentos/publicaciones/AECA%202025%20BT-2025-01%20ANEXO%20Informe%20sobre%20homicidios.pdf', 'Uruguay homicides by department', 'PDF'),
  @(108, 'https://estadisticas.bcrp.gob.pe/estadisticas/series/mensuales/venta-de-energia-electrica-por-departamento', 'Peru electricity sales by department (search only)', 'HTML/series')
)

function Get-Head([string]$Url) {
  # returns @{ Status; Type; Length; Final; Bytes; Error }
  $r = @{ Status = 0; Type = ''; Length = ''; Final = ''; Bytes = [byte[]]@(); Error = '' }
  $resp = $null
  try {
    $resp = $client.GetAsync($Url, [System.Net.Http.HttpCompletionOption]::ResponseHeadersRead).GetAwaiter().GetResult()
    $r.Status = [int]$resp.StatusCode
    $r.Final = $resp.RequestMessage.RequestUri.AbsoluteUri
    if ($resp.Content.Headers.ContentType) { $r.Type = $resp.Content.Headers.ContentType.ToString() }
    if ($resp.Content.Headers.ContentLength) { $r.Length = [string]$resp.Content.Headers.ContentLength }
    $stream = $resp.Content.ReadAsStreamAsync().GetAwaiter().GetResult()
    $buf = New-Object byte[] 16384
    $ms = New-Object System.IO.MemoryStream
    while ($ms.Length -lt $MaxBytes) {
      $n = $stream.Read($buf, 0, $buf.Length)
      if ($n -le 0) { break }
      $ms.Write($buf, 0, $n)
    }
    $stream.Dispose()
    $r.Bytes = $ms.ToArray()
    $ms.Dispose()
  } catch {
    $e = $_.Exception
    while ($e.InnerException) { $e = $e.InnerException }
    $r.Error = $e.Message
  } finally {
    if ($resp) { $resp.Dispose() }
  }
  return $r
}

function Get-Kind([byte[]]$b, [string]$type) {
  if ($b.Length -ge 4) {
    if ($b[0] -eq 0x25 -and $b[1] -eq 0x50 -and $b[2] -eq 0x44 -and $b[3] -eq 0x46) { return 'pdf' }
    if ($b[0] -eq 0x50 -and $b[1] -eq 0x4B -and $b[2] -eq 0x03 -and $b[3] -eq 0x04) { return 'zip/xlsx' }
    if ($b[0] -eq 0xD0 -and $b[1] -eq 0xCF -and $b[2] -eq 0x11 -and $b[3] -eq 0xE0) { return 'xls(ole)' }
    if ($b[0] -eq 0x50 -and $b[1] -eq 0x41 -and $b[2] -eq 0x52 -and $b[3] -eq 0x31) { return 'parquet' }
  }
  if ($b.Length -eq 0) { return 'empty' }
  $txt = [Text.Encoding]::UTF8.GetString($b, 0, [Math]::Min($b.Length, 2000)).TrimStart()
  if ($txt -match '^(<!doctype html|<html|<head|<body)') { return 'html' }
  if ($txt -match '^[\{\[]') { return 'json' }
  if ($txt -match '^<\?xml|^<[A-Za-z]') { return 'xml/html' }
  if ($type -match 'csv') { return 'csv' }
  return 'other'
}

function Test-Wall([int]$status, [byte[]]$b) {
  $txt = ''
  if ($b.Length -gt 0) { $txt = [Text.Encoding]::UTF8.GetString($b, 0, [Math]::Min($b.Length, 20000)) }
  if ($txt -match 'Just a moment|cf-chl|cf_chl|Attention Required|captcha|reCAPTCHA|hCaptcha|_Incapsula_|Request unsuccessful|Access Denied|Pardon Our Interruption|Checking your browser') { return $true }
  return ($status -in 401, 403, 429, 503)
}

$robotCache = @{}
function Get-RobotsVerdict([string]$Url) {
  $u = [Uri]$Url
  $key = $u.Scheme + '://' + $u.Authority
  if (-not $robotCache.ContainsKey($key)) {
    $rules = @(); $state = 'none'
    $h = Get-Head ($key + '/robots.txt')
    if ($h.Status -eq 200 -and $h.Bytes.Length -gt 0) {
      $text = [Text.Encoding]::UTF8.GetString($h.Bytes)
      if ($text -match '(?is)^\s*<(!doctype|html)') { $state = 'robots-not-text' }
      else {
        $state = 'robots-found'
        [IO.File]::WriteAllText((Join-Path $Robots (($u.Authority) -replace '[^A-Za-z0-9.-]', '_') + '.txt'), $text)
        $applies = $false
        foreach ($line in ($text -split "`r?`n")) {
          $l = ($line -replace '#.*$', '').Trim()
          if ($l -match '^(?i)user-agent:\s*(.*)$') { $applies = ($Matches[1].Trim() -eq '*') }
          elseif ($applies -and $l -match '^(?i)disallow:\s*(\S+)') { $rules += $Matches[1] }
        }
      }
    } elseif ($h.Status -eq 404) { $state = 'no-robots-404' }
    elseif ($h.Error) { $state = 'robots-fetch-error' }
    else { $state = 'robots-http-' + $h.Status }
    $robotCache[$key] = @{ State = $state; Rules = $rules }
    Start-Sleep -Milliseconds $DelayMs
  }
  $c = $robotCache[$key]
  $path = $u.PathAndQuery
  foreach ($p in $c.Rules) { if ($p -ne '' -and $path.StartsWith($p)) { return "DISALLOWED for * ($p)" } }
  return $c.State
}

$results = New-Object System.Collections.Generic.List[object]
$i = 0
foreach ($row in $urls) {
  $id = $row[0]; $url = $row[1]; $scope = $row[2]; $expected = $row[3]
  if ($Only.Count -gt 0 -and ($Only -notcontains $id)) { continue }
  $i++
  $rec = [ordered]@{ id = $id; scope = $scope; expected = $expected; url = $url; verdict = ''; status = ''; kind = ''; contentType = ''; bytesRead = ''; contentLength = ''; seconds = ''; robots = ''; finalUrl = ''; note = '' }
  if ($url -match '[{}<>]') {
    $rec.verdict = 'SKIP-template'; $rec.note = 'URL contains a placeholder (token/id/table); needs a real value first'
    $results.Add([pscustomobject]$rec); Write-Host ("[{0,3}] SKIP     {1}" -f $id, $url); continue
  }
  try { $rec.robots = Get-RobotsVerdict $url } catch { $rec.robots = 'robots-check-failed' }
  $sw = [Diagnostics.Stopwatch]::StartNew()
  $h = Get-Head $url
  $sw.Stop()
  $rec.seconds = [Math]::Round($sw.Elapsed.TotalSeconds, 1)
  $rec.status = $h.Status; $rec.contentType = $h.Type; $rec.contentLength = $h.Length; $rec.finalUrl = $h.Final; $rec.bytesRead = $h.Bytes.Length
  if ($h.Error) { $rec.verdict = 'ERROR'; $rec.note = $h.Error }
  else {
    $rec.kind = Get-Kind $h.Bytes $h.Type
    $wall = Test-Wall $h.Status $h.Bytes
    if ($h.Status -ge 200 -and $h.Status -lt 300 -and -not $wall) { $rec.verdict = 'OK' }
    elseif ($wall) { $rec.verdict = 'BLOCKED' }
    elseif ($h.Status -in 404, 410) { $rec.verdict = 'NOT-FOUND' }
    else { $rec.verdict = 'HTTP-' + $h.Status }
    if ($h.Bytes.Length -gt 0) {
      $ext = switch -Wildcard ($rec.kind) { 'pdf' {'pdf'} 'zip/xlsx' {'zip'} 'xls(ole)' {'xls'} 'parquet' {'parquet'} 'html' {'html'} 'json' {'json'} 'csv' {'csv'} default {'txt'} }
      [IO.File]::WriteAllBytes((Join-Path $Heads ('{0:000}.head.{1}' -f $id, $ext)), $h.Bytes)
    }
  }
  $results.Add([pscustomobject]$rec)
  Write-Host ("[{0,3}] {1,-10} {2,3} {3,-9} {4}" -f $id, $rec.verdict, $rec.status, $rec.kind, $url)
  Start-Sleep -Milliseconds $DelayMs
}

$csv = Join-Path $Out 'results.csv'
$results | Export-Csv -Path $csv -NoTypeInformation -Encoding UTF8
Write-Host ''
Write-Host '=== Summary ==='
$results | Group-Object verdict | Sort-Object Count -Descending | ForEach-Object { Write-Host ("{0,-14} {1}" -f $_.Name, $_.Count) }
Write-Host ''
Write-Host "Results: $csv"
Write-Host "Saved heads (first up to $MaxBytes bytes of each response): $Heads"
Write-Host 'Paste the table above (and results.csv if you can) back to me.'
