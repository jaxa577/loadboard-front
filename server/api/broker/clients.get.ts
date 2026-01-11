import type { BrokerClient } from '~/types'

const mockClients: BrokerClient[] = [
  {
    id: '1',
    userId: '2',
    name: 'Петр Отправитель',
    phone: '+79001234568',
    loadsCount: 15,
    totalRevenue: 500000,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    userId: '6',
    name: 'ООО Транспорт',
    phone: '+79001234572',
    loadsCount: 8,
    totalRevenue: 320000,
    createdAt: '2024-01-10T00:00:00Z',
  },
]

export default defineEventHandler(async (event) => {
  return mockClients
})

