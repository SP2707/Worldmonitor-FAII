import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { expandUrlTemplate, getPath, parseCsv, parseFeed, summarizeJson, isMeaningful, parseBody, fetchProvider } from '../scripts/providers/_adapters.mjs';

const NOW = new Date(Date.UTC(2026, 9, 12, 13, 0, 0));
const res = (body, { status = 200, headers = {} } = {}) => new Response(typeof body === 'string' ? body : JSON.stringify(body), { status, headers });
const noSleep = () => Promise.resolve();

describe('expandUrlTemplate', () => {
  it('expands date tokens in UTC with day offsets', () => {
    assert.equal(expandUrlTemplate('a/{YMD}/b/{YMD-3}/{YYYYMMDD}/{Y}-{M}-{D}', NOW), 'a/2026-10-12/b/2026-10-09/20261012/2026-10-12');
  });
  it('crosses month boundaries', () => {
    assert.equal(expandUrlTemplate('{YMD-12}', NOW), '2026-09-30');
  });
  it('leaves unknown braces alone', () => {
    assert.equal(expandUrlTemplate('x/{foo}', NOW), 'x/{foo}');
  });
});

describe('getPath', () => {
  const v = { a: { b: [{ c: 1 }, { c: 2 }] }, z: null };
  it('reads nested paths and indexes', () => { assert.equal(getPath(v, 'a.b.1.c'), 2); });
  it('maps * over arrays', () => { assert.deepEqual(getPath(v, 'a.b.*.c'), [1, 2]); });
  it('is undefined through null/missing', () => { assert.equal(getPath(v, 'z.q'), undefined); assert.equal(getPath(v, 'nope.x'), undefined); });
});

describe('parseCsv', () => {
  it('handles quotes, embedded commas/newlines and CRLF', () => {
    const rows = parseCsv('a,b\r\n"x,1","he said ""hi"""\r\n"l1\nl2",3\r\n');
    assert.deepEqual(rows, [['a', 'b'], ['x,1', 'he said "hi"'], ['l1\nl2', '3']]);
  });
  it('supports a custom delimiter', () => { assert.deepEqual(parseCsv('a;b\n1;2', { delimiter: ';' }), [['a', 'b'], ['1', '2']]); });
});

describe('parseFeed', () => {
  it('parses RSS 2.0', () => {
    const f = parseFeed('<rss><channel><title>T &amp; Co</title><item><title><![CDATA[One]]></title><link>http://x/1</link><pubDate>Mon, 12 Oct 2026 10:00:00 GMT</pubDate></item><item><title>Two</title><link>http://x/2</link><pubDate>Sun, 11 Oct 2026 10:00:00 GMT</pubDate></item></channel></rss>');
    assert.equal(f.title, 'T & Co'); assert.equal(f.count, 2); assert.equal(f.items[0].title, 'One'); assert.equal(f.newest, '2026-10-12T10:00:00.000Z');
  });
  it('parses Atom', () => {
    const f = parseFeed('<feed xmlns="http://www.w3.org/2005/Atom"><title>A</title><entry><title>E1</title><link href="http://a/1"/><updated>2026-10-12T09:00:00Z</updated></entry></feed>');
    assert.equal(f.count, 1); assert.equal(f.items[0].link, 'http://a/1'); assert.equal(f.newest, '2026-10-12T09:00:00.000Z');
  });
  it('parses RSS 1.0 (RDF)', () => {
    const f = parseFeed('<rdf:RDF><channel><title>R</title></channel><item><title>I</title><link>http://r/1</link><dc:date>2026-10-01T00:00:00Z</dc:date></item></rdf:RDF>');
    assert.equal(f.count, 1); assert.equal(f.newest, '2026-10-01T00:00:00.000Z');
  });
  it('rejects non-feeds', () => { assert.throws(() => parseFeed('<html></html>'), /not_a_feed/); });
});

