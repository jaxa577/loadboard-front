import type { User } from '~/types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const user: User = {
    id: '1',
    phone: body.phone || '+79001234567',
    name: body.name || 'Иван Водитель',
    role: body.role || 'driver',
    email: body.email,
    avatar: body.avatar,
    company: body.company,
    rating: body.rating || 4.8,
    verified: body.verified !== undefined ? body.verified : true,
    createdAt: '2024-01-01T00:00:00Z',
  }

  return user
})

