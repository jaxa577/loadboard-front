import type { Vehicle } from '~/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const vehicle: Vehicle = {
    id,
    number: body.number,
    vin: body.vin,
    category: body.category,
    capacity: Number(body.capacity) || 0,
    photos: body.photos || [],
    createdAt: body.createdAt || new Date().toISOString(),
  }

  return vehicle
})

