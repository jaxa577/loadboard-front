<template>
  <section id="features" class="py-24 bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
        {{ $t('landing.features.title') }}
      </h2>

      <div class="grid md:grid-cols-3 gap-8">
        <div class="card hover:shadow-lg transition-shadow duration-300">
          <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
            <Icon name="heroicons:truck" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ $t('landing.features.drivers.title') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('landing.features.drivers.description') }}
          </p>
        </div>

        <div class="card hover:shadow-lg transition-shadow duration-300">
          <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
            <Icon name="heroicons:cube" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ $t('landing.features.shippers.title') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('landing.features.shippers.description') }}
          </p>
        </div>

        <div class="card hover:shadow-lg transition-shadow duration-300">
          <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
            <Icon name="heroicons:briefcase" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ $t('landing.features.brokers.title') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('landing.features.brokers.description') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

