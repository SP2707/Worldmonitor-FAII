#!/usr/bin/env node
// Static egress audit: which hosts can the scheduled seeders contact, and is each one approved?
//   node scripts/audit-egress.mjs            report + exit 1 if any host is not in scripts/egress-allowlist.json
//   node scripts/audit-egress.mjs --list     print every host with the files that mention it
// Scope: the scripts named in scripts/seed-tiers.config.json plus scripts/shared, scripts/lib, scripts/providers, scripts/subnational and
// scripts/_seed-utils.mjs. It reads source text only (URL literals), so a host built at runtime from env or
// data is invisible to it; the sidecar (src-tauri/sidecar) is NOT scanned. It is a tripwire, not a proof.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const URL_RE = /https?:\/\/([A-Za-z0-9][A-Za-z0-9.-]*\.[A-Za-z]{2,})/g;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

export function extractHosts(text) {
  const out = new Set();
  for (const m of text.matchAll(URL_RE)) out.add(m[1].toLowerCase());
  return [...out];
}

/** Lines that put an e-mail address into a request identity header. */
export function identityLeaks(text) {
  return text.split(/\r?\n/).map((l, i) => ({ l, i: i + 1 })).filter(({ l }) => /user-agent|['"]from['"]|referer|x-contact/i.test(l) && EMAIL_RE.test(l)).map(({ i }) => i);
}

export function rawNetworkUsers(text) {
  return /from ['"]node:(net|tls|dgram)['"]|from ['"](net|tls|dgram)['"]|child_process/.test(text);
}

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out); else if (n.endsWith('.mjs')) out.push(p);
  }
  return out;
}

export function scopeFiles(root = ROOT) {
  const cfg = JSON.parse(readFileSync(join(root, 'scripts/seed-tiers.config.json'), 'utf8'));
  const files = new Set([join(root, 'scripts/_seed-utils.mjs')]);
  for (const tier of Object.values(cfg.tiers)) for (const e of tier) files.add(join(root, 'scripts', `${e.script}.mjs`));
  for (const d of ['scripts/shared', 'scripts/subnational', 'scripts/lib', 'scripts/providers']) if (existsSync(join(root, d))) walk(join(root, d)).forEach((f) => files.add(f));
  return [...files].filter((f) => existsSync(f));
}

export function audit({ root = ROOT, env = process.env } = {}) {
  const allow = JSON.parse(readFileSync(join(root, 'scripts/egress-allowlist.json'), 'utf8'));
  const approved = new Set(Object.keys(allow.approved));
  const hosts = new Map();
  const raw = []; const leaks = [];
  for (const f of scopeFiles(root)) {
    const text = readFileSync(f, 'utf8');
    for (const h of extractHosts(text)) { if (!hosts.has(h)) hosts.set(h, new Set()); hosts.get(h).add(basename(f)); }
    if (rawNetworkUsers(text)) raw.push(basename(f));
    const l = identityLeaks(text); if (l.length) leaks.push(`${basename(f)}:${l.join(',')}`);
  }
  const unapproved = [...hosts.keys()].filter((h) => !approved.has(h) && !(allow.upstreamGateway ?? []).includes(h)).sort();
  const sensitive = [...hosts.keys()].filter((h) => allow.sensitive?.[h]).sort().map((h) => ({ host: h, why: allow.sensitive[h], files: [...hosts.get(h)] }));
  const gatewayHosts = (allow.upstreamGateway ?? []).filter((h) => hosts.has(h));
  const apiBase = env.API_BASE_URL ?? '';
  for (const s of sensitive) {
    const m = /\[env: ([A-Z0-9_|]+)\]/.exec(s.why);
    s.status = m ? (m[1].split('|').some((k) => (env[k] ?? '').trim() !== '') ? 'KEY SET - active' : 'no key - inactive') : 'key requirement not determined';
  }
  const apiBaseLocal = /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:|\/|$)/.test(apiBase);
  return { hosts, unapproved, sensitive, gatewayHosts, apiBase, apiBaseLocal, raw: [...new Set(raw)].filter((f) => f !== 'tor-fetch.mjs').sort(), leaks };
}

if (process.argv[1]?.endsWith('audit-egress.mjs')) {
  // Same .env.local convention the seeders use, so API_BASE_URL and key status are judged as the seeders will see
  // them. The values go into a local object only (never into process.env) and are never printed.
  const env = { ...process.env };
  for (const f of ['.env', '.env.local']) {
    const p = join(ROOT, f);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/.exec(line);
      const v = m ? m[2].replace(/^['"]|['"]$/g, '') : '';
      if (m && !(m[1] in process.env) && v !== '') env[m[1]] = v;
    }
  }
  const r = audit({ env });
  if (process.argv.includes('--list')) for (const [h, fs] of [...r.hosts].sort()) console.log(h.padEnd(48), [...fs].slice(0, 3).join(', '));
  console.log(`hosts mentioned by scheduled seeders: ${r.hosts.size}`);
  let bad = 0;
  if (r.unapproved.length) { bad++; console.log(`\nFAIL ${r.unapproved.length} host(s) not in scripts/egress-allowlist.json (review, then approve or remove):\n  ${r.unapproved.join('\n  ')}`); }
  else console.log('PASS every host is on the allowlist');
  if (r.gatewayHosts.length) {
    if (r.apiBaseLocal) console.log(`PASS upstream gateway (${r.gatewayHosts.join(', ')}) is referenced, but API_BASE_URL is local (${r.apiBase})`);
    else { bad++; console.log(`FAIL upstream gateway (${r.gatewayHosts.join(', ')}) is referenced and API_BASE_URL is "${r.apiBase || '(unset)'}": seeders that default to it would call the hosted service. Set API_BASE_URL=http://127.0.0.1:46123 in .env.local.`); }
  }
  if (r.leaks.length) { bad++; console.log(`\nFAIL e-mail address inside an identity header: ${r.leaks.join(' ')}`); } else console.log('PASS no e-mail address in User-Agent/From/Referer lines');
  if (r.sensitive.length) { console.log('\nNOTE third-party services the seeders can send data to (key names are read from the environment, values are never printed):'); for (const s of r.sensitive) console.log(`  ${s.host.padEnd(28)} ${s.status.padEnd(30)} ${s.why.replace(/ \[env: [^\]]+\]/, '')}`); }
  if (r.raw.length) console.log(`\nNOTE these files use raw sockets or child processes; the Tor layer cannot see that traffic: ${r.raw.join(', ')}`);
  process.exit(bad ? 1 : 0);
}
