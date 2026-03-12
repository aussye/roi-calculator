import type { MetricInputs } from './types'

export const DEFAULTS: { current: MetricInputs; projected: MetricInputs } = {
  current: {
    revenueGoal: 50000,
    averageTicket: 800,
    closeRate: 40,
    bookingRate: 60,
  },
  projected: {
    revenueGoal: 100000,
    averageTicket: 1200,
    closeRate: 55,
    bookingRate: 75,
  },
}
