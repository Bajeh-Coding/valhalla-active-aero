/**
 * Chart series from chapter packs — paper-exact / AM-public only.
 * No invented points. Locators + fact_ids preserved for UI footers.
 */

export type ChartType = 'grouped_bar' | 'line' | 'step'

export interface ChartSeries {
  name: string
  points: Array<[string | number, number | null]>
  /** Optional render hint for dual-axis / markers. */
  role?: 'primary' | 'secondary' | 'marker'
}

export interface ChartSpec {
  chartId: string
  type: ChartType
  title: string
  xLabel: string
  yLabel: string
  units: string
  series: ChartSeries[]
  locator: string
  factIds: string[]
  annotation?: string
  /** Firewall tag for AM charts. */
  industrial?: boolean
  /** Vertical markers e.g. splitter @ 110 km/h. */
  markers?: Array<{ x: number; label: string }>
  /** Horizontal target line (e.g. balance 0.5). */
  targetY?: { value: number; label: string }
}

/** Ch01 / Ch06 — S1 Table 3 forces @ 160 km/h */
export const TABLE3_FORCES: ChartSpec = {
  chartId: 'table3-forces',
  type: 'grouped_bar',
  title: 'Forțe aero @ 160 km/h — Original vs New Aero Pack',
  xLabel: 'Componentă forță',
  yLabel: 'Forță',
  units: 'N',
  series: [
    {
      name: 'Original Vehicle',
      points: [
        ['Drag', 752],
        ['Front DF', 370],
        ['Rear DF', -126],
      ],
    },
    {
      name: 'New Aero Pack',
      points: [
        ['Drag', 788],
        ['Front DF', 470],
        ['Rear DF', 467],
      ],
    },
  ],
  locator: 'S1 Table 3 / paper p.3 of 10',
  factIds: ['S1-F011'],
  annotation: 'Rear Original = −126 N (lift pe axa spate)',
}

