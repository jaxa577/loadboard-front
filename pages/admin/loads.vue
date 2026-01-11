<template>
  <NuxtLayout name="app">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Грузы</h1>
      
      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">Загрузка...</div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="load in adminStore.loads"
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
            </div>
            <div class="flex items-center space-x-4">
              <NuxtLink :to="`/loads/${load.id}`" class="btn-secondary text-sm">
                Просмотр
              </NuxtLink>
              <button
                @click="handleDelete(load.id)"
                class="btn-secondary text-sm bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const adminStore = useAdminStore()
const toast = useToastNotification()

const loading = ref(true)

const handleDelete = async (loadId: string) => {
  if (!confirm('Вы уверены, что хотите удалить груз?')) return

  try {
    await adminStore.deleteLoad(loadId)
    toast.success('Груз успешно удален')
  } catch (error) {
    toast.handleApiError(error, 'Ошибка удаления груза')
  }
}

onMounted(async () => {
  try {
    await adminStore.fetchLoads()
  } catch (error) {
    console.error('Error fetching loads:', error)
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'Грузы - Админ-панель',
})
</script>

