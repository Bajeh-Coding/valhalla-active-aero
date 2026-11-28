import { describe, expect, it } from 'vitest'
import {
  FIG_4_1_FL_FD_AOA,
  FIG_6_1_NURBURGRING,
  FIG_7_1_DOWNFORCE,
  FIG_8_1_PI_ROM,
  GUIDE_CHARTS,
} from './guideCharts'

describe('guideCharts canonical numbers', () => {
  it('exposes all four guide figure ids', () => {
    expect(Object.keys(GUIDE_CHARTS).sort()).toEqual([
      'fig-4-1-fl-fd-aoa',
      'fig-6-1-nurburgring',
      'fig-7-1-downforce',
      'fig-8-1-pi-rom',
    ])
  })

  it('Fig 4.1 matches digitized FL/FD vs AOA series', () => {
    const [rear, front, drag] = FIG_4_1_FL_FD_AOA.series
    expect(rear?.points).toEqual([
      [0, -400],
      [5, -190],
      [10, 213],
      [15, 349],
      [19, 411],
      [25, 310],
    ])
    expect(front?.points).toEqual([
      [0, 91],
      [5, 46],
      [10, 0],
      [15, -45],
      [19, -81],
      [25, -135],
    ])
    expect(drag?.points).toEqual([
      [0, 309],
      [5, 350],
      [10, 421],
      [15, 511],
      [19, 678],
      [25, 778],
    ])
  })

  it('Fig 6.1 matches guide Slide 6 lap times', () => {
    const [vi, human] = FIG_6_1_NURBURGRING.series
    expect(vi?.points).toEqual([
      ['Pasiv Original', 115.48],
      ['Pasiv Nou (50/50)', 114.08],
      ['ACTIV MaxP Mode', 112.29],
    ])
    expect(human?.points).toEqual([
      ['Pasiv Original', 134.82],
      ['Pasiv Nou (50/50)', 131.61],
      ['ACTIV MaxP Mode', 129.06],
    ])
    const delta =
      (human?.points[2]?.[1] as number) - (human?.points[1]?.[1] as number)
    expect(delta).toBeCloseTo(-2.55, 2)
  })

  it('Fig 7.1 plateau is 600 kg from 240–300 km/h', () => {
    const pts = FIG_7_1_DOWNFORCE.series[0]?.points ?? []
    expect(pts).toEqual([
      [100, 105],
      [150, 235],
      [200, 415],
      [240, 600],
      [300, 600],
      [350, 521],
    ])
    expect(FIG_7_1_DOWNFORCE.refX?.value).toBe(240)
  })

  it('Fig 8.1 matches PI-ROM vs XFOIL wall-clock', () => {
    expect(FIG_8_1_PI_ROM.series[0]?.points).toEqual([
      ['PI-ROM Rețea Neuronală', 0.0906],
      ['CFD XFOIL (Clasic)', 2.4081],
    ])
    const [pi, xf] = FIG_8_1_PI_ROM.series[0]!.points
    expect((xf![1] as number) / (pi![1] as number)).toBeCloseTo(26.58, 1)
  })
})
