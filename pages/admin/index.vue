<template>
  <NuxtLayout name="app">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Админ-панель</h1>
      
      <AdminStats class="mb-8" />

      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <NuxtLink to="/admin/users" class="card hover:shadow-lg transition-shadow">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Пользователи</h3>
          <p class="text-gray-600 dark:text-gray-400">Управление пользователями</p>
        </NuxtLink>

        <NuxtLink to="/admin/loads" class="card hover:shadow-lg transition-shadow">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Грузы</h3>
          <p class="text-gray-600 dark:text-gray-400">Модерация грузов</p>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const adminStore = useAdminStore()

onMounted(async () => {
  try {
    await adminStore.fetchStats()
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
})

useHead({
  title: 'Админ-панель - LoadBoard',
})
</script>

