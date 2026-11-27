import { describe, expect, it } from 'vitest'
import { ALL_CHARTS, TABLE3_FORCES, TABLE5_GRIP, MAXP_SCHEDULE } from './charts'
import { BEATS } from './chapters'

describe('hybrid chart packs', () => {
  it('ships required minimum chart set from packs', () => {
    expect(ALL_CHARTS['table3-forces']).toBeDefined()
    expect(ALL_CHARTS['table5-grip-lap-times']).toBeDefined()
    expect(ALL_CHARTS['maxp-aoa-schedule']).toBeDefined()
    expect(ALL_CHARTS['zero-to-300']).toBeDefined()
  })

  it('Table 3 forces match S1-F011', () => {
    const orig = TABLE3_FORCES.series[0]!
    const neu = TABLE3_FORCES.series[1]!
    expect(orig.points).toEqual([
      ['Drag', 752],
      ['Front DF', 370],
      ['Rear DF', -126],
    ])
    expect(neu.points).toEqual([
      ['Drag', 788],
      ['Front DF', 470],
      ['Rear DF', 467],
    ])
    expect(TABLE3_FORCES.factIds).toContain('S1-F011')
  })

  it('Table 5 MaxP delta annotation is paper-exact', () => {
    const maxp = TABLE5_GRIP.series[0]!.points.find(([l]) => l === 'MaxP')
    const orig = TABLE5_GRIP.series[0]!.points.find(
      ([l]) => l === 'Passive–Orig.',
    )
    expect(maxp?.[1]).toBe(108.137)
    expect(orig?.[1]).toBe(111.251)
    expect(Number(((maxp![1] as number) - (orig![1] as number)).toFixed(3))).toBe(
      -3.114,
    )
  })

  it('MaxP schedule has three AOA bands', () => {
    const ys = MAXP_SCHEDULE.series[0]!.points.map(([, y]) => y)
    expect(new Set(ys)).toEqual(new Set([0, 3, 4.5]))
  })

  it('every chart-bearing beat references a known chart id', () => {
    for (const beat of BEATS) {
      if (beat.chart) {
        expect(ALL_CHARTS[beat.chart.chartId]).toBeDefined()
      }
      if (beat.chartB) {
        expect(ALL_CHARTS[beat.chartB.chartId]).toBeDefined()
      }
    }
  })

  it('chapter 5 beats are industrial-flagged', () => {
    const ch5 = BEATS.filter((b) => b.chapter === 5)
    expect(ch5.length).toBeGreaterThanOrEqual(4)
    expect(ch5.every((b) => b.industrial)).toBe(true)
  })

  it('does not invent SAE id typo 2020-01-0079', () => {
    const blob = JSON.stringify(BEATS)
    expect(blob.includes('2020-01-0079')).toBe(false)
    expect(blob.includes('2020-36-0079')).toBe(true)
  })
})
