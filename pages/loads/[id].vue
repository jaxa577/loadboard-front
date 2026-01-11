<template>
  <NuxtLayout name="app">
    <div v-if="loading" class="text-center py-12">
      <div class="text-gray-500 dark:text-gray-400">{{ $t('common.loading') }}</div>
    </div>

    <div v-else-if="load" class="max-w-4xl mx-auto space-y-4">
      <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" @click="router.back()">
        {{ $t('common.back') }}
      </UButton>

      <div class="card mb-6">
        <div class="flex items-start justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {{ load.originCity }}, {{ $t(`countries.${load.originCountry}`) }} → {{ load.destinationCity }}, {{ $t(`countries.${load.destinationCountry}`) }}
            </h1>
            <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>{{ getTruckTypeLabel(load.truckType) }}</span>
              <span>{{ getPaymentTypeLabel(load.paymentType) }}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {{ formatPrice(load.price) }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ getPaymentTypeLabel(load.paymentType) }}</div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ $t('load.from') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ load.originCity }}, {{ $t(`countries.${load.originCountry}`) }}</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ $t('load.to') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ load.destinationCity }}, {{ $t(`countries.${load.destinationCountry}`) }}</p>
          </div>
        </div>

        <div class="grid md:grid-cols-4 gap-4 mb-6">
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ $t('load.weight') }}</div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ load.weight }} кг
            </div>
          </div>
          <div v-if="load.volume">
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ $t('load.volume') }}</div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ load.volume }} м³
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ $t('load.cargoType') }}</div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ load.cargoType }}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ $t('load.status') }}</div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ getStatusLabel(load.status) }}
            </div>
          </div>
        </div>

        <div v-if="load.loadingDate" class="mb-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ $t('load.loadingDate') }}</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ formatDate(load.loadingDate) }}</p>
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
  // Shipper can view applications on their own loads
  return authStore.isShipper && load.value.shipperId === authStore.currentUser.id
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

