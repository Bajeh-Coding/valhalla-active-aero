/**
 * Hybrid AM science narrative — locked chapter order 0–7.
 * Science numbers: docs/science-facts.md (S1/S2) only.
 * Chapter 5: AM public product facts — labeled industrial, never mixed into SAE claims.
 * Omitted (absent from S1 PDF / science-facts): PI-ROM, IPOPT/NLP, LQR as aero controller.
 * S2 LQR+YI appears only as related TV literature (S2-F031).
 */
import type { ValhallaAssetKey } from './assets'
import { LAP_TIME, TABLE3_FORCES } from '@/data/vehicleConstants'

export type ChapterKind =
  | 'title'
  | 'takeaways'
  | 'intro'
  | 'mechatronics'
  | 'simulation'
  | 'results'
  | 'industrial'
  | 'graphs'
  | 'recap'

export type ChapterWidget =
  | 'none'
  | 'cop-cog'
  | 'actuators'
  | 'control'
  | 'cosim'
  | 'results-bars'
  | 'industrial-facts'
  | 'graphs'
  | 'references'

export interface Chapter {
  id: string
  /** Locked chapter index 0–7 (title+takeaways share 0). */
  chapter: number
  kind: ChapterKind
  rail: string
  brand?: string
  eyebrow?: string
  headline: string
  line: string
  /** Optional large cited figure. */
  figure?: {
    value: string
    unit?: string
    caption: string
    citation: string
  }
  takeaways?: readonly string[]
  bars?: readonly {
    label: string
    seconds: number
    highlight?: boolean
  }[]
  industrialFacts?: readonly {
    label: string
    value: string
    source: string
  }[]
  references?: readonly {
    id: string
    text: string
  }[]
  /** Still for this beat (also drives scrub nearest frame). */
  photo: ValhallaAssetKey
  tone?: 'photo' | 'void'
  widget?: ChapterWidget
  /** Banner for chapter 5 firewall. */
  industrialBanner?: string
}

/** Three takeaways — S1 only (S1-F062, S1-F061/042, S1-F030 stack). */
export const THREE_TAKEAWAYS = [
  'Lap-time: MaxP pe GRIP bate Passive–Original cu −3.114 s (108.137 vs 111.251 s).',
  'Stabilitate: Aerobrake mută CoP spre spate; pe Parabolica 29.860 → 29.791 s.',
  'Control stack: state machine DRS → Aerobrake → MaxP pe splitter binar + aripă AOA 0°…25°.',
] as const

