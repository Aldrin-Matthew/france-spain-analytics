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

function XgTile({ teamFilter, teamStats }) {
  if (teamFilter === 'All') {
    return (
      <div className="kpi-tile kpi-tile--xg">
        <span className="kpi-tile__value kpi-tile__value--split">
          <span className="kpi-tile__value--france">{teamStats.France.xg.toFixed(2)}</span>
          <span className="kpi-tile__value-sep">–</span>
          <span className="kpi-tile__value--spain">{teamStats.Spain.xg.toFixed(2)}</span>
        </span>
        <span className="kpi-tile__label">xG (France – Spain)</span>
      </div>
    );
  }
  return (
    <div className={`kpi-tile kpi-tile--xg kpi-tile--${teamFilter.toLowerCase()}`}>
      <span className="kpi-tile__value">{teamStats[teamFilter].xg.toFixed(2)}</span>
      <span className="kpi-tile__label">{teamFilter} xG</span>
    </div>
  );
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
    <div className="dashboard">
      <div className="dashboard__filters">
        {['All', 'France', 'Spain'].map((t) => (
          <button
            key={t}
            className={`team-filter-btn${teamFilter === t ? ' team-filter-btn--active' : ''}`}
            onClick={() => setTeamFilter(t)}
          >
            {t === 'All' ? 'Both teams' : t}
          </button>
        ))}
      </div>

      <div className="dashboard__kpis">
        {METRICS.map((m) => (
          <div className="kpi-tile" key={m.key}>
            <span className="kpi-tile__value">{average(players, m.key).toFixed(1)}</span>
            <span className="kpi-tile__label">{m.kpiLabel}</span>
          </div>
        ))}
        <XgTile teamFilter={teamFilter} teamStats={teamStats} />
      </div>

      <div className="dashboard__leaderboards">
        {METRICS.map((m) => {
          const top = topFive(players, m.key);
          const max = top[0]?.[m.key] || 1;
          return (
            <div className="leaderboard" key={m.key}>
              <h4 className="leaderboard__title">Most {m.label.toLowerCase()}</h4>
              {top.length === 0 ? (
                <p className="leaderboard__empty">No {m.label.toLowerCase()} recorded.</p>
              ) : (
                <ol className="leaderboard__list">
                  {top.map((p, i) => (
                    <li className="leaderboard__row" key={`${p.team}-${p.name}`}>
                      <span className="leaderboard__rank">{i + 1}</span>
                      {photoByName[p.name] ? (
                        <img className="leaderboard__photo" src={photoByName[p.name]} alt={p.name} />
                      ) : (
                        <span className={`team-dot team-dot--${p.team === 'France' ? 'france' : 'spain'}`} />
                      )}
                      <span className="leaderboard__name">{p.name}</span>
                      <span className="leaderboard__bar-track">
                        <span
                          className={`leaderboard__bar-fill leaderboard__bar-fill--${p.team === 'France' ? 'france' : 'spain'}`}
                          style={{ width: `${(p[m.key] / max) * 100}%` }}
                        />
                      </span>
                      <span className="leaderboard__value">{p[m.key]}</span>
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
