/**
 * Mockup-only chapter shell — placeholders, no scientific claims.
 */

export interface MockChapter {
  id: string
  number: number
  label: string
  /** Short eyebrow under the number */
  kicker: string
  headline: string
  body: string
  /** Local Valhalla still or CSS abstract key */
  image:
    | { kind: 'valhalla'; key: ValhallaKey }
    | { kind: 'abstract'; tone: 'green' | 'graphite' | 'lime' }
}

export type ValhallaKey =
  | 'hero'
  | 'showroom'
  | 'front'
  | 'side'
  | 'rear'
  | 'prototype'

export const MOCK_CHAPTERS: readonly MockChapter[] = [
  {
    id: 'introducere',
    number: 1,
    label: 'Introducere',
    kicker: 'Capitol 01 — placeholder',
    headline: 'Cadru și intenție',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placeholder pentru introducerea tematică — fără conținut științific real. Vestibulum ante ipsum primis in faucibus orci luctus.',
    image: { kind: 'valhalla', key: 'showroom' },
  },
  {
    id: 'problema',
    number: 2,
    label: 'Problema',
    kicker: 'Capitol 02 — placeholder',
    headline: 'Tensiunea de rezolvat',
    body: 'Capitol 02 — placeholder. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Textul va fi înlocuit cu formularea problemei de către autor.',
    image: { kind: 'abstract', tone: 'graphite' },
  },
  {
    id: 'fundamente',
    number: 3,
    label: 'Fundamente',
    kicker: 'Capitol 03 — placeholder',
    headline: 'Limbaj de bază',
    body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco. Capitol 03 — placeholder pentru fundamente conceptuale (slot gol, elegant).',
    image: { kind: 'valhalla', key: 'front' },
  },
  {
    id: 'mecanisme',
    number: 4,
    label: 'Mecanisme',
    kicker: 'Capitol 04 — placeholder',
    headline: 'Cum se mișcă aerul',
    body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. Capitol 04 — placeholder pentru mecanisme; diagrama va veni mai târziu.',
    image: { kind: 'abstract', tone: 'green' },
  },
  {
    id: 'control',
    number: 5,
    label: 'Control',
    kicker: 'Capitol 05 — placeholder',
    headline: 'Bucla de decizie',
    body: 'Excepteur sint occaecat cupidatat non proident. Capitol 05 — placeholder pentru arhitectura de control (fără claim-uri tehnice).',
    image: { kind: 'valhalla', key: 'side' },
  },
  {
    id: 'regimuri',
    number: 6,
    label: 'Regimuri',
    kicker: 'Capitol 06 — placeholder',
    headline: 'Stări și tranziții',
    body: 'Sunt in culpa qui officia deserunt mollit anim id est laborum. Capitol 06 — placeholder pentru regimuri de operare.',
    image: { kind: 'abstract', tone: 'lime' },
  },
  {
    id: 'studiu-de-caz',
    number: 7,
    label: 'Studiu de caz',
    kicker: 'Capitol 07 — placeholder',
    headline: 'Un scenariu ilustrativ',
    body: 'Curabitur pretium tincidunt lacus. Capitol 07 — placeholder pentru studiu de caz; media și datele vor fi alese de utilizator.',
    image: { kind: 'valhalla', key: 'rear' },
  },
  {
    id: 'rezultate',
    number: 8,
    label: 'Rezultate',
    kicker: 'Capitol 08 — placeholder',
    headline: 'Ce observăm',
    body: 'Nulla facilisi. Capitol 08 — placeholder pentru rezultate; sloturi pentru grafice HUD, fără inventat date.',
    image: { kind: 'abstract', tone: 'graphite' },
  },
  {
    id: 'insight-uri',
    number: 9,
    label: 'Insight-uri',
    kicker: 'Capitol 09 — placeholder',
    headline: 'Lecturi utile',
    body: 'Pellentesque habitant morbi tristique senectus. Capitol 09 — placeholder pentru insight-uri și implicații.',
    image: { kind: 'valhalla', key: 'prototype' },
  },
  {
    id: 'surse',
    number: 10,
    label: 'Surse',
    kicker: 'Capitol 10 — placeholder',
    headline: 'Referințe și note',
    body: 'Aenean commodo ligula eget dolor. Capitol 10 — placeholder pentru surse bibliografice; lista rămâne goală până la input.',
    image: { kind: 'abstract', tone: 'green' },
  },
] as const

export const VALHALLA_SRC: Record<ValhallaKey, string> = {
  hero: '/images/valhalla/hero.jpg',
  showroom: '/images/valhalla/showroom.jpg',
  front: '/images/valhalla/front.jpg',
  side: '/images/valhalla/side.jpg',
  rear: '/images/valhalla/rear.jpg',
  prototype: '/images/valhalla/prototype.jpg',
}
