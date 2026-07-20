export default function StatBar({ label, leftValue, rightValue, leftColor = 'var(--france-blue)', rightColor = 'var(--spain-red)', suffix = '' }) {
  const total = leftValue + rightValue || 1;
  const leftPct = (leftValue / total) * 100;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between font-mono text-[0.95rem]">
        <span style={{ color: leftColor }}>{leftValue}{suffix}</span>
        <span className="text-xs uppercase tracking-[0.06em] text-[#F3F0E6]/62">{label}</span>
        <span style={{ color: rightColor }}>{rightValue}{suffix}</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full transition-[width] duration-500" style={{ width: `${leftPct}%`, background: leftColor }} />
        <div className="h-full transition-[width] duration-500" style={{ width: `${100 - leftPct}%`, background: rightColor }} />
      </div>
    </div>
  );
}
