import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const dir = mkdtempSync(path.join(tmpdir(), 'sos-'));
process.env.LOCAL_REDIS_DATA_FILE = path.join(dir, 'redis.json');
delete process.env.LOCAL_REDIS_TOKEN;
const { server, store } = await import('../scripts/local-redis-rest.mjs');
const { classify, selectEntries, parseTiers, missingRequiredEnv, createRunner, SKIP_RE, backoffMs } = await import('../scripts/seed-on-start.mjs');

let redisUrl;
before(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  redisUrl = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((r) => server.close(r));
  rmSync(dir, { recursive: true, force: true });
});

test('classify uses the run-seeders.sh skip heuristic and order', () => {
  assert.equal(classify({ timedOut: false, code: 0, lastLine: 'done' }), 'OK');
  assert.equal(classify({ timedOut: false, code: 1, lastLine: 'boom' }), 'FAIL');
  assert.equal(classify({ timedOut: true, code: null, lastLine: 'x' }), 'TIMEOUT');
  for (const l of ['CLOUDFLARE_API_TOKEN not set — skipping', 'Skipping', 'missing FRED key', 'file Not Found'])
    assert.equal(classify({ timedOut: false, code: 0, lastLine: l }), 'SKIP', l);
  // like the shell script: skip pattern wins even on non-zero exit
  assert.equal(classify({ timedOut: false, code: 1, lastLine: 'API_KEY not set' }), 'SKIP');
  assert.equal(SKIP_RE.source, 'skip|not set|missing.*key|not found');
});

test('parseTiers / selectEntries / missingRequiredEnv', () => {
  assert.deepEqual(parseTiers(undefined), ['1', '2', '3', '4']);
  assert.deepEqual(parseTiers('1, 3,x'), ['1', '3']);
  const cfg = { excluded: { b: 'no' }, tiers: { 1: [{ script: 'a' }, { script: 'b' }], 3: [{ script: 'c' }] } };
  assert.deepEqual(selectEntries(cfg, ['1']).map((e) => e.name), ['a']);
  assert.deepEqual(selectEntries(cfg, ['1', '3']).map((e) => e.name), ['a', 'c']);
  assert.equal(missingRequiredEnv({ requiresAnyEnv: ['K1', 'K2'] }, { K2: 'v' }), null);
  assert.deepEqual(missingRequiredEnv({ requiresAnyEnv: ['K1'] }, { K1: ' ' }), ['K1']);
  assert.equal(missingRequiredEnv({}, {}), null);
});

function makeScripts(spec) {
  const d = path.join(dir, `scripts-${Math.random().toString(36).slice(2)}`);
  mkdirSync(d, { recursive: true });
  for (const [name, body] of Object.entries(spec)) writeFileSync(path.join(d, `${name}.mjs`), body);
  return d;
}

