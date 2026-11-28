/**
 * Guide figures 4.1 / 6.1 / 7.1 / 8.1 — canonical numbers from
 * Informatii_pentru_Prezentare + sources/presentation/media/image{1–4}.png.
 * Digitized from the guide PNGs; exact labels from guide text where listed.
 */

export type GuideChartId =
  | 'fig-4-1-fl-fd-aoa'
  | 'fig-6-1-nurburgring'
  | 'fig-7-1-downforce'
  | 'fig-8-1-pi-rom'

export type GuideChartKind =
  | 'multi_line'
  | 'grouped_bar'
  | 'area_line'
  | 'horizontal_bar'

export interface GuideChartSeries {
  name: string
  /** Optional short legend key. */
  shortName?: string
  points: Array<[number | string, number]>
  /** Stroke / fill token for the series. */
  color: 'cyan' | 'amber' | 'amr' | 'mist' | 'lime'
  /** Line style for multi_line. */
  dash?: 'solid' | 'dashed' | 'dotted'
  /** Marker shape for multi_line. */
  marker?: 'circle' | 'square' | 'triangle'
}

export interface GuideChartSpec {
  id: GuideChartId
  kind: GuideChartKind
  title: string
  xLabel: string
  yLabel: string
  units: string
  series: GuideChartSeries[]
  annotation?: string
  /** Vertical reference marker (area_line). */
  refX?: { value: number; label: string }
  /** Callout annotation at a point (area_line). */
  callout?: { x: number; y: number; label: string }
  /** Explicit axis domains when needed. */
  xDomain?: [number, number]
  yDomain?: [number, number]
}

/**
 * Figura 4.1 — FL rear / FL front / FD vs rear-wing AOA @ 160 km/h.
 * Points digitized from guide image1 / fig-4-1-fl-fd-aoa.png.
 */
export const FIG_4_1_FL_FD_AOA: GuideChartSpec = {
  id: 'fig-4-1-fl-fd-aoa',
  kind: 'multi_line',
  title: 'Evoluția Forțelor Aerodinamice la 160 km/h',
  xLabel: 'Unghi de Atac Eleron Spate (AOA)',
  yLabel: 'Forță Aerodinamică',
  units: 'N ; °',
  xDomain: [0, 25],
  yDomain: [-400, 800],
  series: [
    {
      name: 'Apăsare Spate (FL,Rear)',
      shortName: 'FL,Rear',
      color: 'cyan',
      dash: 'solid',
      marker: 'circle',
      points: [
        [0, -400],
        [5, -190],
        [10, 213],
        [15, 349],
        [19, 411],
        [25, 310],
      ],
    },
    {
      name: 'Apăsare Față (FL,Front)',
      shortName: 'FL,Front',
      color: 'amber',
      dash: 'dashed',
      marker: 'square',
      points: [
        [0, 91],
        [5, 46],
        [10, 0],
        [15, -45],
        [19, -81],
        [25, -135],
      ],
    },
    {
      name: 'Rezistență Totală (FD)',
      shortName: 'FD',
      color: 'amr',
      dash: 'dotted',
      marker: 'triangle',
      points: [
        [0, 309],
        [5, 350],
        [10, 421],
        [15, 511],
        [19, 678],
        [25, 778],
      ],
    },
  ],
  annotation: 'Guide Figura 4.1 · 160 km/h · image1.png',
}

/**
 * Figura 6.1 — Nürburgring GP lap times (VI-Driver vs human DIL).
 * Exact values from guide Slide 6 text.
 */
export const FIG_6_1_NURBURGRING: GuideChartSpec = {
  id: 'fig-6-1-nurburgring',
  kind: 'grouped_bar',
  title: 'Comparație Timp pe Tur pe Nürburgring GP',
  xLabel: 'Configurație',
  yLabel: 'Timp pe Tur',
  units: 's',
  yDomain: [105, 140],
  series: [
    {
      name: 'Pilot Virtual (VI-Driver)',
      shortName: 'VI-Driver',
      color: 'mist',
      points: [
        ['Pasiv Original', 115.48],
        ['Pasiv Nou (50/50)', 114.08],
        ['ACTIV MaxP Mode', 112.29],
      ],
    },
    {
      name: 'Pilot Uman (DIL Simulator)',
      shortName: 'Pilot Uman',
      color: 'amr',
      points: [
        ['Pasiv Original', 134.82],
        ['Pasiv Nou (50/50)', 131.61],
        ['ACTIV MaxP Mode', 129.06],
      ],
    },
  ],
  annotation: 'Câștig uman net: −2.55 s (MaxP vs Pasiv Nou) · Guide Figura 6.1',
}

/**
 * Figura 7.1 — Valhalla series downforce curve.
 * Digitized from guide image3; plateau 600 kg @ 240–300 km/h from guide text.
 */
export const FIG_7_1_DOWNFORCE: GuideChartSpec = {
  id: 'fig-7-1-downforce',
  kind: 'area_line',
  title: 'Curba de Apăsare Aerodinamică (Downforce) Valhalla Serie',
  xLabel: 'Viteză Vehicul',
  yLabel: 'Downforce Total',
  units: 'kg ; km/h',
  xDomain: [100, 350],
  yDomain: [0, 600],
  series: [
    {
      name: 'Downforce Total',
      color: 'amr',
      dash: 'solid',
      marker: 'circle',
      points: [
        [100, 105],
        [150, 235],
        [200, 415],
        [240, 600],
        [300, 600],
        [350, 521],
      ],
    },
  ],
  refX: {
    value: 240,
    label: 'Punct de Referință: 600 kg @ 240 km/h',
  },
  callout: {
    x: 300,
    y: 600,
    label: 'Cap Aerodinamic Activ (Minimizare Drag VMax)',
  },
  annotation: 'Guide Figura 7.1 · >600 kg @ 240 km/h · image3.png',
}

/**
 * Figura 8.1 — XFOIL vs PI-ROM wall-clock.
 * Exact values from guide Slide 8 text (0.0906 ms / 2.4081 ms · 26.58×).
 */
export const FIG_8_1_PI_ROM: GuideChartSpec = {
  id: 'fig-8-1-pi-rom',
  kind: 'horizontal_bar',
  title: 'Timp de Calcul per Interogare: CFD vs PI-ROM AI',
  xLabel: 'Timp de Execuție',
  yLabel: 'Metodă',
  units: 'ms',
  xDomain: [0, 2.5],
  series: [
    {
      name: 'Wall-clock',
      color: 'amr',
      points: [
        ['PI-ROM Rețea Neuronală', 0.0906],
        ['CFD XFOIL (Clasic)', 2.4081],
      ],
    },
  ],
  annotation: '26.58× mai rapid · Guide Figura 8.1 · 0.0906 ms vs 2.4081 ms',
}

export const GUIDE_CHARTS: Record<GuideChartId, GuideChartSpec> = {
  'fig-4-1-fl-fd-aoa': FIG_4_1_FL_FD_AOA,
  'fig-6-1-nurburgring': FIG_6_1_NURBURGRING,
  'fig-7-1-downforce': FIG_7_1_DOWNFORCE,
  'fig-8-1-pi-rom': FIG_8_1_PI_ROM,
}
