export interface MetricInputs {
  monthlyLeads: number
  bookingRate: number    // 0-100 (percentage)
  closingRate: number    // 0-100 (percentage)
  averageTicket: number  // dollar amount
}

export interface CalculatedResults {
  bookedAppointments: number
  jobsWon: number
  monthlyRevenue: number
  annualRevenue: number
  valuePerLead: number
  valuePerJob: number
}

export interface DeltaResults {
  monthlyIncrease: number
  monthlyIncreasePercent: number
  annualIncrease: number
  annualIncreasePercent: number
  valuePerLeadIncrease: number
  valuePerJobIncrease: number
}
