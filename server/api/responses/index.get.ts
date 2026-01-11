import type { ResponseItem } from '~/types'

const mockResponses: ResponseItem[] = [
  {
    id: 'r1',
    loadId: '1',
    userId: '1',
    role: 'driver',
    status: 'sent',
    createdAt: '2024-02-01T12:00:00Z',
  },
]

export default defineEventHandler(() => {
  return mockResponses
})

