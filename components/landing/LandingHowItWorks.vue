<template>
  <section id="how-it-works" class="py-24 bg-gray-50 dark:bg-gray-800">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
        {{ $t('landing.howItWorks.title') }}
      </h2>

      <div class="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
        <div class="text-center">
          <div class="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
            1
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {{ $t('landing.howItWorks.step1.title') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('landing.howItWorks.step1.description') }}
          </p>
        </div>

        <div class="text-center">
          <div class="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
            2
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {{ $t('landing.howItWorks.step2.title') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('landing.howItWorks.step2.description') }}
          </p>
        </div>

        <div class="text-center">
          <div class="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
            3
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {{ $t('landing.howItWorks.step3.title') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('landing.howItWorks.step3.description') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

