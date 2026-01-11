import type { User } from '~/types'

const mockUsers: User[] = [
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
    id: '2',
    phone: '+79001234568',
    name: 'Петр Отправитель',
    role: 'shipper',
    email: 'shipper@example.com',
    company: 'ООО Грузы',
    verified: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    phone: '+79001234569',
    name: 'Алексей Брокер',
    role: 'broker',
    email: 'broker@example.com',
    company: 'Брокерская компания',
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
    verified: false,
    createdAt: '2024-01-05T00:00:00Z',
  },
]

export default defineEventHandler(async (event) => {
  return mockUsers
})

