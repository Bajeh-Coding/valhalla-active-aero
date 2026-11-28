import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'
import { VALHALLA_ASSETS } from '../assets'
import { AmChart } from '../charts/AmChart'
import type { HybridBeat } from '../data/chapters'
import { ControlDemo } from './ControlDemo'
import { CopCogDiagram } from './CopCogDiagram'
import { CosimDiagram, StateMachineDiagram } from './CosimDiagram'
import { FirewallBanner } from './FirewallBanner'
import { SpeedScrub } from './SpeedScrub'

interface BeatViewportProps {
  beat: HybridBeat
  index: number
  isActive: boolean
}

export function BeatViewport({ beat, index, isActive }: BeatViewportProps) {
  const rootRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const [scrub, setScrub] = useState(120)
  const [gripToggle, setGripToggle] = useState<'table5' | 'table4'>('table5')
  const asset = beat.photo ? VALHALLA_ASSETS[beat.photo] : null
  const isTitle = beat.id === 'title'
  const lab = beat.tone === 'lab' || beat.tone === 'void'
  const chartPrimary = Boolean(beat.chart)

  useEffect(() => {
    const copy = copyRef.current
    if (!copy || !isActive) return
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nodes = copy.querySelectorAll('[data-fade]')
    if (reduced) {
      gsap.set(nodes, { opacity: 1, y: 0 })
      return
    }
    gsap.fromTo(
      nodes,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 1.05,
        stagger: 0.1,
        ease: 'power2.out',
        overwrite: true,
      },
    )
  }, [isActive, beat.id])

  const primaryChart =
    beat.interactive === 'toggle-grip'
      ? gripToggle === 'table5'
        ? beat.chart
        : beat.chartB
      : beat.chart

  return (
    <section
      ref={rootRef}
      id={`beat-${beat.id}`}
      data-testid={`beat-${beat.id}`}
      data-beat-index={index}
      data-chapter={beat.chapter}
      aria-label={beat.rail}
      className="relative flex min-h-[100svh] w-full items-end md:items-center"
    >
      {/* Atmosphere photo — heavily graded when charts argue */}
      {asset ? (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <img
            src={asset.src}
            alt=""
            className={cn(
              'h-full w-full object-cover transition-transform duration-[1.6s] ease-out',
              isActive ? 'scale-100' : 'scale-[1.05]',
              chartPrimary || lab ? 'opacity-35' : 'opacity-100',
            )}
            style={{ objectPosition: asset.objectPosition }}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
          <div
            className={cn(
              'absolute inset-0',
              lab || chartPrimary
                ? 'bg-[linear-gradient(115deg,rgb(5_7_10/0.96)_0%,rgb(5_7_10/0.9)_48%,rgb(5_7_10/0.82)_100%)]'
                : 'bg-[linear-gradient(105deg,rgb(5_7_10/0.72)_0%,rgb(5_7_10/0.4)_50%,rgb(5_7_10/0.68)_100%)]',
            )}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(5_7_10/0.55)_100%)]" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-aero-void" />
      )}

      <div
        ref={copyRef}
        className={cn(
          'relative z-10 w-full px-6 pb-16 pt-24 md:px-12 md:pb-20 lg:px-20',
          chartPrimary || beat.visual === 'gallery'
            ? 'max-w-6xl'
            : 'max-w-3xl',
        )}
      >
        {beat.industrial ? (
          <div data-fade className="mb-6">
            <FirewallBanner />
          </div>
        ) : null}

        {beat.eyebrow ? (
          <p
            data-fade
            className="font-ui mb-4 text-[11px] tracking-[0.32em] text-aero-amr uppercase"
          >
            {beat.eyebrow}
          </p>
        ) : null}

        {isTitle ? (
          <p
            data-fade
            className="font-display mb-6 text-[clamp(1.4rem,3.4vw,2.5rem)] leading-[1.12] font-medium tracking-[0.14em] text-aero-ivory uppercase"
          >
            Aston Martin
            <br />
            Valhalla
          </p>
        ) : null}

        <h1
          data-fade
          className={cn(
            'font-display whitespace-pre-line text-aero-ivory',
            isTitle
              ? 'text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.98] font-medium tracking-[-0.01em]'
              : 'text-[clamp(2.1rem,5vw,3.75rem)] leading-[1.05] font-medium',
          )}
        >
          {beat.headline}
        </h1>

        <p
          data-fade
          className="font-serif mt-5 max-w-2xl text-[clamp(1.05rem,2vw,1.35rem)] leading-relaxed text-aero-mist"
        >
          {beat.sub}
        </p>

        {beat.figure ? (
          <div
            data-fade
            className={cn('mt-8', chartPrimary && 'mt-6')}
            data-testid={`figure-${beat.id}`}
          >
            <p
              className={cn(
                'font-display leading-none text-aero-ivory',
                chartPrimary
                  ? 'text-[clamp(2rem,5vw,3.5rem)]'
                  : 'text-[clamp(2.8rem,8vw,5.5rem)]',
              )}
            >
              {beat.figure.value}
              {beat.figure.unit ? (
                <span className="font-serif ml-2 text-[0.32em] text-aero-mist">
                  {beat.figure.unit}
                </span>
              ) : null}
            </p>
            <p className="font-serif mt-2 max-w-md text-sm text-aero-mist md:text-base">
              {beat.figure.caption}
            </p>
            <p className="font-ui mt-1 text-[10px] tracking-[0.2em] text-aero-signal/50 uppercase">
              {beat.figure.citation}
            </p>
          </div>
        ) : null}

        {/* Equations after chart when charts carry the argument */}
        {beat.equations &&
        beat.equations.length > 0 &&
        !chartPrimary ? (
          <ul data-fade className="mt-8 space-y-2" data-testid={`eq-${beat.id}`}>
            {beat.equations.map((eq) => (
              <li
                key={eq}
                className="font-mono border-l border-aero-amr/50 pl-4 text-[13px] leading-relaxed text-aero-ivory/85 md:text-sm"
              >
                {eq}
              </li>
            ))}
          </ul>
        ) : null}

        {beat.takeaways ? (
          <ol
            data-fade
            className="mt-10 space-y-5"
            data-testid={`takeaways-${beat.id}`}
          >
            {beat.takeaways.map((t, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-display text-lg text-aero-amr">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-serif text-[1.05rem] leading-snug text-aero-ivory/90 md:text-xl">
                  {t}
                </span>
              </li>
            ))}
          </ol>
        ) : null}

        {beat.metrics ? (
          <dl
            data-fade
            className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3"
            data-testid={`metrics-${beat.id}`}
          >
            {beat.metrics.map((m) => (
              <div key={m.label}>
                <dt className="font-ui text-[10px] tracking-[0.2em] text-aero-mist uppercase">
                  {m.label}
                </dt>
                <dd className="font-display mt-1 text-xl text-aero-ivory md:text-2xl">
                  {m.value}
                </dd>
                {m.fact ? (
                  <dd className="font-ui mt-1 text-[9px] tracking-[0.16em] text-aero-signal/40 uppercase">
                    {m.fact}
                  </dd>
                ) : null}
              </div>
            ))}
          </dl>
        ) : null}

        {beat.id === 'cop-vs-cog' ? (
          <div data-fade>
            <CopCogDiagram />
          </div>
        ) : null}

        {beat.id === 'cosim-stack' ? (
          <div data-fade>
            <CosimDiagram />
          </div>
        ) : null}

        {beat.id === 'ch02-state-machine' ? (
          <div data-fade>
            <StateMachineDiagram />
          </div>
        ) : null}

        {beat.interactive === 'control' ? (
          <div data-fade>
            <ControlDemo />
          </div>
        ) : null}

        {beat.interactive === 'toggle-grip' ? (
          <div data-fade className="mt-6 flex gap-3">
            <ToggleBtn
              active={gripToggle === 'table5'}
              onClick={() => setGripToggle('table5')}
              label="Table 5 · algoritmi"
            />
            <ToggleBtn
              active={gripToggle === 'table4'}
              onClick={() => setGripToggle('table4')}
              label="Table 4 · balance"
            />
          </div>
        ) : null}

        {primaryChart ? (
          <div
            data-fade
            className={cn(
              'mt-6',
              beat.visual === 'gallery' && beat.chartB
                ? 'grid gap-10 lg:grid-cols-2'
                : 'max-w-4xl',
            )}
          >
            <AmChart
              spec={primaryChart}
              scrubX={
                beat.interactive === 'scrub-drs' ||
                beat.interactive === 'scrub-maxp'
                  ? scrub
                  : null
              }
              height={
                beat.visual === 'gallery' ||
                beat.interactive === 'scrub-drs' ||
                beat.interactive === 'scrub-maxp'
                  ? 280
                  : 340
              }
            />
            {beat.visual === 'gallery' &&
            beat.chartB &&
            beat.interactive !== 'toggle-grip' ? (
              <AmChart
                spec={beat.chartB}
                scrubX={
                  beat.interactive === 'scrub-drs' ||
                  beat.interactive === 'scrub-maxp'
                    ? scrub
                    : null
                }
                height={280}
              />
            ) : null}
          </div>
        ) : null}

        {(beat.interactive === 'scrub-drs' ||
          beat.interactive === 'scrub-maxp') && (
          <div data-fade>
            <SpeedScrub
              value={scrub}
              onChange={setScrub}
              min={beat.interactive === 'scrub-maxp' ? 100 : 0}
              max={300}
            />
          </div>
        )}

        {beat.equations && beat.equations.length > 0 && chartPrimary ? (
          <ul data-fade className="mt-6 space-y-2" data-testid={`eq-${beat.id}`}>
            {beat.equations.map((eq) => (
              <li
                key={eq}
                className="font-mono border-l border-aero-amr/50 pl-4 text-[13px] leading-relaxed text-aero-ivory/85 md:text-sm"
              >
                {eq}
              </li>
            ))}
          </ul>
        ) : null}

        {/* Dual chart for chartB when not gallery (e.g. DIL + delta) */}
        {beat.chartB &&
        beat.visual === 'chart' &&
        beat.interactive !== 'toggle-grip' ? (
          <div data-fade className="mt-10 max-w-4xl">
            <AmChart spec={beat.chartB} height={300} />
          </div>
        ) : null}

        {/* Secondary for scrub pair when interactive but not gallery */}
        {beat.chartB &&
        beat.visual === 'interactive' &&
        beat.interactive !== 'toggle-grip' ? (
          <div data-fade className="mt-10 max-w-4xl">
            <AmChart
              spec={beat.chartB}
              scrubX={
                beat.interactive === 'scrub-drs' ||
                beat.interactive === 'scrub-maxp'
                  ? scrub
                  : null
              }
              height={300}
            />
          </div>
        ) : null}

        {beat.callouts ? (
          <ul data-fade className="mt-8 max-w-2xl space-y-2">
            {beat.callouts.map((c) => (
              <li
                key={c}
                className="font-serif text-sm leading-relaxed text-aero-mist/80"
              >
                — {c}
              </li>
            ))}
          </ul>
        ) : null}

        {beat.references ? (
          <ul
            data-fade
            className="mt-12 space-y-4 border-t border-aero-signal/15 pt-8"
            data-testid="references"
          >
            {beat.references.map((ref) => (
              <li key={ref.id} className="flex gap-3">
                <span className="font-ui shrink-0 text-[11px] tracking-[0.18em] text-aero-amr uppercase">
                  {ref.id}
                </span>
                <span className="font-serif text-sm leading-relaxed text-aero-mist md:text-base">
                  {ref.text}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {isTitle ? (
          <p
            data-fade
            className="font-ui luxury-pulse mt-14 text-[11px] tracking-[0.28em] text-aero-mist uppercase"
          >
            Derulează
          </p>
        ) : null}
      </div>
    </section>
  )
}

function ToggleBtn({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'font-ui px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase transition-colors',
        active
          ? 'bg-aero-amr text-aero-ivory'
          : 'text-aero-mist hover:text-aero-ivory',
      )}
    >
      {label}
    </button>
  )
}
