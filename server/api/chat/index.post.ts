import type { Chat } from '~/types'

let chatIdCounter = 100

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { participantId } = body

  const chat: Chat = {
    id: String(chatIdCounter++),
    participants: ['1', participantId], // Mock: current user + participant
    unreadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return chat
})