/** Ch01 — axle downforce flip */
export const TABLE3_AXLE: ChartSpec = {
  chartId: 'table3-axle-downforce',
  type: 'grouped_bar',
  title: 'Downforce pe axe @ 160 km/h',
  xLabel: 'Axă',
  yLabel: 'Downforce',
  units: 'N',
  series: [
    {
      name: 'Original Vehicle',
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
  locator: 'S1 Table 3 / paper p.3 of 10',
  factIds: ['S1-F010', 'S1-F011', 'S1-F012'],
  annotation: 'New balance ≈ 470/(470+467) ≈ 0.502 · Drag 752→788 N',
}

/** Ch01 / Ch04 / Ch06 — Table 4 balance validation */
export const TABLE4_BALANCE: ChartSpec = {
  chartId: 'table4-balance-validation',
  type: 'grouped_bar',
  title: 'GRIP — balance aero × set-up mecanic (Table 4)',
  xLabel: 'Dynamic set-up',
  yLabel: 'Lap-time',
  units: 's',
  series: [
    {
      name: 'Original aero',
      points: [
        ['Standard', 111.251],
        ['RWD–Half', 118.53],
        ['TV', 108.0],
      ],
    },
    {
      name: 'New aero pack',
      points: [
        ['Standard', 112.258],
        ['RWD–Half', 112.6],
        ['TV', 106.173],
      ],
    },
  ],
  locator: 'S1 Table 4 / paper p.4 of 10',
  factIds: ['S1-F080', 'S1-F081'],
  annotation: 'Δ Standard +1.007 s · RWD −5.930 s · TV −1.827 s',
}

/** Ch02 — DRS AOA ramp + splitter step */
export const DRS_SCHEDULE: ChartSpec = {
  chartId: 'drs-aoa-splitter-schedule',
  type: 'line',
  title: 'DRS — AOA aripă (rampă) vs viteză',
  xLabel: 'V',
  yLabel: 'AOA',
  units: 'km/h ; deg',
  series: [
    {
      name: 'Wing AOA (DRS)',
      points: [
        [0, 6],
        [70, 6],
        [80, 4.8],
        [90, 3.6],
        [100, 2.4],
        [110, 1.2],
        [120, 0],
        [200, 0],
        [300, 0],
      ],
    },
  ],
  markers: [{ x: 110, label: 'splitter OPEN' }],
  locator: 'S1 p.5 / § DRS',
  factIds: ['S1-F032', 'S1-F034'],
  annotation: 'Rampă liniară 6°→0° pe [70,120] km/h · throttle ≥70% · |ay| ≤1 g',
}

/** Ch02 / Ch06 — MaxP AOA step schedule */
export const MAXP_SCHEDULE: ChartSpec = {
  chartId: 'maxp-aoa-schedule',
  type: 'step',
  title: 'MaxP — schedule empiric AOA vs viteză',
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
  locator: 'S1 p.6 / text pe Figure 13',
  factIds: ['S1-F050', 'S1-F051'],
  annotation: 'V < 100 km/h: schedule nepublicat — omit',
}

/** Ch02 — categorical AOA set-points */
export const MODE_SETPOINTS: ChartSpec = {
  chartId: 'mode-setpoints-aoa',
  type: 'grouped_bar',
  title: 'Set-point AOA pe stare de control (S1)',
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
  locator: 'S1 p.5–6 / DRS + Aerobrake + MaxP',
  factIds: ['S1-F021', 'S1-F032', 'S1-F040', 'S1-F051'],
}

/** Ch03 / Ch04 — Table 6 Virtual vs DIL */
export const TABLE6_DIL: ChartSpec = {
  chartId: 'table6-virtual-vs-dil',
  type: 'grouped_bar',
  title: 'Nürburgring GP — best lap-times (Virtual vs DIL)',
  xLabel: 'Configuration',
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
  locator: 'S1 Table 6 / paper p.7 of 10',
  factIds: ['S1-F070', 'S1-F071', 'S1-F073'],
  annotation: 'Δ DIL MaxP vs Original = −5.76 s',
}

/** Ch03 — Table 6 deltas */
export const TABLE6_DELTA: ChartSpec = {
  chartId: 'table6-delta-to-previous',
  type: 'grouped_bar',
  title: 'Δ lap vs configurația anterioară (Table 6)',
  xLabel: 'Step',
  yLabel: 'Delta lap-time',
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
  locator: 'S1 Table 6 / paper p.7 of 10',
  factIds: ['S1-F071', 'S1-F072'],
}

/** Ch04 / Ch06 — Table 5 GRIP algorithms */
export const TABLE5_GRIP: ChartSpec = {
  chartId: 'table5-grip-lap-times',
  type: 'grouped_bar',
  title: 'GRIP-Track lap-times — Passive vs Active (Table 5)',
  xLabel: 'Aerodynamic configuration',
  yLabel: 'Lap-time',
  units: 's',
  series: [
    {
      name: 'Lap-time',
      points: [
        ['Passive–Orig.', 111.251],
        ['Passive–New', 112.258],
        ['DRS', 112.26],
        ['DRS+AeroB.', 108.414],
        ['MaxP', 108.137],
      ],
    },
  ],
  locator: 'S1 Table 5 / paper p.6 of 10',
  factIds: ['S1-F060', 'S1-F062'],
  annotation: 'Δ MaxP vs Passive–Original = −3.114 s',
}

/** Ch04 / Ch06 — Parabolica times */
export const PARABOLICA_TIMES: ChartSpec = {
  chartId: 'parabolica-maneuver-times',
  type: 'grouped_bar',
  title: 'Parabolica — timp manevră DRS → Aerobrake → MaxP',
  xLabel: 'Control mode',
  yLabel: 'Maneuver time',
  units: 's',
  series: [
    {
      name: 'Parabolica time',
      points: [
        ['DRS', 29.86],
        ['DRS+Aerobrake', 29.791],
        ['MaxP', 29.758],
      ],
    },
  ],
  locator: 'S1 paper p.5–6 of 10',
  factIds: ['S1-F042', 'S1-F052'],
  annotation: 'MaxP +33 ms vs DRS+Aerobrake',
}

/** Ch05 — AM wing raise states */
export const AM_WING_STATES: ChartSpec = {
  chartId: 'am-wing-states',
  type: 'grouped_bar',
  title: 'Stări publice aripa spate (AM)',
  xLabel: 'Mod',
  yLabel: 'Ridicare',
  units: 'mm',
  series: [
    {
      name: 'Ridicare aripa spate',
      points: [
        ['EV/Sport/Sport+', 0],
        ['Race', 255],
      ],
    },
  ],
  locator: 'AM-BRO-2025; AM-SPEC Aerodynamics',
  factIds: ['AM-F010', 'AM-F060', 'AM-F061'],
  industrial: true,
  annotation: 'Sursă: Aston Martin public · NU SAE 2020-36-0079',
}

/** Ch05 — AM response time ceilings */
export const AM_RESPONSE: ChartSpec = {
  chartId: 'am-response-times',
  type: 'grouped_bar',
  title: 'Timp de reacție Active Aero (AM) — plafon public',
  xLabel: 'Funcție',
  yLabel: 'Timp',
  units: 's',
  series: [
    {
      name: 'Plafon AM (within / under)',
      points: [
        ['Front wing', 0.5],
        ['Rear wing', 0.5],
        ['Airbrake', 0.5],
      ],
    },
  ],
  locator: 'AM-SPEC; AM-AERO; AM-FILM',
  factIds: ['AM-F004', 'AM-F013', 'AM-F014', 'AM-F020'],
  industrial: true,
  annotation: 'Bare = plafoane publice (≤ / < 0.5 s) — nu măsurători SAE',
}

/** Ch05 — AM downforce plateau */
export const AM_DOWNFORCE: ChartSpec = {
  chartId: 'am-downforce-plateau',
  type: 'line',
  title: 'Downforce public AM (Race) — platou >600 kg',
  xLabel: 'Viteză',
  yLabel: 'Downforce (echiv. masă)',
  units: 'kg @ km/h',
  series: [
    {
      name: 'AM claim: >600 kg (bound = 600)',
      points: [
        [240, 600],
        [350, 600],
      ],
    },
  ],
  locator: 'AM-SPEC; AM-AERO; AM-BRO-2025',
  factIds: ['AM-F030', 'AM-F031', 'AM-F032', 'AM-F033'],
  industrial: true,
  annotation: 'Platou = lower bound public „in excess of 600 kg” — nu curbă măsurată',
}

/** Ch06 — derived balance New pack only */
export const TABLE3_BALANCE: ChartSpec = {
  chartId: 'table3-balance-derived',
  type: 'grouped_bar',
  title: 'Aero balance @ 160 km/h (derivat Table 3)',
  xLabel: 'Pack',
  yLabel: 'Balance = Front / (Front+Rear)',
  units: '—',
  series: [
    {
      name: 'balance',
      points: [['New Aero Pack', 0.5016]],
    },
  ],
  targetY: { value: 0.5, label: 'țintă 0.5' },
  locator: 'S1 Table 3 + p.4 / S1-F012, S1-F013',
  factIds: ['S1-F011', 'S1-F012', 'S1-F013'],
  annotation: 'Original omitted: Rear DF negativ — ratio nepublicat',
}

/** Ch06 — 0→300 */
export const ZERO_TO_300: ChartSpec = {
  chartId: 'zero-to-300',
  type: 'grouped_bar',
  title: 'Accelerație 0→300 km/h — Passive vs DRS',
  xLabel: 'Configuration',
  yLabel: 'Time',
  units: 's',
  series: [
    {
      name: '0→300 km/h',
      points: [
        ['Passive', 10.728],
        ['DRS', 10.65],
      ],
    },
  ],
  locator: 'S1 p.5 / § DRS',
  factIds: ['S1-F035'],
  annotation: 'Δ = −0.078 s',
}

/** Ch06 — Parabolica geometry Table 2 */
export const TABLE2_PARABOLICA: ChartSpec = {
  chartId: 'table2-parabolica-radius',
  type: 'step',
  title: 'Parabolica — lungime vs rază de curbură (Table 2)',
  xLabel: 'L',
  yLabel: 'R',
  units: 'm',
  series: [
    {
      name: 'R(L)',
      points: [
        [0, 0],
        [700, 0],
        [800, 100],
        [1300, 0],
        [1500, 0],
      ],
    },
  ],
  locator: 'S1 Table 2 / paper p.2–3 of 10',
  factIds: ['S1-F075'],
  annotation: 'Context geometrie — nu rezultat de performanță',
}

export const ALL_CHARTS: Record<string, ChartSpec> = {
  [TABLE3_FORCES.chartId]: TABLE3_FORCES,
  [TABLE3_AXLE.chartId]: TABLE3_AXLE,
  [TABLE4_BALANCE.chartId]: TABLE4_BALANCE,
  [DRS_SCHEDULE.chartId]: DRS_SCHEDULE,
  [MAXP_SCHEDULE.chartId]: MAXP_SCHEDULE,
  [MODE_SETPOINTS.chartId]: MODE_SETPOINTS,
  [TABLE6_DIL.chartId]: TABLE6_DIL,
  [TABLE6_DELTA.chartId]: TABLE6_DELTA,
  [TABLE5_GRIP.chartId]: TABLE5_GRIP,
  [PARABOLICA_TIMES.chartId]: PARABOLICA_TIMES,
  [AM_WING_STATES.chartId]: AM_WING_STATES,
  [AM_RESPONSE.chartId]: AM_RESPONSE,
  [AM_DOWNFORCE.chartId]: AM_DOWNFORCE,
  [TABLE3_BALANCE.chartId]: TABLE3_BALANCE,
  [ZERO_TO_300.chartId]: ZERO_TO_300,
  [TABLE2_PARABOLICA.chartId]: TABLE2_PARABOLICA,
}
