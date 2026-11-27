import { Suspense, lazy, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Box } from 'lucide-react'
import { SPLINE_SCENE_NOTE, SPLINE_SCENE_URL } from '@/data/spline'
import { cn } from '@/lib/utils'
import { BorderBeam, GlassCard } from '@/ui/primitives'
import { useScrollStore } from './scrollStore'

const Spline = lazy(() => import('@splinetool/react-spline'))

/**
 * Interactive Spline 3D panel for Hero + Wind Tunnel chapters.
 * Framed glass stage (Aceternity-style) so photography/R3F stay brand-primary
 * until SPLINE_SCENE_URL is swapped for a sports-car export.
 */
export function SplineCarCanvas({ className }: { className?: string }) {
  const chapterIndex = useScrollStore((s) => s.chapterIndex)
  const [loaded, setLoaded] = useState(false)
  const visible = chapterIndex === 0 || chapterIndex === 2

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="spline-panel"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'pointer-events-none absolute inset-0 z-[2] flex items-center justify-center px-4 md:justify-end md:px-10 md:pt-16',
            className,
          )}
        >
          <GlassCard
            variant="strong"
            className="pointer-events-auto relative h-[min(62dvh,560px)] w-full max-w-xl overflow-hidden md:h-[min(68dvh,640px)] md:max-w-2xl"
            data-testid="spline-car-canvas"
            data-interactive="true"
            aria-label="Interactive 3D Spline scene"
          >
            <BorderBeam duration={10} />

            {!loaded ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-aero-bg/50">
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

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-aero-bg/85 via-aero-bg/35 to-transparent px-4 pb-3 pt-10">
              <div className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.22em] text-aero-muted uppercase">
                <Box className="size-3 text-aero-cyan" aria-hidden />
                Spline · interactive · orbit / zoom
              </div>
              <p className="mt-1 max-w-sm text-[10px] leading-snug text-aero-muted/80">
                {SPLINE_SCENE_NOTE}
              </p>
            </div>
          </GlassCard>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
