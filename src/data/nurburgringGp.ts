import type { TrackLayout } from '@/types/track'

/**
 * Nürburgring GP track layout placeholder.
 * Shape is ready for a GIS / racing-line dump; `coordinates` stays empty
 * until a verified dataset is supplied (Phase 4).
 */
export const NURBURGRING_GP: TrackLayout = {
  name: 'Nürburgring GP',
  circuitId: 'nurburgring-gp',
  coordinates: [],
  coordinateFrame: 'unspecified',
  datasetStatus: 'placeholder',
  note:
    'Placeholder only — no coordinate polyline in Phase 1. ' +
    'Populate `coordinates` with sequential WGS84 or local-ENU samples ' +
    'before Chapter 4 track overlay. Lap-time delta MaxP vs passive = -2.55 s ' +
    '(VI-Grade DIL) lives in vehicleConstants.LAP_TIME, not here.',
}
