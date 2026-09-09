// api/[...notfound].js
var ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/(.*\.)?worldmonitor\.app$/,
  // Vercel preview deployments under the "eliewm" team scope, e.g.
  //   worldmonitor-git-<branch>-eliewm.vercel.app  (git-branch alias)
  //   worldmonitor-<hash>-eliewm.vercel.app        (deployment URL)
  // Tight on purpose: never a bare *.vercel.app (this is a security allowlist).
  /^https:\/\/worldmonitor-[a-z0-9-]+-eliewm\.vercel\.app$/,
  /^https?:\/\/tauri\.localhost(:\d+)?$/,
  /^https?:\/\/[a-z0-9-]+\.tauri\.localhost(:\d+)?$/i,
  /^tauri:\/\/localhost$/,
  /^asset:\/\/localhost$/,
  // Only allow bare localhost/127.0.0.1 in non-production (matches server/cors.ts)
  ...process.env.NODE_ENV === "production" ? [] : [
    /^https?:\/\/localhost(:\d+)?$/,
    /^https?:\/\/127\.0\.0\.1(:\d+)?$/
  ]
];
var ALLOWED_HEADERS = [
  "Content-Type",
  "Authorization",
  "X-WorldMonitor-Key",
  "X-Api-Key",
  "X-Widget-Key",
  "X-Pro-Key",
  "X-WorldMonitor-Desktop-Timestamp",
  "X-WorldMonitor-Desktop-Signature",
  "Idempotency-Key",
  "Mcp-Session-Id",
  "MCP-Protocol-Version",
  "Last-Event-ID"
].join(", ");
var EXPOSED_HEADERS = [
  "Mcp-Session-Id",
  "WWW-Authenticate",
  "Retry-After",
  "Idempotency-Key",
  "Idempotent-Replayed",
  // Billing-verification denials (server/_shared/entitlement-check.ts) carry
  // the reason here alongside `Retry-After`. Docs advertise the header
  // (docs/usage-errors.mdx) but it was not exposed, so a cross-origin browser
  // client — the Tauri desktop shell, widget embeds, anything on
  // api.worldmonitor.app — could not read it and had to parse `code` from the
  // body to tell a retryable verification blip from a terminal lapse (#5622).
  "X-Billing-Verification",
  // IETF RateLimit fields (draft-ietf-httpapi-ratelimit-headers): RateLimit-Policy
  // + RateLimit-Limit are advertised on every API response (vercel.json); the
  // combined RateLimit member and RateLimit-Remaining/Reset appear on a 429.
  // Exposed so browser-context agents can read them cross-origin and self-throttle.
  "RateLimit",
  "RateLimit-Policy",
  "RateLimit-Limit",
  "RateLimit-Remaining",
  "RateLimit-Reset",
  // Legacy X-RateLimit-* retained for back-compat with existing consumers.
  "X-RateLimit-Limit",
  "X-RateLimit-Remaining",
  "X-RateLimit-Reset",
  "X-WorldMonitor-Bbox",
  "X-WorldMonitor-Bbox-Missing",
  "X-WorldMonitor-Bbox-Invalid",
  "X-Military-Bbox"
].join(", ");
function getPublicCorsHeaders(methods = "GET, OPTIONS") {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
    "Access-Control-Expose-Headers": EXPOSED_HEADERS,
    "Access-Control-Max-Age": "3600"
  };
}
var MD_TWIN_LOOP_HEADER = "x-wm-md-twin";
var MAX_TWIN_CHARS = 8e4;
var MAX_TWIN_BYTES = 8e4;
var SIBLING_FETCH_TIMEOUT_MS = 8e3;
var SIBLING_USER_AGENT = "WorldMonitor-MarkdownTwin/1.0";
var FORWARDED_RESPONSE_HEADERS = [
  "allow",
  "location",
  "retry-after",
  "www-authenticate",
  "x-ratelimit-limit",
  "x-ratelimit-remaining",
  "x-ratelimit-reset"
];
function isMarkdownTwinPath(pathname) {
  return pathname.startsWith("/") && pathname.endsWith(".md") && pathname.length > 4 && !pathname.includes("..") && !pathname.includes("//") && !pathname.includes("\\");
}
function siblingPathFromMarkdown(markdownPath) {
  if (!isMarkdownTwinPath(markdownPath)) return null;
  if (markdownPath.startsWith("/api/md-twin")) return null;
  const sibling = markdownPath.slice(0, -3);
  return sibling.length > 0 ? sibling : null;
}
function decodeHtmlEntities(value) {
  return value.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&#(\d+);/g, (_, code) => {
    const n = Number(code);
    return Number.isFinite(n) && n >= 32 ? String.fromCharCode(n) : "";
  });
}
function stripTags(value) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}
function htmlToMarkdown(html, fallbackTitle) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = stripTags(titleMatch?.[1] ?? "") || fallbackTitle;
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  const main = body.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? body;
  let text = main.replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, (_m, inner) => `

# ${stripTags(inner)}

`).replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (_m, inner) => `

## ${stripTags(inner)}

`).replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, (_m, inner) => `

### ${stripTags(inner)}

`).replace(/<h4\b[^>]*>([\s\S]*?)<\/h4>/gi, (_m, inner) => `

#### ${stripTags(inner)}

`).replace(/<h5\b[^>]*>([\s\S]*?)<\/h5>/gi, (_m, inner) => `

##### ${stripTags(inner)}

`).replace(/<h6\b[^>]*>([\s\S]*?)<\/h6>/gi, (_m, inner) => `

###### ${stripTags(inner)}

`).replace(
    /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_m, href, inner) => {
      const label = stripTags(inner) || href;
      return `[${label}](${href})`;
    }
  ).replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_m, inner) => `
- ${stripTags(inner)}`).replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<\/div>/gi, "\n").replace(/<[^>]+>/g, " ");
  text = decodeHtmlEntities(text).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
  if (!/^# /m.test(text)) {
    text = text.length > 0 ? `# ${title}

${text}` : `# ${title}`;
  }
  return text.slice(0, MAX_TWIN_CHARS);
}
function jsonToMarkdown(raw, heading) {
  let pretty = raw.trim();
  try {
    pretty = JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
  }
  return `# ${heading}

\`\`\`json
${pretty}
\`\`\``.slice(0, MAX_TWIN_CHARS);
}
function markdownHeaders(req, markdownPath, extra = {}) {
  const origin = new URL(req.url).origin;
  return {
    "Content-Type": "text/markdown; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "public, max-age=3600",
    Link: `<${origin}${markdownPath}>; rel="canonical"`,
    ...getPublicCorsHeaders("GET, HEAD, OPTIONS"),
    ...extra
  };
}
function headingFromPath(pathname) {
  const leaf = pathname.split("/").filter(Boolean).pop() ?? pathname;
  return leaf.replace(/[-_]+/g, " ");
}
async function readSiblingBody(response) {
  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_TWIN_BYTES) {
    try {
      void response.body?.cancel("Sibling response exceeds the markdown twin byte limit").catch(() => {
      });
    } catch {
    }
    throw new Error("Sibling response exceeds the markdown twin byte limit");
  }
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_TWIN_BYTES) {
        try {
          void reader.cancel("Sibling response exceeds the markdown twin byte limit").catch(() => {
          });
        } catch {
        }
        throw new Error("Sibling response exceeds the markdown twin byte limit");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}
