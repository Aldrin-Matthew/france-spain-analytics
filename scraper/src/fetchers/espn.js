const URLS = [
  'https://www.espn.com/soccer/match/_/gameId/760514/spain-france',
  'https://www.espn.com/soccer/story/_/id/49362319/kylian-mbappe-critical-tactics-sloppy-france-loss',
];

/**
 * ESPN's soccer pages respond to plain HTTP requests with a 202 + empty body
 * regardless of user-agent — a bot-challenge gate that requires a real
 * browser session to clear. Rather than fight that (proxies, headless
 * browser sessions, etc. — fragile and easy to cross into ToS-unfriendly
 * territory), this ETL step treats ESPN as out of scope for automated
 * fetching, same spirit as the FotMob live-tracking-API call in the main
 * README. ESPN's numbers are already reflected in the hand-compiled
 * data/match_data.json.
 */
export async function fetchEspn() {
  return URLS.map((url) => ({
    source: url,
    status: 'skipped',
    reason: 'HTTP 202 bot-challenge response — not reachable via plain HTTP fetch, requires a real browser session.',
  }));
}