describe('summarizeJson / isMeaningful', () => {
  it('summarises objects and arrays structurally', () => {
    assert.deepEqual(summarizeJson({ a: 1, b: [1, 2], c: { d: 1 } }), { type: 'object', keys: ['a', 'b', 'c'], arrays: { b: 2 }, scalars: { a: 1 } });
    assert.equal(summarizeJson([{ x: 1 }, { x: 2 }]).length, 2);
  });
  it('treats empty containers as no data', () => {
    assert.equal(isMeaningful(summarizeJson({})), false);
    assert.equal(isMeaningful(summarizeJson([])), false);
    assert.equal(isMeaningful(summarizeJson({ a: 1 })), true);
    assert.equal(isMeaningful({ total: 0, recent: [] }), true);
    assert.equal(isMeaningful({}), false);
  });
});

describe('parseBody per adapter', () => {
  it('ckan', () => {
    const d = parseBody({ adapter: 'ckan' }, JSON.stringify({ success: true, result: { count: 42, results: [{ title: 'T', metadata_modified: '2026-10-01' }] } }));
    assert.deepEqual(d, { total: 42, recent: [{ title: 'T', modified: '2026-10-01' }] });
    assert.throws(() => parseBody({ adapter: 'ckan' }, '{"success":false}'), /ckan_success_false/);
  });
  it('socrata', () => {
    const d = parseBody({ adapter: 'socrata' }, JSON.stringify({ resultSetSize: 9, results: [{ resource: { name: 'N', updatedAt: 'u' } }] }));
    assert.equal(d.total, 9); assert.equal(d.recent[0].title, 'N');
    assert.throws(() => parseBody({ adapter: 'socrata' }, '{"x":1}'), /socrata_shape/);
  });
  it('ods', () => {
    assert.deepEqual(parseBody({ adapter: 'ods' }, '{"total_count":7,"results":[{"dataset_id":"d1"}]}'), { total: 7, sample: ['d1'] });
    assert.throws(() => parseBody({ adapter: 'ods' }, '{}'), /ods_shape/);
  });
  it('udata', () => {
    assert.equal(parseBody({ adapter: 'udata' }, '{"total":5,"data":[{"title":"x","last_modified":"y"}]}').total, 5);
  });
  it('statuspage', () => {
    assert.deepEqual(parseBody({ adapter: 'statuspage' }, '{"page":{"updated_at":"u"},"status":{"indicator":"none","description":"All Systems Operational"}}'), { indicator: 'none', description: 'All Systems Operational', updatedAt: 'u' });
    assert.throws(() => parseBody({ adapter: 'statuspage' }, '{"status":{}}'), /statuspage_shape/);
  });
  it('jsonrpc converts hex heads and surfaces RPC errors', () => {
    assert.deepEqual(parseBody({ adapter: 'jsonrpc' }, '{"jsonrpc":"2.0","id":1,"result":"0x10"}'), { result: 16 });
    assert.throws(() => parseBody({ adapter: 'jsonrpc' }, '{"error":{"code":-32601,"message":"nope"}}'), /rpc_error:nope/);
    assert.equal(parseBody({ adapter: 'jsonrpc' }, '{"result":{"a":1}}').result.type, 'object');
  });
  it('json with pick extracts named paths', () => {
    assert.deepEqual(parseBody({ adapter: 'json', pick: { price: 'data.p', n: 'data.list.0' } }, '{"data":{"p":"1.5","list":[3]}}'), { price: '1.5', n: 3 });
  });
  it('csv reports columns, row count and last row', () => {
    const d = parseBody({ adapter: 'csv' }, 'date,v\n2026-01-01,1\n2026-01-02,2\n');
    assert.deepEqual(d.columns, ['date', 'v']); assert.equal(d.rows, 2); assert.equal(d.last.v, '2');
    assert.throws(() => parseBody({ adapter: 'csv' }, 'only,header\n'), /csv_without_rows/);
  });
  it('text counts literal patterns and skips comments', () => {
    const d = parseBody({ adapter: 'text', patterns: ['<Rate '] }, '# c\n<Rate a/><Rate b/>\nsecond');
    assert.equal(d.matches['<Rate '], 2); assert.equal(d.head[0], '<Rate a/><Rate b/>');
  });
  it('rejects HTML served in place of data', () => {
    for (const adapter of ['json', 'ckan', 'text', 'csv']) assert.throws(() => parseBody({ adapter }, '<!DOCTYPE html><html><body>Blocked</body></html>'), /html_instead_of_data/, adapter);
  });
  it('rejects invalid JSON and truncated JSON', () => {
    assert.throws(() => parseBody({ adapter: 'json' }, 'not json'), /invalid_json/);
    assert.throws(() => parseBody({ adapter: 'json' }, '{"a":1}', { truncated: true }), /json_truncated/);
  });
});

