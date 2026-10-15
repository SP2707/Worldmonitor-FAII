// MCP Apps (extension `io.modelcontextprotocol/ui`) — the interactive shell for the `render_map` tool: an inline
// world map with per-layer toggles and hover details, drawn inside the conversation.
//
// Tool result shape (output=scene, see api/mcp/registry/map-tools.ts and scripts/map/index.mjs):
//   { view:"map", width, height, theme, summary:{requested,drawn,skipped,features},
//     layers:[{key,label,status,count,...}], skipped:[{key,label,reason}],
//     scene:[{ key,label,color,kind,count,truncated?,
//              pts?:[[x,y,r,name,info]], paths?:[[d,name,info]], values?:{ISO2:number}, valueLabel?,
//              night?:{d,sun:[x,y]} }],
//     geo?:{width,height,graticule,countries} }   // geo only when a bbox was requested
// The shell embeds the world geometry itself (data-free of any tool state), so the result only carries layer data.
//
// Rendering uses createElementNS/setAttribute/textContent only — never innerHTML — so a hostile payload cannot
// inject markup. renderBody stays backtick/`${`/regex-free.

import { buildGeo } from '../../../scripts/map/index.mjs';
import { buildAppHtml } from './shell';

// If the geometry cannot be read (a bundled build started outside the repo root) the shell still plots layer data,
// just without land, rather than taking the whole MCP module down at import time.
function embeddedGeo(): string {
  try {
    return JSON.stringify(buildGeo());
  } catch {
    return JSON.stringify({ width: 1000, height: 495, graticule: '', countries: [] });
  }
}
const GEO_JSON = embeddedGeo();
// The geometry is interpolated into an inline <script>; guard the two sequences that could break out of it or
// out of the surrounding template literal.
if (GEO_JSON.includes('</') || GEO_JSON.includes('`') || GEO_JSON.includes('${')) {
  throw new Error('map-app: embedded geometry contains a sequence that is unsafe inside an inline script');
}

const STYLES = `
  .wrap { max-width: none; padding: 8px; }
  .stage { position: relative; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: var(--card); margin-top: 8px; }
  .stage svg { display: block; width: 100%; height: auto; }
  .toggles { display: flex; flex-wrap: wrap; gap: 4px 12px; margin-top: 8px; font-size: 12px; }
  .toggles label { display: inline-flex; align-items: center; gap: 5px; cursor: pointer; white-space: nowrap; }
  .sw { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }
  .cnt { color: var(--muted); }
  .skips { margin-top: 8px; font-size: 12px; color: var(--muted); }
  .skips summary { cursor: pointer; }
  .skips li { margin: 2px 0; }
  #tip { position: fixed; display: none; pointer-events: none; max-width: 260px; padding: 4px 8px; border-radius: 6px;
    font-size: 12px; background: #020617; color: #e2e8f0; border: 1px solid #334155; z-index: 5; }
`;

const BODY = `
  <div class="head">
    <div class="title">World map</div>
    <div class="badge" id="badge">WorldMonitor</div>
  </div>
  <div class="empty" id="empty">Waiting for map data…</div>
  <div id="card" style="display:none">
    <div class="stage" id="stage"></div>
    <div class="toggles" id="toggles"></div>
    <details class="skips" id="skips" style="display:none"><summary id="skips-sum"></summary><ul id="skips-list"></ul></details>
    <div class="foot" id="foot"></div>
  </div>
  <div id="tip"></div>
`;

