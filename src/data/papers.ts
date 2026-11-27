import type { PaperCitation } from '@/types/papers'

/**
 * Bibliography — only S1 + S2 from science-facts (S1-F000, S2-F000).
 * Non-S1/S2 labels (Pieter / Subramanian / Wei Gao) removed.
 */
export const PAPER_CITATIONS: readonly PaperCitation[] = [
  {
    id: 'sae-2020-36-0079',
    primaryLabel: 'SAE 2020-36-0079',
    authors:
      'Ferraris, De Cupis, de Carvalho Pinheiro, Messana, Sisca, Airale, Carello',
    title:
      'Integrated Design and Control of Active Aerodynamic Features for High Performance Electric Vehicles',
    year: 2020,
    venue: 'SAE',
    documentId: 'SAE 2020-36-0079',
    roleInApp:
      'S1 — active aero actuators, state machine, Table 1/3/4/5/6 forces & laps',
  },
  {
    id: 'machines-2024-12-160',
    primaryLabel: 'Machines 2024, 12, 160',
    authors: 'Asperti, Vignati, Sabbioni',
    title:
      'On Torque Vectoring Control: Review and Comparison of State-of-the-Art Approaches',
    year: 2024,
    venue: 'Machines',
    documentId: '10.3390/machines12030160',
    roleInApp:
      'S2 — TV/DYC, friction circle / Eq. 25; Table 7 is NOT the S1 vehicle',
  },
] as const
