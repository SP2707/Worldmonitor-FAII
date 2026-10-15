// The 58 map layers of the dashboard's MapLayers interface (src/types/index.ts), each with an honest data source
// classification for the offline viewer:
//
//   static       geometry bundled in scripts/data/map (or an existing JSON in scripts/data) - always renders
//   live         read from Redis keys written by a seeder - renders once that seeder has run
//   computed     derived from the clock - always renders
//   unavailable  no data path in this project; `reason` says exactly what is missing
//
// `render` says how a layer is painted: points, lines, polygons, choropleth (country fill by ISO2) or terminator.
// Live layers use a generic payload reader (data.mjs) because the seeders' payload shapes differ; if a payload has
// no coordinates the layer reports 0 features with the reason instead of failing silently.

export const GROUPS = {
  security: { label: 'Conflict & security', color: '#ef4444' },
  hazards: { label: 'Natural hazards & climate', color: '#f59e0b' },
  infrastructure: { label: 'Infrastructure & energy', color: '#38bdf8' },
  economy: { label: 'Economy & markets', color: '#34d399' },
  tech: { label: 'Technology', color: '#a78bfa' },
  humanitarian: { label: 'Humanitarian & health', color: '#fb7185' },
  positive: { label: 'Positive & society', color: '#4ade80' },
  overlay: { label: 'Overlays', color: '#94a3b8' },
};

const L = (key, label, group, render, source, extra = {}) => ({ key, label, group, render, source, ...extra });

export const LAYER_SPECS = [
  L('conflicts', 'Conflict zones', 'security', 'polygons', 'static'),
  L('bases', 'Military bases', 'security', 'points', 'static'),
  L('cables', 'Undersea cables', 'infrastructure', 'lines', 'static'),
  L('pipelines', 'Pipelines', 'infrastructure', 'lines', 'static'),
  L('hotspots', 'Intel hotspots', 'security', 'points', 'static'),
  L('ais', 'AIS ship traffic', 'infrastructure', 'points', 'unavailable', { reason: 'Needs the live AIS relay (scripts/ais-relay.cjs) and an AIS stream key; no vessel positions are stored in Redis by any seeder here.' }),
  L('nuclear', 'Nuclear facilities', 'security', 'points', 'static'),
  L('irradiators', 'Gamma irradiators', 'security', 'points', 'static'),
  L('radiationWatch', 'Radiation watch', 'hazards', 'points', 'live', { keys: ['radiation:observations:v1'] }),
  L('sanctions', 'Sanctions pressure', 'security', 'choropleth', 'live', { keys: ['sanctions:country-counts:v1', 'sanctions:pressure:v1'] }),
  L('weather', 'Weather alerts', 'hazards', 'points', 'live', { keys: ['weather:alerts:v1'], note: 'The seeded key expires after 15 minutes; render soon after seeding.' }),
  L('canadaRoads', 'Canada road conditions', 'infrastructure', 'points', 'unavailable', { reason: 'No seeder in this project writes Canadian road-condition coordinates to Redis.' }),
  L('canadaAlerts', 'Canada alerts', 'hazards', 'points', 'unavailable', { reason: 'Canadian alert seeding (seed-bundle-canada) does not publish a coordinate payload this viewer can read.' }),
  L('economic', 'Economic centers', 'economy', 'points', 'static'),
  L('waterways', 'Strategic waterways', 'infrastructure', 'points', 'static'),
  L('outages', 'Internet outages', 'infrastructure', 'points', 'live', { keys: ['infra:outages:v1'] }),
  L('cyberThreats', 'Cyber threats', 'security', 'points', 'live', { keys: ['cyber:threats:v2'] }),
  L('datacenters', 'AI data centers', 'tech', 'points', 'static'),
  L('protests', 'Protests & unrest', 'security', 'points', 'live', { keys: ['unrest:events:v1'] }),
  L('flights', 'Airports & flight delays', 'infrastructure', 'points', 'static', { keys: ['aviation:delays:intl:v3', 'aviation:delays:faa:v1'], note: 'Airports are static; delay payloads (if seeded) add live points.' }),
  L('military', 'Military flights', 'security', 'points', 'live', { keys: ['military:flights:v1', 'military:flights:stale:v1'], firstOf: true, note: 'The live key expires after 10 minutes; the 24 h stale copy is used when it is gone.' }),
  L('natural', 'Earthquakes & natural events', 'hazards', 'points', 'live', { keys: ['seismology:earthquakes:v1', 'natural:events:v1'] }),
  L('spaceports', 'Spaceports', 'infrastructure', 'points', 'static'),
  L('minerals', 'Critical minerals', 'economy', 'points', 'static'),
  L('fires', 'Wildfires', 'hazards', 'points', 'live', { keys: ['wildfire:fires:v1'] }),
  L('ucdpEvents', 'UCDP conflict events', 'security', 'points', 'live', { keys: ['conflict:ucdp-events:v1'] }),
  L('displacement', 'Displacement', 'humanitarian', 'choropleth', 'live', { keys: ['displacement:summary:v1:{YEAR}'] }),
  L('climate', 'Climate anomalies', 'hazards', 'points', 'live', { keys: ['climate:anomalies:v2'] }),
  L('startupHubs', 'Startup hubs', 'tech', 'points', 'static'),
  L('cloudRegions', 'Cloud regions', 'tech', 'points', 'static'),
  L('accelerators', 'Accelerators', 'tech', 'points', 'static'),
  L('techHQs', 'Tech headquarters', 'tech', 'points', 'static'),
  L('techEvents', 'Tech events', 'tech', 'points', 'live', { keys: ['research:tech-events:v1'] }),
  L('stockExchanges', 'Stock exchanges', 'economy', 'points', 'static'),
  L('financialCenters', 'Financial centers', 'economy', 'points', 'static'),
  L('centralBanks', 'Central banks', 'economy', 'points', 'static'),
  L('commodityHubs', 'Commodity hubs', 'economy', 'points', 'static'),
  L('gulfInvestments', 'Gulf investments', 'economy', 'points', 'static'),
  L('positiveEvents', 'Positive events', 'positive', 'points', 'unavailable', { reason: 'Depends on the GDELT bulk positive-events materialiser, which writes no coordinate payload to a stable Redis key in this project.' }),
  L('kindness', 'Acts of kindness', 'positive', 'points', 'unavailable', { reason: 'Same dependency as positive events (GDELT bulk materialiser); no coordinate payload is stored.' }),
  L('happiness', 'World happiness', 'positive', 'choropleth', 'unavailable', { reason: 'No seeder in this project stores World Happiness scores.' }),
  L('speciesRecovery', 'Species recovery', 'positive', 'points', 'unavailable', { reason: 'No seeder in this project stores species-recovery data.' }),
  L('renewableInstallations', 'Renewable installations', 'positive', 'points', 'unavailable', { reason: 'Only a national World Bank renewable share is seeded (economic:worldbank-renewable:v1), not installation locations.' }),
  L('tradeRoutes', 'Trade routes', 'economy', 'lines', 'static'),
  L('iranAttacks', 'Iran theatre events', 'security', 'points', 'live', { keys: ['conflict:iran-events:v1'] }),
  L('gpsJamming', 'GPS jamming', 'security', 'points', 'live', { keys: ['intelligence:gpsjam:v2', 'intelligence:gpsjam:v1'], firstOf: true }),
  L('satellites', 'Satellites', 'tech', 'points', 'unavailable', { reason: 'intelligence:satellites:tle:v1 holds TLE elements; plotting positions needs an SGP4 propagator, which is not implemented.' }),
  L('ciiChoropleth', 'Country instability (CII)', 'security', 'choropleth', 'live', { keys: ['risk:scores:sebuf:v8', 'risk:scores:sebuf:stale:v8'], firstOf: true, note: 'Written by the server on request, not by a seeder: request the risk scores once to fill it.' }),
  L('resilienceScore', 'Country resilience score', 'economy', 'choropleth', 'live', { keys: ['resilience:ranking:v28'], note: 'Needs seed-resilience-scores.mjs with the local server running; it calls the resilience API.' }),
  L('dayNight', 'Day / night', 'overlay', 'terminator', 'computed'),
  L('miningSites', 'Mining sites', 'economy', 'points', 'static'),
  L('processingPlants', 'Processing plants', 'economy', 'points', 'static'),
  L('commodityPorts', 'Commodity ports', 'economy', 'points', 'static'),
  L('webcams', 'Webcams', 'overlay', 'points', 'unavailable', { reason: 'Webcam listings need a third-party webcam API key; none is stored by a seeder.' }),
  L('diseaseOutbreaks', 'Disease outbreaks', 'humanitarian', 'points', 'live', { keys: ['health:disease-outbreaks:v1'] }),
  L('storageFacilities', 'Energy storage facilities', 'infrastructure', 'points', 'static', { file: 'scripts/data/storage-facilities.json' }),
  L('fuelShortages', 'Fuel shortages', 'infrastructure', 'choropleth', 'static', { file: 'scripts/data/fuel-shortages.json' }),
  L('liveTankers', 'Live tankers', 'infrastructure', 'points', 'unavailable', { reason: 'Needs the live AIS relay and stream key (see AIS ship traffic).' }),
];

