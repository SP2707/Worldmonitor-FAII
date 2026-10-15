#!/usr/bin/env node
// Subnational seeder 4/10 - Critical Infrastructure Density.
// Solid layers (no Overpass needed): OurAirports airfield register and the WRI power-plant
// database, both assigned to divisions by vendored boundary polygons; USGS earthquakes and NASA
// fire detections already seeded by the live feeds. OSM Overpass adds ports, rail, hospitals,
// substations, dams and data centres when a mirror is up (best effort, last priority).
// Densities use Wikidata land area as the denominator (area itself never counts as coverage).
import { createWikidataProvider } from './subnational/providers/wikidata.mjs';
import { createOverpassProvider } from './subnational/providers/overpass.mjs';
import { createOurAirportsProvider } from './subnational/providers/ourairports.mjs';
import { createGppdProvider } from './subnational/providers/gppd.mjs';
import { createLiveEventsProvider } from './subnational/providers/live-events.mjs';
import { makeDensityDerive } from './subnational/_core.mjs';
import { runCategorySeeder, isMainScript } from './subnational/_run.mjs';

export const SLUG = 'infrastructure';
export const COUNTS = [
  { metric: 'seaports', label: 'port areas', filters: ['["landuse"="port"]', '["industrial"="port"]'] },
  { metric: 'rail_stations', label: 'railway stations', filters: ['["railway"="station"]'] },
  { metric: 'hospitals', label: 'hospitals', filters: ['["amenity"="hospital"]'] },
  { metric: 'power_substations', label: 'power substations', filters: ['["power"="substation"]'] },
  { metric: 'dams', label: 'dams', filters: ['["waterway"="dam"]'] },
  { metric: 'data_centers', label: 'data centers', filters: ['["telecom"="data_center"]', '["building"="data_center"]'] },
];
// Used only as a denominator; a division with just this is NOT counted as covered.
export const auxMetrics = ['area_km2'];
export const providers = [
  createWikidataProvider([{ metric: 'area_km2', prop: 'P2046', withUnit: true }]),
  createOurAirportsProvider({ only: ['airports_large', 'airports_medium', 'airports_small', 'heliports', 'seaplane_bases', 'airports_scheduled_service', 'airports_with_iata'] }),
  createGppdProvider({ only: ['plants_count', 'installed_mw_total'] }),
  createLiveEventsProvider('quakes'),
  createLiveEventsProvider('fires'),
  createOverpassProvider({ id: 'osm:infrastructure', counts: COUNTS, markerMetric: 'rail_stations', batchSize: 40 }),
];
export const DENSITY_METRICS = ['airports_large', 'airports_medium', 'airports_small', 'airports_scheduled_service', 'plants_count', ...COUNTS.map((c) => c.metric)];
export const derive = makeDensityDerive(DENSITY_METRICS);

if (isMainScript('seed-subnational-infrastructure.mjs')) {
  runCategorySeeder({ slug: SLUG, scriptUrl: import.meta.url, providers, derive, auxMetrics, budgetMs: 1_500_000, sourceVersion: 'subnational-infrastructure-v2' });
}
