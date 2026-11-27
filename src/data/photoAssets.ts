/**
 * Act photography — local public/images + Unsplash CDN fallback.
 *
 * IMPORTANT (brand honesty): these stills are atmospheric / editorial stock,
 * NOT official Aston Martin Valhalla press assets. Prefer P0 press kit when
 * available — see internal/cinematic-stage-handoff.md.
 */

export interface PhotoAsset {
  /** Local Vite public path. */
  local: string
  /** Unsplash CDN fallback when local download was blocked. */
  cdn: string
  /** Accessibility / handoff description (not shown as chrome). */
  alt: string
  /** Provenance for audit. */
  source: 'unsplash-stock' | 'aston-martin-press'
  /** Unsplash photo id or press catalogue id. */
  sourceId: string
}

export const PHOTO_ASSETS = {
  hero: {
    local: '/images/hero-valhalla.jpg',
    cdn: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=2400&q=85',
    alt: 'Dark hypercar hero — atmospheric editorial (not official Valhalla)',
    source: 'unsplash-stock',
    sourceId: 'photo-1553440569-bcc63803a83d',
  },
  side: {
    local: '/images/side-aero.jpg',
    cdn: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=2400&q=85',
    alt: 'Side profile — aero balance study (stock)',
    source: 'unsplash-stock',
    sourceId: 'photo-1544636331-e26879cd4d9b',
  },
  rear: {
    local: '/images/rear-wing.jpg',
    cdn: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=2400&q=85',
    alt: 'Rear wing / active aero focus (stock)',
    source: 'unsplash-stock',
    sourceId: 'photo-1555215695-3004980ad54e',
  },
  track: {
    local: '/images/track-nurburgring.jpg',
    cdn: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=2400&q=85',
    alt: 'Race track atmosphere (stock)',
    source: 'unsplash-stock',
    sourceId: 'photo-1517524008697-84bbe3c3fd98',
  },
  detail: {
    local: '/images/rear-wing.jpg',
    cdn: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=2400&q=85',
    alt: 'Actuator detail still — reuses rear wing stock until press kit',
    source: 'unsplash-stock',
    sourceId: 'photo-1555215695-3004980ad54e',
  },
  close: {
    local: '/images/hero-valhalla.jpg',
    cdn: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=2400&q=85',
    alt: 'Closing still — atmospheric (stock)',
    source: 'unsplash-stock',
    sourceId: 'photo-1553440569-bcc63803a83d',
  },
} as const satisfies Record<string, PhotoAsset>

/**
 * Map act index A0–A5 → photo key.
 * One dominant still per act; scrub crossfades between neighbors.
 */
export const CHAPTER_PHOTO_KEYS = [
  'hero', // A0
  'side', // A1
  'detail', // A2
  'rear', // A3
  'track', // A4
  'close', // A5
] as const

export type PhotoKey = keyof typeof PHOTO_ASSETS

export function photoSrc(key: PhotoKey): string {
  return PHOTO_ASSETS[key].local
}

export function photoCdn(key: PhotoKey): string {
  return PHOTO_ASSETS[key].cdn
}
