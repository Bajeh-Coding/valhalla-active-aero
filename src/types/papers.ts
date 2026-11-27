/**
 * Scientific paper citation schema — S1 + S2 only.
 */
export interface PaperCitation {
  /** Stable internal id for UI keys / matrix rows. */
  id: string
  /** Primary short label. */
  primaryLabel: string
  /** Full author list when known (do not invent). */
  authors?: string
  /** Paper title when verified. */
  title?: string
  /** Publication year when verified. */
  year?: number
  /** Venue / society. */
  venue?: string
  /** Document number or DOI. */
  documentId?: string
  /** One-line role in this app. */
  roleInApp: string
}

export type PaperCitationId = 'sae-2020-36-0079' | 'machines-2024-12-160'
