#!/usr/bin/env node
// One-off diagnostic — NOT part of the seeder. Prints exactly what
// Wikipedia's API returns so the parser can be fixed against real data.

const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36';
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

async function tryTitle(title) {
  const url = new URL('https://en.wikipedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('titles', title);
  url.searchParams.set('prop', 'revisions');
  url.searchParams.set('rvprop', 'content|timestamp');
  url.searchParams.set('rvslots', 'main');
  url.searchParams.set('format', 'json');
  url.searchParams.set('formatversion', '2');

  console.log(`\n=== Trying: "${title}" ===`);
  console.log('URL:', url.toString());

  let resp;
  try {
    resp = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': CHROME_UA }, signal: AbortSignal.timeout(15000) });
  } catch (e) {
    console.log('FETCH THREW:', e.message, e.cause?.message || '');
    return;
  }
  console.log('HTTP status:', resp.status);
  const text = await resp.text();
  let payload;
  try { payload = JSON.parse(text); } catch { console.log('NOT JSON, raw body (first 500 chars):', text.slice(0, 500)); return; }

  if (payload.error) { console.log('API ERROR:', JSON.stringify(payload.error)); return; }

  const page = payload?.query?.pages?.[0];
  console.log('page.missing:', page?.missing, '| page.title:', page?.title, '| page.pageid:', page?.pageid);

  const revision = page?.revisions?.[0];
  const wikitext = revision?.slots?.main?.content;
  console.log('revision.timestamp:', revision?.timestamp);
  console.log('wikitext present:', !!wikitext, '| length:', wikitext?.length || 0);

  if (wikitext) {
    console.log('\n--- First 2500 chars of wikitext ---');
    console.log(wikitext.slice(0, 2500));
    console.log('\n--- Does it contain "==Events==" (any spacing/case)? ---');
    console.log(/==\s*Events\s*==/i.test(wikitext));
    console.log('--- All level-2 headings found (==...==) ---');
    const headings = [...wikitext.matchAll(/^==\s*([^=]+?)\s*==\s*$/gm)].map(m => m[1]);
    console.log(headings);
  }
}

const now = new Date();
const todayTitle = `Portal:Current events/${now.getUTCFullYear()} ${MONTHS[now.getUTCMonth()]} ${now.getUTCDate()}`;
await tryTitle(todayTitle);

const yesterday = new Date(now.getTime());
yesterday.setUTCDate(yesterday.getUTCDate() - 1);
const yesterdayTitle = `Portal:Current events/${yesterday.getUTCFullYear()} ${MONTHS[yesterday.getUTCMonth()]} ${yesterday.getUTCDate()}`;
await tryTitle(yesterdayTitle);
