// Offline map renderer: layer data -> self-contained SVG (and a self-contained HTML page around it).
//
// Guarantees (asserted in tests/map-render.test.mjs):
//   - no network access, no <image>, no external href/url(): the output never loads anything
//   - SVG uses concrete colours (no CSS variables) so it also rasterises to PNG
//   - all text from data is XML-escaped; the HTML page carries a CSP that forbids everything but inline style/script
//   - the inline script only toggles layers and shows tooltips; it never evaluates strings

import { loadCountries } from './data.mjs';
import { LAYER_BY_KEY, GROUPS } from './layers.mjs';
import { geometryPath, linePath, makeProjection, nightRing, ringPath, subsolarPoint } from './geo.mjs';

export const THEMES = {
  dark: { bg: '#0b1220', land: '#1b2640', stroke: '#2c3b5e', grid: '#15203a', text: '#cbd5e1', muted: '#7d8ba6', night: '#000000', nightOpacity: 0.42 },
  light: { bg: '#eef2f7', land: '#d5dce8', stroke: '#aab6c9', grid: '#e1e7f0', text: '#2d3a50', muted: '#66758f', night: '#0f172a', nightOpacity: 0.25 },
};
export const LAYER_COLORS = ['#ef4444', '#f59e0b', '#22d3ee', '#a78bfa', '#34d399', '#f472b6', '#60a5fa', '#facc15', '#fb923c', '#2dd4bf', '#c084fc', '#4ade80', '#f87171', '#38bdf8', '#e879f9', '#a3e635'];

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const f1 = (n) => (Math.round(n * 10) / 10).toString();

const countryCache = new Map();
function countryPaths(projection, projKey, detail) {
  const cacheKey = `${projKey}|${detail}`;
  if (countryCache.has(cacheKey)) return countryCache.get(cacheKey);
  const opts = detail === 'low' ? { minStepPx: 1.6, minAreaPx: 6 } : detail === 'high' ? { minStepPx: 0.35, minAreaPx: 0.4 } : { minStepPx: 0.8, minAreaPx: 1.5 };
  const paths = loadCountries().map((c) => ({ iso2: c.iso2, name: c.name, d: geometryPath(c.geometry, projection.project, opts) })).filter((c) => c.d);
  countryCache.set(cacheKey, paths);
  return paths;
}

function graticule(projection) {
  let d = '';
  for (let lon = -150; lon <= 180; lon += 30) d += linePath(Array.from({ length: 37 }, (_, i) => [lon, -90 + i * 5]), projection.project);
  for (let lat = -60; lat <= 60; lat += 30) d += linePath(Array.from({ length: 73 }, (_, i) => [-180 + i * 5, lat]), projection.project);
  return d;
}

function pointRadius(f, base) {
  if (typeof f.size !== 'number' || !Number.isFinite(f.size)) return base;
  return clamp(base + Math.log10(1 + Math.max(0, f.size)) * 1.4, base, base + 5);
}

function drawPoints(layer, color, projection, bbox, tt = true) {
  const base = layer.key === 'hotspots' || layer.key === 'conflicts' ? 3.4 : layer.features.length > 600 ? 1.9 : 2.5;
  let out = '';
  for (const f of layer.features) {
    const [x, y] = projection.project(f.lon, f.lat);
    if (bbox && (f.lon < bbox[0] || f.lon > bbox[2] || f.lat < bbox[1] || f.lat > bbox[3])) continue;
    if (!tt) { out += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(pointRadius(f, base))}"/>`; continue; }
    const t = [f.name, f.cat, f.info].filter(Boolean).join(' · ');
    out += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(pointRadius(f, base))}" data-n="${esc(f.name)}" data-i="${esc([f.cat, f.info].filter(Boolean).join(' · '))}"><title>${esc(t)}</title></circle>`;
  }
  return out;
}

function drawLines(layer, projection, tt = true) {
  let out = '';
  for (const f of layer.features) {
    const d = linePath(f.path, projection.project);
    if (!d) continue;
    if (!tt) { out += `<path d="${d}"/>`; continue; }
    out += `<path d="${d}" data-n="${esc(f.name)}" data-i="${esc([f.cat, f.info].filter(Boolean).join(' · '))}"><title>${esc([f.name, f.cat, f.info].filter(Boolean).join(' · '))}</title></path>`;
  }
  return out;
}

