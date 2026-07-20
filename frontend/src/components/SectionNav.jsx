import { useState } from 'react';

function ChevronIcon({ direction, className = '' }) {
  const d = direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6';
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function ArrowButton({ direction, onClick, hidden }) {
  if (hidden) return null;
  const side = direction === 'left' ? 'left-2 md:left-4' : 'right-2 md:right-4';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'left' ? 'Previous section' : 'Next section'}
      className={`fixed ${side} top-auto bottom-6 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-30
        flex items-center justify-center p-2
        text-[#F3F0E6]/50 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]
        transition hover:text-[#E8B44A] active:scale-90`}
    >
      <ChevronIcon direction={direction} className="h-5 w-5 md:h-6 md:w-6" />
    </button>
  );
}

export default function SectionNav({ sections, activeIndex, onPrev, onNext, onJump }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const expanded = sidebarOpen || hovering;

  return (
    <>
      <ArrowButton direction="left" onClick={onPrev} hidden={activeIndex === 0} />
      <ArrowButton direction="right" onClick={onNext} hidden={activeIndex === sections.length - 1} />

      {/* Desktop/tablet: collapsible right-edge sidebar, reveal on hover or toggle click */}
      <div
        className="hidden md:block fixed right-0 top-0 z-40 h-full"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* hover hotzone */}
        <div className="absolute right-0 top-0 h-full w-6" />

        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle section menu"
          className={`absolute top-[28%] -translate-y-1/2 flex h-10 w-6 items-center justify-center
            rounded-l-md border border-r-0 border-[#F3F0E6]/12 bg-[#081C15]/90 text-[#E8B44A]
            transition-[right] duration-300 ease-in-out
            ${expanded ? 'right-48' : 'right-0'}`}
        >
          <ChevronIcon direction={expanded ? 'right' : 'left'} className="h-4 w-4" />
        </button>

        <nav
          className={`absolute right-0 top-[28%] -translate-y-1/2 w-48 rounded-l-xl border border-[#F3F0E6]/12
            bg-[#081C15]/95 backdrop-blur py-4 shadow-2xl
            transition-transform duration-300 ease-in-out
            ${expanded ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <ul className="flex flex-col gap-1">
            {sections.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition
                    ${i === activeIndex ? 'text-[#E8B44A]' : 'text-[#F3F0E6]/62 hover:text-[#F3F0E6]'}`}
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${i === activeIndex ? 'bg-[#E8B44A]' : 'bg-[#F3F0E6]/30'}`} />
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile: hamburger-triggered bottom sheet */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle section menu"
          className="fixed left-3 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-[#F3F0E6]/12 bg-[#081C15]/80 text-[#F3F0E6] backdrop-blur"
        >
          <span className="flex flex-col gap-1">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex flex-col justify-end">
            <div className="absolute inset-0 bg-[#0A1210]/70" onClick={() => setSidebarOpen(false)} />
            <div className="relative rounded-t-2xl border-t border-[#F3F0E6]/12 bg-[#081C15] px-4 pb-8 pt-4 shadow-2xl">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#F3F0E6]/20" />
              <ul className="flex flex-col gap-1">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onJump(i);
                        setSidebarOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition
                        ${i === activeIndex ? 'text-[#E8B44A] bg-[#F3F0E6]/5' : 'text-[#F3F0E6]/70'}`}
                    >
                      <span className={`h-2 w-2 shrink-0 rounded-full ${i === activeIndex ? 'bg-[#E8B44A]' : 'bg-[#F3F0E6]/30'}`} />
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
