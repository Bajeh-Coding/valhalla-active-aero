/**
 * Hybrid AM chapters 0–7 — content from chapter packs only.
 * RO UI; EN technical terms preserved.
 */
import type { ValhallaAssetKey } from '../assets'
import type { ChartSpec } from './charts'
import {
  AM_DOWNFORCE,
  AM_RESPONSE,
  AM_WING_STATES,
  DRS_SCHEDULE,
  MAXP_SCHEDULE,
  MODE_SETPOINTS,
  PARABOLICA_TIMES,
  TABLE2_PARABOLICA,
  TABLE3_AXLE,
  TABLE3_BALANCE,
  TABLE3_FORCES,
  TABLE4_BALANCE,
  TABLE5_GRIP,
  TABLE6_DELTA,
  TABLE6_DIL,
  ZERO_TO_300,
} from './charts'

export type BeatVisual =
  | 'hero'
  | 'chart'
  | 'diagram'
  | 'data-plate'
  | 'interactive'
  | 'gallery'
  | 'firewall'

export interface HybridBeat {
  id: string
  chapter: number
  rail: string
  eyebrow?: string
  headline: string
  sub: string
  visual: BeatVisual
  photo?: ValhallaAssetKey
  /** Darker overlay for chart-primary beats. */
  tone?: 'photo' | 'void' | 'lab'
  chart?: ChartSpec
  /** Secondary chart (gallery / dual). */
  chartB?: ChartSpec
  equations?: string[]
  callouts?: string[]
  figure?: { value: string; unit?: string; caption: string; citation: string }
  takeaways?: string[]
  metrics?: Array<{ label: string; value: string; fact?: string }>
  interactive?: 'control' | 'scrub-drs' | 'scrub-maxp' | 'toggle-grip'
  industrial?: boolean
  references?: Array<{ id: string; text: string }>
}

export const CHAPTER_RAIL = [
  { chapter: 0, label: 'Titlu' },
  { chapter: 1, label: 'Intro' },
  { chapter: 2, label: 'Mecatronică' },
  { chapter: 3, label: 'Simulare' },
  { chapter: 4, label: 'Rezultate' },
  { chapter: 5, label: 'Valhalla' },
  { chapter: 6, label: 'Grafice' },
  { chapter: 7, label: 'Recap' },
] as const

export const THREE_TAKEAWAYS = [
  'Pe GRIP, MaxP taie −3.114 s față de Passive–Original; Aerobrake e pasul dominant pe lap.',
  'Balance aero ≈ 0.5 nu e universal optimal — pe Standard New pack pierde (+1.007 s); pe TV câștigă (−1.827 s).',
  'Controlul S1 = state machine (DRS / Aerobrake / MaxP) pe splitter binar + aripă AOA — nu LQR/PI-ROM.',
] as const

