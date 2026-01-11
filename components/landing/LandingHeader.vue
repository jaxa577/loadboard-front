<template>
  <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-20">
        <NuxtLink to="/" class="text-3xl font-bold text-primary-600 dark:text-primary-400">
          SNG LoadBoard
        </NuxtLink>

        <nav class="hidden md:flex items-center space-x-8">
          <a href="#features" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
            {{ $t('landing.features.title') }}
          </a>
          <a href="#how-it-works" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
            {{ $t('landing.howItWorks.title') }}
          </a>
          <a href="#faq" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
            {{ $t('landing.faq.title') }}
          </a>
        </nav>

        <div class="flex items-center space-x-4">
          <!-- Language Switcher -->
          <LanguageSwitcher />

          <!-- Show Profile button if logged in, otherwise show Login/Register -->
          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/profile" class="btn-primary">
              {{ $t('nav.profile') }}
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
              {{ $t('auth.login') }}
            </NuxtLink>
            <NuxtLink to="/register" class="btn-primary">
              {{ $t('auth.registerTitle') }}
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
</script>

