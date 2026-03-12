import type { MetricInputs } from './types'

export const DEFAULTS: { current: MetricInputs; projected: MetricInputs } = {
  current: {
    monthlyLeads: 100,
    bookingRate: 60,
    closingRate: 40,
    averageTicket: 800,
  },
  projected: {
    monthlyLeads: 150,
    bookingRate: 75,
    closingRate: 55,
    averageTicket: 1200,
  },
}
