interface SpeedScrubProps {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  label?: string
}

/** Chart speed scrub — readout drives AmChart scrubX. */
export function SpeedScrub({
  value,
  onChange,
  min = 0,
  max = 300,
  label = 'Scrub viteză',
}: SpeedScrubProps) {
  return (
    <label className="mt-4 block max-w-md" data-testid="speed-scrub">
      <span className="font-ui mb-2 flex justify-between text-[10px] tracking-[0.18em] text-aero-mist uppercase">
        <span>{label}</span>
        <span className="font-mono text-aero-ivory">{value} km/h</span>
      </span>
      <input
        type="range"
        className="aero-range w-full"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  )
}
