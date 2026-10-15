// Minimal .xlsx reader (no dependency): returns the cell values of one worksheet as an array of rows.
// Handles shared strings, inline strings and numbers; formulas are read as their cached value. Sparse cells become null.
import { unzip } from './_zip.mjs';

const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&amp;/g, '&');

function colIndex(ref) {
  let n = 0;
  for (const ch of ref.replace(/\d+/g, '')) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

function sharedStrings(xml) {
  if (!xml) return [];
  const out = [];
  for (const si of xml.matchAll(/<si>([\s\S]*?)<\/si>/g)) {
    out.push(decode([...si[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join('')));
  }
  return out;
}

export function listSheets(buf) {
  const files = unzip(buf);
  const wb = files.get('xl/workbook.xml')?.toString('utf8') ?? '';
  return [...wb.matchAll(/<sheet\b[^>]*name="([^"]*)"/g)].map((m) => decode(m[1]));
}

/** Lazily yields [rowNumber, cells[]] for one worksheet, so a huge sheet is never held as an array of rows. */
export function* iterSheetRows(buf, sheetName) {
  const files = unzip(buf);
  const wb = files.get('xl/workbook.xml')?.toString('utf8');
  const rels = files.get('xl/_rels/workbook.xml.rels')?.toString('utf8');
  if (!wb || !rels) throw new Error('not an xlsx workbook');
  let rid = null;
  for (const m of wb.matchAll(/<sheet\b([^>]*)\/?>/g)) {
    const name = /name="([^"]*)"/.exec(m[1])?.[1];
    if (name != null && decode(name) === sheetName) rid = /r:id="([^"]*)"/.exec(m[1])?.[1];
  }
  if (!rid) throw new Error(`sheet "${sheetName}" not found`);
  let target = null;
  for (const m of rels.matchAll(/<Relationship\b([^>]*)\/?>/g)) {
    if (/\bId="([^"]*)"/.exec(m[1])?.[1] === rid) target = /Target="([^"]*)"/.exec(m[1])?.[1];
  }
  if (!target) throw new Error(`no relationship for sheet "${sheetName}"`);
  const path = target.startsWith('/') ? target.slice(1) : `xl/${target}`;
  const xml = files.get(path)?.toString('utf8');
  if (!xml) throw new Error(`worksheet part ${path} missing`);
  const strings = sharedStrings(files.get('xl/sharedStrings.xml')?.toString('utf8'));
  for (const rm of xml.matchAll(/<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g)) {
    const rn = Number(/\br="(\d+)"/.exec(rm[1])?.[1]);
    const cells = [];
    for (const cm of (rm[2] ?? '').matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const ref = /\br="([A-Z]+\d*)"/.exec(cm[1])?.[1];
      const type = /\bt="([^"]*)"/.exec(cm[1])?.[1];
      const inner = cm[2] ?? '';
      const v = /<v>([\s\S]*?)<\/v>/.exec(inner)?.[1];
      let val = null;
      if (type === 'inlineStr') val = decode([...inner.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join(''));
      else if (v != null) val = type === 's' ? strings[Number(v)] ?? null : type === 'str' ? decode(v) : (Number.isFinite(Number(v)) ? Number(v) : decode(v));
      if (ref) cells[colIndex(ref)] = val;
    }
    yield [rn, Array.from(cells, (c) => c ?? null)];
  }
}

/** @returns {(string|number|null)[][]} */
export function readSheet(buf, sheetName) {
  const rows = [];
  for (const [rn, cells] of iterSheetRows(buf, sheetName)) rows[Number.isFinite(rn) ? rn - 1 : rows.length] = cells;
  return Array.from(rows, (r) => r ?? []);
}