test('tiers, concurrency cap, failure isolation, timeout kill, env gating, freshness', async () => {
  const log = path.join(dir, 'conc.log');
  const track = (ms, tail) => `import fs from 'node:fs';fs.appendFileSync(${JSON.stringify(log)},'S '+Date.now()+'\\n');await new Promise(r=>setTimeout(r,${ms}));fs.appendFileSync(${JSON.stringify(log)},'E '+Date.now()+'\\n');${tail}`;
  const scriptsDir = makeScripts({
    ok1: track(300, "console.log('fine')"),
    ok2: track(300, "console.log('fine')"),
    ok3: track(300, "console.log('fine')"),
    bad: "console.error('kaboom'); process.exit(3)",
    skipper: "console.log('FOO_KEY not set — skipping'); process.exit(0)",
    hang: "setInterval(()=>{},1000)",
    gated: "console.log('should not run')",
    heavy: "console.log('tier3')",
  });
  const config = {
    defaults: { timeoutSec: 1, freshMinutes: 60, concurrency: 2 },
    tiers: {
      1: [{ script: 'ok1' }, { script: 'ok2' }, { script: 'ok3' }, { script: 'bad' }, { script: 'skipper' }, { script: 'hang' }],
      2: [{ script: 'gated', requiresAnyEnv: ['NO_SUCH_KEY'] }],
      3: [{ script: 'heavy' }],
    },
  };
  const statusFile = path.join(dir, 'status.json');
  const env = { ...process.env, UPSTASH_REDIS_REST_URL: redisUrl, UPSTASH_REDIS_REST_TOKEN: 't', SEED_REFRESH_MINUTES: '0' };
  delete env.NO_SUCH_KEY; env.SEED_TIERS = '1,2'; delete env.SEED_TIMEOUT_SECONDS;
  const quiet = () => {};

  const r1 = createRunner({ config, scriptsDir, statusFile, env, log: quiet });
  const t0 = Date.now();
  const st = await r1.pass();
  assert.equal(st.state, 'done');
  const s = st.seeders;
  assert.equal(s.ok1.result, 'OK'); assert.equal(s.ok2.result, 'OK'); assert.equal(s.ok3.result, 'OK');
  assert.equal(s.bad.result, 'FAIL'); assert.match(s.bad.lastLine, /kaboom/);
  assert.equal(s.skipper.result, 'SKIP');
  assert.equal(s.hang.result, 'TIMEOUT');
  assert.equal(s.gated.result, 'SKIP'); assert.match(s.gated.lastLine, /NO_SUCH_KEY/);
  assert.equal(s.heavy, undefined, 'a tier left out of SEED_TIERS is not run');
  assert.deepEqual({ OK: st.counts.OK, SKIP: st.counts.SKIP, FAIL: st.counts.FAIL, TIMEOUT: st.counts.TIMEOUT }, { OK: 3, SKIP: 2, FAIL: 1, TIMEOUT: 1 });
  // never more than 2 tracked seeders in flight
  let cur = 0, max = 0;
  for (const l of readFileSync(log, 'utf8').trim().split('\n')) { cur += l[0] === 'S' ? 1 : -1; max = Math.max(max, cur); }
  assert.ok(max <= 2, `max concurrent tracked seeders was ${max}`);
  assert.ok(Date.now() - t0 < 15000);
  assert.equal(JSON.parse(readFileSync(statusFile, 'utf8')).state, 'done');

  // second pass on the same data: OK seeders are fresh; FAIL/SKIP/TIMEOUT retry
  const r2 = createRunner({ config, scriptsDir, statusFile, env, log: quiet });
  const st2 = await r2.pass();
  assert.equal(st2.counts.FRESH, 3);
  assert.equal(st2.seeders.ok1.fresh, true);
  assert.equal(st2.seeders.bad.result, 'FAIL');

  // Redis lost its data (marker gone) => prior results are not trusted
  store.clear();
  const r3 = createRunner({ config, scriptsDir, statusFile, env, log: quiet });
  const st3 = await r3.pass();
  assert.equal(st3.counts.FRESH, 0);
  assert.equal(st3.counts.OK, 3);

  // SEED_TIERS=1,2,3 enables tier 3
  const r4 = createRunner({ config, scriptsDir, statusFile: path.join(dir, 's4.json'), env: { ...env, SEED_TIERS: '3' }, log: quiet });
  assert.equal((await r4.pass()).seeders.heavy.result, 'OK');
});

test('unreachable Redis: pass ends with an error, does not throw or hang', async () => {
  const scriptsDir = makeScripts({ a: "console.log('x')" });
  const r = createRunner({
    config: { tiers: { 1: [{ script: 'a' }] } }, scriptsDir, statusFile: path.join(dir, 's5.json'),
    env: { ...process.env, UPSTASH_REDIS_REST_URL: 'http://127.0.0.1:9', UPSTASH_REDIS_REST_TOKEN: 't' },
    redisWaitMs: 800, log: () => {},
  });
  const st = await r.pass();
  assert.equal(st.state, 'done');
  assert.equal(st.error, 'redis-unreachable');
});

test('silent exit-0 is NOOP; requiresEnv needs every variable; backoff doubles up to a cap', () => {
  assert.equal(classify({ timedOut: false, code: 0, lastLine: '' }), 'NOOP');
  assert.equal(missingRequiredEnv({ requiresEnv: ['A', 'B'] }, { A: 'x' })[0], 'B');
  assert.equal(missingRequiredEnv({ requiresEnv: ['A', 'B'] }, { A: 'x', B: 'y' }), null);
  assert.equal(backoffMs(1), 15 * 60_000);
  assert.equal(backoffMs(3), 60 * 60_000);
  assert.equal(backoffMs(30), 24 * 3_600_000);
});

test('failing and silent seeders back off, then retry and recover', async () => {
  const flag = path.join(dir, 'flaky.flag');
  const scriptsDir = makeScripts({
    bad: "console.error('boom'); process.exit(3)",
    silent: 'void 0',
    flaky: `import fs from 'node:fs';if(fs.existsSync(${JSON.stringify(flag)})){console.log('recovered')}else{fs.writeFileSync(${JSON.stringify(flag)},'1');console.error('first try fails');process.exit(1)}`,
  });
  const config = { defaults: { timeoutSec: 5, freshMinutes: 60, concurrency: 2 }, tiers: { 1: [{ script: 'bad' }, { script: 'silent' }, { script: 'flaky' }] } };
  const statusFile = path.join(dir, 'backoff.json');
  const env = { ...process.env, UPSTASH_REDIS_REST_URL: redisUrl, UPSTASH_REDIS_REST_TOKEN: 't', SEED_REFRESH_MINUTES: '0' };
  delete env.SEED_TIERS; delete env.SEED_TIMEOUT_SECONDS;
  const quiet = () => {};

  const st1 = await createRunner({ config, scriptsDir, statusFile, env, log: quiet }).pass();
  assert.deepEqual([st1.seeders.bad.result, st1.seeders.silent.result, st1.seeders.flaky.result], ['FAIL', 'NOOP', 'FAIL']);
  assert.deepEqual([st1.seeders.bad.fails, st1.seeders.silent.fails, st1.seeders.flaky.fails], [1, 1, 1]);

  // immediately again: all three are inside their 15-minute backoff and are not re-run
  const st2 = await createRunner({ config, scriptsDir, statusFile, env, log: quiet }).pass();
  assert.equal(st2.counts.BACKOFF, 3);
  assert.equal(st2.seeders.bad.fails, 1);

  // 20 minutes later they are retried: persistent failures count up, the flaky one recovers
  const later = () => Date.now() + 20 * 60_000;
  const st3 = await createRunner({ config, scriptsDir, statusFile, env, log: quiet, now: later }).pass();
  assert.equal(st3.counts.BACKOFF, 0);
  assert.equal(st3.seeders.bad.fails, 2);
  assert.equal(st3.seeders.silent.fails, 2);
  assert.equal(st3.seeders.flaky.result, 'OK');
  assert.equal(st3.seeders.flaky.fails, undefined);
});

