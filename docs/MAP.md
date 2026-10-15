# Offline map viewer

A private, dependency-free map for this headless deployment. It replaces the web dashboard's map (deck.gl/MapLibre plus third-party tiles) with
geometry that ships in the repository, so nothing is requested from a tile server or CDN.

It can be used three ways:

| Use | How | Result |
| --- | --- | --- |
| **In Alfred's chat** | MCP tool `render_map` | A compact *scene* that an MCP-Apps host draws inline via the `ui://worldmonitor/map.html` shell. No new window. |
| Hosts that render SVG/HTML inline | `render_map` with `output: "svg"` or `"html"` | One self-contained SVG string, or a CSP-locked HTML page with layer toggles. |
| From a terminal | `node scripts/render-map.mjs ...` | `.svg`, `.html` or `.png` file. |

## Honest status of the 58 layers

The dashboard's `MapLayers` interface has 58 keys. They are **not** all fully live here, and the viewer says so per layer instead of drawing nothing silently.

| Class | Count | Meaning |
| --- | ---: | --- |
| static | 28 | Curated geometry bundled in `scripts/data/map/static-layers.json` (plus two existing files in `scripts/data/`). Always renders. These are datasets, not live feeds. |
| live | 18 | Read from Redis keys written by a seeder. Draws only after that seeder has run. |
| computed | 1 | Day/night terminator, from the clock. |
| unavailable | 11 | No data path exists in this project. The reason is returned with the request. |

Live layers use a generic reader (`scripts/map/data.mjs`) that looks for coordinate-bearing records, because the seeders' payload shapes differ.
**That reader has been unit-tested against fixtures only; it has not been run against real seeded payloads.** If a payload has no coordinates the layer is
reported `no_data` with the reason. Check each live layer once after seeding (`node scripts/render-map.mjs --layers <key> --live --out x.svg`).

### Layers

