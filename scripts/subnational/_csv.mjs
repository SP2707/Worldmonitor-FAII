// Minimal RFC 4180 CSV reader (quoted fields, doubled quotes, CRLF, newlines inside quotes).
// Returns an array of objects keyed by the header row. Fine for the ~12 MB files used here.
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQ = false;
  const n = text.length;
  for (let i = 0; i < n; i++) {
    const c = text.charCodeAt(i);
    if (inQ) {
      if (c === 34) {
        if (text.charCodeAt(i + 1) === 34) { field += '"'; i++; } else inQ = false;
      } else field += text[i];
    } else if (c === 34) inQ = true;
    else if (c === 44) { row.push(field); field = ''; }
    else if (c === 10 || c === 13) {
      if (c === 13 && text.charCodeAt(i + 1) === 10) i++;
      row.push(field); field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else field += text[i];
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  if (rows.length === 0) return [];
  const head = rows[0].map((h) => h.replace(/^﻿/, ''));
  return rows.slice(1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}