test('RAM guard: no seeder starts above the limit, the next pass runs normally', async () => {
  const scriptsDir = makeScripts({ a: "console.log('ran a')", b: "console.log('ran b')" });
  const config = { defaults: { timeoutSec: 5, freshMinutes: 60, concurrency: 2 }, tiers: { 1: [{ script: 'a' }, { script: 'b' }] } };
  const statusFile = path.join(dir, 'ram.json');
  const env = { ...process.env, UPSTASH_REDIS_REST_URL: redisUrl, UPSTASH_REDIS_REST_TOKEN: 't', SEED_REFRESH_MINUTES: '0' };
  delete env.SEED_TIERS; delete env.SEED_TIMEOUT_SECONDS; delete env.SEED_MAX_RAM_FRACTION;
  const st1 = await createRunner({ config, scriptsDir, statusFile, env, log: () => {}, memUsedFraction: () => 0.95, memWaitMs: 20 }).pass();
  assert.equal(st1.error, 'memory-pressure');
  assert.deepEqual(Object.keys(st1.seeders), []);
  const st2 = await createRunner({ config, scriptsDir, statusFile, env, log: () => {}, memUsedFraction: () => 0.5 }).pass();
  assert.equal(st2.error, undefined);
  assert.equal(st2.counts.OK, 2);
  const frac = (await import('../scripts/seed-on-start.mjs')).systemMemUsedFraction();
  assert.ok(frac > 0 && frac < 1, `fraction ${frac}`);
});

test('least recently run seeders go first, so a RAM-cut pass cannot starve the same ones', async () => {
  const logFile = path.join(dir, 'order.log');
  const mk = (n) => `import fs from 'node:fs';fs.appendFileSync(${JSON.stringify(logFile)},'${n}\\n');console.log('ran ${n}')`;
  const scriptsDir = makeScripts({ a: mk('a'), b: mk('b'), c: mk('c') });
  const config = { defaults: { timeoutSec: 5, freshMinutes: 60, concurrency: 1 }, tiers: { 1: [{ script: 'a' }, { script: 'b' }, { script: 'c' }] } };
  const statusFile = path.join(dir, 'order.json');
  const ago = (h) => new Date(Date.now() - h * 3_600_000).toISOString();
  const env = { ...process.env, UPSTASH_REDIS_REST_URL: redisUrl, UPSTASH_REDIS_REST_TOKEN: 't', SEED_REFRESH_MINUTES: '0', SEED_CONCURRENCY: '1' };
  delete env.SEED_TIERS; delete env.SEED_TIMEOUT_SECONDS;
  // marker must match Redis or prior results are distrusted; the order logic does not depend on trust
  writeFileSync(statusFile, JSON.stringify({ seeders: { a: { tier: 1, result: 'OK', finishedAt: ago(5) }, b: { tier: 1, result: 'OK', finishedAt: ago(3) } } }));
  await createRunner({ config, scriptsDir, statusFile, env, log: () => {} }).pass();
  assert.deepEqual(readFileSync(logFile, 'utf8').trim().split('\n'), ['c', 'a', 'b']);
});

test('nodeFlagsFor adds --experimental-sqlite only for history-snapshot on Node 22.5-22.12', async () => {
  const { nodeFlagsFor } = await import('../scripts/seed-on-start.mjs');
  assert.deepEqual(nodeFlagsFor('/x/scripts/history-snapshot.mjs', '22.11.0'), ['--experimental-sqlite']);
  assert.deepEqual(nodeFlagsFor('/x/scripts/history-snapshot.mjs', '22.13.0'), []);
  assert.deepEqual(nodeFlagsFor('/x/scripts/history-snapshot.mjs', '24.1.0'), []);
  assert.deepEqual(nodeFlagsFor('/x/scripts/history-snapshot.mjs', '20.10.0'), []);
  assert.deepEqual(nodeFlagsFor('/x/scripts/seed-earthquakes.mjs', '22.11.0'), []);
});
