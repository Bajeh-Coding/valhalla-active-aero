/**
 * Valhalla stills for hybrid talk — local Commons-derived cinematic set.
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
    alt: 'Aston Martin Valhalla — cinematic front three-quarter',
    objectPosition: '58% 48%',
    credit: '2026 Aston Martin Valhalla SCD26 (graded)',
    license: 'CC BY-SA 4.0',
    commonsUrl:
      'https://commons.wikimedia.org/wiki/File:2026_Aston_Martin_Valhalla_SCD26.jpg',
  },
  showroom: {
    src: '/images/valhalla/ch01.jpg',
    alt: 'Aston Martin Valhalla — cool metallic',
    objectPosition: '50% 40%',
    credit: '2026 Aston Martin Valhalla CAE26',
    license: 'CC BY-SA 4.0',
    commonsUrl:
      'https://commons.wikimedia.org/wiki/File:2026_Aston_Martin_Valhalla_CAE26.jpg',
  },
  front: {
    src: '/images/valhalla/ch02.jpg',
    alt: 'Aston Martin Valhalla — front three-quarter',
    objectPosition: '48% 45%',
    credit: '2022 Aston Martin Valhalla',
    license: 'CC BY-SA 4.0',
    commonsUrl:
      'https://commons.wikimedia.org/wiki/File:2022_Aston_Martin_Valhalla.jpg',
  },
  side: {
    src: '/images/valhalla/ch05.jpg',
    alt: 'Aston Martin Valhalla — olive with lime accents',
    objectPosition: '55% 45%',
    credit: '2026 Aston Martin Valhalla SCD26',
    license: 'CC BY-SA 4.0',
    commonsUrl:
      'https://commons.wikimedia.org/wiki/File:2026_Aston_Martin_Valhalla_SCD26.jpg',
  },
  rear: {
    src: '/images/valhalla/ch07.jpg',
    alt: 'Aston Martin Valhalla — outdoor three-quarter',
    objectPosition: '50% 40%',
    credit: 'Aston Martin Valhalla (2026) (55078901719)',
    license: 'CC BY-SA 4.0',
    commonsUrl:
      'https://commons.wikimedia.org/wiki/File:Aston_Martin_Valhalla_(2026)_(55078901719).jpg',
  },
  prototype: {
    src: '/images/valhalla/ch09.jpg',
    alt: 'Aston Martin Valhalla Prototype — detail',
    objectPosition: '50% 45%',
    credit: 'Aston Martin Valhalla Prototype (3)',
    license: 'CC BY-SA 4.0',
    commonsUrl:
      'https://commons.wikimedia.org/wiki/File:Aston_Martin_Valhalla_Prototype_(3).jpg',
  },
}

export const SCRUB_SEQUENCE: ValhallaAssetKey[] = [
  'hero',
  'front',
  'side',
  'rear',
  'showroom',
  'prototype',
]
