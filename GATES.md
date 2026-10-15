# Gates: national-statistics sources for grp and fiscal
G1 Per-country coverage report exists and is syntactically valid
  CHECK: node --check scripts/subnational-coverage-by-country.mjs && echo cov-ok
  EXPECT: cov-ok
G2 Every new provider is backed by a fixture test built from a real, user-downloaded sample (no invented values)
  CHECK: node --test tests/subnational-*.test.mjs 2>&1 | grep -E "^# (pass|fail)"
  EXPECT: # fail 0
G3 Source register lists each candidate with an honest status (verified / unverified / unusable) and a date
  CHECK: node -e "const t=require('fs').readFileSync('docs/NATIONAL_SOURCES.md','utf8');console.log(/Status: verified/.test(t)&&/Checked: 2026-10-14/.test(t)?'register-ok':'register-bad')"
  EXPECT: register-ok
G4 Existing sources re-checked for freshness: every provider's newest year is reported per country
  CHECK: node -e "console.log(require('fs').existsSync('scripts/subnational-freshness.mjs')?'fresh-ok':'fresh-missing')"
  EXPECT: fresh-ok
