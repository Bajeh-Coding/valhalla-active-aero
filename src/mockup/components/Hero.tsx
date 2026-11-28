import { HERO_IMAGE } from '../data/chapters'

interface HeroProps {
  onExplore: () => void
}

/**
 * First viewport: thematic brand title + one line + optional CTAs.
 * Valhalla is the full-bleed visual plane — never the page title.
 * Type: AstonMartinFlare (display) / AstonMartinSans (UI) — same as AM Valhalla page.
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
          src={HERO_IMAGE.src}
          alt=""
          className="hero-ambient h-full w-full object-cover"
          style={{ objectPosition: HERO_IMAGE.objectPosition }}
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-aero-void via-aero-void/50 to-aero-void/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-aero-void/65 via-aero-void/10 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-16 pt-28 md:px-10 md:pb-24">
        <p className="font-ui mb-5 text-[14px] font-medium tracking-[0.55px] text-aero-mist/85 uppercase">
          Prezentare științifică
        </p>

        <h1 className="font-display hero-title-reveal max-w-[14ch] text-[clamp(2.75rem,7.5vw,5.4rem)] leading-[1.05] font-normal tracking-normal text-aero-ivory">
          Aerodinamică Activă
        </h1>

        <p className="font-ui mt-6 max-w-[42ch] text-base font-normal leading-relaxed tracking-[0.55px] text-aero-mist/90 md:text-lg">
          De la modelul 14 DOF la controlul în timp real — un fir narativ despre
          forța aerului ca limbaj de performanță.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onExplore}
            className="font-ui rounded-[2px] bg-aero-amr px-7 py-3.5 text-base tracking-[0.55px] text-aero-ivory transition-colors hover:bg-aero-amr-deep"
          >
            Explorează
          </button>
          <button
            type="button"
            onClick={onExplore}
            className="font-ui rounded-[2px] border border-aero-ivory/40 bg-white/10 px-7 py-3.5 text-base tracking-[0.55px] text-aero-ivory backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            Capitole
          </button>
        </div>
      </div>

      <div
        className="luxury-pulse pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <span className="font-ui block text-[10px] tracking-[0.55px] text-aero-mist/50 uppercase">
          Scroll
        </span>
      </div>
    </header>
  )
}
