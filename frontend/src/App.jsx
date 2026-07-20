import { useEffect, useState } from 'react';
import data from './data/matchData.json';
import StatBar from './components/StatBar';
import MatchDashboard from './components/MatchDashboard';
import SectionNav from './components/SectionNav';
import { MbappeDiagram, OliseDiagram, MidfieldOverloadDiagram, LineupsDiagram } from './components/TacticalDiagrams';
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
import dembelePhoto from './assets/players/dembele.jpg';

const { meta, team_stats, tactical_analysis, narrative_facts, pressing_proxy, player_stats, lineups } = data;

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
  'Ousmane Dembélé': dembelePhoto,
};

function Eyebrow({ children }) {
  return <p className="mb-2 font-mono text-xs uppercase tracking-[0.12em] text-[#E8B44A]">{children}</p>;
}

function SectionHead({ eyebrow, title }) {
  return (
    <div className="mb-8">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="max-w-[22ch] text-2xl uppercase md:text-4xl">{title}</h2>
    </div>
  );
}

function Chip({ label, value, small }) {
  return (
    <div className={`min-w-[70px] rounded-lg border border-[#F3F0E6]/12 ${small ? 'px-2.5 py-1.5' : 'min-w-[88px] px-3.5 py-2.5'}`}>
      <span className={`block font-display text-[#F3F0E6] ${small ? 'text-lg' : 'text-2xl'}`}>{value}</span>
      <span className={`block capitalize text-[#F3F0E6]/62 ${small ? 'text-[0.65rem]' : 'text-xs'}`}>{label.replaceAll('_', ' ')}</span>
    </div>
  );
}

function PlayerHead({ player, small }) {
  const photo = PLAYER_PHOTOS[player.name];
  const size = small ? 'h-12 w-12' : 'h-16 w-16';
  return (
    <div className={`flex items-start gap-4 ${small ? 'mb-1.5' : ''}`}>
      {photo && (
        <img
          className={`${size} shrink-0 rounded-full border-2 border-[#E8B44A] object-cover object-top`}
          src={photo}
          alt={player.name}
        />
      )}
      <div className="flex-1">
        <div className={small ? 'md:min-h-12' : ''}>
          <Eyebrow>{player.name} · {player.role}</Eyebrow>
        </div>
        {small ? (
          <h4 className="font-display text-lg leading-snug normal-case text-[#E8B44A] md:min-h-[6.25rem]">{player.headline}</h4>
        ) : (
          <h3 className="font-display text-xl text-[#E8B44A] md:text-2xl">{player.headline}</h3>
        )}
      </div>
    </div>
  );
}

