import { motion } from 'framer-motion'
import { CONTROL_LOOP_HZ, COP, LAP_TIME, PI_ROM, VEHICLE } from '@/data/vehicleConstants'
import { PAPER_CITATIONS } from '@/data/papers'
import { PI_ROM_METADATA } from '@/data/piRom'
import { useAeroStore } from '@/store'
import type { ChapterId } from '@/scene'
import { ControlDashboard } from '../ControlDashboard'

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
}

export function ChapterContent({ id }: { id: ChapterId }) {
  switch (id) {
    case 'hero':
      return <HeroChapter />
    case 'physics':
      return <PhysicsChapter />
    case 'control':
      return <ControlChapter />
    case 'dynamics':
      return <DynamicsChapter />
    case 'pi-rom':
      return <PiRomChapter />
    default:
      return null
  }
}

/** Chapter 1 — brand-forward hero, no cards in first viewport. */
function HeroChapter() {
  return (
    <div className="pointer-events-none flex min-h-[100dvh] flex-col justify-end px-6 pb-20 md:px-14 md:pb-24">
      <motion.div {...fadeUp} className="max-w-3xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-mono text-[11px] tracking-[0.28em] text-aero-cyan uppercase"
        >
          System online · {CONTROL_LOOP_HZ} Hz control loop
        </motion.p>
        <h1 className="font-display mt-4 text-4xl leading-[0.95] font-extrabold tracking-tight text-aero-text sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block text-aero-cyan">ASTON MARTIN</span>
          <span className="block">VALHALLA</span>
        </h1>
        <p className="font-display mt-4 max-w-xl text-lg font-medium tracking-wide text-aero-muted sm:text-xl">
          Active Aerodynamics &amp; Control
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
          Wind-tunnel scrollytelling of integrated active aero — wing, splitter,
          and real-time force telemetry.
        </p>
      </motion.div>
    </div>
  )
}

