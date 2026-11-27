import { Suspense, lazy, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { SPLINE_SCENE_URL } from '@/data/spline'
import { cn } from '@/lib/utils'
import { useScrollStore } from './scrollStore'

const Spline = lazy(() => import('@splinetool/react-spline'))

/**
 * Interactive Spline 3D canvas for Hero + Wind Tunnel chapters.
 * Pointer events enabled on hero/control so orbit works; soft elsewhere.
 */
export function SplineCarCanvas({ className }: { className?: string }) {
  const chapterIndex = useScrollStore((s) => s.chapterIndex)
  const [loaded, setLoaded] = useState(false)
  const interactive = chapterIndex === 0 || chapterIndex === 2

  return (
    <div
      className={cn(
        'absolute inset-0 z-[2] transition-opacity duration-700',
        interactive ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-70',
        className,
      )}
      data-testid="spline-car-canvas"
      data-interactive={interactive ? 'true' : 'false'}
      aria-label="Interactive 3D vehicle scene"
    >
      {!loaded ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-aero-bg/40">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-aero-cyan uppercase"
          >
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading 3D scene
          </motion.div>
        </div>
      ) : null}

      <Suspense fallback={null}>
        <Spline
          scene={SPLINE_SCENE_URL}
          onLoad={() => setLoaded(true)}
          style={{ width: '100%', height: '100%' }}
        />
      </Suspense>

      {/* Soft vignette so glass HUD / Cinzel type stay legible */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 55% 45%, transparent 20%, rgb(5 7 10 / 0.35) 100%),
            linear-gradient(to top, rgb(5 7 10 / 0.55) 0%, transparent 38%)
          `,
        }}
        aria-hidden
      />
    </div>
  )
}