function drawPolygons(layer, projection) {
  let out = '';
  for (const f of layer.features) {
    const d = ringPath(f.ring, projection.project, { minStepPx: 0.5, minAreaPx: 1 });
    if (!d) continue;
    out += `<path d="${d}" data-n="${esc(f.name)}" data-i="${esc([f.cat, f.info].filter(Boolean).join(' · '))}"><title>${esc([f.name, f.cat, f.info].filter(Boolean).join(' · '))}</title></path>`;
  }
  return out;
}

function drawChoropleth(layer, color, paths) {
  const vals = [...layer.values.values()].filter(Number.isFinite);
  if (!vals.length) return '';
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  let out = '';
  for (const c of paths) {
    const v = c.iso2 ? layer.values.get(c.iso2) : undefined;
    if (v === undefined) continue;
    const t = hi === lo ? 0.7 : 0.18 + (0.72 * (v - lo)) / (hi - lo);
    out += `<path d="${c.d}" fill="${color}" fill-opacity="${t.toFixed(2)}" data-n="${esc(c.name)}" data-i="${esc(`${layer.valueLabel ?? 'value'}: ${v}`)}"><title>${esc(`${c.name}: ${v}`)}</title></path>`;
  }
  return out;
}

function assignColors(layers) {
  const colorOf = new Map();
  let i = 0;
  for (const l of layers) { if (l.status === 'ok') colorOf.set(l.key, LAYER_COLORS[i++ % LAYER_COLORS.length]); }
  return colorOf;
}

/**
 * Render selected layers. `layers` = loadLayer() results (any status). Returns { svg, width, height, report }.
 */
