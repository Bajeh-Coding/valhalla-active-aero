/**
 * Valhalla stills — official Aston Martin page assets (local copies).
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
  license: string
  commonsUrl: string
}

export const VALHALLA_ASSETS: Record<ValhallaAssetKey, ValhallaAsset> = {
  hero: {
    src: '/images/am-official/am-hero.jpg',
    alt: 'Aston Martin Valhalla — official hero still',
    objectPosition: '55% 45%',
    credit: 'astonmartin.com Valhalla hero video still',
    license: 'Aston Martin media (mockup local copy)',
    commonsUrl:
      'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/valhalla-white-16x9-web.mp4',
  },
  showroom: {
    src: '/images/am-official/am-ch01-intro.jpg',
    alt: 'Aston Martin Valhalla — exterior banner',
    objectPosition: '50% 40%',
    credit: 'exterior-banner.jpg',
    license: 'Aston Martin media (mockup local copy)',
    commonsUrl:
      'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/exterior-banner.jpg',
  },
  front: {
    src: '/images/am-official/am-ch02-problema.jpg',
    alt: 'Aston Martin Valhalla — specification banner',
    objectPosition: '50% 45%',
    credit: 'valhalla-specification-banner-desktop.jpg',
    license: 'Aston Martin media (mockup local copy)',
    commonsUrl:
      'https://www.astonmartin.com/-/media/models---valhalla/2026-redesign/valhalla-specification-banner-desktop.jpg',
  },
  side: {
    src: '/images/am-official/am-ch05-control.jpg',
    alt: 'Aston Martin Valhalla — LFT image',
    objectPosition: '55% 42%',
    credit: 'valhalla-lft-image.jpg',
    license: 'Aston Martin media (mockup local copy)',
    commonsUrl:
      'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/valhalla-lft-image.jpg',
  },
  rear: {
    src: '/images/am-official/am-ch07-caz.jpg',
    alt: 'Aston Martin Valhalla — engineering banner',
    objectPosition: '50% 40%',
    credit: 'engineering-banner-desktop.jpg',
    license: 'Aston Martin media (mockup local copy)',
    commonsUrl:
      'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/engineering-banner-desktop.jpg',
  },
  prototype: {
    src: '/images/am-official/am-ch09-insight.jpg',
    alt: 'Aston Martin Valhalla — interior banner',
    objectPosition: '50% 45%',
    credit: 'interior-banner.jpg',
    license: 'Aston Martin media (mockup local copy)',
    commonsUrl:
      'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/interior-banner.jpg',
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
