<template>
  <div
    :class="[
      'flex',
      isOwn ? 'justify-end' : 'justify-start'
    ]"
  >
    <div
      :class="[
        'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
        isOwn
          ? 'bg-primary-600 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
      ]"
    >
      <p class="text-sm">{{ message.content }}</p>
      <p
        :class="[
          'text-xs mt-1',
          isOwn ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
        ]"
      >
        {{ formatTime(message.createdAt) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '~/types'

const props = defineProps<{
  message: Message
}>()

const authStore = useAuthStore()

const isOwn = computed(() => {
  return props.message.senderId === authStore.currentUser?.id
})

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