function PlayerSpotlight({ player, diagram }) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr] md:gap-10">
      <div className="rounded-xl border border-[#F3F0E6]/12 bg-[#081C15] p-3">{diagram}</div>
      <div>
        <PlayerHead player={player} />
        <p className="mt-4 text-[#F3F0E6]/62">{player.summary}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {Object.entries(player.key_stats).map(([k, v]) => (
            <Chip key={k} label={k} value={v} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EngineCard({ player }) {
  return (
    <div className="rounded-xl border border-[#F3F0E6]/12 bg-white/[0.02] p-5">
      <PlayerHead player={player} small />
      <p className="mt-3 text-sm text-[#F3F0E6]/62">{player.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {Object.entries(player.key_stats).map(([k, v]) => (
          <Chip key={k} label={k} value={v} small />
        ))}
      </div>
    </div>
  );
}

function FactList({ facts }) {
  return (
    <ul className="grid gap-4">
      {facts.map((f, i) => (
        <li key={i} className="flex items-start gap-3 text-[#F3F0E6]/62">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8B44A]" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}

function FormationBrief({ team, colorClass, formation, coach, attacking, defending }) {
  return (
    <div>
      <p className={`font-mono text-sm uppercase tracking-[0.1em] ${colorClass}`}>{team} · {formation}</p>
      <p className="mt-0.5 text-xs text-[#F3F0E6]/62">{coach}</p>
      <p className="mt-3 text-sm text-[#F3F0E6]/62"><strong className="text-[#F3F0E6]">Attacking:</strong> {attacking}</p>
      <p className="mt-2 text-sm text-[#F3F0E6]/62"><strong className="text-[#F3F0E6]">Defending:</strong> {defending}</p>
    </div>
  );
}

function Credits() {
  return (
    <div className="mt-10 border-t border-[#F3F0E6]/12 pt-6 text-sm text-[#F3F0E6]/62">
      <p>
        Data compiled from public match-stat sources. Pitch-map positions are illustrative
        approximations, not optical tracking data — see the dataset's methodology note for details.
      </p>
      <p className="mt-2 break-words font-mono text-xs opacity-70">Sources: {meta.sources.join(' · ')}</p>
      <p className="mt-2 font-mono text-xs opacity-70">
        Player photos: Bryan Berlin / WikiPortraits, via Wikimedia Commons, licensed{' '}
        <a className="text-[#E8B44A]" href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.
        {' '}Álex Baena photo: Pedro Semitiel, via Wikimedia Commons, licensed{' '}
        <a className="text-[#E8B44A]" href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>.
      </p>
    </div>
  );
}

const engineRoomPlayers = tactical_analysis.players.filter(
  (p) => p.neutralization_method === 'not_applicable_attacking_engine'
);

const SECTIONS = [
  {
    id: 'team-stats',
    label: 'Team Stats',
    content: (
      <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center gap-12 px-6 py-16 md:px-10">
        <header>
          <Eyebrow>{meta.competition} — {meta.round}</Eyebrow>
          <h1 className="max-w-[14ch] text-4xl leading-[1.02] uppercase md:text-6xl">
            How Spain neutralised <span className="text-[#E8B44A]">France</span>
          </h1>
          <div className="mt-6 flex items-baseline gap-4 font-display">
            <span className="text-lg uppercase text-[#F3F0E6]/62">France</span>
            <span className="text-3xl tracking-wide md:text-4xl">{meta.final_score.France} – {meta.final_score.Spain}</span>
            <span className="text-lg uppercase text-[#F3F0E6]/62">Spain</span>
          </div>
          <p className="mt-3 font-mono text-sm text-[#F3F0E6]/62">{meta.venue} · {meta.date}</p>
        </header>

        <div>
          <SectionHead eyebrow="Team stats" title="The numbers behind the shutout" />
          <div className="grid gap-5">
            <StatBar label="Possession" leftValue={team_stats.France.possession_pct} rightValue={team_stats.Spain.possession_pct} suffix="%" />
            <StatBar label="Expected goals (xG)" leftValue={team_stats.France.xg} rightValue={team_stats.Spain.xg} />
            <StatBar label="Shots on target" leftValue={team_stats.France.shots_on_target} rightValue={team_stats.Spain.shots_on_target} />
            <StatBar label="Tackles" leftValue={team_stats.France.tackles} rightValue={team_stats.Spain.tackles} />
            <StatBar label="Passes completed" leftValue={team_stats.France.passes} rightValue={team_stats.Spain.passes} />
            <StatBar label="Fouls" leftValue={team_stats.France.fouls} rightValue={team_stats.Spain.fouls} />
          </div>
          <div className="mt-8 border-t border-dashed border-[#F3F0E6]/12 pt-6">
            <StatBar
              label="Opponent passes per tackle (pressing proxy)"
              leftValue={pressing_proxy.France.opponent_passes_per_tackle}
              rightValue={pressing_proxy.Spain.opponent_passes_per_tackle}
            />
            <p className="mt-3 max-w-[62ch] text-sm text-[#F3F0E6]/62">
              <strong className="text-[#E8B44A]">Not standard PPDA.</strong> {pressing_proxy.methodology}
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'lineups',
    label: 'Starting XI',
    content: (
      <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center px-6 py-16 md:px-10">
        <SectionHead eyebrow="Starting XI" title="How both sides lined up" />
        <div className="rounded-xl border border-[#F3F0E6]/12 bg-[#081C15] p-3">
          <LineupsDiagram lineups={lineups} />
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <FormationBrief
            team="France"
            colorClass="text-[#4C7CE0]"
            formation={lineups.France.formation}
            coach={`Coach: ${lineups.France.coach}`}
            attacking="Rabiot and Tchouaméni sat as a flat double pivot in front of the back four, looking to release Dembélé, Barcola and Olise into the channels with Mbappé central."
            defending="The front four pressed high to start, but the trigger wasn't coordinated — leaving Rabiot and Tchouaméni exposed to Spain's midfield three in the space behind."
          />
          <FormationBrief
            team="Spain"
            colorClass="text-[#E0524C]"
            formation={lineups.Spain.formation}
            coach={`Coach: ${lineups.Spain.coach}`}
            attacking="Rodri dropped between the centre-backs to build from deep while Fabián Ruiz and Dani Olmo pushed on, creating the 3v2 overload in midfield."
            defending="A compact mid-block — Cucurella man-marking Olise down the right, and the back four squeezing space around Mbappé rather than chasing him."
          />
        </div>
      </div>
    ),
  },
  {
    id: 'the-system',
    label: 'The System',
    content: (
      <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center px-6 py-16 md:px-10">
        <SectionHead eyebrow="The system" title={tactical_analysis.team_level.headline} />
        <div className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr] md:gap-10">
          <div className="rounded-xl border border-[#F3F0E6]/12 bg-[#081C15] p-3">
            <MidfieldOverloadDiagram />
          </div>
          <div>
            <p className="text-[#F3F0E6]/62">{tactical_analysis.team_level.summary}</p>
            <blockquote className="mt-6 border-l-3 border-[#E8B44A] pl-4 italic text-[#F3F0E6]">
              “{tactical_analysis.team_level.quote.point}”
              <cite className="mt-2 block text-sm not-italic text-[#F3F0E6]/62">— {tactical_analysis.team_level.quote.speaker}</cite>
            </blockquote>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'engine-room',
    label: "Engine Room",
    content: (
      <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center px-6 py-16 md:px-10">
        <SectionHead eyebrow="Spain's engine room" title="The players who made the overload count" />
        <div className="grid gap-6 md:grid-cols-3">
          {engineRoomPlayers.map((p) => (
            <EngineCard key={p.name} player={p} />
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'player-spotlight',
    label: 'Player Spotlight',
    content: (
      <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center gap-12 px-6 py-16 md:px-10">
        <div>
          <SectionHead eyebrow="Player spotlight" title="Neutralising the Golden Boot leader" />
          <PlayerSpotlight player={tactical_analysis.players[0]} diagram={<MbappeDiagram />} />
        </div>
        <div className="border-t border-[#F3F0E6]/12 pt-12">
          <SectionHead eyebrow="Player spotlight" title="Marking Olise out of the game" />
          <PlayerSpotlight player={tactical_analysis.players[1]} diagram={<OliseDiagram />} />
        </div>
      </div>
    ),
  },
  {
    id: 'full-match-stats',
    label: 'Full Match Stats',
    content: (
      <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6 py-16 md:px-10">
        <SectionHead eyebrow="Full match stats" title="Who stood out, at a glance" />
        <p className="-mt-4 mb-6 max-w-[68ch] text-sm text-[#F3F0E6]/62">
          League-wide averages and the top 5 performers across both squads, in the three numbers
          that mattered most to this match. <strong className="text-[#E8B44A]">Goal involvements</strong> combines
          goals + assists. Data pulled from{' '}
          <a className="text-[#E8B44A]" href="https://playerstats.football/fixture/france/spain/2026-07-14" target="_blank" rel="noreferrer">playerstats.football</a>.
        </p>
        <MatchDashboard playerStats={player_stats} teamStats={team_stats} photos={PLAYER_PHOTOS} />
      </div>
    ),
  },
  {
    id: 'match-narrative',
    label: 'Match Narrative',
    content: (
      <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center px-6 py-16 md:px-10">
        <SectionHead eyebrow="Match narrative" title="Key facts" />
        <FactList facts={narrative_facts} />
        <Credits />
      </div>
    ),
  },
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIndex((i) => Math.min(SECTIONS.length - 1, i + 1));
  const goTo = (i) => setActiveIndex(Math.max(0, Math.min(SECTIONS.length - 1, i)));

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}vw)` }}
      >
        {SECTIONS.map((s, i) => (
          <section
            key={s.id}
            className={`h-full w-screen shrink-0 overflow-y-auto transition-opacity duration-500 ease-in-out
              ${i === activeIndex ? 'opacity-100' : 'opacity-90'}`}
          >
            {s.content}
          </section>
        ))}
      </div>

      <SectionNav sections={SECTIONS} activeIndex={activeIndex} onPrev={goPrev} onNext={goNext} onJump={goTo} />
    </div>
  );
}
