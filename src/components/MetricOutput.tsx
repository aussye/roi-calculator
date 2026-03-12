import { cn, formatUSD, formatNumber, formatPercent } from '@/lib/utils'

interface MetricOutputProps {
  label: string
  value: number
  format: 'currency' | 'number' | 'percent'
  highlight?: boolean
}

export function MetricOutput({ label, value, format, highlight = false }: MetricOutputProps) {
  let displayValue = ''
  if (format === 'currency') displayValue = formatUSD(value)
  else if (format === 'percent') displayValue = formatPercent(value)
  else displayValue = formatNumber(value)

  return (
    <div className="flex flex-col justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-500 mb-1">{label}</span>
      <span className={cn(
        'text-2xl font-bold tracking-tight',
        highlight ? 'text-green-600' : 'text-[#595959]'
      )}>
        {displayValue}
      </span>
    </div>
  )
}
