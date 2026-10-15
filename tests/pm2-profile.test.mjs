import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

test('PM2 profile points at a real entrypoint and restarts on exit', () => {
  const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
  const app = createRequire(import.meta.url)('../ecosystem.config.cjs').apps[0];
  assert.ok(existsSync(path.join(root, app.script)));
  assert.equal(app.autorestart, true);
  assert.ok(app.exp_backoff_restart_delay > 0);
});
