<template>
  <NuxtLayout name="app">
    <div class="px-4 sm:px-6 lg:px-0">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ $t('load.loads') }}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ $t('load.totalLoads') }}: {{ loadsStore.totalLoads }}
          </p>
        </div>
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

      <div v-if="loadsStore.loading" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">{{ $t('common.loading') }}</div>
      </div>

      <div v-else-if="loadsStore.filteredLoads.length === 0" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">{{ $t('load.noLoads') }}</div>
      </div>

      <div v-else>
        <div :class="viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6' : 'space-y-4'">
          <LoadCard
            v-for="load in loadsStore.filteredLoads"
            :key="load.id"
            :load="load"
            :view-mode="viewMode"
          />
        </div>

        <!-- Infinite Scroll Trigger -->
        <div
          ref="loadMoreTrigger"
          class="py-8 flex justify-center"
        >
          <div v-if="loadsStore.loadingMore" class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ $t('common.loadingMore') }}</span>
          </div>
          <div v-else-if="!loadsStore.hasMorePages && loadsStore.filteredLoads.length > 0" class="text-gray-400 dark:text-gray-500 text-sm">
            {{ $t('load.allLoadsLoaded') }}
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const loadsStore = useLoadsStore()

const loadMoreTrigger = ref<HTMLElement | null>(null)

// Load view mode from localStorage or default to 'grid'
const getInitialViewMode = (): 'grid' | 'list' => {
  if (process.client) {
    const saved = localStorage.getItem('loadsViewMode')
    return (saved === 'list' || saved === 'grid') ? saved : 'grid'
  }
  return 'grid'
}

const viewMode = ref<'grid' | 'list'>(getInitialViewMode())

// Watch for changes and save to localStorage
watch(viewMode, (newMode) => {
  if (process.client) {
    localStorage.setItem('loadsViewMode', newMode)
  }
})

// Intersection Observer for infinite scroll
let observer: IntersectionObserver | null = null

const setupIntersectionObserver = () => {
  if (!process.client) return

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting && loadsStore.hasMorePages && !loadsStore.loadingMore) {
        loadsStore.loadMoreLoads()
      }
    },
    {
      rootMargin: '100px',
      threshold: 0.1,
    }
  )

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }
}

onMounted(async () => {
  try {
    await loadsStore.fetchLoads(1, 20, true)
  } catch (error) {
    console.error('Error fetching loads:', error)
  }

  // Setup intersection observer after initial load
  nextTick(() => {
    setupIntersectionObserver()
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

// Re-observe when the trigger element changes
watch(loadMoreTrigger, (newEl) => {
  if (observer && newEl) {
    observer.observe(newEl)
  }
})

useHead({
  title: 'Лента грузов - SNG LoadBoard',
})
</script>
