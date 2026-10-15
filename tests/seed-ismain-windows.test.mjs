import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// `import.meta.url === \`file://${process.argv[1]}\`` never matches on Windows (backslashes, no third slash),
// so the script's main block silently never runs and the seeder reports success without seeding.
test('no seeder compares import.meta.url to a hand-built file:// string', () => {
  const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'scripts');
  const bad = readdirSync(dir)
    .filter((f) => /^(seed|warm)-.*\.mjs$/.test(f))
    .filter((f) => /import\.meta\.url\s*===\s*`file:\/\/\$\{process\.argv\[1\]\}`/.test(readFileSync(path.join(dir, f), 'utf8')));
  assert.deepEqual(bad, []);
});
