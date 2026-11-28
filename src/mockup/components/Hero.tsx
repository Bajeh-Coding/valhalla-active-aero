import { VALHALLA_SRC } from '../data/chapters'

interface HeroProps {
  onExplore: () => void
}

/**
 * First viewport: thematic brand title + one line + optional CTAs.
 * Valhalla is the full-bleed visual plane — never the page title.
 * No overlays, badges, cards, or stats on hero media.
 */
export function Hero({ onExplore }: HeroProps) {
  return (
    <header
      id="hero"
      data-testid="mockup-hero"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      <div className="absolute inset-0" aria-hidden>
        <img
          src={VALHALLA_SRC.hero}
          alt=""
          className="hero-ambient h-full w-full object-cover"
          style={{ objectPosition: '55% 42%' }}
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-aero-void via-aero-void/45 to-aero-void/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-aero-void/55 via-transparent to-aero-void/20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-16 pt-28 md:px-10 md:pb-24">
        <p className="font-ui mb-5 text-[11px] tracking-[0.42em] text-aero-mist/80 uppercase">
          Prezentare · Mockup
        </p>

        <h1 className="font-display hero-title-reveal max-w-[18ch] text-[clamp(2.75rem,8vw,5.75rem)] leading-[0.95] font-normal tracking-[0.04em] text-aero-ivory uppercase">
          Aerodinamică Activă
        </h1>

        <p className="font-serif mt-6 max-w-[36ch] text-lg text-aero-mist/90 md:text-xl">
          Controlul aerului ca limbaj de performanță — schelet vizual, fără
          conținut științific.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onExplore}
            className="font-ui border border-aero-ivory/80 bg-aero-ivory px-7 py-3 text-[11px] tracking-[0.22em] text-aero-void uppercase transition-colors hover:bg-transparent hover:text-aero-ivory"
          >
            Explorează
          </button>
          <button
            type="button"
            onClick={onExplore}
            className="font-ui border border-aero-ivory/35 px-7 py-3 text-[11px] tracking-[0.22em] text-aero-ivory/90 uppercase transition-colors hover:border-aero-ivory/70"
          >
            Capitole
          </button>
        </div>
      </div>

      <div
        className="luxury-pulse pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <span className="font-ui block text-[9px] tracking-[0.35em] text-aero-mist/50 uppercase">
          Scroll
        </span>
      </div>
    </header>
  )
}
