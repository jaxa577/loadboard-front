import type { Load } from '~/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  // Mock: return updated load
  const load: Load = {
    id: id!,
    shipperId: body.shipperId || '2',
    brokerId: body.brokerId,
    driverId: body.driverId,
    origin: body.origin,
    destination: body.destination,
    weight: body.weight,
    volume: body.volume,
    cargoType: body.cargoType,
    price: body.price,
    currency: body.currency || 'RUB',
    distance: body.distance || 0,
    urgent: body.urgent || false,
    status: body.status || 'active',
    description: body.description,
    documents: body.documents || [],
    photos: body.photos || [],
    createdAt: body.createdAt || new Date().toISOString(),
    pickupDate: body.pickupDate,
    deliveryDate: body.deliveryDate,
  }

  return load
})

