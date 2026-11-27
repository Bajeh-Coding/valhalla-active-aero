import { useState } from 'react'
import { cn } from '@/lib/utils'

type SketchMode = 'STANDARD' | 'DRS' | 'AEROBRAKE'

/**
 * Selective actuator visualization — SVG, not WebGL toy.
 * States from S1-F020 / F021 / F032 / F040.
 */
export function ActuatorSketch() {
  const [mode, setMode] = useState<SketchMode>('STANDARD')

  const aoa =
    mode === 'DRS' ? 0 : mode === 'AEROBRAKE' ? 19 : 6
  const splitterOpen = mode === 'DRS'
  const wingRotate = -aoa * 0.9

  return (
    <div
      className="mt-8 max-w-lg border-t border-aero-signal/15 pt-6"
      data-testid="actuator-sketch"
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {(['STANDARD', 'DRS', 'AEROBRAKE'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'font-ui px-3 py-1 text-[11px] tracking-[0.14em] uppercase transition-colors',
              mode === m
                ? 'bg-aero-amr text-aero-ivory'
                : 'text-aero-mist hover:text-aero-ivory',
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 440 140" className="w-full" fill="none">
        {/* Body */}
        <path
          d="M40 78 C80 58, 120 50, 200 52 C280 54, 340 62, 400 78 L390 92 C330 84, 260 80, 200 80 C140 80, 80 86, 50 94 Z"
          stroke="#E8E4DC"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />

        {/* Splitter */}
        <g transform={`translate(70, 88) rotate(${splitterOpen ? -18 : 0})`}>
          <rect
            x="-28"
            y="-3"
            width="56"
            height="6"
            rx="1"
            fill={splitterOpen ? '#C4DF00' : '#005949'}
          />
        </g>
        <text x="42" y="118" fill="#8B929A" fontSize="10" fontFamily="monospace">
          Splitter {splitterOpen ? 'OPEN' : 'CLOSED'}
        </text>

        {/* Wing */}
        <g transform={`translate(360, 62) rotate(${wingRotate})`}>
          <rect
            x="-36"
            y="-4"
            width="72"
            height="8"
            rx="1"
            fill="#F2F0EA"
            fillOpacity="0.9"
          />
        </g>
        <text x="300" y="118" fill="#8B929A" fontSize="10" fontFamily="monospace">
          Wing AOA {aoa}°
        </text>
      </svg>

      <p className="font-ui mt-2 text-[10px] tracking-[0.16em] text-aero-mist/70 uppercase">
        S1-F020 · S1-F021 · S1-F032 · S1-F040 — schematic
      </p>
    </div>
  )
}
