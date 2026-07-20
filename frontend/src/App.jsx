import data from './data/matchData.json';
import StatBar from './components/StatBar';
import MatchDashboard from './components/MatchDashboard';
import { MbappeDiagram, OliseDiagram, MidfieldOverloadDiagram } from './components/TacticalDiagrams';
import mbappePhoto from './assets/players/mbappe.jpg';
import olisePhoto from './assets/players/olise.jpg';
import rodriPhoto from './assets/players/rodri.jpg';
import fabianRuizPhoto from './assets/players/fabian-ruiz.jpg';
import daniOlmoPhoto from './assets/players/dani-olmo.jpg';
import tchouameniPhoto from './assets/players/tchouameni.jpg';
import cucurellaPhoto from './assets/players/cucurella.jpg';
import porroPhoto from './assets/players/porro.jpg';
import oyarzabalPhoto from './assets/players/oyarzabal.jpg';
import cherkiPhoto from './assets/players/cherki.jpg';
import barcolaPhoto from './assets/players/barcola.jpg';
import douePhoto from './assets/players/doue.jpg';
import baenaPhoto from './assets/players/baena.jpg';
import './App.css';

const { meta, team_stats, tactical_analysis, narrative_facts, timeline, pressing_proxy, player_stats } = data;

const PLAYER_PHOTOS = {
  'Kylian Mbappé': mbappePhoto,
  'Michael Olise': olisePhoto,
  'Rodri': rodriPhoto,
  'Fabián Ruiz': fabianRuizPhoto,
  'Dani Olmo': daniOlmoPhoto,
  'Aurélien Tchouaméni': tchouameniPhoto,
  'Marc Cucurella': cucurellaPhoto,
  'Pedro Porro': porroPhoto,
  'Mikel Oyarzabal': oyarzabalPhoto,
  'Rayan Cherki': cherkiPhoto,
  'Bradley Barcola': barcolaPhoto,
  'Désiré Doué': douePhoto,
  'Álex Baena': baenaPhoto,
};

