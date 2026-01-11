import type { Load } from '~/types'

const mockLoads: Load[] = [
  {
    id: '3',
    shipperId: '2',
    brokerId: '3',
    driverId: '1',
    origin: { city: 'Новосибирск', address: 'ул. Красный проспект, 1' },
    destination: { city: 'Красноярск', address: 'ул. Мира, 10' },
    weight: 15000,
    cargoType: 'Оборудование',
    price: 120000,
    currency: 'RUB',
    distance: 790,
    urgent: false,
    status: 'in_transit',
    description: 'Перевозка промышленного оборудования',
    createdAt: '2024-01-10T12:00:00Z',
    pickupDate: '2024-01-12',
  },
  {
    id: '5',
    shipperId: '2',
    brokerId: '3',
    origin: { city: 'Владивосток', address: 'ул. Светланская, 1' },
    destination: { city: 'Хабаровск', address: 'ул. Муравьева-Амурского, 1' },
    weight: 8000,
    cargoType: 'Электроника',
    price: 95000,
    currency: 'RUB',
    distance: 760,
    urgent: true,
    status: 'assigned',
    description: 'Срочная перевозка электроники',
    createdAt: '2024-01-18T09:00:00Z',
    pickupDate: '2024-01-19',
  },
]

export default defineEventHandler(async (event) => {
  return mockLoads
})

