// Diagnostic: why do some Mongolian aimags fail the "aimag row = sum of soum rows" check? Prints one line per aimag.
import { fetchTable, placeRows } from './subnational/providers/pxweb-mongolia.mjs';
import { curlFetch } from './subnational/_curl.mjs';
const rows = await fetchTable(curlFetch, 'Population and household', 'DT_NSO_0300_002V4');
const placed = placeRows(rows);
console.log('rows fetched:', rows.length, 'years:', [...new Set(rows.map((r) => r.year))].join(','));
const tot = rows.find((r) => r.code === '0');
const sum = (f) => rows.filter(f).reduce((a, r) => a + r.value, 0);
console.log('national total', tot?.value, '| sum of 3-digit rows', sum((r) => r.code.length === 3), '| sum of 5-digit rows', sum((r) => r.code.length === 5));
for (const [id, hit] of placed) {
  const kids = rows.filter((r) => r.code.length === 5 && r.code.startsWith(hit.code) && r.year === hit.year);
  const sum = kids.reduce((a, r) => a + r.value, 0);
  const diff = kids.length ? ((sum - hit.value) / hit.value) * 100 : null;
  console.log(id.padEnd(7), String(hit.code).padEnd(4), String(hit.value).padStart(9), 'kids', String(kids.length).padStart(2), 'sum', String(sum).padStart(9), diff == null ? 'no-kids' : `${diff.toFixed(2)}%`, diff != null && Math.abs(diff) > 0.5 ? '  <-- DROPPED' : '');
}
