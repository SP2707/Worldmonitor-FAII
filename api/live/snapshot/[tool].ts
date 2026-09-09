export const config = { runtime: 'edge' };

import { findTool, jsonResponse, runTool } from '../_shared';

// GET /api/live/snapshot/:tool?<query params become the tool's arguments>
//
// Plain-REST single-tool endpoint: runs ANY tool in the MCP registry by
// name and returns its plain data. Query-string parameters become the
// tool's `arguments` object, so a parameterized tool like get_country_brief
// is just:
//   GET /api/live/snapshot/get_country_brief?country_code=US
// and a query-driven tool like analyze_situation is just:
//   GET /api/live/snapshot/analyze_situation?query=...
//
// Auth: same LOCAL_API_TOKEN header you already use for /api/mcp — see
// api/live/_shared.ts for why no separate credential is checked here.
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return jsonResponse({ error: 'method_not_allowed' }, 405);
  }

  const url = new URL(req.url);
  // Cap the echoed tool name — same reflection-amplification guard
  // api/mcp/dispatch.ts applies to its own "Unknown tool" message.
  const toolName = (url.pathname.split('/').pop() ?? '').slice(0, 100);
  const tool = findTool(toolName);
  if (!tool) {
    return jsonResponse({ error: 'unknown_tool', tool: toolName }, 404);
  }

  const missing = tool.inputSchema.required.filter((key) => !url.searchParams.has(key));
  if (missing.length > 0) {
    return jsonResponse(
      { error: 'missing_required_params', tool: tool.name, required: tool.inputSchema.required, missing },
      400,
    );
  }

  // Query strings are text-only — coerce the obvious shapes (booleans,
  // numbers) so a tool expecting `summary: true` or a numeric arg gets the
  // type its inputSchema declares, same as any other plain-REST GET API.
  const params: Record<string, unknown> = {};
  for (const [key, value] of url.searchParams.entries()) {
    if (value === 'true') params[key] = true;
    else if (value === 'false') params[key] = false;
    else if (value !== '' && /^-?\d+(\.\d+)?$/.test(value)) params[key] = Number(value);
    else params[key] = value;
  }

  const result = await runTool(tool, params, req);
  if (!result.ok) {
    return jsonResponse({ error: result.error, tool: tool.name }, 502);
  }
  return jsonResponse({
    tool: tool.name,
    data: result.data,
    ...(result.cached_at !== undefined ? { cached_at: result.cached_at } : {}),
    ...(result.stale !== undefined ? { stale: result.stale } : {}),
  });
}
