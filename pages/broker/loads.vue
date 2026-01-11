<template>
  <NuxtLayout name="app">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Мои грузы</h1>
      
      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">Загрузка...</div>
      </div>

      <div v-else-if="brokerStore.brokerLoads.length === 0" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">Грузы не найдены</div>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadCard
          v-for="load in brokerStore.brokerLoads"
          :key="load.id"
          :load="load"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const brokerStore = useBrokerStore()

const loading = ref(true)

onMounted(async () => {
  try {
    await brokerStore.fetchLoads()
  } catch (error) {
    console.error('Error fetching loads:', error)
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'Грузы - Панель брокера',
})
</script>

