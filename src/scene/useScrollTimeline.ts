import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, type RefObject } from 'react'
import { CHAPTER_CAMERAS, lerpCamera } from './cameraChapters'
import { CHAPTER_IDS, useScrollStore } from './scrollStore'

gsap.registerPlugin(ScrollTrigger)

/**
 * GSAP ScrollTrigger for photo-led chapters 1–5.
 * - Scrubs camera between chapter keyframes (scrub: 1)
 * - Pins chapter 3 (rear-wing + live controls)
 * - Light pins on chapters 2 & 4 for photo dwell
 */
export function useScrollTimeline(scrollRootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scrollRootRef.current
    if (!root) return

    const chapters = CHAPTER_IDS.map((id) => CHAPTER_CAMERAS[id])
    const triggers: ScrollTrigger[] = []

    const main = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress
        const seg = Math.min(0.999, p) * (chapters.length - 1)
        const i = Math.floor(seg)
        const local = seg - i
        const from = chapters[i]!
        const to = chapters[Math.min(i + 1, chapters.length - 1)]!
        const cam = lerpCamera(from, to, local)
        useScrollStore.getState().setCamera(cam.position, cam.lookAt)
        useScrollStore.getState().setScroll({
          progress: p,
          chapterIndex: i,
          chapterProgress: local,
          chapter3Pinned: useScrollStore.getState().chapter3Pinned,
        })
      },
    })
    triggers.push(main)

    // Chapter pins — photo dwell + interactive control
    const pinSpecs: { selector: string; end: string; flag?: 'chapter3' }[] = [
      { selector: '[data-chapter="physics"]', end: '+=80%' },
      { selector: '[data-chapter="control"]', end: '+=140%', flag: 'chapter3' },
      { selector: '[data-chapter="dynamics"]', end: '+=70%' },
    ]

    for (const spec of pinSpecs) {
      const el = root.querySelector(spec.selector)
      if (!el) continue
      const isCh3 = spec.flag === 'chapter3'
      const pin = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: spec.end,
        pin: true,
        pinSpacing: true,
        onEnter: () => {
          if (isCh3) setPinned(true)
        },
        onEnterBack: () => {
          if (isCh3) setPinned(true)
        },
        onLeave: () => {
          if (isCh3) setPinned(false)
        },
        onLeaveBack: () => {
          if (isCh3) setPinned(false)
        },
      })
      triggers.push(pin)
    }

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, [scrollRootRef])
}

function setPinned(chapter3Pinned: boolean) {
  useScrollStore.getState().setScroll({
    ...pickScroll(),
    chapter3Pinned,
  })
}

function pickScroll() {
  const s = useScrollStore.getState()
  return {
    progress: s.progress,
    chapterIndex: s.chapterIndex,
    chapterProgress: s.chapterProgress,
    chapter3Pinned: s.chapter3Pinned,
  }
}
