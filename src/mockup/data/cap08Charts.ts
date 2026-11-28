/**
 * Cap 08 chart specs — paper-exact / Cap 1–6 sourced numbers only.
 * Illustrative labels required in UI. No invented Valhalla OEM performance.
 */

export type Cap08ChartKind =
  | 'grouped_bar'
  | 'step'
  | 'bar'
  | 'kamm'

export interface Cap08Series {
  name: string
  points: Array<[string | number, number]>
}

export interface Cap08ChartSpec {
  id: string
  kind: Cap08ChartKind
  title: string
  /** Short Romanian lead under the figure title. */
  lead: string
  xLabel: string
  yLabel: string
  units: string
  series: Cap08Series[]
  locator: string
  annotation?: string
  markers?: Array<{ x: number; label: string }>
}

/** Cap 04 / SAE Table 6 — Nürburgring GP Virtual vs DIL. */
export const CHART_TABLE6_DIL: Cap08ChartSpec = {
  id: 'ch08-table6-dil',
  kind: 'grouped_bar',
  title: 'Nürburgring GP — best lap-times (Virtual vs DIL)',
  lead: 'Cap. 04 · validare pe circuit — Passive → Active–MaxP.',
  xLabel: 'Configurație',
  yLabel: 'Lap-time',
  units: 's',
  series: [
    {
      name: 'Virtual',
      points: [
        ['Passive–Orig.', 115.48],
        ['Passive–New', 114.08],
        ['Active–MaxP', 112.29],
      ],
    },
    {
      name: 'DIL (human)',
      points: [
        ['Passive–Orig.', 134.82],
        ['Passive–New', 131.61],
        ['Active–MaxP', 129.06],
      ],
    },
  ],
  locator: 'SAE 2020-36-0079 · Table 6 · p.7 · ilustrativ',
  annotation: 'DIL Active–MaxP vs Passive–New = −2.55 s',
}

/** Cap 04 — Table 6 step deltas. */
export const CHART_TABLE6_DELTA: Cap08ChartSpec = {
  id: 'ch08-table6-delta',
  kind: 'grouped_bar',
  title: 'Δ lap vs configurația anterioară (Table 6)',
  lead: 'Cap. 04 · pasul Active–MaxP pe DIL = −2.55 s.',
  xLabel: 'Pas',
  yLabel: 'Δ lap-time',
  units: 's',
  series: [
    {
      name: 'Virtual Δ',
      points: [
        ['Orig.→New', -1.4],
        ['New→MaxP', -1.79],
      ],
    },
    {
      name: 'DIL Δ',
      points: [
        ['Orig.→New', -3.21],
        ['New→MaxP', -2.55],
      ],
    },
  ],
  locator: 'SAE 2020-36-0079 · Table 6 · p.7 · ilustrativ',
}

/** Cap 03 / Cap 06 — MaxP AOA schedule. */
export const CHART_MAXP_AOA: Cap08ChartSpec = {
  id: 'ch08-maxp-aoa',
  kind: 'step',
  title: 'MaxP — schedule empiric AOA vs viteză',
  lead: 'Cap. 03 · stare MaxP — AOA pe benzi de viteză (S1).',
  xLabel: 'V',
  yLabel: 'AOA',
  units: 'km/h ; deg',
  series: [
    {
      name: 'MaxP AOA',
      points: [
        [100, 0],
        [180, 0],
        [180, 3],
        [250, 3],
        [250, 4.5],
        [300, 4.5],
      ],
    },
  ],
  locator: 'SAE 2020-36-0079 · p.6 · text pe Figure 13 · ilustrativ',
  annotation: 'V < 100 km/h: schedule nepublicat — omit',
}

/** Cap 03 — categorical AOA set-points for DRS / Standard / Aerobrake / MaxP. */
export const CHART_MODE_AOA: Cap08ChartSpec = {
  id: 'ch08-mode-aoa',
  kind: 'bar',
  title: 'Set-point AOA pe stare de control',
  lead: 'Cap. 03 · mașina de stări DRS / Standard / Aerobrake / MaxP.',
  xLabel: 'Stare',
  yLabel: 'AOA',
  units: 'deg',
  series: [
    {
      name: 'AOA set-point',
      points: [
        ['DRS', 0],
        ['Standard', 6],
        ['Aerobrake', 19],
        ['MaxP 100–180', 0],
        ['MaxP 180–250', 3],
        ['MaxP 250–300', 4.5],
      ],
    },
  ],
  locator: 'SAE 2020-36-0079 · pp.5–6 · DRS + Aerobrake + MaxP · ilustrativ',
}

/** Cap 05 — PI-ROM vs XFOIL wall-clock (Subramanian Table 2). */
export const CHART_PI_ROM: Cap08ChartSpec = {
  id: 'ch08-pi-rom-xfoil',
  kind: 'bar',
  title: 'PI-ROM vs XFOIL — timp de evaluare',
  lead: 'Cap. 05 · predicție coeficienți aero în buclă închisă.',
  xLabel: 'Metodă',
  yLabel: 'Timp',
  units: 'ms',
  series: [
    {
      name: 'Wall-clock',
      points: [
        ['PI-ROM', 0.0906],
        ['XFOIL CFD', 2.4081],
      ],
    },
  ],
  locator:
    'subramanian_activeaeroROM_preprint.pdf · Table 2 · 26.58× · ilustrativ',
  annotation: 'PI-ROM 0.0906 ms vs XFOIL 2.4081 ms',
}

/**
 * Cap 06 conceptual — Kamm friction circle / FL.
 * Diagram only: no μ, no Valhalla OEM radius — illustrative geometry.
 */
export const CHART_KAMM: Cap08ChartSpec = {
  id: 'ch08-kamm-fl',
  kind: 'kamm',
  title: 'Cerc de frecare Kamm — rolul downforce (Fz)',
  lead: 'Cap. 06 · limita anvelopei: FL (Fx) × Fy — raza proporțională cu μ·Fz.',
  xLabel: 'Fx (FL)',
  yLabel: 'Fy',
  units: '—',
  series: [],
  locator:
    'Asperti et al. — Torque Vectoring review · friction circle / ellipse · ilustrativ conceptual',
  annotation:
    'Downforce ↑ → Fz ↑ → rază utilizabilă ↑ — fără valori OEM Valhalla',
}

/** Cap 01 / Cap 02 context — Table 3 axle forces @ 160 km/h. */
export const CHART_TABLE3_AXLE: Cap08ChartSpec = {
  id: 'ch08-table3-axle',
  kind: 'grouped_bar',
  title: 'Downforce pe axe @ 160 km/h (Table 3)',
  lead: 'Cap. 01–02 · pachet aero vs baseline — balance aproape 0.5.',
  xLabel: 'Axă',
  yLabel: 'Downforce',
  units: 'N',
  series: [
    {
      name: 'Original',
      points: [
        ['Front', 370],
        ['Rear', -126],
      ],
    },
    {
      name: 'New Aero Pack',
      points: [
        ['Front', 470],
        ['Rear', 467],
      ],
    },
  ],
  locator: 'SAE 2020-36-0079 · Table 3 · p.3 · ilustrativ',
  annotation: 'Rear Original = −126 N (lift) · New balance ≈ 0.502',
}

export const CAP08_CHARTS: readonly Cap08ChartSpec[] = [
  CHART_TABLE3_AXLE,
  CHART_MODE_AOA,
  CHART_MAXP_AOA,
  CHART_TABLE6_DIL,
  CHART_TABLE6_DELTA,
  CHART_PI_ROM,
  CHART_KAMM,
] as const
