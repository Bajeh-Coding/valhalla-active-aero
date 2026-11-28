/**
 * Mockup-only chapter shell — placeholders, no scientific claims.
 * Imagery: official Aston Martin Valhalla page assets (downloaded, not hotlinked).
 */

export interface MockChapter {
  id: string
  number: number
  label: string
  kicker: string
  headline: string
  body: string
  image: { src: string; objectPosition?: string; sourceUrl: string }
}

export const MOCK_CHAPTERS: readonly MockChapter[] = [
  {
    id: 'introducere',
    number: 1,
    label: 'Introducere',
    kicker: 'Capitol 01 — placeholder',
    headline: 'Cadru și intenție',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placeholder pentru introducerea tematică — fără conținut științific real. Vestibulum ante ipsum primis in faucibus orci luctus.',
    image: {
      src: '/images/am-official/am-ch01-intro.jpg',
      objectPosition: '50% 40%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/exterior-banner.jpg',
    },
  },
  {
    id: 'problema',
    number: 2,
    label: 'Problema',
    kicker: 'Capitol 02 — placeholder',
    headline: 'Tensiunea de rezolvat',
    body: 'Capitol 02 — placeholder. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Textul va fi înlocuit cu formularea problemei de către autor.',
    image: {
      src: '/images/am-official/am-ch02-problema.jpg',
      objectPosition: '50% 45%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla/2026-redesign/valhalla-specification-banner-desktop.jpg',
    },
  },
  {
    id: 'fundamente',
    number: 3,
    label: 'Fundamente',
    kicker: 'Capitol 03 — placeholder',
    headline: 'Limbaj de bază',
    body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco. Capitol 03 — placeholder pentru fundamente conceptuale (slot gol, elegant).',
    image: {
      src: '/images/am-official/am-ch03-fundamente.jpg',
      objectPosition: '50% 40%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla/2026-redesign/valhalla-powertrain-hero-banner-desktop.jpg',
    },
  },
  {
    id: 'mecanisme',
    number: 4,
    label: 'Mecanisme',
    kicker: 'Capitol 04 — placeholder',
    headline: 'Cum se mișcă aerul',
    body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. Capitol 04 — placeholder pentru mecanisme; diagrama va veni mai târziu.',
    image: {
      src: '/images/am-official/am-ch04-mecanisme.jpg',
      objectPosition: '50% 45%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/driver-tile.jpg',
    },
  },
  {
    id: 'control',
    number: 5,
    label: 'Control',
    kicker: 'Capitol 05 — placeholder',
    headline: 'Bucla de decizie',
    body: 'Excepteur sint occaecat cupidatat non proident. Capitol 05 — placeholder pentru arhitectura de control (fără claim-uri tehnice).',
    image: {
      src: '/images/am-official/am-ch05-control.jpg',
      objectPosition: '55% 42%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/valhalla-lft-image.jpg',
    },
  },
  {
    id: 'regimuri',
    number: 6,
    label: 'Regimuri',
    kicker: 'Capitol 06 — placeholder',
    headline: 'Stări și tranziții',
    body: 'Sunt in culpa qui officia deserunt mollit anim id est laborum. Capitol 06 — placeholder pentru regimuri de operare.',
    image: {
      src: '/images/am-official/am-ch06-regimuri.jpg',
      objectPosition: '50% 40%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/valhalla-explore-tile-3.jpg',
    },
  },
  {
    id: 'studiu-de-caz',
    number: 7,
    label: 'Studiu de caz',
    kicker: 'Capitol 07 — placeholder',
    headline: 'Un scenariu ilustrativ',
    body: 'Curabitur pretium tincidunt lacus. Capitol 07 — placeholder pentru studiu de caz; media și datele vor fi alese de utilizator.',
    image: {
      src: '/images/am-official/am-ch07-caz.jpg',
      objectPosition: '50% 40%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/engineering-banner-desktop.jpg',
    },
  },
  {
    id: 'rezultate',
    number: 8,
    label: 'Rezultate',
    kicker: 'Capitol 08 — placeholder',
    headline: 'Ce observăm',
    body: 'Nulla facilisi. Capitol 08 — placeholder pentru rezultate; sloturi pentru grafice HUD, fără inventat date.',
    image: {
      src: '/images/am-official/am-ch08-rezultate.jpg',
      objectPosition: '50% 45%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/valhalla-explore-tile-2.jpg',
    },
  },
  {
    id: 'insight-uri',
    number: 9,
    label: 'Insight-uri',
    kicker: 'Capitol 09 — placeholder',
    headline: 'Lecturi utile',
    body: 'Pellentesque habitant morbi tristique senectus. Capitol 09 — placeholder pentru insight-uri și implicații.',
    image: {
      src: '/images/am-official/am-ch09-insight.jpg',
      objectPosition: '50% 45%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/interior-banner.jpg',
    },
  },
  {
    id: 'surse',
    number: 10,
    label: 'Surse',
    kicker: 'Capitol 10 — placeholder',
    headline: 'Referințe și note',
    body: 'Aenean commodo ligula eget dolor. Capitol 10 — placeholder pentru surse bibliografice; lista rămâne goală până la input.',
    image: {
      src: '/images/am-official/am-ch10-surse.jpg',
      objectPosition: '50% 45%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla/2026-redesign/valhalla-technology-banner-desktop.jpg',
    },
  },
] as const

export const HERO_IMAGE = {
  src: '/images/am-official/am-hero.jpg',
  objectPosition: '55% 45%',
  sourceUrl:
    'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/valhalla-white-16x9-web.mp4 (frame @ 2s) — official hero video still',
} as const
