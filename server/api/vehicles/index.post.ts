import type { Vehicle } from '~/types'

let vehicleCounter = 200

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const vehicle: Vehicle = {
    id: `v${vehicleCounter++}`,
    number: body.number,
    vin: body.vin,
    category: body.category,
    capacity: Number(body.capacity) || 0,
    photos: body.photos || [],
    createdAt: new Date().toISOString(),
  }

  return vehicle
})

