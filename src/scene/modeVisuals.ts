import type { AeroMode } from '@/types/aero'

/** Mode color language — matches CSS tokens (cyan / emerald / amber). */
export const MODE_COLORS: Record<
  AeroMode,
  { primary: string; secondary: string; emissive: string }
> = {
  DRS: {
    primary: '#22d3ee',
    secondary: '#67e8f9',
    emissive: '#0891b2',
  },
  PASSIVE: {
    primary: '#94a3b8',
    secondary: '#cbd5e1',
    emissive: '#475569',
  },
  MAXP: {
    primary: '#34d399',
    secondary: '#6ee7b7',
    emissive: '#059669',
  },
  AEROBRAKE: {
    primary: '#fbbf24',
    secondary: '#f87171',
    emissive: '#b45309',
  },
}

/**
 * Streamline pressure tint from C_D (low drag → cyan, high stagnation → amber/red).
 * Uses only coefficient magnitude — no invented physics.
 */
export function pressureColorFromCd(cd: number): string {
  // Spec range: DRS 0.31 … AEROBRAKE 0.72
  const t = Math.min(1, Math.max(0, (cd - 0.31) / (0.72 - 0.31)))
  if (t < 0.5) {
    return lerpHex('#22d3ee', '#34d399', t * 2)
  }
  return lerpHex('#fbbf24', '#f87171', (t - 0.5) * 2)
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
