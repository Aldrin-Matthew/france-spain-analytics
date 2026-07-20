export default function StatBar({ label, leftValue, rightValue, leftColor = 'var(--france-blue)', rightColor = 'var(--spain-red)', suffix = '' }) {
  const total = leftValue + rightValue || 1;
  const leftPct = (leftValue / total) * 100;

  return (
    <div className="stat-bar">
      <div className="stat-bar__values">
        <span style={{ color: leftColor }}>{leftValue}{suffix}</span>
        <span className="stat-bar__label">{label}</span>
        <span style={{ color: rightColor }}>{rightValue}{suffix}</span>
      </div>
      <div className="stat-bar__track">
        <div className="stat-bar__fill" style={{ width: `${leftPct}%`, background: leftColor }} />
        <div className="stat-bar__fill" style={{ width: `${100 - leftPct}%`, background: rightColor }} />
      </div>
    </div>
  );
}
