import { ChapterScrollLayout } from '@/scene'

/** App shell — full-bleed wind tunnel + scrollytelling UI. */
export function AppShell() {
  return (
    <div className="min-h-dvh bg-aero-bg text-aero-text">
      <ChapterScrollLayout />
    </div>
  )
}
