<template>
  <NuxtLayout name="app">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Сделки</h1>
      
      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">Загрузка...</div>
      </div>

      <div v-else-if="brokerStore.deals.length === 0" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">Сделки не найдены</div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="deal in brokerStore.deals"
          :key="deal.id"
          class="card"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ deal.origin.city }} → {{ deal.destination.city }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ deal.cargoType }} • {{ deal.weight }} кг
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ formatDate(deal.createdAt) }}
              </p>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold text-primary-600 dark:text-primary-400">
                {{ formatPrice(deal.price) }} {{ deal.currency }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ getStatusLabel(deal.status) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const brokerStore = useBrokerStore()

const loading = ref(true)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU')
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Активен',
    assigned: 'Назначен',
    in_transit: 'В пути',
    completed: 'Завершен',
    cancelled: 'Отменен',
  }
  return labels[status] || status
}

onMounted(async () => {
  try {
    await brokerStore.fetchDeals()
  } catch (error) {
    console.error('Error fetching deals:', error)
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'Сделки - Панель брокера',
})
</script>

