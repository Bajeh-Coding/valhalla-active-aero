/** Architecture diagram — MATLAB/Simulink ↔ VI-CarRealTime (no NLP invent). */
export function CosimDiagram() {
  return (
    <div
      className="mt-8 grid w-full max-w-3xl gap-3 sm:grid-cols-3"
      data-testid="cosim-diagram"
    >
      <Block title="MATLAB/Simulink" sub="state machine → forțe externe + delay" />
      <div className="flex items-center justify-center">
        <span className="font-ui text-[10px] tracking-[0.22em] text-aero-amr uppercase">
          co-sim ↔
        </span>
      </div>
      <Block
        title="VI-CarRealTime"
        sub="14 DOF plantă · lookup aero · VI-Driver"
      />
      <div className="sm:col-span-3 mt-2 border-t border-aero-signal/10 pt-4">
        <p className="font-ui text-[10px] tracking-[0.16em] text-aero-mist/70 uppercase">
          MaxPerformance · iterație pe parametrii de performanță / toleranțe
        </p>
        <p className="font-serif mt-2 text-sm text-aero-mist">
          NLP / IPOPT omitted — absente din S1. Fuzzy rules omitted — doar Abstract.
        </p>
      </div>
    </div>
  )
}

function Block({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="border border-aero-signal/15 px-4 py-5">
      <p className="font-display text-lg text-aero-ivory">{title}</p>
      <p className="font-serif mt-2 text-sm text-aero-mist">{sub}</p>
    </div>
  )
}

/** High-level state machine schematic. */
export function StateMachineDiagram() {
  const modes = ['DRS', 'Aerobrake', 'MaxP'] as const
  return (
    <div className="mt-8 max-w-2xl" data-testid="state-machine-diagram">
      <p className="font-ui mb-4 text-[10px] tracking-[0.2em] text-aero-mist uppercase">
        vehicle inputs → surface states
      </p>
      <div className="flex flex-wrap gap-3">
        {['V', 'throttle', 'brake', '|ay|'].map((s) => (
          <span
            key={s}
            className="font-mono border border-aero-signal/20 px-3 py-1.5 text-xs text-aero-mist"
          >
            {s}
          </span>
        ))}
      </div>
      <div className="my-4 h-px w-24 bg-aero-amr/60" />
      <div className="flex flex-wrap gap-3">
        {modes.map((m) => (
          <span
            key={m}
            className="font-ui bg-aero-amr/25 px-4 py-2 text-[11px] tracking-[0.16em] text-aero-ivory uppercase"
          >
            {m}
          </span>
        ))}
      </div>
      <p className="font-serif mt-4 text-sm text-aero-mist">
        Complexitate crescătoare · S1-F031 · execuție Simulink external forces
      </p>
    </div>
  )
}
