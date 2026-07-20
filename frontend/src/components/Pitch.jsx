// Pitch.jsx — a full-size tactical pitch drawn in SVG (105m x 68m scaled to a 700x450 viewBox).
// Coordinates for markers passed as children should be in the same 0-700 / 0-450 space,
// where x=0 is France's defensive end and x=700 is Spain's defensive end (left→right attack).
export default function Pitch({ children, height = 450 }) {
  const W = 700;
  const H = 450;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', maxHeight: height, display: 'block' }}
      role="img"
      aria-label="Football pitch tactical diagram"
    >
      <rect x={0} y={0} width={W} height={H} fill="var(--pitch-mid)" />
      {/* subtle mow stripes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect
          key={i}
          x={(i * W) / 10}
          y={0}
          width={W / 10}
          height={H}
          fill={i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'}
        />
      ))}

      <g stroke="var(--chalk-line)" strokeWidth="2" fill="none">
        <rect x={8} y={8} width={W - 16} height={H - 16} />
        <line x1={W / 2} y1={8} x2={W / 2} y2={H - 8} />
        <circle cx={W / 2} cy={H / 2} r={55} />
        <circle cx={W / 2} cy={H / 2} r={2.5} fill="var(--chalk-line)" />

        {/* left penalty area (France defends here in our orientation) */}
        <rect x={8} y={H / 2 - 110} width={110} height={220} />
        <rect x={8} y={H / 2 - 50} width={44} height={100} />
        <circle cx={8 + 84} cy={H / 2} r={2.5} fill="var(--chalk-line)" />
        <path d={`M ${8 + 110} ${H / 2 - 55} A 55 55 0 0 1 ${8 + 110} ${H / 2 + 55}`} />

        {/* right penalty area (Spain defends here) */}
        <rect x={W - 118} y={H / 2 - 110} width={110} height={220} />
        <rect x={W - 52} y={H / 2 - 50} width={44} height={100} />
        <circle cx={W - 92} cy={H / 2} r={2.5} fill="var(--chalk-line)" />
        <path d={`M ${W - 118} ${H / 2 - 55} A 55 55 0 0 0 ${W - 118} ${H / 2 + 55}`} />

        {/* corner arcs */}
        <path d={`M 8 24 A 16 16 0 0 0 24 8`} />
        <path d={`M ${W - 24} 8 A 16 16 0 0 0 ${W - 8} 24`} />
        <path d={`M 8 ${H - 24} A 16 16 0 0 1 24 ${H - 8}`} />
        <path d={`M ${W - 8} ${H - 24} A 16 16 0 0 1 ${W - 24} ${H - 8}`} />
      </g>

      {children}
    </svg>
  );
}
