<template>
  <NuxtLayout name="app">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">История</h1>
      
      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">Загрузка...</div>
      </div>

      <div v-else-if="profileStore.history.length === 0" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">История пуста</div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="load in profileStore.history"
          :key="load.id"
          class="card"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ load.originCity }}, {{ load.originCountry }} → {{ load.destinationCity }}, {{ load.destinationCountry }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ load.cargoType }} • {{ load.weight }} кг
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ formatDate(load.createdAt) }}
              </p>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold text-primary-600 dark:text-primary-400">
                {{ formatPrice(load.price) }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ getStatusLabel(load.status) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const profileStore = useProfileStore()

const loading = ref(true)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU')
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    OPEN: 'Открыт',
    IN_PROGRESS: 'В пути',
    COMPLETED: 'Завершен',
    CANCELLED: 'Отменен',
  }
  return labels[status] || status
}

onMounted(async () => {
  try {
    await profileStore.fetchHistory()
  } catch (error) {
    console.error('Error fetching history:', error)
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'История - SNG LoadBoard',
})
</script>