describe('fetchProvider', () => {
  const entry = { id: 'x', url: 'https://example.test/a/{YMD}', adapter: 'ckan' };
  const ok = { success: true, result: { count: 3, results: [] } };
  it('returns ok with data and expands URL templates', async () => {
    let seen;
    const r = await fetchProvider(entry, { now: NOW, fetchFn: async (u) => { seen = u; return res(ok); }, sleep: noSleep });
    assert.equal(seen, 'https://example.test/a/2026-10-12');
    assert.equal(r.ok, true); assert.equal(r.data.total, 3); assert.equal(r.error, null);
  });
  it('reports HTTP errors without retrying 4xx', async () => {
    let n = 0;
    const r = await fetchProvider(entry, { fetchFn: async () => { n++; return res('nope', { status: 403 }); }, sleep: noSleep });
    assert.equal(r.ok, false); assert.equal(r.error, 'http_403'); assert.equal(n, 1);
  });
  it('retries once on 503 and succeeds', async () => {
    let n = 0;
    const r = await fetchProvider(entry, { fetchFn: async () => (++n === 1 ? res('', { status: 503 }) : res(ok)), sleep: noSleep });
    assert.equal(r.ok, true); assert.equal(n, 2);
  });
  it('maps timeouts and network errors to stable reasons', async () => {
    const t = await fetchProvider(entry, { fetchFn: async () => { const e = new Error('x'); e.name = 'TimeoutError'; throw e; }, sleep: noSleep });
    assert.equal(t.error, 'timeout');
    const n = await fetchProvider(entry, { fetchFn: async () => { const e = new TypeError('fetch failed'); e.cause = { code: 'ENOTFOUND' }; throw e; }, sleep: noSleep });
    assert.equal(n.error, 'network:ENOTFOUND');
  });
  it('a 200 with an HTML error page is a failure, not a connection', async () => {
    const r = await fetchProvider(entry, { fetchFn: async () => res('<html><body>Access denied</body></html>'), sleep: noSleep });
    assert.equal(r.ok, false); assert.equal(r.error, 'html_instead_of_data');
  });
  it('POSTs a JSON body and sends custom headers and the injected User-Agent', async () => {
    let init;
    const e = { id: 'rpc', url: 'https://rpc.test/', adapter: 'jsonrpc', body: { jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] }, headers: { 'X-Client': 'q' } };
    const r = await fetchProvider(e, { userAgent: 'UA-test', fetchFn: async (_u, i) => { init = i; return res({ jsonrpc: '2.0', id: 1, result: '0xff' }); }, sleep: noSleep });
    assert.equal(init.method, 'POST'); assert.equal(init.headers['Content-Type'], 'application/json'); assert.equal(init.headers['X-Client'], 'q'); assert.equal(init.headers['User-Agent'], 'UA-test');
    assert.deepEqual(JSON.parse(init.body).method, 'eth_blockNumber'); assert.equal(r.data.result, 255);
  });
  it('caps stored summaries', async () => {
    const big = { type: 'x' };
    const e = { id: 'big', url: 'https://big.test/', adapter: 'json' };
    const body = {}; for (let i = 0; i < 200; i++) body[`key_${i}`] = 'v'.repeat(100);
    const r = await fetchProvider(e, { fetchFn: async () => res(body), sleep: noSleep });
    assert.equal(r.ok, true); assert.ok(JSON.stringify(r.data).length <= 3000); void big;
  });
  it('stops reading oversized bodies and refuses truncated JSON', async () => {
    const e = { id: 'o', url: 'https://o.test/', adapter: 'json', maxBytes: 100 };
    const r = await fetchProvider(e, { fetchFn: async () => res(JSON.stringify({ a: 'x'.repeat(5000) })), sleep: noSleep });
    assert.equal(r.ok, false); assert.match(r.error, /json_truncated/);
  });
});
