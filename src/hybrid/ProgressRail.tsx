import { cn } from '@/lib/utils'
import type { Chapter } from './chapters'

interface ProgressRailProps {
  chapters: readonly Chapter[]
  activeIndex: number
  onSelect: (index: number) => void
}

/** Sparse chapter rail — brochure pacing, not dashboard nav. */
export function ProgressRail({
  chapters,
  activeIndex,
  onSelect,
}: ProgressRailProps) {
  return (
    <nav
      aria-label="Structura prezentării"
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex lg:right-8"
    >
      {chapters.map((ch, i) => {
        const active = i === activeIndex
        return (
          <button
            key={ch.id}
            type="button"
            data-testid={`rail-${ch.id}`}
            aria-current={active ? 'true' : undefined}
            aria-label={`${ch.rail} · capitol ${ch.chapter}`}
            onClick={() => onSelect(i)}
            className="pointer-events-auto group flex items-center justify-end gap-3"
          >
            <span
              className={cn(
                'font-ui text-[10px] tracking-[0.18em] uppercase transition-opacity duration-500',
                active
                  ? 'text-aero-ivory/80 opacity-100'
                  : 'text-aero-mist opacity-0 group-hover:opacity-70',
              )}
            >
              {ch.rail}
            </span>
            <span
              className={cn(
                'block h-px transition-all duration-500',
                active
                  ? 'w-8 bg-aero-amr'
                  : 'w-3 bg-aero-signal/25 group-hover:w-5 group-hover:bg-aero-signal/50',
              )}
            />
          </button>
        )
      })}
    </nav>
  )
}
