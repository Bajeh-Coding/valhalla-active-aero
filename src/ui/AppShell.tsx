import { useAeroStore } from '@/store'

/**
 * Minimal boot shell — dark #020617 background, status badge only.
 * Full scrollytelling chapters land in Phase 4.
 */
export function AppShell() {
  const mode = useAeroStore((s) => s.mode)
  const aoaDeg = useAeroStore((s) => s.aoaDeg)
  const splitter = useAeroStore((s) => s.splitter)
  const controlLoopHz = useAeroStore((s) => s.controlLoopHz)

  return (
    <div className="min-h-dvh bg-aero-bg text-aero-text">
      <header className="border-b border-aero-border bg-aero-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-aero-cyan uppercase">
              System online · {controlLoopHz} Hz control loop
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-aero-text sm:text-3xl">
              Aston Martin Valhalla
            </h1>
            <p className="mt-1 text-sm text-aero-muted">
              Active Aerodynamics &amp; Control — architecture shell (Phase 1)
            </p>
          </div>
          <div className="font-mono text-xs text-aero-muted sm:text-right">
            <div>
              Mode{' '}
              <span className="text-aero-emerald">{mode}</span>
            </div>
            <div>
              AOA <span className="text-aero-cyan">{aoaDeg.toFixed(1)}°</span>
              {' · '}
              Splitter <span className="text-aero-amber">{splitter}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="rounded-lg border border-aero-border bg-aero-panel p-6 backdrop-blur-md">
          <h2 className="text-sm font-medium tracking-wide text-aero-cyan uppercase">
            Phase 1 scaffold
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-aero-muted">
            Data model, Zustand store, and theme tokens are online. Math engine,
            3D wind tunnel, and scrollytelling chapters arrive in later phases.
          </p>
        </section>
      </main>
    </div>
  )
}
