/**
 * Extracted from the deleted convex/payments/cacheActions.ts, which mixed
 * this CORE cache-invalidation action in with Dodo-entitlement-specific
 * Redis cache sync (syncEntitlementCache / resyncEntitlementCacheFromDb /
 * deleteEntitlementCache — all genuinely billing-only, deleted). This one
 * invalidates the Redis-cached wm_ API key validation entries that
 * server/_shared/user-api-key.ts reads, which companyMonitoring/accounts.ts
 * still needs to call after an account lifecycle transition.
 */
import { internalAction } from "../_generated/server";
import { v } from "convex/values";

const REDIS_FETCH_TIMEOUT_MS = 5000;

/**
 * Invalidates warm production user-key entries after an account lifecycle
 * transition. Company Monitoring scopes are account-bound inside the cached
 * validation payload, so a lapse/terminal fence must not wait for the 60s TTL.
 */
export const invalidateUserApiKeyCaches = internalAction({
  args: { keyHashes: v.array(v.string()) },
  handler: async (_ctx, args) => {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url && !token) return;
    if (!url || !token) {
      throw new Error(
        "[userApiKeyCache] UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be configured together for user API key cache invalidation",
      );
    }
    if (args.keyHashes.length === 0) return;
    // Convex actions do not inherit Vercel deployment metadata. Lifecycle
    // invalidation therefore targets the production, unprefixed namespace;
    // preview-key namespacing remains local to the Vercel validators.
    const commands = args.keyHashes.flatMap((keyHash) => [
      ["DEL", `user-api-key:${keyHash}`],
      ["DEL", `bootstrap-user-api-key-invalid:${keyHash}`],
    ]);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REDIS_FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "worldmonitor-server/1.0 (redis)",
        },
        body: JSON.stringify(commands),
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`[userApiKeyCache] user API key cache DEL failed: HTTP ${response.status}`);
      }
      const results: unknown = await response.json();
      if (!Array.isArray(results) || results.length !== commands.length) {
        throw new Error("[userApiKeyCache] user API key cache DEL returned malformed pipeline results");
      }
      for (const [index, entry] of results.entries()) {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
          throw new Error(`[userApiKeyCache] user API key cache DEL failed at pipeline index ${index}`);
        }
        const result = entry as Record<string, unknown>;
        const value = result.result;
        if (
          Object.prototype.hasOwnProperty.call(result, "error") ||
          !Object.prototype.hasOwnProperty.call(result, "result") ||
          (value !== 0 && value !== 1 && value !== "0" && value !== "1")
        ) {
          throw new Error(`[userApiKeyCache] user API key cache DEL failed at pipeline index ${index}`);
        }
      }
    } finally {
      clearTimeout(timeout);
    }
  },
});
