// Generic adapters for the open-provider registry (scripts/providers/registry*.mjs).
//
// One entry in the registry = one keyless public endpoint. fetchProvider() fetches it, parses it with the
// adapter named by the entry and returns a small summary - or a precise failure reason. An entry only
// counts as "connected" when the HTTP call succeeded AND the adapter extracted something meaningful, so
// a 200 that carries an HTML error page or an empty body is reported as a failure, never as a success.
//
// Pure module: no Redis, no env, no project imports. The caller injects fetch and the User-Agent, which
// keeps it testable with fixtures and keeps the single honest User-Agent policy in one place (the seeder).

export const MAX_BODY_BYTES = 4 * 1024 * 1024;
export const DEFAULT_TIMEOUT_MS = 20_000;
export const MAX_SUMMARY_CHARS = 3_000;

const pad = (n, w = 2) => String(n).padStart(w, '0');

/**
 * Expand date tokens in a URL: {YMD} 2026-10-12, {YMD-3} three days earlier, {YYYYMMDD}, {Y}, {M}, {D}.
 * Only UTC dates are used so the result does not depend on the machine's time zone.
 */
export function expandUrlTemplate(template, now = new Date()) {
  return String(template).replace(/\{(YMD|YYYYMMDD|Y|M|D)(?:-(\d+))?\}/g, (_m, token, back) => {
    const d = new Date(now.getTime() - Number(back ?? 0) * 86_400_000);
    const y = d.getUTCFullYear();
    const m = pad(d.getUTCMonth() + 1);
    const day = pad(d.getUTCDate());
    switch (token) {
      case 'YMD': return `${y}-${m}-${day}`;
      case 'YYYYMMDD': return `${y}${m}${day}`;
      case 'Y': return String(y);
      case 'M': return m;
      default: return day;
    }
  });
}

/** Read a dotted path ("a.b.0.c"); `*` on an array maps the rest of the path over its items. */
export function getPath(value, path) {
  if (path === '' || path == null) return value;
  const parts = Array.isArray(path) ? path : String(path).split('.');
  let cur = value;
  for (let i = 0; i < parts.length; i++) {
    if (cur == null) return undefined;
    const key = parts[i];
    if (key === '*') {
      if (!Array.isArray(cur)) return undefined;
      const rest = parts.slice(i + 1);
      return cur.map((item) => getPath(item, rest));
    }
    cur = cur[key];
  }
  return cur;
}

const isScalar = (v) => v == null || ['string', 'number', 'boolean'].includes(typeof v);
const clip = (s, n = 160) => (typeof s === 'string' && s.length > n ? `${s.slice(0, n)}…` : s);

/** Structure-only summary used when an entry has no explicit `pick` paths. */
export function summarizeJson(value) {
  if (Array.isArray(value)) {
    const first = value.find((v) => v && typeof v === 'object' && !Array.isArray(v));
    return { type: 'array', length: value.length, sampleKeys: first ? Object.keys(first).slice(0, 15) : undefined, sample: isScalar(value[0]) ? clip(value[0]) : undefined };
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    const arrays = {};
    const scalars = {};
    for (const k of keys) {
      const v = value[k];
      if (Array.isArray(v)) { if (Object.keys(arrays).length < 10) arrays[k] = v.length; }
      else if (isScalar(v)) { if (Object.keys(scalars).length < 10) scalars[k] = typeof v === 'string' ? clip(v) : v; }
    }
    return { type: 'object', keys: keys.slice(0, 20), arrays, scalars };
  }
  return { type: typeof value, value: clip(value) };
}

/** Is there anything worth calling "data" in this summary? */
export function isMeaningful(data) {
  if (data == null) return false;
  if (typeof data !== 'object') return true;
  if (Array.isArray(data)) return data.length > 0;
  const vals = Object.values(data).filter((v) => !(v == null || v === '' || (Array.isArray(v) && v.length === 0)));
  if (vals.length === 0) return false;
  // Structure-only summaries of an empty container are not data.
  if (data.type === 'array' && data.length === 0) return false;
  if (data.type === 'object' && (!data.keys || data.keys.length === 0)) return false;
  return true;
}

