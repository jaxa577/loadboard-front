import type { LoadApplication } from '~/types'

const mockApplications: LoadApplication[] = [
  {
    id: '1',
    loadId: '1',
    driverId: '1',
    status: 'pending',
    message: 'Готов взять груз',
    createdAt: '2024-01-15T11:00:00Z',
  },
  {
    id: '2',
    loadId: '2',
    driverId: '1',
    status: 'accepted',
    message: 'Могу выполнить перевозку',
    createdAt: '2024-01-16T09:00:00Z',
  },
]

export default defineEventHandler(async (event) => {
  return mockApplications
})

