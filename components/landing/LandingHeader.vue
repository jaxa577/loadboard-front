<template>
  <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-20">
        <NuxtLink to="/" class="flex items-center z-10">
          <img src="~/assets/LB.svg" alt="SNG LoadBoard Logo" class="h-16 w-auto" />
        </NuxtLink>

        <!-- Desktop Navigation & Auth & Lang -->
        <div class="hidden md:flex items-center space-x-8 w-full justify-between ml-8">
            <nav class="flex items-center space-x-8">
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
              <LanguageSwitcher />

              <button
                @click="toggleDark"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                <Icon name="heroicons:moon" class="w-5 h-5" v-if="!isDark" />
                <Icon name="heroicons:sun" class="w-5 h-5" v-else />
              </button>

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

        <!-- Mobile Menu Button (Only logo and burger remain in header on mobile) -->
        <div class="flex md:hidden items-center z-10">
          <button @click="mobileMenuOpen = true" class="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none">
            <Icon name="heroicons:bars-3" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Sidebar -->
    <USlideover v-model="mobileMenuOpen" side="right" class="md:hidden">
      <div class="p-4 flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
        <!-- Sidebar Header -->
        <div class="flex items-center justify-between mb-8">
          <span class="text-xl font-bold text-gray-900 dark:text-white">Menu</span>
          <button
            @click="mobileMenuOpen = false"
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <!-- Sidebar Navigation -->
        <nav class="flex flex-col space-y-4 flex-grow overflow-y-auto">
          <a href="#features" @click="mobileMenuOpen = false" class="block text-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2 border-b border-gray-100 dark:border-gray-800">
            {{ $t('landing.features.title') }}
          </a>
          <a href="#how-it-works" @click="mobileMenuOpen = false" class="block text-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2 border-b border-gray-100 dark:border-gray-800">
            {{ $t('landing.howItWorks.title') }}
          </a>
          <a href="#faq" @click="mobileMenuOpen = false" class="block text-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2 border-b border-gray-100 dark:border-gray-800">
            {{ $t('landing.faq.title') }}
          </a>
        </nav>

        <!-- Sidebar Footer Actions -->
        <div class="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800 space-y-6">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Language</span>
            <LanguageSwitcher />
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
            <button
              @click="toggleDark"
              class="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full justify-center"
            >
              <Icon name="heroicons:moon" class="w-5 h-5" v-if="!isDark" />
              <Icon name="heroicons:sun" class="w-5 h-5" v-else />
              <span class="text-sm font-medium">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
            </button>
          </div>

          <div class="flex flex-col space-y-3">
            <template v-if="authStore.isAuthenticated">
              <NuxtLink to="/profile" class="w-full btn-primary text-center block" @click="mobileMenuOpen = false">
                {{ $t('nav.profile') }}
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="w-full btn-secondary text-center block" @click="mobileMenuOpen = false">
                {{ $t('auth.login') }}
              </NuxtLink>
              <NuxtLink to="/register" class="w-full btn-primary text-center block" @click="mobileMenuOpen = false">
                {{ $t('auth.registerTitle') }}
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </USlideover>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const toggleDark = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

// Close mobile menu when route changes
const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

