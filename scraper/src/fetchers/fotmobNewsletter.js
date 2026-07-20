import * as cheerio from 'cheerio';
import { fetchHtml } from '../http.js';
import { extractJsonLd } from '../jsonld.js';

const URL = 'https://newsletter.fotmob.com/p/spain-masterclass-knocks-out-france';

function extractQuotes(paragraphs) {
  const text = paragraphs.join(' ');
  const matches = text.match(/[“"][^“”"]{3,300}[”"]/g) || [];
  return [...new Set(matches.map((m) => m.slice(1, -1).trim()))];
}

/**
 * The FotMob newsletter ("The Assist") runs on Beehiiv, which server-renders
 * the post body into a #content-blocks container — this is the published
 * article text, not FotMob's live in-app match-tracking API (which the main
 * README explicitly avoids scraping as it's not sanctioned by their ToS).
 */
export async function fetchFotmobNewsletter() {
  const html = await fetchHtml(URL);
  const $ = cheerio.load(html);

  const paragraphs = $('#content-blocks p, #content-blocks .dream-post-content-paragraph')
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);

  const article = extractJsonLd(html).find((b) => b['@type'] === 'Article');

  return {
    source: URL,
    fetched_at: new Date().toISOString(),
    headline: article?.headline,
    date_published: article?.datePublished,
    quotes: extractQuotes(paragraphs),
    paragraphs,
  };
}
