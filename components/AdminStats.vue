<template>
  <div v-if="adminStore.stats" class="grid md:grid-cols-4 gap-6">
    <div class="card">
      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ $t('admin.totalUsers') }}</div>
      <div class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ adminStore.stats.totalUsers }}
      </div>
    </div>

    <div class="card">
      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ $t('admin.totalLoads') }}</div>
      <div class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ adminStore.stats.totalLoads }}
      </div>
    </div>

    <div class="card">
      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ $t('admin.activeLoads') }}</div>
      <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
        {{ adminStore.stats.activeLoads }}
      </div>
    </div>

    <div class="card">
      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ $t('admin.revenue') }}</div>
      <div class="text-3xl font-bold text-green-600 dark:text-green-400">
        {{ formatPrice(adminStore.stats.totalRevenue) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const adminStore = useAdminStore()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}
</script>

