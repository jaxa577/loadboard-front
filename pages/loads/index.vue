<template>
  <NuxtLayout name="app">
    <div class="px-4 sm:px-6 lg:px-0">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ $t('load.loads') }}</h1>
        <NuxtLink
          v-if="authStore.isShipper || authStore.isBroker"
          to="/create-load"
          class="btn-primary w-full sm:w-auto text-center whitespace-nowrap"
        >
          {{ $t('nav.createLoad') }}
        </NuxtLink>
      </div>

      <LoadFilter class="mb-6 sm:mb-8" />

      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">{{ $t('common.loading') }}</div>
      </div>

      <div v-else-if="loadsStore.filteredLoads.length === 0" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">{{ $t('load.noLoads') }}</div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <LoadCard
          v-for="load in loadsStore.filteredLoads"
          :key="load.id"
          :load="load"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const loadsStore = useLoadsStore()

const loading = ref(true)

onMounted(async () => {
  try {
    await loadsStore.fetchLoads()
  } catch (error) {
    console.error('Error fetching loads:', error)
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'Лента грузов - SNG LoadBoard',
})
</script>

