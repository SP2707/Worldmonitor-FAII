/**
 * Moved out of convex/config/productCatalog.ts (the Dodo Payments product
 * catalog, deleted along with the rest of the billing backend). This is a
 * staged-rollout kill-switch for Company Monitoring sub-providers, not a
 * billing gate — flipping these on is an engineering-readiness decision,
 * not something this de-SaaS-ification pass should make unilaterally, so
 * the values are carried over unchanged from the upstream product.
 */
export const COMPANY_MONITORING_ROLLOUT_FLAGS = {
  exaProvider: false,
  xProvider: false,
  publication: false,
  restWrites: false,
  ui: false,
  alerts: false,
} as const;
