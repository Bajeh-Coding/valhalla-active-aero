import { cn } from '@/lib/utils'
import type { MockChapter } from '../data/chapters'

interface ChapterNavProps {
  chapters: readonly MockChapter[]
  activeId: string
  solid: boolean
  onSelect: (id: string) => void
}

/**
 * Sticky chapter sub-nav — AstonMartinSans labels (same family as AM sticky nav).
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
        <p className="font-display shrink-0 text-[13px] font-normal tracking-normal text-aero-mist/80">
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
                    'font-ui relative px-2 py-2 text-[11px] tracking-[0.55px] uppercase transition-colors md:px-2.5 md:text-[12px]',
                    active
                      ? 'text-aero-ivory'
                      : 'text-aero-mist/45 hover:text-aero-mist/80',
                  )}
                >
                  <span className="text-aero-mist/55">
                    {String(ch.number).padStart(2, '0')}
                  </span>{' '}
                  <span className="hidden sm:inline">{ch.label}</span>
                  <span
                    className={cn(
                      'absolute right-2 bottom-0 left-2 h-px origin-left bg-aero-amr transition-transform duration-300',
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
