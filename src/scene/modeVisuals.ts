import type { AeroMode } from '@/types/aero'

/**
 * Mode color language — AMR brand system.
 * DRS cyan · MAXP lime · AEROBRAKE crimson · STANDARD titanium.
 */
export const MODE_COLORS: Record<
  AeroMode,
  { primary: string; secondary: string; emissive: string }
> = {
  DRS: {
    primary: '#00F0FF',
    secondary: '#67e8f9',
    emissive: '#0891b2',
  },
  STANDARD: {
    primary: '#94a3b8',
    secondary: '#cbd5e1',
    emissive: '#475569',
  },
  MAXP: {
    primary: '#C4DF00',
    secondary: '#e8f56a',
    emissive: '#005949',
  },
  AEROBRAKE: {
    primary: '#FF3B30',
    secondary: '#ff6b63',
    emissive: '#991b1b',
  },
}

/**
 * Streamline pressure tint from C_D (low drag → cyan, high stagnation → crimson).
 * Uses only coefficient magnitude — no invented physics.
 */
export function pressureColorFromCd(cd: number): string {
  // Spec range: DRS 0.31 … AEROBRAKE 0.72
  const t = Math.min(1, Math.max(0, (cd - 0.31) / (0.72 - 0.31)))
  if (t < 0.33) {
    return lerpHex('#00F0FF', '#005949', t / 0.33)
  }
  if (t < 0.66) {
    return lerpHex('#005949', '#C4DF00', (t - 0.33) / 0.33)
  }
  return lerpHex('#C4DF00', '#FF3B30', (t - 0.66) / 0.34)
}

/** Direct mode streamline accent — DRS cyan / MAXP lime / AEROBRAKE crimson. */
export function streamlineColorForMode(mode: AeroMode): string {
  return MODE_COLORS[mode].primary
}

function lerpHex(a: string, b: string, t: number): string {
  const ca = hexToRgb(a)
  const cb = hexToRgb(b)
  const r = Math.round(ca.r + (cb.r - ca.r) * t)
  const g = Math.round(ca.g + (cb.g - ca.g) * t)
  const bl = Math.round(ca.b + (cb.b - ca.b) * t)
  return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.slice(1), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}
