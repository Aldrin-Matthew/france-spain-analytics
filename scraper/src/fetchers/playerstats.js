import { fetchHtml } from '../http.js';
import { extractJsonLd } from '../jsonld.js';

const URL = 'https://playerstats.football/fixture/france/spain/2026-07-14';

function propsToObject(additionalProperty = []) {
  const obj = {};
  for (const { name, value } of additionalProperty) {
    obj[name] = value;
  }
  return obj;
}

/**
 * playerstats.football embeds a schema.org SportsEvent as JSON-LD, including
 * a per-team stat block and a curated set of "highlight" stats per athlete
 * (e.g. Foul Involvements, Goal Involvements) that aren't in our existing
 * match_data.json. This is public SEO structured data, not a private API.
 */
export async function fetchPlayerStats() {
  const html = await fetchHtml(URL);
  const blocks = extractJsonLd(html);
  const event = blocks.find((b) => b['@type'] === 'SportsEvent');
  if (!event) {
    throw new Error('playerstats.football: no SportsEvent JSON-LD block found (page structure may have changed)');
  }

  const teams = {};
  for (const side of [event.homeTeam, event.awayTeam]) {
    if (!side?.name) continue;
    teams[side.name] = {
      team_stats: propsToObject(side.additionalProperty),
      player_highlight_stats: (side.athlete || []).map((p) => ({
        name: p.name.trim(),
        profile_url: p.url,
        stats: propsToObject(p.additionalProperty),
      })),
    };
  }

  return { source: URL, fetched_at: new Date().toISOString(), teams };
}
