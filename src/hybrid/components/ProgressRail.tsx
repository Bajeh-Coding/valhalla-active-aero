import { cn } from '@/lib/utils'
import { CHAPTER_RAIL, type HybridBeat } from '../data/chapters'

interface ProgressRailProps {
  beats: readonly HybridBeat[]
  activeIndex: number
  onSelect: (index: number) => void
}

export function ProgressRail({
  beats,
  activeIndex,
  onSelect,
}: ProgressRailProps) {
  const activeChapter = beats[activeIndex]?.chapter ?? 0

  return (
    <nav
      className="pointer-events-none fixed top-0 right-0 left-0 z-40 flex justify-between px-4 pt-4 md:px-8"
      aria-label="Navigare capitole"
      data-testid="progress-rail"
    >
      <p className="font-ui pointer-events-none text-[10px] tracking-[0.28em] text-aero-mist/60 uppercase">
        Active Aero · Hybrid AM
      </p>
      <ul className="pointer-events-auto flex flex-wrap justify-end gap-x-3 gap-y-1">
        {CHAPTER_RAIL.map((ch) => {
          const firstIdx = beats.findIndex((b) => b.chapter === ch.chapter)
          const active = activeChapter === ch.chapter
          return (
            <li key={ch.chapter}>
              <button
                type="button"
                onClick={() => firstIdx >= 0 && onSelect(firstIdx)}
                className={cn(
                  'font-ui text-[10px] tracking-[0.18em] uppercase transition-colors',
                  active
                    ? 'text-aero-ivory'
                    : 'text-aero-mist/50 hover:text-aero-mist',
                )}
              >
                {String(ch.chapter).padStart(2, '0')} {ch.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