function PhysicsChapter() {
  const copRearPct = useAeroStore((s) => s.copRearPct)
  const dragN = useAeroStore((s) => s.dragN)
  const downforceN = useAeroStore((s) => s.downforceN)
  const cd = useAeroStore((s) => s.cd)
  const cl = useAeroStore((s) => s.cl)
  const aoaDeg = useAeroStore((s) => s.aoaDeg)
  const cogRear = VEHICLE.massDistributionRearPct

  return (
    <div className="pointer-events-none flex min-h-[100dvh] items-end px-6 pb-16 md:px-12">
      <motion.div {...fadeUp} className="pointer-events-auto w-full max-w-xl space-y-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-aero-cyan uppercase">
            Chapter 2
          </p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Aerodynamic physics &amp; aero-balance
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-aero-muted">
            Live forces from paper-exact equations. Center of pressure vs center of
            gravity as the wing angle changes.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <FormulaCard
            title="Drag"
            latex="F_D = ½ ρ v² A C_D"
            detail={`ρ=${VEHICLE.airDensityKgPerM3} · A=${VEHICLE.frontalAreaM2} m² · C_D=${cd.toFixed(2)}`}
            result={`${dragN.toFixed(0)} N`}
          />
          <FormulaCard
            title="Downforce"
            latex="F_L = ½ ρ v² A |C_L|"
            detail={`C_L=${cl.toFixed(2)}`}
            result={`${downforceN.toFixed(0)} N`}
          />
        </div>

        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-wider text-aero-muted uppercase">
              CoP vs CoG (rear %)
            </span>
            <span className="font-mono text-[10px] text-aero-cyan">
              AOA {aoaDeg.toFixed(1)}°
            </span>
          </div>
          <p className="mt-1 font-mono text-[11px] text-aero-muted">
            CoP_rear% = {COP.baselineRearPct}% + (AOA/{COP.aoaSpanDeg}° × {COP.aoaGainPct}%)
          </p>
          <div className="relative mt-4 h-3 rounded-full bg-slate-800">
            <div
              className="absolute top-0 h-3 w-0.5 bg-aero-emerald"
              style={{ left: `${cogRear}%` }}
              title={`CoG ${cogRear}%`}
            />
            <motion.div
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aero-cyan shadow-[0_0_12px_#22d3ee]"
              animate={{ left: `${copRearPct}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 18 }}
            />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px]">
            <span className="text-aero-cyan">CoP {copRearPct.toFixed(1)}%</span>
            <span className="text-aero-emerald">CoG {cogRear}% rear</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ControlChapter() {
  return (
    <div className="flex min-h-[100dvh] items-end px-6 pb-16 md:px-12">
      <div className="w-full max-w-lg">
        <ControlDashboard />
      </div>
    </div>
  )
}

function DynamicsChapter() {
  return (
    <div className="pointer-events-none flex min-h-[100dvh] items-end px-6 pb-16 md:px-12">
      <motion.div {...fadeUp} className="pointer-events-auto max-w-lg">
        <p className="font-mono text-[10px] tracking-[0.2em] text-aero-cyan uppercase">
          Chapter 4 · Nürburgring GP
        </p>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          14-DOF dynamics &amp; lap-time
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-aero-muted">
          VI-Grade DIL comparison of MaxP active aero versus passive baseline on
          the Nürburgring GP layout.
        </p>

        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="glass-panel mt-6 rounded-xl p-6 text-center"
        >
          <p className="font-mono text-[10px] tracking-[0.2em] text-aero-amber uppercase">
            MaxP vs passive
          </p>
          <p className="font-display mt-2 text-5xl font-extrabold tracking-tight text-aero-emerald md:text-6xl">
            {LAP_TIME.maxPVsPassiveDeltaS.toFixed(2)} s
          </p>
          <p className="mt-2 text-sm text-aero-muted">
            Lap-time delta (VI-Grade DIL) — master-spec ground truth
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

function PiRomChapter() {
  return (
    <div className="pointer-events-none flex min-h-[100dvh] items-end px-6 pb-20 md:px-12">
      <motion.div {...fadeUp} className="pointer-events-auto w-full max-w-2xl">
        <p className="font-mono text-[10px] tracking-[0.2em] text-aero-cyan uppercase">
          Chapter 5 · Technical matrix
        </p>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          PI-ROM neural engine
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-aero-muted">
          {PI_ROM_METADATA.summary} Bibliographic titles beyond named labels are
          deferred — no invented citations.
        </p>

        <div className="glass-panel mt-4 inline-flex items-baseline gap-2 rounded-lg px-4 py-2">
          <span className="font-display text-3xl font-bold text-aero-cyan">
            {PI_ROM.speedupFactor}×
          </span>
          <span className="font-mono text-[11px] text-aero-muted">
            speedup · &lt; {PI_ROM.inferenceBudgetMs} ms
          </span>
        </div>

        <div className="glass-panel mt-5 overflow-hidden rounded-xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-aero-border font-mono text-[10px] tracking-wider text-aero-muted uppercase">
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">ID</th>
                <th className="px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {PAPER_CITATIONS.map((p) => (
                <tr key={p.id} className="border-b border-aero-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-aero-text">
                    {p.primaryLabel}
                  </td>
                  <td className="hidden px-4 py-3 font-mono text-[11px] text-aero-muted sm:table-cell">
                    {p.documentId ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-aero-muted">{p.roleInApp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

function FormulaCard({
  title,
  latex,
  detail,
  result,
}: {
  title: string
  latex: string
  detail: string
  result: string
}) {
  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="font-mono text-[9px] tracking-wider text-aero-muted uppercase">
        {title}
      </div>
      <div className="mt-1 font-mono text-xs text-aero-cyan">{latex}</div>
      <div className="mt-1 font-mono text-[10px] text-aero-muted">{detail}</div>
      <div className="font-display mt-2 text-xl font-semibold text-aero-text tabular-nums">
        {result}
      </div>
    </div>
  )
}
