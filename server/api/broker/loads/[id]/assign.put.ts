import type { Load } from '~/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { driverId } = body

  const load: Load = {
    id: id!,
    shipperId: '2',
    brokerId: '3',
    driverId,
    origin: { city: 'Москва', address: 'ул. Ленина, 1' },
    destination: { city: 'Санкт-Петербург', address: 'пр. Невский, 100' },
    weight: 5000,
    cargoType: 'Мебель',
    price: 50000,
    currency: 'RUB',
    distance: 635,
    urgent: false,
    status: 'assigned',
    description: 'Перевозка мебели',
    createdAt: '2024-01-15T10:00:00Z',
    pickupDate: '2024-01-20',
  }

  return load
})

