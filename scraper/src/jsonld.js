import * as cheerio from 'cheerio';

/** Extracts and parses every <script type="application/ld+json"> block on a page. */
export function extractJsonLd(html) {
  const $ = cheerio.load(html);
  const blocks = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    try {
      const parsed = JSON.parse(raw);
      blocks.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch {
      // Some pages emit malformed/partial JSON-LD; skip rather than fail the whole run.
    }
  });
  return blocks;
}
