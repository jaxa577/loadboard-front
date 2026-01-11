import type { User, UserRole } from '~/types'

let userIdCounter = 100

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { email, password, name, role, country, inn } = body

  if (!email || !password || !name || !role) {
    throw createError({
      statusCode: 400,
      message: 'Email, пароль, имя и роль обязательны',
    })
  }

  const validRoles: UserRole[] = ['driver', 'broker', 'provider']
  if (!validRoles.includes(role)) {
    throw createError({
      statusCode: 400,
      message: 'Недопустимая роль',
    })
  }

  const baseUser: User = {
    id: String(userIdCounter++),
    email,
    name,
    role,
    verified: false,
    verificationStatus: role === 'provider' ? 'verified' : 'pending',
    createdAt: new Date().toISOString(),
  }

  const user: User =
    role === 'provider'
      ? {
          ...baseUser,
          country,
          inn,
          orgName: body.orgName,
          orgAddress: body.orgAddress,
          orgOwner: body.orgOwner,
          orgRegistrationDate: body.orgRegistrationDate,
          company: body.orgName,
        }
      : baseUser

  return {
    user,
    token: `mock-token-${user.id}`,
    verificationRequired: role === 'driver' || role === 'broker',
  }
})

