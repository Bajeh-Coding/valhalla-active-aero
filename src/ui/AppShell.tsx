import { ChapterScrollLayout } from '@/scene'

/**
 * App shell — mounts Phase 3 wind-tunnel scrollytelling stage.
 * Full glass HUD / chapter narrative lands in Phase 4.
 */
export function AppShell() {
  return (
    <div className="min-h-dvh bg-aero-bg text-aero-text">
      <ChapterScrollLayout />
    </div>
  )
}
