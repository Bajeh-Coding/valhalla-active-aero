/**
 * Scientific paper citation schema for Chapter 5 technical matrix.
 * Only identifiers named in master-spec are populated; titles/DOIs left
 * optional until Phase 2/5 fills verified bibliographic metadata.
 */
export interface PaperCitation {
  /** Stable internal id for UI keys / matrix rows. */
  id: string
  /** Primary author or short label as named in the master-spec. */
  primaryLabel: string
  /** Full author list when known (do not invent). */
  authors?: string
  /** Paper title when verified (do not invent). */
  title?: string
  /** Publication year when verified. */
  year?: number
  /** Venue / society (e.g. SAE). */
  venue?: string
  /** Document number or DOI when verified (e.g. SAE 2020-36-0079). */
  documentId?: string
  /** One-line role in this app (from master-spec framing only). */
  roleInApp: string
}

export type PaperCitationId =
  | 'sae-2020-36-0079'
  | 'pieter-de-buck'
  | 'subramanian'
  | 'wei-gao'
