/**
 * Presentation chapter shell — Cap 01 + Cap 08 have authored content;
 * others remain placeholders on this branch.
 * Imagery: official Aston Martin Valhalla page assets (downloaded, not hotlinked).
 */

import type { Cap08ChartSpec } from './cap08Charts'
import { CAP08_CHARTS } from './cap08Charts'

export interface MockChapterNote {
  /** Visible citation / footnote line (luxury caption style). */
  text: string
  /** Optional emphasis quote nested under the note. */
  quote?: string
}

export interface MockChapter {
  id: string
  number: number
  label: string
  kicker: string
  headline: string
  body: string
  /** Optional secondary paragraphs (Cap 08 how/why prose). */
  bodyExtra?: readonly string[]
  image: { src: string; objectPosition?: string; sourceUrl: string }
  /** Optional discreet footnotes — SAE / Cap citations. */
  notes?: readonly MockChapterNote[]
  /** Optional Cap 08 SVG chart specs (paper-exact only). */
  charts?: readonly Cap08ChartSpec[]
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
    label: 'Grafice',
    kicker: 'Capitol 08',
    headline: 'Grafice relevante — de ce Active Aero',
    body: 'Sinteză ilustrativă a Cap. 1–6: proiectare integrată și control mecatronic pe caroseria de referință Vantage, plantă 14 DOF, mașina de stări DRS / Aerobrake / MaxP, validare Nürburgring (−2.55 s), predicție PI-ROM și limita anvelopei (cerc Kamm / FL).',
    bodyExtra: [
      'Cum funcționează. Pe modelul multicorp 14 DOF (VI-CarRealTime), controlul aero nu optimizează continuu coeficienții, ci selectează stări discrete: DRS (AOA 0°, splitter deschis peste 110 km/h) pentru drag minim la accelerație; Aerobrake (AOA 19°) pentru forță de frânare aerodinamică; MaxP cu schedule empiric de AOA pe benzi de viteză (0° / 3° / 4.5°) pentru balanță aero când DRS și Aerobrake sunt inactive. Unde e nevoie de predicție rapidă a coeficienților, PI-ROM evaluează în ~0.09 ms — cu un ordin de mărime sub XFOIL.',
      'De ce este necesar. Aero pasivă fixează un singur compromis drag–downforce pe întreaga tură. La limita anvelopei, forțele longitudinale (FL / Fx) și laterale (Fy) sunt constrânse de cercul de frecare Kamm: √(Fx² + Fy²) ≤ μ·Fz. Downforce-ul activ crește Fz și, odată cu el, raza utilizabilă a cercului — fără a inventa valori OEM Valhalla. Rezultatul măsurat în SAE pe DIL Nürburgring GP: Passive–New 131.61 s → Active–MaxP 129.06 s (−2.55 s). Graficele de mai jos sunt ilustrative, citate din sursele Cap. 1–6.',
    ],
    image: {
      src: '/images/am-official/am-ch08-rezultate.jpg',
      objectPosition: '50% 45%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/valhalla-explore-tile-2.jpg',
    },
    charts: CAP08_CHARTS,
    notes: [
      {
        text: 'SAE Technical Paper 2020-36-0079 — Table 1 (specs), Table 3 (forțe @ 160 km/h), pp.5–6 (DRS / Aerobrake / MaxP), Table 6 (Nürburgring GP · −2.55 s DIL). Body shape de referință: Aston Martin Vantage 2019 — nu claim-uri OEM Valhalla.',
      },
      {
        text: 'subramanian_activeaeroROM_preprint.pdf, Table 2 — PI-ROM 0.0906 ms vs XFOIL CFD 2.4081 ms (26.58×).',
      },
      {
        text: 'Asperti, Vignati, Sabbioni — On Torque Vectoring Control: Review and Comparison — friction circle / ellipse ca limital anvelopei (diagramă conceptuală Cap. 08; fără μ inventat).',
      },
    ],
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
