/**
 * Chapter photography — local public/images + Unsplash CDN fallback.
 * Manifest mirrors scripts/fetch-assets.js.
 */

export interface PhotoAsset {
  /** Local Vite public path. */
  local: string
  /** Unsplash CDN fallback when local download was blocked. */
  cdn: string
  alt: string
}

export const PHOTO_ASSETS = {
  hero: {
    local: '/images/hero-valhalla.jpg',
    cdn: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=2400&q=85',
    alt: 'Dark hypercar hero — wind-tunnel editorial',
  },
  side: {
    local: '/images/side-aero.jpg',
    cdn: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=2400&q=85',
    alt: 'Side profile — aero balance study',
  },
  rear: {
    local: '/images/rear-wing.jpg',
    cdn: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=2400&q=85',
    alt: 'Rear wing / active aero focus',
  },
  track: {
    local: '/images/track-nurburgring.jpg',
    cdn: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=2400&q=85',
    alt: 'Race track — Nürburgring GP context',
  },
} as const satisfies Record<string, PhotoAsset>

/** Map chapter index → primary photo key (ch5 reuses rear for neural overlay). */
export const CHAPTER_PHOTO_KEYS = [
  'hero',
  'side',
  'rear',
  'track',
  'rear',
] as const

export type PhotoKey = keyof typeof PHOTO_ASSETS

/** Resolve src with CDN fallback via onError. */
export function photoSrc(key: PhotoKey): string {
  return PHOTO_ASSETS[key].local
}

export function photoCdn(key: PhotoKey): string {
  return PHOTO_ASSETS[key].cdn
}
