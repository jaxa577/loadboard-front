<template>
  <div class="card p-0 flex flex-col h-[600px]">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Чат #{{ chatId }}</h2>
    </div>
    
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <MessageBubble
        v-for="message in chatStore.messages"
        :key="message.id"
        :message="message"
      />
    </div>
    
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <MessageInput :chat-id="chatId" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  chatId: string
}>()

const chatStore = useChatStore()

onMounted(async () => {
  try {
    await chatStore.fetchMessages(props.chatId)
    chatStore.markAsRead(props.chatId)
  } catch (error) {
    console.error('Error fetching chat:', error)
  }
})
</script>