| Key | Label | Group | Draws as | Source class | Data keys / reason |
| --- | --- | --- | --- | --- | --- |
| `conflicts` | Conflict zones | security | polygons | static | bundled dataset |
| `bases` | Military bases | security | points | static | bundled dataset |
| `cables` | Undersea cables | infrastructure | lines | static | bundled dataset |
| `pipelines` | Pipelines | infrastructure | lines | static | bundled dataset |
| `hotspots` | Intel hotspots | security | points | static | bundled dataset |
| `ais` | AIS ship traffic | infrastructure | points | unavailable | Needs the live AIS relay (scripts/ais-relay.cjs) and an AIS stream key; no vessel positions are stored in Redis by any seeder here. |
| `nuclear` | Nuclear facilities | security | points | static | bundled dataset |
| `irradiators` | Gamma irradiators | security | points | static | bundled dataset |
| `radiationWatch` | Radiation watch | hazards | points | live | `radiation:observations:v1` |
| `sanctions` | Sanctions pressure | security | choropleth | live | `sanctions:country-counts:v1`, `sanctions:pressure:v1` |
| `weather` | Weather alerts | hazards | points | live | `weather:alerts:v1` |
| `canadaRoads` | Canada road conditions | infrastructure | points | unavailable | No seeder in this project writes Canadian road-condition coordinates to Redis. |
| `canadaAlerts` | Canada alerts | hazards | points | unavailable | Canadian alert seeding (seed-bundle-canada) does not publish a coordinate payload this viewer can read. |
| `economic` | Economic centers | economy | points | static | bundled dataset |
| `waterways` | Strategic waterways | infrastructure | points | static | bundled dataset |
| `outages` | Internet outages | infrastructure | points | live | `infra:outages:v1` |
| `cyberThreats` | Cyber threats | security | points | live | `cyber:threats:v2` |
| `datacenters` | AI data centers | tech | points | static | bundled dataset |
| `protests` | Protests & unrest | security | points | live | `unrest:events:v1` |
| `flights` | Airports & flight delays | infrastructure | points | static | `aviation:delays:intl:v3`, `aviation:delays:faa:v1` |
| `military` | Military flights | security | points | live | `military:flights:v1` |
| `natural` | Earthquakes & natural events | hazards | points | live | `seismology:earthquakes:v1`, `natural:events:v1` |
| `spaceports` | Spaceports | infrastructure | points | static | bundled dataset |
| `minerals` | Critical minerals | economy | points | static | bundled dataset |
| `fires` | Wildfires | hazards | points | live | `wildfire:fires:v1` |
| `ucdpEvents` | UCDP conflict events | security | points | live | `conflict:ucdp-events:v1` |
| `displacement` | Displacement | humanitarian | choropleth | live | `displacement:summary:v1` |
| `climate` | Climate anomalies | hazards | points | live | `climate:anomalies:v2` |
| `startupHubs` | Startup hubs | tech | points | static | bundled dataset |
| `cloudRegions` | Cloud regions | tech | points | static | bundled dataset |
| `accelerators` | Accelerators | tech | points | static | bundled dataset |
| `techHQs` | Tech headquarters | tech | points | static | bundled dataset |
| `techEvents` | Tech events | tech | points | live | `research:tech-events:v1` |
| `stockExchanges` | Stock exchanges | economy | points | static | bundled dataset |
| `financialCenters` | Financial centers | economy | points | static | bundled dataset |
| `centralBanks` | Central banks | economy | points | static | bundled dataset |
| `commodityHubs` | Commodity hubs | economy | points | static | bundled dataset |
| `gulfInvestments` | Gulf investments | economy | points | static | bundled dataset |
| `positiveEvents` | Positive events | positive | points | unavailable | Depends on the GDELT bulk positive-events materialiser, which writes no coordinate payload to a stable Redis key in this project. |
| `kindness` | Acts of kindness | positive | points | unavailable | Same dependency as positive events (GDELT bulk materialiser); no coordinate payload is stored. |
| `happiness` | World happiness | positive | choropleth | unavailable | No seeder in this project stores World Happiness scores. |
| `speciesRecovery` | Species recovery | positive | points | unavailable | No seeder in this project stores species-recovery data. |
| `renewableInstallations` | Renewable installations | positive | points | unavailable | Only a national World Bank renewable share is seeded (economic:worldbank-renewable:v1), not installation locations. |
| `tradeRoutes` | Trade routes | economy | lines | static | bundled dataset |
| `iranAttacks` | Iran theatre events | security | points | live | `conflict:iran-events:v1` |
| `gpsJamming` | GPS jamming | security | points | live | `intelligence:gpsjam:v2`, `intelligence:gpsjam:v1` |
| `satellites` | Satellites | tech | points | unavailable | intelligence:satellites:tle:v1 holds TLE elements; plotting positions needs an SGP4 propagator, which is not implemented. |
| `ciiChoropleth` | Country instability (CII) | security | choropleth | live | `risk:scores:sebuf:v8`, `risk:scores:sebuf:stale:v8` |
| `resilienceScore` | Country resilience score | economy | choropleth | live | `resilience:static:index:v1` |
| `dayNight` | Day / night | overlay | terminator | computed | bundled dataset |
| `miningSites` | Mining sites | economy | points | static | bundled dataset |
| `processingPlants` | Processing plants | economy | points | static | bundled dataset |
| `commodityPorts` | Commodity ports | economy | points | static | bundled dataset |
| `webcams` | Webcams | overlay | points | unavailable | Webcam listings need a third-party webcam API key; none is stored by a seeder. |
| `diseaseOutbreaks` | Disease outbreaks | humanitarian | points | live | `health:disease-outbreaks:v1` |
| `storageFacilities` | Energy storage facilities | infrastructure | points | static | bundled dataset (`scripts/data/storage-facilities.json`) |
| `fuelShortages` | Fuel shortages | infrastructure | choropleth | static | bundled dataset (`scripts/data/fuel-shortages.json`) |
| `liveTankers` | Live tankers | infrastructure | points | unavailable | Needs the live AIS relay and stream key (see AIS ship traffic). |

## The `render_map` tool

Arguments (all optional): `layers` (array of keys), `preset`, `bbox` `[minLon, minLat, maxLon, maxLat]`, `theme` (`dark`|`light`), `output` (`scene`|`svg`|`html`),
`width` (svg/html only), `max_features` (per layer, default 500, max 1500). With neither `layers` nor `preset` it draws the `overview` preset.

Presets: `overview` (default), `security`, `infrastructure`, `hazards`, `economy`, `tech`, `all-static` (28 layers), `all` (47 drawable layers; needs a seeded Redis for the live ones).

### Result contract

