import type { LoadApplication } from '~/types'

let applicationIdCounter = 100

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { loadId, message } = body

  const application: LoadApplication = {
    id: String(applicationIdCounter++),
    loadId,
    driverId: '1', // Mock: current user
    status: 'pending',
    message,
    createdAt: new Date().toISOString(),
  }

  return application
})

