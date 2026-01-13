<template>
  <NuxtLayout name="app">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">{{ $t('nav.messages') }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div class="col-span-1 md:col-span-1">
          <ChatList />
        </div>
        <div class="hidden md:block md:col-span-2">
          <div class="card h-[600px] flex items-center justify-center">
            <div class="text-center text-gray-500 dark:text-gray-400">
              <Icon name="heroicons:chat-bubble-left-right" class="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>{{ $t('chat.selectChat') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const chatStore = useChatStore()

onMounted(async () => {
  try {
    await chatStore.fetchChats()
    chatStore.connect()
  } catch (error) {
    console.error('Error fetching chats:', error)
  }
})

onUnmounted(() => {
  chatStore.disconnect()
})

useHead({
  title: 'Чаты - SNG LoadBoard',
})
</script>

