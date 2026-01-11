import type { DriverRating } from '~/types'

const mockRatings: DriverRating[] = [
  {
    id: 'ra1',
    driverId: '1',
    providerId: '10',
    stars: 5,
    comment: 'Отличная доставка',
    providerName: 'ООО Поставщик',
    createdAt: '2024-02-01T15:00:00Z',
  },
]

export default defineEventHandler((event) => {
  const driverId = getRouterParam(event, 'driverId')
  return mockRatings.filter((r) => r.driverId === driverId)
})

