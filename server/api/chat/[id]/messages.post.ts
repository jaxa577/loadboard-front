import type { Message } from '~/types'

let messageIdCounter = 1000

export default defineEventHandler(async (event) => {
  const chatId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { text } = body

  const message: Message = {
    id: String(messageIdCounter++),
    chatId: chatId!,
    senderId: '1', // Mock: current user
    text,
    read: false,
    createdAt: new Date().toISOString(),
  }

  return message
})

