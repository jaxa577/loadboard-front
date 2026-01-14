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

      <div class="flex items-center gap-3 mb-6 sm:mb-8">
        <LoadFilter class="flex-1" />

        <!-- View Toggle Buttons -->
        <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            @click="viewMode = 'grid'"
            :class="[
              'p-2 rounded-md transition-colors',
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            ]"
            :title="$t('view.grid')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="[
              'p-2 rounded-md transition-colors',
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            ]"
            :title="$t('view.list')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">{{ $t('common.loading') }}</div>
      </div>

      <div v-else-if="loadsStore.filteredLoads.length === 0" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">{{ $t('load.noLoads') }}</div>
      </div>

      <div v-else :class="viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6' : 'space-y-4'">
        <LoadCard
          v-for="load in loadsStore.filteredLoads"
          :key="load.id"
          :load="load"
          :view-mode="viewMode"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const loadsStore = useLoadsStore()

const loading = ref(true)
const viewMode = ref<'grid' | 'list'>('grid')

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