export const LAYER_KEYS = LAYER_SPECS.map((l) => l.key);
export const LAYER_BY_KEY = Object.fromEntries(LAYER_SPECS.map((l) => [l.key, l]));

/** Named bundles for the tool / CLI. */
export const PRESETS = {
  overview: ['conflicts', 'hotspots', 'bases', 'nuclear', 'cables', 'waterways', 'natural', 'fires', 'dayNight'],
  security: ['conflicts', 'bases', 'hotspots', 'nuclear', 'protests', 'ucdpEvents', 'military', 'iranAttacks', 'gpsJamming'],
  infrastructure: ['cables', 'pipelines', 'waterways', 'spaceports', 'datacenters', 'outages', 'storageFacilities', 'tradeRoutes'],
  hazards: ['natural', 'fires', 'weather', 'climate', 'radiationWatch', 'diseaseOutbreaks', 'dayNight'],
  economy: ['stockExchanges', 'financialCenters', 'centralBanks', 'commodityHubs', 'miningSites', 'processingPlants', 'commodityPorts', 'tradeRoutes', 'gulfInvestments'],
  tech: ['datacenters', 'cloudRegions', 'techHQs', 'startupHubs', 'accelerators', 'cables', 'techEvents'],
  'all-static': LAYER_SPECS.filter((l) => l.source === 'static').map((l) => l.key),
  all: LAYER_SPECS.filter((l) => l.source !== 'unavailable').map((l) => l.key),
};

export function layerSummary() {
  const by = { static: 0, live: 0, computed: 0, unavailable: 0 };
  for (const l of LAYER_SPECS) by[l.source]++;
  return { total: LAYER_SPECS.length, ...by };
}
