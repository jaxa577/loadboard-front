import type { AdminStats } from '~/types'

export default defineEventHandler(async (event) => {
  const stats: AdminStats = {
    totalUsers: 150,
    totalLoads: 320,
    activeLoads: 45,
    completedLoads: 275,
    totalRevenue: 12500000,
    usersByRole: {
      driver: 80,
      shipper: 50,
      broker: 15,
      admin: 5,
    },
  }

  return stats
})

