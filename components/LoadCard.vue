<template>
  <NuxtLink :to="`/loads/${load.id}`" :class="[
    'card hover:shadow-lg transition-shadow duration-300 block',
    viewMode === 'list' ? 'p-4 sm:p-6' : ''
  ]">
    <div v-if="viewMode === 'list'" class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
      <!-- Left: Route and Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start gap-2 mb-2">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white break-words">
            {{ load.originCity }}, {{ load.originCountry }} → {{ load.destinationCity }}, {{ load.destinationCountry }}
          </h3>
          <span v-if="load.priority" :class="getPriorityBadgeClass(load.priority)" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0">
            <component :is="getPriorityIcon(load.priority)" class="w-3 h-3" />
            {{ getPriorityLabel(load.priority) }}
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {{ getTruckTypeLabel(load.truckType) }}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            {{ load.weight }} кг
          </span>
          <span v-if="load.volume" class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            {{ load.volume }} м³
          </span>
          <span class="truncate">{{ load.cargoType }}</span>
        </div>

        <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span v-if="load.displayId" class="font-mono font-semibold text-primary-600 dark:text-primary-400">
            ID: {{ load.displayId }}
          </span>
          <span v-if="load.contactPhone" class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            {{ load.contactPhone }}
          </span>
          <span>{{ formatDate(load.createdAt) }}</span>
          <span>{{ getStatusLabel(load.status) }}</span>
        </div>
      </div>

      <!-- Right: Price -->
      <div class="flex-shrink-0 text-left sm:text-right">
        <div class="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
          <span v-if="load.negotiablePrice">Negotiable</span>
          <span v-else>{{ formatPrice(load.price, load.currency) }}</span>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">{{ getPaymentTypeLabel(load.paymentType) }}</div>
      </div>
    </div>

    <!-- Grid View (Original) -->
    <div v-else>
      <div class="flex flex-col gap-3 mb-4">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
              {{ load.originCity }}, {{ load.originCountry }} → {{ load.destinationCity }}, {{ load.destinationCountry }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ getTruckTypeLabel(load.truckType) }}
            </p>
          </div>
          <div class="flex-shrink-0 text-right">
            <div class="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400 whitespace-nowrap">
              <span v-if="load.negotiablePrice">Negotiable</span>
              <span v-else>{{ formatPrice(load.price, load.currency) }}</span>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ getPaymentTypeLabel(load.paymentType) }}</div>
          </div>
        </div>
        <div v-if="load.priority" class="flex items-center gap-2">
          <span :class="getPriorityBadgeClass(load.priority)" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
            <component :is="getPriorityIcon(load.priority)" class="w-3 h-3" />
            {{ getPriorityLabel(load.priority) }}
          </span>
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
        <div class="flex flex-wrap items-center gap-2">
          <span v-if="load.displayId" class="font-mono font-semibold text-primary-600 dark:text-primary-400">
            ID: {{ load.displayId }}
          </span>
          <span>{{ formatDate(load.createdAt) }}</span>
        </div>
        <span>{{ getStatusLabel(load.status) }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Load } from '~/types'

defineProps<{
  load: Load
  viewMode?: 'grid' | 'list'
}>()

const { t, locale } = useI18n()

const formatPrice = (price: number, currency: string = 'USD') => {
  const currencySymbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'RUB': '₽',
    'KZT': '₸',
    'CNY': '¥',
    'TRY': '₺',
    'KRW': '₩'
  }
  const symbol = currencySymbols[currency] || currency
  return `${new Intl.NumberFormat(locale.value).format(price)} ${symbol}`
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

const getPriorityLabel = (priority: string) => {
  return t(`priorities.${priority}`)
}

const getPriorityBadgeClass = (priority: string) => {
  const classes = {
    'LOW': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    'MEDIUM': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    'HIGH': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    'URGENT': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  }
  return classes[priority as keyof typeof classes] || classes.MEDIUM
}

const getPriorityIcon = (priority: string) => {
  return defineComponent({
    name: 'PriorityIcon',
    setup() {
      const icons = {
        'LOW': () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 14l-7 7m0 0l-7-7m7 7V3' })
        ]),
        'MEDIUM': () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 10l7-7m0 0l7 7m-7-7v18' })
        ]),
        'HIGH': () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 10l7-7m0 0l7 7m-7-7v18' })
        ]),
        'URGENT': () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' }, [
          h('path', { d: 'M13 10V3L4 14h7v7l9-11h-7z' })
        ])
      }
      return icons[priority as keyof typeof icons] || icons.MEDIUM
    }
  })
}
</script>

