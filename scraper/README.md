# Scraper

A small Node.js ETL step that fetches extended public stats/narrative for the France vs Spain
2026 World Cup semi-final and writes them to `../data/extended_stats.json` for **human review** —
it does not auto-merge anything into `frontend/src/data/matchData.json`. That file stays hand-curated;
this just gives you a sourced starting point for extending it.

## Running it

```bash
cd scraper
npm install
npm start
```

## Sources and how each is scraped

| Source | Method | What it gives you |
|---|---|---|
| [playerstats.football](https://playerstats.football/fixture/france/spain/2026-07-14) | Parses the page's `schema.org/SportsEvent` JSON-LD block | Team stat cross-check, plus per-player "highlight" stats not in the existing dataset (e.g. `Foul Involvements`, `Goal Involvements`) |
| [managingmadrid.com](https://www.managingmadrid.com/real-madrid-cf-players/110046/spain-end-france-and-mbappes-2026-world-cup-hopes-with-semi-final-upset) | Parses the page's `schema.org/NewsArticle` JSON-LD `articleBody` | Tactical narrative text, any quoted lines |
| [FotMob newsletter](https://newsletter.fotmob.com/p/spain-masterclass-knocks-out-france) | Parses the Beehiiv-rendered `#content-blocks` paragraphs | Narrative facts, records, and manager quotes |
| ESPN (match page + tactics story) | **Skipped** | Both URLs return HTTP 202 with an empty body to a plain fetch regardless of user-agent — a bot-challenge gate that needs a real browser session to clear. Rather than work around that, this step marks them `skipped` with a reason. ESPN's numbers are already reflected in the hand-compiled dataset. |

All three working sources are scraped via their own public, standard SEO structured data
(JSON-LD) or server-rendered article body — not private/internal APIs. This is the same
distinction the main README draws around FotMob: their live in-app match-tracking API is
off-limits by ToS, but a published newsletter post is a normal public web page.

## Output shape

`data/extended_stats.json`:

```jsonc
{
  "generated_at": "...",
  "note": "...",
  "results": {
    "playerstats.football": { "teams": { "France": {...}, "Spain": {...} } },
    "managingmadrid.com": { "quotes": [...], "article_excerpt": "..." },
    "fotmob newsletter": { "quotes": [...], "paragraphs": [...] },
    "espn.com": [ { "status": "skipped", "reason": "..." }, ... ]
  },
  "errors": [] // any source that threw is logged here instead of failing the whole run
}
```

## Extending this

Each source lives in its own file under `src/fetchers/`, returning a plain JS object — add a
new one and wire it into the `jobs` array in `src/index.js`. If a source's markup changes and
a fetcher starts throwing, the run continues and the failure shows up in `errors` rather than
crashing the whole pipeline.
