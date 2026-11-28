/**
 * Canonical presentation chapters — strict map from
 * Informatii_pentru_Prezentare (ghid) → 11 site chapters.
 * Cap 09 = Active Aero Simulator (R3F), between guide slides 8 and 9.
 */

import type { GuideDiagramId } from '../components/GuideDiagrams'
import type { GuideChartId } from './guideCharts'

/** Legacy Cap 07 OEM surface block (kept for AeroSurfaces component types). */
export interface MockAeroSurface {
  id: string
  oemName: string
  roleRo: string
  facts?: readonly string[]
  image: { src: string; objectPosition?: string; alt: string }
}

export interface MockChapterDofItem {
  dof: string
  detail: string
}

export interface MockChapterSpecRow {
  parameter: string
  value: string
}

export interface MockChapterMode {
  name: string
  role: string
  lines: readonly string[]
}

export interface MockChapterFigure {
  /** Native SVG chart id (guide figures — no white PNG). */
  chartId: GuideChartId
  caption: string
}

export interface MockChapterModeColumn {
  id: string
  title: string
  hardware: readonly string[]
  activation: readonly string[]
  effect: readonly string[]
}

export interface MockChapterKpiRow {
  indicator: string
  value: string
}

export interface MockChapter {
  id: string
  number: number
  label: string
  kicker: string
  /** EN action title from guide. */
  actionTitle: string
  /** Principal RO title (slide text). */
  headline: string
  /** Optional RO subtitle under the headline (Cap 01 guide Subtitlu). */
  subtitle?: string
  /** Synthetic bullet points from guide §1. */
  bullets: readonly string[]
  /** Optional equations / HUD lines. */
  equations?: readonly string[]
  image: { src: string; objectPosition?: string; sourceUrl: string }
  figure?: MockChapterFigure
  dofBreakdown?: readonly MockChapterDofItem[]
  specs?: {
    caption: string
    rows: readonly MockChapterSpecRow[]
  }
  /** Cap 05 comparison — three modes as columns. */
  modeColumns?: readonly MockChapterModeColumn[]
  /** Legacy mode blocks (unused after ghid rewrite; kept for type compat). */
  modes?: readonly MockChapterMode[]
  diagrams?: readonly GuideDiagramId[]
  kpiTable?: {
    caption: string
    rows: readonly MockChapterKpiRow[]
  }
  summary?: readonly string[]
  references?: readonly string[]
  simulator?: boolean
}

