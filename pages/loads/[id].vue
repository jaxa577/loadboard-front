<template>
  <NuxtLayout name="app">
    <div v-if="loading" class="text-center py-12">
      <div class="text-gray-500 dark:text-gray-400">{{ $t('common.loading') }}</div>
    </div>

    <div v-else-if="load" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0 space-y-4">
      <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" @click="router.back()">
        {{ $t('common.back') }}
      </UButton>

      <div class="card mb-6">
        <div class="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words">
                {{ load.originCity }}, {{ $t(`countries.${load.originCountry}`) }} → {{ load.destinationCity }}, {{ $t(`countries.${load.destinationCountry}`) }}
              </h1>
              <span v-if="load.priority" :class="getPriorityBadgeClass(load.priority)" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0">
                <component :is="getPriorityIcon(load.priority)" class="w-4 h-4" />
                {{ getPriorityLabel(load.priority) }}
              </span>
            </div>
            <div class="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span>{{ getTruckTypeLabel(load.truckType) }}</span>
              <span>{{ getPaymentTypeLabel(load.paymentType) }}</span>
            </div>
          </div>
          <div class="text-left sm:text-right w-full sm:w-auto">
            <div class="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">
              {{ formatPrice(load.price) }}
            </div>
            <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ getPaymentTypeLabel(load.paymentType) }}</div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ $t('load.from') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ load.originCity }}, {{ $t(`countries.${load.originCountry}`) }}</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ $t('load.to') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ load.destinationCity }}, {{ $t(`countries.${load.destinationCountry}`) }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div>
            <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ $t('load.weight') }}</div>
            <div class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {{ load.weight }} кг
            </div>
          </div>
          <div v-if="load.volume">
            <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ $t('load.volume') }}</div>
            <div class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {{ load.volume }} м³
            </div>
          </div>
          <div>
            <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ $t('load.cargoType') }}</div>
            <div class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {{ load.cargoType }}
            </div>
          </div>
          <div>
            <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ $t('load.status') }}</div>
            <div class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {{ getStatusLabel(load.status) }}
            </div>
          </div>
        </div>

        <div v-if="load.loadingDate" class="mb-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ $t('load.loadingDate') }}</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ formatDate(load.loadingDate) }}</p>
        </div>

        <div v-if="load.contactPhone" class="mb-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ $t('load.contactPhone') }}</h3>
          <a :href="`tel:${load.contactPhone}`" class="flex items-center text-primary-600 dark:text-primary-400 hover:underline">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span class="text-lg">{{ load.contactPhone }}</span>
          </a>
        </div>

        <ActionButtons :load="load" @load-updated="refreshLoad" />
      </div>

      <PhotoGallery v-if="load.photos && load.photos.length > 0" :photos="load.photos" />

      <LoadApplications
        v-if="canViewApplications"
        :loadId="load.id"
        :canManageApplications="canManageApplications"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Load } from '~/types'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const loadsStore = useLoadsStore()
const authStore = useAuthStore()

const load = ref<Load | null>(null)
const loading = ref(true)

const canViewApplications = computed(() => {
  if (!load.value || !authStore.currentUser) return false
  // Shipper and Broker can view applications on their own loads
  return (authStore.isShipper || authStore.isBroker) && load.value.shipperId === authStore.currentUser.id
})

const canManageApplications = computed(() => {
  return canViewApplications.value
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat(locale.value).format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusLabel = (status: string) => {
  return t(`loadStatus.${status}`)
}

const getTruckTypeLabel = (truckType: string) => {
  return t(`truckTypes.${truckType}`)
}

const getPaymentTypeLabel = (paymentType: string) => {
  return t(`paymentTypes.${paymentType}`)
}

const getPriorityLabel = (priority: string) => {
  return t(`priorities.${priority}`)
}

const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case 'LOW':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    case 'MEDIUM':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    case 'HIGH':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
    case 'URGENT':
      return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getPriorityIcon = (priority: string) => {
  return h('svg', {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    viewBox: '0 0 24 24',
    xmlns: 'http://www.w3.org/2000/svg'
  }, [
    h('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      d: priority === 'LOW'
        ? 'M19 14l-7 7m0 0l-7-7m7 7V3' // Down arrow for LOW
        : priority === 'URGENT'
        ? 'M13 10V3L4 14h7v7l9-11h-7z' // Lightning bolt for URGENT
        : 'M5 10l7-7m0 0l7 7m-7-7v18' // Up arrow for MEDIUM and HIGH
    })
  ])
}

const refreshLoad = async () => {
  try {
    const id = route.params.id as string
    load.value = await loadsStore.fetchLoad(id)
  } catch (error) {
    console.error('Error fetching load:', error)
  }
}

onMounted(async () => {
  loading.value = true
  await refreshLoad()
  loading.value = false
})

useHead({
  title: 'Груз - SNG LoadBoard',
})
</script>

