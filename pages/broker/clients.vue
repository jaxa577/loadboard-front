<template>
  <NuxtLayout name="app">
    <div>
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Клиенты</h1>
        <button class="btn-primary">Добавить клиента</button>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">Загрузка...</div>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="client in brokerStore.clients"
          :key="client.id"
          class="card"
        >
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ client.name }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ client.phone }}</p>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Грузов:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ client.loadsCount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Выручка:</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ formatPrice(client.totalRevenue) }} ₽
              </span>
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

onMounted(async () => {
  try {
    await brokerStore.fetchClients()
  } catch (error) {
    console.error('Error fetching clients:', error)
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'Клиенты - Панель брокера',
})
</script>