export const MOCK_CHAPTERS: readonly MockChapter[] = [
  {
    id: 'cadru',
    number: 1,
    label: 'Cadru',
    kicker: 'Capitol 01 · Slide 1',
    actionTitle:
      'Optimizing Hypercar Performance via Active Aerodynamics & Mechatronic Control',
    headline:
      'Sisteme Integrate de Aerodinamică Activă și Control Mecatronic pe Hypercar-ul Aston Martin Valhalla',
    subtitle:
      'De la simulări multicorp (14 DOF) și optimizare AI (PI-ROM) la modelul de serie PHEV 1,079 PS.',
    bullets: [
      'Politecnico di Torino — Inginerie Mecanică și Aerospațială, în parteneriat cu Aston Martin Lagonda Ltd.',
      'Depășirea limitei de aderență a anvelopelor, fără masă inerțială adăugată.',
      'Control mecatronic în trei stări: DRS, Aerobrake și MaxP Aero-Balance.',
      'Predicție aerodinamică sub-milisecundă (< 0.1 ms) prin rețele neuronale (PI-ROM).',
    ],
    image: {
      src: '/images/am-official/am-ch01-intro.jpg',
      objectPosition: '50% 40%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/exterior-banner.jpg',
    },
  },

  {
    id: 'kamm',
    number: 2,
    label: 'Kamm',
    kicker: 'Capitol 02 · Slide 2',
    actionTitle:
      'Downforce Increases Tire Grip (Fy,max = μ * Fz) Without Adding Inertial Mass',
    headline: 'Cadrul Teoretic — Fizica Aerodinamicii și Limitele Pasive',
    bullets: [
      'Forța laterală la anvelopă e limitată de aderență: Fy,max = μ * Fz. Sistemele tradiționale nu pot depăși această limită când anvelopa se saturează.',
      'La viteze mari, peste 50% din energia vehiculului e consumată pentru învingerea rezistenței aerodinamice FD.',
      'Până la 2 Hz, tranzițiile aerodinamice sunt cvasi-statice — superpoziție liniară a forțelor.',
    ],
    equations: [
      'FD = 0.5 * ρ * v² * A * CD  [N]',
      'FL = 0.5 * ρ * v² * A * |CL|  [N]',
      'Fy,max = μ * Fz',
    ],
    image: {
      src: '/images/am-official/am-ch06-regimuri.jpg',
      objectPosition: '50% 40%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/valhalla-explore-tile-3.jpg',
    },
    diagrams: ['kamm'],
  },

  {
    id: 'modelare-14dof',
    number: 3,
    label: '14 DOF',
    kicker: 'Capitol 03 · Slide 3',
    actionTitle: '14 DOF Multibody Simulation Validates High-Speed Vehicle Stability',
    headline: 'Modelarea Dinamică Multicorp (14 DOF) & Platforma Virtuală',
    bullets: [
      'Arhitectura Modelului Multicorp (14 DOF) în VI-CarRealTime.',
      '6 DOF Șasiu (translații x, y, z + rotații roll, pitch, yaw).',
      '4 DOF Cursa verticală a suspensiilor la fiecare roată.',
      '4 DOF Dinamica de rotație și alunecarea longitudinală a roților.',
    ],
    image: {
      src: '/images/am-official/am-ch02-problema.jpg',
      objectPosition: '50% 45%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla/2026-redesign/valhalla-specification-banner-desktop.jpg',
    },
    dofBreakdown: [
      {
        dof: '6 DOF',
        detail: 'Șasiu — translații x, y, z + rotații roll, pitch, yaw',
      },
      {
        dof: '4 DOF',
        detail: 'Cursa verticală a suspensiilor la fiecare roată',
      },
      {
        dof: '4 DOF',
        detail: 'Dinamica de rotație și alunecarea longitudinală a roților',
      },
    ],
    specs: {
      caption:
        'Specificațiile Cheie ale Vehiculului de Referință (Hypercar 4WD EV)',
      rows: [
        {
          parameter: 'Masa Suspendată (ms) / Nesuspendată',
          value: '2050 kg / 190 kg (Total: 2240 kg)',
        },
        {
          parameter: 'Grup Motopropulsor / Putere Maximă',
          value: '4WD EV (4 Motoare Roată) / 1257 kW (1709 PS)',
        },
        {
          parameter: 'Geometrie Șasiu (Ampatament / CoG)',
          value: '2691 mm / Înălțime CoG: 378 mm',
        },
        {
          parameter: 'Distribuție Statică Masă (Față / Spate)',
          value: '43% Față / 57% Spate',
        },
      ],
    },
    diagrams: ['dof14'],
  },

  {
    id: 'pachet-aero',
    number: 4,
    label: 'Pachet',
    kicker: 'Capitol 04 · Slide 4',
    actionTitle: 'Active Aero Package Resolves the High-Speed Understeer Paradox',
    headline: 'Pachetul Aerodinamic Activ — Splitter Binar & Eleron Continuous',
    bullets: [
      'Splitter Frontal Activ: Acționare binară (ÎNCHIS = Downforce față maxim | DESCHIS = Canal inferior deschis pentru reducere Drag).',
      'Eleron Spate Activ: Modulare continuă AOA între 0° și 25° (stare pasivă de bază: 6°).',
      'Paradoxul Balanței Aerodinamice 50/50: Un pachet pasiv egalizat 50/50 pe punți a pierdut +1.007s pe tur față de mașina originală. Cuplul masiv pe spate crea subvirare severă la accelerare la ieșirea din viraj, cerând o balanță dinamică variabilă.',
      'Forțele Aerodinamice la 160 km/h: Drag = 788 N | Downforce Față = +470 N | Downforce Spate = +467 N.',
    ],
    image: {
      src: '/images/am-official/am-ch07-caz.jpg',
      objectPosition: '50% 40%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/engineering-banner-desktop.jpg',
    },
    figure: {
      chartId: 'fig-4-1-fl-fd-aoa',
      caption:
        'Figura 4.1: Evoluția Forțelor Aerodinamice (FL, FD) în funcție de Unghiul AOA la 160 km/h',
    },
  },

  {
    id: 'state-machine',
    number: 5,
    label: 'Stări',
    kicker: 'Capitol 05 · Slide 5',
    actionTitle:
      'Three-State Mechatronic Controller Seamlessly Shifts Aero-Balance',
    headline: 'Logica Mecatronică de Control prin Stări (State Machine)',
    bullets: [
      'Controllerul comută automat între 3 stări pe baza CAN-bus-ului vehiculului (viteză, apăsare pedale, senzori G).',
      'Modul DRS, Aerobrake și MaxP definesc configurația hardware, condițiile de activare și efectul dinamic.',
    ],
    image: {
      src: '/images/am-official/am-ch03-fundamente.jpg',
      objectPosition: '50% 40%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla/2026-redesign/valhalla-powertrain-hero-banner-desktop.jpg',
    },
    modeColumns: [
      {
        id: 'drs',
        title: 'Modul DRS (Low Drag)',
        hardware: ['AOA = 0°', 'Splitter = DESCHIS'],
        activation: [
          'Viteză > 110 km/h',
          'Accelerație > 70%',
          'Acc. Laterală < 1g',
        ],
        effect: [
          'Minimizare Drag (CD=0.31)',
          '0-300 km/h în 10.650s',
        ],
      },
      {
        id: 'aerobrake',
        title: 'Modul AEROBRAKE',
        hardware: ['AOA = 19°...25°', 'Splitter = ÎNCHIS'],
        activation: [
          'Viteză > 70 km/h',
          'Frână > 40%',
          'Acc. Laterală < 1g',
        ],
        effect: [
          'Decelerație & Downforce Spate',
          'Stabilitate pe frânare',
        ],
      },
      {
        id: 'maxp',
        title: 'Modul MAXP (Cornering)',
        hardware: ['AOA = 0°...4.5° Dinamic', 'Splitter = ÎNCHIS'],
        activation: [
          'Regim viraj stabil',
          'Viteză 100-300 km/h',
          'CoP suprapus peste CoG',
        ],
        effect: [
          'Optimizare Aero-Balance',
          'Maximizare Accelerație Lat.',
        ],
      },
    ],
    diagrams: ['state-machine'],
  },

  {
    id: 'nurburgring',
    number: 6,
    label: 'DIL',
    kicker: 'Capitol 06 · Slide 6',
    actionTitle: 'Active Aero Yields a Net -2.55s Lap Time Cut on Nürburgring GP',
    headline: 'Validarea pe Simulatorul Static DIL (Nürburgring GP)',
    bullets: [
      'Setup Testare DIL (Driver-in-the-Loop): Simulator profesional VI-Grade DIL la Udine (Italia), pe circuitul virtual Nürburgring GP.',
      'Pasiv Original Aero: 115.48s (VI-Driver) | 134.82s (Pilot Uman DIL)',
      'Pasiv Nou Aero (50/50): 114.08s (VI-Driver) | 131.61s (Pilot Uman DIL)',
      'ACTIV MaxP Aero Mode: 112.29s (VI-Driver) | 129.06s (Pilot Uman DIL)',
      'Câștig Net Pilot Uman: -2.55 secunde (MaxP vs Pasiv Nou) și -5.76 secunde total față de referința originală.',
      'Descoperire Cheie (Psihologia Pilotului): Pilotul uman câștigă mai mult decât cel virtual (-2.55s vs -1.79s) deoarece aerodinamica activă elimină instabilitatea pe frânare și oferă încredere totală în viraj.',
    ],
    image: {
      src: '/images/am-official/am-ch04-mecanisme.jpg',
      objectPosition: '50% 45%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/driver-tile.jpg',
    },
    figure: {
      chartId: 'fig-6-1-nurburgring',
      caption:
        'Figura 6.1: Comparația Timpilor pe Tur pe Nürburgring GP (VI-Driver vs. Pilot Uman DIL)',
    },
  },

  {
    id: 'valhalla-serie',
    number: 7,
    label: 'Valhalla',
    kicker: 'Capitol 07 · Slide 7',
    actionTitle:
      'Production Valhalla Delivers 1,079 PS and >600 kg Downforce at 240 km/h',
    headline: 'Transpunerea pe Modelul de Serie Aston Martin Valhalla (PHEV)',
    bullets: [
      'Grup Motopropulsor PHEV (1,079 PS Total).',
      'Motor Termic (ICE): 4.0L V8 Biturbo Flat-Plane Crank (817 PS).',
      'Motoare Electrice: 3 eMotoare (2 pe puntea față cu Torque Vectoring + 1 în transmisie) = 248 PS.',
      'Performanțe Dinamice de Vârf: 0-100 km/h în 2.5s | VMax 350 km/h | Masă uscată 1655 kg (Monococă Carbon F1).',
      'Capabilități Aerodinamice de Serie: Downforce de peste 600 kg la 240 km/h. Timp de acționare mecatronică sub 0.4s (< 400 ms) pentru eleronul hidraulic cu cursă de 255 mm.',
      'Țintă Nürburgring Nordschleife: Sub 6 minute și 30 secunde (< 6:30.00).',
    ],
    image: {
      src: '/images/am-official/am-ch07-rear-wing.jpg',
      objectPosition: '50% 40%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/engineering-banner-desktop.jpg',
    },
    figure: {
      chartId: 'fig-7-1-downforce',
      caption:
        'Figura 7.1: Curba de Apăsare Aerodinamică (Downforce) pe Modelul de Serie Valhalla',
    },
  },

  {
    id: 'pi-rom',
    number: 8,
    label: 'PI-ROM',
    kicker: 'Capitol 08 · Slide 8',
    actionTitle:
      'Physics-Informed Neural Model (PI-ROM) Enables <0.1 ms Closed-Loop Control',
    headline: 'Inteligența Artificială & Predicția în Timp Real (PI-ROM & NLP)',
    bullets: [
      'Problema CFD Clasic: Simulările CFD tradiționale necesită secunde/minute per iterație, fiind inaccesibile pentru un controller mecatronic în timp real (< 1 ms).',
      'Arhitectura Hibridă PI-ROM (Physics-Informed Reduced-Order Model): Combină teoria profilului subțire [CL = 2π(α-α0)] și polara de rezistență [CD = CD0 + K*CL²] cu o rețea neuronală reziduală PyTorch.',
      'Performanță Computațională: Execuție în 0.0906 ms (26.58x mai rapid decât CFD XFOIL la 2.4081 ms). Precizie R² = 0.9959 pe CL.',
      'Optimizare Traiectorie (NLP / IPOPT): Formularea liniei ideale de cursă și a managementului de energie prin programare nelineară (Pieter de Buck).',
    ],
    equations: [
      'CL = 2π(α − α0)',
      'CD = CD0 + K · CL²',
    ],
    image: {
      src: '/images/am-official/am-ch05-control.jpg',
      objectPosition: '55% 42%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/valhalla-lft-image.jpg',
    },
    figure: {
      chartId: 'fig-8-1-pi-rom',
      caption:
        'Figura 8.1: Timpul de Execuție Computațional: CFD XFOIL vs. Rețeaua Neuronală PI-ROM',
    },
  },

  {
    id: 'simulator',
    number: 9,
    label: 'Simulator',
    kicker: 'Capitol 09 · Simulator 3D',
    actionTitle: 'Interactive Active Aero Simulator (R3F)',
    headline: 'Simulator Active Aero 3D',
    bullets: [
      'Explorează programele DRS, Aerobrake și MaxP pe modelul 3D Valhalla.',
      'Ajustează viteza, AOA, splitter și pedalele; vezi feedback vizual al suprafețelor active.',
      'Ancoră forțe absolute doar la Table 3 @ 160 km/h (Drag = 788 N | DF față +470 N | DF spate +467 N).',
    ],
    image: {
      src: '/images/am-official/am-ch09-insight.jpg',
      objectPosition: '50% 45%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/interior-banner.jpg',
    },
    simulator: true,
  },

  {
    id: 'discutii',
    number: 10,
    label: 'Discuții',
    kicker: 'Capitol 10 · Slide 9',
    actionTitle: 'Co-Design of Mechatronics & Aerodynamics Replaces Isolated Engineering',
    headline: 'Discuții & Implicații pentru Ingineria Auto Modernă',
    bullets: [
      'Schimbarea de Paradigmă în Proiectare: Trecerea de la silozuri inginerești izolate la dezvoltare concomitentă (Concurrent Engineering) între aerodinamică, șasiu și software.',
      'Sinergia Mecatronică Nivel 4: Aerodinamica activă lucrează în sinergie cu Vectorizarea Cuplului (Torque Vectoring) și suspensia activă pentru a neutraliza subvirarea.',
      'Replicabilitate pe Vehicule Electrice (EV): Metodologia poate fi transferată pe orice vehicul electric de performanță pentru a îmbunătăți eficiența energetică și timpii pe tur.',
    ],
    image: {
      src: '/images/am-official/am-ch08-rezultate.jpg',
      objectPosition: '50% 45%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/valhalla-explore-tile-2.jpg',
    },
    diagrams: ['synergy'],
  },

  {
    id: 'concluzii',
    number: 11,
    label: 'Concluzii',
    kicker: 'Capitol 11 · Slide 10',
    actionTitle: 'Active Aerodynamics Transforms Vehicle Dynamics & Track Confidence',
    headline: 'Concluzii Majore & Referințe Bibliografice',
    bullets: [
      'Concluzia 1: Aerodinamica activă extinde cercul de aderență Kamm fără a adăuga masă inerțială.',
      'Concluzia 2: O balanță pasivă 50/50 este suboptimală pe vehicule 4WD; este necesară ajustarea mecatronică dinamică CoP vs CoG.',
      'Concluzia 3: Câștig net de -2.55s pe Nürburgring GP pe simulatorul DIL, eliminând instabilitatea la frânare.',
      'Concluzia 4: Modelul de serie Valhalla confirmă fezabilitatea industrială (1079 PS, >600 kg downforce, acționare <0.4s).',
    ],
    image: {
      src: '/images/am-official/am-ch10-surse.jpg',
      objectPosition: '50% 45%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla/2026-redesign/valhalla-technology-banner-desktop.jpg',
    },
    summary: [
      'Concluzia 1: Aerodinamica activă extinde cercul de aderență Kamm fără a adăuga masă inerțială.',
      'Concluzia 2: O balanță pasivă 50/50 este suboptimală pe vehicule 4WD; este necesară ajustarea mecatronică dinamică CoP vs CoG.',
      'Concluzia 3: Câștig net de -2.55s pe Nürburgring GP pe simulatorul DIL, eliminând instabilitatea la frânare.',
      'Concluzia 4: Modelul de serie Valhalla confirmă fezabilitatea industrială (1079 PS, >600 kg downforce, acționare <0.4s).',
    ],
    kpiTable: {
      caption: 'Indicatori cheie de performanță (KPI) — din ghid',
      rows: [
        {
          indicator: 'Câștig net DIL (MaxP vs Pasiv Nou)',
          value: '−2.55 s (pilot uman)',
        },
        {
          indicator: 'Câștig total vs Original (pilot uman)',
          value: '−5.76 s',
        },
        {
          indicator: 'DRS 0–300 km/h',
          value: '10.650 s (față de 10.728 s)',
        },
        {
          indicator: 'Forțe @ 160 km/h',
          value: 'Drag 788 N · DF față +470 N · DF spate +467 N',
        },
        {
          indicator: 'PI-ROM execuție',
          value: '0.0906 ms (26.58× vs XFOIL 2.4081 ms); R² = 0.9959 pe CL',
        },
        {
          indicator: 'Valhalla serie',
          value: '1,079 PS · >600 kg DF @ 240 km/h · acționare <0.4 s',
        },
      ],
    },
    references: [
      'Carvalho Pinheiro et al. (SAE 2020-36-0079)',
      'Subramanian (2021)',
      'Pieter de Buck (2021)',
      'Aston Martin Lagonda (2025)',
    ],
  },
] as const

export const HERO_IMAGE = {
  src: '/images/am-official/am-hero.jpg',
  objectPosition: '55% 45%',
  sourceUrl:
    'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/valhalla-white-16x9-web.mp4 (frame @ 2s) — official hero video still',
} as const
