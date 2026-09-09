// api/live/_shared.ts
//
// Shared plumbing for the plain-REST "live snapshot" surface (/api/live/*).
//
// This is deliberately NOT the MCP JSON-RPC path (api/mcp/*): no tool-call
// envelope, no billing/quota/entitlement gating, no OAuth negotiation, and
// (as of this revision) NO separate credential of its own. This fork's
// entire local-only auth model is the sidecar's global LOCAL_API_TOKEN gate
// (src-tauri/sidecar/local-api-server.mjs, checked in `dispatch()` BEFORE
// any route module — including this one — is even loaded; see README.md's
// "Auth" section: "no accounts, tiers, or paywalls", one shared local
// secret). Layering a second WORLDMONITOR_VALID_KEYS/X-WorldMonitor-Key
// check on top of that (an earlier revision of this file did) was redundant
// at best and, since this fork explicitly ships with zero API keys
// configured by default, a guaranteed 401 at worst — WORLDMONITOR_VALID_KEYS
// is simply unset in this deployment mode, so no key could ever match. By
// the time a handler in this directory runs, the caller has already proven
// they hold LOCAL_API_TOKEN. Nothing further to check.
//
// See worldmonitor-faii-local-selfhost-plan.md for why this surface exists:
// Alfred's Recon lane can route a chat question into a running service's
// OWN HTTP interface, but has no way (yet) to drive MCP's JSON-RPC/tool-call
// ceremony — so FAII publishes its state here instead of waiting on that.
//
// Every tool in TOOL_REGISTRY is reachable through /api/live/snapshot/:tool.
// Tools whose inputSchema.required is empty are ALSO aggregated by
// /api/live/snapshot into one combined document.

import { executeTool } from '../mcp/dispatch';
import { createMcpToolExecutionContext } from '../mcp/downstream';
import { TOOL_REGISTRY } from '../mcp/registry/index';
import type { McpAuthContext, ToolDef } from '../mcp/types';

/** Every tool callable with zero arguments — the aggregate snapshot's set. */
export const ZERO_ARG_TOOLS: ToolDef[] = TOOL_REGISTRY.filter(
  (tool) => tool.inputSchema.required.length === 0,
);

export function findTool(name: string): ToolDef | undefined {
  return TOOL_REGISTRY.find((tool) => tool.name === name);
}

/**
 * `_execute` tools need an McpAuthContext to build downstream fetch headers
 * (see api/mcp/dispatch.ts's `dispatchToolsCall`, which builds the same
 * shape for the exact same reason). This surface has no per-caller identity
 * of its own — auth already happened at the sidecar's outer LOCAL_API_TOKEN
 * gate — so every call here runs as one fixed local principal.
 *
 * `apiKey` is NOT hardcoded empty: api/mcp/auth.ts's `buildAuthHeaders`
 * forwards `X-WorldMonitor-Key: <apiKey>` on every env_key downstream
 * fetch, and SOME internal routes an `_execute` tool calls (confirmed:
 * get_world_brief's bootstrap-insights fetch, get_wto_trade_flows) check
 * that header themselves, independent of the outer LOCAL_API_TOKEN gate —
 * an empty apiKey 401s those specific tools even though the outer gate
 * already passed (confirmed by testing: cache tools and some `_execute`
 * tools like get_china_decision_signals succeeded with an empty apiKey;
 * these two didn't). Pull the first configured WORLDMONITOR_VALID_KEYS
 * value from this process's own environment so no caller-supplied
 * credential is needed — matching this fork's one-shared-secret model.
 * Empty string (unset) is still a valid fallback: tools that don't check
 * this header keep working, and the ones that do fail with a clear
 * `auth_rejected` from the downstream fetch rather than silently.
 */
const LOCAL_AUTH_CONTEXT: McpAuthContext = {
  kind: 'env_key',
  apiKey: (process.env.WORLDMONITOR_VALID_KEYS || '').split(',')[0]?.trim() ?? '',
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export type RunToolResult =
  | { ok: true; data: unknown; cached_at?: string | null; stale?: boolean }
  | { ok: false; error: string };

/**
 * Runs one tool and returns its plain data (or a structured error) — the
 * shared execution path for both /api/live/snapshot and
 * /api/live/snapshot/:tool.
 *
 * Cache tools (`tool._execute === undefined`) go through `executeTool`, a
 * pure Redis read with no network fanout — fast. `_execute` tools run
 * their real handler unchanged, which may fetch other internal endpoints
 * or an LLM provider (e.g. get_world_brief), so callers should expect
 * those to be slower and occasionally to fail the way any live fetch can.
 */
export async function runTool(
  tool: ToolDef,
  params: Record<string, unknown>,
  req: Request,
): Promise<RunToolResult> {
  try {
    if (tool._execute === undefined) {
      const result = await executeTool(tool, params);
      return { ok: true, data: result.data, cached_at: result.cached_at, stale: result.stale };
    }
    const base = new URL(req.url).origin;
    const execution = createMcpToolExecutionContext(req.url);
    const data = await tool._execute(params, base, LOCAL_AUTH_CONTEXT, execution);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'tool_execution_failed' };
  }
}
