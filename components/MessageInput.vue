<template>
  <form @submit.prevent="sendMessage" class="flex items-center space-x-2">
    <input
      v-model="text"
      type="text"
      placeholder="Введите сообщение..."
      class="input flex-1"
    />
    <button
      type="submit"
      :disabled="!text.trim()"
      class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Отправить
    </button>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  chatId: string
}>()

const chatStore = useChatStore()
const toast = useToastNotification()

const text = ref('')

const sendMessage = async () => {
  if (!text.value.trim()) return

  try {
    await chatStore.sendMessage(props.chatId, text.value)
    text.value = ''
  } catch (error) {
    toast.handleApiError(error, 'Ошибка отправки сообщения')
  }
}
</script>

