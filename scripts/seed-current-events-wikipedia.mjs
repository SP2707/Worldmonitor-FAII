#!/usr/bin/env node

// Direct, zero-auth integration of Wikipedia's "Portal:Current events" —
// same free-forever shape as ReliefWeb (see seed-climate-news.mjs's
// fetchReliefWebApi): no API key, no signup, nothing to register in
// SELF_HOSTING.md. Wikipedia's own MediaWiki Action API is public and
// unauthenticated for reads.
//
// Portal:Current events is a hand-curated wikitext subpage per UTC day
// ("Portal:Current events/2026 September 8"), grouped into category
// sections (Armed conflicts and attacks, Business and economy, Disasters
// and accidents, International relations, Law and crime, Politics and
// elections, Science and technology, Sports, ...). Each bullet is a real,
// sourced current-events line with inline wikilinks to the concerned
// article(s) and (usually) an external citation link.
//
// Confirmed against a live fetch of the actual page (2026-09-08): the
// subpage is JUST that day's news, no "==Events==" / "==Deaths==" heading
// pair wrapping it — it opens with {{Current events|year=...}} and an HTML
// comment, then category names appear as their own '''Bold''' line (not
// ";Category"), followed by *, **, ***, **** bullets — the real narrative
// sentence + citation is usually on the deepest bullet in a thread, with
// shallower bullets being topic/context links. See parsePage() below.
//
// One request (action=query, prop=revisions, rvprop=content|timestamp)
// gets both the day's wikitext and its last-edit timestamp, which we use
// as the shared publishedAt for every item pulled from that page (see
// _current-events-wikipedia-helpers.mjs for why).

import { loadEnvFile, CHROME_UA, runSeed } from './_seed-utils.mjs';
import { decodeHtmlEntities } from './_html-entities.mjs';
import {
  currentEventsWikipediaContentMeta,
  CURRENT_EVENTS_WIKIPEDIA_MAX_CONTENT_AGE_MIN,
} from './_current-events-wikipedia-helpers.mjs';

loadEnvFile(import.meta.url);

const API_URL = 'https://en.wikipedia.org/w/api.php';
const CANONICAL_KEY = 'intelligence:current-events-wikipedia:v1';
const CACHE_TTL = 3600; // 1h — this seeder is intended to run hourly; TTL = 1x interval
                         // is tight vs. the "3x interval" convention elsewhere in this repo
                         // (see seed-climate-news.mjs), but a stale current-events page for
                         // more than an hour is itself the signal worth losing the cached
                         // copy over, not something to paper over with a longer TTL.
const MAX_ITEMS = 300;

function stableHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

// ---- date / page-title handling ------------------------------------------

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function pageTitleForDate(d) {
  return `Portal:Current events/${d.getUTCFullYear()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

function addDaysUTC(d, days) {
  const copy = new Date(d.getTime());
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

// ---- fetch -----------------------------------------------------------------

async function fetchRevision(pageTitle) {
  const url = new URL(API_URL);
  url.searchParams.set('action', 'query');
  url.searchParams.set('titles', pageTitle);
  url.searchParams.set('prop', 'revisions');
  url.searchParams.set('rvprop', 'content|timestamp');
  url.searchParams.set('rvslots', 'main');
  url.searchParams.set('format', 'json');
  url.searchParams.set('formatversion', '2');

  const resp = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': CHROME_UA },
    signal: AbortSignal.timeout(15_000),
  });
  if (!resp.ok) throw new Error(`Wikipedia API HTTP ${resp.status} for "${pageTitle}"`);
  const payload = await resp.json();
  const page = payload?.query?.pages?.[0];
  if (!page || page.missing) return null;
  const revision = page.revisions?.[0];
  const wikitext = revision?.slots?.main?.content;
  const timestamp = revision?.timestamp ? new Date(revision.timestamp).getTime() : null;
  if (!wikitext) return null;
  return { wikitext, revisionTimestampMs: Number.isFinite(timestamp) ? timestamp : null };
}

// Today's UTC subpage may lag a few hours behind editors creating it; fall
// back to yesterday's once rather than returning nothing.
async function fetchWithFallback(targetDate) {
  const primaryTitle = pageTitleForDate(targetDate);
  const primary = await fetchRevision(primaryTitle);
  if (primary) return { title: primaryTitle, ...primary };

  const fallbackDate = addDaysUTC(targetDate, -1);
  const fallbackTitle = pageTitleForDate(fallbackDate);
  const fallback = await fetchRevision(fallbackTitle);
  if (fallback) return { title: fallbackTitle, ...fallback };

  return null;
}

// ---- wikitext parsing --------------------------------------------------
//
//   {{Current events|year=2026|month=09|day=8|top=yes}}
//   <!-- All news items below this line -->
//   '''Armed conflicts and attacks'''
//   *[[Houthi–Saudi Arabian conflict]]
//   **[[September 2026 Houthi strikes on Saudi Arabia]]
//   ***Houthi forces launch missiles... [https://reuters.com/... (Reuters)]
//   '''Business and economy'''
//   *Another thread.
//
// No section-heading boundary to find (unlike a generic wiki article) —
// the whole page IS the day's news. So we don't hunt for "==Events=="; we
// just walk every line and classify it as either a '''Category''' line or
// a *-prefixed bullet at whatever depth. Anything else (the top template,
// the HTML comment, trailing nav/category boilerplate) matches neither
// pattern and is silently dropped — no explicit end-boundary needed.

function stripRefTags(text) {
  return text
    .replace(/<ref[^>]*\/>/g, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '');
}

function stripHtmlComments(text) {
  return text.replace(/<!--[\s\S]*?-->/g, '');
}

function extractLinks(text) {
  const links = [];
  const re = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g;
  let m;
  while ((m = re.exec(text))) {
    const article = m[1].trim();
    if (!article) continue;
    links.push({
      title: article,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(article.replace(/ /g, '_'))}`,
    });
  }
  return links;
}

