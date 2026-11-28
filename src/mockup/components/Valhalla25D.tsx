import { cn } from '@/lib/utils'
import type { AeroMode, SplitterState } from '@/types/aero'

const CAR_REAR = '/images/am-official/am-ch07-caz.jpg'
const CAR_FRONT = '/images/am-official/am-hero.jpg'
const WING_DETAIL = '/images/am-official/am-ch07-rear-wing.jpg'
const FRONT_WING_DETAIL = '/images/am-official/am-ch07-front-wing.jpg'

export interface Valhalla25DProps {
  aoaDeg: number
  splitter: SplitterState
  mode: AeroMode
  speedKmh: number
  dragIndex: number
  frontDfIndex: number
  rearDfIndex: number
  className?: string
}

/**
 * Cap 09 — premium 2.5D Valhalla stage.
 * Official AM rear¾ plate + layered SVG aero actuators driven by simulator state.
 * Surfaces: rear dual-element / T-wing (AOA), splitter OPEN|CLOSED, front wing,
 * air-dam, diffuser cues. Wheels spin with speed.
 */
export function Valhalla25D({
  aoaDeg,
  splitter,
  mode,
  speedKmh,
  dragIndex,
  frontDfIndex,
  rearDfIndex,
  className,
}: Valhalla25DProps) {
  const aoaNorm = Math.min(1, Math.max(0, aoaDeg / 19))
  // Side-view convention: positive AOA raises trailing edge (nose-up relative to flow).
  const wingRot = -aoaDeg * 0.92
  const frontWingRot = -aoaDeg * 0.55
  const splitterOpen = splitter === 'OPEN'
  const airDamDrop = mode === 'AEROBRAKE' || mode === 'MAXP' ? 1 : mode === 'DRS' ? 0.15 : 0.45
  const diffuserGlow = 0.25 + rearDfIndex * 0.75
  const wheelPeriod =
    speedKmh < 1 ? 0 : Math.max(0.18, 2.4 - (speedKmh / 300) * 2.2)

  return (
    <div
      className={cn(
        'relative overflow-hidden border border-aero-ivory/8 bg-aero-void',
        className,
      )}
      data-testid="sim-visual"
      data-mode={mode}
      data-splitter={splitter}
      data-aoa={aoaDeg.toFixed(1)}
    >
      <div className="flex items-center justify-between gap-3 border-b border-aero-ivory/8 px-4 py-2.5 md:px-5">
        <p className="font-ui text-[10px] tracking-[0.55px] text-aero-mist/50 uppercase">
          Valhalla 2.5D · {mode} · AOA {aoaDeg.toFixed(1)}° · splitter{' '}
          {splitter}
        </p>
        <p className="font-mono text-[10px] tracking-[0.12em] text-aero-lime/75">
          {speedKmh} km/h
        </p>
      </div>

      {/* Main 2.5D stage — rear¾ official plate */}
      <div
        className="valhalla-stage relative aspect-[16/10] w-full overflow-hidden md:aspect-[21/11]"
        style={{ perspective: '1400px' }}
      >
        {/* Atmosphere / parallax depth plane */}
        <div
          className="pointer-events-none absolute inset-0 scale-110 bg-cover bg-center opacity-40 blur-[2px]"
          style={{
            backgroundImage: `url(${CAR_FRONT})`,
            transform: `translateZ(-80px) scale(1.12) translateX(${mode === 'DRS' ? -1.5 : 1}%)`,
          }}
          aria-hidden
        />

        {/* Road / void floor */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-aero-void via-aero-void/85 to-transparent"
          aria-hidden
        />

        {/* Primary car plate */}
        <div
          className="absolute inset-0 origin-[62%_58%] transition-transform duration-700 ease-out"
          style={{
            transform: `rotateY(-6deg) rotateX(4deg) translateZ(0) scale(1.04) translateX(${splitterOpen ? -0.6 : 0}%)`,
          }}
        >
          <img
            src={CAR_REAR}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: '58% 48%' }}
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-aero-void/55 via-transparent to-aero-void/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-aero-void/70 via-transparent to-aero-void/25" />
        </div>

        {/* Soft mask over stock wing so SVG actuator reads cleanly */}
        <div
          className="pointer-events-none absolute top-[12%] right-[6%] h-[32%] w-[46%] rounded-[42%] bg-aero-void/50 blur-2xl"
          aria-hidden
        />

        {/* Spinning wheels — rear (primary) + front (partial) */}
        <SpinningWheel
          className="absolute bottom-[22%] left-[11%] h-[16%] w-[10%]"
          periodSec={wheelPeriod}
          testId="sim-wheel-front"
        />
        <SpinningWheel
          className="absolute right-[14%] bottom-[12%] h-[28%] w-[17%]"
          periodSec={wheelPeriod}
          testId="sim-wheel-rear"
          prominent
        />

        {/* Articulated aero SVG layer */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1000 560"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <linearGradient id="v25-carbon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a1d22" />
              <stop offset="45%" stopColor="#2c3138" />
              <stop offset="100%" stopColor="#0b0e14" />
            </linearGradient>
            <linearGradient id="v25-lime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4ff2a" />
              <stop offset="100%" stopColor="#c4df00" />
            </linearGradient>
            <linearGradient id="v25-wing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a3f46" />
              <stop offset="40%" stopColor="#12151a" />
              <stop offset="100%" stopColor="#05070a" />
            </linearGradient>
            <filter id="v25-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="v25-flow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgb(196 223 0 / 0)" />
              <stop offset="50%" stopColor="rgb(196 223 0 / 0.55)" />
              <stop offset="100%" stopColor="rgb(196 223 0 / 0)" />
            </linearGradient>
          </defs>

          {/* Diffuser cue — lime strakes intensity ∝ rear DF */}
          <g
            opacity={0.4 + diffuserGlow * 0.55}
            data-testid="sim-surface-diffuser"
          >
            <path
              d="M640 430 L720 448 L800 456 L880 448 L920 428 L900 470 L800 488 L700 480 L640 458 Z"
              fill="url(#v25-carbon)"
              stroke="url(#v25-lime)"
              strokeWidth="1.5"
              filter={mode === 'AEROBRAKE' || mode === 'MAXP' ? 'url(#v25-glow)' : undefined}
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1={670 + i * 48}
                y1={442}
                x2={660 + i * 48}
                y2={476}
                stroke="#c4df00"
                strokeWidth="1.2"
                opacity={0.35 + rearDfIndex * 0.55}
              />
            ))}
            <text
              x="780"
              y="508"
              fill="#8b929a"
              fontSize="9"
              fontFamily="AstonMartinSans, sans-serif"
              textAnchor="middle"
              letterSpacing="1.2"
            >
              DIFFUSER
            </text>
          </g>

          {/* Air-dam / underfloor turning cue — front-lower drop */}
          <g
            data-testid="sim-surface-airdam"
            style={{
              transform: `translate(95px, ${405 + airDamDrop * 16}px)`,
              transition: 'transform 450ms cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <path
              d="M0 0 L92 8 L88 28 L-4 18 Z"
              fill={
                mode === 'DRS'
                  ? 'rgba(248,247,244,0.18)'
                  : 'url(#v25-carbon)'
              }
              stroke="#c4df00"
              strokeWidth="1"
              opacity={0.55 + airDamDrop * 0.4}
            />
            <text
              x="44"
              y="-6"
              fill="#8b929a"
              fontSize="9"
              fontFamily="AstonMartinSans, sans-serif"
              textAnchor="middle"
              letterSpacing="1.2"
            >
              AIR-DAM
            </text>
          </g>

          {/* Front splitter — OPEN extends + lime edge; CLOSED tucked */}
          <g data-testid="sim-surface-splitter">
            <g
              style={{
                transform: splitterOpen
                  ? 'translate(48px, 428px) scale(1.14, 1)'
                  : 'translate(68px, 434px) scale(0.9, 1)',
                transition: 'transform 450ms cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <path
                d="M0 12 L110 0 L118 18 L8 28 Z"
                fill={splitterOpen ? 'rgba(196,223,0,0.22)' : 'url(#v25-carbon)'}
                stroke={splitterOpen ? '#c4df00' : 'rgba(248,247,244,0.35)'}
                strokeWidth="1.6"
              />
              {splitterOpen ? (
                <path
                  d="M4 22 L112 10"
                  stroke="#c4df00"
                  strokeWidth="2"
                  opacity="0.9"
                />
              ) : null}
            </g>
            <text
              x="105"
              y="468"
              fill="#8b929a"
              fontSize="9"
              fontFamily="AstonMartinSans, sans-serif"
              letterSpacing="1.2"
            >
              SPLITTER {splitter}
            </text>
          </g>

          {/* Active front wing — AOA-driven (hidden-grille twin element cue) */}
          <g
            data-testid="sim-surface-front-wing"
            style={{
              transform: `translate(120px, 388px) rotate(${frontWingRot}deg)`,
              transformOrigin: '40px 8px',
              transition: 'transform 500ms cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <rect
              x="0"
              y="0"
              width="78"
              height="7"
              rx="1.5"
              fill="url(#v25-lime)"
              opacity="0.92"
            />
            <rect
              x="6"
              y="9"
              width="66"
              height="4"
              rx="1"
              fill="#1a1d22"
              stroke="#c4df00"
              strokeWidth="0.6"
              opacity="0.85"
            />
            <text
              x="39"
              y="-8"
              fill="#c4df00"
              fontSize="9"
              fontFamily="AstonMartinSans, sans-serif"
              textAnchor="middle"
              letterSpacing="1"
            >
              FRONT WING
            </text>
          </g>

          {/* Rear dual-element / T-wing — primary AOA actuator */}
          <g data-testid="sim-surface-rear-wing">
            {/* swan-neck pylons — aligned to rear¾ plate wing mounts */}
            <path
              d="M730 168 L742 248"
              stroke="#8b929a"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M818 164 L832 246"
              stroke="#8b929a"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.8"
            />
            <g
              style={{
                transform: `translate(780px, 168px) rotate(${wingRot}deg)`,
                transformOrigin: '0px 0px',
                transition: 'transform 550ms cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              {/* dual-element main plane */}
              <rect
                x="-78"
                y="-7"
                width="156"
                height="11"
                rx="2"
                fill="url(#v25-wing)"
                stroke="#c4df00"
                strokeWidth="1.2"
                filter={aoaNorm > 0.45 ? 'url(#v25-glow)' : undefined}
              />
              {/* second element (T-wing flap) */}
              <rect
                x="-62"
                y="7"
                width="124"
                height="6"
                rx="1.5"
                fill="#0b0e14"
                stroke="rgba(196,223,0,0.65)"
                strokeWidth="0.9"
                style={{
                  transform: `rotate(${-aoaDeg * 0.18}deg)`,
                  transformOrigin: '0px 10px',
                  transition: 'transform 550ms cubic-bezier(0.22,1,0.36,1)',
                }}
              />
              {/* endplates */}
              <rect x="-82" y="-14" width="5" height="28" rx="1" fill="#1a1d22" />
              <rect x="77" y="-14" width="5" height="28" rx="1" fill="#1a1d22" />
              <text
                x="0"
                y="-18"
                fill="#c4df00"
                fontSize="11"
                fontFamily="AstonMartinFlare, sans-serif"
                textAnchor="middle"
              >
                T-WING · {aoaDeg.toFixed(1)}°
              </text>
            </g>
          </g>

          {/* Flow streamlines — educational */}
          <g opacity={0.35 + dragIndex * 0.4}>
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M80 ${300 + i * 28} C 220 ${290 + i * 26}, 420 ${310 + i * 18}, 700 ${240 + i * 22 + aoaNorm * 30}`}
                fill="none"
                stroke="url(#v25-flow)"
                strokeWidth="1.4"
                strokeDasharray="6 10"
                className="valhalla-flow"
                style={{ animationDelay: `${i * 0.35}s` }}
              />
            ))}
          </g>

          {/* Educational force arrows */}
          <g strokeLinecap="round">
            <line
              x1="480"
              y1="320"
              x2={480 + 40 + dragIndex * 90}
              y2="320"
              stroke="#e8e4dc"
              strokeWidth="2.2"
              opacity="0.85"
            />
            <polygon
              points={`${480 + 40 + dragIndex * 90},320 ${480 + 32 + dragIndex * 90},315 ${480 + 32 + dragIndex * 90},325`}
              fill="#e8e4dc"
            />
            <text
              x={500 + dragIndex * 40}
              y="308"
              fill="#8b929a"
              fontSize="10"
              fontFamily="AstonMartinSans, sans-serif"
            >
              drag
            </text>
            <line
              x1="210"
              y1="400"
              x2="210"
              y2={400 + 18 + frontDfIndex * 50}
              stroke="#00665e"
              strokeWidth="2.2"
            />
            <text
              x="210"
              y={418 + frontDfIndex * 50}
              fill="#8b929a"
              fontSize="10"
              textAnchor="middle"
              fontFamily="AstonMartinSans, sans-serif"
            >
              F-DF
            </text>
            <line
              x1="780"
              y1="400"
              x2="780"
              y2={400 + 18 + rearDfIndex * 55}
              stroke="#c4df00"
              strokeWidth="2.2"
            />
            <text
              x="780"
              y={418 + rearDfIndex * 55}
              fill="#8b929a"
              fontSize="10"
              textAnchor="middle"
              fontFamily="AstonMartinSans, sans-serif"
            >
              R-DF
            </text>
          </g>
        </svg>

        {/* Detail chips — official surface photography */}
        <div className="pointer-events-none absolute bottom-3 left-3 flex max-w-[46%] gap-2 md:bottom-4 md:left-4">
          <DetailChip
            src={FRONT_WING_DETAIL}
            label="Front wing"
            active={aoaNorm > 0.05 || mode === 'DRS'}
          />
          <DetailChip
            src={WING_DETAIL}
            label="Rear T-wing"
            active={aoaNorm > 0.2}
          />
        </div>
      </div>

      {/* Surface legend — mode mapping */}
      <ul
        className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-aero-ivory/8 px-4 py-3 md:grid-cols-5 md:px-5"
        data-testid="sim-surface-legend"
      >
        <LegendItem
          label="Front wing"
          value={`${(aoaDeg * 0.55).toFixed(1)}°`}
          hot={mode !== 'DRS'}
        />
        <LegendItem
          label="T-wing AOA"
          value={`${aoaDeg.toFixed(1)}°`}
          hot={aoaNorm > 0.35}
        />
        <LegendItem
          label="Splitter"
          value={splitter}
          hot={splitterOpen}
        />
        <LegendItem
          label="Air-dam"
          value={
            mode === 'DRS' ? 'bleed' : mode === 'AEROBRAKE' ? 'max' : 'active'
          }
          hot={airDamDrop > 0.6}
        />
        <LegendItem
          label="Diffuser"
          value={rearDfIndex.toFixed(2)}
          hot={rearDfIndex > 0.55}
          className="col-span-2 md:col-span-1"
        />
      </ul>
    </div>
  )
}

function SpinningWheel({
  className,
  periodSec,
  testId,
  prominent = false,
}: {
  className?: string
  periodSec: number
  testId: string
  prominent?: boolean
}) {
  const spinning = periodSec > 0
  return (
    <div
      className={cn('pointer-events-none', className)}
      data-testid={testId}
      aria-hidden
    >
      <div
        className={cn(
          'valhalla-wheel relative h-full w-full rounded-full border border-aero-ivory/25',
          prominent ? 'bg-aero-void/70' : 'bg-aero-void/55',
        )}
        style={
          spinning
            ? { animationDuration: `${periodSec}s` }
            : { animation: 'none' }
        }
      >
        <div className="absolute inset-[18%] rounded-full border border-aero-mist/30 bg-aero-ink/80" />
        <div className="absolute inset-[38%] rounded-full bg-aero-ivory/15" />
        {[0, 45, 90, 135].map((deg) => (
          <span
            key={deg}
            className="absolute top-1/2 left-1/2 h-[2px] w-[88%] -translate-x-1/2 -translate-y-1/2 bg-aero-mist/35"
            style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }}
          />
        ))}
        {prominent ? (
          <span className="absolute inset-x-[22%] top-[46%] h-px bg-aero-lime/40" />
        ) : null}
      </div>
    </div>
  )
}

function DetailChip({
  src,
  label,
  active,
}: {
  src: string
  label: string
  active: boolean
}) {
  return (
    <div
      className={cn(
        'overflow-hidden border transition-colors duration-500',
        active ? 'border-aero-lime/50' : 'border-aero-ivory/15',
      )}
    >
      <img
        src={src}
        alt=""
        className="h-12 w-20 object-cover md:h-14 md:w-24"
        draggable={false}
      />
      <p className="font-ui bg-aero-void/85 px-1.5 py-0.5 text-[8px] tracking-[0.4px] text-aero-mist/70 uppercase">
        {label}
      </p>
    </div>
  )
}

function LegendItem({
  label,
  value,
  hot,
  className,
}: {
  label: string
  value: string
  hot?: boolean
  className?: string
}) {
  return (
    <li className={cn('min-w-0', className)}>
      <p className="font-ui text-[8px] tracking-[0.45px] text-aero-mist/45 uppercase">
        {label}
      </p>
      <p
        className={cn(
          'font-mono mt-0.5 text-[11px]',
          hot ? 'text-aero-lime' : 'text-aero-ivory/80',
        )}
      >
        {value}
      </p>
    </li>
  )
}
