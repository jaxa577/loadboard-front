<template>
  <NuxtLayout name="app">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
      <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" class="mb-4" @click="router.back()">
        {{ $t('common.back') }}
      </UButton>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div class="hidden md:block md:col-span-1">
          <ChatList />
        </div>
        <div class="col-span-1 md:col-span-2">
          <ChatWindow v-if="chatId" :chat-id="chatId" />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const chatStore = useChatStore()
const router = useRouter()

const chatId = computed(() => route.params.id as string)

onMounted(async () => {
  try {
    await chatStore.fetchChats()
    if (chatId.value) {
      await chatStore.fetchMessages(chatId.value)
    }
    chatStore.connect()
  } catch (error) {
    console.error('Error fetching chats:', error)
  }
})

onUnmounted(() => {
  chatStore.disconnect()
})

useHead({
  title: 'Чат - SNG LoadBoard',
})
</script>