// External citation links: [https://reuters.com/... (Reuters)]. These are
// the actual sourcing for the sentence and, for the shallow topic-only
// bullets (e.g. "*[[Houthi–Saudi Arabian conflict]]"), their absence is a
// useful signal that a bullet is just a grouping link, not narrated news.
function extractCitations(text) {
  const citations = [];
  const re = /\[(https?:\/\/\S+)\s+([^\]]+)\]/g;
  let m;
  while ((m = re.exec(text))) {
    citations.push({ url: m[1], label: wikitextToPlain(m[2]) });
  }
  return citations;
}

function wikitextToPlain(text) {
  const stage1 = text
    .replace(/\[\[[^\]|#]+#[^\]|]*\|([^\]]+)\]\]/g, '$1')
    .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, '$1')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\[https?:\/\/\S+\s+([^\]]+)\]/g, '$1')
    .replace(/\[https?:\/\/\S+\]/g, '')
    .replace(/'''''([^']+)'''''/g, '$1')
    .replace(/'''([^']+)'''/g, '$1')
    .replace(/''([^']+)''/g, '$1')
    // Templates can nest one level ({{flag|{{subst:x}}}}); strip innermost
    // first, then whatever's left at the top level.
    .replace(/\{\{[^{}]*\}\}/g, '')
    .replace(/\{\{[^{}]*\}\}/g, '')
    .trim();
  return decodeHtmlEntities(stage1);
}

function parsePage(wikitext) {
  const lines = wikitext.split('\n');
  const records = [];
  let currentCategory = 'Uncategorized';

  for (const raw of lines) {
    const line = stripHtmlComments(stripRefTags(raw)).trim();
    if (!line) continue;

    // Category header: a line that is ENTIRELY '''Bold text''', nothing else.
    const categoryMatch = line.match(/^'''(.+?)'''$/);
    if (categoryMatch) {
      currentCategory = wikitextToPlain(categoryMatch[1]);
      continue;
    }

    const bulletMatch = line.match(/^(\*+)\s*(.+)$/);
    if (bulletMatch) {
      const depth = bulletMatch[1].length;
      const rawText = bulletMatch[2];
      const text = wikitextToPlain(rawText);
      if (!text) continue;
      records.push({
        category: currentCategory,
        depth,
        text,
        links: extractLinks(rawText),
        citations: extractCitations(rawText),
      });
    }
  }

  return records;
}

// ---- main fetch/transform ----------------------------------------------

async function fetchCurrentEvents() {
  const result = await fetchWithFallback(new Date());
  if (!result) return { items: [], sourceTitle: null, sourceUrl: null, revisionTimestampMs: null };

  const { title, wikitext, revisionTimestampMs } = result;
  const parsed = parsePage(wikitext);

  const items = [];
  const seenIds = new Set();
  for (const r of parsed) {
    const id = stableHash(`${title}:${r.category}:${r.text}`);
    if (seenIds.has(id)) continue;
    seenIds.add(id);
    items.push({
      id,
      category: r.category,
      depth: r.depth,
      text: r.text,
      links: r.links,
      citations: r.citations,
      hasCitation: r.citations.length > 0,
      publishedAt: revisionTimestampMs,
    });
    if (items.length >= MAX_ITEMS) break;
  }

  return {
    items,
    sourceTitle: title,
    sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
    revisionTimestampMs,
  };
}

function validate(data) {
  return Array.isArray(data?.items) && data.items.length >= 1;
}

export function declareRecords(data) {
  return Array.isArray(data?.items) ? data.items.length : 0;
}

const isMain = process.argv[1]?.endsWith('seed-current-events-wikipedia.mjs');
if (isMain) {
  runSeed('intelligence', 'current-events-wikipedia', CANONICAL_KEY, fetchCurrentEvents, {
    validateFn: validate,
    ttlSeconds: CACHE_TTL,
    sourceVersion: 'wikipedia-current-events-portal-v1',
    recordCount: (data) => data?.items?.length || 0,
    declareRecords,
    schemaVersion: 1,
    maxStaleMin: 90,
    contentMeta: currentEventsWikipediaContentMeta,
    maxContentAgeMin: CURRENT_EVENTS_WIKIPEDIA_MAX_CONTENT_AGE_MIN,
  }).catch((err) => {
    const _cause = err.cause ? ` (cause: ${err.cause.message || err.cause.code || err.cause})` : '';
    console.error('FATAL:', (err.message || err) + _cause);
    process.exit(1);
  });
}
