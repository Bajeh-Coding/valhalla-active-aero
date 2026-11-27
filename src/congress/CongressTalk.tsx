import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BEATS } from './beats'
import { BeatStage } from './BeatStage'
import { ProgressRail } from './ProgressRail'

gsap.registerPlugin(ScrollTrigger)

export function CongressTalk() {
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

    return () => {
      triggers.forEach((t) => t.kill())
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
      data-testid="congress-talk"
    >
      <ProgressRail
        beats={BEATS}
        activeIndex={activeIndex}
        onSelect={onSelect}
      />

      {BEATS.map((beat, index) => (
        <BeatStage
          key={beat.id}
          beat={beat}
          index={index}
          isActive={index === activeIndex}
        />
      ))}

      <footer className="border-t border-aero-signal/10 px-6 py-8 md:px-14 lg:px-24">
        <p className="font-ui text-[10px] tracking-[0.2em] text-aero-mist/70 uppercase">
          Demonstrație vizuală · Aston Martin Valhalla · Știință S1/S2
        </p>
        <p className="font-serif mt-2 max-w-2xl text-sm text-aero-mist/60">
          Fotografii Valhalla: Wikimedia Commons (CC BY-SA). Cifrele pe ecran
          provin exclusiv din SAE 2020-36-0079 și Machines 2024, 12, 160 —
          nu din specificațiile de marketing Valhalla.
        </p>
      </footer>
    </div>
  )
}
