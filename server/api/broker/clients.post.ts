import type { BrokerClient } from '~/types'

let clientIdCounter = 100

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId } = body

  const client: BrokerClient = {
    id: String(clientIdCounter++),
    userId,
    name: 'Новый клиент',
    phone: '+79000000000',
    loadsCount: 0,
    totalRevenue: 0,
    createdAt: new Date().toISOString(),
  }

  return client
})

