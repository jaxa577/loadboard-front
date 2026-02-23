<template>
  <section
    class="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-32"
  >
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1
          class="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in"
        >
          {{ $t("landing.hero.title") }}
        </h1>
        <p
          class="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-4 animate-slide-up"
        >
          {{ $t("landing.hero.subtitle") }}
        </p>
        <p
          class="text-xl text-gray-500 dark:text-gray-400 mb-12 animate-slide-up"
        >
          {{ $t("landing.hero.description") }}
        </p>
        <div
          class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
        >
          <NuxtLink to="/register" class="btn-primary text-lg px-8 py-4">
            {{ $t("landing.hero.createAccount") }}
          </NuxtLink>
          <NuxtLink to="/login" class="btn-secondary text-lg px-8 py-4">
            {{ $t("landing.hero.login") }}
          </NuxtLink>
        </div>
      </div>

      <!-- Abstract geometric shapes -->
      <div
        class="hidden sm:block absolute top-20 right-10 w-72 h-72 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-pulse"
      ></div>
      <div
        class="hidden sm:block absolute bottom-20 left-10 w-72 h-72 bg-primary-300 dark:bg-primary-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-pulse"
        style="animation-delay: 2s"
      ></div>
    </div>
  </section>
</template>
