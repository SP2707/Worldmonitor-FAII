/**
 * Local single-user sidecar mode (Worldmonitor-FAII fork, consumed by
 * Alfred over MCP). The sidecar (src-tauri/sidecar/local-api-server.mjs)
 * gates every request behind LOCAL_API_TOKEN before dispatching it to a
 * handler; once a request has cleared that gate, the sidecar strips any
 * client-supplied copy of this header and re-sets it itself, unconditionally,
 * right before invoking the handler module. A caller can never forge it —
 * only the sidecar, after its own check has already passed, can make it
 * appear.
 *
 * This is the SINGLE shared signal both of this fork's separate inbound auth
 * layers trust as proof of "already authenticated by the sidecar":
 *   - the MCP JSON-RPC endpoint (api/mcp/auth.ts's resolveAuthContext), for
 *     the inbound `tools/call` request itself;
 *   - the general domain-RPC gateway (server/gateway.ts's
 *     createDomainGateway), for every other /api/*\/v1/* route — including
 *     the internal loopback re-fetches `_execute`-based MCP tools make back
 *     into those same routes (api/mcp/auth.ts's buildAuthHeaders carries the
 *     LOCAL_API_TOKEN bearer for exactly this, but the target route's own
 *     auth still has to recognize local-sidecar mode to accept it).
 *
 * Keep it that way — one header, one definition, checked the same way in
 * both places. A second, independently-invented local-mode bypass is exactly
 * the kind of drift that originally left server/gateway.ts unpatched: fixing
 * only resolveAuthContext stopped the inbound MCP call from 401ing, but every
 * `_execute` tool's own internal re-fetch into a domain route kept 401ing
 * against server/gateway.ts's validateApiKey, which had never heard of this
 * header at all.
 *
 * Unset (the whole header is simply absent) in the original hosted
 * multi-service deployment, where nothing ever sets it — a no-op there.
 */
export const LOCAL_SIDECAR_AUTH_HEADER = 'x-worldmonitor-sidecar-authenticated';

/** Synthetic principal id used for telemetry/trusted-header purposes when a
 * request is authenticated purely via LOCAL_SIDECAR_AUTH_HEADER — there is no
 * real per-user identity in local single-user mode. */
export const LOCAL_SIDECAR_PRINCIPAL_ID = 'local-sidecar';

export function isLocalSidecarAuthenticated(req: Request): boolean {
  return req.headers.get(LOCAL_SIDECAR_AUTH_HEADER) === '1';
}
