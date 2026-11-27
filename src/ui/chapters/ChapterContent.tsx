import { motion } from 'framer-motion'
import { LAP_TIME, VEHICLE } from '@/data/vehicleConstants'
import { PI_ROM } from '@/data/piRom'
import { PRESENTATION_COPY as COPY } from '@/data/presentationCopy'
import { useAeroStore } from '@/store'
import type { ChapterId } from '@/scene'
import { ControlDashboard } from '../ControlDashboard'

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] as const },
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

/** Cap. 1 — brand + un rând științific + scroll. */
function HeroChapter() {
  return (
    <div className="pointer-events-none relative flex min-h-[100dvh] flex-col justify-end px-6 pb-16 md:px-16 md:pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl"
      >
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.9] font-semibold tracking-[0.06em] text-aero-text"
        >
          <span className="block text-aero-champagne/95">ASTON MARTIN</span>
          <span className="mt-1 block text-aero-lime">VALHALLA</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 1.0 }}
          className="font-serif mt-6 max-w-lg text-lg tracking-wide text-aero-champagne/75 italic md:text-xl"
        >
          {COPY.hero.line}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.0 }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-10"
        aria-hidden
      >
        <span className="font-mono text-[9px] tracking-[0.4em] text-aero-muted/70 uppercase">
          {COPY.hero.scroll}
        </span>
        <span className="luxury-pulse block h-8 w-px bg-gradient-to-b from-aero-lime/70 to-transparent" />
      </motion.div>
    </div>
  )
}

/** Cap. 1.2 — balance aero (S1-F013); CoP invent removed. */
function PhysicsChapter() {
  const balanceFront = useAeroStore((s) => s.balanceFront)
  const cogRear = VEHICLE.massDistributionRearPct
  const balPct = balanceFront != null ? balanceFront * 100 : null

  return (
    <div className="pointer-events-none flex min-h-[100dvh] items-end px-6 pb-20 md:px-16 md:pb-28">
      <motion.div {...fade} className="max-w-lg">
        <h2 className="font-display text-3xl font-semibold tracking-[0.04em] text-aero-text md:text-5xl">
          {COPY.physics.title}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-aero-muted md:text-base">
          {COPY.physics.body}
        </p>
        <p className="mt-6 font-mono text-[11px] tracking-wide text-aero-champagne/70 md:text-xs">
          {COPY.physics.equation}
        </p>
        <p className="mt-2 font-mono text-[10px] tracking-wider text-aero-muted uppercase">
          {COPY.physics.meta}
        </p>
        <div className="mt-10 max-w-xs">
          <div className="relative h-px bg-white/10">
            <span
              className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-aero-lime/80"
              style={{ left: `${cogRear}%` }}
              title={`CoG rear ${cogRear.toFixed(1)}%`}
            />
            {balPct != null ? (
              <motion.span
                className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aero-champagne"
                animate={{ left: `${balPct}%` }}
                transition={{ type: 'spring', stiffness: 90, damping: 20 }}
              />
            ) : null}
          </div>
          <div className="mt-3 flex justify-between font-mono text-[10px] tracking-wider text-aero-muted uppercase">
            <span>
              Bal{' '}
              {balPct != null ? `${balPct.toFixed(1)}%` : '— (@160 km/h)'}
            </span>
            <span className="text-aero-lime/80">
              CoG {cogRear.toFixed(1)}%
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/** Cap. 3 — control interactiv. */
function ControlChapter() {
  return (
    <div className="flex min-h-[100dvh] items-end px-6 pb-16 md:items-center md:justify-end md:px-14 md:pb-0">
      <div className="w-full max-w-md">
        <ControlDashboard />
      </div>
    </div>
  )
}

/** Cap. 4 — delta tur. */
function DynamicsChapter() {
  return (
    <div className="pointer-events-none flex min-h-[100dvh] items-end px-6 pb-20 md:px-16 md:pb-28">
      <motion.div {...fade} className="max-w-lg">
        <h2 className="font-display text-3xl font-semibold tracking-[0.04em] md:text-5xl">
          {COPY.dynamics.title}
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-aero-muted md:text-base">
          {COPY.dynamics.body}
        </p>
        <p className="font-display mt-10 text-6xl font-semibold tracking-tight text-aero-lime md:text-8xl">
          {LAP_TIME.maxPVsPassiveDeltaS.toFixed(2)}
          <span className="ml-2 text-3xl text-aero-champagne/70 md:text-4xl">s</span>
        </p>
        <p className="mt-4 font-mono text-[11px] tracking-wide text-aero-muted">
          {COPY.dynamics.secondary}
        </p>
      </motion.div>
    </div>
  )
}

/** Cap. 5 — PI-ROM. */
function PiRomChapter() {
  return (
    <div className="pointer-events-none flex min-h-[100dvh] items-end px-6 pb-24 md:px-16 md:pb-32">
      <motion.div {...fade} className="max-w-lg">
        <h2 className="font-display text-3xl font-semibold tracking-[0.04em] md:text-5xl">
          {COPY.piRom.title}
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-aero-muted md:text-base">
          {COPY.piRom.body}
        </p>
        <p className="font-display mt-10 text-6xl font-semibold tracking-tight text-aero-champagne md:text-8xl">
          {PI_ROM.speedupFactor}
          <span className="text-aero-lime">×</span>
        </p>
        <p className="mt-4 font-mono text-[11px] tracking-wide text-aero-muted">
          {COPY.piRom.meta}
        </p>
      </motion.div>
    </div>
  )
}
