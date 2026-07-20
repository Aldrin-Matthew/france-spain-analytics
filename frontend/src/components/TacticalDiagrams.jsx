import Pitch from './Pitch';

// Small reusable player token
function PlayerDot({ x, y, color, label, ring = false }) {
  return (
    <g>
      {ring && <circle cx={x} cy={y} r={16} fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />}
      <circle cx={x} cy={y} r={9} fill={color} stroke="var(--chalk)" strokeWidth="1.5" />
      {label && (
        <text x={x} y={y - 16} textAnchor="middle" fontSize="13" fill="var(--chalk)" fontFamily="var(--font-mono)">
          {label}
        </text>
      )}
    </g>
  );
}

export function MbappeDiagram() {
  const striker = { x: 590, y: 225 };
  const defenders = [
    { x: 545, y: 190 },
    { x: 555, y: 260 },
    { x: 500, y: 225 },
  ];
  const shots = [
    { x: 560, y: 200 },
    { x: 575, y: 245 },
    { x: 500, y: 100, label: 'FK' },
  ];

  return (
    <Pitch>
      {/* compactness boundary Spain kept around Mbappé */}
      <path
        d="M 460 150 Q 640 130 640 225 Q 640 320 460 300 Q 480 225 460 150 Z"
        fill="var(--spain-red)"
        opacity="0.08"
        stroke="var(--spain-red)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      <text x={550} y={135} textAnchor="middle" fontSize="13" fill="var(--spain-red)" opacity="0.85">
        compact Spain block
      </text>

      {defenders.map((d, i) => (
        <PlayerDot key={i} x={d.x} y={d.y} color="var(--spain-red)" />
      ))}

      {shots.map((s, i) => (
        <g key={i}>
          <line x1={s.x - 6} y1={s.y - 6} x2={s.x + 6} y2={s.y + 6} stroke="var(--gold)" strokeWidth="2.5" />
          <line x1={s.x - 6} y1={s.y + 6} x2={s.x + 6} y2={s.y - 6} stroke="var(--gold)" strokeWidth="2.5" />
        </g>
      ))}

      <PlayerDot x={striker.x} y={striker.y} color="var(--france-blue)" label="Mbappé" ring />

      {/* offside marker */}
      <line x1={520} y1={40} x2={520} y2={410} stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
      <text x={520} y={30} textAnchor="middle" fontSize="12" fill="var(--gold)">
        offside line (caught 2×)
      </text>
    </Pitch>
  );
}

export function MidfieldOverloadDiagram() {
  const spain = [
    { x: 330, y: 160, label: 'Rodri' },
    { x: 330, y: 225, label: 'F. Ruiz' },
    { x: 330, y: 290, label: 'D. Olmo' },
  ];
  const france = [
    { x: 390, y: 190, label: 'Tchouaméni' },
    { x: 390, y: 260, label: 'Rabiot' },
  ];

  return (
    <Pitch>
      <rect x={295} y={130} width={130} height={190} fill="var(--gold)" opacity="0.06" stroke="var(--gold)" strokeDasharray="5 4" strokeWidth="1.5" />
      <text x={360} y={118} textAnchor="middle" fontSize="13" fill="var(--gold)">
        central midfield zone
      </text>

      {spain.map((p, i) => (
        <PlayerDot key={i} x={p.x} y={p.y} color="var(--spain-red)" label={p.label} />
      ))}
      {france.map((p, i) => (
        <PlayerDot key={i} x={p.x} y={p.y} color="var(--france-blue)" label={p.label} />
      ))}

      <text x={360} y={400} textAnchor="middle" fontSize="15" fill="var(--chalk)" fontWeight="600">
        3 vs 2 — Spain's midfield outnumbered France's pivot
      </text>
    </Pitch>
  );
}

export function OliseDiagram() {
  const track = [
    { x: 330, y: 400 },
    { x: 440, y: 385 },
    { x: 560, y: 365 },
  ];

  return (
    <Pitch>
      <polyline
        points={track.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="var(--spain-red)"
        strokeWidth="2"
        strokeDasharray="2 6"
        strokeLinecap="round"
        opacity="0.8"
      />
      {track.map((p, i) => (
        <PlayerDot key={`c${i}`} x={p.x} y={p.y - 22} color="var(--spain-red)" label={i === 0 ? 'Cucurella' : undefined} />
      ))}
      <polyline
        points={track.map((p) => `${p.x},${p.y - 40}`).join(' ')}
        fill="none"
        stroke="var(--france-blue)"
        strokeWidth="2"
        strokeDasharray="2 6"
        opacity="0.5"
      />
      {track.map((p, i) => (
        <PlayerDot
          key={`o${i}`}
          x={p.x}
          y={p.y - 62}
          color="var(--france-blue)"
          label={i === 0 ? 'Olise' : undefined}
          ring={i === track.length - 1}
        />
      ))}
      <text x={450} y={430} textAnchor="middle" fontSize="13" fill="var(--spain-red)" opacity="0.85">
        Cucurella tracks Olise the full match
      </text>
    </Pitch>
  );
}
