// shared/mcp-attribution.ts
var MCP_UPGRADE_UTM_SOURCE = "mcp";
var MCP_UPGRADE_UTM_MEDIUM = "agent";
var MCP_UPGRADE_UTM_CAMPAIGN = "mcp-paid-funnel";
var MCP_ATTRIBUTION_SOURCE = MCP_UPGRADE_UTM_CAMPAIGN;
var MCP_UPGRADE_URL = `https://worldmonitor.app/pro?utm_source=${MCP_UPGRADE_UTM_SOURCE}&utm_medium=${MCP_UPGRADE_UTM_MEDIUM}&utm_campaign=${MCP_UPGRADE_UTM_CAMPAIGN}`;
function isMcpAttributionSource(value) {
  return value === MCP_ATTRIBUTION_SOURCE;
}
function normalizeCheckoutAttributionSource(value) {
  if (typeof value !== "string") return void 0;
  const trimmed = value.trim();
  return isMcpAttributionSource(trimmed) ? trimmed : void 0;
}
function readMcpAttributionFromSearch(search) {
  const normalized = search.startsWith("?") || search.startsWith("#") ? search.slice(1) : search;
  const campaign = new URLSearchParams(normalized).get("utm_campaign");
  return isMcpAttributionSource(campaign) ? campaign : void 0;
}

// api/mcp/upgrade.ts
var DENIAL_COPY = {
  "no-account": {
    message: "Authentication required to call this tool.",
    nextStep: "Sign in at the upgrade URL, connect WorldMonitor MCP with your account, or subscribe to Pro for the full daily allowance."
  },
  "allowance-exhausted": {
    message: "Free-account MCP allowance exhausted for today.",
    nextStep: "Wait until the next UTC day for another free allowance window, or upgrade to Pro for a higher daily limit."
  },
  // #6716 F1: the free allowance covers cache-backed tools only. Tools with a
  // downstream `_execute` are re-gated by server/gateway.ts's own
  // checkProMcpAccess, which this feature deliberately does not relax — so a
  // free caller must be refused HERE, before a slot is charged on a call the
  // gateway will reject. Terminal until upgrade: retrying and re-authenticating
  // both fail, which is why this rides the 403 envelope, not 401 or 429.
  "upgrade-required": {
    message: "This tool requires a WorldMonitor Pro subscription.",
    nextStep: "The free allowance covers cached-data tools only. Call one of those, or subscribe to Pro at the upgrade URL for the full tool set."
  },
  // The lapsed MESSAGE is owned by getMcpBillingVerificationDenial (it keeps the
  // "Re-authenticating will not help" clause the error catalog documents); only
  // `nextStep` and `upgradeUrl` from here reach the wire for this reason. Do not
  // say "reconnect MCP" — that is the OAuth retry this envelope exists to prevent.
  "lapsed-subscription": {
    message: "Your WorldMonitor Pro subscription is no longer active.",
    nextStep: "Resubscribe at the upgrade URL. The existing credential stays valid \u2014 re-authenticating will not restore access."
  }
};
function buildMcpStructuredDenial(reason) {
  const copy = DENIAL_COPY[reason];
  return {
    message: copy.message,
    data: {
      reason,
      nextStep: copy.nextStep,
      upgradeUrl: MCP_UPGRADE_URL
    }
  };
}
export {
  MCP_ATTRIBUTION_SOURCE,
  MCP_UPGRADE_URL,
  MCP_UPGRADE_UTM_CAMPAIGN,
  MCP_UPGRADE_UTM_MEDIUM,
  MCP_UPGRADE_UTM_SOURCE,
  buildMcpStructuredDenial,
  isMcpAttributionSource,
  normalizeCheckoutAttributionSource,
  readMcpAttributionFromSearch
};
