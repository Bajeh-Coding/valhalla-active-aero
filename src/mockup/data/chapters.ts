/**
 * Presentation chapter shell — Cap 01–02 have authored content; others remain placeholders.
 * Imagery: official Aston Martin Valhalla page assets (downloaded, not hotlinked).
 */

export interface MockChapterNote {
  /** Visible citation / footnote line (luxury caption style). */
  text: string
  /** Optional emphasis quote nested under the note. */
  quote?: string
}

export interface MockChapterDofItem {
  /** DOF count label, e.g. "6 DOF". */
  dof: string
  /** Short description grounded in the SAE paper. */
  detail: string
}

export interface MockChapterSpecRow {
  parameter: string
  value: string
}

export interface MockChapter {
  id: string
  number: number
  label: string
  kicker: string
  headline: string
  body: string
  image: { src: string; objectPosition?: string; sourceUrl: string }
  /** Optional discreet footnotes — SAE citations. */
  notes?: readonly MockChapterNote[]
  /** Optional 14 DOF breakdown (Cap 02). */
  dofBreakdown?: readonly MockChapterDofItem[]
  /** Optional Table 1-style specs (Cap 02). */
  specs?: {
    caption: string
    rows: readonly MockChapterSpecRow[]
  }
}

export const MOCK_CHAPTERS: readonly MockChapter[] = [
  {
    id: 'introducere',
    number: 1,
    label: 'Introducere',
    kicker: 'Capitol 01',
    headline:
      'Aston Martin Valhalla — Active Aerodynamics & Mechatronic Control',
    body: 'Dezvoltarea integrată a pachetului aerodinamic activ și control mecatronic pe caroseria de referință Aston Martin Vantage (4WD Electric Hypercar).',
    image: {
      src: '/images/am-official/am-ch01-intro.jpg',
      objectPosition: '50% 40%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/exterior-banner.jpg',
    },
    notes: [
      {
        text: 'SAE Technical Paper 2020-36-0079 — Integrated Design and Control of Active Aerodynamic Features for High Performance Electric Vehicles (Henrique de Carvalho Pinheiro, Alessandro Ferraris, Alessandro Messana, Massimiliana Carello, Davide De Cupis, Lorenzo Sisca, Andrea Giancarlo Airale).',
      },
      {
        text: 'SAE 2020-36-0079, p.3 — Baseline Aerodynamic and Surfaces Design / Fig.3:',
        quote:
          'From the aerodynamic point of view, the reference vehicle body shape selected for this paper is the Aston Martin Vantage 2019...',
      },
    ],
  },
  {
    id: 'problema',
    number: 2,
    label: 'Modelare',
    kicker: 'Capitol 02',
    headline: 'Modelarea Dinamică Multicorp (14 DOF)',
    body: 'Modelarea șasiului și a suspensiilor pe un model dinamic multicorp cu 14 Grade de Libertate (14 DOF) în mediul VI-CarRealTime.',
    image: {
      src: '/images/am-official/am-ch02-problema.jpg',
      objectPosition: '50% 45%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla/2026-redesign/valhalla-specification-banner-desktop.jpg',
    },
    dofBreakdown: [
      {
        dof: '6 DOF',
        detail: 'mișcare spațială a șasiului (sprung mass)',
      },
      {
        dof: '4 DOF',
        detail: 'cursă suspensie (suspensions’ stroke)',
      },
      {
        dof: '4 DOF',
        detail: 'alunecare longitudinală a roților (wheels’ longitudinal slip)',
      },
    ],
    specs: {
      caption: 'Table 1 — Vehicle reference model technical specification',
      rows: [
        { parameter: 'Sprung mass', value: '2050 kg' },
        { parameter: 'Power', value: '1257 kW' },
        { parameter: 'Wheelbase', value: '2691 mm' },
        { parameter: 'Frontal area', value: '2.1 m²' },
      ],
    },
    notes: [
      {
        text: 'SAE 2020-36-0079, p.2 — Vehicle Model and Tailored Maneuvers: VI-CarRealTime; reduced DOF model with 5 rigid parts and 14 DOF (6 chassis / 4 suspension stroke / 4 wheels’ longitudinal slip).',
      },
      {
        text: 'SAE 2020-36-0079, p.3 — Table 1 (Vehicle reference model technical specification): sprung mass 2050 kg; maximum power* 1257 kW; wheelbase 2691 mm; frontal area 2.1 m².',
      },
    ],
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
