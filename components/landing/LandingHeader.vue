<template>
  <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-20">
        <NuxtLink to="/" class="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">
          SNG LoadBoard
        </NuxtLink>

        <!-- Desktop Navigation -->
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

        <!-- Desktop Auth Buttons -->
        <div class="hidden md:flex items-center space-x-4">
          <LanguageSwitcher />

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

        <!-- Mobile Menu Button -->
        <div class="flex md:hidden items-center space-x-2">
          <LanguageSwitcher />
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600">
            <Icon :name="mobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
        <nav class="flex flex-col space-y-4">
          <a href="#features" @click="mobileMenuOpen = false" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
            {{ $t('landing.features.title') }}
          </a>
          <a href="#how-it-works" @click="mobileMenuOpen = false" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
            {{ $t('landing.howItWorks.title') }}
          </a>
          <a href="#faq" @click="mobileMenuOpen = false" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
            {{ $t('landing.faq.title') }}
          </a>

          <div class="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col space-y-3">
            <template v-if="authStore.isAuthenticated">
              <NuxtLink to="/profile" class="btn-primary text-center" @click="mobileMenuOpen = false">
                {{ $t('nav.profile') }}
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="btn-outline text-center" @click="mobileMenuOpen = false">
                {{ $t('auth.login') }}
              </NuxtLink>
              <NuxtLink to="/register" class="btn-primary text-center" @click="mobileMenuOpen = false">
                {{ $t('auth.registerTitle') }}
              </NuxtLink>
            </template>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

// Close mobile menu when route changes
const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

