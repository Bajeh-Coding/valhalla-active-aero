import { ActiveAeroSimulator } from './ActiveAeroSimulator'

/**
 * Cap 05 dedicated simulator mount.
 *
 * COORDINATION: state-machine restyle agents should NOT remove, relocate, or
 * restyle this slot. Edit Cap 05 prose/diagram/mode-table elsewhere; keep this
 * file as the sole Active Aero Simulator mount point inside Cap 05.
 */
export function Cap05SimulatorSlot() {
  return (
    <div
      className="chapter-reveal is-revealed"
      data-testid="cap05-simulator-slot"
      data-cap05-slot="simulator"
    >
      <ActiveAeroSimulator />
    </div>
  )
}
