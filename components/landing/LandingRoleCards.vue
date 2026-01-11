<template>
  <section class="py-24 bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
        {{ $t('landing.roles.title') }}
      </h2>

      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div
          class="card hover:scale-105 transition-transform duration-300 cursor-pointer"
          @click="$router.push('/register')"
        >
          <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center mb-6">
            <Icon name="heroicons:truck" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {{ $t('landing.roles.driver.title') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Находите грузы, увеличивайте загрузку транспорта, работайте с проверенными отправителями
          </p>
          <ul class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li>• {{ $t('landing.roles.driver.feature1') }}</li>
            <li>• {{ $t('landing.roles.driver.feature2') }}</li>
            <li>• {{ $t('landing.roles.driver.feature3') }}</li>
          </ul>
        </div>

        <div
          class="card hover:scale-105 transition-transform duration-300 cursor-pointer"
          @click="$router.push('/register')"
        >
          <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center mb-6">
            <Icon name="heroicons:cube" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {{ $t('landing.roles.shipper.title') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Публикуйте грузы, находите надежных перевозчиков, контролируйте доставку
          </p>
          <ul class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li>• {{ $t('landing.roles.shipper.feature1') }}</li>
            <li>• {{ $t('landing.roles.shipper.feature2') }}</li>
            <li>• {{ $t('landing.roles.shipper.feature3') }}</li>
          </ul>
        </div>

        <div
          class="card hover:scale-105 transition-transform duration-300 cursor-pointer"
          @click="$router.push('/register')"
        >
          <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center mb-6">
            <Icon name="heroicons:briefcase" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {{ $t('landing.roles.broker.title') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Управляйте клиентами, назначайте водителей, получайте комиссию с каждой сделки
          </p>
          <ul class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li>• {{ $t('landing.roles.broker.feature1') }}</li>
            <li>• {{ $t('landing.roles.broker.feature2') }}</li>
            <li>• {{ $t('landing.roles.broker.feature3') }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

