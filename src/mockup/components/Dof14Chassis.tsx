import { useEffect, useId, useRef, useState } from 'react'

type HotspotId = 'monocoque' | 'susp-front' | 'susp-rear' | 'wheel-front' | 'wheel-rear'

interface Hotspot {
  id: HotspotId
  cx: number
  cy: number
  label: string
  dof: string
  detail: string
  photo: string
  photoAlt: string
}

const HOTSPOTS: readonly Hotspot[] = [
  {
    id: 'monocoque',
    cx: 455,
    cy: 148,
    label: 'Monococă',
    dof: '6 DOF',
    detail: 'Șasiu — translații x, y, z + rotații roll, pitch, yaw',
    photo: '/images/am-official/am-ch07-doors.jpg',
    photoAlt: 'Monococă Valhalla — cabină carbon cu uși deschise',
  },
  {
    id: 'susp-front',
    cx: 232,
    cy: 198,
    label: 'Suspensie față',
    dof: '4 DOF',
    detail: 'Cursa verticală a suspensiilor la fiecare roată (1 DOF × 4)',
    photo: '/images/am-official/am-ch07-side.jpg',
    photoAlt: 'Pasaj roată față Valhalla — zonă suspensie',
  },
  {
    id: 'susp-rear',
    cx: 702,
    cy: 196,
    label: 'Suspensie spate',
    dof: '4 DOF',
    detail: 'Cursa verticală a suspensiilor la fiecare roată (1 DOF × 4)',
    photo: '/images/am-official/am-ch07-aero-under.jpg',
    photoAlt: 'Underbody Valhalla — structură punte spate',
  },
  {
    id: 'wheel-front',
    cx: 188,
    cy: 262,
    label: 'Roată față',
    dof: '4 DOF',
    detail: 'Dinamica de rotație și alunecarea longitudinală a roților (1 DOF × 4)',
    photo: '/images/am-official/am-ch07-front.jpg',
    photoAlt: 'Detaliu față Valhalla — roată și caroserie',
  },
  {
    id: 'wheel-rear',
    cx: 748,
    cy: 262,
    label: 'Roată spate',
    dof: '4 DOF',
    detail: 'Dinamica de rotație și alunecarea longitudinală a roților (1 DOF × 4)',
    photo: '/images/am-official/am-ch03-fundamente.jpg',
    photoAlt: 'Profil lateral Valhalla — roți și siluetă',
  },
] as const

