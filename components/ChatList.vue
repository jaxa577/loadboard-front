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
        class="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1">
            <div class="font-medium text-gray-900 dark:text-white">
              Чат #{{ chat.id }}
            </div>
            <div v-if="chat.lastMessage" class="text-sm text-gray-500 dark:text-gray-400 truncate">
              {{ chat.lastMessage.text }}
            </div>
          </div>
          <div v-if="chat.unreadCount > 0" class="ml-2">
            <span class="bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {{ chat.unreadCount }}
            </span>
          </div>
        </div>
        <div class="text-xs text-gray-400 dark:text-gray-500">
          {{ formatDate(chat.updatedAt) }}
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const chatStore = useChatStore()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

