// The MCP bundle inlines _registry.mjs, so import.meta.url no longer points at scripts/subnational. Simulate that: load
// the module from a copy outside the repo with cwd = repo root and check that the division JSON is still found.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

test('_registry.mjs finds divisions.json when it is not next to the module', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'reg-'));
  try {
    const copy = path.join(dir, 'registry-copy.mjs');
    copyFileSync('scripts/subnational/_registry.mjs', copy);
    const r = spawnSync(process.execPath, ['-e', `import(${JSON.stringify(copy.replace(/\\/g, '/'))}).then(m=>console.log('COUNT='+m.DIVISION_COUNT))`], { encoding: 'utf8', cwd: process.cwd() });
    assert.match(r.stdout, /COUNT=636/, r.stderr);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
