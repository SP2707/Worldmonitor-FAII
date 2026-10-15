export interface MapLayerSpec { key: string; label: string; group: string; render: string; source: 'static' | 'live' | 'computed' | 'unavailable'; reason?: string; keys?: string[] }
export const LAYER_KEYS: string[];
export const LAYER_SPECS: MapLayerSpec[];
export const PRESETS: Record<string, string[]>;
export const OUTPUT_MODES: string[];
export const SCENE_WIDTH: number;
export const DEFAULT_MAX_FEATURES: number;
export function layerSummary(): { total: number; static: number; live: number; computed: number; unavailable: number };
export function buildGeo(opts?: { width?: number; bbox?: number[]; detail?: string }): { width: number; height: number; graticule: string; countries: Array<[string, string, string]> };
export function parseBbox(value: unknown): { bbox?: number[]; error?: string };
export function resolveLayerKeys(opts?: { layers?: unknown; preset?: string }): { keys?: string[]; error?: string };
export interface BuildMapOptions {
  layers?: unknown; preset?: string; bbox?: unknown; theme?: string; output?: string; width?: number; maxFeatures?: number;
  title?: string; now?: Date; readKey?: (key: string) => Promise<unknown>;
}
export function buildMapResult(opts?: BuildMapOptions): Promise<Record<string, unknown> & { error?: string }>;