export const CHAPTERS: readonly Chapter[] = [
  {
    id: 'title',
    chapter: 0,
    kind: 'title',
    rail: 'Titlu',
    brand: 'Aston Martin\nValhalla',
    eyebrow: 'SAE 2020-36-0079 · Politecnico di Torino',
    headline: 'Aerodinamică activă\nintegrată',
    line: 'Design și control al suprafețelor aero pentru vehicule electrice de înaltă performanță — Ferraris et al.',
    photo: 'hero',
    tone: 'photo',
    widget: 'none',
  },
  {
    id: 'takeaways',
    chapter: 0,
    kind: 'takeaways',
    rail: 'Takeaways',
    eyebrow: 'Capitolul 0 · Contribuție',
    headline: 'Trei idei din S1.',
    line: 'Lap-time · stabilitate la frânare · control stack — doar claim-uri din science-facts.',
    takeaways: THREE_TAKEAWAYS,
    photo: 'showroom',
    tone: 'void',
    widget: 'none',
  },
  {
    id: 'intro-active',
    chapter: 1,
    kind: 'intro',
    rail: 'Intro',
    eyebrow: 'Capitolul 1 · Context',
    headline: 'Activ versus pasiv.',
    line: 'Aero pasiv fixează un compromis; aero activă comută drag și downforce pe stări — cel puțin două suprafețe pentru drag, downforce și balance.',
    figure: {
      value: '≈ 0.5',
      unit: '',
      caption: 'Țintă balance aero = front DF / total DF',
      citation: 'S1-F012',
    },
    photo: 'prototype',
    tone: 'photo',
    widget: 'none',
  },
  {
    id: 'intro-forces',
    chapter: 1,
    kind: 'intro',
    rail: 'Forțe',
    eyebrow: 'Capitolul 1 · Compromis drag–downforce',
    headline: 'Forțe CFD, nu C_L inventat.',
    line: 'S1 publică forțe din lookup CFD @ 160 km/h — nu ecuația ½ρV² C_L A. Original vs New Aero Pack:',
    figure: {
      value: `${TABLE3_FORCES.original.rearDownforceN} → ${TABLE3_FORCES.newPack.rearDownforceN}`,
      unit: 'N',
      caption: 'Downforce spate @ 160 km/h — Original → New pack',
      citation: 'S1-F011',
    },
    photo: 'side',
    tone: 'photo',
    widget: 'none',
  },
  {
    id: 'intro-cop',
    chapter: 1,
    kind: 'intro',
    rail: 'CoP–CoG',
    eyebrow: 'Capitolul 1 · Aero-balance',
    headline: 'CoP versus CoG.',
    line: 'Centre of Pressure mută distribuția downforce față de Centre of Gravity — pe frânare, CoP spre spate crește stabilitatea.',
    figure: {
      value: '378',
      unit: 'mm',
      caption: 'Înălțime CoG (Table 1) — referință geometrică S1, nu Valhalla',
      citation: 'S1-F002',
    },
    photo: 'front',
    tone: 'void',
    widget: 'cop-cog',
  },
  {
    id: 'mecha-actuators',
    chapter: 2,
    kind: 'mechatronics',
    rail: 'Actuatoare',
    eyebrow: 'Capitolul 2 · Mecatronică',
    headline: 'Splitter binar · aripă activă.',
    line: 'Splitter: closed (high-DF) / open (duct underbody → less drag & DF). Aripă: AOA continuu 0°…25°; Standard = 6°.',
    figure: {
      value: '0°…25°',
      unit: '',
      caption: 'Interval AOA aripă activă; Standard = 6°',
      citation: 'S1-F020 · S1-F021',
    },
    photo: 'front',
    tone: 'photo',
    widget: 'actuators',
  },
  {
    id: 'mecha-control',
    chapter: 2,
    kind: 'mechatronics',
    rail: 'Control',
    eyebrow: 'Capitolul 2 · State machine',
    headline: 'DRS · Aerobrake · MaxP',
    line: 'High-level = state machine pe inputuri vehicul → stări suprafețe; execuție MATLAB/Simulink cu forțe externe + delay.',
    photo: 'rear',
    tone: 'void',
    widget: 'control',
  },
  {
    id: 'sim-cosim',
    chapter: 3,
    kind: 'simulation',
    rail: 'Simulare',
    eyebrow: 'Capitolul 3 · Co-simulare',
    headline: 'MATLAB/Simulink + VI-CarRealTime.',
    line: 'Model 14 DOF (6 chassis + 4 suspension + 4 wheel slip); forțe aero din lookup tables; co-simulare numerică S1.',
    figure: {
      value: '14',
      unit: 'DOF',
      caption: 'Baseline VI-CarRealTime — 5 rigid parts',
      citation: 'S1-F001',
    },
    photo: 'prototype',
    tone: 'void',
    widget: 'cosim',
  },
  {
    id: 'sim-dil',
    chapter: 3,
    kind: 'simulation',
    rail: 'DIL',
    eyebrow: 'Capitolul 3 · Validare',
    headline: 'Simulator DIL.',
    line: 'Validare pe VI-Grade static simulator (Udine); track = Nürburgring GP — nu GRIP-Track. Human amplifică câștigul față de virtual.',
    figure: {
      value: '−5.76',
      unit: 's',
      caption: 'DIL Active–MaxP vs Passive–Original (Table 6)',
      citation: 'S1-F070 · S1-F073',
    },
    photo: 'hero',
    tone: 'photo',
    widget: 'none',
  },
  {
    id: 'results-grip',
    chapter: 4,
    kind: 'results',
    rail: 'Rezultate',
    eyebrow: 'Capitolul 4 · GRIP Track',
    headline: 'Lap-time virtual.',
    line: 'DRS singur ≈ egal cu passive-new; Aerobrake e pasul decisiv; MaxP închide delta-ul.',
    figure: {
      value: String(LAP_TIME.gripMaxPVsPassiveOriginalDeltaS),
      unit: 's',
      caption: 'MaxP față de Passive–Original (GRIP, virtual)',
      citation: 'S1-F060 · S1-F062',
    },
    bars: [
      { label: 'Passive–Original', seconds: LAP_TIME.gripPassiveOriginalS },
      { label: 'Passive–New', seconds: LAP_TIME.gripPassiveNewS },
      { label: 'DRS', seconds: LAP_TIME.gripDrsS },
      { label: 'DRS+Aerobrake', seconds: LAP_TIME.gripDrsAerobrakeS },
      { label: 'MaxP', seconds: LAP_TIME.gripMaxPS, highlight: true },
    ],
    photo: 'showroom',
    tone: 'void',
    widget: 'results-bars',
  },
  {
    id: 'results-stability',
    chapter: 4,
    kind: 'results',
    rail: 'Stabilitate',
    eyebrow: 'Capitolul 4 · Frânare & viraj',
    headline: 'Stabilitate pe frânare.',
    line: 'New pack mai stabil la frânare / schimbări rapide; pe Standard fără TV, lap-ul se înrăutățește — balance aero trebuie aliniat cu balance mecanic.',
    figure: {
      value: '−1.827',
      unit: 's',
      caption: 'Torque Vectoring: Original → New aero pack (Table 4)',
      citation: 'S1-F080 · S1-F081',
    },
    photo: 'side',
    tone: 'photo',
    widget: 'none',
  },
  {
    id: 'results-synthesis',
    chapter: 4,
    kind: 'results',
    rail: 'Sinteză',
    eyebrow: 'Capitolul 4 · Concluzii S1',
    headline: 'Balance dinamic, nu „perfect”.',
    line: 'Un pack „echilibrat” pe un vehicul mecanic dezechilibrat poate pierde timp. Controlul trebuie să ajusteze balance-ul dinamic — outlook: TV + suspensii active pe track real.',
    photo: 'rear',
    tone: 'photo',
    widget: 'none',
  },
  {
    id: 'valhalla-aero',
    chapter: 5,
    kind: 'industrial',
    rail: 'Valhalla',
    eyebrow: 'Capitolul 5 · Aplicație industrială',
    headline: 'Active Aero pe Valhalla.',
    line: 'Referință de produs Aston Martin — nu un rezultat al paper-ului SAE. Separat clar de capitolele 1–4.',
    industrialBanner:
      'Sursă industrială / publică AM — nu rezultat SAE 2020-36-0079',
    industrialFacts: [
      {
        label: 'Front wing',
        value: 'Twin-element ascuns în spatele grilei; parte din aero activ',
        source: 'AM Valhalla · brochure 2025',
      },
      {
        label: 'Rear T-wing',
        value: 'Dual-element; +255 mm pe hydraulic rams în Race mode',
        source: 'AM Valhalla page',
      },
      {
        label: 'Airbrake',
        value: 'Deploy < 0.5 s la frânare grea (Race)',
        source: 'AM Valhalla page',
      },
      {
        label: 'Downforce',
        value: '> 600 kg @ 150 mph (Race mode)',
        source: 'AM Valhalla · brochure 2025',
      },
      {
        label: 'Underbody',
        value: 'Venturi / diffuser + active air-dam pe vanes',
        source: 'AM brochure 2025',
      },
      {
        label: 'EDU / TV față',
        value: 'Două E-motors pe axa față — torque vectoring (context brand)',
        source: 'AM news · brochure 2025',
      },
    ],
    photo: 'hero',
    tone: 'photo',
    widget: 'industrial-facts',
  },
  {
    id: 'graphs',
    chapter: 6,
    kind: 'graphs',
    rail: 'Grafice',
    eyebrow: 'Capitolul 6 · Model S1',
    headline: 'Re-plot din date paper.',
    line: 'Serii discrete din Table 3 / 5 / MaxP schedule — fără curbe inventate. Scrub pe stare sau pe viteză.',
    photo: 'prototype',
    tone: 'void',
    widget: 'graphs',
  },
  {
    id: 'recap',
    chapter: 7,
    kind: 'recap',
    rail: 'Recap',
    eyebrow: 'Capitolul 7 · Închidere',
    headline: 'Cele trei idei.',
    line: 'Știință S1/S2 · Valhalla = demonstrație industrială separată. Sursele de mai jos.',
    takeaways: THREE_TAKEAWAYS,
    references: [
      {
        id: 'S1',
        text: 'Ferraris et al. — Integrated Design and Control of Active Aerodynamic Features for High Performance Electric Vehicles. SAE 2020-36-0079. Politecnico di Torino.',
      },
      {
        id: 'S2',
        text: 'Asperti, Vignati, Sabbioni — On Torque Vectoring Control: Review and Comparison of State-of-the-Art Approaches. Machines 2024, 12, 160. DOI 10.3390/machines12030160.',
      },
      {
        id: 'AM',
        text: 'Aston Martin Valhalla — model page, brochure 2025, official news (active aero / EDU). Sursă industrială, nu rezultat SAE.',
      },
    ],
    photo: 'showroom',
    tone: 'void',
    widget: 'references',
  },
] as const
