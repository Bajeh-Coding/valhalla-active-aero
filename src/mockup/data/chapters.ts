/**
 * Presentation chapter shell — all 10 chapters have authored content.
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

/** Cap 07 — official OEM aerodynamic control surface. */
export interface MockAeroSurface {
  id: string
  /** OEM English name (official AM terminology). */
  oemName: string
  /** Short Romanian role / function. */
  roleRo: string
  /** Optional OEM fact chips (keep English terms). */
  facts?: readonly string[]
  image: { src: string; objectPosition?: string; alt: string }
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

export interface MockChapterMode {
  /** Short mode name (DRS / Aerobrake / MaxP). */
  name: string
  /** One-line role of the mode. */
  role: string
  /** Parameter lines sourced from SAE control strategy. */
  lines: readonly string[]
}

export interface MockChapter {
  id: string
  number: number
  label: string
  kicker: string
  headline: string
  body: string
  /** Optional short recap lines (Cap 10 Concluzii). */
  summary?: readonly string[]
  /** Optional secondary paragraphs (Cap 08 how/why prose). */
  bodyExtra?: readonly string[]
  image: { src: string; objectPosition?: string; sourceUrl: string }
  /** Optional discreet footnotes — SAE / Gao / Subramanian citations. */
  notes?: readonly MockChapterNote[]
  /** Optional 14 DOF breakdown (Cap 02). */
  dofBreakdown?: readonly MockChapterDofItem[]
  /** Optional Table 1-style specs (Cap 02). */
  specs?: {
    caption: string
    rows: readonly MockChapterSpecRow[]
  }
  /** Optional control-mode blocks — Cap 03 state machine. */
  modes?: readonly MockChapterMode[]
  /** Cap 07 — per-surface visual blocks (OEM/marketing only). */
  surfaces?: readonly MockAeroSurface[]
  /** Optional Cap 08 SVG chart specs (paper-exact only). */
  charts?: readonly Cap08ChartSpec[]
  /** Cap 09 — embed interactive Active Aero simulator. */
  simulator?: boolean
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
    label: 'Stări',
    kicker: 'Capitol 03',
    headline:
      'Sistemul de Control prin Stări (DRS, Aerobrake, MaxP)',
    body: 'Arhitectura mașinii de stări (State Machine) cu 3 moduri active: DRS (reducere drag), Aerobrake (frânare aerodinamică), MaxP (optimizarea balanței aerodinamice CoP vs. CoG în viraje).',
    image: {
      src: '/images/am-official/am-ch03-fundamente.jpg',
      objectPosition: '50% 40%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla/2026-redesign/valhalla-powertrain-hero-banner-desktop.jpg',
    },
    modes: [
      {
        name: 'DRS',
        role: 'Reducere drag',
        lines: [
          'AOA = 0°',
          'Splitter = DESCHIS la viteză > 110 km/h',
          'Pedală accelerație > 70%',
        ],
      },
      {
        name: 'Aerobrake',
        role: 'Frânare aerodinamică',
        lines: [
          'AOA = 19°..25°',
          'Splitter = ÎNCHIS la frânare > 40%',
        ],
      },
      {
        name: 'MaxP',
        role: 'Balanță aerodinamică CoP vs. CoG',
        lines: [
          'AOA = 0° la 100–180 km/h',
          'AOA = 3° la 180–250 km/h',
          'AOA = 4.5° la 250–300 km/h',
        ],
      },
    ],
    notes: [
      {
        text: 'SAE 2020-36-0079, pp.4–6 — State machine and Control Strategy (DRS, DRS + Aerobrake, MaxP).',
      },
    ],
  },
  {
    id: 'mecanisme',
    number: 4,
    label: 'Traiectorie',
    kicker: 'Capitol 04',
    headline:
      'Optimizarea Traiectoriei & Performanța pe Tur (−2.55s Nürburgring GP)',
    body: 'Reducerea timpului pe tur cu −2.55 secunde pentru pilotul uman pe simulatorul profesional VI-Grade DIL pe circuitul Nürburgring GP.',
    image: {
      src: '/images/am-official/am-ch04-mecanisme.jpg',
      objectPosition: '50% 45%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/driver-tile.jpg',
    },
    notes: [
      {
        text: 'SAE 2020-36-0079 Table 6 (pp.6–7): Passive New 131.61s → ACTIVE MaxP 129.06s (human DIL) → delta −2.55s.',
      },
      {
        text: 'Trajectory Optimization — Pieter de Buck (URL) — NLP formulation using OpenMDAO, Dymos, IPOPT for ideal line + AOA/torque vectoring optimization.',
      },
    ],
  },
  {
    id: 'control',
    number: 5,
    label: 'Control',
    kicker: 'Capitol 05',
    headline: 'Modelul de Predicție AI în Timp Real (PI-ROM)',
    body: 'Modelul hibrid bazat pe fizică integrată și rețea neuronală reziduală (PI-ROM) pentru calculul coeficienților aerodinamici în buclă închisă sub 1 ms.',
    image: {
      src: '/images/am-official/am-ch05-control.jpg',
      objectPosition: '55% 42%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/valhalla-lft-image.jpg',
    },
    notes: [
      {
        text: 'subramanian_activeaeroROM_preprint.pdf, p.1 Abstract — PI-ROM architecture: thin airfoil theory + residual neural network + computational acceleration.',
      },
      {
        text: 'subramanian_activeaeroROM_preprint.pdf, p.27 Table 2 — PI-ROM 0.0906 ms vs XFOIL CFD 2.4081 ms → 26.58× faster.',
      },
    ],
  },
  {
    id: 'regimuri',
    number: 6,
    label: 'Cadrul teoretic',
    kicker: 'Capitol 06',
    headline: 'Cadrul Teoretic General (Frecare & Saturație Anvelope)',
    body: 'Limitele sistemelor pasive/tradiționale cauzate de saturația cercului de frecare Kamm (Fy,max = μ FZ).',
    image: {
      src: '/images/am-official/am-ch06-regimuri.jpg',
      objectPosition: '50% 40%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/valhalla-explore-tile-3.jpg',
    },
    notes: [
      {
        text: 'Wei Gao et al., 2021 — Journal of Physics; 1fbd01b59b71746ed236baedf6ea44c4.pdf.',
      },
      {
        text: 'pp.1–2 Intro & 2.1 Fuel consumption: tire physical limit; aerodynamic downforce (FL) extends adhesion limit without added mass.',
      },
    ],
  },
  {
    id: 'studiu-de-caz',
    number: 7,
    label: 'Studiu de caz',
    kicker: 'Capitol 07 · OEM',
    headline: 'Active Aero — Aston Martin Valhalla',
    body: 'Suprafețele aerodinamice active ale Valhalla, așa cum le descrie Aston Martin oficial: aripi față/spate, splitter, air-dam, underbody / venturi, diffuser și canalele din dihedral doors. Surse: pagina de model, comunicatul de presă și brochure 2025 — fără claim-uri SAE inventate.',
    image: {
      src: '/images/am-official/am-ch07-caz.jpg',
      objectPosition: '50% 40%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/engineering-banner-desktop.jpg',
    },
    surfaces: [
      {
        id: 'front-wing',
        oemName: 'Active front wing',
        roleRo:
          'Aripa față twin-element, ascunsă în spatele grilei AM, chiar înaintea axei față. Un singur mecanism controlează downforce-ul aripii și fluxul spre underfloor vanes; în Race trece în maximum downforce, cu bleed AoA / DRS automat. Reacție ≤ 0,5 s. Include cooling bypass pentru drag redus la viteză mare.',
        facts: [
          'twin-element · hidden behind grille',
          'reactive ≤ 0.5 s',
          'Race · max DF + DRS bleed',
        ],
        image: {
          src: '/images/am-official/am-ch07-front-wing.jpg',
          objectPosition: '50% 45%',
          alt: 'Aston Martin Valhalla — active front wing / grille aero detail (official)',
        },
      },
      {
        id: 'rear-wing',
        oemName: 'Active rear wing · dual-element T-wing',
        roleRo:
          'Aripa spate dual-element „T” pe rame hidraulice. În EV / Sport / Sport+ rămâne stowed; în Race se ridică cu 255 mm. IVC ajustează AoA pentru downforce, drag sau distanță de frânare; la frânare puternică se depliază ca air brake sub 0,5 s, împreună cu aripa față pentru aero-balance.',
        facts: [
          '+255 mm · Race mode',
          'DRS · air brake',
          'IVC · reactive ≤ 0.5 s',
        ],
        image: {
          src: '/images/am-official/am-ch07-rear-wing.jpg',
          objectPosition: '50% 40%',
          alt: 'Aston Martin Valhalla — active rear T-wing deployed (official)',
        },
      },
      {
        id: 'front-splitter',
        oemName: 'Carbon fibre front splitter',
        roleRo:
          'Splitter față din carbon fibre: delimitează fluxul inferior și lucrează cu under-floor-ul concav din spatele său pentru zona de joasă presiune care generează downforce pe axa față.',
        facts: ['carbon fibre', 'pairs with concave under-floor'],
        image: {
          src: '/images/am-official/am-ch07-front.jpg',
          objectPosition: '50% 55%',
          alt: 'Aston Martin Valhalla — front splitter and nose aero (official)',
        },
      },
      {
        id: 'air-dam',
        oemName: 'Active air-dam · underfloor turning vanes',
        roleRo:
          'Air-dam activ care controlează automat underfloor turning vanes — modulează fluxul sub podea împreună cu aripa față, pentru balance și managearea aerului spre venturi.',
        facts: ['active air-dam', 'underfloor turning vanes'],
        image: {
          src: '/images/am-official/am-ch07-vanes.jpg',
          objectPosition: '50% 45%',
          alt: 'Aston Martin Valhalla — F1-inspired vanes / air apertures (official)',
        },
      },
      {
        id: 'underbody',
        oemName: 'Underbody · flat floor · venturi tunnels',
        roleRo:
          'Arhitectură underbody AMPT: flat floor, under-floor concav față și rear venturi tunnels accelerează aerul sub mașină. Claim public: >600 kg downforce @ 150 mph / de la 240 km/h, menținut până la vMax 350 km/h prin bleed AoA pe aripi.',
        facts: [
          '>600 kg DF @ 150 mph (Race)',
          'flat floor · venturi',
          'maintained to 350 km/h',
        ],
        image: {
          src: '/images/am-official/am-ch07-underbody.jpg',
          objectPosition: '50% 50%',
          alt: 'Aston Martin Valhalla — underbody / venturi aero (official)',
        },
      },
      {
        id: 'rear-diffuser',
        oemName: 'Carbon fibre rear diffuser',
        roleRo:
          'Diffuser spate din carbon fibre, împreună cu venturi tunnels, gestionează evacuarea fluxului underbody și completează pachetul de downforce pe axa spate alături de T-wing.',
        facts: ['carbon fibre rear diffuser', 'with venturi tunnels'],
        image: {
          src: '/images/am-official/am-ch07-rear-design.jpg',
          objectPosition: '50% 55%',
          alt: 'Aston Martin Valhalla — rear diffuser and tail aero (official)',
        },
      },
      {
        id: 'door-ducts',
        oemName: 'Dihedral door ducts · Concealed Extraction',
        roleRo:
          'Suprafețele interioare ale dihedral doors acționează ca ducte aerodinamice ascunse: ghidează aerul din wheel arches pe flancuri spre coolerele de ulei motor / transmisie — +50% eficiență termică fără side scoops vizibile.',
        facts: ['hidden aerodynamic ducts', '+50% thermal efficiency (AM)'],
        image: {
          src: '/images/am-official/am-ch07-doors.jpg',
          objectPosition: '50% 45%',
          alt: 'Aston Martin Valhalla — dihedral doors / flank aero ducts (official)',
        },
      },
    ],
    notes: [
      {
        text: 'Aston Martin official — Model page: https://www.astonmartin.com/en/models/valhalla (Aerodynamics specs; Aerodynamic Directives: Concealed Extraction, Active Equilibrium, Venturi Velocity).',
      },
      {
        text: 'Aston Martin official — Press: “Valhalla: The ultimate drivers supercar” (11 Dec 2024) — active front/rear wings, IVC, Race +255 mm, DRS / air brake, >600 kg downforce.',
      },
      {
        text: 'Aston Martin official — Valhalla Brochure 2025: Unparalleled active aero / Active aero / Front and rear wing (active air-dam, venturi, diffuser, cooling by-pass).',
      },
    ],
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
    label: 'Simulator',
    kicker: 'Capitol 09',
    headline: 'Simulator Active Aero',
    body: 'Explorează programele SAE DRS, Aerobrake și MaxP: ajustează viteza, AOA, splitter și pedalele; vezi feedback vizual și indici educaționali relativi (forțe absolute doar la ancora Table 3 @ 160 km/h).',
    image: {
      src: '/images/am-official/am-ch09-insight.jpg',
      objectPosition: '50% 45%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/interior-banner.jpg',
    },
    simulator: true,
    notes: [
      {
        text: 'SAE 2020-36-0079 — modes DRS / Aerobrake / MaxP / Standard: AOA setpoints, splitter OPEN|CLOSED, throttle/brake/|ay| gates (S1-F020–F051).',
      },
      {
        text: 'SAE 2020-36-0079, Table 3 @ 160 km/h (New Pack): absolute drag / front DF / rear DF anchors only — no invented Valhalla OEM forces away from this speed.',
      },
    ],
  },

