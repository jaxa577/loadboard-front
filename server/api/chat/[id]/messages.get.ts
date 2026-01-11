import type { Message } from '~/types'

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      chatId: '1',
      senderId: '2',
      text: 'Здравствуйте, когда сможете забрать груз?',
      read: false,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      chatId: '1',
      senderId: '1',
      text: 'Добрый день! Могу забрать завтра утром',
      read: true,
      createdAt: '2024-01-15T10:35:00Z',
    },
    {
      id: '3',
      chatId: '1',
      senderId: '2',
      text: 'Отлично, жду вас',
      read: false,
      createdAt: '2024-01-15T10:40:00Z',
    },
  ],
  '2': [
    {
      id: '4',
      chatId: '2',
      senderId: '3',
      text: 'Есть новый груз для вас',
      read: true,
      createdAt: '2024-01-14T15:20:00Z',
    },
    {
      id: '5',
      chatId: '2',
      senderId: '1',
      text: 'Спасибо, посмотрю',
      read: true,
      createdAt: '2024-01-14T15:25:00Z',
    },
  ],
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return mockMessages[id || ''] || []
})

