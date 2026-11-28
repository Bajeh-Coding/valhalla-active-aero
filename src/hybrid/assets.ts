/**
 * Real Aston Martin Valhalla stills — Wikimedia Commons (CC BY / CC BY-SA).
 * Zero Unsplash. No AM CDN hotlinks.
 */

export type ValhallaAssetKey =
  | 'hero'
  | 'showroom'
  | 'front'
  | 'side'
  | 'rear'
  | 'prototype'

export interface ValhallaAsset {
  src: string
  alt: string
  objectPosition: string
  credit: string
  license: 'CC BY 4.0' | 'CC BY-SA 4.0'
  commonsUrl: string
}

export const VALHALLA_ASSETS: Record<ValhallaAssetKey, ValhallaAsset> = {
  hero: {
    src: '/images/valhalla/hero.jpg',
    alt: 'Aston Martin Valhalla — verde, showroom',
    objectPosition: '55% 45%',
    credit: 'Aston Martin Valhalla at Miller Motorcars, front view',
    license: 'CC BY-SA 4.0',
    commonsUrl:
      'https://commons.wikimedia.org/wiki/File:Aston_Martin_Valhalla_at_Miller_Motorcars,_front_view.jpg',
  },
  showroom: {
    src: '/images/valhalla/showroom.jpg',
    alt: 'Aston Martin Valhalla — teal iridescent',
    objectPosition: '50% 40%',
    credit: '2026 Aston Martin Valhalla',
    license: 'CC BY-SA 4.0',
    commonsUrl:
      'https://commons.wikimedia.org/wiki/File:2026_Aston_Martin_Valhalla.jpg',
  },
  front: {
    src: '/images/valhalla/front.jpg',
    alt: 'Aston Martin Valhalla — splitter față',
    objectPosition: '45% 50%',
    credit: '2025 Aston Martin Valhalla 5',
    license: 'CC BY-SA 4.0',
    commonsUrl:
      'https://commons.wikimedia.org/wiki/File:2025_Aston_Martin_Valhalla_5.jpg',
  },
  side: {
    src: '/images/valhalla/side.jpg',
    alt: 'Aston Martin Valhalla — profil',
    objectPosition: '50% 45%',
    credit: '2025 Aston Martin Valhalla 11',
    license: 'CC BY-SA 4.0',
    commonsUrl:
      'https://commons.wikimedia.org/wiki/File:2025_Aston_Martin_Valhalla_11.jpg',
  },
  rear: {
    src: '/images/valhalla/rear.jpg',
    alt: 'Aston Martin Valhalla — aripă spate',
    objectPosition: '60% 40%',
    credit: '2025 Aston Martin Valhalla 6',
    license: 'CC BY-SA 4.0',
    commonsUrl:
      'https://commons.wikimedia.org/wiki/File:2025_Aston_Martin_Valhalla_6.jpg',
  },
  prototype: {
    src: '/images/valhalla/prototype.jpg',
    alt: 'Aston Martin Valhalla Prototype',
    objectPosition: '50% 50%',
    credit: 'Aston Martin Valhalla Prototype (1)',
    license: 'CC BY-SA 4.0',
    commonsUrl:
      'https://commons.wikimedia.org/wiki/File:Aston_Martin_Valhalla_Prototype_(1).jpg',
  },
}

/** Still-scrub sequence for optional cinematic pacing (local Commons frames). */
export const SCRUB_SEQUENCE: ValhallaAssetKey[] = [
  'hero',
  'front',
  'side',
  'rear',
  'showroom',
  'prototype',
]
