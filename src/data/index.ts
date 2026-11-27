export {
  VEHICLE_CLASS,
  BRAND_OVERLAY,
  VEHICLE,
  S2_SIM_VEHICLE,
  AERO_ASSUMPTIONS,
  ACTUATORS,
  TABLE3_SPEED_KMH,
  TABLE3_FORCES,
  AERO_BALANCE_TARGET,
  MODE_SURFACES,
  MODE_COEFFICIENTS,
  getModeSurface,
  getModeCoefficients,
  DRS_TRIGGERS,
  AEROBRAKE_TRIGGERS,
  MAXP_SCHEDULE,
  LAP_TIME,
  FRICTION_SATURATION,
  S2_MU_LEVELS,
} from './vehicleConstants'
export type { Table3Forces } from './vehicleConstants'

export { PAPER_CITATIONS } from './papers'
export { NURBURGRING_GP } from './nurburgringGp'
export { VEHICLE_14DOF } from './vehicle14Dof'
export type {
  Vehicle14DofKnownParams,
  Vehicle14DofPendingParams,
  Vehicle14DofModel,
} from './vehicle14Dof'
export {
  PHOTO_ASSETS,
  CHAPTER_PHOTO_KEYS,
  photoSrc,
  photoCdn,
} from './photoAssets'
export type { PhotoAsset, PhotoKey } from './photoAssets'
export { PRESENTATION_COPY } from './presentationCopy'
