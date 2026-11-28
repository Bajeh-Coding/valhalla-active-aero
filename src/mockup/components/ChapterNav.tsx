import { cn } from '@/lib/utils'
import type { MockChapter } from '../data/chapters'

interface ChapterNavProps {
  chapters: readonly MockChapter[]
  /** Empty while still on hero — no chapter underline yet. */
  activeId: string
  solid: boolean
  onSelect: (id: string) => void
}

/**
 * Aston Valhalla–style sticky chapter sub-nav:
 * caps, letter-spaced, underline on the active section (scrollspy).
 */
export function ChapterNav({
  chapters,
  activeId,
  solid,
  onSelect,
}: ChapterNavProps) {
  return (
    <nav
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-[background,border-color,backdrop-filter] duration-500',
        solid
          ? 'border-b border-aero-ivory/8 bg-aero-void/88 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
      aria-label="Navigare capitole"
      data-testid="chapter-nav"
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <p className="font-ui shrink-0 text-[10px] font-medium tracking-[0.36em] text-aero-mist/70 uppercase">
          Aerodinamică Activă
        </p>

        <ul
          className="scrollbar-none flex max-w-full gap-1 overflow-x-auto md:gap-0 md:overflow-visible"
          role="list"
        >
          {chapters.map((ch) => {
            const active = activeId === ch.id
            return (
              <li key={ch.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onSelect(ch.id)}
                  aria-current={active ? 'true' : undefined}
                  data-testid={`nav-${ch.id}`}
                  className={cn(
                    'font-ui relative px-2 py-2 text-[9px] font-medium tracking-[0.18em] uppercase transition-colors md:px-2.5 md:text-[10px] md:tracking-[0.22em]',
                    active
                      ? 'text-aero-ivory'
                      : 'text-aero-mist/45 hover:text-aero-mist/80',
                  )}
                >
                  <span className="font-light text-aero-mist/55">
                    {String(ch.number).padStart(2, '0')}
                  </span>{' '}
                  <span className="hidden sm:inline">{ch.label}</span>
                  <span
                    className={cn(
                      'absolute right-2 bottom-0 left-2 h-px origin-left bg-aero-lime transition-transform duration-300',
                      active ? 'scale-x-100' : 'scale-x-0',
                    )}
                    aria-hidden
                  />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