function forwardedResponseHeaders(response) {
  const headers = {};
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = response.headers.get(name);
    if (value) headers[name] = value;
  }
  return headers;
}
async function buildMarkdownTwinResponse(req, markdownPath, fetchImpl = globalThis.fetch) {
  const corsHeaders = getPublicCorsHeaders("GET, HEAD, OPTIONS");
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response("# Method not allowed\n", {
      status: 405,
      headers: markdownHeaders(req, markdownPath, { Allow: "GET, HEAD, OPTIONS" })
    });
  }
  if (req.headers.get(MD_TWIN_LOOP_HEADER) === "1") {
    return new Response("# Not found\n", {
      status: 404,
      headers: markdownHeaders(req, markdownPath, { "Cache-Control": "no-store" })
    });
  }
  const sibling = siblingPathFromMarkdown(markdownPath);
  if (!sibling) {
    return new Response("# Not found\n", {
      status: 404,
      headers: markdownHeaders(req, markdownPath, { "Cache-Control": "no-store" })
    });
  }
  const siblingUrl = new URL(sibling, req.url);
  siblingUrl.search = new URL(req.url).search;
  const outbound = new Headers();
  outbound.set("user-agent", SIBLING_USER_AGENT);
  outbound.set(MD_TWIN_LOOP_HEADER, "1");
  outbound.set("accept", "text/html, application/json;q=0.9, text/plain;q=0.8, */*;q=0.1");
  let siblingRes;
  try {
    siblingRes = await fetchImpl(siblingUrl, {
      method: req.method,
      headers: outbound,
      redirect: "manual",
      signal: AbortSignal.timeout(SIBLING_FETCH_TIMEOUT_MS)
    });
  } catch {
    return new Response(`# ${headingFromPath(sibling)}

The sibling page at \`${sibling}\` could not be fetched.
`, {
      status: 502,
      headers: markdownHeaders(req, markdownPath, { "Cache-Control": "no-store" })
    });
  }
  const location = siblingRes.headers.get("location");
  if (siblingRes.status >= 300 && siblingRes.status < 400 && location) {
    const body = `# ${headingFromPath(sibling)}

This resource redirects to [${location}](${location}).
`;
    return new Response(req.method === "HEAD" ? null : body, {
      status: 200,
      headers: markdownHeaders(req, markdownPath)
    });
  }
  const isFailure = !siblingRes.ok;
  const siblingStatus = isFailure ? siblingRes.status : 200;
  const responseHeaders = {
    ...isFailure ? { "Cache-Control": "no-store" } : {},
    ...forwardedResponseHeaders(siblingRes)
  };
  if (req.method === "HEAD") {
    return new Response(null, {
      status: siblingStatus,
      headers: markdownHeaders(req, markdownPath, responseHeaders)
    });
  }
  if (siblingStatus === 304) {
    return new Response(null, {
      status: siblingStatus,
      headers: markdownHeaders(req, markdownPath, responseHeaders)
    });
  }
  const heading = headingFromPath(sibling);
  let markdown;
  try {
    const contentType = siblingRes.headers.get("content-type") ?? "";
    const raw = await readSiblingBody(siblingRes);
    if (/markdown|text\/plain/i.test(contentType) && /^# /m.test(raw)) {
      markdown = raw.slice(0, MAX_TWIN_CHARS);
    } else if (/json/i.test(contentType) || raw.trim().startsWith("{") || raw.trim().startsWith("[")) {
      markdown = jsonToMarkdown(raw, heading);
    } else if (/html/i.test(contentType) || /<html|<body|<title/i.test(raw)) {
      markdown = htmlToMarkdown(raw, heading);
    } else if (raw.trim().length === 0) {
      markdown = `# ${heading}
`;
    } else {
      markdown = /^# /m.test(raw) ? raw.slice(0, MAX_TWIN_CHARS) : `# ${heading}

${raw}`.slice(0, MAX_TWIN_CHARS);
    }
    if (!/^# /m.test(markdown)) {
      markdown = `# ${heading}

${markdown}`;
    }
  } catch {
    return new Response(`# ${heading}

The sibling page at \`${sibling}\` could not be read.
`, {
      status: 502,
      headers: markdownHeaders(req, markdownPath, { "Cache-Control": "no-store" })
    });
  }
  return new Response(markdown, {
    status: siblingStatus,
    headers: markdownHeaders(req, markdownPath, responseHeaders)
  });
}
function handler(req) {
  const corsHeaders = getPublicCorsHeaders("GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  const pathname = (() => {
    try {
      return new URL(req.url).pathname;
    } catch {
      return req.url;
    }
  })();
  if (isMarkdownTwinPath(pathname) && (req.method === "GET" || req.method === "HEAD")) {
    return buildMarkdownTwinResponse(req, pathname);
  }
  const body = {
    error: {
      code: "not_found",
      message: `No API endpoint matches ${pathname}.`,
      hint: "Check the endpoint path against the OpenAPI spec at https://worldmonitor.app/openapi.yaml or the API reference at https://www.worldmonitor.app/docs/api-reference."
    },
    documentation: "https://www.worldmonitor.app/docs/api-reference"
  };
  return new Response(JSON.stringify(body), {
    status: 404,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // The body echoes the requested pathname (JSON-escaped, so no injection);
      // nosniff stops a client from content-type-sniffing it to HTML anyway.
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
      ...corsHeaders
    }
  });
}
var config = { runtime: "edge" };
var notfound_default = handler;
export {
  config,
  notfound_default as default
};
