'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { NumberInput } from './NumberInput'
import { SliderInput } from './SliderInput'
import type { MetricInputs } from '@/lib/types'
import { cn } from '@/lib/utils'

interface MetricInputPanelProps {
  title: string
  variant: 'current' | 'projected'
  values: MetricInputs
  onChange: (newValues: MetricInputs) => void
}

export function MetricInputPanel({ title, variant, values, onChange }: MetricInputPanelProps) {
  const isProjected = variant === 'projected'

  const updateField = (field: keyof MetricInputs, val: number) => {
    onChange({ ...values, [field]: val })
  }

  return (
    <Card className={cn(
      'overflow-hidden transition-all duration-200',
      isProjected && 'border-t-4 border-t-[#3fb3d4] shadow-md'
    )}>
      <CardHeader className={cn(
        'pb-4',
        isProjected ? 'bg-[#3fb3d415]' : 'bg-gray-50'
      )}>
        <CardTitle className="font-heading text-2xl font-bold flex items-center gap-2 text-[#595959]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <NumberInput
            label="Revenue Goal"
            value={values.revenueGoal}
            onChange={(v) => updateField('revenueGoal', v)}
            prefix="$"
          />
          <NumberInput
            label="Average Ticket"
            value={values.averageTicket}
            onChange={(v) => updateField('averageTicket', v)}
            prefix="$"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SliderInput
            label="Close Rate"
            value={values.closeRate}
            onChange={(v) => updateField('closeRate', v)}
            variant={variant}
          />
          <SliderInput
            label="Booking Rate"
            value={values.bookingRate}
            onChange={(v) => updateField('bookingRate', v)}
            variant={variant}
          />
        </div>
      </CardContent>
    </Card>
  )
}
