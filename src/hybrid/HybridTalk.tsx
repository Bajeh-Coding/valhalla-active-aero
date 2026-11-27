import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CHAPTERS } from './chapters'
import { ChapterStage } from './ChapterStage'
import { ProgressRail } from './ProgressRail'
import { StillScrub } from './StillScrub'
import type { ValhallaAssetKey } from './assets'

gsap.registerPlugin(ScrollTrigger)

export function HybridTalk() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>('[data-chapter-index]'),
    )

    const triggers = sections.map((section, i) =>
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveIndex(i),
        onEnterBack: () => setActiveIndex(i),
      }),
    )

    const progressTrigger = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setProgress(self.progress),
    })

    return () => {
      triggers.forEach((t) => t.kill())
      progressTrigger.kill()
    }
  }, [])

  const onSelect = useCallback((index: number) => {
    const el = document.getElementById(`chapter-${CHAPTERS[index]?.id}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const activePhoto: ValhallaAssetKey =
    CHAPTERS[activeIndex]?.photo ?? 'hero'
  const showGlobalScrub = CHAPTERS[activeIndex]?.tone !== 'void'

  return (
    <div
      ref={rootRef}
      className="relative bg-aero-void"
      data-testid="hybrid-talk"
    >
      <div
        className={cnFixed(showGlobalScrub)}
        aria-hidden={!showGlobalScrub}
      >
        <StillScrub progress={progress} activePhoto={activePhoto} />
      </div>

      <ProgressRail
        chapters={CHAPTERS}
        activeIndex={activeIndex}
        onSelect={onSelect}
      />

      <div className="relative z-10">
        {CHAPTERS.map((chapter, index) => (
          <ChapterStage
            key={chapter.id}
            chapter={chapter}
            index={index}
            isActive={index === activeIndex}
          />
        ))}
      </div>

      <footer className="relative z-10 border-t border-aero-signal/10 px-6 py-8 md:px-14 lg:px-24">
        <p className="font-ui text-[10px] tracking-[0.2em] text-aero-mist/70 uppercase">
          Hybrid AM · Aston Martin Valhalla · Știință S1/S2
        </p>
        <p className="font-serif mt-2 max-w-2xl text-sm text-aero-mist/60">
          Fotografii Valhalla: Wikimedia Commons (CC BY-SA). Capitolele 1–4 și 6
          citează exclusiv SAE 2020-36-0079 și Machines 2024. Capitolul 5 = sursă
          industrială AM, etichetată separat. Still scrub local — fără CDN AM.
        </p>
      </footer>
    </div>
  )
}

function cnFixed(visible: boolean) {
  return [
    'pointer-events-none fixed inset-0 z-0 transition-opacity duration-700',
    visible ? 'opacity-100' : 'opacity-0',
  ].join(' ')
}
