/**
 * Entitlement queries.
 *
 * Two versions:
 *   - getEntitlementsForUser (public query): for frontend ConvexClient subscription.
 *     Derives the subject from Convex auth and returns free-tier defaults when
 *     unauthenticated.
 *   - getEntitlementsByUserId (internal query): for the gateway ConvexHttpClient
 *     cache-miss fallback. Trusted server-to-server call with no auth gap.
 */

import type { QueryCtx } from "./_generated/server";
import { query, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getFeaturesForPlan, mergeEntitlementFeatures } from "./lib/entitlements";
import { resolveUserId, LOCAL_USER_ID } from "./lib/auth";

const FREE_TIER_DEFAULTS = {
  planKey: "free" as const,
  features: getFeaturesForPlan("free"),
  validUntil: 0,
};

/** Shared handler logic for both public and internal queries. */
async function getEntitlementsHandler(
  ctx: QueryCtx,
  userId: string,
) {
  const entitlement = await ctx.db
    .query("entitlements")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();

  if (!entitlement) {
    return FREE_TIER_DEFAULTS;
  }

  // Expired entitlements fall back to free tier (Pitfall 7 from research)
  if (entitlement.validUntil < Date.now()) {
    return FREE_TIER_DEFAULTS;
  }

  // Read-time merge with the canonical product catalog so feature flags added
  // to PRODUCT_CATALOG since the row was last written by the Dodo webhook
  // are surfaced immediately — no need to wait for the next subscription
  // event to rewrite the row. Stored row's `features` win on conflict
  // (preserves any per-user overrides). New fields the row lacks (e.g.
  // `mcpAccess` post-plan-2026-05-10-001 U10) inherit the catalog default
  // for the user's plan.
  // `planLimits` is nested, so the shared helper merges it independently.
  const mergedFeatures = mergeEntitlementFeatures(
    entitlement.planKey,
    entitlement.features,
  );
  return {
    planKey: entitlement.planKey,
    features: mergedFeatures,
    validUntil: entitlement.validUntil,
  };
}

/**
 * Public query: returns entitlements for the authenticated user.
 *
 * Derives the caller from server-side auth identity. Unauthenticated
 * callers get free-tier defaults instead of arbitrary cross-user reads.
 */
export const getEntitlementsForUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await resolveUserId(ctx);
    if (!userId) {
      return FREE_TIER_DEFAULTS;
    }
    return getEntitlementsHandler(ctx, userId);
  },
});

/**
 * Internal query: returns entitlements for a given userId.
 *
 * Used by the gateway ConvexHttpClient for cache-miss fallback.
 * Trusted server-to-server call — no auth gap.
 */
export const getEntitlementsByUserId = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return getEntitlementsHandler(ctx, args.userId);
  },
});


/**
 * UNIFIED-ENGINE CHANGE: no Dodo Payments webhook exists in this build to
 * write an entitlements row anymore. Rather than patching every consumer of
 * this table (apiKeys.ts's apiAccess gate, mcpProTokens.ts's Pro MCP grant,
 * companyMonitoring/accounts.ts's reconciler — which holds a live reference
 * to the row's `_id` and genuinely needs a real document, not a hardcoded
 * bypass), this seeds ONE permanent, maximal-access row for the single local
 * user. Every existing consumer then reaches the same "fully entitled"
 * outcome through its own unmodified logic, because the data says so.
 *
 * Idempotent — safe to run repeatedly. Registered hourly in crons.ts as a
 * self-healing backstop; also safe to run manually once right after first
 * deploy (`npx convex run entitlements:ensureLocalEntitlement`) for instant
 * effect instead of waiting for the next cron tick.
 */
export const ensureLocalEntitlement = internalMutation({
  args: {},
  handler: async (ctx) => {
    const fullAccessFeatures = {
      tier: 3,
      maxDashboards: -1,
      apiAccess: true,
      apiRateLimit: -1,
      planLimits: {
        apiRequestsPerDay: null,
        apiBurstRequestsPerMinute: null,
        mcpCallsPerDay: null,
        dashboardAiCallsPerDay: null,
        mcpBurstRequestsPerMinute: null,
      },
      prioritySupport: true,
      exportFormats: ["csv", "json", "pdf"],
      mcpAccess: true,
      apiDailyAllowance: -1,
      dataExport: true,
    };
    // JS max safe date (year 275760) — matches the "never expires" sentinel
    // used by server/_shared/entitlement-check.ts::getEntitlements().
    const validUntil = 8_640_000_000_000_000;

    const existing = await ctx.db
      .query("entitlements")
      .withIndex("by_userId", (q) => q.eq("userId", LOCAL_USER_ID))
      .first();

    if (!existing) {
      await ctx.db.insert("entitlements", {
        userId: LOCAL_USER_ID,
        planKey: "local",
        features: fullAccessFeatures,
        validUntil,
        updatedAt: Date.now(),
      });
      return;
    }

    if (existing.planKey === "local" && existing.validUntil >= validUntil) {
      return; // already fully seeded — nothing to do
    }

    await ctx.db.patch(existing._id, {
      planKey: "local",
      features: fullAccessFeatures,
      validUntil,
      updatedAt: Date.now(),
    });
  },
});
