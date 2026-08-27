import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// UNIFIED-ENGINE CHANGE: no Dodo Payments webhook exists in this build to
// keep the local user's entitlements row alive — see
// convex/entitlements.ts::ensureLocalEntitlement for why a seeded row (not a
// hardcoded bypass) is the right fix here. Self-healing hourly backstop; run
// it manually once after first deploy for instant effect instead of waiting
// up to an hour for the first tick.
crons.hourly(
  "ensure-local-entitlement",
  { minuteUTC: 5 },
  internal.entitlements.ensureLocalEntitlement,
  {},
);

crons.hourly(
  "cleanup-expired-pairing-tokens",
  { minuteUTC: 27 },
  internal.telegramPairingTokens.cleanupExpired,
);

// Bounded recovery for Company Monitoring purge generations whose scheduled
// continuation was dropped. The mutation independently enforces the ordinary
// lapse purgeAfter deadline, so an hourly wake cannot bypass the 24h grace.
crons.hourly(
  "company-monitoring-stalled-purge-reaper",
  { minuteUTC: 37 },
  internal.companyMonitoring.accounts.reapStalledAccountPurges,
  {},
);

// Company Monitoring account roots are provisioned on first use and are no
// longer touched by entitlement writes (#6256), so lapses are pulled here
// instead of pushed from billing. Scanning only companyMonitoringAccounts means
// this costs nothing for the subscribers who never use the feature. The 24h
// purgeAfter grace still applies downstream, so detection latency of one tick
// is absorbed by a window that already exists.
crons.hourly(
  "company-monitoring-entitlement-reconciler",
  { minuteUTC: 47 },
  internal.companyMonitoring.accounts.reconcileAccountEntitlements,
  {},
);

// Retention sweep for the preference-write rate limiter (#6706). The limiter
// used to drop expired-window rows inline on every write, which widened that
// mutation's OCC read set from one counter row to the caller's entire row set
// and livelocked users writing from two tabs. Collecting them here keeps the
// write path's read set at exactly the current window. Hourly, not daily: a
// user writing continuously produces one row per 60s window, so an hourly tick
// bounds the table at ~60 rows per active user instead of ~1440.
crons.hourly(
  "user-prefs-rate-limit-prune",
  { minuteUTC: 52 },
  internal.userPreferences.pruneStaleWriteRateLimits,
  {},
);

// Daily retention prune for the append-only historical intelligence store
// (#5694). The table has no natural ceiling — every seeder run appends the
// events it published — and each row carries a 512-float vector, so the
// vector index is the real cost being bounded here. Ages rows past
// INTEL_HISTORY_RETENTION_DAYS out by `ingestedAt` in bounded per-run
// batches that self-drain. Also drains expired retraction tombstones
// (#5743) in the same pass, by `retractedAt` — a handful of hand-created
// rows do not justify a second scheduled function. See `prune` in
// convex/intelHistory.ts. 04:30 UTC sits between the plan-limit prune
// (04:45) and the wave-runs cleanup (04:00) so the three delete-heavy jobs
// never overlap.
crons.daily(
  "intel-history-prune",
  { hourUTC: 4, minuteUTC: 30 },
  internal.intelHistory.prune,
  {},
);

// Idempotent daily seed of the `followedCountriesShards` lock table
// (Codex round-4 P0 v2). Skips existing shards; inserts any missing
// shard ids in `[0, SHARD_COUNT)`. Defends against a deploy-time seed
// step being skipped — every `followCountry` / `unfollowCountry` /
// `mergeAnonymousLocal` mutation throws SHARDS_NOT_SEEDED if its shard
// row is missing, so the cron is the steady-state self-heal. Cheap:
// post-seed it just runs a 64-row collect + skip-loop.
crons.daily(
  "followed-countries-shards-seed",
  { hourUTC: 3, minuteUTC: 0 },
  internal.followedCountries._seedShards,
);

// Daily dedupe pass for the `followedCountriesShards` table. Pairs with
// `_seedShards` above: a concurrent-seed race (e.g. the deploy step
// running in parallel with the cron tick) can produce duplicate rows
// for the same `shardId`. `readShardOrThrow` uses `.first()` so
// duplicates don't break correctness, but they degrade OCC contention
// coverage for users hashing to that shard. Running the dedupe in the
// same daily slot, 1 minute after the seed, guarantees the table is
// back to exactly SHARD_COUNT rows within 24h of any race. Idempotent
// in the steady-state (no duplicates → no deletes).
crons.daily(
  "followed-countries-shards-dedupe",
  { hourUTC: 3, minuteUTC: 1 },
  internal.followedCountries._dedupeShards,
);

crons.daily(
  "followed-countries-country-locks-seed",
  { hourUTC: 3, minuteUTC: 2 },
  internal.followedCountries._seedCountryLocks,
);

crons.daily(
  "followed-countries-country-locks-dedupe",
  { hourUTC: 3, minuteUTC: 3 },
  internal.followedCountries._dedupeCountryLocks,
);

export default crons;
