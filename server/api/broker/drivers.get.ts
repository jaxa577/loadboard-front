import type { User } from '~/types'

const mockDrivers: User[] = [
  {
    id: '1',
    phone: '+79001234567',
    name: 'Иван Водитель',
    role: 'driver',
    email: 'driver@example.com',
    rating: 4.8,
    verified: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    phone: '+79001234571',
    name: 'Сергей Водитель',
    role: 'driver',
    email: 'driver2@example.com',
    rating: 4.5,
    verified: true,
    createdAt: '2024-01-05T00:00:00Z',
  },
]

export default defineEventHandler(async (event) => {
  return mockDrivers
})

