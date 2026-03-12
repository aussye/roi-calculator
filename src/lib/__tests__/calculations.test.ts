import { describe, it, expect } from 'vitest'
import { calculateResults, calculateDelta } from '../calculations'
import { formatUSD, formatPercent, formatNumber } from '../utils'
import type { MetricInputs, CalculatedResults } from '../types'

// ---------------------------------------------------------------------------
// calculateResults — reverse math (revenue goal → leads required)
// ---------------------------------------------------------------------------

describe('calculateResults', () => {
  it('default current: $50k goal, $800 ticket, 40% close, 60% booking', () => {
    const inputs: MetricInputs = {
      revenueGoal: 50000,
      averageTicket: 800,
      closeRate: 40,
      bookingRate: 60,
    }
    const r = calculateResults(inputs)

    // 50000 / 800 = 62.5 jobs
    expect(r.jobsRequired).toBeCloseTo(62.5)
    // 62.5 / 0.40 = 156.25 appointments
    expect(r.appointmentsRequired).toBeCloseTo(156.25)
    // 156.25 / 0.60 = 260.4167 leads
    expect(r.leadsRequired).toBeCloseTo(260.4167, 3)
    expect(r.monthlyRevenue).toBe(50000)
    expect(r.annualRevenue).toBe(600000)
    // 50000 / 260.4167 ≈ 192
    expect(r.valuePerLead).toBeCloseTo(192, 0)
  })

  it('default projected: $100k goal, $1200 ticket, 55% close, 75% booking', () => {
    const inputs: MetricInputs = {
      revenueGoal: 100000,
      averageTicket: 1200,
      closeRate: 55,
      bookingRate: 75,
    }
    const r = calculateResults(inputs)

    expect(r.jobsRequired).toBeCloseTo(83.333, 2)
    expect(r.appointmentsRequired).toBeCloseTo(151.515, 2)
    expect(r.leadsRequired).toBeCloseTo(202.02, 1)
    expect(r.monthlyRevenue).toBe(100000)
    expect(r.annualRevenue).toBe(1200000)
    expect(r.valuePerLead).toBeCloseTo(495, 0)
  })

  it('zero average ticket: jobs=0, cascades to 0 appointments/leads', () => {
    const inputs: MetricInputs = {
      revenueGoal: 50000,
      averageTicket: 0,
      closeRate: 40,
      bookingRate: 60,
    }
    const r = calculateResults(inputs)

    expect(r.jobsRequired).toBe(0)
    expect(r.appointmentsRequired).toBe(0)
    expect(r.leadsRequired).toBe(0)
    expect(r.monthlyRevenue).toBe(50000)
    expect(r.annualRevenue).toBe(600000)
    expect(r.valuePerLead).toBe(0)
  })

  it('zero close rate: appointments=0, cascades to 0 leads', () => {
    const inputs: MetricInputs = {
      revenueGoal: 50000,
      averageTicket: 800,
      closeRate: 0,
      bookingRate: 60,
    }
    const r = calculateResults(inputs)

    expect(r.jobsRequired).toBeCloseTo(62.5)
    expect(r.appointmentsRequired).toBe(0)
    expect(r.leadsRequired).toBe(0)
    expect(r.valuePerLead).toBe(0)
  })

  it('zero booking rate: leads=0, valuePerLead=0', () => {
    const inputs: MetricInputs = {
      revenueGoal: 50000,
      averageTicket: 800,
      closeRate: 40,
      bookingRate: 0,
    }
    const r = calculateResults(inputs)

    expect(r.jobsRequired).toBeCloseTo(62.5)
    expect(r.appointmentsRequired).toBeCloseTo(156.25)
    expect(r.leadsRequired).toBe(0)
    expect(r.valuePerLead).toBe(0)
  })

  it('100% rates: jobs = appointments = leads', () => {
    const inputs: MetricInputs = {
      revenueGoal: 10000,
      averageTicket: 1000,
      closeRate: 100,
      bookingRate: 100,
    }
    const r = calculateResults(inputs)

    expect(r.jobsRequired).toBe(10)
    expect(r.appointmentsRequired).toBe(10)
    expect(r.leadsRequired).toBe(10)
    expect(r.valuePerLead).toBe(1000)
  })

  it('zero revenue goal: all pipeline counts are zero', () => {
    const inputs: MetricInputs = {
      revenueGoal: 0,
      averageTicket: 800,
      closeRate: 40,
      bookingRate: 60,
    }
    const r = calculateResults(inputs)

    expect(r.jobsRequired).toBe(0)
    expect(r.appointmentsRequired).toBe(0)
    expect(r.leadsRequired).toBe(0)
    expect(r.monthlyRevenue).toBe(0)
    expect(r.annualRevenue).toBe(0)
    expect(r.valuePerLead).toBe(0)
  })

  it('large values: $500k goal, $2000 ticket, 80% close, 90% booking', () => {
    const inputs: MetricInputs = {
      revenueGoal: 500000,
      averageTicket: 2000,
      closeRate: 80,
      bookingRate: 90,
    }
    const r = calculateResults(inputs)

    // 500000 / 2000 = 250 jobs
    expect(r.jobsRequired).toBe(250)
    // 250 / 0.80 = 312.5 appointments
    expect(r.appointmentsRequired).toBeCloseTo(312.5)
    // 312.5 / 0.90 = 347.222 leads
    expect(r.leadsRequired).toBeCloseTo(347.222, 2)
    expect(r.annualRevenue).toBe(6000000)
  })
})

