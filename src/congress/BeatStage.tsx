import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'
import { VALHALLA_ASSETS } from './assets'
import type { Beat } from './beats'
import { ControlDemo } from './ControlDemo'
import { ResultsBars } from './ResultsBars'

interface BeatStageProps {
  beat: Beat
  index: number
  isActive: boolean
}

export function BeatStage({ beat, index, isActive }: BeatStageProps) {
  const rootRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const asset = VALHALLA_ASSETS[beat.photo]
  const isTitle = beat.kind === 'title'
  const voidTone = beat.tone === 'void'

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
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.95,
        stagger: 0.12,
        ease: 'power2.out',
        overwrite: true,
      },
    )
  }, [isActive, beat.id])

  return (
    <section
      ref={rootRef}
      id={`beat-${beat.id}`}
      data-testid={`beat-${beat.id}`}
      data-beat-index={index}
      aria-label={beat.rail}
      className="relative flex min-h-[100svh] w-full items-end md:items-center"
    >
      {/* Full-bleed Valhalla still */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <img
          src={asset.src}
          alt=""
          className={cn(
            'h-full w-full object-cover transition-transform duration-[1.4s] ease-out',
            isActive ? 'scale-100' : 'scale-[1.04]',
          )}
          style={{ objectPosition: asset.objectPosition }}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
        />
        <div
          className={cn(
            'absolute inset-0',
            voidTone
              ? 'bg-[linear-gradient(105deg,rgb(5_7_10/0.94)_0%,rgb(5_7_10/0.82)_42%,rgb(5_7_10/0.55)_100%)]'
              : 'bg-[linear-gradient(105deg,rgb(5_7_10/0.78)_0%,rgb(5_7_10/0.45)_48%,rgb(5_7_10/0.62)_100%)]',
          )}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(5_7_10/0.55)_100%)]" />
      </div>

      <div
        ref={copyRef}
        className={cn(
          'relative z-10 w-full px-6 pb-16 pt-24 md:px-14 md:pb-20 lg:px-24',
          isTitle ? 'md:pt-0' : '',
          beat.kind === 'control' || beat.kind === 'results' || beat.kind === 'takeaways' || beat.kind === 'recap'
            ? 'max-w-3xl'
            : 'max-w-2xl',
        )}
      >
        {beat.brand ? (
          <p
            data-fade
            className={cn(
              'mb-6 whitespace-pre-line tracking-[0.18em] text-aero-ivory uppercase',
              isTitle
                ? 'font-display text-[clamp(1.35rem,3.2vw,2.35rem)] leading-[1.15] font-medium'
                : 'font-ui mb-8 text-[12px] tracking-[0.32em] text-aero-ivory/75 md:text-[13px]',
            )}
          >
            {beat.brand}
          </p>
        ) : null}

        {beat.eyebrow ? (
          <p
            data-fade
            className="font-ui mb-4 text-[11px] tracking-[0.28em] text-aero-amr uppercase"
          >
            {beat.eyebrow}
          </p>
        ) : null}

        <h1
          data-fade
          className={cn(
            'font-display whitespace-pre-line text-aero-ivory',
            isTitle
              ? 'text-[clamp(2.4rem,6vw,4.75rem)] leading-[1.05] font-medium'
              : 'text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.08] font-medium',
          )}
        >
          {beat.headline}
        </h1>

        <p
          data-fade
          className="font-serif mt-5 max-w-xl text-[clamp(1.05rem,2vw,1.35rem)] leading-relaxed text-aero-mist"
        >
          {beat.line}
        </p>

        {beat.figure ? (
          <div data-fade className="mt-10" data-testid={`figure-${beat.id}`}>
            <p className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-none text-aero-ivory">
              {beat.figure.value}
              {beat.figure.unit ? (
                <span className="font-serif ml-2 text-[0.35em] text-aero-mist">
                  {beat.figure.unit}
                </span>
              ) : null}
            </p>
            <p className="font-serif mt-3 max-w-md text-base text-aero-mist">
              {beat.figure.caption}
            </p>
            <p className="font-ui mt-2 text-[10px] tracking-[0.2em] text-aero-signal/50 uppercase">
              {beat.figure.citation}
            </p>
          </div>
        ) : null}

        {beat.takeaways ? (
          <ol
            data-fade
            className="mt-10 space-y-5"
            data-testid={`takeaways-${beat.id}`}
          >
            {beat.takeaways.map((t, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-display text-aero-amr text-lg">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-serif text-[1.05rem] leading-snug text-aero-ivory/90 md:text-xl">
                  {t}
                </span>
              </li>
            ))}
          </ol>
        ) : null}

        {beat.bars ? (
          <div data-fade>
            <ResultsBars bars={beat.bars} />
          </div>
        ) : null}

        {beat.interactive ? (
          <div data-fade>
            <ControlDemo />
          </div>
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

        {index === 0 ? null : (
          <p className="sr-only">
            Credit foto: {asset.credit} ({asset.license})
          </p>
        )}
      </div>
    </section>
  )
}
