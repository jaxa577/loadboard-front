<template>
  <NuxtLink :to="`/loads/${load.id}`" class="card hover:shadow-lg transition-shadow duration-300 block">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          {{ load.originCity }}, {{ load.originCountry }} → {{ load.destinationCity }}, {{ load.destinationCountry }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ getTruckTypeLabel(load.truckType) }}
        </p>
      </div>
      <div class="text-right">
        <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
          {{ formatPrice(load.price) }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ getPaymentTypeLabel(load.paymentType) }}</div>
      </div>
    </div>

    <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
      <span>{{ load.weight }} кг</span>
      <span v-if="load.volume">{{ load.volume }} м³</span>
      <span>{{ load.cargoType }}</span>
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

