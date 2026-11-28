import { useCallback, useEffect, useRef, useState } from 'react'

type Phase = 'idle' | 'buttonOut' | 'logoIn' | 'hold' | 'exit'

interface BootSplashProps {
  /** Called when the site should begin fading in (start of exit crossfade). */
  onReveal: () => void
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * First-load / hard-refresh gate: black void → Start → white AM logo → site.
 * Self-contained App-shell overlay — does not touch chapter/mockup trees.
 */
export function BootSplash({ onReveal }: BootSplashProps) {
  const [phase, setPhase] = useState<Phase | 'gone'>('idle')
  const timers = useRef<number[]>([])
  const revealed = useRef(false)

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }, [])

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
  }, [])

  const reveal = useCallback(() => {
    if (revealed.current) return
    revealed.current = true
    onReveal()
  }, [onReveal])

  useEffect(() => () => clearTimers(), [clearTimers])

  const start = useCallback(() => {
    if (phase !== 'idle') return

    if (prefersReducedMotion()) {
      reveal()
      setPhase('gone')
      return
    }

    setPhase('buttonOut')
    schedule(() => setPhase('logoIn'), 700)
    schedule(() => setPhase('hold'), 700 + 1100)
    schedule(() => {
      setPhase('exit')
      reveal()
    }, 700 + 1100 + 900)
    schedule(() => setPhase('gone'), 700 + 1100 + 900 + 900)
  }, [phase, reveal, schedule])

  if (phase === 'gone') return null

  const buttonVisible = phase === 'idle'
  const logoVisible = phase === 'logoIn' || phase === 'hold'
  const overlayOpaque = phase !== 'exit'

  return (
    <div
      data-testid="boot-splash"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      style={{
        opacity: overlayOpaque ? 1 : 0,
        transition: 'opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)',
        pointerEvents: phase === 'exit' ? 'none' : 'auto',
      }}
      aria-hidden={phase === 'exit'}
    >
      <button
        type="button"
        data-testid="boot-splash-start"
        onClick={start}
        className="font-ui absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[2px] border border-white/35 bg-transparent px-10 py-3.5 text-[13px] tracking-[0.35em] text-white uppercase transition-[opacity,border-color,background-color] duration-700 ease-out hover:border-white/70 hover:bg-white/5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50"
        style={{
          opacity: buttonVisible ? 1 : 0,
          pointerEvents: buttonVisible ? 'auto' : 'none',
        }}
        tabIndex={buttonVisible ? 0 : -1}
      >
        Start
      </button>

      <img
        data-testid="boot-splash-logo"
        src="/images/brand/am-logo-white.svg"
        alt="Aston Martin"
        width={280}
        height={64}
        draggable={false}
        className="pointer-events-none absolute left-1/2 top-1/2 w-[min(72vw,280px)] -translate-x-1/2 -translate-y-1/2 select-none"
        style={{
          opacity: logoVisible ? 1 : 0,
          transition: 'opacity 1100ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  )
}
