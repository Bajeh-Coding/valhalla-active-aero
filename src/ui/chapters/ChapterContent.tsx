import { motion } from 'framer-motion'
import { LAP_TIME, TABLE3_FORCES } from '@/data/vehicleConstants'
import { PAPER_CITATIONS } from '@/data/papers'
import { PRESENTATION_COPY as COPY } from '@/data/presentationCopy'
import type { ChapterId } from '@/scene'
import { ControlDashboard } from '../ControlDashboard'

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] as const },
}

const easeOut = [0.22, 1, 0.36, 1] as const

/**
 * Sparse typography shells A0–A5 — RO, one idea per act.
 * PhotoStage stays dominant; this layer is copy + A3 interaction only.
 */
export function ChapterContent({ id }: { id: ChapterId }) {
  switch (id) {
    case 'a0-hero':
      return <HeroChapter />
    case 'a1-limita':
      return <LimitaChapter />
    case 'a2-actuatoare':
      return <ActuatoareChapter />
    case 'a3-control':
      return <ControlChapter />
    case 'a4-rezultat':
      return <RezultatChapter />
    case 'a5-inchidere':
      return <InchidereChapter />
    default:
      return null
  }
}

/** A0 — brand + one headline + one sentence + scroll cue. No HUD/stats. */
function HeroChapter() {
  return (
    <div className="pointer-events-none relative flex min-h-[100dvh] flex-col justify-end px-[8%] pb-20 md:pb-28">
      <div className="max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 1.0, ease: easeOut }}
          className="font-ui text-[13px] tracking-[0.28em] text-aero-champagne/80 md:text-[15px]"
        >
          <span>{COPY.hero.brandLeft}</span>
          <span className="mx-3 text-aero-mist/50" aria-hidden>
            ·
          </span>
          <span>{COPY.hero.brandRight}</span>
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1.15, ease: easeOut }}
          className="font-display mt-7 text-[clamp(2.4rem,6.5vw,4.5rem)] leading-[1.05] font-medium tracking-[0.02em] text-aero-ivory"
        >
          {COPY.hero.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.0, ease: easeOut }}
          className="font-serif mt-5 max-w-md text-lg leading-relaxed text-aero-mist md:text-xl"
        >
          {COPY.hero.line}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15, duration: 0.9 }}
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-10"
        aria-hidden
      >
        <span className="font-ui text-[11px] tracking-[0.22em] text-aero-mist/65 lowercase">
          {COPY.hero.scroll}
        </span>
        <span className="luxury-pulse block h-7 w-px bg-gradient-to-b from-aero-amr/60 to-transparent" />
      </motion.div>
    </div>
  )
}

/** A1 — friction circle / Fz; one optional cited number (S2-F010). */
function LimitaChapter() {
  return (
    <div className="pointer-events-none flex min-h-[100dvh] items-end px-[8%] pb-20 md:pb-28">
      <motion.div {...fade} className="max-w-lg">
        <h2 className="font-display text-3xl font-medium tracking-[0.02em] text-aero-ivory md:text-5xl">
          {COPY.limita.title}
        </h2>
        <p className="font-serif mt-5 max-w-md text-lg leading-relaxed text-aero-mist md:text-xl">
          {COPY.limita.body}
        </p>
        <p className="mt-10 font-mono text-sm tracking-wide text-aero-champagne/85">
          <span className="block text-[10px] tracking-[0.2em] text-aero-mist/70 uppercase">
            {COPY.limita.keyLabel}
          </span>
          <span className="mt-2 block text-2xl text-aero-ivory md:text-3xl">
            {COPY.limita.keyValue}
          </span>
          <span className="mt-2 block text-[10px] tracking-[0.16em] text-aero-mist/55 uppercase">
            {COPY.limita.cite}
          </span>
        </p>
      </motion.div>
    </div>
  )
}

/** A2 — splitter + wing; one Table 3 number (S1-F011). */
function ActuatoareChapter() {
  const rear = TABLE3_FORCES
  return (
    <div
      className="pointer-events-none flex min-h-[100dvh] items-end px-[8%] pb-20 md:pb-28"
      data-testid="a2-actuatoare-shell"
    >
      <motion.div {...fade} className="max-w-lg">
        <h2 className="font-display text-3xl font-medium tracking-[0.02em] text-aero-ivory md:text-5xl">
          {COPY.actuatoare.title}
        </h2>
        <p className="font-serif mt-5 max-w-md text-lg leading-relaxed text-aero-mist md:text-xl">
          {COPY.actuatoare.body}
        </p>
        <p className="mt-10 font-mono text-sm tracking-wide text-aero-champagne/85">
          <span className="block text-[10px] tracking-[0.2em] text-aero-mist/70 uppercase">
            {COPY.actuatoare.keyLabel}
          </span>
          <span className="mt-2 block text-2xl text-aero-ivory md:text-3xl">
            {rear.original.rearDownforceN} → {rear.newPack.rearDownforceN} N
          </span>
          <span className="mt-2 block text-[10px] tracking-[0.16em] text-aero-mist/55 uppercase">
            {COPY.actuatoare.cite}
          </span>
        </p>
      </motion.div>
    </div>
  )
}

