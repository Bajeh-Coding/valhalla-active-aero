import { VALHALLA_SRC, type MockChapter } from '../data/chapters'

interface ChapterMediaProps {
  chapter: MockChapter
}

/** Full-bleed image plane or elegant CSS/SVG abstract placeholder. */
export function ChapterMedia({ chapter }: ChapterMediaProps) {
  if (chapter.image.kind === 'valhalla') {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[21/9]">
        <img
          src={VALHALLA_SRC[chapter.image.key]}
          alt=""
          className="chapter-parallax h-full w-full scale-105 object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-aero-void/70 via-transparent to-transparent" />
      </div>
    )
  }

  const tone = chapter.image.tone
  const fills =
    tone === 'green'
      ? { a: '#005949', b: '#0b0e14', accent: '#c4df00' }
      : tone === 'lime'
        ? { a: '#0b0e14', b: '#05070a', accent: '#c4df00' }
        : { a: '#12151c', b: '#05070a', accent: '#8b929a' }

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[21/9]"
      data-testid={`abstract-${chapter.id}`}
      aria-hidden
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`g-${chapter.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={fills.a} />
            <stop offset="100%" stopColor={fills.b} />
          </linearGradient>
          <pattern
            id={`grid-${chapter.id}`}
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke={fills.accent}
              strokeOpacity="0.08"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="1600" height="900" fill={`url(#g-${chapter.id})`} />
        <rect width="1600" height="900" fill={`url(#grid-${chapter.id})`} />
        <path
          d="M120 720 C480 520 720 780 980 480 S1400 280 1520 200"
          fill="none"
          stroke={fills.accent}
          strokeOpacity="0.22"
          strokeWidth="1.5"
        />
        <circle
          cx="1280"
          cy="220"
          r="180"
          fill="none"
          stroke={fills.accent}
          strokeOpacity="0.12"
          strokeWidth="1"
        />
        <text
          x="80"
          y="820"
          fill={fills.accent}
          fillOpacity="0.35"
          fontFamily="ui-monospace, monospace"
          fontSize="18"
          letterSpacing="6"
        >
          {String(chapter.number).padStart(2, '0')} · PLACEHOLDER
        </text>
      </svg>
    </div>
  )
}
