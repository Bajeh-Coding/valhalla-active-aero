import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, type RefObject } from 'react'
import { CHAPTER_IDS, useScrollStore } from './scrollStore'

gsap.registerPlugin(ScrollTrigger)

/**
 * GSAP ScrollTrigger for photo-led A0–A5.
 * - Scrubs chapter index / progress for PhotoStage crossfade (scrub ~1)
 * - Pins only A3 (control) — art-direction §8
 * - prefers-reduced-motion: still updates indices without ornamental scrub lag
 */
export function useScrollTimeline(scrollRootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scrollRootRef.current
    if (!root) return

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const triggers: ScrollTrigger[] = []
    const actCount = CHAPTER_IDS.length

    const main = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom bottom',
      scrub: reduced ? true : 1,
      onUpdate: (self) => {
        const p = self.progress
        const seg = Math.min(0.999, p) * (actCount - 1)
        const i = Math.floor(seg)
        const local = seg - i
        useScrollStore.getState().setScroll({
          progress: p,
          chapterIndex: i,
          chapterProgress: local,
          a3Pinned: useScrollStore.getState().a3Pinned,
        })
      },
    })
    triggers.push(main)

    const a3 = root.querySelector('[data-chapter="a3-control"]')
    if (a3) {
      const pin = ScrollTrigger.create({
        trigger: a3,
        start: 'top top',
        end: '+=140%',
        pin: true,
        pinSpacing: true,
        onEnter: () => setA3Pinned(true),
        onEnterBack: () => setA3Pinned(true),
        onLeave: () => setA3Pinned(false),
        onLeaveBack: () => setA3Pinned(false),
      })
      triggers.push(pin)
    }

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, [scrollRootRef])
}

function setA3Pinned(a3Pinned: boolean) {
  const s = useScrollStore.getState()
  useScrollStore.getState().setScroll({
    progress: s.progress,
    chapterIndex: s.chapterIndex,
    chapterProgress: s.chapterProgress,
    a3Pinned,
  })
}
