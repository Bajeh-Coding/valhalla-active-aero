import { motion } from 'framer-motion'
import {
  Activity,
  BookOpen,
  Gauge,
  Timer,
  Wind,
  Zap,
} from 'lucide-react'
import { CONTROL_LOOP_HZ, COP, LAP_TIME, PI_ROM, VEHICLE } from '@/data/vehicleConstants'
import { PAPER_CITATIONS } from '@/data/papers'
import { PI_ROM_METADATA } from '@/data/piRom'
import { useAeroStore } from '@/store'
import type { ChapterId } from '@/scene'
import { cn } from '@/lib/utils'
import { BorderBeam, GlassCard } from '@/ui/primitives'
import { ControlDashboard } from '../ControlDashboard'

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
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

/** Chapter 1 — Spline hero + luxury title + 50 Hz badge. */
function HeroChapter() {
  return (
    <div className="pointer-events-none flex min-h-[100dvh] flex-col justify-end px-6 pb-20 md:px-16 md:pb-28">
      <motion.div {...fadeUp} className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.15, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="luxury-rule mb-8 w-40 origin-left"
        />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9 }}
          className="inline-flex items-center gap-2 rounded-full border border-aero-cyan/30 bg-slate-950/50 px-3 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-aero-cyan opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-aero-cyan" />
          </span>
          <p className="font-mono text-[10px] tracking-[0.35em] text-aero-cyan uppercase">
            System online · {CONTROL_LOOP_HZ} Hz
          </p>
        </motion.div>
        <h1 className="font-display mt-5 text-[2.75rem] leading-[0.92] font-semibold tracking-[0.04em] text-aero-text sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="block text-aero-champagne">ASTON MARTIN</span>
          <span className="mt-1 block bg-gradient-to-r from-aero-lime via-aero-champagne to-aero-cyan bg-clip-text text-transparent">
            VALHALLA
          </span>
        </h1>
        <p className="font-serif mt-6 max-w-xl text-xl font-medium tracking-wide text-aero-champagne/90 italic sm:text-2xl">
          Active Aerodynamics &amp; Control
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-aero-muted">
          Interactive 3D wind-tunnel journey — orbit the hypercar, follow cyan
          airflow, and command paper-exact mecatronic force.
        </p>
      </motion.div>
    </div>
  )
}

