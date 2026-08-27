/**
 * Extracted from the deleted convex/lib/identitySigning.ts, which mixed this
 * CORE Company Monitoring mechanism in with Dodo checkout/business-invite
 * token signing. Everything below is genuinely used by
 * companyMonitoring/accounts.ts and has nothing to do with billing — only
 * the checkout/business-invite exports were dropped along with the rest of
 * the payments backend.
 */

export const ANON_ID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const COMPANY_MONITORING_OWNER_FENCE_VERSION = "v1";
const COMPANY_MONITORING_OWNER_FENCE_SECRET_ENV = "COMPANY_MONITORING_OWNER_FENCE_SECRET";
const COMPANY_MONITORING_OWNER_FENCE_PREVIOUS_SECRETS_ENV =
  "COMPANY_MONITORING_OWNER_FENCE_PREVIOUS_SECRETS";

function getCompanyMonitoringOwnerFenceKey(): string {
  const key = process.env[COMPANY_MONITORING_OWNER_FENCE_SECRET_ENV];
  if (!key) {
    throw new Error(
      `[identity-signing] ${COMPANY_MONITORING_OWNER_FENCE_SECRET_ENV} not set. ` +
      "Set it in the Convex dashboard environment variables. " +
      "Do not reuse DODO_IDENTITY_SIGNING_SECRET.",
    );
  }
  if (key.trim() !== key) {
    throw new Error(
      `[identity-signing] ${COMPANY_MONITORING_OWNER_FENCE_SECRET_ENV} is invalid`,
    );
  }
  return key;
}

async function signPayloadWithKey(payload: string, key: string): Promise<string> {
  const encoder = new TextEncoder();

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(payload),
  );

  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface CompanyMonitoringOwnerFenceCandidates {
  current: string;
  all: readonly string[];
}

/**
 * Returns the current fence first, followed by every explicitly configured
 * predecessor that must remain discoverable.
 *
 * Rotation order is deliberate: before rotating
 * COMPANY_MONITORING_OWNER_FENCE_SECRET, append its current value to the
 * comma-separated COMPANY_MONITORING_OWNER_FENCE_PREVIOUS_SECRETS keyring and
 * deploy that configuration. The current-key duplicate is deliberately
 * ignored during this preparation step. Then rotate the current secret.
 * Retain every historical key while tombstones created with it must remain
 * replay-fenced: ownerless terminal rows cannot be bulk migrated without
 * retaining reversible identity. Nonterminal roots are opportunistically
 * migrated by entitlement sync.
 */
export async function companyMonitoringOwnerFenceCandidates(
  userId: string,
): Promise<CompanyMonitoringOwnerFenceCandidates> {
  if (!userId) {
    throw new Error("[identity-signing] Company Monitoring owner fence requires a userId");
  }
  const currentKey = getCompanyMonitoringOwnerFenceKey();
  const previousKeysRaw = process.env[COMPANY_MONITORING_OWNER_FENCE_PREVIOUS_SECRETS_ENV];
  const previousKeys = previousKeysRaw === undefined ? [] : previousKeysRaw.split(",");
  if (
    previousKeysRaw !== undefined &&
    (!previousKeysRaw ||
      previousKeysRaw.trim() !== previousKeysRaw ||
      previousKeys.some((key) => !key || key.trim() !== key))
  ) {
    throw new Error(
      `[identity-signing] ${COMPANY_MONITORING_OWNER_FENCE_PREVIOUS_SECRETS_ENV} is invalid`,
    );
  }
  const seenPreviousKeys = new Set<string>();
  for (const previousKey of previousKeys) {
    if (seenPreviousKeys.has(previousKey)) {
      throw new Error(
        `[identity-signing] ${COMPANY_MONITORING_OWNER_FENCE_PREVIOUS_SECRETS_ENV} contains a duplicate key`,
      );
    }
    seenPreviousKeys.add(previousKey);
  }

  const payload = `company-monitoring-owner:${COMPANY_MONITORING_OWNER_FENCE_VERSION}:${userId}`;
  const keys = [currentKey, ...previousKeys.filter((key) => key !== currentKey)];
  const all = await Promise.all(keys.map((key) => signPayloadWithKey(payload, key)));
  const [current] = all;
  if (!current) {
    throw new Error("[identity-signing] Company Monitoring owner fence keyring is empty");
  }
  return { current, all };
}

export async function signCompanyMonitoringOwnerFence(userId: string): Promise<string> {
  return (await companyMonitoringOwnerFenceCandidates(userId)).current;
}
