/**
 * Paper-exact vehicle & aero constants from docs/science-facts.md (S1 + S2).
 * Facts win over any prior master-spec invent. Do not mix S1 Table 1 with S2 Table 7.
 */
import type { AeroMode, ModeSurfaceSetpoint } from '@/types/aero'

/**
 * Body / model class — S1-F003.
 * CFD body shape = Aston Martin Vantage 2019; Valhalla is brand overlay only.
 */
export const VEHICLE_CLASS =
  '4WD full-electric high-end EV (S1 Table 1); CFD body = Vantage 2019' as const

/** Brand overlay label — not a paper vehicle parameter. */
export const BRAND_OVERLAY = 'Aston Martin Valhalla' as const

/** S1 Table 1 — vehicle of reference (S1-F002). */
export const VEHICLE = {
  /** Sprung mass m_s [kg]. */
  sprungMassKg: 2050,
  /** Unsprung mass [kg]. */
  unsprungMassKg: 190,
  /** Total mass = sprung + unsprung [kg]. */
  totalMassKg: 2240,
  /** Max power* [kW] — sum continuous power of four in-wheel motors. */
  totalSystemPowerKw: 1257,
  /** Frontal area A [m²]. */
  frontalAreaM2: 2.1,
  /** Wheelbase L [mm]. */
  wheelbaseMm: 2691,
  /** CoG → front axle [mm]. */
  cogToFrontMm: 1369,
  /** CoG height [mm]. */
  cogHeightMm: 378,
  /** Front track [mm]. */
  frontTrackMm: 1700,
  /** Rear track [mm]. */
  rearTrackMm: 1620,
  /** Front tire radius [mm]. */
  frontTireRadiusMm: 352,
  /** Rear tire radius [mm]. */
  rearTireRadiusMm: 364,
  /**
   * Static front weight share from Table 1 geometry:
   * b = L − a = 2691 − 1369 = 1322; front% = b/L.
   * (Replaces non-paper 43/57 distribution.)
   */
  massDistributionFrontPct: (1322 / 2691) * 100,
  massDistributionRearPct: (1369 / 2691) * 100,
} as const

/**
 * S2 Table 7 — D-segment simulation vehicle (S2-F040).
 * Context for TV/DYC review only — NEVER use as Valhalla / S1 VEHICLE.
 */
export const S2_SIM_VEHICLE = {
  massKg: 1680,
  yawInertiaKgM2: 2600,
  wheelbaseMm: 2700,
  cogToFrontMm: 1160,
  cogToRearMm: 1540,
  halfTrackFrontMm: 756,
  halfTrackRearMm: 748,
  cogHeightMm: 580,
  note: 'S2 Table 7 D-segment — distinct from S1 Table 1 (2050 kg sprung)',
} as const

/** S1-F004 — aero model assumptions. */
export const AERO_ASSUMPTIONS = {
  /** Actuation quasi-static up to ~2 Hz. */
  maxActuationHz: 2,
  superposition: true,
  neglectRollYawOnAeroForces: true,
} as const

/** Active wing / splitter — S1-F020, S1-F021. */
export const ACTUATORS = {
  aoaMinDeg: 0,
  aoaMaxDeg: 25,
  /** Standard setup AOA [deg] (S1-F021). */
  standardAoaDeg: 6,
  /** DRS min-drag AOA [deg] (S1-F032). */
  drsAoaDeg: 0,
  /** Aerobrake AOA [deg] (S1-F040) — not 25°. */
  aerobrakeAoaDeg: 19,
} as const

/** S1 Table 3 — aero forces at 160 km/h (S1-F011). Anchor for live forces. */
export const TABLE3_SPEED_KMH = 160 as const

export interface Table3Forces {
  dragN: number
  frontDownforceN: number
  rearDownforceN: number
}

export const TABLE3_FORCES = {
  original: {
    dragN: 752,
    frontDownforceN: 370,
    rearDownforceN: -126,
  } satisfies Table3Forces,
  newPack: {
    dragN: 788,
    frontDownforceN: 470,
    rearDownforceN: 467,
  } satisfies Table3Forces,
} as const

/** Target aero balance ≈ 0.5 (S1-F012). */
export const AERO_BALANCE_TARGET = 0.5 as const

