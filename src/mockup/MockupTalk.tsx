import { useCallback, useEffect, useRef, useState } from 'react'
import { ChapterNav } from './components/ChapterNav'
import { ChapterSection } from './components/ChapterSection'
import { Hero } from './components/Hero'
import { MOCK_CHAPTERS } from './data/chapters'

/**
 * Luxury scientific presentation — 11 chapters (ghid + Cap 09 simulator).
 * Motions: hero ambient scale, chapter reveal on scroll, nav scrollspy underline.
 */
export function MockupTalk() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState('')
  const [navSolid, setNavSolid] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>('[data-chapter-id]'),
    )

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
          )
        const top = visible[0]
        if (top?.target instanceof HTMLElement) {
          const id = top.target.dataset.chapterId
          if (id) setActiveId(id)
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -45% 0px',
        threshold: [0.15, 0.35, 0.55],
      },
    )

    sections.forEach((s) => observer.observe(s))

    const onScroll = () => {
      setNavSolid(window.scrollY > window.innerHeight * 0.65)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let revealObserver: IntersectionObserver | undefined
    if (!reduced) {
      // threshold 0: any visible pixel reveals. A tall Cap 08 title+charts
      // wrapper previously used 0.18 and never crossed that ratio in-viewport.
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              entry.target.classList.add('is-revealed')
              revealObserver?.unobserve(entry.target)
            }
          })
        },
        { threshold: [0, 0.01, 0.1], rootMargin: '0px 0px -4% 0px' },
      )
      root.querySelectorAll('.chapter-reveal').forEach((el) => {
        revealObserver!.observe(el)
      })
    } else {
      root.querySelectorAll('.chapter-reveal').forEach((el) => {
        el.classList.add('is-revealed')
      })
    }

    return () => {
      observer.disconnect()
      revealObserver?.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const onSelect = useCallback((id: string) => {
    const section = document.getElementById(`chapter-${id}`)
    if (!section) return
    // Nav jumps land on full-bleed media; force-reveal body so Cap 07/08
    // never sit as an invisible black void under the banner.
    section.querySelectorAll('.chapter-reveal').forEach((el) => {
      el.classList.add('is-revealed')
    })
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const onExplore = useCallback(() => {
    onSelect(MOCK_CHAPTERS[0]!.id)
  }, [onSelect])

  return (
    <div
      ref={rootRef}
      className="relative bg-aero-void"
      data-testid="mockup-talk"
    >
      <ChapterNav
        chapters={MOCK_CHAPTERS}
        activeId={activeId}
        solid={navSolid}
        onSelect={onSelect}
      />

      <Hero onExplore={onExplore} />

      <main>
        {MOCK_CHAPTERS.map((chapter) => (
          <ChapterSection key={chapter.id} chapter={chapter} />
        ))}
      </main>

      <footer className="border-t border-aero-ivory/8 px-6 py-12 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <p className="font-display text-sm font-light tracking-[0.24em] text-aero-mist/50 uppercase">
            Aerodinamică Activă
          </p>
          <p className="font-ui text-[10px] tracking-[0.2em] text-aero-mist/40 uppercase">
            11 capitole · ghid prezentare · simulator
          </p>
        </div>
      </footer>
    </div>
  )
}
