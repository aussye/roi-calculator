import type { MetricInputs, CalculatedResults, DeltaResults } from './types'

export function calculateResults(inputs: MetricInputs): CalculatedResults {
  const closeDecimal = inputs.closeRate / 100
  const bookingDecimal = inputs.bookingRate / 100

  // Reverse math: revenue goal → jobs → appointments → leads
  const jobsRequired = inputs.averageTicket > 0
    ? inputs.revenueGoal / inputs.averageTicket
    : 0
  const appointmentsRequired = closeDecimal > 0
    ? jobsRequired / closeDecimal
    : 0
  const leadsRequired = bookingDecimal > 0
    ? appointmentsRequired / bookingDecimal
    : 0

  const monthlyRevenue = inputs.revenueGoal
  const annualRevenue = monthlyRevenue * 12
  const valuePerLead = leadsRequired > 0
    ? monthlyRevenue / leadsRequired
    : 0

  return {
    jobsRequired,
    appointmentsRequired,
    leadsRequired,
    monthlyRevenue,
    annualRevenue,
    valuePerLead,
  }
}

export function calculateDelta(
  current: CalculatedResults,
  projected: CalculatedResults
): DeltaResults {
  const monthlyIncrease = projected.monthlyRevenue - current.monthlyRevenue
  const monthlyIncreasePercent = current.monthlyRevenue > 0
    ? (monthlyIncrease / current.monthlyRevenue) * 100
    : 0
  const annualIncrease = projected.annualRevenue - current.annualRevenue
  const annualIncreasePercent = current.annualRevenue > 0
    ? (annualIncrease / current.annualRevenue) * 100
    : 0
  const valuePerLeadIncrease = projected.valuePerLead - current.valuePerLead

  return {
    monthlyIncrease,
    monthlyIncreasePercent,
    annualIncrease,
    annualIncreasePercent,
    valuePerLeadIncrease,
  }
}
