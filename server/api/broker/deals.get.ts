import type { Load } from '~/types'

const mockLoads: Load[] = [
  {
    id: '10',
    shipperId: '2',
    brokerId: '3',
    driverId: '1',
    origin: { city: 'Москва', address: 'ул. Ленина, 1' },
    destination: { city: 'Санкт-Петербург', address: 'пр. Невский, 100' },
    weight: 5000,
    cargoType: 'Мебель',
    price: 50000,
    currency: 'RUB',
    distance: 635,
    urgent: false,
    status: 'completed',
    description: 'Перевозка мебели',
    createdAt: '2024-01-01T10:00:00Z',
    pickupDate: '2024-01-02',
    deliveryDate: '2024-01-03',
  },
]

export default defineEventHandler(async (event) => {
  return mockLoads
})

