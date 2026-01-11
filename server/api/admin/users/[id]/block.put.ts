import type { User } from '~/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { blocked } = body

  // Mock: return user with blocked status
  const user: User = {
    id: id!,
    phone: '+79001234567',
    name: 'Иван Водитель',
    role: 'driver',
    email: 'driver@example.com',
    rating: 4.8,
    verified: !blocked,
    createdAt: '2024-01-01T00:00:00Z',
  }

  return user
})

