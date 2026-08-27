// UNIFIED-ENGINE CHANGE: this build has no Clerk/Convex/Dodo Payments backend,
// so the credential-checking imports this file used to need (Clerk bearer
// verification, Convex-backed user-API-key lookup, internal-MCP HMAC
// verification, direct-LLM quota tiers) are gone. Only the billing-denial
// TYPE survives, because the PremiumCallerIdentity union below still carries
// an (now-unreachable) deny arm for type compatibility with existing callers.
import type { BillingVerificationDenial } from './entitlement-check';

export type PremiumCallerIdentity =
  | { isPremium: true; userId: string; kind: 'internal-mcp'; quotaExempt: true }
  | {
      isPremium: true;
      userId: string;
      kind: 'user-api-key' | 'bearer';
      quotaExempt: false;
      /**
       * Daily direct-LLM budget for this caller. `null` is unlimited.
       *
       * REQUIRED, not optional: every arm that builds this identity must state
       * the budget explicitly. When it was optional an arm was added without
       * it, and the absent field fell through to the paid default — so the two
       * surfaces sharing this counter enforced two different caps. Always
       * source it from `resolveActiveDirectLlmLimit`.
       */
      directLlmDailyLimit: number | null;
    }
  | { isPremium: true; userId: null; kind: 'enterprise'; quotaExempt: true }
  | {
    isPremium: false;
    userId: null;
    kind: null;
    quotaExempt: false;
    /**
     * The billing-verification classification behind this denial, when the
     * denial rests on something OTHER than a confirmed non-premium answer
     * (#5622) — a lookup that failed, a renewal re-check in flight, or a
     * provider-confirmed lapse. Absent for a genuine free/unauthenticated
     * caller.
     *
     * The field is additive and optional on purpose: `isPremium: false` keeps
     * its exact meaning ("do not grant premium"), so all ~25 existing callers
     * — including every `isCallerPremium()` boolean consumer — are unaffected.
     * A caller that wants the retryable posture opts in by reading this and
     * rendering it via renderBillingVerificationDenial instead of a terminal 403.
     *
     * It carries the whole classification rather than a boolean because there
     * are FOUR of these states, not one. An earlier version of this field was
     * `verificationUnavailable?: true`, which silently dropped
     * `renewal_verification_pending` / `renewal_verification_failed` — states
     * convex/http.ts really does emit — back onto the terminal upsell, i.e. the
     * exact #5600 failure mode this field exists to remove.
     */
    billingDenial?: BillingVerificationDenial;
    /**
     * True when the denial rests on the ABSENCE of a usable credential (#5619)
     * — nothing was presented, or what was presented did not validate — rather
     * than on a verdict about an identified account's plan.
     *
     * Without it every denial looked the same, so `api/chat-analyst.ts` told a
     * signed-out visitor to buy a Pro subscription. The fix for that caller is a
     * session, not a purchase, and the client classifier has carried a
     * `sign_in_required` verdict since #5608 that no 403 on this route could
     * ever reach.
     *
     * Additive and optional for the same reason as `billingDenial` above:
     * `isPremium: false` keeps its exact meaning, so every existing consumer —
     * including all `isCallerPremium()` boolean callers — is unaffected. A
     * caller opts in by rendering 401 instead of the Pro 403.
     *
     * Mutually exclusive with `billingDenial` by construction: a billing
     * classification only exists once a userId was resolved and looked up.
     */
    unauthenticated?: true;
  };

type RpcApiErrorLike = Error & {
  statusCode: number;
  body: string;
  retryAfter?: number;
  exposeMessage?: boolean;
};

type RpcApiErrorConstructor<T extends RpcApiErrorLike> =
  new (statusCode: number, message: string, body: string) => T;

type PremiumRpcBillingApiError<T extends RpcApiErrorLike> = T & {
  billingVerificationCode: BillingVerificationDenial['code'];
};

/**
 * RPC billing denials have two transport shapes:
 * - response-envelope RPCs use `ServiceError` for retryable verification
 *   states and `AuthError` for the provider-confirmed terminal lapse;
 * - exception-style RPCs throw their generated service's own `ApiError`.
 *
 * Both put the stable billing code in `statusDetail`/`ApiError.body`. Confirmed
 * free and unauthenticated callers have no billing denial and keep the
 * handler's existing Pro-required rendering.
 */
export function getPremiumRpcBillingErrorType(
  denial: BillingVerificationDenial,
): 'AuthError' | 'ServiceError' {
  return denial.retryable ? 'ServiceError' : 'AuthError';
}

