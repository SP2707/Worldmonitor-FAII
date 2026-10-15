// Download-and-keep for source files that are published as a whole file (xlsx / pdf / csv / zip).
// Rules (deliberate):
//  * plain GET through curl (same transport as the OECD provider); no cookies, no headless browser, no TLS bypass.
//    A site that answers with a bot-check page is simply "unreachable": nothing is evaded.
//  * a download is accepted only if it is the expected file type (magic bytes) and big enough - an HTML error or
//    bot-check page is never stored as data.
//  * the last good copy is kept; if every URL fails the cached copy (even stale) or a hand-dropped local file is used,
//    and the result says which one, so callers/Alfred can report staleness instead of hiding it.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { curlFetch } from './_curl.mjs';

const DAY = 86_400_000;
const MAGIC = {
  xlsx: (b) => b.length > 4 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04,
  zip: (b) => b.length > 4 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04,
  pdf: (b) => b.length > 5 && b.subarray(0, 5).toString('latin1') === '%PDF-',
  csv: (b) => { const head = b.subarray(0, 512).toString('utf8').trimStart().toLowerCase(); return b.length > 20 && !head.startsWith('<') && head.includes(','); },
};
/** Truncation check that does not inflate the archive: a zip/xlsx must end with an intact end-of-central-directory record; a pdf with %%EOF. */
export function isIntact(kind, buf) {
  if (kind === 'xlsx' || kind === 'zip') {
    for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
      if (buf.readUInt32LE(i) === 0x06054b50) return buf.readUInt32LE(i + 16) + buf.readUInt32LE(i + 12) === i;
    }
    return false;
  }
  if (kind === 'pdf') return buf.subarray(Math.max(0, buf.length - 2048)).toString('latin1').includes('%%EOF');
  return true;
}
export const looksLike = (kind, buf) => Boolean(MAGIC[kind]?.(buf));

export function defaultCacheDir() { return resolve(process.cwd(), '.cache/sources'); }

function readMeta(dir, id) {
  try { return JSON.parse(readFileSync(join(dir, `${id}.meta.json`), 'utf8')); } catch { return null; }
}

/** Resolve a CKAN dataset to the download URL of the first resource whose name/url matches `match` (RegExp). */
export async function ckanResourceUrl({ base, dataset, match }, { fetchFn = curlFetch } = {}) {
  const res = await fetchFn(`${base.replace(/\/$/, '')}/api/3/action/package_show?id=${encodeURIComponent(dataset)}`, { timeoutMs: 60_000 });
  if (res.status !== 200) throw new Error(`CKAN package_show HTTP ${res.status}`);
  const body = await res.json();
  const hit = (body?.result?.resources ?? []).find((r) => match.test(`${r.name ?? ''} ${r.url ?? ''}`));
  if (!hit?.url) throw new Error(`CKAN: no resource matching ${match} in ${dataset}`);
  return hit.url;
}

/** Plain GET of a public HTML page, return the first href that matches `match` (absolute or relative; resolved against the page). */
export async function scrapeLinkUrl({ pageUrl, match }, { fetchFn = curlFetch } = {}) {
  const res = await fetchFn(pageUrl, { timeoutMs: 90_000 });
  if (res.status !== 200) throw new Error(`${pageUrl} HTTP ${res.status}`);
  const html = await res.text();
  for (const m of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
    const href = m[1].replace(/&amp;/g, '&').trim();
    if (match.test(href)) return new URL(href, pageUrl).href;
  }
  throw new Error(`no link matching ${match} on ${pageUrl}`);
}

/**
 * @param {object} o
 * @param {string} o.id           stable id, used for cache file names
 * @param {'xlsx'|'zip'|'pdf'|'csv'} o.kind
 * @param {(string|(() => Promise<string>))[]} [o.urls]  tried in order
 * @param {string[]} [o.localFiles] hand-dropped fallbacks (absolute paths), newest valid wins
 * @returns {Promise<{path:string, status:'fresh-cache'|'downloaded'|'stale-cache'|'local-file', ageDays:number|null, url?:string, attempts:string[]}>}
 */