```jsonc
{
  "view": "map", "output": "scene", "generatedAt": "...", "theme": "dark", "width": 1000, "height": 495,
  "summary": { "requested": 9, "drawn": 6, "skipped": 3, "features": 616 },
  "layers":  [{ "key": "bases", "label": "Military bases", "status": "ok", "count": 210, "source": "..." }],
  "skipped": [{ "key": "ais", "label": "AIS ship traffic", "status": "unavailable", "reason": "..." }],
  "scene":   [{ "key": "bases", "color": "#f59e0b", "kind": "points", "pts": [[x, y, r, "name", "info"]] }],
  "geo":     { }   // only when bbox is set: base geometry for the zoomed projection
}
```

* `scene` modes: `points` -> `pts`, `lines`/`polygons` -> `paths: [[d, name, info]]`, `choropleth` -> `values: {ISO2: number}`, `terminator` -> `night: {d, sun}`.
  Coordinates are already projected (Equal Earth, 1000 px wide), so a client needs no map maths.
* `svg` / `html` modes return the document in `svg` / `html` instead of `scene`.
* Bad input returns `{ "error": "..." }` and draws nothing.

### Showing it in Alfred's chat

* **MCP-Apps host:** the tool is linked to `ui://worldmonitor/map.html`; the host renders the shell inline and passes it the tool result. The shell draws with DOM calls only
  (no `innerHTML`), toggles layers, shows hover details and lists any layers that were not drawn.
* **Any other host:** call with `output: "svg"` (or `"html"`) and place the string in whatever inline renderer the chat has. The HTML carries a CSP that allows only inline style/script.
* **Assumption to verify:** I do not know how Alfred's own client renders tool results. The shell was verified in headless Chromium inside a sandboxed iframe with a simulated host
  (initialise handshake, tool-result delivery, layer toggle, tooltip), not in Alfred itself.

### Size and model context

The MCP dispatcher returns the whole result as text, so a result that reaches the model also costs context. Measured on this repo:
`overview` is roughly 60 KB, `security` about 50 KB, `all-static` about 190 KB (the budget is 256 KB; larger results come back as `_budget_exceeded`).
Prefer a preset or a few layers, `bbox`, or a lower `max_features`. The `svg`/`html` outputs are several times larger than `scene` for the same layers.

## Command line

```
node scripts/render-map.mjs --list
node scripts/render-map.mjs --preset security --out map.svg
node scripts/render-map.mjs --layers cables,nuclear,natural,dayNight --out map.html --live
node scripts/render-map.mjs --preset all --live --out map.png --width 1600 --theme light
node scripts/render-map.mjs --preset security --bbox -20,30,60,72 --out europe.svg
```

`--live` reads the seeded Redis keys (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, as for the seeders). PNG output needs `sharp`, which is already a project dependency; it has not been run
on the Windows machine yet (the tests skip it when it cannot load).

## Known limits

* Cables and pipelines are straight segments between their recorded waypoints, so long runs look like lines across land. That is a property of the bundled dataset, not a projection bug.
* No zoom or pan in the shell; use `bbox` to re-render a region.
* Choropleth layers colour by ISO2 country only. Subnational shading is not implemented.
* The day/night terminator is approximate (declination and equation-of-time series), good to a degree or so, not an ephemeris.
* Static datasets are as current as the day they were bundled (`source` in each layer row names the origin).

## Tests

`tests/map-render.test.mjs` (renderer, data, geometry), `tests/map-tool.test.mjs` (tool, scene, shell). The MCP registry suites (`tests/mcp-*.test.mjs`) cover registration parity;
`public/.well-known/mcp/server-card.json` lists the tool and `tests/mcp-resources.test.mjs` expects the extra `ui://` resource.

## Notes added 2026-10-12
* `ciiChoropleth` reads `risk:scores:sebuf:v8`, which the server writes when something calls `get-risk-scores`;
  `scripts/warm-risk-scores.mjs` (scheduled every 8 min, needs `LOCAL_API_TOKEN`) does that. Payload fields read: `region` + `combinedScore`.
* `protests` reads `unrest:events:v1`; `seed-unrest-events` needs the GDELT bulk snapshot from `seed-gdelt-bulk-materializer` (tier 1 runs first).
* `node scripts/map-probe.mjs <redis key>` prints a key's structure and what the readers extract from it.
