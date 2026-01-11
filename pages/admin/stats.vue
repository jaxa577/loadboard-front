<template>
  <NuxtLayout name="app">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Статистика</h1>
      <AdminStats />
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
  title: 'Статистика - Админ-панель',
})
</script>

