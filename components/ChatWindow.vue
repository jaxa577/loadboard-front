<template>
  <div class="card p-0 flex flex-col h-[500px] sm:h-[600px]">
    <!-- Chat Header -->
    <div class="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3 flex-1 min-w-0">
          <!-- Avatar -->
          <div class="relative flex-shrink-0">
            <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <span class="text-primary-600 dark:text-primary-400 font-semibold text-lg">
                {{ getInitials(currentChat?.otherUser?.name) }}
              </span>
            </div>
            <!-- Online status indicator -->
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>

          <!-- User Info -->
          <div class="flex-1 min-w-0">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
              {{ currentChat?.otherUser?.name || 'Загрузка...' }}
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ currentChat?.otherUser?.role ? $t(`roles.${currentChat.otherUser.role.toLowerCase()}`) : '' }}
            </p>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex items-center space-x-2">
          <UButton
            color="gray"
            variant="ghost"
            size="sm"
            icon="heroicons:ellipsis-vertical"
          >
          </UButton>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-900">
      <div v-if="loading" class="flex items-center justify-center h-full">
        <div class="text-gray-500 dark:text-gray-400">{{ $t('common.loading') }}</div>
      </div>
      <template v-else>
        <MessageBubble
          v-for="message in chatStore.messages"
          :key="message.id"
          :message="message"
        />
      </template>
    </div>

    <!-- Message Input -->
    <div class="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <MessageInput :chat-id="chatId" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  chatId: string
}>()

const chatStore = useChatStore()
const { t } = useI18n()
const loading = ref(true)
const messagesContainer = ref<HTMLElement | null>(null)

const currentChat = computed(() => {
  return chatStore.chats.find(c => c.id === props.chatId)
})

const getInitials = (name?: string) => {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

watch(() => chatStore.messages.length, () => {
  scrollToBottom()
})

onMounted(async () => {
  loading.value = true
  try {
    await chatStore.fetchMessages(props.chatId)
    chatStore.markAsRead(props.chatId)
    scrollToBottom()
  } catch (error) {
    console.error('Error fetching chat:', error)
  } finally {
    loading.value = false
  }
})
</script>