/** Minimal CSV parser (RFC 4180 quoting). Returns array of rows (arrays of strings). */
export function parseCsv(text, { maxRows = 5000, delimiter = ',' } = {}) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  const s = text.replace(/^﻿/, '');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quoted) {
      if (c === '"') { if (s[i + 1] === '"') { field += '"'; i++; } else quoted = false; }
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === delimiter) { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && s[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
      if (rows.length >= maxRows) return rows;
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const decodeEntities = (s) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&#(\d+);/g, (_m, n) => String.fromCodePoint(Number(n)))
  .replace(/&amp;/g, '&');
const stripTags = (s) => decodeEntities(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function tagText(block, tag) {
  const m = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i').exec(block);
  return m ? stripTags(m[1]) : undefined;
}

/** Parse RSS 2.0, RSS 1.0 (RDF) and Atom into {title, count, newest, items}. Throws on non-feed input. */
export function parseFeed(xml, { maxItems = 3 } = {}) {
  if (!/<(rss|feed|rdf:RDF)[\s>]/i.test(xml)) throw new Error('not_a_feed');
  const isAtom = /<feed[\s>]/i.test(xml);
  const itemRe = isAtom ? /<entry[\s>][\s\S]*?<\/entry>/gi : /<item[\s>][\s\S]*?<\/item>/gi;
  const blocks = xml.match(itemRe) ?? [];
  const items = blocks.map((b) => {
    const link = isAtom ? (/<link[^>]*href=["']([^"']+)["']/i.exec(b)?.[1]) : tagText(b, 'link');
    const date = tagText(b, isAtom ? 'updated' : 'pubDate') ?? tagText(b, 'published') ?? tagText(b, 'dc:date');
    return { title: clip(tagText(b, 'title') ?? '', 140), link, date };
  });
  const head = xml.slice(0, xml.search(itemRe) > 0 ? xml.search(itemRe) : undefined);
  const dated = items.map((i) => Date.parse(i.date ?? '')).filter(Number.isFinite);
  return {
    title: clip(tagText(head, 'title') ?? '', 120),
    count: items.length,
    newest: dated.length ? new Date(Math.max(...dated)).toISOString() : undefined,
    items: items.slice(0, maxItems),
  };
}

const looksLikeHtml = (text) => /^\s*(<!doctype html|<html[\s>])/i.test(text.slice(0, 400));

async function readLimited(res, maxBytes) {
  if (!res.body || typeof res.body.getReader !== 'function') {
    const text = await res.text();
    return { text: text.slice(0, maxBytes), truncated: text.length > maxBytes, bytes: text.length };
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let text = '';
  let bytes = 0;
  let truncated = false;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    text += dec.decode(value, { stream: true });
    if (bytes >= maxBytes) { truncated = true; try { await reader.cancel(); } catch { /* already closed */ } break; }
  }
  return { text: text + dec.decode(), truncated, bytes };
}

function pickFields(json, pick) {
  const out = {};
  for (const [name, path] of Object.entries(pick)) {
    const v = getPath(json, path);
    if (v !== undefined) out[name] = v;
  }
  return out;
}

function hexToNumber(v) {
  if (typeof v === 'string' && /^0x[0-9a-f]+$/i.test(v)) {
    const n = Number(BigInt(v));
    return Number.isSafeInteger(n) ? n : v;
  }
  return v;
}

/** Turn a response body into the entry's summary. Throws Error('reason') on anything that is not real data. */
export function parseBody(entry, text, { truncated = false } = {}) {
  const adapter = entry.adapter ?? 'json';
  const nonJson = adapter === 'csv' || adapter === 'rss' || adapter === 'text';
  if (!nonJson && looksLikeHtml(text)) throw new Error('html_instead_of_data');
  if (adapter === 'rss' || adapter === 'text' || adapter === 'csv') {
    if (looksLikeHtml(text) && !(adapter === 'rss' && /<rss|<feed|<rdf:RDF/i.test(text))) throw new Error('html_instead_of_data');
  }
  switch (adapter) {
    case 'rss': return parseFeed(text);
    case 'text': {
      const lines = text.split(/\r?\n/);
      const head = lines.map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).slice(0, 3).map((l) => clip(l));
      const out = { bytes: text.length, lines: lines.length, head, truncated: truncated || undefined };
      if (entry.patterns) out.matches = Object.fromEntries(entry.patterns.map((p) => [p, text.split(p).length - 1]));
      if (!head.length && !text.trim()) throw new Error('empty_body');
      return out;
    }
    case 'csv': {
      const rows = parseCsv(text, { maxRows: 20_000, delimiter: entry.delimiter ?? ',' });
      const skip = entry.skipRows ?? 0;
      const body = rows.slice(skip);
      if (body.length < 2) throw new Error('csv_without_rows');
      const header = body[0];
      const last = body[body.length - 1];
      return { columns: header.slice(0, 20), rows: body.length - 1, last: Object.fromEntries(header.slice(0, 20).map((h, i) => [h, clip(last[i] ?? '', 80)])), truncated: truncated || undefined };
    }
    default: break;
  }
  if (truncated) throw new Error('json_truncated_over_limit');
  let json;
  try { json = JSON.parse(text); } catch { throw new Error('invalid_json'); }
  switch (adapter) {
    case 'ckan': {
      if (json?.success !== true) throw new Error('ckan_success_false');
      const r = json.result ?? {};
      return { total: r.count, recent: (r.results ?? []).slice(0, 3).map((p) => ({ title: clip(p.title || p.name || ''), modified: p.metadata_modified })) };
    }
    case 'socrata': {
      if (typeof json?.resultSetSize !== 'number') throw new Error('socrata_shape');
      return { total: json.resultSetSize, recent: (json.results ?? []).slice(0, 3).map((r) => ({ title: clip(r.resource?.name ?? ''), updated: r.resource?.updatedAt })) };
    }
    case 'ods': {
      if (typeof json?.total_count !== 'number') throw new Error('ods_shape');
      return { total: json.total_count, sample: (json.results ?? []).slice(0, 3).map((r) => r.dataset_id ?? r.dataset?.dataset_id) };
    }
    case 'udata': {
      if (typeof json?.total !== 'number') throw new Error('udata_shape');
      return { total: json.total, recent: (json.data ?? []).slice(0, 3).map((d) => ({ title: clip(d.title ?? ''), modified: d.last_modified })) };
    }
    case 'statuspage': {
      const s = json?.status;
      if (!s || typeof s.indicator !== 'string') throw new Error('statuspage_shape');
      return { indicator: s.indicator, description: s.description, updatedAt: json.page?.updated_at };
    }
    case 'jsonrpc': {
      if (json?.error) throw new Error(`rpc_error:${clip(String(json.error.message ?? json.error.code ?? 'unknown'), 60)}`);
      if (json?.result === undefined) throw new Error('rpc_no_result');
      const result = hexToNumber(json.result);
      return isScalar(result) ? { result } : { result: summarizeJson(result) };
    }
    case 'json': {
      if (entry.pick) {
        const data = pickFields(json, entry.pick);
        for (const [k, v] of Object.entries(data)) data[k] = hexToNumber(Array.isArray(v) && v.length > 10 ? v.slice(0, 10) : v);
        return data;
      }
      return summarizeJson(json);
    }
    default: throw new Error(`unknown_adapter:${adapter}`);
  }
}

function capSummary(data) {
  const s = JSON.stringify(data);
  if (s.length <= MAX_SUMMARY_CHARS) return data;
  return { truncated: true, chars: s.length, keys: data && typeof data === 'object' ? Object.keys(data).slice(0, 15) : undefined };
}

const ACCEPT = {
  json: 'application/json, */*;q=0.5',
  ckan: 'application/json', socrata: 'application/json', ods: 'application/json', udata: 'application/json',
  statuspage: 'application/json', jsonrpc: 'application/json',
  rss: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*;q=0.5',
  csv: 'text/csv, text/plain, */*;q=0.5',
  text: 'text/plain, text/xml, application/xml, */*;q=0.5',
};

const RETRYABLE = new Set([408, 425, 500, 502, 503, 504]);

/**
 * Fetch and summarise one registry entry. Never throws: failures come back as {ok:false, error}.
 * opts: { fetchFn, now, timeoutMs, userAgent, sleep }
 */
export async function fetchProvider(entry, opts = {}) {
  const { fetchFn = globalThis.fetch, now = new Date(), timeoutMs = entry.timeoutMs ?? DEFAULT_TIMEOUT_MS, userAgent, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) } = opts;
  const started = Date.now();
  const url = expandUrlTemplate(entry.url, now);
  const post = entry.body !== undefined || entry.method === 'POST';
  const headers = { Accept: ACCEPT[entry.adapter ?? 'json'] ?? '*/*', ...(userAgent ? { 'User-Agent': userAgent } : {}), ...(post ? { 'Content-Type': 'application/json' } : {}), ...(entry.headers ?? {}) };
  const init = () => ({ method: post ? 'POST' : 'GET', headers, body: post ? JSON.stringify(entry.body ?? {}) : undefined, signal: AbortSignal.timeout(timeoutMs), redirect: 'follow' });
  let lastError = 'unknown';
  let status = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetchFn(url, init());
      status = res.status;
      if (!res.ok) {
        lastError = `http_${res.status}`;
        try { await res.body?.cancel?.(); } catch { /* ignore */ }
        if (RETRYABLE.has(res.status) && attempt === 0) { await sleep(1500); continue; }
        break;
      }
      const { text, truncated, bytes } = await readLimited(res, entry.maxBytes ?? MAX_BODY_BYTES);
      const data = parseBody(entry, text, { truncated });
      if (!isMeaningful(data)) { lastError = 'empty_result'; break; }
      return { id: entry.id, ok: true, status, ms: Date.now() - started, bytes, error: null, data: capSummary(data) };
    } catch (err) {
      const name = err?.name;
      lastError = name === 'TimeoutError' || name === 'AbortError' ? 'timeout' : (err?.message?.match(/^[a-z_]+(?::.*)?$/) ? err.message : `network:${clip(String(err?.cause?.code ?? err?.message ?? err), 60)}`);
      const transient = lastError === 'timeout' || lastError.startsWith('network:');
      if (transient && attempt === 0) { await sleep(1500); continue; }
      break;
    }
  }
  return { id: entry.id, ok: false, status, ms: Date.now() - started, bytes: 0, error: lastError, data: null };
}
