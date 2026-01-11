import type { Chat } from '~/types'

const mockChats: Chat[] = [
  {
    id: '1',
    participants: ['1', '2'],
    lastMessage: {
      id: '1',
      chatId: '1',
      senderId: '2',
      text: 'Здравствуйте, когда сможете забрать груз?',
      read: false,
      createdAt: '2024-01-15T10:30:00Z',
    },
    unreadCount: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    participants: ['1', '3'],
    lastMessage: {
      id: '2',
      chatId: '2',
      senderId: '3',
      text: 'Есть новый груз для вас',
      read: true,
      createdAt: '2024-01-14T15:20:00Z',
    },
    unreadCount: 0,
    createdAt: '2024-01-14T15:00:00Z',
    updatedAt: '2024-01-14T15:20:00Z',
  },
]

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const chat = mockChats.find((c) => c.id === id)

  if (!chat) {
    throw createError({
      statusCode: 404,
      message: 'Chat not found',
    })
  }

  return chat
})

