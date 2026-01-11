import type { Load } from '~/types'

let loadIdCounter = 100

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const load: Load = {
    id: String(loadIdCounter++),
    shipperId: body.shipperId || '2',
    brokerId: body.brokerId,
    origin: body.origin,
    destination: body.destination,
    title: body.title,
    weight: body.weight,
    volume: body.volume,
    dimensions: body.dimensions,
    cargoType: body.cargoType,
    price: body.price,
    currency: body.currency || 'RUB',
    distance: body.distance || 0,
    urgent: body.urgent || false,
    status: 'active',
    description: body.description,
    documents: body.documents || [],
    photos: body.photos || [],
    createdAt: new Date().toISOString(),
    pickupDate: body.pickupDate,
    deliveryDate: body.deliveryDate,
  }

  return load
})

