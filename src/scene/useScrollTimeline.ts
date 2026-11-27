import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, type RefObject } from 'react'
import { CHAPTER_CAMERAS, lerpCamera } from './cameraChapters'
import { CHAPTER_IDS, useScrollStore } from './scrollStore'

gsap.registerPlugin(ScrollTrigger)

/**
 * GSAP ScrollTrigger skeleton for 5 chapters.
 * - Scrubs camera between chapter keyframes
 * - Chapter 3 (`control`) uses a pin hook for live aero controls (Phase 4 UI)
 * Exposes progress via `useScrollStore`.
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

    const ch3 = root.querySelector('[data-chapter="control"]')
    if (ch3) {
      const pin = ScrollTrigger.create({
        trigger: ch3,
        start: 'top top',
        end: '+=120%',
        pin: true,
        pinSpacing: true,
        onEnter: () =>
          useScrollStore.getState().setScroll({
            ...pickScroll(),
            chapter3Pinned: true,
          }),
        onEnterBack: () =>
          useScrollStore.getState().setScroll({
            ...pickScroll(),
            chapter3Pinned: true,
          }),
        onLeave: () =>
          useScrollStore.getState().setScroll({
            ...pickScroll(),
            chapter3Pinned: false,
          }),
        onLeaveBack: () =>
          useScrollStore.getState().setScroll({
            ...pickScroll(),
            chapter3Pinned: false,
          }),
      })
      triggers.push(pin)
    }

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, [scrollRootRef])
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
