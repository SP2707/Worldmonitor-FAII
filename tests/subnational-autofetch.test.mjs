import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ensureSourceFile, ckanResourceUrl, looksLike } from '../scripts/subnational/_autofetch.mjs';

const eocd = Buffer.alloc(22); eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt32LE(3004, 16); // no entries, central directory (empty) at offset 3004
const xlsxBytes = Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.alloc(3000, 1), eocd]);
const html = Buffer.from('<!DOCTYPE html><html><head>bot check</head></html>'.padEnd(3000, ' '));
const fake = (map) => async (url) => {
  const hit = map[url];
  if (!hit) return new Response('nope', { status: 404 });
  return new Response(hit, { status: 200 });
};
const tmp = () => mkdtempSync(join(tmpdir(), 'wm-af-'));

test('magic-byte checks', () => {
  assert.ok(looksLike('xlsx', xlsxBytes));
  assert.ok(!looksLike('xlsx', html));
  assert.ok(looksLike('pdf', Buffer.from('%PDF-1.7 ....')));
  assert.ok(!looksLike('csv', html));
});

test('downloads, validates, caches; second call is a fresh-cache hit without fetching', async () => {
  const cacheDir = tmp(); let calls = 0;
  const fetchFn = async (u) => { calls++; return fake({ 'https://x/a.xlsx': xlsxBytes })(u); };
  const a = await ensureSourceFile({ id: 't', kind: 'xlsx', urls: ['https://x/a.xlsx'], cacheDir, fetchFn });
  assert.equal(a.status, 'downloaded');
  const b = await ensureSourceFile({ id: 't', kind: 'xlsx', urls: ['https://x/a.xlsx'], cacheDir, fetchFn });
  assert.equal(b.status, 'fresh-cache');
  assert.equal(calls, 1);
});

test('a bot-check HTML page is never stored; next URL is tried', async () => {
  const cacheDir = tmp();
  const fetchFn = fake({ 'https://x/bot': html, 'https://x/ok.xlsx': xlsxBytes });
  const r = await ensureSourceFile({ id: 't2', kind: 'xlsx', urls: ['https://x/bot', 'https://x/ok.xlsx'], cacheDir, fetchFn });
  assert.equal(r.url, 'https://x/ok.xlsx');
  assert.match(r.attempts[0], /not a xlsx file/);
});

test('stale cache is used (and labelled) when every URL fails; never overwritten by junk', async () => {
  const cacheDir = tmp(); let t = 0;
  const now = () => t;
  await ensureSourceFile({ id: 't3', kind: 'xlsx', urls: ['https://x/a.xlsx'], cacheDir, fetchFn: fake({ 'https://x/a.xlsx': xlsxBytes }), now });
  t = 200 * 86_400_000;
  const r = await ensureSourceFile({ id: 't3', kind: 'xlsx', urls: ['https://x/a.xlsx'], cacheDir, fetchFn: fake({ 'https://x/a.xlsx': html }), now, maxAgeDays: 90 });
  assert.equal(r.status, 'stale-cache');
  assert.ok(r.ageDays > 190);
  assert.ok(looksLike('xlsx', readFileSync(r.path)));
});

test('falls back to a hand-dropped local file; throws a helpful error when nothing is usable', async () => {
  const cacheDir = tmp(); const local = join(tmp(), 'ESTATES1.XLSX');
  writeFileSync(local, xlsxBytes);
  const r = await ensureSourceFile({ id: 't4', kind: 'xlsx', urls: [], localFiles: [local], cacheDir });
  assert.equal(r.status, 'local-file');
  await assert.rejects(ensureSourceFile({ id: 't5', kind: 'xlsx', urls: ['https://x/none'], localFiles: [], cacheDir: tmp(), fetchFn: fake({}) }), /HTTP 404/);
  assert.ok(!existsSync(join(cacheDir, 't5.xlsx')));
});

test('CKAN resolver picks the matching resource url', async () => {
  const body = JSON.stringify({ result: { resources: [{ name: 'Vol 2', url: 'https://h/v2.pdf' }, { name: 'Crime in India 2022 - Vol 1', url: 'https://h/v1.pdf' }] } });
  const fetchFn = async (u) => { assert.match(u, /package_show\?id=crime-in-india-2022/); return new Response(body, { status: 200 }); };
  assert.equal(await ckanResourceUrl({ base: 'https://h', dataset: 'crime-in-india-2022', match: /vol 1/i }, { fetchFn }), 'https://h/v1.pdf');
});

import { scrapeLinkUrl } from '../scripts/subnational/_autofetch.mjs';
import { ESTATES_LINK, ESTATES_PINNED } from '../scripts/subnational/providers/rbi-estates.mjs';

test('scrapeLinkUrl finds the e-STATES workbook link (absolute or relative) and ignores appendix workbooks', async () => {
  const html = `<a href="https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/01_APP230120266318663B94AF422D8941472ECF135352.XLSX">1</a>
    <a href='https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/ESTATES23012027ABCDEF.XLSX'>e-STATES</a>`;
  const fetchFn = async () => new Response(html, { status: 200 });
  assert.equal(await scrapeLinkUrl({ pageUrl: 'https://rbi.org.in/x', match: ESTATES_LINK }, { fetchFn }), 'https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/ESTATES23012027ABCDEF.XLSX');
  await assert.rejects(scrapeLinkUrl({ pageUrl: 'https://rbi.org.in/x', match: ESTATES_LINK }, { fetchFn: async () => new Response('<a href="/a.pdf">', { status: 200 }) }), /no link matching/);
  assert.ok(ESTATES_LINK.test(ESTATES_PINNED));
});

import { isIntact } from '../scripts/subnational/_autofetch.mjs';

test('truncation check: whole zip passes, cut zip fails; curl failure falls back to the second transport', async () => {
  const { execFileSync } = await import('node:child_process');
  const { default: zlib } = await import('node:zlib');
  void zlib;
  const real = readFileSync(new URL('./fixtures/rbi_estates_sample.xlsx', import.meta.url));
  assert.ok(isIntact('xlsx', real));
  assert.ok(!isIntact('xlsx', real.subarray(0, real.length - 40)));
  void execFileSync;
  const cacheDir = tmp();
  const curlLike = async () => { throw new Error('curl failed (exit 56): schannel: server closed abruptly (missing close_notify)'); };
  const r = await ensureSourceFile({ id: 't6', kind: 'xlsx', urls: ['https://x/a'], cacheDir, minBytes: 1000, fetchFn: curlLike, fallbackFetch: async () => new Response(real, { status: 200 }) });
  assert.equal(r.status, 'downloaded');
  assert.match(r.attempts[0], /retrying with built-in fetch/);
  const cut = await ensureSourceFile({ id: 't7', kind: 'xlsx', urls: ['https://x/a'], cacheDir: tmp(), minBytes: 1000, fetchFn: async () => new Response(real.subarray(0, real.length - 40), { status: 200 }) }).catch((e) => e);
  assert.match(String(cut.message), /truncated xlsx/);
});
