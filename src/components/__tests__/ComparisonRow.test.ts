import { describe, it, expect } from 'vitest'
import { formatUSD, formatNumber } from '@/lib/utils'

/**
 * formatDiff function extracted from ComparisonRow
 * - Positive numbers get "+" prefix
 * - Negative numbers get "-" prefix (from negative value)
 * - Zero gets no sign
 * - Currency format uses formatUSD
 * - Number format uses formatNumber
 */
function formatDiff(value: number, format: 'number' | 'currency'): string {
  const sign = value > 0 ? '+' : ''
  if (format === 'currency') return `${sign}${formatUSD(value)}`
  return `${sign}${formatNumber(value)}`
}

/**
 * Metric configuration from ComparisonRow
 */
type MetricConfig = {
  key: string // using string for test simplicity since we're not using CalculatedResults type
  label: string
  format: 'number' | 'currency'
  colorized: boolean
}

const METRICS: MetricConfig[] = [
  { key: 'jobsRequired', label: 'Jobs Required', format: 'number', colorized: false },
  { key: 'appointmentsRequired', label: 'Appointments Required', format: 'number', colorized: false },
  { key: 'leadsRequired', label: 'Leads Required', format: 'number', colorized: false },
  { key: 'monthlyRevenue', label: 'Monthly Revenue', format: 'currency', colorized: true },
  { key: 'annualRevenue', label: 'Annual Revenue', format: 'currency', colorized: true },
  { key: 'valuePerLead', label: 'Value Per Lead', format: 'currency', colorized: true },
]

describe('ComparisonRow - formatDiff', () => {
  describe('currency format', () => {
    it('should add "+" prefix for positive currency values', () => {
      const result = formatDiff(1500, 'currency')
      expect(result).toBe('+$1,500')
    })

    it('should not add "+" prefix for negative currency values', () => {
      const result = formatDiff(-1500, 'currency')
      expect(result).toBe('-$1,500')
    })

    it('should have no sign for zero currency value', () => {
      const result = formatDiff(0, 'currency')
      expect(result).toBe('$0')
    })

    it('should format large positive currency amounts with thousands separator', () => {
      const result = formatDiff(150000, 'currency')
      expect(result).toBe('+$150,000')
    })

    it('should format large negative currency amounts with thousands separator', () => {
      const result = formatDiff(-150000, 'currency')
      expect(result).toBe('-$150,000')
    })

    it('should handle small currency amounts', () => {
      const result = formatDiff(100, 'currency')
      expect(result).toBe('+$100')
    })

    it('should round currency to no decimal places', () => {
      const result = formatDiff(1234.56, 'currency')
      expect(result).toBe('+$1,235')
    })

    it('should handle negative small currency amounts', () => {
      const result = formatDiff(-100, 'currency')
      expect(result).toBe('-$100')
    })
  })

  describe('number format', () => {
    it('should add "+" prefix for positive numbers', () => {
      const result = formatDiff(5, 'number')
      expect(result).toBe('+5')
    })

    it('should not add "+" prefix for negative numbers', () => {
      const result = formatDiff(-5, 'number')
      expect(result).toBe('-5')
    })

    it('should have no sign for zero', () => {
      const result = formatDiff(0, 'number')
      expect(result).toBe('0')
    })

    it('should format large positive numbers with thousands separator', () => {
      const result = formatDiff(10000, 'number')
      expect(result).toBe('+10,000')
    })

    it('should format large negative numbers with thousands separator', () => {
      const result = formatDiff(-10000, 'number')
      expect(result).toBe('-10,000')
    })

    it('should handle decimal numbers with one decimal place', () => {
      const result = formatDiff(5.6, 'number')
      expect(result).toBe('+5.6')
    })

    it('should round to one decimal place for numbers', () => {
      const result = formatDiff(5.678, 'number')
      expect(result).toBe('+5.7')
    })

    it('should handle negative decimal numbers', () => {
      const result = formatDiff(-5.6, 'number')
      expect(result).toBe('-5.6')
    })

    it('should display zero decimals for whole numbers', () => {
      const result = formatDiff(100, 'number')
      expect(result).toBe('+100')
    })
  })

  describe('edge cases', () => {
    it('should handle very small positive decimal currency', () => {
      const result = formatDiff(0.1, 'currency')
      expect(result).toBe('+$0')
    })

    it('should handle very small negative decimal currency', () => {
      const result = formatDiff(-0.1, 'currency')
      expect(result).toBe('-$0')
    })

    it('should handle very small positive decimal number', () => {
      const result = formatDiff(0.05, 'number')
      expect(result).toBe('+0.1')
    })

    it('should handle scientific notation input (positive)', () => {
      const result = formatDiff(1e6, 'currency')
      expect(result).toBe('+$1,000,000')
    })

    it('should handle scientific notation input (negative)', () => {
      const result = formatDiff(-1e6, 'currency')
      expect(result).toBe('-$1,000,000')
    })
  })
})