/** Chapter 2 — side-aero + CoP/CoG glass metrics. */
function PhysicsChapter() {
  const copRearPct = useAeroStore((s) => s.copRearPct)
  const dragN = useAeroStore((s) => s.dragN)
  const downforceN = useAeroStore((s) => s.downforceN)
  const cd = useAeroStore((s) => s.cd)
  const cl = useAeroStore((s) => s.cl)
  const aoaDeg = useAeroStore((s) => s.aoaDeg)
  const cogRear = VEHICLE.massDistributionRearPct

  return (
    <div className="pointer-events-none flex min-h-[100dvh] items-end px-6 pb-16 md:px-14">
      <motion.div {...fadeUp} className="pointer-events-auto w-full max-w-xl space-y-5">
        <div>
          <p className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] text-aero-lime uppercase">
            <Wind className="size-3.5" aria-hidden />
            Chapter 02 · Side aero
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-[0.03em] sm:text-4xl">
            Aerodynamic physics &amp; aero-balance
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-aero-muted">
            Live F_L / F_D vectors on the side profile. Center of pressure versus
            center of gravity as wing angle changes.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <FormulaCard
            title="Drag"
            latex="F_D = ½ ρ v² A C_D"
            detail={`ρ=${VEHICLE.airDensityKgPerM3} · A=${VEHICLE.frontalAreaM2} m² · C_D=${cd.toFixed(2)}`}
            result={`${dragN.toFixed(0)} N`}
            accent="crimson"
          />
          <FormulaCard
            title="Downforce"
            latex="F_L = ½ ρ v² A |C_L|"
            detail={`C_L=${cl.toFixed(2)}`}
            result={`${downforceN.toFixed(0)} N`}
            accent="cyan"
          />
        </div>

        <GlassCard variant="spotlight" className="relative overflow-hidden p-5">
          <BorderBeam duration={10} />
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-aero-muted uppercase">
              <Gauge className="size-3" aria-hidden />
              CoP vs CoG (rear %)
            </span>
            <span className="font-mono text-[10px] text-aero-cyan">
              AOA {aoaDeg.toFixed(1)}°
            </span>
          </div>
          <p className="mt-2 font-mono text-[11px] text-aero-muted">
            CoP_rear% = {COP.baselineRearPct}% + (AOA/{COP.aoaSpanDeg}° × {COP.aoaGainPct}%)
          </p>
          <div className="relative mt-5 h-2 rounded-full bg-aero-bg-deep/80">
            <div
              className="absolute top-0 h-2 w-0.5 bg-aero-lime"
              style={{ left: `${cogRear}%` }}
              title={`CoG ${cogRear}%`}
            />
            <motion.div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aero-cyan shadow-[0_0_16px_#00F0FF]"
              animate={{ left: `${copRearPct}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 18 }}
            />
          </div>
          <div className="mt-3 flex justify-between font-mono text-[10px]">
            <span className="text-aero-cyan">CoP {copRearPct.toFixed(1)}%</span>
            <span className="text-aero-lime">CoG {cogRear}% rear</span>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}

/** Chapter 3 — pinned wind-tunnel controls over Spline. */
function ControlChapter() {
  return (
    <div className="flex min-h-[100dvh] items-end px-6 pb-16 md:items-center md:justify-end md:px-14 md:pb-0">
      <div className="w-full max-w-lg">
        <ControlDashboard />
      </div>
    </div>
  )
}

/** Chapter 4 — track + −2.55 s lap delta. */
function DynamicsChapter() {
  return (
    <div className="pointer-events-none flex min-h-[100dvh] items-end px-6 pb-16 md:px-14">
      <motion.div {...fadeUp} className="pointer-events-auto max-w-lg">
        <p className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] text-aero-lime uppercase">
          <Timer className="size-3.5" aria-hidden />
          Chapter 04 · Nürburgring GP
        </p>
        <h2 className="font-display mt-2 text-3xl font-semibold tracking-[0.03em] sm:text-4xl">
          14-DOF dynamics &amp; lap-time
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-aero-muted">
          VI-Grade DIL comparison of MaxP active aero versus passive baseline on
          the Nürburgring GP layout.
        </p>

        <GlassCard
          variant="strong"
          className="relative mt-7 overflow-hidden p-8 text-center"
          initial={{ scale: 0.96, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.65 }}
        >
          <BorderBeam duration={7} colorFrom="#C4DF00" colorTo="#00F0FF" />
          <p className="font-mono text-[10px] tracking-[0.28em] text-aero-muted uppercase">
            MaxP vs passive
          </p>
          <p className="font-display mt-3 text-6xl font-semibold tracking-tight text-aero-lime md:text-7xl">
            {LAP_TIME.maxPVsPassiveDeltaS.toFixed(2)} s
          </p>
          <div className="luxury-rule mx-auto mt-5 w-24" />
          <p className="mt-4 font-serif text-base text-aero-champagne/80 italic">
            Lap-time delta — VI-Grade DIL ground truth
          </p>
        </GlassCard>
      </motion.div>
    </div>
  )
}

/** Chapter 5 — neural overlay + 4-paper matrix. */
function PiRomChapter() {
  return (
    <div className="pointer-events-none flex min-h-[100dvh] items-end px-6 pb-24 md:px-14">
      <motion.div {...fadeUp} className="pointer-events-auto w-full max-w-2xl">
        <p className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] text-aero-lime uppercase">
          <BookOpen className="size-3.5" aria-hidden />
          Chapter 05 · Technical matrix
        </p>
        <h2 className="font-display mt-2 text-3xl font-semibold tracking-[0.03em] sm:text-4xl">
          PI-ROM neural engine
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-aero-muted">
          {PI_ROM_METADATA.summary} Bibliographic titles beyond named labels are
          deferred — no invented citations.
        </p>

        <GlassCard
          variant="spotlight"
          className="mt-5 inline-flex items-baseline gap-3 px-5 py-3"
          hoverLift
        >
          <Zap className="size-5 text-aero-cyan" aria-hidden />
          <span className="font-display text-4xl font-semibold text-aero-cyan">
            {PI_ROM.speedupFactor}×
          </span>
          <span className="font-mono text-[11px] text-aero-muted">
            speedup · &lt; {PI_ROM.inferenceBudgetMs} ms
          </span>
        </GlassCard>

        <GlassCard variant="soft" className="relative mt-6 overflow-hidden">
          <BorderBeam duration={12} />
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[10px] tracking-wider text-aero-muted uppercase">
                <th className="px-4 py-3.5 font-medium">Source</th>
                <th className="hidden px-4 py-3.5 font-medium sm:table-cell">ID</th>
                <th className="px-4 py-3.5 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {PAPER_CITATIONS.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 transition-colors last:border-0 hover:bg-aero-amr/10"
                >
                  <td className="px-4 py-3.5 font-medium text-aero-text">
                    {p.primaryLabel}
                  </td>
                  <td className="hidden px-4 py-3.5 font-mono text-[11px] text-aero-muted sm:table-cell">
                    {p.documentId ?? '—'}
                  </td>
                  <td className="px-4 py-3.5 text-aero-muted">{p.roleInApp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </motion.div>
    </div>
  )
}

function FormulaCard({
  title,
  latex,
  detail,
  result,
  accent,
}: {
  title: string
  latex: string
  detail: string
  result: string
  accent: 'cyan' | 'crimson'
}) {
  return (
    <GlassCard variant="soft" hoverLift className="relative overflow-hidden p-4">
      <BorderBeam
        duration={9}
        colorFrom={accent === 'cyan' ? '#00F0FF' : '#FF3B30'}
        colorTo={accent === 'cyan' ? '#C4DF00' : '#FF3B30'}
      />
      <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider text-aero-muted uppercase">
        <Activity className="size-3 opacity-70" aria-hidden />
        {title}
      </div>
      <div
        className={cn(
          'mt-1.5 font-mono text-xs',
          accent === 'cyan' ? 'text-aero-cyan' : 'text-aero-crimson',
        )}
      >
        {latex}
      </div>
      <div className="mt-1 font-mono text-[10px] text-aero-muted">{detail}</div>
      <div
        className={cn(
          'font-display mt-3 text-xl font-semibold tabular-nums',
          accent === 'cyan' ? 'text-aero-cyan' : 'text-aero-crimson',
        )}
      >
        {result}
      </div>
    </GlassCard>
  )
}
