'use client'

import { useState } from 'react'
import { MetricInputPanel } from './MetricInputPanel'
import { ResultsPanel } from './ResultsPanel'
import { ROISummary } from './ROISummary'
import { calculateResults } from '@/lib/calculations'
import { DEFAULTS } from '@/lib/defaults'
import type { MetricInputs } from '@/lib/types'

export function Calculator() {
  const [currentMetrics, setCurrentMetrics] = useState<MetricInputs>(DEFAULTS.current)
  const [projectedMetrics, setProjectedMetrics] = useState<MetricInputs>(DEFAULTS.projected)

  const currentResults = calculateResults(currentMetrics)
  const projectedResults = calculateResults(projectedMetrics)

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Current */}
        <div className="flex flex-col gap-6">
          <MetricInputPanel
            title="Current Metrics"
            variant="current"
            values={currentMetrics}
            onChange={setCurrentMetrics}
          />
          <ResultsPanel
            title="Current"
            variant="current"
            results={currentResults}
          />
        </div>

        {/* Right Column: Projected */}
        <div className="flex flex-col gap-6">
          <MetricInputPanel
            title="Projected Metrics"
            variant="projected"
            values={projectedMetrics}
            onChange={setProjectedMetrics}
          />
          <ResultsPanel
            title="Projected"
            variant="projected"
            results={projectedResults}
            compareAgainst={currentResults}
          />
        </div>
      </div>

      <ROISummary
        currentResults={currentResults}
        projectedResults={projectedResults}
      />
    </div>
  )
}
