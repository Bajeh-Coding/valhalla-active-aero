/**
 * Nürburgring GP track coordinate schema.
 *
 * Placeholder structure for Phase 4 overlay — no GIS dump in Phase 1.
 * When a real polyline is added, populate `coordinates` as sequential
 * WGS84 samples (or local ENU meters) along the racing line.
 */
export interface TrackCoordinate {
  /** Latitude degrees (WGS84) — or omit if using local meters. */
  lat?: number
  /** Longitude degrees (WGS84) — or omit if using local meters. */
  lon?: number
  /** Local easting [m] relative to track origin (optional ENU frame). */
  xM?: number
  /** Local northing [m] relative to track origin (optional ENU frame). */
  yM?: number
  /** Elevation [m] if available. */
  elevationM?: number
  /** Arc-length distance from start/finish [m]. */
  distanceM?: number
  /** Sector index (1-based) when known. */
  sector?: number
}

export interface TrackLayout {
  name: string
  circuitId: string
  /** Empty array until a verified GIS / racing-line dump is supplied. */
  coordinates: TrackCoordinate[]
  /** Official length [m] when verified — leave undefined rather than invent. */
  lengthM?: number
  /** Coordinate reference notes for consumers. */
  coordinateFrame: 'wgs84' | 'local-enu' | 'unspecified'
  /** Human-readable status of the dataset. */
  datasetStatus: 'placeholder' | 'partial' | 'complete'
  note: string
}
