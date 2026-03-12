import { describe, it, expect } from 'vitest'
import { calculateResults, calculateDelta } from '../calculations'
import { formatUSD, formatPercent, formatNumber } from '../utils'
import type { MetricInputs, CalculatedResults } from '../types'

// ---------------------------------------------------------------------------
// calculateResults
// ---------------------------------------------------------------------------

describe('calculateResults', () => {
  it('normal case: 100 leads, 60% booking, 40% closing, $800 ticket', () => {
    const inputs: MetricInputs = {
      monthlyLeads: 100,
      bookingRate: 60,
      closingRate: 40,
      averageTicket: 800,
    }
    const result = calculateResults(inputs)

    expect(result.bookedAppointments).toBe(60)
    expect(result.jobsWon).toBe(24)
    expect(result.monthlyRevenue).toBe(19200)
    expect(result.annualRevenue).toBe(230400)
    expect(result.valuePerLead).toBeCloseTo(192, 5)   // $19200 / 100
    expect(result.valuePerJob).toBe(800)               // $19200 / 24
  })

  it('zero leads: all results should be 0', () => {
    const inputs: MetricInputs = {
      monthlyLeads: 0,
      bookingRate: 60,
      closingRate: 40,
      averageTicket: 800,
    }
    const result = calculateResults(inputs)

    expect(result.bookedAppointments).toBe(0)
    expect(result.jobsWon).toBe(0)
    expect(result.monthlyRevenue).toBe(0)
    expect(result.annualRevenue).toBe(0)
    expect(result.valuePerLead).toBe(0)
    expect(result.valuePerJob).toBe(0)
  })

  it('zero booking rate: cascades to 0 revenue and 0 jobs', () => {
    const inputs: MetricInputs = {
      monthlyLeads: 100,
      bookingRate: 0,
      closingRate: 40,
      averageTicket: 800,
    }
    const result = calculateResults(inputs)

    expect(result.bookedAppointments).toBe(0)
    expect(result.jobsWon).toBe(0)
    expect(result.monthlyRevenue).toBe(0)
    expect(result.annualRevenue).toBe(0)
    expect(result.valuePerLead).toBe(0)
    expect(result.valuePerJob).toBe(0)
  })

  it('zero closing rate: booked appointments remain, but no revenue', () => {
    const inputs: MetricInputs = {
      monthlyLeads: 100,
      bookingRate: 60,
      closingRate: 0,
      averageTicket: 800,
    }
    const result = calculateResults(inputs)

    expect(result.bookedAppointments).toBe(60)
    expect(result.jobsWon).toBe(0)
    expect(result.monthlyRevenue).toBe(0)
    expect(result.annualRevenue).toBe(0)
    expect(result.valuePerLead).toBe(0)
    expect(result.valuePerJob).toBe(0)
  })

  it('zero average ticket: no revenue even with bookings and closings', () => {
    const inputs: MetricInputs = {
      monthlyLeads: 100,
      bookingRate: 60,
      closingRate: 40,
      averageTicket: 0,
    }
    const result = calculateResults(inputs)

    expect(result.bookedAppointments).toBe(60)
    expect(result.jobsWon).toBe(24)
    expect(result.monthlyRevenue).toBe(0)
    expect(result.annualRevenue).toBe(0)
    expect(result.valuePerLead).toBe(0)
    expect(result.valuePerJob).toBe(0)
  })

  it('large numbers: 10000 leads, 95% booking, 95% closing, $5000 ticket', () => {
    const inputs: MetricInputs = {
      monthlyLeads: 10000,
      bookingRate: 95,
      closingRate: 95,
      averageTicket: 5000,
    }
    const result = calculateResults(inputs)

    const expectedBooked = 9500
    const expectedJobs = 9025
    const expectedMonthly = 45_125_000
    const expectedAnnual = 541_500_000

    expect(result.bookedAppointments).toBeCloseTo(expectedBooked, 5)
    expect(result.jobsWon).toBeCloseTo(expectedJobs, 5)
    expect(result.monthlyRevenue).toBeCloseTo(expectedMonthly, 2)
    expect(result.annualRevenue).toBeCloseTo(expectedAnnual, 2)
    expect(result.valuePerLead).toBeCloseTo(expectedMonthly / 10000, 2)
    expect(result.valuePerJob).toBeCloseTo(5000, 5)
  })

  it('100% rates and a whole-number ticket produce exact integers', () => {
    const inputs: MetricInputs = {
      monthlyLeads: 50,
      bookingRate: 100,
      closingRate: 100,
      averageTicket: 1000,
    }
    const result = calculateResults(inputs)

    expect(result.bookedAppointments).toBe(50)
    expect(result.jobsWon).toBe(50)
    expect(result.monthlyRevenue).toBe(50000)
    expect(result.annualRevenue).toBe(600000)
    expect(result.valuePerLead).toBe(1000)
    expect(result.valuePerJob).toBe(1000)
  })

  it('fractional rates produce correct decimal results', () => {
    const inputs: MetricInputs = {
      monthlyLeads: 10,
      bookingRate: 33.3,
      closingRate: 50,
      averageTicket: 100,
    }
    const result = calculateResults(inputs)

    expect(result.bookedAppointments).toBeCloseTo(3.33, 5)
    expect(result.jobsWon).toBeCloseTo(1.665, 5)
    expect(result.monthlyRevenue).toBeCloseTo(166.5, 5)
  })
})

