# How Spain Neutralised France — World Cup 2026 Semi-Final Tactical Analysis

An interactive breakdown of Spain's 2-0 win over France in the FIFA World Cup 2026 semi-final
(Dallas Stadium, 14 July 2026) — focused on how Luis de la Fuente's side shut down a France team
that arrived as tournament favourites, top scorers of the knockout rounds, led by Golden Boot
contender Kylian Mbappé.

**[Live demo :](#)** [*Link to site*](https://france-spain-analytics.vercel.app/)
## What's in here

The site is a 7-section paginated deck:

1. **Team stats** — possession, xG, shots, tackles, passing, fouls, plus the pressing-intensity proxy.
2. **Starting XI** — a full-pitch formation diagram for both sides (4-2-3-1 each), with a short
   attacking/defending brief per team.
3. **The system** — how Spain's midfield trio (Rodri, Fabián Ruiz, Dani Olmo) created a 3v2 overload
   against France's double pivot, and why France's own high press collapsed.
4. **Spain's engine room** — individual breakdowns of Rodri (deep control), Fabián Ruiz (progression),
   and Dani Olmo (creation, assisted the second goal), each with a player photo.
5. **Player spotlights** with pitch diagrams:
   - **Kylian Mbappé** — isolated by a compact defensive block rather than man-marked; led the team
     in box touches but managed only one shot from open play.
   - **Michael Olise** — man-marked directly by left-back Marc Cucurella for the full 90 minutes.
6. **Full match stats** — a KPI + top-5-leaderboard dashboard (tackles, goal involvements, key passes,
   xG) across both squads, filterable by team.
7. **Match narrative** — key facts and data/photo credits.

Player photos throughout are sourced from Wikimedia Commons (WikiPortraits at the 2026 FIFA World
Cup, CC BY-SA 4.0, plus one CC BY 2.0 Flickr photo for Álex Baena) — see credits at the bottom of
the site.

## Data & methodology

All stats were compiled from public post-match sources (see `data/match_data.json → meta.sources`):
FBref, ESPN match report, PlayerStats.football, and FotMob's post-match newsletter coverage.

**Optical/event tracking data is not publicly available for this match.** True PPDA and pass-network
diagrams both require every pass and defensive action tagged with player, location, and timestamp —
that data sits behind commercial providers (Opta/Stats Perform, Wyscout), not published anywhere
public for this fixture. StatsBomb's open-data project sometimes releases this after the fact for
select tournaments, but there's no confirmed timeline (or guarantee) for World Cup 2026, and their
2022 release didn't land until many months after that tournament. FotMob/WhoScored render this kind
of data in-browser via their own internal APIs, but scraping those isn't sanctioned by their terms
of service, so this project deliberately doesn't rely on that as a data source.

Given that, this project takes two honest paths instead of guessing:
1. **Zone-accurate approximations** for pitch diagrams (correct side of pitch, correct relative
   distance from goal — not tracked coordinates), clearly labeled in the UI.
2. **A simplified pressing proxy** (opponent completed passes ÷ own tackles, full match) in place of
   real PPDA, explicitly labeled as a cruder substitute, not the real metric.

## Stack

- **Frontend:** React + Vite, styled with Tailwind CSS v4, hand-built SVG pitch diagrams (no
  charting library needed for the pitch views; `recharts` is installed for any additional stat
  charts you add).
  - Note: colors/fonts are applied via Tailwind's arbitrary-value syntax (e.g. `bg-[#0A1210]`)
    rather than named theme colors — in this project's specific Vite 8 + Tailwind 4 combo,
    `@theme`-based custom tokens register but don't generate any utility classes. See the comment
    at the top of `frontend/src/index.css` for details if you hit the same thing.
- **Data:** static JSON (`data/match_data.json`), no backend required — this is a single-match
  dataset, so a database adds hosting complexity for no benefit.
- **Scraper:** a small Node ETL step (`/scraper`) that pulls additional public stats (per-player
  foul/goal involvements, narrative context) into `data/extended_stats.json` for manual review —
  see `scraper/README.md`.

## Running locally

```bash
cd frontend
npm install
npm run dev
```

## Deploying to GitHub Pages

```bash
cd frontend
npm install -D gh-pages
# add "homepage": "https://<you>.github.io/<repo>" to package.json
# add scripts: "predeploy": "npm run build", "deploy": "gh-pages -d dist"
npm run deploy
```

## New Ideas I am working on

- Hand-tag real shot/pass coordinates from the match replay to replace the approximated pitch
  positions (label the switch clearly once done).
- Replace the pressing-intensity proxy with true PPDA once/if event-level data becomes available.
- Add pass-network diagrams (average position + pass volume between players) — needs event data,
  see the methodology note above.

## Sources

- https://playerstats.football/fixture/france/spain/2026-07-14
- https://www.espn.com/soccer/match/_/gameId/760514/spain-france
- https://newsletter.fotmob.com/p/spain-masterclass-knocks-out-france
- https://www.espn.com/soccer/story/_/id/49362319/kylian-mbappe-critical-tactics-sloppy-france-loss
- https://www.managingmadrid.com/real-madrid-cf-players/110046/spain-end-france-and-mbappes-2026-world-cup-hopes-with-semi-final-upset
