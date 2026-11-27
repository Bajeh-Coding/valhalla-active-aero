import { Suspense, lazy, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPLINE_SCENE_URL } from '@/data/spline'
import { cn } from '@/lib/utils'
import { useScrollStore } from './scrollStore'

const Spline = lazy(() => import('@splinetool/react-spline'))

/**
 * Full-bleed Spline plane for the wind-tunnel (control) chapter only.
 * No inset glass frame — edge-to-edge visual under sparse UI.
 */
export function SplineCarCanvas({ className }: { className?: string }) {
  const chapterIndex = useScrollStore((s) => s.chapterIndex)
  const [loaded, setLoaded] = useState(false)
  // Control chapter only — hero stays pure cinematic still + brand type
  const visible = chapterIndex === 2

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="spline-plane"
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 0.55 : 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'pointer-events-none absolute inset-0 z-[2]',
            className,
          )}
          data-testid="spline-car-canvas"
          aria-label="Interactive 3D Spline scene"
        >
          <div className="pointer-events-auto absolute inset-0">
            {!loaded ? (
              <div className="absolute inset-0 z-10 flex items-end justify-start p-6 md:p-10">
                <p className="font-mono text-[10px] tracking-[0.3em] text-aero-muted/60 uppercase">
                  Loading scene
                </p>
              </div>
            ) : null}
            <Suspense fallback={null}>
              <Spline
                scene={SPLINE_SCENE_URL}
                onLoad={() => setLoaded(true)}
                style={{ width: '100%', height: '100%' }}
              />
            </Suspense>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