/** A3 — sole panel-like surface (interaction). */
function ControlChapter() {
  return (
    <div className="flex min-h-[100dvh] items-end px-[6%] pb-14 md:items-center md:justify-end md:px-14 md:pb-0">
      <div className="pointer-events-auto w-full max-w-md">
        <motion.p
          {...fade}
          className="font-display mb-5 max-w-sm text-2xl font-medium tracking-[0.02em] text-aero-ivory md:text-3xl"
        >
          {COPY.control.title}
        </motion.p>
        <p className="font-serif mb-6 max-w-sm text-base leading-relaxed text-aero-mist md:text-lg">
          {COPY.control.body}
        </p>
        <ControlDashboard />
      </div>
    </div>
  )
}

/** A4 — one large typographic delta (S1-F062). */
function RezultatChapter() {
  const delta = LAP_TIME.gripMaxPVsPassiveOriginalDeltaS
  return (
    <div className="pointer-events-none flex min-h-[100dvh] items-end px-[8%] pb-20 md:pb-28">
      <motion.div {...fade} className="max-w-lg">
        <h2 className="font-display text-3xl font-medium tracking-[0.02em] text-aero-ivory md:text-5xl">
          {COPY.rezultat.title}
        </h2>
        <p className="font-serif mt-5 max-w-sm text-lg leading-relaxed text-aero-mist md:text-xl">
          {COPY.rezultat.body}
        </p>
        <p className="font-display mt-12 text-6xl font-medium tracking-tight text-aero-ivory md:text-8xl">
          {delta.toFixed(3)}
          <span className="ml-2 text-3xl text-aero-mist md:text-4xl">s</span>
        </p>
        <p className="font-serif mt-5 text-base text-aero-mist md:text-lg">
          {COPY.rezultat.secondary}
        </p>
        <p className="mt-3 font-mono text-[10px] tracking-[0.16em] text-aero-mist/55 uppercase">
          {COPY.rezultat.cite}
        </p>
      </motion.div>
    </div>
  )
}

/** A5 — system close + short bibliography (S1 + S2 only). */
function InchidereChapter() {
  return (
    <div
      className="pointer-events-none flex min-h-[100dvh] items-end px-[8%] pb-24 md:pb-32"
      data-testid="a5-inchidere-shell"
    >
      <motion.div {...fade} className="max-w-xl">
        <h2 className="font-display text-3xl font-medium tracking-[0.02em] text-aero-ivory md:text-5xl">
          {COPY.inchidere.title}
        </h2>
        <p className="font-serif mt-5 max-w-md text-lg leading-relaxed text-aero-mist md:text-xl">
          {COPY.inchidere.body}
        </p>
        <p className="mt-10 font-mono text-sm tracking-wide text-aero-champagne/85">
          <span className="block text-[10px] tracking-[0.2em] text-aero-mist/70 uppercase">
            {COPY.inchidere.keyLabel}
          </span>
          <span className="mt-2 block text-2xl text-aero-ivory md:text-3xl">
            {COPY.inchidere.keyValue}
          </span>
          <span className="mt-2 block text-[10px] tracking-[0.16em] text-aero-mist/55 uppercase">
            {COPY.inchidere.cite}
          </span>
        </p>

        <ul className="mt-14 space-y-4 border-t border-aero-signal/15 pt-8">
          {PAPER_CITATIONS.map((p) => (
            <li key={p.id} className="max-w-md">
              <p className="font-ui text-[11px] tracking-[0.14em] text-aero-champagne/75 uppercase">
                {p.primaryLabel}
              </p>
              <p className="font-serif mt-1 text-sm leading-snug text-aero-mist">
                {p.title}
              </p>
            </li>
          ))}
        </ul>

        <p className="font-ui mt-10 text-[11px] tracking-[0.18em] text-aero-mist/50 uppercase">
          Aston Martin Valhalla — prezentare brand; model CFD = Vantage 2019 (S1)
        </p>
      </motion.div>
    </div>
  )
}
