import { useState } from 'react';
import { abbreviateName } from '../utils/names';

const METRICS = [
  { key: 'tackles', label: 'Tackles', kpiLabel: 'Avg tackles / player' },
  { key: 'goal_involvements', label: 'Goal involvements', kpiLabel: 'Avg goal involvements / player' },
  { key: 'key_passes', label: 'Key passes', kpiLabel: 'Avg key passes / player' },
];

function average(players, key) {
  if (players.length === 0) return 0;
  return players.reduce((sum, p) => sum + p[key], 0) / players.length;
}

function topFive(players, key) {
  return [...players]
    .filter((p) => p[key] > 0)
    .sort((a, b) => b[key] - a[key])
    .slice(0, 5);
}

function KpiTile({ value, label, borderClass = 'border-[#F3F0E6]/12' }) {
  return (
    <div className={`rounded-xl border ${borderClass} bg-white/[0.02] p-6 text-center`}>
      <span className="block font-display text-4xl leading-none text-[#E8B44A]">{value}</span>
      <span className="mt-2.5 block text-xs uppercase tracking-[0.05em] text-[#F3F0E6]/62">{label}</span>
    </div>
  );
}

function XgTile({ teamFilter, teamStats }) {
  if (teamFilter === 'All') {
    return (
      <div className="rounded-xl border border-[#E8B44A] bg-white/[0.02] p-6 text-center">
        <span className="inline-flex items-baseline gap-2 font-display text-4xl leading-none">
          <span className="text-[#4C7CE0]">{teamStats.France.xg.toFixed(2)}</span>
          <span className="text-lg text-[#F3F0E6]/62">–</span>
          <span className="text-[#E0524C]">{teamStats.Spain.xg.toFixed(2)}</span>
        </span>
        <span className="mt-2.5 block text-xs uppercase tracking-[0.05em] text-[#F3F0E6]/62">xG (France – Spain)</span>
      </div>
    );
  }
  const borderClass = teamFilter === 'France' ? 'border-[#4C7CE0]' : 'border-[#E0524C]';
  return <KpiTile value={teamStats[teamFilter].xg.toFixed(2)} label={`${teamFilter} xG`} borderClass={borderClass} />;
}

export default function MatchDashboard({ playerStats, teamStats, photos }) {
  const [teamFilter, setTeamFilter] = useState('All');

  const allPlayers = [
    ...playerStats.France.map((p) => ({ ...p, team: 'France' })),
    ...playerStats.Spain.map((p) => ({ ...p, team: 'Spain' })),
  ];
  const players = teamFilter === 'All' ? allPlayers : allPlayers.filter((p) => p.team === teamFilter);

  const photoByName = Object.fromEntries(
    Object.entries(photos).map(([fullName, src]) => [abbreviateName(fullName), src])
  );

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {['All', 'France', 'Spain'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTeamFilter(t)}
            className={`rounded-md border px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.06em] transition
              ${teamFilter === t ? 'border-[#E8B44A] bg-[#E8B44A] text-[#0A1210]' : 'border-[#F3F0E6]/12 text-[#F3F0E6]/62 hover:text-[#F3F0E6]'}`}
          >
            {t === 'All' ? 'Both teams' : t}
          </button>
        ))}
      </div>

      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <KpiTile key={m.key} value={average(players, m.key).toFixed(1)} label={m.kpiLabel} />
        ))}
        <XgTile teamFilter={teamFilter} teamStats={teamStats} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {METRICS.map((m) => {
          const top = topFive(players, m.key);
          const max = top[0]?.[m.key] || 1;
          return (
            <div key={m.key} className="rounded-xl border border-[#F3F0E6]/12 p-5">
              <h4 className="mb-4 font-display text-base uppercase text-[#F3F0E6]">Most {m.label.toLowerCase()}</h4>
              {top.length === 0 ? (
                <p className="text-sm italic text-[#F3F0E6]/62">No {m.label.toLowerCase()} recorded.</p>
              ) : (
                <ol className="grid gap-2.5">
                  {top.map((p, i) => (
                    <li key={`${p.team}-${p.name}`} className="grid grid-cols-[1.2rem_1.6rem_1fr_1.4rem] grid-rows-2 items-center gap-x-2.5">
                      <span className="font-mono text-sm text-[#F3F0E6]/62">{i + 1}</span>
                      {photoByName[p.name] ? (
                        <img className="h-7 w-7 rounded-full object-cover object-top" src={photoByName[p.name]} alt={p.name} />
                      ) : (
                        <span className={`h-2 w-2 rounded-full ${p.team === 'France' ? 'bg-[#4C7CE0]' : 'bg-[#E0524C]'}`} />
                      )}
                      <span className="col-start-3 row-start-1 text-sm text-[#F3F0E6]">{p.name}</span>
                      <span className="col-start-3 row-start-2 mt-1 block h-1.5 overflow-hidden rounded-sm bg-white/[0.06]">
                        <span
                          className={`block h-full ${p.team === 'France' ? 'bg-[#4C7CE0]' : 'bg-[#E0524C]'}`}
                          style={{ width: `${(p[m.key] / max) * 100}%` }}
                        />
                      </span>
                      <span className="col-start-4 row-start-1 text-right font-mono text-sm text-[#E8B44A]">{p[m.key]}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
