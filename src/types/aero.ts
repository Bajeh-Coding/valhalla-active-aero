/** Active aero operating modes — S1 state machine (PASSIVE → STANDARD). */
export type AeroMode = 'DRS' | 'AEROBRAKE' | 'MAXP' | 'STANDARD'

/** Front splitter binary state (S1-F020). */
export type SplitterState = 'OPEN' | 'CLOSED'

/** Science-facts fact ids cited by derived telemetry. */
export type FactId =
  | 'S1-F002'
  | 'S1-F003'
  | 'S1-F011'
  | 'S1-F012'
  | 'S1-F013'
  | 'S1-F020'
  | 'S1-F021'
  | 'S1-F022'
  | 'S1-F032'
  | 'S1-F033'
  | 'S1-F034'
  | 'S1-F040'
  | 'S1-F041'
  | 'S1-F050'
  | 'S1-F051'
  | 'S1-F060'
  | 'S1-F071'
  | 'S2-F015'
  | 'S2-F017'
  | 'S2-F020'
  | 'S2-F040'

/** Live control inputs driving the state machine. */
export interface AeroControlInputs {
  /** Wing AOA set-point / MaxP override [deg]. */
  aoaDeg: number
  /** Vehicle speed [km/h]. */
  speedKmh: number
  /** Throttle pedal 0..100. */
  throttlePct: number
  /** Brake pedal 0..100. */
  brakePct: number
  /** Lateral acceleration magnitude used for |ay|≤1 g gates [g]. */
  ayG: number
  /** Selected / resolved aero mode. */
  mode: AeroMode
  /** Front splitter position. */
  splitter: SplitterState
}

/** Derived telemetry — paper-exact; forces may be null outside Table 3 anchor. */
export interface TelemetryMetrics extends AeroControlInputs {
  /** Effective wing AOA after state machine [deg]. */
  aoaDegEffective: number
  /** Drag force [N] — Table 3 @160 km/h when available. */
  dragN: number | null
  /** Front downforce [N] — Table 3 @160 km/h when available. */
  frontDownforceN: number | null
  /** Rear downforce [N] — Table 3 @160 km/h when available. */
  rearDownforceN: number | null
  /** front DF / total DF (S1-F013); null if total ≤ 0 or forces missing. */
  balanceFront: number | null
  aerobrakeForced: boolean
  drsDenied: boolean
  citations: FactId[]
}

/** Per-mode surface set-points from S1 (no invented C_D / C_L). */
export interface ModeSurfaceSetpoint {
  mode: AeroMode
  /** Nominal AOA set-point, or MaxP schedule descriptor. */
  aoaDeg: number | 'schedule'
  splitter: SplitterState
  /** Trigger note copied from science-facts. */
  triggerNote?: string
}
