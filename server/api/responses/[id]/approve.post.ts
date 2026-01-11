import type { ResponseItem } from '~/types'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')!

  const response: ResponseItem = {
    id,
    loadId: '1',
    userId: '1',
    role: 'driver',
    status: 'approved',
    createdAt: new Date().toISOString(),
  }

  return response
})

