/** Active aero operating modes (master-spec §2). */
export type AeroMode = 'DRS' | 'AEROBRAKE' | 'MAXP' | 'PASSIVE'

/** Front splitter binary state. */
export type SplitterState = 'OPEN' | 'CLOSED'

/** Live control inputs driving the state machine. */
export interface AeroControlInputs {
  /** Wing angle of attack in degrees [0, 25]. */
  aoaDeg: number
  /** Vehicle speed in km/h. */
  speedKmh: number
  /** Throttle pedal 0..100. */
  throttlePct: number
  /** Brake pedal 0..100. */
  brakePct: number
  /** Selected / resolved aero mode. */
  mode: AeroMode
  /** Front splitter position. */
  splitter: SplitterState
}

/** Derived telemetry metrics exposed to HUD / QA. */
export interface TelemetryMetrics extends AeroControlInputs {
  /** Drag force F_D [N]. */
  dragN: number
  /** Downforce F_L [N] (magnitude). */
  downforceN: number
  /** Drag coefficient C_D. */
  cd: number
  /** Lift coefficient C_L (negative = downforce). */
  cl: number
  /** Center of pressure rear share [%]. */
  copRearPct: number
  /** Control-loop sample rate [Hz] for HUD badge. */
  controlLoopHz: number
}

/** Per-mode aerodynamic coefficient snapshot from master-spec. */
export interface ModeAeroCoefficients {
  mode: AeroMode
  aoaDeg: number | { min: number; max: number }
  splitter: SplitterState
  cd: number
  cl: number
  /** Optional trigger description copied from master-spec. */
  triggerNote?: string
}