const RENDER = `
    if (!data || typeof data !== "object" || data.view !== "map" || !Array.isArray(data.scene)) return;
    var NS = "http://www.w3.org/2000/svg";
    var geo = data.geo && typeof data.geo === "object" && Array.isArray(data.geo.countries) ? data.geo : GEO;
    var W = num(geo.width) || 1000;
    var H = num(geo.height) || 495;
    var light = data.theme === "light";
    var pal = light
      ? { bg: "#eef2f7", land: "#d5dce8", stroke: "#aab6c9", grid: "#e1e7f0", night: "#0f172a", nightOp: "0.25", ring: "#eef2f7" }
      : { bg: "#0b1220", land: "#1b2640", stroke: "#2c3b5e", grid: "#15203a", night: "#000000", nightOp: "0.42", ring: "#0b1220" };

    function sv(tag, attrs, parent) {
      var e = document.createElementNS(NS, tag);
      for (var k in attrs) { if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, String(attrs[k])); }
      if (parent) parent.appendChild(e);
      return e;
    }
    function color(c) { return typeof c === "string" && c.length === 7 && c.charAt(0) === "#" ? c : "#94a3b8"; }
    function tipOf(name, info) { return info ? name + " — " + info : name; }

    var stage = q("stage");
    stage.textContent = "";
    var svg = sv("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "World map with " + data.scene.length + " layers" });
    sv("rect", { width: W, height: H, fill: pal.bg }, svg);
    sv("path", { d: String(geo.graticule || ""), fill: "none", stroke: pal.grid, "stroke-width": "0.6" }, svg);
    var land = sv("g", { fill: pal.land, stroke: pal.stroke, "stroke-width": "0.5", "stroke-linejoin": "round" }, svg);
    var byIso = {};
    for (var ci = 0; ci < geo.countries.length; ci++) {
      var c = geo.countries[ci];
      if (!Array.isArray(c) || typeof c[2] !== "string") continue;
      sv("path", { d: c[2] }, land);
      if (c[0]) byIso[c[0]] = c;
    }

    var order = { terminator: 0, choropleth: 1, polygons: 2, lines: 3, points: 4 };
    var layers = data.scene.slice().sort(function (a, b) { return (order[a.kind] == null ? 9 : order[a.kind]) - (order[b.kind] == null ? 9 : order[b.kind]); });
    var groups = {};
    for (var li = 0; li < layers.length; li++) {
      var L = layers[li];
      if (!L || typeof L !== "object") continue;
      var col = color(L.color);
      var g = sv("g", { "data-layer": String(L.key) }, svg);
      groups[L.key] = g;
      if (L.kind === "terminator" && L.night) {
        sv("path", { d: String(L.night.d || ""), fill: pal.night, "fill-opacity": pal.nightOp }, g);
        if (Array.isArray(L.night.sun)) {
          var sun = sv("circle", { cx: num(L.night.sun[0]) || 0, cy: num(L.night.sun[1]) || 0, r: 5, fill: "#fde047", stroke: "#f59e0b", "stroke-width": "1.5" }, g);
          sun.setAttribute("data-t", "Subsolar point");
        }
      } else if (L.kind === "choropleth" && L.values && typeof L.values === "object") {
        var vals = [];
        for (var iso in L.values) { if (Object.prototype.hasOwnProperty.call(L.values, iso) && num(L.values[iso]) != null) vals.push(num(L.values[iso])); }
        var lo = Math.min.apply(null, vals);
        var hi = Math.max.apply(null, vals);
        for (var iso2 in L.values) {
          if (!Object.prototype.hasOwnProperty.call(L.values, iso2) || !byIso[iso2]) continue;
          var v = num(L.values[iso2]);
          if (v == null) continue;
          var t = hi === lo ? 0.7 : 0.18 + (0.72 * (v - lo)) / (hi - lo);
          var cp = sv("path", { d: byIso[iso2][2], fill: col, "fill-opacity": t.toFixed(2) }, g);
          cp.setAttribute("data-t", byIso[iso2][1] + ": " + (L.valueLabel ? L.valueLabel + " " : "") + v);
        }
      } else if (L.kind === "polygons" && Array.isArray(L.paths)) {
        for (var pi = 0; pi < L.paths.length; pi++) {
          var P = L.paths[pi];
          if (!Array.isArray(P)) continue;
          var pp = sv("path", { d: String(P[0]), fill: col, "fill-opacity": "0.22", stroke: col, "stroke-width": "1.2" }, g);
          pp.setAttribute("data-t", tipOf(String(P[1] || ""), String(P[2] || "")));
        }
      } else if (L.kind === "lines" && Array.isArray(L.paths)) {
        for (var ki = 0; ki < L.paths.length; ki++) {
          var K = L.paths[ki];
          if (!Array.isArray(K)) continue;
          var kp = sv("path", { d: String(K[0]), fill: "none", stroke: col, "stroke-width": "1.1", "stroke-opacity": "0.85", "stroke-linejoin": "round" }, g);
          kp.setAttribute("data-t", tipOf(String(K[1] || ""), String(K[2] || "")));
        }
      } else if (L.kind === "points" && Array.isArray(L.pts)) {
        for (var qi = 0; qi < L.pts.length; qi++) {
          var Q = L.pts[qi];
          if (!Array.isArray(Q)) continue;
          var cc = sv("circle", { cx: num(Q[0]) || 0, cy: num(Q[1]) || 0, r: num(Q[2]) || 2.5, fill: col, "fill-opacity": "0.82", stroke: pal.ring, "stroke-width": "0.5" }, g);
          cc.setAttribute("data-t", tipOf(String(Q[3] || ""), String(Q[4] || "")));
        }
      }
    }
    stage.appendChild(svg);

    var tip = q("tip");
    svg.addEventListener("mousemove", function (ev) {
      var t = ev.target && ev.target.getAttribute ? ev.target.getAttribute("data-t") : null;
      if (!t) { tip.style.display = "none"; return; }
      tip.textContent = t;
      tip.style.display = "block";
      tip.style.left = Math.min(ev.clientX + 12, window.innerWidth - 280) + "px";
      tip.style.top = (ev.clientY + 14) + "px";
    });
    svg.addEventListener("mouseleave", function () { tip.style.display = "none"; });

    var toggles = q("toggles");
    toggles.textContent = "";
    for (var ti = 0; ti < data.scene.length; ti++) {
      (function (L2) {
        if (!L2 || !groups[L2.key]) return;
        var lab = el("label");
        var box = el("input");
        box.type = "checkbox";
        box.checked = true;
        box.addEventListener("change", function () { groups[L2.key].style.display = box.checked ? "" : "none"; });
        var sw = el("span", "sw");
        sw.style.background = color(L2.color);
        lab.appendChild(box);
        lab.appendChild(sw);
        lab.appendChild(document.createTextNode(String(L2.label || L2.key) + " "));
        lab.appendChild(el("span", "cnt", String(L2.count == null ? "" : L2.count) + (L2.truncated ? "+" : "")));
        toggles.appendChild(lab);
      })(data.scene[ti]);
    }

    var skipped = Array.isArray(data.skipped) ? data.skipped : [];
    var skips = q("skips");
    var list = q("skips-list");
    list.textContent = "";
    if (skipped.length) {
      skips.style.display = "block";
      q("skips-sum").textContent = skipped.length + " requested layer" + (skipped.length === 1 ? "" : "s") + " not drawn";
      for (var si = 0; si < skipped.length; si++) {
        var S = skipped[si];
        if (!S || typeof S !== "object") continue;
        var li2 = el("li");
        li2.appendChild(el("b", null, String(S.label || S.key)));
        li2.appendChild(document.createTextNode(" — " + String(S.reason || S.status || "")));
        list.appendChild(li2);
      }
    } else {
      skips.style.display = "none";
    }

    var sum = data.summary && typeof data.summary === "object" ? data.summary : {};
    setText("badge", (sum.drawn == null ? data.scene.length : sum.drawn) + " layers · " + (sum.features == null ? "" : sum.features + " features"));
    setText("foot", "Generated " + String(data.generatedAt || "") + ". Static layers are curated bundles, not live feeds; live layers appear only when their seeder has populated the cache.");
    q("empty").style.display = "none";
    q("card").style.display = "block";
`;

export const MAP_APP_HTML = buildAppHtml({
  title: 'World map',
  appName: 'worldmonitor-map',
  styles: STYLES,
  body: BODY,
  renderBody: 'var GEO = ' + GEO_JSON + ';\n' + RENDER,
});
