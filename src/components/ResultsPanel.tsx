import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { CalculatedResults } from '@/lib/types'
import { MetricOutput } from './MetricOutput'

interface ResultsPanelProps {
  title: string
  variant: 'current' | 'projected'
  results: CalculatedResults
  compareAgainst?: CalculatedResults
}

export function ResultsPanel({ title, variant, results, compareAgainst }: ResultsPanelProps) {
  const isProjected = variant === 'projected'

  const isHigher = (field: keyof CalculatedResults) => {
    if (!compareAgainst || !isProjected) return false
    return results[field] > compareAgainst[field]
  }

  return (
    <Card className="h-full bg-white shadow-sm">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="font-heading text-xl text-[#595959]">
          {title} Output
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 grid grid-cols-2 gap-x-8 gap-y-2">
        <MetricOutput
          label="Booked Appointments"
          value={results.bookedAppointments}
          format="number"
          highlight={isHigher('bookedAppointments')}
        />
        <MetricOutput
          label="Jobs Won"
          value={results.jobsWon}
          format="number"
          highlight={isHigher('jobsWon')}
        />
        <MetricOutput
          label="Monthly Revenue"
          value={results.monthlyRevenue}
          format="currency"
          highlight={isHigher('monthlyRevenue')}
        />
        <MetricOutput
          label="Annual Revenue"
          value={results.annualRevenue}
          format="currency"
          highlight={isHigher('annualRevenue')}
        />
        <MetricOutput
          label="Value Per Lead"
          value={results.valuePerLead}
          format="currency"
          highlight={isHigher('valuePerLead')}
        />
        <MetricOutput
          label="Value Per Job"
          value={results.valuePerJob}
          format="currency"
          highlight={isHigher('valuePerJob')}
        />
      </CardContent>
    </Card>
  )
}
