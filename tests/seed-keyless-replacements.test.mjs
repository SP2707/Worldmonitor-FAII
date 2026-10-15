// Offline tests for the keyless replacements of the key-gated / failing seeders.
import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import zlib from 'node:zlib';
import { parseFredCsv, FRED_SERIES, validatePetroleum } from '../scripts/seed-eia-petroleum.mjs';
import { parseBbox, regionForPoint, rowToDetection } from '../scripts/seed-fire-detections.mjs';
import { mapOsmElements } from '../scripts/seed-webcams.mjs';
import {
  buildGedCsvCandidates, createCsvParser, readFirstZipEntry, parseGedZip,
} from '../scripts/shared/ucdp-ged-csv.mjs';

describe('FRED CSV replaces EIA api key', () => {
  it('parses newest two usable rows and skips "." gaps', () => {
    const csv = 'observation_date,WCESTUS1\n2026-09-18,420000\n2026-09-25,421500\n2026-10-02,.\n';
    assert.deepEqual(parseFredCsv(csv, 'MBBL'), { current: 421500, previous: 420000, date: '2026-09-25', unit: 'MBBL' });
  });
  it('returns null for empty or all-missing data', () => {
    assert.equal(parseFredCsv('DATE,X\n', 'x'), null);
    assert.equal(parseFredCsv('DATE,X\n2026-01-01,.\n', 'x'), null);
    assert.equal(parseFredCsv(undefined, 'x'), null);
  });
  it('keeps only the FRED series that exist (wti, brent) and validates', () => {
    assert.deepEqual(Object.keys(FRED_SERIES).sort(), ['brent', 'wti']);
    assert.equal(validatePetroleum({ wti: parseFredCsv('d,x\n2026-01-01,70\n', '$/BBL') }), true);
  });
});

describe('keyless FIRMS helpers', () => {
  it('parseBbox reads W,S,E,N', () => {
    assert.deepEqual(parseBbox('22,44,40,53'), { w: 22, s: 44, e: 40, n: 53 });
  });
  it('regionForPoint finds Ukraine (Kyiv) and rejects the open ocean', () => {
    assert.equal(regionForPoint(50.4, 30.5), 'Ukraine');
    assert.equal(regionForPoint(0, -140), null);
  });
  it('rowToDetection keeps the keyed-path shape', () => {
    const d = rowToDetection({
      latitude: '50.4', longitude: '30.5', acq_date: '2026-10-11', acq_time: '0930',
      bright_ti4: '390', frp: '90', confidence: 'h', satellite: 'N', daynight: 'D',
    }, 'Ukraine');
    assert.equal(d.region, 'Ukraine');
    assert.equal(d.confidence, 'FIRE_CONFIDENCE_HIGH');
    assert.equal(d.possibleExplosion, true);
    assert.equal(d.detectedAt, Date.parse('2026-10-11T09:30:00Z'));
    assert.equal(d.source, 'firms');
  });
});

describe('OSM webcams replace Windy', () => {
  it('maps nodes and ways, drops elements without coordinates or webcam tag', () => {
    const cams = mapOsmElements([
      { type: 'node', id: 1, lat: 10, lon: 20, tags: { name: 'Pier', 'contact:webcam': 'https://x.test/cam' } },
      { type: 'way', id: 2, center: { lat: 11, lon: 21 }, tags: { 'contact:webcam': 'https://y.test', tourism: 'attraction' } },
      { type: 'node', id: 3, tags: { 'contact:webcam': 'https://z.test' } },
      { type: 'node', id: 4, lat: 1, lon: 1, tags: { name: 'no cam' } },
    ]);
    assert.deepEqual(cams.map((c) => c.webcamId), ['osm-node-1', 'osm-way-2']);
    assert.equal(cams[0].title, 'Pier');
    assert.equal(cams[1].category, 'attraction');
    assert.equal(cams[1].lat, 11);
  });
});

function makeZip(name, content) {
  const data = zlib.deflateRawSync(Buffer.from(content, 'utf8'));
  const nameBuf = Buffer.from(name);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(8, 8);
  local.writeUInt32LE(data.length, 18); local.writeUInt32LE(Buffer.byteLength(content), 22);
  local.writeUInt16LE(nameBuf.length, 26);
  const cd = Buffer.alloc(46);
  cd.writeUInt32LE(0x02014b50, 0); cd.writeUInt16LE(20, 4); cd.writeUInt16LE(20, 6); cd.writeUInt16LE(8, 10);
  cd.writeUInt32LE(data.length, 20); cd.writeUInt32LE(Buffer.byteLength(content), 24);
  cd.writeUInt16LE(nameBuf.length, 28); cd.writeUInt32LE(0, 42);
  const cdOffset = local.length + nameBuf.length + data.length;
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(1, 8); eocd.writeUInt16LE(1, 10);
  eocd.writeUInt32LE(cd.length + nameBuf.length, 12); eocd.writeUInt32LE(cdOffset, 16);
  return Buffer.concat([local, nameBuf, data, cd, nameBuf, eocd]);
}

describe('UCDP keyless GED CSV fallback', () => {
  it('candidates are newest-first .1 annual releases', () => {
    const c = buildGedCsvCandidates(new Date('2026-10-11T00:00:00Z'));
    assert.deepEqual(c.map((x) => x.version), ['26.1', '25.1', '24.1']);
    assert.equal(c[1].url, 'https://ucdp.uu.se/downloads/ged/ged251-csv.zip');
  });
  it('CSV parser handles quotes, embedded commas/newlines, CRLF and chunk splits', () => {
    const rows = [];
    const p = createCsvParser((r) => rows.push(r));
    const text = 'a,b,c\r\n1,"x,y","line1\nline2"\r\n2,"he said ""hi""",z\r\n';
    for (const ch of text) p.write(ch); // worst case: one char per chunk
    p.end();
    assert.deepEqual(rows, [['a', 'b', 'c'], ['1', 'x,y', 'line1\nline2'], ['2', 'he said "hi"', 'z']]);
  });
  it('reads a real deflated zip and filters by year', async () => {
    const csv = 'id,year,date_start,side_a,best\n1,2023,2023-01-01,A,5\n2,2025,2025-03-04,"B, C",7\n';
    const zip = makeZip('GEDEvent.csv', csv);
    assert.equal(readFirstZipEntry(zip).method, 8);
    const ev = await parseGedZip(zip, { minYear: 2024 });
    assert.equal(ev.length, 1);
    assert.equal(ev[0].side_a, 'B, C');
    assert.equal(ev[0].best, '7');
  });
});