function Section({ eyebrow, title, children, id }) {
  return (
    <section className="section" id={id}>
      <div className="section__head">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function PlayerSpotlight({ player, diagram }) {
  return (
    <div className="spotlight">
      <div className="spotlight__pitch">{diagram}</div>
      <div className="spotlight__text">
        <div className="player-head">
          {PLAYER_PHOTOS[player.name] && (
            <img className="player-photo" src={PLAYER_PHOTOS[player.name]} alt={player.name} />
          )}
          <div>
            <p className="eyebrow">{player.name} · {player.role}</p>
            <h3>{player.headline}</h3>
          </div>
        </div>
        <p className="spotlight__summary">{player.summary}</p>
        <div className="chip-row">
          {Object.entries(player.key_stats).map(([k, v]) => (
            <div className="chip" key={k}>
              <span className="chip__value">{v}</span>
              <span className="chip__label">{k.replaceAll('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EngineCard({ player }) {
  return (
    <div className="engine-card">
      <div className="player-head player-head--sm">
        {PLAYER_PHOTOS[player.name] && (
          <img className="player-photo player-photo--sm" src={PLAYER_PHOTOS[player.name]} alt={player.name} />
        )}
        <div>
          <p className="eyebrow">{player.name} · {player.role}</p>
          <h4>{player.headline}</h4>
        </div>
      </div>
      <p className="engine-card__summary">{player.summary}</p>
      <div className="chip-row">
        {Object.entries(player.key_stats).map(([k, v]) => (
          <div className="chip chip--sm" key={k}>
            <span className="chip__value">{v}</span>
            <span className="chip__label">{k.replaceAll('_', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">{meta.competition} — {meta.round}</p>
        <h1>
          How Spain neutralised <span className="hero__accent">France</span>
        </h1>
        <div className="hero__score">
          <span className="hero__team">France</span>
          <span className="hero__result">{meta.final_score.France} – {meta.final_score.Spain}</span>
          <span className="hero__team">Spain</span>
        </div>
        <p className="hero__meta">{meta.venue} · {meta.date}</p>
        <p className="hero__dek">
          France arrived as tournament favourites, top-scorers of the knockout rounds with Kylian Mbappé
          leading the Golden Boot race. Spain conceded nothing. Here's the tactical breakdown of how.
        </p>
      </header>

      <Section eyebrow="Team stats" title="The numbers behind the shutout">
        <div className="stat-grid">
          <StatBar label="Possession" leftValue={team_stats.France.possession_pct} rightValue={team_stats.Spain.possession_pct} suffix="%" />
          <StatBar label="Expected goals (xG)" leftValue={team_stats.France.xg} rightValue={team_stats.Spain.xg} />
          <StatBar label="Shots on target" leftValue={team_stats.France.shots_on_target} rightValue={team_stats.Spain.shots_on_target} />
          <StatBar label="Tackles" leftValue={team_stats.France.tackles} rightValue={team_stats.Spain.tackles} />
          <StatBar label="Passes completed" leftValue={team_stats.France.passes} rightValue={team_stats.Spain.passes} />
          <StatBar label="Fouls" leftValue={team_stats.France.fouls} rightValue={team_stats.Spain.fouls} />
        </div>
        <div className="proxy-note">
          <StatBar
            label="Opponent passes per tackle (pressing proxy)"
            leftValue={pressing_proxy.France.opponent_passes_per_tackle}
            rightValue={pressing_proxy.Spain.opponent_passes_per_tackle}
          />
          <p className="proxy-note__text">
            <strong>Not standard PPDA.</strong> {pressing_proxy.methodology}
          </p>
        </div>
      </Section>

      <Section eyebrow="The system" title={tactical_analysis.team_level.headline}>
        <div className="spotlight">
          <div className="spotlight__pitch"><MidfieldOverloadDiagram /></div>
          <div className="spotlight__text">
            <p className="spotlight__summary">{tactical_analysis.team_level.summary}</p>
            <blockquote>
              “{tactical_analysis.team_level.quote.point}”
              <cite>— {tactical_analysis.team_level.quote.speaker}</cite>
            </blockquote>
          </div>
        </div>
      </Section>

      <Section eyebrow="Spain's engine room" title="The players who made the overload count">
        <div className="engine-grid">
          {tactical_analysis.players
            .filter((p) => p.neutralization_method === 'not_applicable_attacking_engine')
            .map((p) => (
              <EngineCard key={p.name} player={p} />
            ))}
        </div>
      </Section>

      <Section eyebrow="Player spotlight" title="Neutralising the Golden Boot leader">
        <PlayerSpotlight player={tactical_analysis.players[0]} diagram={<MbappeDiagram />} />
      </Section>

      <Section eyebrow="Player spotlight" title="Marking Olise out of the game">
        <PlayerSpotlight player={tactical_analysis.players[1]} diagram={<OliseDiagram />} />
      </Section>

      <Section eyebrow="Full match stats" title="Who stood out, at a glance">
        <p className="section__intro">
          League-wide averages and the top 5 performers across both squads, in the three numbers
          that mattered most to this match. <strong>Goal involvements</strong> combines goals + assists.
          Data pulled from{' '}
          <a href="https://playerstats.football/fixture/france/spain/2026-07-14" target="_blank" rel="noreferrer">playerstats.football</a>.
        </p>
        <MatchDashboard playerStats={player_stats} teamStats={team_stats} photos={PLAYER_PHOTOS} />
      </Section>

      <Section eyebrow="Match narrative" title="Key facts">
        <ul className="fact-list">
          {narrative_facts.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Timeline" title="How it unfolded">
        <ol className="timeline">
          {timeline.map((e, i) => (
            <li key={i} className={`timeline__item timeline__item--${e.team === 'Spain' ? 'spain' : 'france'}`}>
              <span className="timeline__minute">{e.minute}'</span>
              <span className="timeline__desc">
                {e.type === 'goal' && `GOAL — ${e.player}${e.assist ? ` (assist: ${e.assist})` : ''} ${e.subtype === 'penalty' ? '[pen]' : ''}`}
                {e.type === 'disallowed_goal' && `Disallowed goal — ${e.player} (${e.reason})`}
                {e.type === 'substitution' && `${e.player_off} off, ${e.player_on} on${e.reason ? ` (${e.reason})` : ''}`}
                {e.type === 'card' && `Yellow card — ${e.player}`}
                {e.type === 'foul' && `Foul — ${e.player}`}
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <footer className="footer">
        <p>Data compiled from public match-stat sources. Pitch-map positions are illustrative approximations, not optical tracking data — see the dataset's methodology note for details.</p>
        <p className="footer__sources">Sources: {meta.sources.join(' · ')}</p>
        <p className="footer__sources">
          Player photos: Bryan Berlin / WikiPortraits, via Wikimedia Commons, licensed{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.
          {' '}Álex Baena photo: Pedro Semitiel, via Wikimedia Commons, licensed{' '}
          <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>.
        </p>
      </footer>
    </div>
  );
}
