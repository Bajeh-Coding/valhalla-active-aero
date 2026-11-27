import type { PaperCitation } from '@/types/papers'

/**
 * The four papers named in the master-spec.
 * Bibliographic fields beyond the named labels are omitted (not invented).
 * Phase 5 fills verified titles/DOIs into this table.
 */
export const PAPER_CITATIONS: readonly PaperCitation[] = [
  {
    id: 'sae-2020-36-0079',
    primaryLabel: 'SAE 2020-36-0079',
    documentId: 'SAE 2020-36-0079',
    venue: 'SAE',
    year: 2020,
    roleInApp: 'Primary SAE reference for active-aero parameters',
  },
  {
    id: 'pieter-de-buck',
    primaryLabel: 'Pieter de Buck',
    roleInApp: 'Scientific ground-truth source (master-spec)',
  },
  {
    id: 'subramanian',
    primaryLabel: 'Subramanian',
    roleInApp: 'Scientific ground-truth source (master-spec)',
  },
  {
    id: 'wei-gao',
    primaryLabel: 'Wei Gao',
    roleInApp: 'Scientific ground-truth source (master-spec)',
  },
] as const
