/**
 * Canonical presentation chapters — strict map from
 * Informatii_pentru_Prezentare (ghid) → 11 site chapters.
 * Cap 09 = Active Aero Simulator (R3F), between guide slides 8 and 9.
 */

import type { GuideDiagramId } from '../components/GuideDiagrams'

/** Legacy Cap 07 OEM surface block (kept for AeroSurfaces component types). */
export interface MockAeroSurface {
  id: string
  oemName: string
  roleRo: string
  facts?: readonly string[]
  image: { src: string; objectPosition?: string; alt: string }
}

export interface MockChapterNote {
  text: string
  quote?: string
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
  src: string
  caption: string
  alt: string
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
  /** Synthetic bullet points from guide §1. */
  bullets: readonly string[]
  /** Optional equations / HUD lines. */
  equations?: readonly string[]
  image: { src: string; objectPosition?: string; sourceUrl: string }
  figure?: MockChapterFigure
  notes?: readonly MockChapterNote[]
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
    bullets: [
      'Subtitlu: De la simulări multicorp (14 DOF) și optimizare AI (PI-ROM) la modelul de serie PHEV 1,079 PS',
      'Autori & Afiliere: Departamentul de Inginerie Mecanică și Aerospațială (Politecnico di Torino) & Aston Martin Lagonda Ltd.',
      'Pilon: Depășirea limitei de aderență a anvelopelor fără masă inerțială adăugată.',
      'Pilon: Control mecatronic în 3 stări: DRS, Aerobrake și MaxP Aero-Balance.',
      'Pilon: Predicție aerodinamică sub-milisecundă (< 0.1 ms) prin Rețele Neuronale (PI-ROM).',
    ],
    image: {
      src: '/images/am-official/am-ch01-intro.jpg',
      objectPosition: '50% 40%',
      sourceUrl:
        'https://www.astonmartin.com/-/media/models---valhalla-2026-relaunch/exterior-banner.jpg',
    },
    notes: [
      {
        text: '💬 Context (Slide 1): Sistemele de siguranță activă tradiționale (ESP, Torque Vectoring, AFS) acționează prin modularea forțelor de la pata de contact a anvelopei, dar sunt limitate de cercul de frecare al lui Kamm (Fy,max = μ * Fz).',
      },
      {
        text: 'Aerodinamica activă oferă o cale complet nouă: mărește forța normală Fz prin generarea de apăsare aerodinamică (Downforce FL), extinzând aderența fără a adăuga masă inerțială vehiculului.',
      },
      {
        text: 'Această prezentare unește două dimensiuni: (1) Studiul mecatronic de bază dezvoltat în mediul VI-CarRealTime și validat pe simulatorul DIL, și (2) Aplicarea sa industrială directă pe hypercar-ul de serie Aston Martin Valhalla.',
      },
    ],
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
      'Limita Fizică Pasivă: Forța laterală la anvelopă este limitată strict de aderență: Fy,max = μ * Fz. Sistemele tradiționale nu pot depăși această limită când anvelopa se saturează.',
      'Penalizarea Energetică a Drag-ului: La viteze mari, peste 50% din energia vehiculului este consumată pentru învingerea rezistenței aerodinamice FD.',
      'Ipoteza Regimului Cvasi-Static: Până la o frecvență de acționare de 2 Hz, tranzițiile aerodinamice sunt cvasi-statice, permițând superpoziția liniară a forțelor.',
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
    notes: [
      {
        text: '💬 Context (Slide 2): Dificultatea majoră pe vehiculele pasive este compromisul dintre Drag și Downforce. Un eleron fix cu unghi mare oferă aderență în viraje, dar frânează mașina pe liniile drepte.',
      },
      {
        text: 'Soluția este acționarea mecatronică activă: schimbarea unghiului de atac (AOA) în funcție de regimul de rulare.',
      },
      {
        text: 'Validarea ipotezei cvasi-statice de până la 2 Hz este esențială deoarece confirmă că actuatorul hidraulic sau electric poate ajusta eleronul în timp real fără a declanșa desprinderi de flux turbulente imprevizibile.',
      },
    ],
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
    notes: [
      {
        text: '💬 Context (Slide 3): Modelul cu 14 grade de libertate (14 DOF) creat în VI-CarRealTime surprinde fidel transferul dinamic de masă pe frânare și accelerare.',
      },
      {
        text: 'Deoarece mașina are 57% din masă pe puntea spate și o putere uriașă (1257 kW), orice accelerare bruscă descarcă puntea față, modificând dramatic echilibrul aerodinamic.',
      },
      {
        text: "Simulările au folosit două circuite virtuale în VI-Road: 'Parabolica' (pentru stabilitate pe frânare și viraj) și 'GRIP Track' (pentru evaluarea globală a timpului pe tur).",
      },
    ],
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
      src: '/images/guide/fig-4-1-fl-fd-aoa.png',
      caption:
        'Figura 4.1: Evoluția Forțelor Aerodinamice (FL, FD) în funcție de Unghiul AOA la 160 km/h',
      alt: 'Evoluția forțelor aerodinamice FL/FD vs AOA la 160 km/h',
    },
    notes: [
      {
        text: '💬 Context (Slide 4): Una dintre cele mai importante descoperiri ale cercetării este că o aerodinamică pasivă perfect echilibrată (50% față / 50% spate) NU este optimă pe o mașină dezechilibrată mecanic.',
      },
      {
        text: 'Deoarece motoarele electrice spate livrează un cuplu uriaș, la ieșirea din viraj puntea față se ridică, iar mașina subvira masiv dacă aerodinamica rămânea fixă.',
      },
      {
        text: 'Soluția este modularea mecatronică activă: schimbarea Centrului de Presiune (CoP) în timp real pentru a compensa transferul de masă.',
      },
    ],
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
    notes: [
      {
        text: '💬 Context (Slide 5): Controllerul comută automat între cele 3 stări pe baza CAN-bus-ului vehiculului (viteză, apăsare pedale, senzori G).',
      },
      {
        text: 'Modulul DRS reduce timpul 0-300 km/h de la 10.728s la 10.650s.',
      },
      {
        text: 'Modulul Aerobrake creează o forță de frânare aerodinamică masivă pe puntea spate, permițând pilotului să întârzie punctul de oprire fără pierdere de aderență.',
      },
      {
        text: 'Modulul MaxP variază AOA pe plaje de viteză (0° la 100-180 km/h, 3° la 180-250 km/h, 4.5° la 250-300 km/h) pentru a menține traiectoria perfectă.',
      },
    ],
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
      src: '/images/guide/fig-6-1-nurburgring.png',
      caption:
        'Figura 6.1: Comparația Timpilor pe Tur pe Nürburgring GP (VI-Driver vs. Pilot Uman DIL)',
      alt: 'Comparație timp pe tur Nürburgring GP — VI-Driver vs Pilot Uman DIL',
    },
    notes: [
      {
        text: '💬 Context (Slide 6): Diferența dintre pilotul uman și cel virtual este una dintre cele mai valoroase concluzii inginerești ale lucrării.',
      },
      {
        text: 'Pilotul virtual (VI-Driver) operează la limita matematică fără frică, pe când pilotul uman frânează mai devreme dacă mașina oscilează.',
      },
      {
        text: 'Sistemul activ MaxP oferă o platformă aerodinamică predictibilă, permițând pilotului uman să atace virajele de mare viteză fără ezitare.',
      },
    ],
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
      src: '/images/guide/fig-7-1-downforce.png',
      caption:
        'Figura 7.1: Curba de Apăsare Aerodinamică (Downforce) pe Modelul de Serie Valhalla',
      alt: 'Curba de downforce pe modelul de serie Valhalla',
    },
    notes: [
      {
        text: '💬 Context (Slide 7): Acest slide face legătura directă între cercetarea dinamică 14 DOF și mașina fizică de serie creată de Aston Martin în 999 exemplare.',
      },
      {
        text: 'Timpul de acționare de sub 400 ms al eleronului spate de pe mașina de serie respectă cu strictețe ipoteza cvasi-statică (< 2 Hz) demonstrată în studiu.',
      },
      {
        text: 'Sistemul activ de pe Valhalla include și e-Reverse (marșarier realizat exclusiv electric de motoarele față), eliminând pârghiile mecanice din cutia DCT cu 8 trepte pentru a economisi masă.',
      },
    ],
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
      src: '/images/guide/fig-8-1-pi-rom.png',
      caption:
        'Figura 8.1: Timpul de Execuție Computațional: CFD XFOIL vs. Rețeaua Neuronală PI-ROM',
      alt: 'Comparație timp execuție CFD XFOIL vs PI-ROM',
    },
    notes: [
      {
        text: '💬 Context (Slide 8): Modelul PI-ROM dezvoltat de Subramanian reprezintă viitorul controlului aerodinamic activ.',
      },
      {
        text: "Prin integrarea fizicii analitice direct în rețeaua neuronală, algoritmul nu mai face 'ghicituri' ne-fizice și atinge o viteză de calcul de 0.0906 ms.",
      },
      {
        text: 'Această viteză permite controllerului să recalculeze unghiul AOA de 1000 de ori pe secundă (1000 Hz), depășind cu mult cerința minimă de control.',
      },
    ],
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
    notes: [
      {
        text: 'Cap 09 nu este un slide din ghidul de prezentare — este simulatorul interactiv R3F păstrat între Slide 8 (PI-ROM) și Slide 9 (Discuții).',
      },
      {
        text: 'Moduri DRS / Aerobrake / MaxP: AOA, splitter OPEN|CLOSED, praguri viteză / pedale / ay — aliniate cu ghidul Slide 5.',
      },
    ],
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
    notes: [
      {
        text: '💬 Context (Slide 9): Integrarea aerodinamicii active schimbă fundamental modul în care este calibrat un șasiu.',
      },
      {
        text: 'În loc să fie nevoie de o suspensie extrem de rigidă care să compromită confortul și aderența pe denivelări, aerodinamica activă adaugă apăsare doar la viteze mari când este într-adevăr necesar.',
      },
      {
        text: 'Această abordare este esențială pentru hypercar-urile moderne care trebuie să funcționeze impecabil atât pe pistă, cât și pe drumurile publice.',
      },
    ],
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
    notes: [
      {
        text: '💬 Context (Slide 10): Toate modelele matematice, datele din simulările 14 DOF, ecuațiile PI-ROM și specificațiile de serie Aston Martin Valhalla au fost validate prin teste numerice și pe simulatorul Driver-in-the-Loop.',
      },
      {
        text: 'Pentru întrebări suplimentare și colaborări pe proiecte de mecatronică automotive, datele de contact ale autorilor sunt incluse în memoriul tehnic atașat.',
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
