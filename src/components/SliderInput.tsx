'use client'

import { useId } from 'react'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface SliderInputProps {
  label: string
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
  step?: number
  variant?: 'current' | 'projected'
}

export function SliderInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  variant = 'current',
}: SliderInputProps) {
  const id = useId()
  const isProjected = variant === 'projected'

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-semibold text-[#595959]">
          {label}
        </Label>
        <span
          className={cn(
            'text-xl font-bold tabular-nums',
            isProjected ? 'text-[#3fb3d4]' : 'text-[#595959]'
          )}
        >
          {value}%
        </span>
      </div>
      <Slider
        id={id}
        aria-label={label}
        aria-valuetext={`${value}%`}
        value={[value]}
        onValueChange={(vals) => {
          onChange(Array.isArray(vals) ? vals[0] : vals)
        }}
        min={min}
        max={max}
        step={step}
      />
    </div>
  )
}
