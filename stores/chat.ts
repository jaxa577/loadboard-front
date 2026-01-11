import { defineStore } from 'pinia'
import type { Chat, Message } from '~/types'

const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'https://clb-back-production.up.railway.app/api/v1'

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [] as Chat[],
    currentChat: null as Chat | null,
    messages: [] as Message[],
    isConnected: false,
  }),

  getters: {
    sortedChats: (state) => {
      return [...state.chats].sort((a, b) => {
        const aTime = a.lastMessage?.createdAt || a.updatedAt
        const bTime = b.lastMessage?.createdAt || b.updatedAt
        return new Date(bTime).getTime() - new Date(aTime).getTime()
      })
    },
  },

  actions: {
    async fetchChats() {
      // Backend doesn't have chat list endpoint yet, return empty for now
      this.chats = []
      return []
    },

    async fetchMessages(userId: string) {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Not authenticated')

        const messages = await $fetch<Message[]>(`${apiBase}/chat/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.messages = messages
        return messages
      } catch (error) {
        console.error('Error fetching messages:', error)
        throw error
      }
    },

    async sendMessage(receiverId: string, content: string) {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Not authenticated')

        const message = await $fetch<Message>(`${apiBase}/chat/send`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: { receiverId, content },
        })
        this.messages.push(message)
        return message
      } catch (error) {
        console.error('Error sending message:', error)
        throw error
      }
    },

    async createChat(participantId: string) {
      // For now, just navigate to chat with that user
      // Backend uses userId-based endpoints, not separate chat entities
      return { id: participantId, participantId }
    },

    connect() {
      // Mock WebSocket connection using setInterval
      if (this.isConnected) return
      
      this.isConnected = true
      
      // Simulate receiving messages every 5 seconds
      const interval = setInterval(() => {
        if (!this.isConnected) {
          clearInterval(interval)
          return
        }
        
        // Randomly add a new message to simulate real-time updates
        if (Math.random() > 0.7 && this.chats.length > 0) {
          const randomChat = this.chats[Math.floor(Math.random() * this.chats.length)]
          if (randomChat && this.currentChat?.id !== randomChat.id) {
            randomChat.unreadCount++
          }
        }
      }, 5000)
    },

    disconnect() {
      this.isConnected = false
    },

    markAsRead(chatId: string) {
      const chat = this.chats.find((c) => c.id === chatId)
      if (chat) {
        chat.unreadCount = 0
      }
    },
  },
})

