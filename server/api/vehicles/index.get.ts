import type { Vehicle } from '~/types'

const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    number: 'A123BC77',
    vin: '1HGCM82633A123456',
    category: 'грузовик',
    capacity: 5000,
    photos: [],
    createdAt: '2024-02-01T10:00:00Z',
  },
]

export default defineEventHandler(() => {
  return mockVehicles
})

