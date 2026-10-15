// Keyless UCDP GED fallback: the annual GED release is also published as a
// plain CSV zip on ucdp.uu.se/downloads (no access token). Used by
// scripts/seed-ucdp-events.mjs when the token-gated REST API refuses us.
// Rows come out with the same field names the REST API's `Result[]` uses
// (id, year, date_start, side_a, best, ...), so downstream mapping is shared.
//
// Streaming on purpose: the unzipped CSV is several hundred MB, so we inflate
// and parse incrementally and keep only recent rows instead of one giant string.

import { Readable } from 'node:stream';
import zlib from 'node:zlib';

/** Newest-first candidate annual releases, e.g. 26.1, 25.1, 24.1. */
export function buildGedCsvCandidates(now = new Date()) {
  const yy = now.getUTCFullYear() % 100;
  return [yy, yy - 1, yy - 2].map((y) => ({
    version: `${y}.1`,
    url: `https://ucdp.uu.se/downloads/ged/ged${y}1-csv.zip`,
  }));
}

/** Locate the first file entry in a ZIP buffer. Returns { method, data } (still compressed). */
export function readFirstZipEntry(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65_557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('zip: end-of-central-directory not found');
  const cdOffset = buf.readUInt32LE(eocd + 16);
  if (cdOffset === 0xffffffff) throw new Error('zip64 archives are not supported');
  if (buf.readUInt32LE(cdOffset) !== 0x02014b50) throw new Error('zip: bad central directory');
  const method = buf.readUInt16LE(cdOffset + 10);
  const compressedSize = buf.readUInt32LE(cdOffset + 20);
  const localOffset = buf.readUInt32LE(cdOffset + 42);
  if (compressedSize === 0xffffffff || localOffset === 0xffffffff) throw new Error('zip64 archives are not supported');
  if (buf.readUInt32LE(localOffset) !== 0x04034b50) throw new Error('zip: bad local header');
  const start = localOffset + 30 + buf.readUInt16LE(localOffset + 26) + buf.readUInt16LE(localOffset + 28);
  return { method, data: buf.subarray(start, start + compressedSize) };
}

/**
 * Incremental RFC-4180 CSV parser. write() may split anywhere, including
 * inside a quoted field or between \r and \n.
 */
export function createCsvParser(onRow) {
  let field = '';
  let row = [];
  let inQuotes = false;
  let pendingQuote = false; // saw a quote while in quotes; next char decides escaped vs closing
  let pendingCR = false;
  const endField = () => { row.push(field); field = ''; };
  const endRow = () => { endField(); onRow(row); row = []; };
  return {
    write(chunk) {
      for (let i = 0; i < chunk.length; i++) {
        const ch = chunk[i];
        if (pendingCR) { pendingCR = false; if (ch === '\n') continue; }
        if (pendingQuote) {
          pendingQuote = false;
          if (ch === '"') { field += '"'; continue; }
          inQuotes = false;
        }
        if (inQuotes) {
          if (ch === '"') pendingQuote = true; else field += ch;
        } else if (ch === '"' && field === '') {
          inQuotes = true;
        } else if (ch === ',') {
          endField();
        } else if (ch === '\n') {
          endRow();
        } else if (ch === '\r') {
          endRow(); pendingCR = true;
        } else {
          field += ch;
        }
      }
    },
    end() {
      pendingQuote = false;
      if (field !== '' || row.length > 0) endRow();
    },
  };
}

/** Parse a ZIP's first CSV entry, keeping rows with year >= minYear. */
export async function parseGedZip(zipBuf, { minYear = 0 } = {}) {
  const { method, data } = readFirstZipEntry(zipBuf);
  let source;
  if (method === 8) source = Readable.from([data]).pipe(zlib.createInflateRaw());
  else if (method === 0) source = Readable.from([data]);
  else throw new Error(`zip: unsupported compression method ${method}`);

  const events = [];
  let header = null;
  let yearIdx = -1;
  const parser = createCsvParser((row) => {
    if (!header) { header = row.map((h) => h.trim()); yearIdx = header.indexOf('year'); return; }
    if (row.length < header.length) return;
    if (yearIdx >= 0 && Number(row[yearIdx]) < minYear) return;
    const ev = {};
    for (let i = 0; i < header.length; i++) ev[header[i]] = row[i];
    events.push(ev);
  });
  const decoder = new TextDecoder('utf-8');
  for await (const chunk of source) parser.write(decoder.decode(chunk, { stream: true }));
  parser.write(decoder.decode());
  parser.end();
  if (!header) throw new Error('csv: empty file');
  return events;
}

/**
 * Download the newest available annual GED CSV and return recent events.
 * @returns {Promise<{ version: string, events: object[] }>}
 */
export async function fetchGedCsvEvents({ fetchFn = globalThis.fetch, now = new Date(), minYear, timeoutMs = 240_000 } = {}) {
  const keepFrom = minYear ?? now.getUTCFullYear() - 2;
  let lastErr = null;
  for (const { version, url } of buildGedCsvCandidates(now)) {
    try {
      const resp = await fetchFn(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; worldmonitor-faii)' },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!resp.ok) { lastErr = new Error(`UCDP GED CSV ${version}: HTTP ${resp.status}`); continue; }
      const buf = Buffer.from(await resp.arrayBuffer());
      if (buf.length < 4 || buf.readUInt32LE(0) !== 0x04034b50) { lastErr = new Error(`UCDP GED CSV ${version}: not a zip`); continue; }
      const events = await parseGedZip(buf, { minYear: keepFrom });
      if (events.length === 0) { lastErr = new Error(`UCDP GED CSV ${version}: no rows >= ${keepFrom}`); continue; }
      return { version, events };
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error('UCDP GED CSV: no candidate release found');
}
