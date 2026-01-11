import type { Load } from '~/types'

const mockLoads: Load[] = [
  {
    id: '1',
    shipperId: '2',
    origin: { city: 'Москва', address: 'ул. Ленина, 1' },
    destination: { city: 'Санкт-Петербург', address: 'пр. Невский, 100' },
    weight: 5000,
    volume: 20,
    cargoType: 'Мебель',
    price: 50000,
    currency: 'RUB',
    distance: 635,
    urgent: false,
    status: 'active',
    description: 'Перевозка мебели из Москвы в Санкт-Петербург',
    createdAt: '2024-01-15T10:00:00Z',
    pickupDate: '2024-01-20',
  },
  {
    id: '2',
    shipperId: '2',
    origin: { city: 'Казань', address: 'ул. Баумана, 50' },
    destination: { city: 'Екатеринбург', address: 'ул. Ленина, 25' },
    weight: 10000,
    cargoType: 'Стройматериалы',
    price: 80000,
    currency: 'RUB',
    distance: 800,
    urgent: true,
    status: 'active',
    description: 'Срочная перевозка стройматериалов',
    createdAt: '2024-01-16T08:00:00Z',
    pickupDate: '2024-01-18',
  },
]

export default defineEventHandler(async (event) => {
  return mockLoads
})

