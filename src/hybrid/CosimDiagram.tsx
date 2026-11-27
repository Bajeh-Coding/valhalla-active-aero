/** Co-sim pipeline — MATLAB/Simulink ↔ VI-CarRealTime (S1-F001, S1-F030). */
export function CosimDiagram() {
  return (
    <div
      className="mt-8 max-w-xl border-t border-aero-signal/15 pt-6"
      data-testid="cosim-diagram"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        <Box title="MATLAB/Simulink" sub="state machine · forțe externe + delay" />
        <Arrow />
        <Box title="VI-CarRealTime" sub="14 DOF · lookup aero" />
        <Arrow />
        <Box title="DIL / Virtual" sub="GRIP · Nürburgring GP" />
      </div>
      <p className="font-ui mt-4 text-[10px] tracking-[0.16em] text-aero-mist/70 uppercase">
        S1-F001 · S1-F030 · S1-F070 — fără NLP/IPOPT (absent din S1)
      </p>
    </div>
  )
}

function Box({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="border border-aero-signal/20 px-4 py-3">
      <p className="font-ui text-[11px] tracking-[0.14em] text-aero-ivory uppercase">
        {title}
      </p>
      <p className="font-serif mt-1 text-sm text-aero-mist">{sub}</p>
    </div>
  )
}

function Arrow() {
  return (
    <span
      className="hidden text-center font-mono text-aero-amr sm:block"
      aria-hidden
    >
      →
    </span>
  )
}