export function renderMapSvg(layers, { width = 1100, theme = 'dark', bbox, title = 'WorldMonitor map', now = new Date(), detail = 'standard', legend = true, tooltips = true } = {}) {
  const T = THEMES[theme] ?? THEMES.dark;
  const projection = makeProjection({ width, bbox });
  const height = projection.height;
  const paths = countryPaths(projection, `${width}|${bbox ? bbox.join(',') : 'world'}`, detail);
  const report = [];
  const groups = [];
  const drawable = layers.filter((l) => l.status === 'ok' && l.count > 0);
  const order = { terminator: 0, choropleth: 1, polygons: 2, lines: 3, points: 4 };
  const sorted = [...drawable].sort((a, b) => (order[a.kind] ?? 9) - (order[b.kind] ?? 9));
  const colorOf = assignColors(layers);

  for (const l of sorted) {
    const color = colorOf.get(l.key);
    let body = '';
    let attrs;
    if (l.kind === 'terminator') {
      const ringPathD = ringPath(nightRing(l.now ?? now), projection.project, { minStepPx: 0.5, minAreaPx: 1 });
      const sun = subsolarPoint(l.now ?? now);
      const [sx, sy] = projection.project(sun.lon, sun.lat);
      body = `<path d="${ringPathD}" fill="${T.night}" fill-opacity="${T.nightOpacity}" stroke="none"/><circle cx="${f1(sx)}" cy="${f1(sy)}" r="5" fill="#fde047" stroke="#f59e0b" stroke-width="1.5"><title>Subsolar point</title></circle>`;
      attrs = '';
    } else if (l.kind === 'choropleth') { body = drawChoropleth(l, color, paths); attrs = ''; }
    else if (l.kind === 'polygons') { body = drawPolygons(l, projection); attrs = `fill="${color}" fill-opacity="0.22" stroke="${color}" stroke-width="1.2"`; }
    else if (l.kind === 'lines') { body = drawLines(l, projection, tooltips); attrs = `fill="none" stroke="${color}" stroke-width="1.1" stroke-opacity="0.85" stroke-linejoin="round"`; }
    else { body = drawPoints(l, color, projection, bbox, tooltips); attrs = `fill="${color}" fill-opacity="0.82" stroke="${T.bg}" stroke-width="0.5"`; }
    groups.push(`<g id="wmm-layer-${l.key}" class="wmm-layer" data-layer="${l.key}" ${attrs}>${body}</g>`);
  }

  for (const l of layers) {
    const spec = LAYER_BY_KEY[l.key];
    report.push({
      key: l.key, label: spec?.label ?? l.key, group: spec?.group, status: l.status, count: l.count ?? 0,
      drawn: l.status === 'ok' ? (l.kind === 'choropleth' ? l.values?.size ?? 0 : l.kind === 'terminator' ? 1 : Math.min(l.features?.length ?? 0, l.count ?? 0)) : 0,
      truncated: l.truncated || undefined, source: l.source, reason: l.reason, color: colorOf.get(l.key), liveAdded: l.liveAdded,
    });
  }

  const baseLand = paths.map((c) => c.d).join('');
  const legendEntries = report.filter((r) => r.status === 'ok');
  let legendSvg = '';
  if (legend && legendEntries.length) {
    const rowH = 15;
    const boxH = legendEntries.length * rowH + 10;
    legendSvg = `<g class="wmm-legend" transform="translate(10 ${f1(height - boxH - 10)})"><rect width="190" height="${boxH}" rx="5" fill="${T.bg}" fill-opacity="0.78" stroke="${T.stroke}"/>`
      + legendEntries.map((r, i) => `<circle cx="14" cy="${10 + i * rowH + 3}" r="4" fill="${r.color}"/><text x="24" y="${10 + i * rowH + 7}" font-size="10.5" fill="${T.text}">${esc(r.label)} (${r.count}${r.truncated ? '+' : ''})</text>`).join('')
      + '</g>';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="wmm-map" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${esc(title)}" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif">`
    + `<title>${esc(title)}</title><rect width="${width}" height="${height}" fill="${T.bg}"/>`
    + `<path d="${graticule(projection)}" fill="none" stroke="${T.grid}" stroke-width="0.6"/>`
    + `<path d="${baseLand}" fill="${T.land}" stroke="${T.stroke}" stroke-width="0.5" stroke-linejoin="round"/>`
    + groups.join('')
    + legendSvg
    + `<text x="${width - 8}" y="${height - 8}" font-size="9" text-anchor="end" fill="${T.muted}">${esc(title)} · ${esc(now.toISOString().slice(0, 16).replace('T', ' '))} UTC</text>`
    + '</svg>';

  return { svg, width, height, report };
}

const HTML_STYLE = `
:root{color-scheme:dark light}
*{box-sizing:border-box}
body{margin:0;font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--fg)}
body.dark{--bg:#0b1220;--fg:#cbd5e1;--panel:#111a2e;--line:#22304f;--muted:#7d8ba6}
body.light{--bg:#eef2f7;--fg:#2d3a50;--panel:#fff;--line:#cfd8e6;--muted:#66758f}
.wmm-wrap{display:flex;flex-direction:column;gap:8px;padding:8px}
.wmm-stage{position:relative;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--panel)}
.wmm-stage svg{display:block;width:100%;height:auto}
.wmm-layers{display:flex;flex-wrap:wrap;gap:4px 12px;padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:var(--panel)}
.wmm-layers label{display:inline-flex;align-items:center;gap:5px;cursor:pointer;white-space:nowrap}
.wmm-sw{width:9px;height:9px;border-radius:50%;display:inline-block}
.wmm-count{color:var(--muted)}
.wmm-notes{color:var(--muted);font-size:12px}
.wmm-notes summary{cursor:pointer}
.wmm-notes li{margin:2px 0}
#wmm-tip{position:fixed;pointer-events:none;display:none;max-width:280px;padding:5px 8px;border-radius:6px;background:#020617;color:#e2e8f0;font-size:12px;border:1px solid #334155;z-index:5}
`;

const HTML_SCRIPT = `
(function(){
  var tip=document.getElementById('wmm-tip');
  var stage=document.querySelector('.wmm-stage');
  var boxes=document.querySelectorAll('.wmm-layers input[type=checkbox]');
  for(var i=0;i<boxes.length;i++){boxes[i].addEventListener('change',function(e){
    var g=document.getElementById('wmm-layer-'+e.target.getAttribute('data-layer'));
    if(g){g.style.display=e.target.checked?'':'none';}
  });}
  stage.addEventListener('mousemove',function(e){
    var t=e.target;
    var n=t&&t.getAttribute&&t.getAttribute('data-n');
    if(!n){tip.style.display='none';return;}
    var d=t.getAttribute('data-i');
    tip.textContent=d?n+' — '+d:n;
    tip.style.display='block';
    tip.style.left=Math.min(e.clientX+12,window.innerWidth-300)+'px';
    tip.style.top=(e.clientY+14)+'px';
  });
  stage.addEventListener('mouseleave',function(){tip.style.display='none';});
})();
`;

/** A complete HTML document (safe for iframe srcdoc / sandbox) around the SVG, with layer toggles and tooltips. */
export function renderMapHtml({ svg, report }, { title = 'WorldMonitor map', theme = 'dark' } = {}) {
  const ok = report.filter((r) => r.status === 'ok');
  const notOk = report.filter((r) => r.status !== 'ok');
  const toggles = ok.map((r) => `<label><input type="checkbox" checked data-layer="${esc(r.key)}"><span class="wmm-sw" style="background:${esc(r.color)}"></span>${esc(r.label)} <span class="wmm-count">${r.count}${r.truncated ? '+' : ''}</span></label>`).join('');
  const notes = notOk.length
    ? `<details class="wmm-notes"><summary>${notOk.length} requested layer${notOk.length === 1 ? '' : 's'} not drawn</summary><ul>${notOk.map((r) => `<li><b>${esc(r.label)}</b> — ${esc(r.reason ?? r.status)}</li>`).join('')}</ul></details>`
    : '';
  const csp = "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`
    + `<meta http-equiv="Content-Security-Policy" content="${csp}"><title>${esc(title)}</title><style>${HTML_STYLE}</style></head>`
    + `<body class="${theme === 'light' ? 'light' : 'dark'}"><div class="wmm-wrap"><div class="wmm-stage">${svg}</div>`
    + `<div class="wmm-layers">${toggles}</div>${notes}</div><div id="wmm-tip"></div><script>${HTML_SCRIPT}</script></body></html>`;
}

/** Convenience: SVG + HTML in one call. */
export function renderMap(layers, opts = {}) {
  const r = renderMapSvg(layers, opts);
  const html = renderMapHtml(r, { title: opts.title, theme: opts.theme });
  return { ...r, html };
}

export { GROUPS };

// ---- compact scene for in-chat viewers ---------------------------------------------------------------------
// The scene is the same drawing as the SVG but as data: projected coordinates the in-chat shell draws with DOM
// calls (never innerHTML). It deliberately carries no land geometry - the shell embeds that once - so a tool result
// stays small enough to sit in a model's context.

export const SCENE_WIDTH = 1000;
const r1 = (n) => Math.round(n * 10) / 10;
const cut = (s, n) => { const t = String(s ?? ''); return t.length > n ? `${t.slice(0, n - 1)}…` : t; };

/** Base geometry for a scene: graticule plus one path per country ([iso2, name, d]). */
export function buildGeo({ width = SCENE_WIDTH, bbox, detail = 'low' } = {}) {
  const projection = makeProjection({ width, bbox });
  const paths = countryPaths(projection, `${width}|${bbox ? bbox.join(',') : 'world'}`, detail);
  return { width, height: projection.height, graticule: graticule(projection), countries: paths.map((c) => [c.iso2 ?? '', c.name, c.d]) };
}

export function buildScene(layers, { bbox, now = new Date(), width = SCENE_WIDTH } = {}) {
  const projection = makeProjection({ width, bbox });
  const colorOf = assignColors(layers);
  const out = [];
  for (const l of layers) {
    if (l.status !== 'ok' || !(l.count > 0)) continue;
    const spec = LAYER_BY_KEY[l.key];
    const item = { key: l.key, label: spec?.label ?? l.key, group: spec?.group, color: colorOf.get(l.key), kind: l.kind, count: l.count, truncated: l.truncated || undefined, source: l.source };
    if (l.kind === 'terminator') {
      const when = l.now ?? now;
      const sun = subsolarPoint(when);
      const [sx, sy] = projection.project(sun.lon, sun.lat);
      item.night = { d: ringPath(nightRing(when), projection.project, { minStepPx: 0.8, minAreaPx: 1 }), sun: [r1(sx), r1(sy)] };
    } else if (l.kind === 'choropleth') {
      item.values = Object.fromEntries([...l.values.entries()].filter(([, v]) => Number.isFinite(v)).map(([k, v]) => [k, r1(v * 100) / 100]));
      item.valueLabel = l.valueLabel;
    } else if (l.kind === 'points') {
      const base = l.key === 'hotspots' || l.key === 'conflicts' ? 3.4 : l.features.length > 600 ? 1.9 : 2.5;
      item.pts = [];
      for (const f of l.features) {
        if (bbox && (f.lon < bbox[0] || f.lon > bbox[2] || f.lat < bbox[1] || f.lat > bbox[3])) continue;
        const [x, y] = projection.project(f.lon, f.lat);
        item.pts.push([r1(x), r1(y), r1(pointRadius(f, base)), cut(f.name, 80), cut([f.cat, f.info].filter(Boolean).join(' · '), 120)]);
      }
    } else {
      item.paths = [];
      for (const f of l.features) {
        const d = l.kind === 'lines' ? linePath(f.path, projection.project, 1.2) : ringPath(f.ring, projection.project, { minStepPx: 0.8, minAreaPx: 1 });
        if (d) item.paths.push([d, cut(f.name, 80), cut([f.cat, f.info].filter(Boolean).join(' · '), 120)]);
      }
    }
    out.push(item);
  }
  return { width: projection.width, height: projection.height, layers: out };
}
