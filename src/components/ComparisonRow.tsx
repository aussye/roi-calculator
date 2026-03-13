import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { CalculatedResults } from '@/lib/types'
import { formatUSD, formatNumber, cn } from '@/lib/utils'

interface ComparisonRowProps {
  currentResults: CalculatedResults
  projectedResults: CalculatedResults
}

type MetricConfig = {
  key: keyof CalculatedResults
  label: string
  format: 'number' | 'currency'
  /** Revenue metrics: green = higher is better. Pipeline counts: neutral. */
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

function formatDiff(value: number, format: 'number' | 'currency'): string {
  const sign = value > 0 ? '+' : ''
  if (format === 'currency') return `${sign}${formatUSD(value)}`
  return `${sign}${formatNumber(value)}`
}

export function ComparisonRow({ currentResults, projectedResults }: ComparisonRowProps) {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="pt-4">
        <h3 className="font-heading text-lg font-semibold text-[#595959] mb-4">
          Metric Comparison
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {METRICS.map(({ key, label, format, colorized }) => {
            const diff = projectedResults[key] - currentResults[key]
            const isPositive = diff > 0
            const isNegative = diff < 0

            return (
              <div key={key} className="flex flex-col gap-1">
                <span className="text-xs font-medium text-[#595959]/70 uppercase tracking-wide">
                  {label}
                </span>
                <div className="flex items-center gap-1.5">
                  {colorized && diff !== 0 && (
                    isPositive
                      ? <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                      : <TrendingDown className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  <span
                    className={cn(
                      'text-lg font-bold tabular-nums',
                      colorized && isPositive && 'text-emerald-600',
                      colorized && isNegative && 'text-red-500',
                      (!colorized || diff === 0) && 'text-[#595959]'
                    )}
                  >
                    {formatDiff(diff, format)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
