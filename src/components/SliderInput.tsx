'use client'

import { useId, type ChangeEvent } from 'react'
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
  const percent = ((value - min) / (max - min)) * 100

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

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
      <input
        id={id}
        type="range"
        aria-label={label}
        aria-valuetext={`${value}%`}
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className={cn(
          'w-full h-2 rounded-full appearance-none cursor-pointer',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md',
          '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md',
          isProjected
            ? '[&::-webkit-slider-thumb]:bg-[#3fb3d4] [&::-webkit-slider-thumb]:border-[#2980b9] [&::-moz-range-thumb]:bg-[#3fb3d4] [&::-moz-range-thumb]:border-[#2980b9]'
            : '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[#595959] [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[#595959]'
        )}
        style={{
          background: isProjected
            ? `linear-gradient(to right, #3fb3d4 0%, #3fb3d4 ${percent}%, #e5e7eb ${percent}%, #e5e7eb 100%)`
            : `linear-gradient(to right, #595959 0%, #595959 ${percent}%, #e5e7eb ${percent}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  )
}
