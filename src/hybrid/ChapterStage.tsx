import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'
import { VALHALLA_ASSETS } from './assets'
import type { Chapter } from './chapters'
import { ActuatorSketch } from './ActuatorSketch'
import { ControlDemo } from './ControlDemo'
import { CopCogDiagram } from './CopCogDiagram'
import { CosimDiagram } from './CosimDiagram'
import { GraphsChapter } from './GraphsChapter'
import { ResultsBars } from './ResultsBars'

interface ChapterStageProps {
  chapter: Chapter
  index: number
  isActive: boolean
}

export function ChapterStage({ chapter, index, isActive }: ChapterStageProps) {
  const copyRef = useRef<HTMLDivElement>(null)
  const asset = VALHALLA_ASSETS[chapter.photo]
  const isTitle = chapter.kind === 'title'
  const voidTone = chapter.tone === 'void'

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
        stagger: 0.1,
        ease: 'power2.out',
        overwrite: true,
      },
    )
  }, [isActive, chapter.id])

  return (
    <section
      id={`chapter-${chapter.id}`}
      data-testid={`chapter-${chapter.id}`}
      data-chapter-index={index}
      data-chapter-num={chapter.chapter}
      aria-label={`${chapter.rail} · capitol ${chapter.chapter}`}
      className={cn(
        'relative flex min-h-[100svh] w-full items-end md:items-center',
        voidTone ? 'bg-aero-void/40' : '',
      )}
    >
      {/* Per-section photo fallback when still-scrub is dimmed on void beats */}
      {voidTone ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <img
            src={asset.src}
            alt=""
            className={cn(
              'h-full w-full object-cover transition-transform duration-[1.4s] ease-out',
              isActive ? 'scale-100 opacity-40' : 'scale-[1.04] opacity-30',
            )}
            style={{ objectPosition: asset.objectPosition }}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgb(5_7_10/0.94)_0%,rgb(5_7_10/0.88)_50%,rgb(5_7_10/0.92)_100%)]" />
        </div>
      ) : null}

      <div
        ref={copyRef}
        className={cn(
          'relative z-10 w-full px-6 pb-16 pt-24 md:px-14 md:pb-20 lg:px-24',
          isTitle ? 'md:pt-0' : '',
          chapter.widget === 'control' ||
            chapter.widget === 'graphs' ||
            chapter.widget === 'results-bars' ||
            chapter.widget === 'industrial-facts' ||
            chapter.kind === 'takeaways' ||
            chapter.kind === 'recap'
            ? 'max-w-3xl'
            : 'max-w-2xl',
        )}
      >
        {chapter.industrialBanner ? (
          <p
            data-fade
            data-testid="industrial-banner"
            className="font-ui mb-5 inline-block border border-aero-lime/40 px-3 py-1.5 text-[10px] tracking-[0.2em] text-aero-lime uppercase"
          >
            {chapter.industrialBanner}
          </p>
        ) : null}

        {chapter.brand ? (
          <p
            data-fade
            className={cn(
              'mb-6 whitespace-pre-line tracking-[0.18em] text-aero-ivory uppercase',
              isTitle
                ? 'font-display text-[clamp(1.5rem,3.6vw,2.6rem)] leading-[1.12] font-medium'
                : 'font-ui mb-8 text-[12px] tracking-[0.32em] text-aero-ivory/75 md:text-[13px]',
            )}
          >
            {chapter.brand}
          </p>
        ) : null}

        {chapter.eyebrow ? (
          <p
            data-fade
            className="font-ui mb-4 text-[11px] tracking-[0.28em] text-aero-amr uppercase"
          >
            {chapter.eyebrow}
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
          {chapter.headline}
        </h1>

        <p
          data-fade
          className="font-serif mt-5 max-w-xl text-[clamp(1.05rem,2vw,1.35rem)] leading-relaxed text-aero-mist"
        >
          {chapter.line}
        </p>

        {chapter.figure ? (
          <div data-fade className="mt-10" data-testid={`figure-${chapter.id}`}>
            <p className="font-display text-[clamp(2.2rem,6vw,4.5rem)] leading-none text-aero-ivory">
              {chapter.figure.value}
              {chapter.figure.unit ? (
                <span className="font-serif ml-2 text-[0.35em] text-aero-mist">
                  {chapter.figure.unit}
                </span>
              ) : null}
            </p>
            <p className="font-serif mt-3 max-w-md text-base text-aero-mist">
              {chapter.figure.caption}
            </p>
            <p className="font-ui mt-2 text-[10px] tracking-[0.2em] text-aero-signal/50 uppercase">
              {chapter.figure.citation}
            </p>
          </div>
        ) : null}

        {chapter.takeaways ? (
          <ol
            data-fade
            className="mt-10 space-y-5"
            data-testid={`takeaways-${chapter.id}`}
          >
            {chapter.takeaways.map((t, i) => (
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

        {chapter.bars && chapter.widget === 'results-bars' ? (
          <div data-fade>
            <ResultsBars bars={chapter.bars} />
          </div>
        ) : null}

        {chapter.industrialFacts ? (
          <ul
            data-fade
            className="mt-10 space-y-5"
            data-testid="industrial-facts"
          >
            {chapter.industrialFacts.map((f) => (
              <li key={f.label} className="border-t border-aero-signal/10 pt-4">
                <p className="font-ui text-[11px] tracking-[0.2em] text-aero-amr uppercase">
                  {f.label}
                </p>
                <p className="font-serif mt-1 text-lg text-aero-ivory">{f.value}</p>
                <p className="font-ui mt-1 text-[10px] tracking-[0.16em] text-aero-mist/60 uppercase">
                  {f.source}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        {chapter.widget === 'cop-cog' ? (
          <div data-fade>
            <CopCogDiagram />
          </div>
        ) : null}
        {chapter.widget === 'actuators' ? (
          <div data-fade>
            <ActuatorSketch />
          </div>
        ) : null}
        {chapter.widget === 'control' ? (
          <div data-fade>
            <ControlDemo />
          </div>
        ) : null}
        {chapter.widget === 'cosim' ? (
          <div data-fade>
            <CosimDiagram />
          </div>
        ) : null}
        {chapter.widget === 'graphs' ? (
          <div data-fade>
            <GraphsChapter />
          </div>
        ) : null}

        {chapter.references ? (
          <ul
            data-fade
            className="mt-12 space-y-4 border-t border-aero-signal/15 pt-8"
            data-testid="references"
          >
            {chapter.references.map((ref) => (
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

        <p className="sr-only">
          Credit foto: {asset.credit} ({asset.license})
        </p>
      </div>
    </section>
  )
}
