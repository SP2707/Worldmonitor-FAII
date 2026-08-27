/**
 * Plan-to-features resolution.
 *
 * UNIFIED-ENGINE CHANGE: this used to resolve features from the Dodo
 * Payments product catalog (convex/config/productCatalog.ts), which is
 * deleted along with the rest of the billing backend. There is exactly one
 * entitlement row now (seeded by convex/entitlements.ts::ensureLocalEntitlement),
 * always fully populated, so there is no catalog left to look anything up
 * in — every plan key resolves to the same full-access feature set.
 */

export type PlanLimits = {
  apiRequestsPerDay: number | null;
  apiBurstRequestsPerMinute: number | null;
  mcpCallsPerDay: number | null;
  mcpBurstRequestsPerMinute: number | null;
  dashboardAiCallsPerDay?: number | null;
};

export type PlanFeatures = {
  tier: number;
  maxDashboards: number;
  apiAccess: boolean;
  apiRateLimit: number;
  planLimits?: PlanLimits;
  prioritySupport: boolean;
  exportFormats: string[];
  mcpAccess?: boolean;
  apiDailyAllowance?: number;
  dataExport?: boolean;
};

/** The one feature set every plan key now resolves to. */
export const FULL_ACCESS_FEATURES: PlanFeatures = {
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

/** Kept for import-compat with existing call sites — no free tier exists anymore. */
export const FREE_FEATURES: PlanFeatures = FULL_ACCESS_FEATURES;

/**
 * Returns the feature set for a given plan key. The key is ignored: there is
 * no catalog left to differentiate plans, and the one local user always gets
 * full access.
 */
export function getFeaturesForPlan(planKey: string): PlanFeatures {
  void planKey;
  return FULL_ACCESS_FEATURES;
}

/** Merge stored per-user overrides with the full-access defaults. */
export function mergeEntitlementFeatures(
  planKey: string,
  storedFeatures: Omit<PlanFeatures, "planLimits"> & {
    planLimits?: Partial<NonNullable<PlanFeatures["planLimits"]>>;
  },
): PlanFeatures {
  void planKey;
  return {
    ...FULL_ACCESS_FEATURES,
    ...storedFeatures,
    planLimits: {
      ...FULL_ACCESS_FEATURES.planLimits,
      ...storedFeatures.planLimits,
    } as PlanFeatures["planLimits"],
  };
}
