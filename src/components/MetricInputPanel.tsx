'use client'

import { type ChangeEvent } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { NumberInput } from './NumberInput'
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

  const handleSlider = (field: keyof MetricInputs) => (e: ChangeEvent<HTMLInputElement>) => {
    updateField(field, Number(e.target.value))
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
          <RateSlider
            label="Close Rate"
            value={values.closeRate}
            onChange={handleSlider('closeRate')}
            isProjected={isProjected}
          />
          <RateSlider
            label="Booking Rate"
            value={values.bookingRate}
            onChange={handleSlider('bookingRate')}
            isProjected={isProjected}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function RateSlider({
  label,
  value,
  onChange,
  isProjected,
}: {
  label: string
  value: number
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  isProjected: boolean
}) {
  const pct = Math.round(value)
  const trackColor = isProjected ? '#3fb3d4' : '#595959'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#595959]">{label}</span>
        <span className={cn(
          'text-xl font-bold tabular-nums',
          isProjected ? 'text-[#3fb3d4]' : 'text-[#595959]'
        )}>
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={onChange}
        aria-label={label}
        className="slider-input"
        style={{
          background: `linear-gradient(to right, ${trackColor} ${pct}%, #e5e7eb ${pct}%)`,
        }}
      />
    </div>
  )
}
