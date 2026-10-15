import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { extractHosts, identityLeaks, rawNetworkUsers, audit } from '../scripts/audit-egress.mjs';

function fixture({ seeder, allow, tiers }) {
  const root = mkdtempSync(join(tmpdir(), 'egress-'));
  mkdirSync(join(root, 'scripts/shared'), { recursive: true });
  mkdirSync(join(root, 'scripts/subnational'), { recursive: true });
  writeFileSync(join(root, 'scripts/_seed-utils.mjs'), '// none\n');
  writeFileSync(join(root, 'scripts/seed-a.mjs'), seeder);
  writeFileSync(join(root, 'scripts/seed-tiers.config.json'), JSON.stringify(tiers ?? { tiers: { fast: [{ script: 'seed-a' }] } }));
  writeFileSync(join(root, 'scripts/egress-allowlist.json'), JSON.stringify(allow));
  return root;
}

test('extractHosts finds distinct lower-cased hosts', () => {
  assert.deepEqual(extractHosts("fetch('https://API.Example.org/x'); 'http://a.b.com/y' 'https://API.example.org/z'").sort(), ['a.b.com', 'api.example.org']);
});

test('identityLeaks flags only e-mail addresses inside identity headers', () => {
  assert.deepEqual(identityLeaks("const a = 1;\n'User-Agent': 'wm (me@example.com)'\nconst b = 'me@example.com';\n"), [2]);
  assert.deepEqual(identityLeaks("'User-Agent': 'worldmonitor-seeder'"), []);
});

test('rawNetworkUsers detects net/tls/child_process imports', () => {
  assert.equal(rawNetworkUsers("import net from 'node:net';"), true);
  assert.equal(rawNetworkUsers("import { spawn } from 'child_process';"), true);
  assert.equal(rawNetworkUsers("import { x } from './y.mjs';"), false);
});

test('audit passes when every host is approved and the gateway is local', () => {
  const root = fixture({ seeder: "fetch('https://good.example.org/a'); fetch('https://worldmonitor.app/x');", allow: { approved: { 'good.example.org': 'ok' }, upstreamGateway: ['worldmonitor.app'] } });
  try {
    const r = audit({ root, env: { API_BASE_URL: 'http://127.0.0.1:46123' } });
    assert.deepEqual(r.unapproved, []);
    assert.equal(r.apiBaseLocal, true);
    assert.deepEqual(r.gatewayHosts, ['worldmonitor.app']);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('audit reports an unknown host and a non-local gateway', () => {
  const root = fixture({ seeder: "fetch('https://surprise.example.net/a'); fetch('https://worldmonitor.app/x');", allow: { approved: {}, upstreamGateway: ['worldmonitor.app'] } });
  try {
    const r = audit({ root, env: { API_BASE_URL: 'https://worldmonitor.app' } });
    assert.deepEqual(r.unapproved, ['surprise.example.net']);
    assert.equal(r.apiBaseLocal, false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('audit key status reads env names only and never exposes values', () => {
  const root = fixture({ seeder: "fetch('https://keyed.example.org/a');", allow: { approved: { 'keyed.example.org': 'x' }, sensitive: { 'keyed.example.org': 'sends query to vendor [env: KEYED_A|KEYED_B]' } } });
  try {
    const off = audit({ root, env: {} });
    assert.equal(off.sensitive[0].status, 'no key - inactive');
    const on = audit({ root, env: { KEYED_B: 'secret-value' } });
    assert.equal(on.sensitive[0].status, 'KEY SET - active');
    assert.ok(!JSON.stringify(on).includes('secret-value'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('audit flags an e-mail in an identity header', () => {
  const root = fixture({ seeder: "const h = { 'User-Agent': 'wm (a@b.com)' };", allow: { approved: {} } });
  try { assert.equal(audit({ root, env: {} }).leaks.length, 1); } finally { rmSync(root, { recursive: true, force: true }); }
});
