import { create } from 'zustand'

/** A0–A5 acts — architecture-v2 §1. */
export const CHAPTER_IDS = [
  'a0-hero',
  'a1-limita',
  'a2-actuatoare',
  'a3-control',
  'a4-rezultat',
  'a5-inchidere',
] as const

export type ChapterId = (typeof CHAPTER_IDS)[number]

export const CHAPTER_META: readonly {
  id: ChapterId
  index: number
  title: string
}[] = [
  { id: 'a0-hero', index: 0, title: 'Hero brand reveal' },
  { id: 'a1-limita', index: 1, title: 'Friction-circle limit' },
  { id: 'a2-actuatoare', index: 2, title: 'Splitter + wing' },
  { id: 'a3-control', index: 3, title: 'State-machine control' },
  { id: 'a4-rezultat', index: 4, title: 'Lap / DIL result' },
  { id: 'a5-inchidere', index: 5, title: 'System close' },
] as const

/**
 * Scroll progress for photo scrub + A3 pin.
 * Camera fields removed — photo-led stage has no R3F hero camera.
 */
export interface ScrollProgressState {
  /** Overall scrub 0..1 across all acts. */
  progress: number
  /** Active act 0..5. */
  chapterIndex: number
  /** Progress within the active act 0..1. */
  chapterProgress: number
  /** A3 control pin active. */
  a3Pinned: boolean
  setScroll: (partial: {
    progress: number
    chapterIndex: number
    chapterProgress: number
    a3Pinned: boolean
  }) => void
}

export const useScrollStore = create<ScrollProgressState>((set) => ({
  progress: 0,
  chapterIndex: 0,
  chapterProgress: 0,
  a3Pinned: false,
  setScroll: (partial) => set(partial),
}))
