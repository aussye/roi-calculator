import type { MetricInputs, CalculatedResults, DeltaResults } from './types'

export function calculateResults(inputs: MetricInputs): CalculatedResults {
  const bookingDecimal = inputs.bookingRate / 100
  const closingDecimal = inputs.closingRate / 100

  const bookedAppointments = inputs.monthlyLeads * bookingDecimal
  const jobsWon = bookedAppointments * closingDecimal
  const monthlyRevenue = jobsWon * inputs.averageTicket
  const annualRevenue = monthlyRevenue * 12
  const valuePerLead = inputs.monthlyLeads > 0
    ? monthlyRevenue / inputs.monthlyLeads
    : 0
  const valuePerJob = jobsWon > 0
    ? monthlyRevenue / jobsWon
    : 0

  return {
    bookedAppointments,
    jobsWon,
    monthlyRevenue,
    annualRevenue,
    valuePerLead,
    valuePerJob,
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
  const valuePerJobIncrease = projected.valuePerJob - current.valuePerJob

  return {
    monthlyIncrease,
    monthlyIncreasePercent,
    annualIncrease,
    annualIncreasePercent,
    valuePerLeadIncrease,
    valuePerJobIncrease,
  }
}
