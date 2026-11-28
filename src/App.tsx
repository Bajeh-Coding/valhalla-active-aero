import { useCallback, useState } from 'react'
import { BootSplash } from '@/BootSplash'
import { MockupTalk } from '@/mockup'

export default function App() {
  const [entered, setEntered] = useState(false)
  const onReveal = useCallback(() => setEntered(true), [])

  return (
    <>
      <BootSplash onReveal={onReveal} />
      <div
        data-testid="app-shell"
        style={{
          opacity: entered ? 1 : 0,
          transition: entered
            ? 'opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)'
            : undefined,
          pointerEvents: entered ? 'auto' : 'none',
        }}
        aria-hidden={!entered}
      >
        <MockupTalk />
      </div>
    </>
  )
}
