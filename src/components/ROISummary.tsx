'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import type { CalculatedResults } from '@/lib/types'
import { calculateDelta } from '@/lib/calculations'
import { formatUSD } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ROISummaryProps {
  currentResults: CalculatedResults
  projectedResults: CalculatedResults
}

export function ROISummary({ currentResults, projectedResults }: ROISummaryProps) {
  const delta = calculateDelta(currentResults, projectedResults)
  const isAnnualPositive = delta.annualIncrease >= 0

  return (
    <section aria-live="polite" aria-atomic="true" className="mt-8">
      <Card className="border-l-[6px] border-l-[#3fb3d4] shadow-lg overflow-hidden bg-white">
        <div className="bg-[#595959] text-white px-6 py-3">
          <h2 className="font-heading text-xl font-bold flex items-center gap-2">
            Growth Summary
          </h2>
        </div>

        <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Hero annual number with growth icon */}
          <div className="flex-1 text-center md:text-left space-y-1">
            <p className="text-gray-500 font-semibold text-lg uppercase tracking-wide">
              Annual Revenue Increase
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <Image
                src="/roi-growth.png"
                alt=""
                width={64}
                height={64}
                className={cn(!isAnnualPositive && 'rotate-180 hue-rotate-180')}
              />
              <div>
                <p className={cn(
                  'font-heading text-5xl md:text-6xl font-extrabold tracking-tighter',
                  isAnnualPositive ? 'text-green-600' : 'text-[#ce2f29]'
                )}>
                  {isAnnualPositive ? '+' : '-'}{formatUSD(Math.abs(delta.annualIncrease))}
                </p>
                {delta.annualIncreasePercent !== 0 && (
                  <p className={cn(
                    'text-xl font-semibold mt-1',
                    isAnnualPositive ? 'text-green-500' : 'text-[#ce2f29]/80'
                  )}>
                    ({isAnnualPositive ? '+' : ''}{delta.annualIncreasePercent.toFixed(1)}% growth)
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full md:w-px md:h-24 bg-gray-200 hidden md:block" />

          {/* Supporting metrics */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-center md:text-left">
            <div>
              <p className="text-gray-500 font-medium mb-1">Monthly Revenue Delta</p>
              <div className="flex items-center justify-center md:justify-start gap-2">
                {delta.monthlyIncrease >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-[#ce2f29]" />
                )}
                <p className={cn(
                  'text-3xl font-bold',
                  delta.monthlyIncrease >= 0 ? 'text-green-600' : 'text-[#ce2f29]'
                )}>
                  {delta.monthlyIncrease >= 0 ? '+' : '-'}{formatUSD(Math.abs(delta.monthlyIncrease))}
                </p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">Value Per Lead Delta</p>
              <div className="flex items-center justify-center md:justify-start gap-2">
                {delta.valuePerLeadIncrease >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-[#ce2f29]" />
                )}
                <p className={cn(
                  'text-3xl font-bold',
                  delta.valuePerLeadIncrease >= 0 ? 'text-green-600' : 'text-[#ce2f29]'
                )}>
                  {delta.valuePerLeadIncrease >= 0 ? '+' : '-'}{formatUSD(Math.abs(delta.valuePerLeadIncrease))}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
