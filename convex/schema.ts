import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  channelTypeValidator,
  digestModeValidator,
  quietHoursOverrideValidator,
  sensitivityValidator,
} from "./constants";
import {
  companyMonitoringCompleteReceiptValidator,
  companyMonitoringCandidateStateValidator,
  companyMonitoringCandidateTerminalReasonValidator,
  companyMonitoringAdmissionAuthorityValidator,
  companyMonitoringAdmissionClassificationValidator,
  companyMonitoringAdmissionConfidenceFloorsValidator,
  companyMonitoringEvidenceAuthorityValidator,
  companyMonitoringEvidenceIndependenceValidator,
  companyMonitoringEvidenceProviderValidator,
  companyMonitoringEvidenceStateValidator,
  companyMonitoringNonReassuringReasonValidator,
  companyMonitoringNonReassuringReceiptValidator,
  companyMonitoringScanSourceValidator,
  companyMonitoringXAllowedUseValidator,
  companyMonitoringXAuthorityRoleValidator,
  companyMonitoringXContentStateValidator,
  companyMonitoringXDemotionReasonValidator,
  companyMonitoringXStorageStateValidator,
} from "./companyMonitoring/validators";

const companyMonitoringObligationIdentity = {
  obligationId: v.string(),
  ownerAccountId: v.string(),
  companyId: v.string(),
  source: companyMonitoringScanSourceValidator,
  queryVersion: v.string(),
  dueAt: v.number(),
  checkpoint: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
};

const companyMonitoringWorkIdentity = {
  workId: v.string(),
  workKey: v.string(),
  ownerAccountId: v.string(),
  cohortKey: v.string(),
  source: companyMonitoringScanSourceValidator,
  windowStart: v.number(),
  windowEnd: v.number(),
  queryVersion: v.string(),
  scheduledDueAt: v.number(),
  selectionDueAt: v.number(),
  resultCap: v.number(),
  attemptCount: v.number(),
  createdAt: v.number(),
  updatedAt: v.number(),
};

