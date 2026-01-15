<template>
  <div class="card p-0">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Чаты</h2>
    </div>

    <div class="divide-y divide-gray-200 dark:divide-gray-700">
      <NuxtLink
        v-for="chat in chatStore.sortedChats"
        :key="chat.id"
        :to="`/chat/${chat.id}`"
        :class="[
          'block p-4 transition-colors relative',
          isActive(chat.id)
            ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
        ]"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1 min-w-0">
            <div :class="[
              'font-medium truncate',
              chat.unreadCount > 0 ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-900 dark:text-white'
            ]">
              {{ chat.otherUser?.name || 'Unknown User' }}
            </div>
            <div
              v-if="chat.lastMessage"
              :class="[
                'text-sm truncate',
                chat.unreadCount > 0
                  ? 'text-gray-700 dark:text-gray-300 font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              ]"
            >
              {{ chat.lastMessage.content }}
            </div>
          </div>
          <div v-if="chat.unreadCount > 0" class="ml-2 flex-shrink-0">
            <span class="bg-primary-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
              {{ chat.unreadCount > 99 ? '99+' : chat.unreadCount }}
            </span>
          </div>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span :class="chat.unreadCount > 0 ? 'text-gray-600 dark:text-gray-400 font-medium' : 'text-gray-400 dark:text-gray-500'">
            {{ formatDate(chat.updatedAt) }}
          </span>
          <Icon
            v-if="isActive(chat.id)"
            name="heroicons:chevron-right"
            class="w-4 h-4 text-primary-600 dark:text-primary-400"
          />
        </div>
      </NuxtLink>

      <div v-if="chatStore.sortedChats.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
        <Icon name="heroicons:chat-bubble-left-right" class="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p class="text-sm">Нет активных чатов</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const chatStore = useChatStore()
const route = useRoute()

const isActive = (chatId: string) => {
  return route.params.id === chatId
}

const formatDate = (date: string) => {
  const messageDate = new Date(date)
  const now = new Date()
  const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    return messageDate.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })
  } else if (diffInHours < 168) { // Less than a week
    return messageDate.toLocaleDateString('ru-RU', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } else {
    return messageDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    })
  }
}
</script>

