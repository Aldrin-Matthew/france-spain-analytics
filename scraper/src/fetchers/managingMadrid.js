import { fetchHtml } from '../http.js';
import { extractJsonLd } from '../jsonld.js';

const URL =
  'https://www.managingmadrid.com/real-madrid-cf-players/110046/spain-end-france-and-mbappes-2026-world-cup-hopes-with-semi-final-upset';

/** Pulls quoted sentences (single or double quotes) out of a plain-text article body. */
function extractQuotes(text) {
  const matches = text.match(/[“"][^“”"]{3,300}[”"]/g) || [];
  return [...new Set(matches.map((m) => m.slice(1, -1).trim()))];
}

/**
 * managingmadrid.com (SB Nation/Vox Media) embeds the full article as
 * schema.org NewsArticle JSON-LD (articleBody), which is standard SEO
 * structured data rather than anything requiring a private API.
 */
export async function fetchManagingMadrid() {
  const html = await fetchHtml(URL);
  const blocks = extractJsonLd(html);
  const article = blocks.find((b) => b['@type'] === 'NewsArticle' || b['@type'] === 'Article');
  if (!article?.articleBody) {
    throw new Error('managingmadrid.com: no NewsArticle JSON-LD with articleBody found (page structure may have changed)');
  }

  return {
    source: URL,
    fetched_at: new Date().toISOString(),
    headline: article.headline,
    author: article.author?.name,
    date_published: article.datePublished,
    quotes: extractQuotes(article.articleBody),
    article_excerpt: article.articleBody.slice(0, 1200),
  };
}
