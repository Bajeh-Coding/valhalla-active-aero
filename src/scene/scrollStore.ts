import { create } from 'zustand'

/** Five scrollytelling chapters from master-spec §3. */
export const CHAPTER_IDS = [
  'hero',
  'physics',
  'control',
  'dynamics',
  'pi-rom',
] as const

export type ChapterId = (typeof CHAPTER_IDS)[number]

export const CHAPTER_META: readonly {
  id: ChapterId
  index: number
  title: string
}[] = [
  { id: 'hero', index: 0, title: 'Hero wind tunnel intro' },
  { id: 'physics', index: 1, title: 'Aerodynamic physics & aero-balance' },
  { id: 'control', index: 2, title: 'Mecatronic state machine' },
  { id: 'dynamics', index: 3, title: '14-DOF dynamics & lap-time' },
  { id: 'pi-rom', index: 4, title: 'PI-ROM neural engine' },
] as const

/**
 * Scroll / camera progress API for Phase 4 HUD + chapter copy.
 * Driven by GSAP ScrollTrigger in `useScrollTimeline`.
 */
export interface ScrollProgressState {
  /** Overall scrub 0..1 across all chapters. */
  progress: number
  /** Active chapter 0..4. */
  chapterIndex: number
  /** Progress within the active chapter 0..1. */
  chapterProgress: number
  /** Chapter 3 (control) pin active. */
  chapter3Pinned: boolean
  /** Camera look-at target (world). */
  lookAt: readonly [number, number, number]
  /** Camera position (world). */
  cameraPosition: readonly [number, number, number]
  setScroll: ( partial: {
    progress: number
    chapterIndex: number
    chapterProgress: number
    chapter3Pinned: boolean
  }) => void
  setCamera: (
    position: readonly [number, number, number],
    lookAt: readonly [number, number, number],
  ) => void
}

export const useScrollStore = create<ScrollProgressState>((set) => ({
  progress: 0,
  chapterIndex: 0,
  chapterProgress: 0,
  chapter3Pinned: false,
  lookAt: [0, 0.45, 0],
  cameraPosition: [4.2, 1.8, 5.5],
  setScroll: (partial) => set(partial),
  setCamera: (cameraPosition, lookAt) => set({ cameraPosition, lookAt }),
}))