// ---------------------------------------------------------------------------
// calculateDelta
// ---------------------------------------------------------------------------

describe('calculateDelta', () => {
  const makeResults = (monthly: number, annual: number, vpl: number, vpj: number): CalculatedResults => ({
    bookedAppointments: 0,
    jobsWon: 0,
    monthlyRevenue: monthly,
    annualRevenue: annual,
    valuePerLead: vpl,
    valuePerJob: vpj,
  })

  it('projected > current: produces positive deltas', () => {
    const current = makeResults(10000, 120000, 100, 500)
    const projected = makeResults(19200, 230400, 192, 800)

    const delta = calculateDelta(current, projected)

    expect(delta.monthlyIncrease).toBeCloseTo(9200, 5)
    expect(delta.monthlyIncreasePercent).toBeCloseTo(92, 5)
    expect(delta.annualIncrease).toBeCloseTo(110400, 5)
    expect(delta.annualIncreasePercent).toBeCloseTo(92, 5)
    expect(delta.valuePerLeadIncrease).toBeCloseTo(92, 5)
    expect(delta.valuePerJobIncrease).toBeCloseTo(300, 5)
  })

  it('projected < current: produces negative deltas', () => {
    const current = makeResults(19200, 230400, 192, 800)
    const projected = makeResults(10000, 120000, 100, 500)

    const delta = calculateDelta(current, projected)

    expect(delta.monthlyIncrease).toBeCloseTo(-9200, 5)
    expect(delta.monthlyIncreasePercent).toBeCloseTo(-47.9166, 3)
    expect(delta.annualIncrease).toBeCloseTo(-110400, 5)
    expect(delta.annualIncreasePercent).toBeCloseTo(-47.9166, 3)
    expect(delta.valuePerLeadIncrease).toBeCloseTo(-92, 5)
    expect(delta.valuePerJobIncrease).toBeCloseTo(-300, 5)
  })

  it('identical current and projected: all deltas are zero', () => {
    const current = makeResults(19200, 230400, 192, 800)
    const projected = makeResults(19200, 230400, 192, 800)

    const delta = calculateDelta(current, projected)

    expect(delta.monthlyIncrease).toBe(0)
    expect(delta.monthlyIncreasePercent).toBe(0)
    expect(delta.annualIncrease).toBe(0)
    expect(delta.annualIncreasePercent).toBe(0)
    expect(delta.valuePerLeadIncrease).toBe(0)
    expect(delta.valuePerJobIncrease).toBe(0)
  })

  it('current revenue is zero: percent increase stays 0 (no division by zero)', () => {
    const current = makeResults(0, 0, 0, 0)
    const projected = makeResults(5000, 60000, 50, 250)

    const delta = calculateDelta(current, projected)

    expect(delta.monthlyIncrease).toBe(5000)
    expect(delta.monthlyIncreasePercent).toBe(0)   // guarded — current is 0
    expect(delta.annualIncrease).toBe(60000)
    expect(delta.annualIncreasePercent).toBe(0)    // guarded — current is 0
    expect(delta.valuePerLeadIncrease).toBe(50)
    expect(delta.valuePerJobIncrease).toBe(250)
  })

  it('uses full calculateResults output correctly end-to-end', () => {
    const currentInputs: MetricInputs = { monthlyLeads: 100, bookingRate: 50, closingRate: 30, averageTicket: 500 }
    const projectedInputs: MetricInputs = { monthlyLeads: 100, bookingRate: 60, closingRate: 40, averageTicket: 800 }

    const current = calculateResults(currentInputs)
    const projected = calculateResults(projectedInputs)
    const delta = calculateDelta(current, projected)

    // current: 15 jobs, $7500/mo, $90000/yr
    // projected: 24 jobs, $19200/mo, $230400/yr
    expect(delta.monthlyIncrease).toBeCloseTo(19200 - 7500, 5)
    expect(delta.annualIncrease).toBeCloseTo(230400 - 90000, 5)
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

  it('zero: treated as non-negative, prepends "+"', () => {
    expect(formatPercent(0)).toBe('+0.0%')
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
    expect(formatNumber(9.95)).toBe('10')  // rounds up
  })

  it('formats negative numbers', () => {
    expect(formatNumber(-24)).toBe('-24')
  })
})