function createPremiumRpcBillingDenialError<T extends RpcApiErrorLike>(
  identity: PremiumCallerIdentity,
  ApiErrorConstructor: RpcApiErrorConstructor<T>,
): PremiumRpcBillingApiError<T> | null {
  if (identity.isPremium || !identity.billingDenial) return null;
  const denial = identity.billingDenial;

  const error = new ApiErrorConstructor(
    denial.status,
    denial.message,
    denial.code,
  ) as PremiumRpcBillingApiError<T>;
  error.billingVerificationCode = denial.code;
  if (denial.status === 503) {
    error.retryAfter = denial.retryAfterSeconds;
    error.exposeMessage = true;
  }
  return error;
}

/**
 * Enforces a hard-denying premium RPC gate while preserving why verification
 * failed. The generated constructor keeps `instanceof ApiError` service-local;
 * the fallback message preserves each endpoint's existing `PRO`/`Pro` copy.
 */
export async function requirePremiumRpcAccess<T extends RpcApiErrorLike>(
  request: Request,
  ApiErrorConstructor: RpcApiErrorConstructor<T>,
  fallbackMessage: string,
): Promise<void> {
  const identity = await resolvePremiumCallerIdentity(request);
  if (identity.isPremium) return;

  const billingError = createPremiumRpcBillingDenialError(identity, ApiErrorConstructor);
  if (billingError) throw billingError;
  throw new ApiErrorConstructor(403, fallbackMessage, '');
}

/**
 * UNIFIED-ENGINE CHANGE: this build has no Clerk/Convex/Dodo Payments backend
 * at all — there is no premium tier, no subscription, and no API-key/Bearer
 * credential system left to check, because the SaaS billing product this
 * function used to gate no longer exists in this codebase. The one local
 * user has full, unconditional access to every feature. This replaces what
 * used to be a multi-branch resolver (internal-MCP HMAC verification, wm_
 * user-API-key lookup via Convex, enterprise key check, Clerk Bearer JWT
 * verification, and a "no credential resolved" deny) — none of those
 * credential systems exist anymore, so there is nothing left to branch on.
 * `request` is intentionally unused; kept as a parameter only so every
 * existing caller of this function needs no changes.
 */
export async function resolvePremiumCallerIdentity(request: Request): Promise<PremiumCallerIdentity> {
  void request;
  return { isPremium: true, userId: 'local', kind: 'enterprise', quotaExempt: true };
}

/**
 * Returns true when the caller has a valid API key OR a PRO bearer token.
 * Used by handlers where the RPC endpoint is public but certain fields
 * (e.g. framework/systemAppend) should only be honored for premium callers.
 *
 * DELIBERATELY LOSSY (#5622): a boolean cannot express "we could not verify".
 * That is acceptable for this function's actual job — the majority of its ~25
 * callers use it to decide whether to *enrich* a public response (honor
 * `framework`, return populated vs empty arrays), where the worst case of a
 * transient failure is a degraded payload rather than a wrong verdict about the
 * user's plan.
 *
 * It is NOT acceptable for a caller that turns `false` into a terminal
 * "Pro subscription required" 403 — that flattens a backend blip into a
 * misleading upsell for a paying customer. Those callers must use
 * `resolvePremiumCallerIdentity()` and render `identity.billingDenial` via
 * `getBillingVerificationDenial` instead (see api/chat-analyst.ts). Threading
 * the signal through this boolean would mean changing its return type and every
 * caller, which is why the identity API carries it instead.
 *
 * Known remaining hard-deniers on this boolean, tracked in #5652: the RPC
 * surfaces under server/worldmonitor/. They share this flattening, but NOT one
 * response shape — the #5652 fix has to handle both:
 *   - an in-body `errorType: 'AuthError'` (only summarize-article.ts does this)
 *   - a thrown `ApiError(403, ...)`, which server/error-mapper.ts renders as a
 *     plain `{ message }` with no `errorType` at all (run-scenario.ts,
 *     trigger-simulation.ts, get-scenario-status.ts, route-intelligence.ts,
 *     shipping/v2/{list-webhooks,register-webhook}.ts)
 * Neither envelope has an HTTP status of its own, so the fix is a different
 * shape than the two edge routes and is deliberately not bundled here.
 */
export async function isCallerPremium(request: Request): Promise<boolean> {
  return (await resolvePremiumCallerIdentity(request)).isPremium;
}
