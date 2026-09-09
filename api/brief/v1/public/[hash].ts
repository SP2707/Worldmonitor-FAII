/**
 * Internal JSON back-connection for a shared brief.
 *
 * GET /api/brief/v1/public/{hash}?ref={code}
 *   -> 200 application/json { envelope, hash, issueSlot }
 *   -> 404 { error: 'not_found' }        bad hash shape, missing pointer,
 *                                        or missing target brief
 *   -> 503 { error: 'service_unavailable' }  Upstash unreachable
 *
 * FAII is headless: nothing here renders for a browser. This route is
 * the RPC-shaped counterpart to /api/brief/public/{hash} (which stays
 * in place as the human-readable HTML mirror, unused by FAII's own
 * callers). share-url.ts's `shareUrl` field points HERE, not at the
 * HTML route, so a caller inside FAII (e.g. Alfred's tool manager)
 * gets structured data back instead of a page meant for a browser.
 *
 * Same pointer -> envelope resolution as the HTML route, same public
 * redaction (redactForPublic, shared from brief-render.js so the two
 * surfaces can never drift), just JSON out instead of markup.
 */

export const config = { runtime: 'edge' };

// @ts-expect-error — JS module, no declaration file
import { getCorsHeaders, isDisallowedOrigin } from '../../../_cors.js';
// @ts-expect-error — JS module, no declaration file
import { jsonResponse } from '../../../_json-response.js';
import { readRawJsonFromUpstash } from '../../../_upstash-json';
// @ts-expect-error — JS module, no declaration file
import { captureSilentError } from '../../../_sentry-edge.js';
// @ts-expect-error — JS module, no declaration file
import { assertBriefEnvelope, redactForPublic } from '../../../../server/_shared/brief-render.js';
import {
  BRIEF_PUBLIC_POINTER_PREFIX,
  decodePublicPointer,
  isValidShareHashShape,
} from '../../../../server/_shared/brief-share-url';

const JSON_HEADERS = {
  // Mirrors the HTML route's edge-cache window (see api/brief/public/[hash].ts).
  'Cache-Control': 'public, max-age=0, s-maxage=300, must-revalidate',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Same reasoning as the HTML route: never let a shared brief get indexed.
  'X-Robots-Tag': 'noindex, nofollow',
};

export default async function handler(
  req: Request,
  ctx?: { waitUntil: (p: Promise<unknown>) => void },
): Promise<Response> {
  if (isDisallowedOrigin(req)) {
    return jsonResponse({ error: 'origin_not_allowed' }, 403);
  }

  const cors = getCorsHeaders(req, 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return jsonResponse({ error: 'method_not_allowed' }, 405, cors);
  }

  // Extract the hash from the URL pathname. Expect:
  //   ['api', 'brief', 'v1', 'public', '{hash}']
  const url = new URL(req.url);
  const parts = url.pathname.split('/').filter(Boolean);
  if (
    parts.length !== 5
    || parts[0] !== 'api'
    || parts[1] !== 'brief'
    || parts[2] !== 'v1'
    || parts[3] !== 'public'
  ) {
    return jsonResponse({ error: 'not_found' }, 404, { ...cors, ...JSON_HEADERS });
  }
  const rawHash = decodeURIComponent(parts[4] ?? '');
  if (!isValidShareHashShape(rawHash)) {
    return jsonResponse({ error: 'not_found' }, 404, { ...cors, ...JSON_HEADERS });
  }

  // Same 32-char defensive cap as the HTML route — the ref code is
  // echoed back verbatim (attribution only), never interpolated into
  // anything executable.
  const refCodeRaw = url.searchParams.get('ref');
  const refCode = refCodeRaw && /^[A-Za-z0-9_-]{1,32}$/.test(refCodeRaw)
    ? refCodeRaw
    : undefined;

  // Step 1: resolve pointer -> {userId, issueSlot}.
  const pointerKey = `${BRIEF_PUBLIC_POINTER_PREFIX}${rawHash}`;
  let pointerRaw: unknown;
  try {
    pointerRaw = await readRawJsonFromUpstash(pointerKey);
  } catch (err) {
    console.error('[api/brief/v1/public] pointer read failed:', (err as Error).message);
    captureSilentError(err, { tags: { route: 'api/brief/v1/public', step: 'pointer-read' }, ctx });
    return jsonResponse({ error: 'service_unavailable' }, 503, { ...cors, ...JSON_HEADERS });
  }
  // See api/brief/public/[hash].ts for why both the JSON-string and
  // object pointer shapes are accepted here — kept in lockstep with
  // that route's tolerance so a future writer format change doesn't
  // 404 one surface while the other still resolves.
  let pointerInput: unknown = pointerRaw;
  if (pointerRaw != null && typeof pointerRaw === 'object') {
    const pointerObj = pointerRaw as { userId?: string; issueSlot?: string; issueDate?: string };
    pointerInput = `${pointerObj.userId}:${pointerObj.issueSlot ?? pointerObj.issueDate}`;
  }
  const pointer = decodePublicPointer(pointerInput);
  if (!pointer) {
    return jsonResponse({ error: 'not_found' }, 404, { ...cors, ...JSON_HEADERS });
  }

  // Step 2: resolve the actual brief envelope.
  let envelope: unknown;
  try {
    envelope = await readRawJsonFromUpstash(`brief:${pointer.userId}:${pointer.issueDate}`);
  } catch (err) {
    console.error('[api/brief/v1/public] envelope read failed:', (err as Error).message);
    captureSilentError(err, { tags: { route: 'api/brief/v1/public', step: 'envelope-read' }, ctx });
    return jsonResponse({ error: 'service_unavailable' }, 503, { ...cors, ...JSON_HEADERS });
  }
  if (!envelope) {
    // Pointer outlived the brief — same "not found" as the recipient
    // sees on the HTML mirror, not a distinguishing signal.
    return jsonResponse({ error: 'not_found' }, 404, { ...cors, ...JSON_HEADERS });
  }

  try {
    assertBriefEnvelope(envelope);
  } catch (err) {
    console.error('[api/brief/v1/public] malformed envelope:', (err as Error).message);
    captureSilentError(err, { tags: { route: 'api/brief/v1/public', step: 'validate' }, ctx });
    return jsonResponse({ error: 'not_found' }, 404, { ...cors, ...JSON_HEADERS });
  }

  const publicEnvelope = {
    version: envelope.version,
    issuedAt: envelope.issuedAt,
    data: redactForPublic(envelope.data),
  };

  return jsonResponse(
    { envelope: publicEnvelope, hash: rawHash, issueSlot: pointer.issueDate, refCode: refCode ?? null },
    200,
    { ...cors, ...JSON_HEADERS },
  );
}