function ChassisSketch() {
  return (
    <g aria-hidden>
      <ellipse cx="470" cy="322" rx="380" ry="12" fill="rgb(0 102 94 / 0.14)" />
      <line
        x1="60"
        y1="322"
        x2="880"
        y2="322"
        stroke="rgb(232 228 220 / 0.1)"
        strokeWidth="1"
      />

      {/* Far-side wheels — subtle 3/4 depth */}
      <g opacity="0.22" stroke="#8b929a" fill="none" strokeWidth="1.15">
        <ellipse cx="218" cy="266" rx="46" ry="44" />
        <ellipse cx="218" cy="266" rx="26" ry="24" />
        <ellipse cx="778" cy="266" rx="50" ry="46" />
        <ellipse cx="778" cy="266" rx="28" ry="26" />
      </g>

      {/* Lower rocker / sill line */}
      <path
        d="M140 248
           C200 258 280 268 380 272
           C520 276 640 270 740 258
           C780 252 820 248 850 252"
        fill="none"
        stroke="#00665e"
        strokeWidth="1.15"
        opacity="0.55"
      />

      {/* Front nose + splitter */}
      <path
        d="M95 248
           C110 220 130 200 165 188
           C195 178 220 176 245 182
           L255 230
           C220 238 175 242 140 248
           C120 252 105 254 95 248 Z"
        fill="rgb(248 247 244 / 0.03)"
        stroke="#f8f7f4"
        strokeWidth="1.35"
        opacity="0.8"
      />

      {/* Front fender arch */}
      <path
        d="M245 182
           C255 168 270 158 295 156
           C320 154 345 162 355 178
           C360 188 358 200 350 210
           L255 230 Z"
        fill="none"
        stroke="#f8f7f4"
        strokeWidth="1.25"
        opacity="0.7"
      />

      {/* Carbon monocoque tub — central structure */}
      <path
        d="M350 210
           C360 168 390 132 440 118
           C475 110 515 112 550 126
           C585 140 610 168 625 200
           L620 238
           C560 250 470 254 400 246
           C370 240 355 226 350 210 Z"
        fill="rgb(0 102 94 / 0.1)"
        stroke="#00665e"
        strokeWidth="1.85"
      />

      {/* Cabin canopy / windshield */}
      <path
        d="M395 168
           C420 128 455 108 500 110
           C535 112 565 128 582 158"
        fill="none"
        stroke="#f8f7f4"
        strokeWidth="1.4"
        opacity="0.9"
      />
      {/* Roof scoop */}
      <path
        d="M470 112 C488 96 518 94 540 108"
        fill="none"
        stroke="#c4df00"
        strokeWidth="1.25"
        opacity="0.75"
      />
      {/* Side aero channel */}
      <path
        d="M355 200 C400 214 480 218 560 208"
        fill="none"
        stroke="#8b929a"
        strokeWidth="1"
        opacity="0.45"
      />

      {/* Rear deck / engine cover / haunch */}
      <path
        d="M625 200
           C655 170 700 158 745 168
           C780 176 810 196 830 220
           C845 236 855 250 858 262
           L780 268
           C760 248 720 232 680 230
           C650 228 630 220 625 200 Z"
        fill="rgb(248 247 244 / 0.03)"
        stroke="#f8f7f4"
        strokeWidth="1.35"
        opacity="0.8"
      />
      {/* Rear diffuser strakes hint */}
      <path
        d="M780 278 L800 292 M800 278 L820 292 M820 278 L840 292"
        fill="none"
        stroke="#00665e"
        strokeWidth="1.1"
        opacity="0.55"
      />

      {/* Front double-wishbone + spring */}
      <g stroke="#8b929a" fill="none" strokeWidth="1.15">
        <path d="M232 198 L200 240" />
        <path d="M250 204 L218 248" />
        <path
          d="M232 198 C236 214 236 228 232 244"
          stroke="#00665e"
          strokeWidth="1.65"
        />
        <circle cx="232" cy="198" r="3.5" fill="#00665e" stroke="none" />
        <circle cx="200" cy="240" r="2.5" fill="#8b929a" stroke="none" />
      </g>

      {/* Rear double-wishbone + spring */}
      <g stroke="#8b929a" fill="none" strokeWidth="1.15">
        <path d="M702 196 L734 240" />
        <path d="M684 204 L716 248" />
        <path
          d="M702 196 C698 214 698 228 702 244"
          stroke="#00665e"
          strokeWidth="1.65"
        />
        <circle cx="702" cy="196" r="3.5" fill="#00665e" stroke="none" />
        <circle cx="734" cy="240" r="2.5" fill="#8b929a" stroke="none" />
      </g>

      {/* Near front wheel */}
      <g>
        <circle cx="188" cy="262" r="52" fill="#0b0e14" stroke="#f8f7f4" strokeWidth="1.55" />
        <circle cx="188" cy="262" r="36" fill="none" stroke="#8b929a" strokeWidth="1.05" />
        <circle cx="188" cy="262" r="15" fill="none" stroke="#00665e" strokeWidth="1.35" />
        <circle cx="188" cy="262" r="4" fill="#c4df00" stroke="none" />
        {[0, 36, 72, 108, 144].map((deg) => {
          const a = (deg * Math.PI) / 180
          return (
            <line
              key={deg}
              x1={188 + Math.cos(a) * 17}
              y1={262 + Math.sin(a) * 17}
              x2={188 + Math.cos(a) * 33}
              y2={262 + Math.sin(a) * 33}
              stroke="#8b929a"
              strokeWidth="1"
              opacity="0.65"
            />
          )
        })}
      </g>

      {/* Near rear wheel */}
      <g>
        <circle cx="748" cy="262" r="56" fill="#0b0e14" stroke="#f8f7f4" strokeWidth="1.55" />
        <circle cx="748" cy="262" r="38" fill="none" stroke="#8b929a" strokeWidth="1.05" />
        <circle cx="748" cy="262" r="16" fill="none" stroke="#00665e" strokeWidth="1.35" />
        <circle cx="748" cy="262" r="4" fill="#c4df00" stroke="none" />
        {[0, 36, 72, 108, 144].map((deg) => {
          const a = (deg * Math.PI) / 180
          return (
            <line
              key={deg}
              x1={748 + Math.cos(a) * 18}
              y1={262 + Math.sin(a) * 18}
              x2={748 + Math.cos(a) * 35}
              y2={262 + Math.sin(a) * 35}
              stroke="#8b929a"
              strokeWidth="1"
              opacity="0.65"
            />
          )
        })}
      </g>

      {/* CoG */}
      <g>
        <circle cx="455" cy="178" r="7" fill="none" stroke="#c4df00" strokeWidth="1.15" />
        <circle cx="455" cy="178" r="2.4" fill="#c4df00" />
        <text
          x="468"
          y="182"
          fill="#c4df00"
          fontSize="10"
          fontFamily="AstonMartinSans, sans-serif"
          letterSpacing="0.08em"
          opacity="0.85"
        >
          CoG
        </text>
      </g>
    </g>
  )
}