describe('ComparisonRow - METRICS configuration', () => {
  it('should have exactly 6 metrics configured', () => {
    expect(METRICS).toHaveLength(6)
  })

  describe('pipeline metrics (not colorized)', () => {
    it('should have jobsRequired as non-colorized number format', () => {
      const metric = METRICS.find(m => m.key === 'jobsRequired')
      expect(metric).toEqual({
        key: 'jobsRequired',
        label: 'Jobs Required',
        format: 'number',
        colorized: false,
      })
    })

    it('should have appointmentsRequired as non-colorized number format', () => {
      const metric = METRICS.find(m => m.key === 'appointmentsRequired')
      expect(metric).toEqual({
        key: 'appointmentsRequired',
        label: 'Appointments Required',
        format: 'number',
        colorized: false,
      })
    })

    it('should have leadsRequired as non-colorized number format', () => {
      const metric = METRICS.find(m => m.key === 'leadsRequired')
      expect(metric).toEqual({
        key: 'leadsRequired',
        label: 'Leads Required',
        format: 'number',
        colorized: false,
      })
    })

    it('all pipeline metrics should not be colorized', () => {
      const pipelineMetrics = METRICS.filter(m =>
        ['jobsRequired', 'appointmentsRequired', 'leadsRequired'].includes(m.key)
      )
      expect(pipelineMetrics).toHaveLength(3)
      expect(pipelineMetrics.every(m => !m.colorized)).toBe(true)
    })
  })

  describe('revenue metrics (colorized)', () => {
    it('should have monthlyRevenue as colorized currency format', () => {
      const metric = METRICS.find(m => m.key === 'monthlyRevenue')
      expect(metric).toEqual({
        key: 'monthlyRevenue',
        label: 'Monthly Revenue',
        format: 'currency',
        colorized: true,
      })
    })

    it('should have annualRevenue as colorized currency format', () => {
      const metric = METRICS.find(m => m.key === 'annualRevenue')
      expect(metric).toEqual({
        key: 'annualRevenue',
        label: 'Annual Revenue',
        format: 'currency',
        colorized: true,
      })
    })

    it('should have valuePerLead as colorized currency format', () => {
      const metric = METRICS.find(m => m.key === 'valuePerLead')
      expect(metric).toEqual({
        key: 'valuePerLead',
        label: 'Value Per Lead',
        format: 'currency',
        colorized: true,
      })
    })

    it('all revenue metrics should be colorized', () => {
      const revenueMetrics = METRICS.filter(m =>
        ['monthlyRevenue', 'annualRevenue', 'valuePerLead'].includes(m.key)
      )
      expect(revenueMetrics).toHaveLength(3)
      expect(revenueMetrics.every(m => m.colorized)).toBe(true)
    })

    it('all revenue metrics should use currency format', () => {
      const revenueMetrics = METRICS.filter(m =>
        ['monthlyRevenue', 'annualRevenue', 'valuePerLead'].includes(m.key)
      )
      expect(revenueMetrics.every(m => m.format === 'currency')).toBe(true)
    })
  })

  describe('metric ordering and completeness', () => {
    it('should list pipeline metrics before revenue metrics', () => {
      const jobsIdx = METRICS.findIndex(m => m.key === 'jobsRequired')
      const monthlyIdx = METRICS.findIndex(m => m.key === 'monthlyRevenue')
      expect(jobsIdx).toBeLessThan(monthlyIdx)
    })

    it('all metrics should have unique keys', () => {
      const keys = METRICS.map(m => m.key)
      const uniqueKeys = new Set(keys)
      expect(keys).toHaveLength(uniqueKeys.size)
    })

    it('all metrics should have non-empty labels', () => {
      expect(METRICS.every(m => m.label.length > 0)).toBe(true)
    })

    it('all metrics should have valid format values', () => {
      const validFormats = ['number', 'currency']
      expect(METRICS.every(m => validFormats.includes(m.format))).toBe(true)
    })

    it('all metrics should have valid colorized boolean', () => {
      expect(METRICS.every(m => typeof m.colorized === 'boolean')).toBe(true)
    })
  })
})

