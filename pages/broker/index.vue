<template>
  <NuxtLayout name="app">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Панель брокера</h1>
      
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <NuxtLink to="/broker/clients" class="card hover:shadow-lg transition-shadow">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Клиенты</h3>
          <p class="text-gray-600 dark:text-gray-400">Управление клиентами</p>
        </NuxtLink>

        <NuxtLink to="/broker/loads" class="card hover:shadow-lg transition-shadow">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Грузы</h3>
          <p class="text-gray-600 dark:text-gray-400">Мои грузы</p>
        </NuxtLink>

        <NuxtLink to="/broker/deals" class="card hover:shadow-lg transition-shadow">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Сделки</h3>
          <p class="text-gray-600 dark:text-gray-400">История сделок</p>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'Панель брокера - SNG LoadBoard',
})
</script>