function HotspotButton({
  hotspot,
  active,
  onToggle,
}: {
  hotspot: Hotspot
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      data-testid={`dof-hotspot-${hotspot.id}`}
      aria-expanded={active}
      aria-controls={`dof-popover-${hotspot.id}`}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className={[
        'font-ui absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center',
        'rounded-full border text-[15px] leading-none tracking-normal transition-all duration-300',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aero-lime',
        active
          ? 'border-aero-lime bg-aero-lime text-aero-void scale-110'
          : 'border-aero-amr/70 bg-aero-ink/90 text-aero-ivory hover:border-aero-lime hover:text-aero-lime',
      ].join(' ')}
      style={{
        left: `${(hotspot.cx / 940) * 100}%`,
        top: `${(hotspot.cy / 360) * 100}%`,
      }}
      aria-label={`${hotspot.label}: ${hotspot.dof}`}
    >
      <span aria-hidden>{active ? '×' : '+'}</span>
    </button>
  )
}

function HotspotPopover({
  hotspot,
  onClose,
}: {
  hotspot: Hotspot
  onClose: () => void
}) {
  const titleId = useId()
  // Compact card; keep inside diagram bounds (prefer toward center)
  const preferAbove = hotspot.cy > 200
  const clampLeft = Math.min(72, Math.max(18, (hotspot.cx / 940) * 100))

  let transform = preferAbove
    ? 'translate(-50%, calc(-100% - 12px))'
    : 'translate(-50%, 16px)'

  if (hotspot.cx < 260) {
    transform = preferAbove
      ? 'translate(-8%, calc(-100% - 12px))'
      : 'translate(-8%, 16px)'
  } else if (hotspot.cx > 680) {
    transform = preferAbove
      ? 'translate(-92%, calc(-100% - 12px))'
      : 'translate(-92%, 16px)'
  }

  return (
    <div
      id={`dof-popover-${hotspot.id}`}
      role="dialog"
      aria-labelledby={titleId}
      data-testid={`dof-popover-${hotspot.id}`}
      className="absolute z-30 w-[min(220px,70vw)] overflow-hidden border border-aero-ivory/12 bg-aero-ink/96 shadow-[0_16px_40px_rgb(0_0_0_/0.55)] backdrop-blur-md"
      style={{
        left: `${clampLeft}%`,
        top: `${(hotspot.cy / 360) * 100}%`,
        transform,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative h-[72px] overflow-hidden bg-aero-void">
        <img
          src={hotspot.photo}
          alt={hotspot.photoAlt}
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-aero-ink/75 via-transparent to-transparent" />
      </div>
      <div className="px-3 py-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <p
            id={titleId}
            className="font-ui text-[9px] font-medium tracking-[0.4px] text-aero-mist/70 uppercase"
          >
            {hotspot.label}
          </p>
          <p className="font-display shrink-0 text-[13px] tracking-normal text-aero-lime">
            {hotspot.dof}
          </p>
        </div>
        <p className="font-ui mt-1 text-[11px] leading-snug tracking-[0.3px] text-aero-ivory/90">
          {hotspot.detail}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="font-ui mt-2 text-[9px] tracking-[0.35em] text-aero-mist/50 uppercase transition-colors hover:text-aero-ivory"
        >
          Închide
        </button>
      </div>
    </div>
  )
}

/** Cap 03 — Schemă 14 DOF pe siluetă șasiu Valhalla, cu hotspots interactive. */
export function Dof14Diagram() {
  const [activeId, setActiveId] = useState<HotspotId | null>(null)
  const rootRef = useRef<HTMLElement>(null)
  const active = HOTSPOTS.find((h) => h.id === activeId) ?? null

  useEffect(() => {
    if (!activeId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeId])

  return (
    <figure
      ref={rootRef}
      className="mt-10 max-w-[960px] border-t border-aero-ivory/10 pt-8"
      data-testid="diagram-dof14"
      onClick={() => setActiveId(null)}
    >
      <figcaption className="font-ui mb-5 flex flex-wrap items-end justify-between gap-3 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
        <span>Schemă — 14 grade de libertate (VI-CarRealTime)</span>
        <span className="tracking-[0.35px] text-aero-amr/80 normal-case">
          6 șasiu + 4 suspensii + 4 roți
        </span>
      </figcaption>

      <div className="relative border border-aero-ivory/8 bg-gradient-to-b from-aero-ink to-aero-void">
        <svg
          viewBox="0 0 940 360"
          className="block w-full"
          role="img"
          aria-label="Siluetă șasiu Valhalla: monococă 6 DOF, suspensii 4 DOF, roți 4 DOF. Apasă + pentru detalii."
        >
          <rect width="940" height="360" fill="#0b0e14" />
          <ChassisSketch />
        </svg>

        {HOTSPOTS.map((h) => (
          <HotspotButton
            key={h.id}
            hotspot={h}
            active={activeId === h.id}
            onToggle={() => setActiveId((cur) => (cur === h.id ? null : h.id))}
          />
        ))}

        {active ? (
          <HotspotPopover hotspot={active} onClose={() => setActiveId(null)} />
        ) : null}
      </div>

      <p className="font-ui mt-4 text-[11px] tracking-[0.35px] text-aero-mist/50">
        Apasă «+» pe monococă, suspensii sau roți — Total = 6 + 4 + 4 = 14 DOF
      </p>
    </figure>
  )
}