// ---------------------------------------------------------------------------
// calculateDelta
// ---------------------------------------------------------------------------

describe('calculateDelta', () => {
  it('positive growth: current $50k → projected $100k', () => {
    const current = calculateResults({
      revenueGoal: 50000,
      averageTicket: 800,
      closeRate: 40,
      bookingRate: 60,
    })
    const projected = calculateResults({
      revenueGoal: 100000,
      averageTicket: 1200,
      closeRate: 55,
      bookingRate: 75,
    })
    const delta = calculateDelta(current, projected)

    expect(delta.monthlyIncrease).toBe(50000)
    expect(delta.monthlyIncreasePercent).toBeCloseTo(100)
    expect(delta.annualIncrease).toBe(600000)
    expect(delta.annualIncreasePercent).toBeCloseTo(100)
    expect(delta.valuePerLeadIncrease).toBeGreaterThan(0)
  })

  it('identical inputs: all deltas are zero', () => {
    const inputs: MetricInputs = {
      revenueGoal: 50000,
      averageTicket: 800,
      closeRate: 40,
      bookingRate: 60,
    }
    const r = calculateResults(inputs)
    const delta = calculateDelta(r, r)

    expect(delta.monthlyIncrease).toBe(0)
    expect(delta.monthlyIncreasePercent).toBe(0)
    expect(delta.annualIncrease).toBe(0)
    expect(delta.annualIncreasePercent).toBe(0)
    expect(delta.valuePerLeadIncrease).toBe(0)
  })

  it('negative growth: projected lower than current', () => {
    const current = calculateResults({
      revenueGoal: 100000,
      averageTicket: 1200,
      closeRate: 55,
      bookingRate: 75,
    })
    const projected = calculateResults({
      revenueGoal: 50000,
      averageTicket: 800,
      closeRate: 40,
      bookingRate: 60,
    })
    const delta = calculateDelta(current, projected)

    expect(delta.monthlyIncrease).toBe(-50000)
    expect(delta.monthlyIncreasePercent).toBeCloseTo(-50)
    expect(delta.annualIncrease).toBe(-600000)
    expect(delta.annualIncreasePercent).toBeCloseTo(-50)
    expect(delta.valuePerLeadIncrease).toBeLessThan(0)
  })

  it('current revenue zero: percent increase stays 0 (guarded)', () => {
    const current: CalculatedResults = {
      jobsRequired: 0,
      appointmentsRequired: 0,
      leadsRequired: 0,
      monthlyRevenue: 0,
      annualRevenue: 0,
      valuePerLead: 0,
    }
    const projected = calculateResults({
      revenueGoal: 50000,
      averageTicket: 800,
      closeRate: 40,
      bookingRate: 60,
    })
    const delta = calculateDelta(current, projected)

    expect(delta.monthlyIncrease).toBe(50000)
    expect(delta.monthlyIncreasePercent).toBe(0)
    expect(delta.annualIncrease).toBe(600000)
    expect(delta.annualIncreasePercent).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// formatUSD
// ---------------------------------------------------------------------------

describe('formatUSD', () => {
  it('formats 19200 as "$19,200"', () => {
    expect(formatUSD(19200)).toBe('$19,200')
  })

  it('formats 0 as "$0"', () => {
    expect(formatUSD(0)).toBe('$0')
  })

  it('formats 1000000 as "$1,000,000"', () => {
    expect(formatUSD(1000000)).toBe('$1,000,000')
  })

  it('rounds fractional cents — no decimal places shown', () => {
    expect(formatUSD(99.99)).toBe('$100')
    expect(formatUSD(99.4)).toBe('$99')
  })

  it('formats negative amounts with a leading minus', () => {
    expect(formatUSD(-5000)).toBe('-$5,000')
  })

  it('formats small amounts correctly', () => {
    expect(formatUSD(1)).toBe('$1')
    expect(formatUSD(800)).toBe('$800')
  })
})

// ---------------------------------------------------------------------------
// formatPercent
// ---------------------------------------------------------------------------

describe('formatPercent', () => {
  it('positive value: prepends "+" sign', () => {
    expect(formatPercent(15.5)).toBe('+15.5%')
  })

  it('zero: no "+" prefix', () => {
    expect(formatPercent(0)).toBe('0.0%')
  })

  it('negative value: uses minus sign, no "+"', () => {
    expect(formatPercent(-10)).toBe('-10.0%')
  })

  it('integer value: shows one decimal place', () => {
    expect(formatPercent(92)).toBe('+92.0%')
  })

  it('value with more than one decimal: rounds to one decimal place', () => {
    expect(formatPercent(47.9166)).toBe('+47.9%')
  })

  it('large positive value', () => {
    expect(formatPercent(200)).toBe('+200.0%')
  })
})

// ---------------------------------------------------------------------------
// formatNumber
// ---------------------------------------------------------------------------

describe('formatNumber', () => {
  it('formats 60.3 as "60.3"', () => {
    expect(formatNumber(60.3)).toBe('60.3')
  })

  it('formats 0 as "0"', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('formats integers without trailing decimal', () => {
    expect(formatNumber(60)).toBe('60')
  })

  it('formats large numbers with thousand-separators', () => {
    expect(formatNumber(9500)).toBe('9,500')
  })

  it('rounds to at most 1 decimal place', () => {
    expect(formatNumber(3.33)).toBe('3.3')
    expect(formatNumber(9.95)).toBe('10')
  })

  it('formats negative numbers', () => {
    expect(formatNumber(-24)).toBe('-24')
  })
})
