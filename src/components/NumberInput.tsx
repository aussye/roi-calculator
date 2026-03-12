'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useId, useState, useEffect, type ChangeEvent } from 'react'
import { cn } from '@/lib/utils'

interface NumberInputProps {
  label: string
  value: number
  onChange: (val: number) => void
  prefix?: string
  suffix?: string
}

export function NumberInput({ label, value, onChange, prefix, suffix }: NumberInputProps) {
  const id = useId()
  const [raw, setRaw] = useState(String(value))

  // Sync raw display when value changes externally
  useEffect(() => {
    const parsed = parseFloat(raw)
    if (isNaN(parsed) || parsed !== value) {
      setRaw(String(value))
    }
  }, [value])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^0-9.]/g, '')
    setRaw(cleaned)
    const num = parseFloat(cleaned)
    onChange(isNaN(num) ? 0 : num)
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-semibold text-[#595959]">
        {label}
      </Label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-gray-500 font-semibold text-lg pointer-events-none">
            {prefix}
          </span>
        )}
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          value={raw}
          onChange={handleChange}
          className={cn(
            'h-14 text-xl font-bold shadow-sm',
            prefix && 'pl-8',
            suffix && 'pr-8'
          )}
        />
        {suffix && (
          <span className="absolute right-3 text-gray-500 font-semibold text-lg pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}
