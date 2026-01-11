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
    id: '4',
    phone: '+79001234570',
    name: 'Админ',
    role: 'admin',
    email: 'admin@example.com',
    verified: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
]

export default defineEventHandler(async (event) => {
  // Mock: get user from header or default to first user
  const authHeader = getHeader(event, 'authorization')
  const userId = authHeader?.replace('Bearer mock-token-', '') || '1'
  
  const user = mockUsers.find((u) => u.id === userId)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  return user
})

