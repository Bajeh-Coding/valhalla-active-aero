import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BeatViewport } from './components/BeatViewport'
import { ProgressRail } from './components/ProgressRail'
import { BEATS } from './data/chapters'

gsap.registerPlugin(ScrollTrigger)

export function HybridTalk() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>('[data-beat-index]'),
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

    // Subtle parallax on atmosphere images
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const parallax: ScrollTrigger[] = []
    if (!reduced) {
      sections.forEach((section) => {
        const img = section.querySelector('img')
        if (!img) return
        const tween = gsap.fromTo(
          img,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
        if (tween.scrollTrigger) parallax.push(tween.scrollTrigger)
      })
    }

    return () => {
      triggers.forEach((t) => t.kill())
      parallax.forEach((t) => t.kill())
    }
  }, [])

  const onSelect = useCallback((index: number) => {
    const el = document.getElementById(`beat-${BEATS[index]?.id}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div
      ref={rootRef}
      className="relative bg-aero-void"
      data-testid="hybrid-talk"
    >
      <ProgressRail
        beats={BEATS}
        activeIndex={activeIndex}
        onSelect={onSelect}
      />

      {BEATS.map((beat, index) => (
        <BeatViewport
          key={beat.id}
          beat={beat}
          index={index}
          isActive={index === activeIndex}
        />
      ))}

      <footer className="border-t border-aero-signal/10 px-6 py-10 md:px-14 lg:px-24">
        <p className="font-ui text-[10px] tracking-[0.2em] text-aero-mist/70 uppercase">
          Hybrid AM · SAE 2020-36-0079 · Valhalla industrial (Capitol 5)
        </p>
        <p className="font-serif mt-3 max-w-2xl text-sm text-aero-mist/60">
          Fotografii Valhalla: Wikimedia Commons (CC BY-SA). Capitolele 1–4 și 6
          — doar S1; Capitolul 5 — surse publice Aston Martin, etichetate
          industrial. Zero Unsplash. Graficele poartă argumentul.
        </p>
      </footer>
    </div>
  )
}
