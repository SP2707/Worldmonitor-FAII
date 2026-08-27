import { QueryCtx, MutationCtx, ActionCtx } from "../_generated/server";

/**
 * UNIFIED-ENGINE CHANGE: this build has no Clerk backend and the browser's
 * Convex client no longer presents any auth token (ConvexProviderWithClerk
 * is gone from the frontend) — ctx.auth.getUserIdentity() would return null
 * on every call from here on. There is exactly one local user, so every
 * Convex function resolves to this fixed id instead of an auth identity.
 * This remains the sole entry point for "who is calling" — no Convex
 * function should read ctx.auth directly — so every CORE table (alertRules,
 * apiKeys, followedCountries, mcpProTokens, notificationChannels,
 * userPreferences, users, ...) keeps working unchanged against one stable
 * owner id instead of a per-account Clerk subject.
 */
export const LOCAL_USER_ID = "local";

/** Kept as an alias — some call sites/tests still reference the old dev name. */
export const DEV_USER_ID = LOCAL_USER_ID;

/**
 * Returns the current user's ID. Never null in this build: there is exactly
 * one local user and every request is theirs.
 */
export async function resolveUserId(
  ctx: QueryCtx | MutationCtx | ActionCtx,
): Promise<string | null> {
  void ctx;
  return LOCAL_USER_ID;
}

/**
 * Returns the full user identity (name, email, etc.) or null.
 * Use when you need more than just the user ID (e.g., checkout prefill).
 *
 * UNIFIED-ENGINE CHANGE: no external identity provider exists anymore, so
 * there is no name/email to return — only the fixed local subject.
 */
export async function resolveUserIdentity(
  ctx: QueryCtx | MutationCtx | ActionCtx,
): Promise<{ subject: string; name?: string; givenName?: string; familyName?: string; email?: string } | null> {
  void ctx;
  return { subject: LOCAL_USER_ID };
}

/**
 * Returns the current user's ID. Kept for API compatibility with existing
 * call sites — it never throws in this build since resolveUserId() never
 * returns null, but the ConvexError("AUTH_REQUIRED") contract is preserved
 * in case a future caller relies on the return type being non-nullable.
 */
export async function requireUserId(
  ctx: QueryCtx | MutationCtx | ActionCtx,
): Promise<string> {
  return resolveUserId(ctx) as Promise<string>;
}
