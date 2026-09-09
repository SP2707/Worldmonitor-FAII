// Content-age helpers for seed-current-events-wikipedia.mjs.
//
// Same drift-prevention pattern as _climate-news-helpers.mjs (see that
// file's header): the seeder's top-level runSeed() call exits the process
// on import, so tests can't import the seeder directly. The pure
// contentMeta function lives here so both the seeder and its tests import
// the same code.
//
// Unlike climate-news (per-item RSS pubDate), Wikipedia's Current Events
// portal is one hand-edited wikitext page per UTC day — individual bullets
// don't carry their own timestamps. We use the page's own last-revision
// timestamp (fetched alongside the wikitext, see seed-current-events-
// wikipedia.mjs) as the shared publishedAt for every item pulled from that
// page: editors add bullets through the day, so the latest revision time is
// a reasonable proxy for "how fresh is this batch," even though it doesn't
// distinguish which specific bullet was added most recently.

/**
 * @param {{items: Array, revisionTimestampMs: number|null}} data
 * @param {number} nowMs - injectable "now" for deterministic tests; defaults to Date.now()
 */
export function currentEventsWikipediaContentMeta(data, nowMs = Date.now()) {
  const items = Array.isArray(data?.items) ? data.items : [];
  const ts = data?.revisionTimestampMs;
  if (items.length === 0) return null;
  if (typeof ts !== 'number' || !Number.isFinite(ts) || ts <= 0) return null;
  // Excludes clock-skew-implausible future timestamps, same 1h tolerance
  // used by climate-news / disease-outbreaks / list-feed-digest.
  const skewLimit = nowMs + 60 * 60 * 1000;
  if (ts > skewLimit) return null;
  return { newestItemAt: ts, oldestItemAt: ts };
}

// Editors update the current day's page continuously, but the portal has
// gone quiet for a few hours before (slow news day, editor timezone gaps).
// 18h tolerates that without paging, while still tripping STALE_CONTENT if
// the page genuinely stops being edited for a full day+ (upstream page
// renamed, API contract changed, our page-title logic drifts from
// Wikipedia's actual naming).
export const CURRENT_EVENTS_WIKIPEDIA_MAX_CONTENT_AGE_MIN = 18 * 60;
