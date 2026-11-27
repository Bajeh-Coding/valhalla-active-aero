/**
 * Congress oral+visual narrative — AIAA/SAE forum arc.
 * One idea per beat. Numbers only from docs/science-facts.md (S1/S2).
 * Valhalla = brand demonstration overlay; science vehicle = S1 EV model.
 */
import type { ValhallaAssetKey } from './assets'
import { LAP_TIME, TABLE3_FORCES } from '@/data/vehicleConstants'

export type BeatKind =
  | 'title'
  | 'problem'
  | 'takeaways'
  | 'sota'
  | 'method'
  | 'control'
  | 'results'
  | 'implications'
  | 'recap'

export interface Beat {
  id: string
  kind: BeatKind
  /** Short rail label (RO). */
  rail: string
  brand?: string
  eyebrow?: string
  headline: string
  /** Single supporting sentence — not a script. */
  line: string
  /** Optional large cited figure. */
  figure?: {
    value: string
    unit?: string
    caption: string
    citation: string
  }
  /** Takeaways list (only on takeaways / recap). */
  takeaways?: readonly string[]
  /** Simplified result rows (not dense table). */
  bars?: readonly {
    label: string
    seconds: number
    highlight?: boolean
  }[]
  references?: readonly {
    id: string
    text: string
  }[]
  photo: ValhallaAssetKey
  /** Darker grade for figure-led beats. */
  tone?: 'photo' | 'void'
  interactive?: boolean
}

/** Three locked takeaways — stated early, recapped at end. */
export const THREE_TAKEAWAYS = [
  'Același pack aero poate înrăutăți turul pe un vehicul dezechilibrat — balance-ul trebuie aliniat cu TV/DYC.',
  'Pe GRIP, MaxP (108.137 s) bate Passive–Original (111.251 s); Aerobrake e pasul decisiv pe lap.',
  'Aero activă completează torque vectoring: redistribuie Fz aero; TV rămâne limitat de friction circle.',
] as const

export const BEATS: readonly Beat[] = [
  {
    id: 'title',
    kind: 'title',
    rail: 'Titlu',
    brand: 'Aston Martin\nValhalla',
    headline: 'Aerodinamică activă\nla limita anvelopei',
    line: 'Prezentare științifică pe controlul suprafețelor aero pentru vehicule de înaltă performanță.',
    photo: 'hero',
    tone: 'photo',
  },
  {
    id: 'problem',
    kind: 'problem',
    rail: 'Problemă',
    eyebrow: 'Motivație',
    headline: 'Anvelopa satură.',
    line: 'Cuplul pe roată nu poate inventa aderență: forțele Fx–Fy sunt limitate de Fz și de friction circle.',
    figure: {
      value: '< 4',
      unit: 'm/s²',
      caption: 'Regiune liniară tipică a yaw-rate de referință (single-track)',
      citation: 'S2-F010',
    },
    photo: 'prototype',
    tone: 'photo',
  },
  {
    id: 'takeaways',
    kind: 'takeaways',
    rail: '3 idei',
    eyebrow: 'Contribuție',
    headline: 'Trei concluzii.',
    line: 'Le veți auzi din nou la final — tot ce urmează le susține.',
    takeaways: THREE_TAKEAWAYS,
    photo: 'showroom',
    tone: 'void',
  },
  {
    id: 'sota',
    kind: 'sota',
    rail: 'SotA',
    eyebrow: 'Context',
    headline: 'TV/DYC și aero pasiv.',
    line: 'Torque vectoring redistribuie cuplul; un pack aero „echilibrat” fără aliniere mecanică poate pierde timp pe tur.',
    figure: {
      value: '+1.007',
      unit: 's',
      caption: 'Standard: Original → New aero pack pe GRIP (înrăutățire)',
      citation: 'S1-F081',
    },
    photo: 'side',
    tone: 'photo',
  },
  {
    id: 'method-vehicle',
    kind: 'method',
    rail: 'Metodă',
    eyebrow: 'Abordare',
    headline: 'Splitter + aripă activă.',
    line: 'Două suprafețe: splitter binar (open/closed) și aripă cu AOA continuu 0°…25°; țintă balance ≈ 0.5.',
    figure: {
      value: String(TABLE3_FORCES.newPack.rearDownforceN),
      unit: 'N',
      caption: 'Downforce spate @ 160 km/h — New Aero Pack (CFD)',
      citation: 'S1-F011',
    },
    photo: 'front',
    tone: 'photo',
  },
  {
    id: 'method-control',
    kind: 'control',
    rail: 'Control',
    eyebrow: 'State machine',
    headline: 'DRS · Aerobrake · MaxP',
    line: 'Trei strategii pe aceleași actuatoare — singura suprafață interactivă a prezentării.',
    photo: 'rear',
    tone: 'void',
    interactive: true,
  },
  {
    id: 'results-grip',
    kind: 'results',
    rail: 'Rezultate',
    eyebrow: 'GRIP Track',
    headline: 'MaxP pe tur virtual.',
    line: 'DRS singur ≈ egal cu passive-new; Aerobrake + MaxP deschid delta-ul.',
    figure: {
      value: String(LAP_TIME.gripMaxPVsPassiveOriginalDeltaS),
      unit: 's',
      caption: 'MaxP față de Passive–Original (GRIP, virtual driver)',
      citation: 'S1-F062',
    },
    bars: [
      { label: 'Passive–Original', seconds: LAP_TIME.gripPassiveOriginalS },
      { label: 'Passive–New', seconds: LAP_TIME.gripPassiveNewS },
      { label: 'DRS', seconds: LAP_TIME.gripDrsS },
      { label: 'DRS+Aerobrake', seconds: LAP_TIME.gripDrsAerobrakeS },
      {
        label: 'MaxP',
        seconds: LAP_TIME.gripMaxPS,
        highlight: true,
      },
    ],
    photo: 'showroom',
    tone: 'void',
  },
  {
    id: 'results-dil',
    kind: 'results',
    rail: 'Validare',
    eyebrow: 'DIL · Nürburgring GP',
    headline: 'Omul amplifică câștigul.',
    line: 'Pe simulator DIL, Active–MaxP vs Passive–Original: −5.76 s — mai pronunțat decât la virtual driver.',
    figure: {
      value: String(LAP_TIME.dilMaxPVsPassiveOriginalDeltaS),
      unit: 's',
      caption: 'DIL Active–MaxP vs Passive–Original (Table 6)',
      citation: 'S1-F073',
    },
    photo: 'hero',
    tone: 'photo',
  },
  {
    id: 'implications',
    kind: 'implications',
    rail: 'Implicații',
    eyebrow: 'Sistem · limitări',
    headline: 'TV + aero, împreună.',
    line: 'Aero activă crește și redistribuie Fz; DYC rămâne vulnerabil la saturare și incertitudini de model.',
    photo: 'side',
    tone: 'photo',
  },
  {
    id: 'recap',
    kind: 'recap',
    rail: 'Recap',
    eyebrow: 'Închidere',
    headline: 'Cele trei idei.',
    line: 'Detaliile — în paper. Sursele de mai jos.',
    takeaways: THREE_TAKEAWAYS,
    references: [
      {
        id: 'S1',
        text: 'Ferraris et al. — Integrated Design and Control of Active Aerodynamic Features for High Performance Electric Vehicles. SAE 2020-36-0079.',
      },
      {
        id: 'S2',
        text: 'Asperti, Vignati, Sabbioni — On Torque Vectoring Control: Review and Comparison of State-of-the-Art Approaches. Machines 2024, 12, 160.',
      },
    ],
    photo: 'prototype',
    tone: 'void',
  },
] as const
