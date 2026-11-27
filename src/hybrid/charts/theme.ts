/** AM chart theme — dark field, racing-green whisper on active series. */
export const CHART_THEME = {
  bg: 'transparent',
  axis: 'rgb(139 146 154 / 0.55)',
  axisLabel: 'rgb(139 146 154 / 0.85)',
  grid: 'rgb(232 228 220 / 0.08)',
  zero: 'rgb(232 228 220 / 0.28)',
  text: '#f2f0ea',
  mist: '#8b929a',
  /** Neutral series (Original / Virtual / Passive). */
  seriesNeutral: 'rgb(139 146 154 / 0.72)',
  /** Active / New / MaxP — racing green. */
  seriesActive: '#005949',
  seriesActiveBright: '#0a7a62',
  /** Secondary accent (lime whisper — rare). */
  accent: '#c4df00',
  industrial: '#8b929a',
  fontUi: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',
} as const

export const SERIES_COLORS = [
  CHART_THEME.seriesNeutral,
  CHART_THEME.seriesActive,
  CHART_THEME.seriesActiveBright,
  'rgb(232 228 220 / 0.45)',
] as const
