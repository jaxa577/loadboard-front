import type { User } from '~/types'

const mockUsers: User[] = [
  {
    id: '1',
    email: 'driver@example.com',
    name: 'Иван Водитель',
    role: 'driver',
    verified: true,
    verificationStatus: 'verified',
    rating: 4.8,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'broker@example.com',
    name: 'Алексей Брокер',
    role: 'broker',
    verified: true,
    verificationStatus: 'pending',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '10',
    email: 'provider@example.com',
    name: 'ООО Поставщик',
    role: 'provider',
    company: 'ООО Поставщик',
    verified: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, role } = body

  if (!email || !password || !role) {
    throw createError({
      statusCode: 400,
      message: 'Email, password и роль обязательны',
    })
  }

  const user = mockUsers.find((u) => u.email === email && u.role === role)

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'Пользователь не найден',
    })
  }

  return {
    user,
    token: `mock-token-${user.id}`,
    verificationRequired: role === 'driver' || role === 'broker',
  }
})