/** Mode surface set-points — S1 state machine (no C_D/C_L). */
export const MODE_SURFACES: readonly ModeSurfaceSetpoint[] = [
  {
    mode: 'DRS',
    aoaDeg: 0,
    splitter: 'OPEN',
    triggerNote:
      'Throttle ≥ 70%; |ay| ≤ 1 g; splitter @ 110 km/h; wing ramp 70–120 km/h',
  },
  {
    mode: 'STANDARD',
    aoaDeg: 6,
    splitter: 'CLOSED',
    triggerNote: 'Standard setup AOA = 6° (S1-F021)',
  },
  {
    mode: 'MAXP',
    aoaDeg: 'schedule',
    splitter: 'CLOSED',
    triggerNote:
      'When DRS & Aerobrake off; AOA schedule 0°/3°/4.5° by speed (S1-F051)',
  },
  {
    mode: 'AEROBRAKE',
    aoaDeg: 19,
    splitter: 'CLOSED',
    triggerNote: 'v ≥ 70 km/h; brake ≥ 40%; |ay| ≤ 1 g; AOA 19° (S1-F040/041)',
  },
] as const

export function getModeSurface(mode: AeroMode): ModeSurfaceSetpoint {
  const found = MODE_SURFACES.find((m) => m.mode === mode)
  if (!found) {
    throw new Error(`Unknown aero mode: ${mode}`)
  }
  return found
}

/** @deprecated Use getModeSurface — coefficient table removed (non-paper). */
export const getModeCoefficients = getModeSurface

/** @deprecated Alias — MODE_COEFFICIENTS removed; surfaces only. */
export const MODE_COEFFICIENTS = MODE_SURFACES

/** DRS triggers — S1-F033 / S1-F034 (not the old >90 km/h invent). */
export const DRS_TRIGGERS = {
  /** Wing ramp start / minimum engage speed [km/h]. */
  minSpeedKmh: 70,
  /** Splitter high-DF → low-drag transition [km/h]. */
  splitterOpenKmh: 110,
  /** Wing reaches AOA 0° [km/h]. */
  wingRampEndKmh: 120,
  /** Throttle threshold [%] — paper ≥ 70%. */
  minThrottlePct: 70,
  /** |ay| gate [g]. */
  maxAbsAyG: 1,
} as const

/** AEROBRAKE triggers — S1-F041. */
export const AEROBRAKE_TRIGGERS = {
  minSpeedKmh: 70,
  /** Brake threshold [%] — paper ≥ 40%. */
  minBrakePct: 40,
  maxAbsAyG: 1,
} as const

/** MaxP AOA schedule — S1-F051. */
export const MAXP_SCHEDULE = [
  { minKmh: 100, maxKmh: 180, aoaDeg: 0 },
  { minKmh: 180, maxKmh: 250, aoaDeg: 3, exclusiveMin: true },
  { minKmh: 250, maxKmh: 300, aoaDeg: 4.5, exclusiveMin: true },
] as const

/**
 * Lap-time anchors from S1 Tables 5–6 (S1-F060, S1-F071).
 * maxPVsPassiveNewDilDeltaS = Active–MaxP vs Passive–New Aero on DIL (−2.55 s).
 */
export const LAP_TIME = {
  /** GRIP Passive–Original [s] (Table 5). */
  gripPassiveOriginalS: 111.251,
  /** GRIP Passive–New [s] (Table 5). */
  gripPassiveNewS: 112.258,
  /** GRIP DRS [s] (Table 5). */
  gripDrsS: 112.26,
  /** GRIP DRS+Aerobrake [s] (Table 5). */
  gripDrsAerobrakeS: 108.414,
  /** GRIP MaxP [s] (Table 5). */
  gripMaxPS: 108.137,
  /** Derived: MaxP − Passive–Original on GRIP (S1-F062). */
  gripMaxPVsPassiveOriginalDeltaS: -3.114,
  /** Nürburgring GP DIL Passive–Original [s] (Table 6). */
  dilPassiveOriginalS: 134.82,
  /** Nürburgring GP DIL Passive–New [s] (Table 6). */
  dilPassiveNewS: 131.61,
  /** Nürburgring GP DIL Active–MaxP [s] (Table 6). */
  dilMaxPS: 129.06,
  /**
   * MaxP vs Passive–New Aero, DIL step (Table 6) — S1-F071.
   * Keep with this explicit label (architecture §5.1).
   */
  maxPVsPassiveDeltaS: -2.55,
  /** Derived DIL Active–MaxP vs Passive–Original (S1-F073). */
  dilMaxPVsPassiveOriginalDeltaS: -5.76,
} as const

/**
 * S2 Eq. (25) saturation factor — S2-F015.
 * Printed form: satt,i = Fz,i / (2 √(Fx²+Fy²)). Factor "2" = medium confidence.
 */
export const FRICTION_SATURATION = {
  /** Printed denominator factor from PDF extract — verify visually before UI cite. */
  printedDenominatorFactor: 2,
  confidence: 'medium' as const,
  factId: 'S2-F015' as const,
  note:
    'Factor „2” as printed in S2 PDF extract; do not invent μ. Verify PDF before UI.',
}

/** S2 simulation friction levels (S2-F023). */
export const S2_MU_LEVELS = [1.0, 0.4] as const
