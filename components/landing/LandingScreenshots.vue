<template>
  <section class="py-24 bg-gray-50 dark:bg-gray-800">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
        Интерфейс приложения
      </h2>
      
      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div class="card p-0 overflow-hidden">
          <div class="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 h-64 flex items-center justify-center">
            <Icon name="heroicons:rectangle-stack" class="w-24 h-24 text-primary-600 dark:text-primary-400 opacity-50" />
          </div>
          <div class="p-6">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Лента грузов</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Удобный поиск и фильтрация</p>
          </div>
        </div>

        <div class="card p-0 overflow-hidden">
          <div class="bg-gradient-to-br from-primary-200 to-primary-300 dark:from-primary-800 dark:to-primary-700 h-64 flex items-center justify-center">
            <Icon name="heroicons:chat-bubble-left-right" class="w-24 h-24 text-primary-600 dark:text-primary-400 opacity-50" />
          </div>
          <div class="p-6">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Чат</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Общение в реальном времени</p>
          </div>
        </div>

        <div class="card p-0 overflow-hidden">
          <div class="bg-gradient-to-br from-primary-300 to-primary-400 dark:from-primary-700 dark:to-primary-600 h-64 flex items-center justify-center">
            <Icon name="heroicons:chart-bar" class="w-24 h-24 text-primary-600 dark:text-primary-400 opacity-50" />
          </div>
          <div class="p-6">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Аналитика</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Статистика и отчеты</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