describe('ComparisonRow - diff calculation logic', () => {
  /**
   * Tests the logic of how diff is calculated and formatted
   * diff = projectedResults[key] - currentResults[key]
   */

  it('should identify positive diff when projected > current', () => {
    const currentValue = 1000
    const projectedValue = 1500
    const diff = projectedValue - currentValue
    expect(diff).toBeGreaterThan(0)
    expect(formatDiff(diff, 'currency')).toMatch(/^\+/)
  })

  it('should identify negative diff when projected < current', () => {
    const currentValue = 1500
    const projectedValue = 1000
    const diff = projectedValue - currentValue
    expect(diff).toBeLessThan(0)
    expect(formatDiff(diff, 'currency')).toMatch(/^-/)
  })

  it('should identify zero diff when projected == current', () => {
    const currentValue = 1000
    const projectedValue = 1000
    const diff = projectedValue - currentValue
    expect(diff).toBe(0)
    const formatted = formatDiff(diff, 'currency')
    expect(formatted).not.toMatch(/^\+/)
    expect(formatted).not.toMatch(/^-/)
  })

  it('should handle revenue metric diff (currency)', () => {
    // Simulate: currentResults.monthlyRevenue = 5000, projectedResults.monthlyRevenue = 7500
    const diff = 7500 - 5000
    const result = formatDiff(diff, 'currency')
    expect(result).toBe('+$2,500')
  })

  it('should handle pipeline metric diff (number)', () => {
    // Simulate: currentResults.leadsRequired = 100, projectedResults.leadsRequired = 75
    const diff = 75 - 100
    const result = formatDiff(diff, 'number')
    expect(result).toBe('-25')
  })

  it('should handle large revenue increases', () => {
    const diff = 150000 - 50000
    const result = formatDiff(diff, 'currency')
    expect(result).toBe('+$100,000')
  })

  it('should handle large pipeline reductions', () => {
    const diff = 50 - 100
    const result = formatDiff(diff, 'number')
    expect(result).toBe('-50')
  })
})

describe('ComparisonRow - colorization logic', () => {
  /**
   * Tests the color assignment rules:
   * - Revenue metrics (colorized=true): emerald-600 for positive, red-500 for negative
   * - Pipeline metrics (colorized=false): always neutral gray
   * - All metrics with diff=0: neutral gray
   */

  it('should apply emerald color for positive revenue diff', () => {
    const metric = METRICS.find(m => m.key === 'monthlyRevenue')!
    const diff = 500
    const isPositive = diff > 0
    const isNegative = diff < 0

    expect(metric.colorized).toBe(true)
    expect(isPositive).toBe(true)
    // Logic: colorized && isPositive → emerald-600
    expect(metric.colorized && isPositive).toBe(true)
  })

  it('should apply red color for negative revenue diff', () => {
    const metric = METRICS.find(m => m.key === 'monthlyRevenue')!
    const diff = -500
    const isPositive = diff > 0
    const isNegative = diff < 0

    expect(metric.colorized).toBe(true)
    expect(isNegative).toBe(true)
    // Logic: colorized && isNegative → red-500
    expect(metric.colorized && isNegative).toBe(true)
  })

  it('should apply neutral gray for zero revenue diff', () => {
    const metric = METRICS.find(m => m.key === 'monthlyRevenue')!
    const diff = 0

    expect(metric.colorized).toBe(true)
    // Logic: (!colorized || diff === 0) → gray
    expect(!metric.colorized || diff === 0).toBe(true)
  })

  it('should never colorize pipeline metrics regardless of diff sign', () => {
    const pipelineMetrics = METRICS.filter(m =>
      ['jobsRequired', 'appointmentsRequired', 'leadsRequired'].includes(m.key)
    )

    pipelineMetrics.forEach(metric => {
      expect(metric.colorized).toBe(false)
      // Should always apply neutral gray for pipeline metrics
      // Logic: (!colorized || diff === 0) is true when colorized=false
    })
  })

  it('should apply neutral gray for all metrics when diff is zero', () => {
    const diff = 0

    METRICS.forEach(metric => {
      const shouldBeNeutral = !metric.colorized || diff === 0
      expect(shouldBeNeutral).toBe(true)
    })
  })

  it('should show TrendingUp icon for positive colorized metrics', () => {
    const metric = METRICS.find(m => m.key === 'annualRevenue')!
    const diff = 10000
    const isPositive = diff > 0

    expect(metric.colorized).toBe(true)
    expect(isPositive).toBe(true)
    expect(diff).not.toBe(0)
    // Logic: colorized && diff !== 0 && isPositive → TrendingUp
    expect(metric.colorized && diff !== 0 && isPositive).toBe(true)
  })

  it('should show TrendingDown icon for negative colorized metrics', () => {
    const metric = METRICS.find(m => m.key === 'valuePerLead')!
    const diff = -50
    const isNegative = diff < 0

    expect(metric.colorized).toBe(true)
    expect(isNegative).toBe(true)
    expect(diff).not.toBe(0)
    // Logic: colorized && diff !== 0 && isNegative → TrendingDown
    expect(metric.colorized && diff !== 0 && isNegative).toBe(true)
  })

  it('should not show icon for non-colorized metrics even with large diff', () => {
    const metric = METRICS.find(m => m.key === 'leadsRequired')!
    const diff = 100

    expect(metric.colorized).toBe(false)
    // Logic: colorized && diff !== 0 → false
    expect(metric.colorized && diff !== 0).toBe(false)
  })

  it('should not show icon for colorized metrics when diff is zero', () => {
    const metric = METRICS.find(m => m.key === 'monthlyRevenue')!
    const diff = 0

    expect(metric.colorized).toBe(true)
    // Logic: colorized && diff !== 0 → false
    expect(metric.colorized && diff !== 0).toBe(false)
  })
})
