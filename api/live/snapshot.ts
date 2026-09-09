export const config = { runtime: 'edge' };

import { jsonResponse, runTool, ZERO_ARG_TOOLS } from './_shared';

// GET /api/live/snapshot
//
// Plain-REST aggregate: every zero-argument tool in the MCP registry, run
// and returned as one JSON document — the "everything FAII currently knows,
// in one GET" endpoint. No MCP envelope, no tool-call schema, no jmespath
// projection, no credential of its own — see api/live/_shared.ts for why:
// the sidecar's existing LOCAL_API_TOKEN gate already authenticated this
// request before this handler ran. Pass it the same way you already do for
// /api/mcp: `Authorization: Bearer <LOCAL_API_TOKEN>` (or
// `x-worldmonitor-local-token: <LOCAL_API_TOKEN>`). Nothing else required.
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return jsonResponse({ error: 'method_not_allowed' }, 405);
  }

  const generatedAt = new Date().toISOString();
  const entries = await Promise.all(
    ZERO_ARG_TOOLS.map(async (tool) => {
      const result = await runTool(tool, {}, req);
      return [tool.name, result] as const;
    }),
  );

  const tools: Record<string, unknown> = {};
  for (const [name, result] of entries) {
    tools[name] = result.ok
      ? { data: result.data, cached_at: result.cached_at ?? null, stale: result.stale ?? false }
      : { error: result.error };
  }

  return jsonResponse({ generatedAt, toolCount: entries.length, tools });
}
