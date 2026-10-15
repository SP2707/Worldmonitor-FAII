# Retry the URLs that failed in probe-nontier-a.ps1 using curl.exe (Windows' own schannel TLS, longer timeout, browser-style Accept).
# No TLS bypass (no -k), no bot-wall bypass. Run from the repo root:  .\scripts\probe-nontier-a-retry.ps1
$ErrorActionPreference = 'Continue'
$Root = Split-Path $PSScriptRoot -Parent
$Out = Join-Path $Root 'docs\samples\probe-nontier'
$Heads = Join-Path $Out 'retry'
New-Item -ItemType Directory -Force -Path $Heads | Out-Null
$ua = 'Worldmonitor-FAII-probe/1.0 (personal research; read-only)'
$csv = Import-Csv (Join-Path $Out 'results.csv') -Encoding UTF8
$todo = $csv | Where-Object { $_.verdict -in 'ERROR', 'HTTP-406' -and $_.url -notmatch 'opendata\.1212\.mn' }
# Alternates for hosts that did not resolve
$extra = @(
  @{ id = 98;  url = 'https://inec.gob.pa/archivos/P0705547520241120142153COMENTARIOS.pdf' },
  @{ id = 99;  url = 'https://inec.gob.pa/archivos/P0579518620240529130901Cuadro%2045.pdf' },
  @{ id = 931; url = 'https://data.1212.mn/api/v1/en/' }
)
$rows = @()
foreach ($t in $todo) { $rows += @{ id = [int]$t.id; url = $t.url } }
$rows += $extra
$res = @()
foreach ($r in $rows) {
  $f = Join-Path $Heads ('{0:000}.curl' -f $r.id)
  if ((Test-Path $f) -and ((Get-Item $f).Length -gt 0)) { continue }  # already fetched on an earlier run
  $w = & curl.exe -sS -L --max-time 90 --connect-timeout 30 -r 0-262143 -A $ua -H 'Accept: text/html,application/json,*/*;q=0.8' -o $f -w '%{http_code}|%{content_type}|%{size_download}|%{url_effective}' $r.url 2>&1 | ForEach-Object { "$_" }
  $line = ("[{0,3}] {1}  {2}" -f $r.id, ($w -join ' '), $r.url)
  Write-Host $line
  $res += $line
  Start-Sleep -Milliseconds 1500
}
$res | Set-Content (Join-Path $Out 'retry-results.txt') -Encoding UTF8
Write-Host ''
Write-Host "Saved: $Out\retry-results.txt and $Heads"
Write-Host 'Paste the lines above back to me.'
