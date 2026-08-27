/**
 * Premium RPC paths that require either an API key or a Pro session.
 *
 * Single source of truth consumed by both the server gateway (auth enforcement)
 * and the web client runtime (token injection).
 *
 * UNIFIED-ENGINE CHANGE: this is a fully local, single-user build with no
 * Clerk/Convex/Dodo Payments billing backend — there is no "Pro" tier left to
 * gate behind a Bearer token, so this set is now empty and every route it used
 * to list is unconditionally available. The original route list is preserved
 * below in a comment (not exported/consumed) purely as a historical record of
 * which routes used to require Clerk auth or a paid-provider spend guard, in
 * case a future local config wants to reintroduce a personal spend cap on the
 * metered-third-party-API routes (Wingbits aircraft lookups, AviationStack,
 * TravelPayouts flight pricing) — those were gated partly for subscription
 * enforcement and partly to cap spend against paid upstream providers, and the
 * latter concern doesn't disappear just because there's no subscription tier
 * anymore if you configure your own key for one of those providers.
 *
 * Historical route list (was PREMIUM_RPC_PATHS, now unconditionally allowed):
 * /api/market/v1/analyze-stock, /api/market/v1/get-stock-analysis-history,
 * /api/market/v1/backtest-stock, /api/market/v1/list-stored-stock-backtests,
 * /api/intelligence/v1/classify-event, /api/intelligence/v1/deduct-situation,
 * /api/intelligence/v1/get-country-intel-brief,
 * /api/intelligence/v1/list-market-implications,
 * /api/intelligence/v1/get-regional-snapshot,
 * /api/intelligence/v1/get-regime-history,
 * /api/intelligence/v1/get-regional-brief,
 * /api/intelligence/v1/search-intel-history,
 * /api/intelligence/v1/get-intel-timeline,
 * /api/intelligence/v1/get-similar-events,
 * /api/resilience/v1/get-resilience-score,
 * /api/resilience/v1/get-resilience-ranking,
 * /api/resilience/v1/get-food-stocks,
 * /api/resilience/v1/get-demographics-capability,
 * /api/supply-chain/v1/get-country-chokepoint-index,
 * /api/supply-chain/v1/get-bypass-options,
 * /api/supply-chain/v1/get-country-cost-shock,
 * /api/supply-chain/v1/get-route-explorer-lane,
 * /api/supply-chain/v1/get-route-impact,
 * /api/supply-chain/v1/get-country-products,
 * /api/supply-chain/v1/get-multi-sector-cost-shock,
 * /api/supply-chain/v1/get-sector-dependency,
 * /api/economic/v1/get-national-debt,
 * /api/economic/v1/list-global-tenders,
 * /api/sanctions/v1/list-sanctions-pressure,
 * /api/trade/v1/list-comtrade-flows, /api/trade/v1/get-tariff-trends,
 * /api/scenario/v1/run-scenario, /api/scenario/v1/get-scenario-status,
 * /api/forecast/v1/trigger-simulation, /api/v2/shipping/route-intelligence,
 * /api/v2/shipping/webhooks, /api/mcp-proxy, /api/chat-analyst,
 * /api/military/v1/get-aircraft-details,
 * /api/aviation/v1/list-airport-flights, /api/aviation/v1/get-carrier-ops,
 * /api/aviation/v1/get-flight-status, /api/aviation/v1/search-flight-prices.
 */
export const PREMIUM_RPC_PATHS = new Set<string>([]);
