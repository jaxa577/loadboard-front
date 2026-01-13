<template>
  <NuxtLink :to="`/loads/${load.id}`" class="card hover:shadow-lg transition-shadow duration-300 block">
    <div class="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-4">
      <div class="flex-1 w-full sm:w-auto">
        <h3 class="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-1 break-words">
          {{ load.originCity }}, {{ load.originCountry }} → {{ load.destinationCity }}, {{ load.destinationCountry }}
        </h3>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {{ getTruckTypeLabel(load.truckType) }}
        </p>
      </div>
      <div class="text-left sm:text-right w-full sm:w-auto">
        <div class="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
          {{ formatPrice(load.price) }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ getPaymentTypeLabel(load.paymentType) }}</div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
      <span>{{ load.weight }} кг</span>
      <span v-if="load.volume">{{ load.volume }} м³</span>
      <span class="truncate">{{ load.cargoType }}</span>
    </div>

    <div v-if="load.contactPhone" class="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
      <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
      </svg>
      <span class="truncate">{{ load.contactPhone }}</span>
    </div>

    <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <span>{{ formatDate(load.createdAt) }}</span>
      <span>{{ getStatusLabel(load.status) }}</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Load } from '~/types'

defineProps<{
  load: Load
}>()

const { t, locale } = useI18n()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat(locale.value).format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(locale.value)
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
</script>

