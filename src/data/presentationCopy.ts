/**
 * Sparse Romanian narrative for the cinematic scrollytelling shell.
 * Source: docs/presentation-content-ro.md — one idea per chapter, key numbers only.
 */
export const PRESENTATION_COPY = {
  hero: {
    /** Supporting line under brand — Cap. 1.1 */
    line: 'FL crește Fz pe punți — dincolo de cercul Kamm.',
    scroll: 'Derulați',
  },
  physics: {
    /** Cap. 1.2 — aerodynamic compromise */
    title: 'Compromisul aerodinamic',
    body: 'Aproape jumătate din energie la viteză mare se opune FD. Aerodinamica activă modulează FL fără masă inerțială.',
    equation: 'FD = ½ ρ v² A CD · FL = ½ ρ v² A |CL|',
    meta: 'ρ 1.225 · A 2.1 m² · ms 2050 kg · 1257 kW · 43/57',
  },
  control: {
    /** Cap. 3 — state machine (UI copy; engine may differ — see handoff) */
    title: 'Mașină de stări',
    body: 'DRS: AOA 0°, splitter OPEN, v>110, accel>70%. AEROBRAKE la frână >40%. MAXP aliniază CoP peste CoG.',
  },
  dynamics: {
    /** Cap. 4 — Nürburgring DIL */
    title: 'Nürburgring GP',
    body: 'MaxP față de pasiv nou — VI-Grade Human DIL.',
    secondary: '−5.76 s față de configurația originală',
  },
  piRom: {
    /** Cap. 5 */
    title: 'PI-ROM',
    body: 'Profil subțire + rețea reziduală — inferență sub milisecundă față de XFOIL.',
    meta: 'CL MAE 0.0298 · R² 0.9959',
  },
} as const
