export interface MetricInputs {
  revenueGoal: number      // monthly revenue target ($)
  averageTicket: number    // average $ per job
  closeRate: number        // 0-100, % of appointments that become jobs
  bookingRate: number      // 0-100, % of leads that become appointments
}

export interface CalculatedResults {
  jobsRequired: number
  appointmentsRequired: number
  leadsRequired: number
  monthlyRevenue: number
  annualRevenue: number
  valuePerLead: number
}

export interface DeltaResults {
  monthlyIncrease: number
  monthlyIncreasePercent: number
  annualIncrease: number
  annualIncreasePercent: number
  valuePerLeadIncrease: number
}
