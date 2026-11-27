import type { ChapterId } from './scrollStore'

export interface CameraKeyframe {
  position: readonly [number, number, number]
  lookAt: readonly [number, number, number]
}

/** Per-chapter camera beats — scrubbed by ScrollTrigger. */
export const CHAPTER_CAMERAS: Record<ChapterId, CameraKeyframe> = {
  /** Ch1 — front-quarter orbit intro. */
  hero: { position: [4.2, 1.8, 5.5], lookAt: [0, 0.45, 0] },
  /** Ch2 — side profile for aero-balance. */
  physics: { position: [0.2, 1.1, 6.2], lookAt: [0, 0.5, 0] },
  /** Ch3 — rear wing + splitter focus (pinned). */
  control: { position: [-3.8, 1.4, 3.2], lookAt: [-0.2, 0.55, -1.2] },
  /** Ch4 — elevated plan for track overlay later. */
  dynamics: { position: [0.5, 7.5, 0.5], lookAt: [0, 0, 0] },
  /** Ch5 — closer neural / pressure nodal view. */
  'pi-rom': { position: [2.4, 1.2, 2.8], lookAt: [0, 0.5, 0] },
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function lerpCamera(
  from: CameraKeyframe,
  to: CameraKeyframe,
  t: number,
): CameraKeyframe {
  const tt = Math.min(1, Math.max(0, t))
  return {
    position: [
      lerp(from.position[0], to.position[0], tt),
      lerp(from.position[1], to.position[1], tt),
      lerp(from.position[2], to.position[2], tt),
    ],
    lookAt: [
      lerp(from.lookAt[0], to.lookAt[0], tt),
      lerp(from.lookAt[1], to.lookAt[1], tt),
      lerp(from.lookAt[2], to.lookAt[2], tt),
    ],
  }
}