export async function ensureSourceFile({
  id, kind, urls = [], localFiles = [], maxAgeDays = 90, minBytes = 1024, cacheDir, fetchFn = curlFetch, fallbackFetch = fetchFn === curlFetch ? globalThis.fetch : null, now = Date.now,
}) {
  if (!cacheDir && process.env.NODE_TEST_CONTEXT) throw new Error('autofetch: tests must pass an explicit cacheDir');
  const dir = cacheDir ?? defaultCacheDir();
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${id}.${kind}`);
  const attempts = [];
  const validCached = () => {
    if (!existsSync(file)) return null;
    const buf = readFileSync(file);
    if (buf.length < minBytes || !looksLike(kind, buf) || !isIntact(kind, buf)) return null;
    const meta = readMeta(dir, id);
    const fetchedAt = meta?.fetchedAt ?? statSync(file).mtimeMs;
    return { ageDays: (now() - fetchedAt) / DAY, url: meta?.url };
  };

  const cached = validCached();
  if (cached && cached.ageDays <= maxAgeDays) return { path: file, status: 'fresh-cache', ageDays: cached.ageDays, url: cached.url, attempts };

  const tried = new Set();
  for (const u of urls) {
    let url;
    try {
      url = typeof u === 'function' ? await u() : u;
      if (tried.has(url)) continue; // e.g. the scraped link equals the pinned one
      tried.add(url);
      // curl.exe on Windows (schannel) sometimes aborts with exit 56 "missing close_notify" on servers that drop the TLS
      // session without the closing alert; Node's own fetch (OpenSSL) is the second transport. Truncation is caught below.
      let res;
      try { res = await fetchFn(url, { timeoutMs: 300_000 }); }
      catch (err) {
        if (!fallbackFetch) throw err;
        attempts.push(`${url} -> ${String(err.message).slice(0, 120)} (retrying with built-in fetch)`);
        res = await fallbackFetch(url, { signal: AbortSignal.timeout(300_000) });
      }
      if (res.status !== 200) { attempts.push(`${url} -> HTTP ${res.status}`); continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < minBytes || !looksLike(kind, buf)) { attempts.push(`${url} -> not a ${kind} file (${buf.length} bytes; probably an HTML/bot-check page)`); continue; }
      if (!isIntact(kind, buf)) { attempts.push(`${url} -> truncated ${kind} (${buf.length} bytes)`); continue; }
      const tmp = `${file}.part`;
      writeFileSync(tmp, buf);
      renameSync(tmp, file);
      writeFileSync(join(dir, `${id}.meta.json`), JSON.stringify({ url, fetchedAt: now(), bytes: buf.length, sha256: createHash('sha256').update(buf).digest('hex') }, null, 1));
      return { path: file, status: 'downloaded', ageDays: 0, url, attempts };
    } catch (err) {
      attempts.push(`${url ?? '(url resolver)'} -> ${String(err.message).slice(0, 160)}`);
    }
  }

  if (cached) return { path: file, status: 'stale-cache', ageDays: cached.ageDays, url: cached.url, attempts };
  const locals = localFiles.filter((p) => existsSync(p)).map((p) => ({ p, m: statSync(p).mtimeMs }))
    .filter(({ p }) => { const b = readFileSync(p); return b.length >= minBytes && looksLike(kind, b); }).sort((a, b) => b.m - a.m);
  if (locals.length) return { path: locals[0].p, status: 'local-file', ageDays: (now() - locals[0].m) / DAY, attempts };
  throw new Error(`${id}: no usable ${kind} file. ${attempts.length ? `Download attempts: ${attempts.join(' | ')}. ` : 'No download URL configured. '}Put the file in docs/samples/national/ or configure a URL (see docs/AUTOFETCH.md).`);
}