export const BEATS: readonly HybridBeat[] = [
  // ─── Chapter 0: Title ───
  {
    id: 'title',
    chapter: 0,
    rail: 'Titlu',
    eyebrow: 'SAE 2020-36-0079 · Hybrid AM',
    headline: 'Aerodinamică activă\nla limita anvelopei',
    sub: 'Prezentare congres — forțe, stări și lap-time din paper, pe limbajul vizual Aston Martin Valhalla.',
    visual: 'hero',
    photo: 'hero',
    tone: 'photo',
    figure: {
      value: '−3.114',
      unit: 's',
      caption: 'MaxP vs Passive–Original pe GRIP (virtual)',
      citation: 'S1-F062 · Table 5',
    },
  },
  {
    id: 'takeaways',
    chapter: 0,
    rail: '3 idei',
    eyebrow: 'Takeaways S1',
    headline: 'Trei idei de dus acasă.',
    sub: 'Le veți revedea pe grafice — tot ce urmează le susține cu date din paper.',
    visual: 'data-plate',
    photo: 'showroom',
    tone: 'void',
    takeaways: [...THREE_TAKEAWAYS],
  },

  // ─── Chapter 1: Intro ───
  {
    id: 'active-vs-passive',
    chapter: 1,
    rail: 'Intro',
    eyebrow: 'Cap. 1 · Activ vs pasiv',
    headline: 'Activ vs pasiv',
    sub: 'Aero pasivă fixează forțele pe formă. Aero activă modulează suprafețele ca să controleze drag, downforce și aerodynamic balance pe tur.',
    visual: 'hero',
    photo: 'side',
    tone: 'photo',
    callouts: [
      'S1: control forțe aero prin suprafețe active, co-simulare MATLAB/Simulink + VI-CarRealTime (S1-F000).',
      'Tranziente aero neglijate până la ~2 Hz — AOA quasi-static (S1-F004).',
    ],
  },
  {
    id: 'cl-cd-compromise',
    chapter: 1,
    rail: 'Forțe',
    eyebrow: 'Cap. 1 · Compromis drag–downforce',
    headline: 'Compromisul drag–downforce',
    sub: 'Ținta: balance ≈ 0.5 și mai mult downforce, fără a înrăutăți aerodynamic efficiency. Table 3: Drag 752→788 N @ 160 km/h.',
    visual: 'chart',
    photo: 'front',
    tone: 'lab',
    chart: TABLE3_FORCES,
    equations: [
      'C_L / C_D = limbaj de inginer — S1 nu publică coeficienți numerici (S1-F022).',
      'Pe ecran: forțele Table 3, nu ½ ρ V² inventat.',
    ],
    callouts: [
      'New Aero Pack: splitter modificat + rear wing, ambele active (S1-F012).',
    ],
  },
  {
    id: 'cop-vs-cog',
    chapter: 1,
    rail: 'CoP–CoG',
    eyebrow: 'Cap. 1 · Aero-balance',
    headline: 'CoP vs CoG',
    sub: 'Aerodynamic balance = front downforce / total downforce. CoP față de CoG decide stabilitatea la frânare și viraj.',
    visual: 'diagram',
    photo: 'prototype',
    tone: 'void',
    chart: TABLE3_AXLE,
    equations: [
      'balance = F_front / (F_front + F_rear)  ·  S1-F013',
      'New @ 160 km/h: 470/(470+467) ≈ 0.502 ≈ ținta 0.5',
      'CoG: 1369 mm de axa față · wheelbase 2691 mm · h = 378 mm (Table 1)',
    ],
  },
  {
    id: 'passive-balance-trap',
    chapter: 1,
    rail: 'Balance ≠ lap',
    eyebrow: 'Cap. 1 · Punchline',
    headline: 'Balance aero ≠ lap-time',
    sub: 'Pe Standard 4WD, New Aero Pack e mai stabil la frânare, dar ~3 km/h mai lent în corner — lap 111.251→112.258 s.',
    visual: 'chart',
    photo: 'rear',
    tone: 'lab',
    chart: TABLE4_BALANCE,
    callouts: [
      'Balance „perfect” pe vehicul dezechilibrat mecanic cere control activ dinamic (S1-F090).',
    ],
  },

  // ─── Chapter 2: Mechatronics ───
  {
    id: 'ch02-actuators',
    chapter: 2,
    rail: 'Actuatoare',
    eyebrow: 'Cap. 2 · Hardware',
    headline: 'Două suprafețe active',
    sub: 'Splitterul e binar (closed / open). Aripa are AOA continuu 0°…25°; setup Standard = 6°.',
    visual: 'chart',
    photo: 'front',
    tone: 'lab',
    chart: TABLE3_FORCES,
    equations: [
      'AOA ∈ [0°, 25°]; AOA_Standard = 6°  ·  S1-F021',
      'splitter ∈ {CLOSED (high-DF), OPEN (low-drag duct)}  ·  S1-F020',
    ],
  },
  {
    id: 'ch02-state-machine',
    chapter: 2,
    rail: 'State machine',
    eyebrow: 'Cap. 2 · Control',
    headline: 'Control high-level = state machine',
    sub: 'Inputuri vehicul (viteză, throttle, frână, ay) → stări predefinite pe splitter + aripă. Nu LQR. Nu PI-ROM.',
    visual: 'diagram',
    photo: 'side',
    tone: 'void',
    interactive: 'control',
    equations: [
      'modes = {DRS, DRS+Aerobrake, MaxP}  ·  S1-F031',
      'vehicle inputs ↦ pre-defined aero surface states  ·  S1-F030',
    ],
    callouts: [
      'Abstract menționează fuzzy logic; corpul implementează state machine — cităm corpul.',
      'LQR / PI-ROM omitted: absente din S1 ca aero controller.',
    ],
  },
  {
    id: 'ch02-drs',
    chapter: 2,
    rail: 'DRS',
    eyebrow: 'Cap. 2 · DRS',
    headline: 'DRS — drag minim pe dreaptă',
    sub: 'Splitter OPEN + AOA = 0°. Aripa rampă liniar 6°→0° pe 70–120 km/h; splitter high-DF→low-drag la 110 km/h.',
    visual: 'interactive',
    photo: 'rear',
    tone: 'lab',
    chart: DRS_SCHEDULE,
    interactive: 'scrub-drs',
    equations: [
      'AOA_DRS = 0° ∧ splitter = OPEN  ·  S1-F032',
      'activate: throttle ≥ 70%; deactivate if |ay| > 1 g  ·  S1-F033',
    ],
  },
  {
    id: 'ch02-aerobrake',
    chapter: 2,
    rail: 'Aerobrake',
    eyebrow: 'Cap. 2 · Aerobrake',
    headline: 'Aerobrake — downforce la frânare',
    sub: 'Splitter CLOSED. Aripa la AOA = 19° (nu 25°). Trigger: v ≥ 70 km/h, brake ≥ 40%, |ay| ≤ 1 g.',
    visual: 'chart',
    photo: 'prototype',
    tone: 'lab',
    chart: MODE_SETPOINTS,
    equations: [
      'AOA_Aerobrake = 19°; splitter = CLOSED  ·  S1-F040',
      'v ≥ 70 km/h ∧ brake ≥ 40%; |ay| ≤ 1 g  ·  S1-F041',
    ],
    figure: {
      value: '19',
      unit: '°',
      caption: 'AOA Aerobrake — nu plafonul 25°',
      citation: 'S1-F040',
    },
  },
  {
    id: 'ch02-maxp',
    chapter: 2,
    rail: 'MaxP',
    eyebrow: 'Cap. 2 · MaxP',
    headline: 'MaxP — schedule empiric pe viteză',
    sub: 'Când DRS și Aerobrake sunt off, AOA = 0° / 3° / 4.5° pe benzi. Baseline 6° nu e best în range.',
    visual: 'interactive',
    photo: 'showroom',
    tone: 'lab',
    chart: MAXP_SCHEDULE,
    interactive: 'scrub-maxp',
    equations: [
      'MaxP active iff ¬DRS ∧ ¬Aerobrake; AOA = f_emp(V)  ·  S1-F050',
      'V∈[100,180]→0°; [180,250]→3°; (250,300]→4.5°  ·  S1-F051',
    ],
  },

  // ─── Chapter 3: Simulation ───
  {
    id: 'cosim-stack',
    chapter: 3,
    rail: 'Co-sim',
    eyebrow: 'Cap. 3 · Stack',
    headline: 'Co-simulare MATLAB/Simulink ↔ VI-CarRealTime',
    sub: 'S1 proiectează și simulează controlul aero activ prin co-simulare. MaxPerformance pe traiectorie iterativă — nu NLP/IPOPT.',
    visual: 'diagram',
    photo: 'prototype',
    tone: 'void',
    callouts: [
      'NLP / IPOPT omitted: absente din S1 PDF și science-facts.',
      'Fuzzy: menționat în Abstract, fără reguli publicate — omit ecuații.',
    ],
    metrics: [
      { label: 'Control', value: 'MATLAB/Simulink', fact: 'S1-F000' },
      { label: 'Plantă', value: 'VI-CarRealTime', fact: 'S1-F000' },
      { label: 'Solver lap', value: 'MaxPerformance', fact: 'S1-F001' },
      { label: 'DOF', value: '14 (→20)', fact: 'S1-F001' },
    ],
  },
  {
    id: 'vehicle-model-14dof',
    chapter: 3,
    rail: '14 DOF',
    eyebrow: 'Cap. 3 · Plantă',
    headline: 'Plantă VI-CarRealTime — 14 DOF',
    sub: '5 rigid parts: 6 chassis + 4 suspension stroke + 4 wheel slip. Aero = lookup tables (inclusiv ride height).',
    visual: 'data-plate',
    photo: 'side',
    tone: 'void',
    metrics: [
      { label: 'Sprung', value: '2050 kg', fact: 'S1-F002' },
      { label: 'Unsprung', value: '190 kg', fact: 'S1-F002' },
      { label: 'Power*', value: '1257 kW', fact: 'S1-F002' },
      { label: 'Wheelbase', value: '2691 mm', fact: 'S1-F002' },
      { label: 'Frontal area', value: '2.1 m²', fact: 'S1-F002' },
      { label: 'Actuation', value: '≲ 2 Hz', fact: 'S1-F004' },
    ],
  },
  {
    id: 'dil-nurburgring',
    chapter: 3,
    rail: 'DIL',
    eyebrow: 'Cap. 3 · Validare',
    headline: 'Validare DIL — VI-Grade Udine',
    sub: 'Track = Nürburgring GP (post-2000). Trei configurații: Passive–Original, Passive–New, Active–MaxP.',
    visual: 'chart',
    photo: 'hero',
    tone: 'lab',
    chart: TABLE6_DIL,
    chartB: TABLE6_DELTA,
    figure: {
      value: '−5.76',
      unit: 's',
      caption: 'DIL Active–MaxP vs Passive–Original',
      citation: 'S1-F073',
    },
  },

  // ─── Chapter 4: Results ───
  {
    id: 'lap-grip-algorithms',
    chapter: 4,
    rail: 'GRIP',
    eyebrow: 'Cap. 4 · Lap-time',
    headline: 'MaxP taie −3.114 s pe GRIP',
    sub: 'Aerobrake e pasul dominant; MaxP aduce încă ~0.3 s. DRS singur ≈ Passive–New.',
    visual: 'chart',
    photo: 'showroom',
    tone: 'lab',
    chart: TABLE5_GRIP,
    figure: {
      value: '−3.114',
      unit: 's',
      caption: 'MaxP 108.137 − Passive–Original 111.251',
      citation: 'S1-F062 · Table 5',
    },
  },
  {
    id: 'balance-tv-table4',
    chapter: 4,
    rail: 'TV/balance',
    eyebrow: 'Cap. 4 · Coupling',
    headline: 'Aero „perfect” ≠ lap fără TV',
    sub: 'Același New pack: Standard +1.007 s · RWD −5.930 s · Torque Vectoring −1.827 s.',
    visual: 'chart',
    photo: 'side',
    tone: 'lab',
    chart: TABLE4_BALANCE,
  },
  {
    id: 'brake-corner-stability',
    chapter: 4,
    rail: 'Stabilitate',
    eyebrow: 'Cap. 4 · Parabolica',
    headline: 'Aerobrake + MaxP pe frânare și viraj',
    sub: 'Aerobrake mută CoP spre spate; MaxP adaugă precizie de traiectorie (+33 ms).',
    visual: 'chart',
    photo: 'rear',
    tone: 'lab',
    chart: PARABOLICA_TIMES,
    callouts: [
      'DIL subiectiv: Original instabil la frânare; MaxP — directionality (S1 p.7–8).',
    ],
  },
  {
    id: 'dil-results',
    chapter: 4,
    rail: 'DIL Δ',
    eyebrow: 'Cap. 4 · DIL',
    headline: 'DIL: −5.76 s pe Nürburgring GP',
    sub: 'Human câștigă mai mult decât virtual pe aceleași pași aero; human rămâne mai lent absolut.',
    visual: 'chart',
    photo: 'hero',
    tone: 'lab',
    chart: TABLE6_DIL,
  },
  {
    id: 'synthesis',
    chapter: 4,
    rail: 'Sinteză',
    eyebrow: 'Cap. 4 · Concluzie S1',
    headline: 'Control dinamic al balance-ului',
    sub: 'Pack nou + state machine reduc lap-time; balance static 0.5 nu e optimal pe vehicul dezechilibrat — controlul ajustează CoP pe stări.',
    visual: 'data-plate',
    photo: 'prototype',
    tone: 'void',
    metrics: [
      { label: 'GRIP MaxP vs Orig.', value: '−3.114 s', fact: 'S1-F062' },
      { label: 'DIL MaxP vs Orig.', value: '−5.76 s', fact: 'S1-F073' },
      { label: 'TV New vs Orig.', value: '−1.827 s', fact: 'S1-F081' },
    ],
    callouts: [
      'Future work S1: track test real; integrare TV / active suspensions (S1-F091).',
    ],
  },

  // ─── Chapter 5: Valhalla industrial ───
  {
    id: 'ch05-firewall',
    chapter: 5,
    rail: 'Firewall',
    eyebrow: 'Cap. 5 · Industrial',
    headline: 'Referință industrială, nu rezultat SAE',
    sub: 'Capitolul Valhalla citează doar materiale publice Aston Martin. Nu dovedește Capitolele 1–4.',
    visual: 'firewall',
    photo: 'hero',
    tone: 'photo',
    industrial: true,
  },
  {
    id: 'ch05-front-wing',
    chapter: 5,
    rail: 'Front wing',
    eyebrow: 'Cap. 5 · Aripa față',
    headline: 'Aripa față activă, ascunsă',
    sub: 'Twin-element, în spatele grilei AM. Un mecanism controlează downforce și fluxul spre underfloor vanes. Reacție ≤ 0,5 s.',
    visual: 'data-plate',
    photo: 'front',
    tone: 'photo',
    industrial: true,
    metrics: [
      { label: 'Tip', value: 'twin-element, ascunsă', fact: 'AM-F002' },
      { label: 'Reacție', value: '≤ 0.5 s', fact: 'AM-F004' },
      { label: 'Race', value: 'max downforce + bleed AoA', fact: 'AM-F005' },
    ],
  },
  {
    id: 'ch05-rear-wing',
    chapter: 5,
    rail: 'T-wing',
    eyebrow: 'Cap. 5 · Aripa spate',
    headline: 'T-wing dual-element: +255 mm',
    sub: 'În Race, aripa urcă 255 mm pe rame hidraulice. DRS sau airbrake. Deploy airbrake < 0,5 s.',
    visual: 'chart',
    photo: 'rear',
    tone: 'lab',
    industrial: true,
    chart: AM_WING_STATES,
    chartB: AM_RESPONSE,
  },
  {
    id: 'ch05-underbody-df',
    chapter: 5,
    rail: 'Downforce',
    eyebrow: 'Cap. 5 · Underbody',
    headline: 'Underbody + peste 600 kg la 150 mph',
    sub: 'Flat floor, venturi, difuzor, air-dam activ. În Race: >600 kg @ 150 mph, menținut până la vMax 350 km/h.',
    visual: 'chart',
    photo: 'side',
    tone: 'lab',
    industrial: true,
    chart: AM_DOWNFORCE,
    figure: {
      value: '>600',
      unit: 'kg',
      caption: 'Downforce @ 150 mph (Race) — claim public AM',
      citation: 'AM-F030',
    },
  },
  {
    id: 'ch05-control-context',
    chapter: 5,
    rail: 'IVC',
    eyebrow: 'Cap. 5 · Context brand',
    headline: 'IVC / IVDC + TV față',
    sub: 'Aripele citesc IVC; șasiul are control hidraulic comun. Torque vectoring pe EDU față e context de produs — nu rezultat SAE.',
    visual: 'data-plate',
    photo: 'showroom',
    tone: 'void',
    industrial: true,
    metrics: [
      { label: 'Control', value: 'IVC / IVDC + hidraulic', fact: 'AM-F050' },
      { label: 'Moduri stowed', value: 'EV / Sport / Sport+', fact: 'AM-F060' },
      { label: 'Aripa activă', value: 'Race', fact: 'AM-F061' },
      { label: 'vMax', value: '350 km/h', fact: 'AM-F034' },
    ],
    callouts: [
      'Nu conecta eTV / IVDC la S1 control stack / LQR.',
    ],
  },

  // ─── Chapter 6: Graphs gallery ───
  {
    id: 'g1-table3-forces',
    chapter: 6,
    rail: 'Table 3',
    eyebrow: 'Cap. 6 · Re-plot',
    headline: 'Forțe aero @ 160 km/h',
    sub: 'Original vs New Aero Pack — singurul anchor de forță publicat. Fără extrapolare V².',
    visual: 'gallery',
    photo: 'front',
    tone: 'lab',
    chart: TABLE3_FORCES,
    chartB: TABLE3_BALANCE,
  },
  {
    id: 'g2-schedules',
    chapter: 6,
    rail: 'Schedules',
    eyebrow: 'Cap. 6 · AOA',
    headline: 'Schedule AOA — DRS și MaxP',
    sub: 'Rampă liniară DRS (70–120 km/h) și trepte empirice MaxP. Scrub pe viteză → AOA țintă.',
    visual: 'interactive',
    photo: 'rear',
    tone: 'lab',
    chart: DRS_SCHEDULE,
    chartB: MAXP_SCHEDULE,
    interactive: 'scrub-drs',
  },
  {
    id: 'g3-accel-parabolica',
    chapter: 6,
    rail: 'Manevre',
    eyebrow: 'Cap. 6 · Tailored',
    headline: 'Accelerație 0→300 și Parabolica',
    sub: 'Câștig DRS pe straight; Aerobrake apoi MaxP pe colțul Parabolica.',
    visual: 'gallery',
    photo: 'side',
    tone: 'lab',
    chart: ZERO_TO_300,
    chartB: PARABOLICA_TIMES,
  },
  {
    id: 'g4-grip-balance',
    chapter: 6,
    rail: 'GRIP×TV',
    eyebrow: 'Cap. 6 · Lap',
    headline: 'Lap GRIP — algoritmi și balance',
    sub: 'Table 5: Passive → DRS → Aerobrake → MaxP. Table 4: același pack pe Standard / RWD / TV.',
    visual: 'interactive',
    photo: 'showroom',
    tone: 'lab',
    chart: TABLE5_GRIP,
    chartB: TABLE4_BALANCE,
    interactive: 'toggle-grip',
  },
  {
    id: 'g5-dil-geometry',
    chapter: 6,
    rail: 'DIL + R',
    eyebrow: 'Cap. 6 · Validare',
    headline: 'Validare DIL și geometrie Parabolica',
    sub: 'Table 6 Virtual vs DIL. Table 2 — layout Parabolica (L, R) ca context.',
    visual: 'gallery',
    photo: 'prototype',
    tone: 'lab',
    chart: TABLE6_DIL,
    chartB: TABLE2_PARABOLICA,
  },

  // ─── Chapter 7: Recap ───
  {
    id: 'recap',
    chapter: 7,
    rail: 'Recap',
    eyebrow: 'Închidere',
    headline: 'Cele trei idei.',
    sub: 'Detaliile — în paper. Sursele de mai jos. Capitolul Valhalla rămâne analogie industrială.',
    visual: 'data-plate',
    photo: 'hero',
    tone: 'void',
    takeaways: [...THREE_TAKEAWAYS],
    references: [
      {
        id: 'S1',
        text: 'Ferraris et al. — Integrated Design and Control of Active Aerodynamic Features for High Performance Electric Vehicles. SAE 2020-36-0079.',
      },
      {
        id: 'S2',
        text: 'Asperti, Vignati, Sabbioni — On Torque Vectoring Control: Review and Comparison of State-of-the-Art Approaches. Machines 2024, 12, 160.',
      },
      {
        id: 'AM',
        text: 'Aston Martin Valhalla — model page, Brochure 2025, official aero film (public industrial sources only).',
      },
    ],
  },
]