  {
    id: 'surse',
    number: 10,
    label: 'Concluzii',
    kicker: 'Capitol 10',
    headline: 'Concluzii — pachet integrat, rezultat măsurat',
    body: 'Sistemul integrat de aerodinamică activă și control mecatronic leagă proiectarea, modelarea și comanda într-un singur fir: de la caroseria de referință la bucla în timp real pe simulator.',
    summary: [
      '01 — Design integrat: Active Aerodynamics & Mechatronic Control pe referința Aston Martin Vantage / limbaj Valhalla.',
      '02 — Modelare dinamică multicorp 14 DOF (VI-CarRealTime).',
      '03 — Mașină de stări: DRS / Aerobrake / MaxP.',
      '04 — Traiectorie & rezultat: −2.55 s pe Nürburgring GP (simulator).',
      '05 — PI-ROM pentru comandă rapidă în buclă.',
      '06 — Fundamente Kamm / FL: limita de aderență și forța verticală.',
      '07 — Suprafețe OEM Valhalla ca ancoră vizuală / de produs.',
      '08 — Grafice și lectură „de ce” asupra forțelor și a compromisului drag–downforce.',
      '09 — Simulator DIL / VI-Grade ca spațiu de validare.',
    ],
    image: {
      src: '/images/am-official/am-ch10-surse.jpg',
      objectPosition: '50% 45%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla/2026-redesign/valhalla-technology-banner-desktop.jpg',
    },
    notes: [
      {
        text: 'SAE Technical Paper 2020-36-0079 — Integrated Design and Control of Active Aerodynamic Features for High Performance Electric Vehicles.',
      },
      {
        text: 'On Torque Vectoring Control: Review and Comparison of State-of-the-Art Approaches (PDF: On_Torque_Vectoring_Control_Review_and_Comparison_.pdf) — pointer; fără claims inventate aici.',
      },
      {
        text: 'Aston_Martin_Valhalla_Active_Aero.pptx — firul prezentării (14 DOF, DRS/Aerobrake/MaxP, −2.55 s Nürburgring, PI-ROM, Kamm/FL).',
      },
      {
        text: 'Subramanian — active aero ROM preprint (subramanian_activeaeroROM_preprint.pdf), as cited for PI-ROM.',
      },
      {
        text: 'Gao — as cited earlier in the presentation sources (pointer only).',
      },
    ],
  },
] as const

export const HERO_IMAGE = {
  src: '/images/am-official/am-hero.jpg',
  objectPosition: '55% 45%',
  sourceUrl:
    'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/valhalla-white-16x9-web.mp4 (frame @ 2s) — official hero video still',
} as const
