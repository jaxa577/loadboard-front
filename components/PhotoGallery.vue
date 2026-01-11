<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Фотографии</h3>
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="(photo, index) in photos"
        :key="index"
        class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
      >
        <Icon name="heroicons:photo" class="w-12 h-12 text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  photos: string[]
}>()
</script>

