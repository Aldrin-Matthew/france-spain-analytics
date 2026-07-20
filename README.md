# How Spain Neutralised France — World Cup 2026 Semi-Final Tactical Analysis

An interactive breakdown of Spain's 2-0 win over France in the FIFA World Cup 2026 semi-final
(Dallas Stadium, 14 July 2026) — focused on how Luis de la Fuente's side shut down a France team
that arrived as tournament favourites, top scorers of the knockout rounds, led by Golden Boot
contender Kylian Mbappé.

**[Live demo →](#)** *(add your deployed link here once published)*

## What's in here

- Team-level tactical story: how Spain's midfield trio (Rodri, Fabián Ruiz, Dani Olmo) created a
  3v2 overload against France's double pivot, and why France's own high press collapsed.
- A labeled pressing-intensity proxy (opponent passes per tackle) — explicitly **not** true PPDA;
  see "Data & methodology" below for why.
- **Spain's engine room**: individual breakdowns of Rodri (deep control), Fabián Ruiz (progression),
  and Dani Olmo (creation, assisted the second goal).
- Player spotlights with pitch diagrams:
  - **Kylian Mbappé** — isolated by a compact defensive block rather than man-marked; led the team
    in box touches but managed only one shot from open play.
  - **Michael Olise** — man-marked directly by left-back Marc Cucurella for the full 90 minutes.
- Full team stat comparison (possession, xG, shots, tackles, passing, fouls).
- Match timeline (goals, cards, substitutions, disallowed goal).

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

If you want the real thing, the only reliable free path is hand-tagging events from the match replay
— see "Next steps" below.

## Stack

- **Frontend:** React + Vite, hand-built SVG pitch diagrams (no charting library needed for the
  pitch views; `recharts` is installed for any additional stat charts you add).
- **Data:** static JSON (`data/match_data.json`), no backend required — this is a single-match
  dataset, so a database adds hosting complexity for no benefit. If you want to show off a
  MongoDB/Node pipeline for your portfolio, use it in a `/scraper` ETL step that *produces* this
  JSON file, rather than serving the live site from a database.

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

## Next steps / ideas to extend

- Hand-tag real shot/pass coordinates from the match replay to replace the approximated pitch
  positions (label the switch clearly once done).
- Replace the pressing-intensity proxy with true PPDA once/if event-level data becomes available.
- Add pass-network diagrams (average position + pass volume between players) — needs event data,
  see methodology note above.
- Extend player spotlights to Ousmane Dembélé (France's most dangerous outlet — 2 shots, 2 on
  target) for balance, since the story so far leans heavily on Spain's side of the ball.
- Add a French-language toggle for LinkedIn/Instagram cross-posting to French football audiences.

## Sources

- https://playerstats.football/fixture/france/spain/2026-07-14
- https://www.espn.com/soccer/match/_/gameId/760514/spain-france
- https://newsletter.fotmob.com/p/spain-masterclass-knocks-out-france
- https://www.espn.com/soccer/story/_/id/49362319/kylian-mbappe-critical-tactics-sloppy-france-loss
- https://www.managingmadrid.com/real-madrid-cf-players/110046/spain-end-france-and-mbappes-2026-world-cup-hopes-with-semi-final-upset
