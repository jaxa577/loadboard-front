import type { ResponseItem } from '~/types'

let responseCounter = 300

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const response: ResponseItem = {
    id: `r${responseCounter++}`,
    loadId: body.loadId,
    userId: '1',
    role: body.role,
    status: 'sent',
    createdAt: new Date().toISOString(),
  }

  return response
})

