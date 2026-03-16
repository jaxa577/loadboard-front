<template>
  <NuxtLayout name="app">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Документы</h1>
      
      <div class="card">
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Загрузите необходимые документы для верификации
        </p>

        <div class="space-y-4">
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <Icon name="heroicons:document-arrow-up" class="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p class="text-gray-600 dark:text-gray-400 mb-2">Перетащите файлы сюда или</p>
            <button class="btn-secondary">Выбрать файлы</button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'Документы - LoadBoard',
})
</script>

