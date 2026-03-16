<template>
  <NuxtLayout name="app">
    <UContainer>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Мои отклики</h1>
          <p class="text-gray-500">Статусы: sent / approved / rejected</p>
        </div>
      </div>

      <UCard>
        <div v-if="responsesStore.responses.length === 0" class="text-gray-500">
          Пока нет откликов
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="response in responsesStore.responses"
            :key="response.id"
            class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3"
          >
            <div>
              <p class="font-semibold">Заказ #{{ response.loadId }}</p>
              <p class="text-sm text-gray-500">Роль: {{ response.role }}</p>
              <p class="text-xs text-gray-400">Создано: {{ formatDate(response.createdAt) }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <UBadge :color="badgeColor(response.status)" variant="solid">{{ response.status }}</UBadge>
              <UButton
                v-if="canApprove && response.status === 'sent'"
                size="xs"
                color="primary"
                @click="approve(response.id)"
              >
                Выбрать исполнителя
              </UButton>
            </div>
          </div>
        </div>
      </UCard>
    </UContainer>
  </NuxtLayout>
</template>

<script setup lang="ts">
const responsesStore = useResponsesStore()
const authStore = useAuthStore()

onMounted(() => {
  responsesStore.fetchResponses()
})

const canApprove = computed(() => authStore.userRole === 'provider')

const badgeColor = (status: string) => {
  const map: Record<string, string> = {
    sent: 'gray',
    approved: 'green',
    rejected: 'red',
  }
  return map[status] || 'gray'
}

const formatDate = (date: string) => new Date(date).toLocaleString('ru-RU')

const approve = async (id: string) => {
  await responsesStore.approve(id)
}

useHead({ title: 'Мои отклики - LoadBoard' })
</script>