export default defineSchema({
  userPreferences: defineTable({
    userId: v.string(),
    variant: v.string(),
    data: v.any(),
    schemaVersion: v.number(),
    updatedAt: v.number(),
    syncVersion: v.number(),
  }).index("by_user_variant", ["userId", "variant"]),

  userPreferenceWriteRateLimits: defineTable({
    userId: v.string(),
    windowStart: v.number(),
    count: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_window", ["userId", "windowStart"])
    // Retention scan for `pruneStaleWriteRateLimits` (#6706). Expired-window
    // rows are garbage-collected off the write path, so the sweep needs a
    // cross-user range on age alone; without it the prune would be a full
    // table scan whose read set collides with every live counter.
    .index("by_windowStart", ["windowStart"]),

  notificationChannels: defineTable(
    v.union(
      v.object({
        userId: v.string(),
        channelType: v.literal("telegram"),
        chatId: v.string(),
        verified: v.boolean(),
        linkedAt: v.number(),
      }),
      v.object({
        userId: v.string(),
        channelType: v.literal("slack"),
        webhookEnvelope: v.string(),
        verified: v.boolean(),
        linkedAt: v.number(),
        slackChannelName: v.optional(v.string()),
        slackTeamName: v.optional(v.string()),
        slackConfigurationUrl: v.optional(v.string()),
      }),
      v.object({
        userId: v.string(),
        channelType: v.literal("email"),
        email: v.string(),
        verified: v.boolean(),
        linkedAt: v.number(),
      }),
      v.object({
        userId: v.string(),
        channelType: v.literal("discord"),
        webhookEnvelope: v.string(),
        verified: v.boolean(),
        linkedAt: v.number(),
        discordGuildId: v.optional(v.string()),
        discordChannelId: v.optional(v.string()),
      }),
      v.object({
        userId: v.string(),
        channelType: v.literal("webhook"),
        webhookEnvelope: v.string(),
        verified: v.boolean(),
        linkedAt: v.number(),
        webhookLabel: v.optional(v.string()),
        webhookSecret: v.optional(v.string()),
      }),
      // Web Push (Phase 6). endpoint+p256dh+auth are the standard
      // PushSubscription identity triple — not secrets, just per-device
      // pairing material (they identify the browser's push endpoint at
      // Mozilla/Google/Apple). Stored plaintext to match the rest of
      // this table. userAgent is cosmetic: lets the settings UI show
      // "Chrome · MacOS" next to the Remove button so users can tell
      // which device a subscription belongs to.
      v.object({
        userId: v.string(),
        channelType: v.literal("web_push"),
        endpoint: v.string(),
        p256dh: v.string(),
        auth: v.string(),
        verified: v.boolean(),
        linkedAt: v.number(),
        userAgent: v.optional(v.string()),
      }),
    ),
  )
    .index("by_user", ["userId"])
    .index("by_user_channel", ["userId", "channelType"]),

  alertRules: defineTable({
    userId: v.string(),
    variant: v.string(),
    enabled: v.boolean(),
    eventTypes: v.array(v.string()),
    sensitivity: sensitivityValidator,
    channels: v.array(channelTypeValidator),
    updatedAt: v.number(),
    quietHoursEnabled: v.optional(v.boolean()),
    quietHoursStart: v.optional(v.number()),
    quietHoursEnd: v.optional(v.number()),
    quietHoursTimezone: v.optional(v.string()),
    quietHoursOverride: v.optional(quietHoursOverrideValidator),
    // Digest mode fields (absent = realtime, same as digestMode: "realtime")
    digestMode: v.optional(digestModeValidator),
    digestHour: v.optional(v.number()),       // 0-23 local hour for daily/twice_daily
    digestTimezone: v.optional(v.string()),   // IANA timezone, e.g. "America/New_York"
    aiDigestEnabled: v.optional(v.boolean()), // opt-in AI executive summary in digests (default true for new rules)
    // Optional country-scope (ISO-3166 alpha-2). Empty/absent → all countries (current behavior).
    countries: v.optional(v.array(v.string())),
    // Optional watchlist ticker-scope (#4922 U3, e.g. ["AAPL", "RELIANCE.NS"]).
    // Unlike `countries`, this is OPT-IN scoped: empty/absent → the rule
    // receives NO `watchlist_story_alert` events (the relay requires a
    // non-empty intersection with the story's tickers).
    tickers: v.optional(v.array(v.string())),
  })
    .index("by_user", ["userId"])
    .index("by_user_variant", ["userId", "variant"])
    .index("by_enabled", ["enabled"]),

  // ────────────────────────────────────────────────────────────────────────
  // Followed countries (watchlist primitive). See
  // docs/plans/2026-05-02-001-feat-followed-countries-watchlist-primitive-plan.md
  // (U12). One row per (userId, country) follow; uniqueness is enforced by
  // the `followCountry` mutation via the `by_user_country` index check, NOT
  // by Convex schema (Convex does not support unique constraints).
  //
  // `country` is a canonical ISO 3166-1 alpha-2 code (uppercase, e.g. "US",
  // "GB", "JP"). Validation against the canonical alpha-2 registry happens
  // at the mutation boundary (U13: `convex/lib/iso2.ts::isValidIso2`).
  followedCountries: defineTable({
    userId: v.string(),
    country: v.string(),
    addedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_country", ["country"])
    .index("by_user_country", ["userId", "country"]),

  // Aggregate-counter table for `countFollowers`. One row per country, kept
  // in lockstep with `followedCountries` row inserts/deletes by the
  // followCountry/unfollowCountry/mergeAnonymousLocal mutations (atomic
  // patch within the same Convex mutation transaction). Lets the public
  // `countFollowers` query be O(1) instead of O(n) per call. The privacy
  // floor (`COUNTRY_COUNT_PRIVACY_FLOOR`) is applied at read time in the
  // query, not at write time — the row stores the true count.
  followedCountriesCounts: defineTable({
    country: v.string(),
    count: v.number(),
    updatedAt: v.number(),
  }).index("by_country", ["country"]),

  // Pre-seeded per-country lock table for aggregate counter writes.
  // The user shard lock only serializes mutations by user; first-ever
  // follows of the same country by different users need an existing
  // country-scoped document for Convex OCC to serialize the lazy
  // `followedCountriesCounts` row creation/update path. One row is seeded
  // for each valid ISO-2 code, and every counter +/- operation reads and
  // patches the row for that country in the same transaction.
  followedCountriesCountryLocks: defineTable({
    country: v.string(),
    lastTouchedAt: v.number(),
  }).index("by_country", ["country"]),

  // Per-user serialization document for the followed-countries watchlist.
  // EVERY mutation that mutates `followedCountries` for a user reads AND
  // writes this row, forcing Convex's per-document OCC to serialize
  // concurrent same-user mutations. Without this, two parallel
  // `followCountry` calls from the same user can both pass the cap check
  // (Convex OCC tracks reads at the document level, not at the index-range
  // level), both insert, and bypass the cap. The denormalized `count`
  // also lets the cap check be O(1) instead of O(n) — happy side effect.
  //
  // Invariant: `count` MUST equal the row count of `followedCountries`
  // for `userId`. The mutations are the only writers; tests assert this
  // parity after every operation. See plan U13 / Codex round-3 P0
  // (run 20260502-195816-dae403d7).
  //
  // KEY CAVEAT (Codex round-4 P0 v2): this row is created LAZILY on the
  // first mutation, so its OCC alone does NOT close a brand-new user's
  // race — two parallel first-ever mutations would both read empty and
  // both insert, producing duplicate meta rows. The fix is the pre-seeded
  // `followedCountriesShards` table below: every mutation reads + patches
  // the shard row at `userIdToShard(userId)` BEFORE this lazy-create can
  // happen, and Convex's OCC on the shard row serializes the two parallel
  // mutations so the second one observes the first's user-meta insert.
  followedCountriesUserMeta: defineTable({
    userId: v.string(),
    count: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Pre-seeded sharded lock table for the followed-countries watchlist
  // (Codex round-4 P0 v2). One row per shard id `0..SHARD_COUNT-1`.
  // Mapped to via `convex/lib/shards.ts::userIdToShard(userId)`, a
  // deterministic non-cryptographic hash. Every mutation that touches
  // `followedCountries` for a user reads the shard row at the top of the
  // handler AND patches `lastTouchedAt` at the end — that read+write pair
  // is what triggers Convex's per-document OCC to serialize concurrent
  // same-user mutations. Because rows are pre-seeded (never lazily
  // created), there is no TOCTOU window: the loser of an OCC race retries
  // against the post-winner state, sees the user-meta row the winner
  // inserted, and proceeds correctly.
  //
  // SHARD_COUNT is fixed at deploy time. Re-seeding requires draining
  // in-flight mutations; do not change without an operator runbook.
  // Seeding is idempotent — `_seedShards` skips existing rows. A daily
  // cron + manual operator mutation guarantee the table stays seeded.
  followedCountriesShards: defineTable({
    shardId: v.number(),
    lastTouchedAt: v.number(),
  }).index("by_shard", ["shardId"]),

  telegramPairingTokens: defineTable({
    userId: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    used: v.boolean(),
    variant: v.optional(v.string()),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    organization: v.optional(v.string()),
    phone: v.optional(v.string()),
    message: v.optional(v.string()),
    source: v.string(),
    receivedAt: v.number(),
    normalizedEmail: v.optional(v.string()),
  }).index("by_normalized_email_received", ["normalizedEmail", "receivedAt"]),

  entitlements: defineTable({
    userId: v.string(),
    planKey: v.string(),
    features: v.object({
      tier: v.number(),
      maxDashboards: v.number(),
      apiAccess: v.boolean(),
      apiRateLimit: v.number(),
      planLimits: v.optional(v.object({
        apiRequestsPerDay: v.union(v.number(), v.null()),
        apiBurstRequestsPerMinute: v.union(v.number(), v.null()),
        mcpCallsPerDay: v.union(v.number(), v.null()),
        // Optional for entitlement rows written before the dashboard-AI
        // dimension existed; the read-time catalog merge supplies it.
        dashboardAiCallsPerDay: v.optional(v.union(v.number(), v.null())),
        mcpBurstRequestsPerMinute: v.union(v.number(), v.null()),
      })),
      prioritySupport: v.boolean(),
      exportFormats: v.array(v.string()),
      // Optional for backward-compat with existing rows written before
      // plan 2026-05-10-001 (Pro MCP). Dodo webhooks repopulate this on
      // the next subscription event; legacy rows return undefined and
      // every consumer treats undefined as "no MCP access" (fail-closed).
      mcpAccess: v.optional(v.boolean()),
      // Optional — per-account daily REST allowance (#3199). Legacy rows
      // predate it; the rate-limit consumer treats undefined as "no daily
      // limit" (fail-OPEN). Catalog-sourced writes always set it, so this
      // validator MUST accept it or the webhook's entitlement write is
      // rejected (v.object is strict on extra keys).
      apiDailyAllowance: v.optional(v.number()),
      // Optional — data-export entitlement (plan 2026-07-25-001). Legacy rows
      // predate it; consumers treat undefined on a tier >= 2 row as entitled
      // (fail-OPEN, permanently — see the PlanFeatures JSDoc). Catalog-sourced
      // writes always set it, so this validator MUST accept it.
      dataExport: v.optional(v.boolean()),
    }),
    validUntil: v.number(),
    // Optional complimentary-entitlement floor. When set and in the future,
    // subscription.expired events skip the normal downgrade-to-free so
    // goodwill credits outlive Dodo subscription cancellations.
    compUntil: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_validUntil", ["validUntil"]),

  // Canonical per-Clerk-user record. Populated on first authenticated session
  // by client → `users:ensureRecord` (see convex/users.ts), and server-side at
  // checkout start by `users:recordTermsAcceptance` — which INSERTS when no row
  // exists, because a /pro buyer may never have run ensureRecord (pro-test has
  // no Convex client). Distinct from
  // `customers` (which is paid-only, populated by Dodo subscription webhook):
  // `users` covers EVERY Clerk-authenticated user, free or paid. Holds
  // operational properties used for product personalization and broadcast
  // audience filtering — locale, timezone, country, first/last seen.
  //
  // ⚠️ Authority of `country`: client-reported (derived from a `cf-ipcountry`
  // cookie or similar). NOT authoritative. Do NOT use for compliance, geo-
  // gating, or anything where a malicious client could spoof a different
  // country to gain or evade something. Server-side derivation (Vercel edge
  // wrapper reading `cf-ipcountry` from the actual request headers) is a
  // future v2 concern; v1 just stores what the client passes for analytics
  // use only.
  users: defineTable({
    userId: v.string(), // Clerk userId; primary identifier
    email: v.optional(v.string()), // Server-derived from ctx.auth.getUserIdentity()
    normalizedEmail: v.optional(v.string()), // Lowercased mirror of email; joined against registrations
    localeTag: v.optional(v.string()), // Full BCP 47 tag (e.g. "zh-CN", "en-US"); kept for future analytics
    localePrimary: v.optional(v.string()), // Lowercased primary subtag (e.g. "zh", "en"); broadcast filter target
    timezone: v.optional(v.string()), // IANA zone (e.g. "Asia/Shanghai")
    country: v.optional(v.string()), // ISO 3166-1 alpha-2; CLIENT-REPORTED — see warning above
    firstSeenAt: v.number(),
    lastSeenAt: v.number(),
    // Terms-of-service assent (#6976). Written at the two moments the user is
    // actually shown the documents: account creation, and checkout start (the
    // assent line sits immediately above every CTA). Both write the version
    // read from `shared/legal.ts` server-side, so no client can record a
    // version that was never in effect, and every recorded version resolves to
    // an archived snapshot under docs/legal/.
    //
    // OPTIONAL, and deliberately not backfilled: users who predate #6976 were
    // never shown an assent surface, and claiming otherwise would be worse than
    // an empty column. They fill in on their next checkout.
    termsAcceptedAt: v.optional(v.number()),
    termsVersion: v.optional(v.string()), // ISO date, e.g. "2026-08-20"
    // Set once, never overwritten (#6983). `termsAcceptedAt` moves to the
    // newest acceptance, so without this the date of the acceptance that
    // actually formed the agreement is destroyed by the first version bump —
    // and it cannot be reconstructed afterwards. The bump in #6983
    // (2026-07-27 → 2026-08-20) is the first one that would have done it.
    termsFirstAcceptedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_normalizedEmail", ["normalizedEmail"])
    .index("by_localePrimary", ["localePrimary"]),

  // Company Monitoring's account root. Imports are replayed from company-row
  // idempotency fields, and purge progress lives on this root. Provider tables
  // below remain account-prefixed so destructive purge never scans globally.
  companyMonitoringAccounts: defineTable({
    logicalAccountId: v.string(),
    ownerUserId: v.optional(v.string()),
    ownerFenceHash: v.string(),
    lifecycle: v.union(
      v.literal("entitled"),
      v.literal("entitlement_lapsed"),
      v.literal("denied"),
    ),
    terminalReason: v.optional(v.union(v.literal("owner_deleted"), v.literal("account_deleted"))),
    entitlementDigest: v.optional(v.string()),
    lifecycleSequence: v.number(),
    companyCount: v.optional(v.number()),
    companyLimit: v.optional(v.number()),
    snapshotGeneration: v.optional(v.number()),
    purgeGeneration: v.number(),
    purgePhase: v.union(
      v.literal("none"),
      v.literal("pending"),
      v.literal("scan"),
      v.literal("companies"),
      v.literal("finalizing"),
      v.literal("complete"),
    ),
    destructivePurgeStarted: v.boolean(),
    pendingReactivation: v.boolean(),
    // Legacy accounts remain unstamped until every company page has had its
    // customer claim policy and current-name alias repaired. Provider rollout
    // gates fail closed on a missing or older version.
    claimPolicyVersion: v.optional(v.number()),
    // Durable orchestration cursors. Claims always begin from these indexed
    // account fields and read only a fixed page; work/company tables are never
    // scanned globally to discover due customer work.
    nextExaScanDueAt: v.optional(v.number()),
    nextXScanDueAt: v.optional(v.number()),
    purgeAfter: v.optional(v.number()),
    purgeCursor: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_logicalAccountId", ["logicalAccountId"])
    .index("by_ownerUserId", ["ownerUserId"])
    .index("by_ownerFenceHash", ["ownerFenceHash"])
    .index("by_purgePhase_updatedAt", ["purgePhase", "updatedAt"])
    // Consumer: accounts.reconcileAccountEntitlements. Entitlement writes no
    // longer push lapses (#6256), so the reconciler pulls them by scanning
    // entitled roots oldest-first.
    .index("by_lifecycle_updatedAt", ["lifecycle", "updatedAt"])
    .index("by_lifecycle_nextExaScanDueAt", ["lifecycle", "nextExaScanDueAt"])
    .index("by_lifecycle_nextXScanDueAt", ["lifecycle", "nextXScanDueAt"]),

  companyMonitoringCompanies: defineTable({
    ownerAccountId: v.string(),
    companyId: v.string(),
    name: v.optional(v.string()),
    sortName: v.optional(v.string()),
    domicileCountry: v.optional(v.union(v.literal("US"), v.literal("GB"))),
    customerReference: v.optional(v.string()),
    lifecycle: v.union(v.literal("active"), v.literal("paused"), v.literal("removed")),
    coverageState: v.optional(v.literal("awaiting_first_scan")),
    observationState: v.optional(v.literal("unknown")),
    // Any new deletion tombstone advances this version and makes downstream
    // derived state stale until the later recomputation slice consumes it.
    evidenceRevision: v.optional(v.number()),
    recomputeRequiredAt: v.optional(v.number()),
    snapshotGeneration: v.number(),
    directRequestId: v.optional(v.string()),
    directFingerprint: v.optional(v.string()),
    clientImportId: v.optional(v.string()),
    importOrdinal: v.optional(v.number()),
    importFingerprint: v.optional(v.string()),
    purgeGeneration: v.number(),
    purgePhase: v.union(
      v.literal("none"),
      v.literal("scan"),
      v.literal("evidence"),
      v.literal("candidates"),
      v.literal("payload"),
      v.literal("complete"),
    ),
    removedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_account_companyId", ["ownerAccountId", "companyId"])
    .index("by_account_lifecycle_sortName", ["ownerAccountId", "lifecycle", "sortName"])
    .index("by_account_customerReference_lifecycle", ["ownerAccountId", "customerReference", "lifecycle"])
    .index("by_account_directRequestId", ["ownerAccountId", "directRequestId"])
    .index("by_account_import_tuple", ["ownerAccountId", "clientImportId", "importOrdinal"]),

  companyMonitoringClaims: defineTable({
    ownerAccountId: v.string(),
    companyId: v.string(),
    claimId: v.string(),
    type: v.union(
      v.literal("alias"),
      v.literal("domain"),
      v.literal("legal_identifier"),
      v.literal("x_account_id"),
      v.literal("x_handle"),
      v.literal("location"),
      v.literal("customer_reference"),
    ),
    value: v.string(),
    provenance: v.union(v.literal("customer"), v.literal("independent_provider")),
    trustState: v.union(
      v.literal("unverified"),
      v.literal("verified"),
      v.literal("expired"),
      v.literal("rejected"),
    ),
    allowedUses: v.optional(v.array(v.union(
      v.literal("discovery"),
      v.literal("attribution"),
      v.literal("primary_evidence"),
    ))),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_account_company", ["ownerAccountId", "companyId"]),

  // One current official-X authority decision per company. The immutable
  // account ID is the binding key; handles are current display/routing data.
  // Claim IDs retain the exact independently verified domain evidence and
  // customer handle claim used for each decision.
  companyMonitoringXIdentities: defineTable({
    ownerAccountId: v.string(),
    companyId: v.string(),
    domainClaimId: v.string(),
    xHandleClaimId: v.string(),
    officialDomain: v.string(),
    officialPageUrl: v.string(),
    accountId: v.string(),
    currentHandle: v.string(),
    profileName: v.string(),
    domicileCountry: v.union(v.literal("US"), v.literal("GB")),
    authorityRole: companyMonitoringXAuthorityRoleValidator,
    state: v.union(v.literal("authoritative"), v.literal("demoted")),
    demotionReason: v.optional(companyMonitoringXDemotionReasonValidator),
    badgeVerified: v.boolean(),
    allowedUses: v.array(companyMonitoringXAllowedUseValidator),
    evidenceHash: v.string(),
    checkedAt: v.number(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_account_company", ["ownerAccountId", "companyId"])
    .index("by_account_accountId", ["ownerAccountId", "accountId"])
    .index("by_account_currentHandle", ["ownerAccountId", "currentHandle"]),

  // Compliance-aware recent posts. Deleted content remains as a tombstone;
  // protected/withheld content retains only permitted metadata.
  companyMonitoringXEvidence: defineTable({
    ownerAccountId: v.string(),
    companyId: v.string(),
    postId: v.string(),
    authorAccountId: v.string(),
    currentHandle: v.string(),
    createdAt: v.number(),
    observedAt: v.number(),
    contentState: companyMonitoringXContentStateValidator,
    storageState: companyMonitoringXStorageStateValidator,
    text: v.optional(v.string()),
    editHistoryPostIds: v.array(v.string()),
    withheldCountryCodes: v.optional(v.array(v.string())),
    evidenceRevision: v.number(),
    lastReconciledAt: v.optional(v.number()),
    firstSeenAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_account_company", ["ownerAccountId", "companyId"])
    .index("by_account_company_observedAt", ["ownerAccountId", "companyId", "observedAt"])
    .index("by_account_company_contentState_lastReconciledAt", [
      "ownerAccountId",
      "companyId",
      "contentState",
      "lastReconciledAt",
    ])
    .index("by_account_postId", ["ownerAccountId", "postId"])
    .index("by_account_company_postId", ["ownerAccountId", "companyId", "postId"]),

  // Every X edit-history ID resolves to one canonical evidence row. This
  // keeps later compliance events for any edit sibling from leaving another
  // version active after a deletion.
  companyMonitoringXPostAliases: defineTable({
    ownerAccountId: v.string(),
    companyId: v.string(),
    postId: v.string(),
    canonicalPostId: v.string(),
    authorAccountId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_account_postId", ["ownerAccountId", "postId"])
    .index("by_account_company", ["ownerAccountId", "companyId"]),

  // Provider locators are copied into account + company rows. No unscoped
  // locator or fingerprint index exists, so identical provider results in two
  // portfolios remain separate customer evidence.
  companyMonitoringEvidence: defineTable({
    ownerAccountId: v.string(),
    companyId: v.string(),
    evidenceId: v.string(),
    provider: companyMonitoringEvidenceProviderValidator,
    providerLocator: v.string(),
    queryVersion: v.optional(v.string()),
    providerLocatorHash: v.string(),
    providerOrigin: v.string(),
    providerOriginFingerprint: v.string(),
    contentFingerprint: v.string(),
    evidenceFingerprint: v.string(),
    occurrenceDedupeKey: v.string(),
    matchedClaimIds: v.array(v.string()),
    sourceAuthority: companyMonitoringEvidenceAuthorityValidator,
    independence: companyMonitoringEvidenceIndependenceValidator,
    state: companyMonitoringEvidenceStateValidator,
    url: v.optional(v.string()),
    title: v.optional(v.string()),
    text: v.optional(v.string()),
    author: v.optional(v.string()),
    authorAccountId: v.optional(v.string()),
    publishedAt: v.number(),
    observedAt: v.number(),
    expiresAt: v.optional(v.number()),
    firstSeenAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_account_company", ["ownerAccountId", "companyId"])
    .index("by_account_company_locator", [
      "ownerAccountId",
      "companyId",
      "provider",
      "providerLocatorHash",
    ])
    .index("by_account_company_fingerprint", [
      "ownerAccountId",
      "companyId",
      "evidenceFingerprint",
    ])
    .index("by_account_company_occurrence", [
      "ownerAccountId",
      "companyId",
      "occurrenceDedupeKey",
    ])
    .index("by_account_company_occurrence_state", [
      "ownerAccountId",
      "companyId",
      "occurrenceDedupeKey",
      "state",
    ])
    .index("by_account_company_provider_state", [
      "ownerAccountId",
      "companyId",
      "provider",
      "state",
    ])
    .index("by_account_company_state_expiresAt", [
      "ownerAccountId",
      "companyId",
      "state",
      "expiresAt",
    ]),

  // One account/company occurrence is the classifier handoff. References are
  // bounded snapshots; referenceCount preserves the full active evidence size.
  companyMonitoringCandidates: defineTable({
    ownerAccountId: v.string(),
    companyId: v.string(),
    candidateId: v.string(),
    occurrenceDedupeKey: v.string(),
    state: companyMonitoringCandidateStateValidator,
    firstDiscoveredAt: v.number(),
    firstDiscoveredPath: v.string(),
    attemptCount: v.number(),
    holdUntil: v.optional(v.number()),
    expiresAt: v.number(),
    observationBlocking: v.boolean(),
    referenceEvidenceFingerprints: v.array(v.string()),
    referenceCount: v.number(),
    referencesTruncated: v.boolean(),
    selectionPolicyVersion: v.string(),
    terminalReason: v.optional(companyMonitoringCandidateTerminalReasonValidator),
    evidenceRevision: v.number(),
    evidenceSnapshotDigest: v.optional(v.string()),
    lastAdmissionDecisionId: v.optional(v.id("companyMonitoringAdmissionDecisions")),
    classificationWorkerId: v.optional(v.string()),
    classificationLeaseToken: v.optional(v.string()),
    classificationLeaseExpiresAt: v.optional(v.number()),
    classificationRunId: v.optional(v.string()),
    classificationRequestedModelVersion: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_account_company", ["ownerAccountId", "companyId"])
    .index("by_account_company_occurrence", [
      "ownerAccountId",
      "companyId",
      "occurrenceDedupeKey",
    ])
    .index("by_account_state_updatedAt", ["ownerAccountId", "state", "updatedAt"])
    .index("by_state_updatedAt", ["state", "updatedAt"]),

  // Append-only outcome ledger. Model output is never stored directly: only
  // the strict normalized classification and deterministic policy result are
  // durable. The replay index fences one classification run to one evidence
  // revision while preserving every later retry as a separate row.
  companyMonitoringAdmissionDecisions: defineTable({
    ownerAccountId: v.string(),
    companyId: v.string(),
    candidateId: v.string(),
    occurrenceDedupeKey: v.string(),
    evidenceRevision: v.number(),
    classificationRunId: v.string(),
    submissionDigest: v.string(),
    decision: v.union(
      v.literal("publish"),
      v.literal("hold"),
      v.literal("reject"),
      v.literal("expire"),
    ),
    reasonCodes: v.array(v.string()),
    referenceEvidenceFingerprints: v.array(v.string()),
    confidenceFloors: companyMonitoringAdmissionConfidenceFloorsValidator,
    classification: v.optional(companyMonitoringAdmissionClassificationValidator),
    overallConfidence: v.optional(v.number()),
    authority: v.optional(companyMonitoringAdmissionAuthorityValidator),
    queryVersions: v.array(v.string()),
    classificationSchemaVersion: v.string(),
    admissionPolicyVersion: v.string(),
    sourcePolicyVersion: v.string(),
    retryPolicyVersion: v.string(),
    evidenceSelectionPolicyVersion: v.string(),
    modelVersion: v.string(),
    requestedModelVersion: v.optional(v.string()),
    evidenceSnapshotDigest: v.optional(v.string()),
    retryAt: v.optional(v.number()),
    terminalAt: v.number(),
    decidedAt: v.number(),
    previousDecisionId: v.optional(v.id("companyMonitoringAdmissionDecisions")),
  })
    .index("by_account_company", ["ownerAccountId", "companyId"])
    .index("by_account_candidate", ["ownerAccountId", "candidateId", "decidedAt"])
    .index("by_replay_fence", [
      "ownerAccountId",
      "companyId",
      "occurrenceDedupeKey",
      "evidenceRevision",
      "classificationRunId",
    ]),

  // One durable company/source obligation. The closed state variants keep a
  // single uniqueness row while a work item's terminal receipt preserves the
  // history for every completed window. A failed/non-reassuring attempt never
  // changes `checkpoint`; a later window reuses that exact value.
  companyMonitoringScanObligations: defineTable(v.union(
    v.object({
      ...companyMonitoringObligationIdentity,
      state: v.literal("due"),
      workId: v.string(),
    }),
    v.object({
      ...companyMonitoringObligationIdentity,
      state: v.literal("leased"),
      workId: v.string(),
      leaseToken: v.string(),
      leaseExpiresAt: v.number(),
      workerId: v.string(),
    }),
    v.object({
      ...companyMonitoringObligationIdentity,
      state: v.literal("complete"),
      workId: v.string(),
      terminalReceiptId: v.string(),
      completedAt: v.number(),
    }),
    v.object({
      ...companyMonitoringObligationIdentity,
      state: v.literal("non_reassuring"),
      workId: v.string(),
      terminalReceiptId: v.string(),
      completedAt: v.number(),
      reason: companyMonitoringNonReassuringReasonValidator,
    }),
    v.object({
      ...companyMonitoringObligationIdentity,
      state: v.literal("cancelled"),
      workId: v.optional(v.string()),
      cancelledAt: v.number(),
      reason: v.union(
        v.literal("company_removed"),
        v.literal("account_inactive"),
        v.literal("superseded"),
      ),
    }),
  ))
    .index("by_account_company_source", ["ownerAccountId", "companyId", "source"])
    .index("by_workId", ["workId"]),

  // Durable cohort membership for terminal receipts. Live obligations move
  // to the next due work item, while these bounded links retain which
  // companies the immutable terminal work receipt covered. Company purge
  // removes its links page-by-page and deletes a receipt only after the final
  // cohort member link is gone.
  companyMonitoringScanReceiptLinks: defineTable({
    ownerAccountId: v.string(),
    companyId: v.string(),
    workId: v.string(),
    createdAt: v.number(),
  })
    .index("by_account_company", ["ownerAccountId", "companyId"])
    .index("by_workId", ["workId"])
    .index("by_workId_company", ["workId", "companyId"]),

  // Cohort/source/window work is the sole lease and terminal-receipt
  // authority. `selectionDueAt` is `scheduledDueAt` while due and the lease
  // expiry while leased, so crash replay remains an indexed bounded lookup.
  companyMonitoringScanWorkItems: defineTable(v.union(
    v.object({
      ...companyMonitoringWorkIdentity,
      state: v.literal("due"),
    }),
    v.object({
      ...companyMonitoringWorkIdentity,
      state: v.literal("leased"),
      leaseToken: v.string(),
      leaseExpiresAt: v.number(),
      workerId: v.string(),
    }),
    v.object({
      ...companyMonitoringWorkIdentity,
      state: v.literal("complete"),
      terminalLeaseToken: v.string(),
      terminalWorkerId: v.string(),
      terminalReceipt: companyMonitoringCompleteReceiptValidator,
    }),
    v.object({
      ...companyMonitoringWorkIdentity,
      state: v.literal("non_reassuring"),
      terminalLeaseToken: v.string(),
      terminalWorkerId: v.string(),
      terminalReceipt: companyMonitoringNonReassuringReceiptValidator,
    }),
    v.object({
      ...companyMonitoringWorkIdentity,
      state: v.literal("cancelled"),
      cancelledAt: v.number(),
      cancelReason: v.union(
        v.literal("company_removed"),
        v.literal("account_inactive"),
        v.literal("superseded"),
      ),
    }),
  ))
    .index("by_workId", ["workId"])
    .index("by_workKey", ["workKey"])
    .index("by_account_state_selectionDueAt", ["ownerAccountId", "state", "selectionDueAt"])
    .index("by_account_source_state_selectionDueAt", ["ownerAccountId", "source", "state", "selectionDueAt"]),

  userApiKeys: defineTable({
    userId: v.string(),
    name: v.string(),
    keyPrefix: v.string(),        // first 8 chars of plaintext key, for display
    keyHash: v.string(),          // SHA-256 hex digest — never store plaintext
    createdAt: v.number(),
    lastUsedAt: v.optional(v.number()),
    revokedAt: v.optional(v.number()),
    scopes: v.optional(v.array(v.string())),
    companyMonitoringAccountId: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_revokedAt", ["userId", "revokedAt"])
    .index("by_keyHash", ["keyHash"]),

  // Non-key Pro MCP identity rows. One row per OAuth grant for a Pro user.
  // Referenced from OAuth code/token records as `mcpTokenId` — never carries
  // plaintext or `wm_` keys. Revoke deletes the row's revokedAt → next
  // bearer-resolution at api/mcp.ts returns 401 (no token-index sweep needed).
  // See plan: docs/plans/2026-05-10-001-feat-pro-mcp-clerk-auth-quota-plan.md
  mcpProTokens: defineTable({
    userId: v.string(),
    clientId: v.optional(v.string()),
    name: v.optional(v.string()),
    createdAt: v.number(),
    lastUsedAt: v.optional(v.number()),
    revokedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_revokedAt_createdAt", ["userId", "revokedAt", "createdAt"]),

  // Pre-seeded, document-backed serialization point for `intelHistory.append`.
  //
  // Convex does not treat an empty `by_dedupeKey` index range as a conflict
  // dependency, so concurrent first-seen appends could both see no row and
  // insert the same key. `intelHistory.append` reads and patches this
  // always-existing singleton before checking dedupe keys, making the OCC
  // dependency document-backed. The historical seeders are low-frequency,
  // so one global serialization point is intentional and keeps the invariant
  // simple. It is seeded by the deploy workflow; append fails loudly if it is
  // absent rather than silently weakening idempotency.
  intelHistoryAppendLocks: defineTable({
    lockKey: v.string(),
    lastTouchedAt: v.number(),
  }).index("by_lockKey", ["lockKey"]),

  // Append-only historical intelligence memory (#5694). Seeders publish a
  // rolling live snapshot to Redis that overwrites itself every run; this
  // table is the durable long tail behind it — one row per distinct event,
  // never updated in place. `dedupeKey` is the seeder-side identity of an
  // event, so a re-publish of the same event is a skip, not a second row
  // (see `append` in convex/intelHistory.ts).
  //
  // EMBEDDING CONTRACT — `embedding` is produced by
  // openai/text-embedding-3-small at 512 dimensions: the SAME model and
  // dimension pair the brief deduper uses (EMBED_MODEL / EMBED_DIMS in
  // scripts/lib/brief-dedup-consts.mjs). The vector index below hard-codes
  // `dimensions: 512` and Convex rejects a stored vector of any other length,
  // so changing the model OR the dimension is a table migration (a new /
  // version-suffixed table plus a full re-embed) — NOT an in-place edit of
  // this number. Mixing vectors from two models in one index is worse than a
  // hard failure: the search still returns results, they are just ranked
  // against a similarity scale that no longer means anything. The deduper
  // carries the same warning on its CACHE_VERSION prefix.
  intelHistory: defineTable({
    // "conflict" | "military" | "energy" today. Deliberately v.string() and
    // not a v.union of literals: a new seeder domain should be a code change
    // in the collector, not a schema deploy that has to land first.
    domain: v.string(),
    resource: v.string(),
    country: v.optional(v.string()),
    category: v.optional(v.string()),
    title: v.string(),
    summary: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    // Event time as reported by the source, vs. the time we stored it. Both
    // are kept: reads are ordered by `occurredAt` (what a user means by "what
    // happened last week") while retention ages rows out by `ingestedAt` (so
    // a backfill of old events is not deleted by the next prune tick).
    occurredAt: v.number(),
    ingestedAt: v.number(),
    runId: v.string(),
    dedupeKey: v.string(),
    embedding: v.array(v.float64()),
  })
    .index("by_dedupeKey", ["dedupeKey"])
    .index("by_ingestedAt", ["ingestedAt"])
    .index("by_domain_occurredAt", ["domain", "occurredAt"])
    .index("by_country_occurredAt", ["country", "occurredAt"])
    // Convex's vector-index filter builder supports only `eq` and `or` — there
    // is no `and`. A query scoped to BOTH domain and country therefore pushes
    // one field down and post-filters the other; see `search` in
    // convex/intelHistory.ts for which one and why.
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 512,
      filterFields: ["domain", "country"],
    }),

  // Retraction tombstones for `intelHistory` (#5743).
  //
  // Deleting a poisoned or wrong history row is not enough on its own. The
  // producing seeders republish a rolling window every run, and `append`
  // decides "already stored?" by looking for a row with the same `dedupeKey` —
  // so a bare delete is undone by the next seed tick, usually within the hour.
  // A retraction therefore writes a tombstone keyed on the same `dedupeKey`
  // the delete removed, and `append` skips any record that matches one.
  //
  // Tombstones, not a soft-delete flag on `intelHistory`: the row must
  // genuinely leave the vector index (that is the whole point of a retraction,
  // and a filtered-out row still costs index space and can still be ranked),
  // while the identity has to survive it. They age out on the same 180-day
  // clock as the history itself — by `retractedAt`, so the window starts when
  // the operator acted rather than when the event happened.
  intelHistoryRetractions: defineTable({
    // Matches `intelHistory.dedupeKey` exactly. One row per retracted
    // identity; re-retracting the same key refreshes it rather than
    // accumulating duplicates.
    dedupeKey: v.string(),
    // When suppression was last ASSERTED — not when the operator first acted.
    // `retract` sets it, and every `append` this tombstone suppresses refreshes
    // it, because a record still arriving from the producer is evidence the
    // feed has not stopped serving it and expiry would be premature. Expiry is
    // therefore measured from the producer's last attempt, so `listRetractions`
    // orders by "most recently still-live" rather than by when someone typed
    // the command. The original action time lives in the `reason` an operator
    // is required to supply and in the `intel_history_retracted` breadcrumb.
    retractedAt: v.number(),
    // Free text from the operator, e.g. "poisoned RSS item, #5743". Required
    // at the relay boundary: a tombstone with no stated cause is unreviewable
    // six weeks later, when the only question that matters is whether it is
    // still deserved.
    reason: v.string(),
  })
    .index("by_dedupeKey", ["dedupeKey"])
    .index("by_retractedAt", ["retractedAt"]),
});
