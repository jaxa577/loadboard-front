<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo (Always Visible) -->
        <NuxtLink to="/" class="flex items-center z-10">
          <img src="~/assets/LB.svg" alt="LoadBord Logo" class="h-16 w-auto" />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <NuxtLink
            v-if="authStore.isAuthenticated"
            to="/loads"
            class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {{ $t('nav.loads') }}
          </NuxtLink>
          <NuxtLink
            v-if="authStore.isAuthenticated"
            to="/responses"
            class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {{ $t('nav.applications') }}
          </NuxtLink>
          <NuxtLink
            v-if="authStore.isAuthenticated"
            to="/chat"
            class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {{ $t('nav.messages') }}
          </NuxtLink>
          <NuxtLink
            v-if="authStore.isAuthenticated"
            to="/profile"
            class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {{ $t('nav.profile') }}
          </NuxtLink>
          <NuxtLink
            v-if="authStore.isAdmin"
            to="/admin"
            class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {{ $t('nav.admin') }}
          </NuxtLink>
        </nav>

        <!-- Desktop Actions -->
        <div class="hidden md:flex items-center space-x-4">
          <LanguageSwitcher />

          <button
            @click="toggleDark"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            <Icon name="heroicons:moon" class="w-5 h-5" v-if="!isDark" />
            <Icon name="heroicons:sun" class="w-5 h-5" v-else />
          </button>

          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
            <NuxtLink
              v-if="authStore.isShipper || authStore.isBroker"
              to="/create-load"
              class="btn-primary text-sm"
            >
              {{ $t('nav.createLoad') }}
            </NuxtLink>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ authStore.currentUser?.name }}
            </span>
            <button
              @click="authStore.logout()"
              class="btn-secondary text-sm"
            >
              {{ $t('nav.logout') }}
            </button>
          </div>
          <div v-else class="flex items-center space-x-2">
            <NuxtLink to="/login" class="btn-secondary text-sm">
              {{ $t('auth.login') }}
            </NuxtLink>
            <NuxtLink to="/register" class="btn-primary text-sm">
              {{ $t('auth.register') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <div class="flex items-center md:hidden z-10">
           <!-- Keep language switcher accessible outside the menu if preferred, but design requests moving *everything* except logo -->
          <button
            @click="isMobileMenuOpen = true"
            class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none"
            aria-label="Open mobile menu"
          >
            <Icon name="heroicons:bars-3" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar (USlideover) -->
    <USlideover v-model="isMobileMenuOpen" side="right" class="md:hidden">
      <div class="p-4 flex flex-col h-full bg-white dark:bg-gray-800">
        <!-- Sidebar Header -->
        <div class="flex items-center justify-between mb-8">
          <span class="text-xl font-bold text-gray-900 dark:text-white">Menu</span>
          <button
            @click="isMobileMenuOpen = false"
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <!-- Sidebar Navigation -->
        <nav class="flex flex-col space-y-4 flex-grow overflow-y-auto">
          <NuxtLink
            v-if="authStore.isAuthenticated"
            to="/loads"
            @click="isMobileMenuOpen = false"
            class="block text-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2 border-b border-gray-100 dark:border-gray-700"
          >
            {{ $t('nav.loads') }}
          </NuxtLink>
          <NuxtLink
            v-if="authStore.isAuthenticated"
            to="/responses"
            @click="isMobileMenuOpen = false"
            class="block text-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2 border-b border-gray-100 dark:border-gray-700"
          >
            {{ $t('nav.applications') }}
          </NuxtLink>
          <NuxtLink
            v-if="authStore.isAuthenticated"
            to="/chat"
            @click="isMobileMenuOpen = false"
            class="block text-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2 border-b border-gray-100 dark:border-gray-700"
          >
            {{ $t('nav.messages') }}
          </NuxtLink>
          <NuxtLink
            v-if="authStore.isAuthenticated"
            to="/profile"
            @click="isMobileMenuOpen = false"
            class="block text-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2 border-b border-gray-100 dark:border-gray-700"
          >
            {{ $t('nav.profile') }}
          </NuxtLink>
          <NuxtLink
            v-if="authStore.isAdmin"
            to="/admin"
            @click="isMobileMenuOpen = false"
            class="block text-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2 border-b border-gray-100 dark:border-gray-700"
          >
            {{ $t('nav.admin') }}
          </NuxtLink>
        </nav>

        <!-- Sidebar Footer Actions -->
        <div class="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Language</span>
            <LanguageSwitcher />
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
            <button
              @click="toggleDark"
              class="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors w-full justify-center"
            >
              <Icon name="heroicons:moon" class="w-5 h-5" v-if="!isDark" />
              <Icon name="heroicons:sun" class="w-5 h-5" v-else />
              <span class="text-sm font-medium">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
            </button>
          </div>

          <div v-if="authStore.isAuthenticated" class="space-y-3">
             <div class="flex items-center gap-3 mb-4">
                 <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
                     {{ authStore.currentUser?.name?.charAt(0).toUpperCase() || 'U' }}
                 </div>
                 <div class="flex flex-col">
                     <span class="text-sm font-medium text-gray-900 dark:text-white">{{ authStore.currentUser?.name }}</span>
                     <span class="text-xs text-gray-500 dark:text-gray-400">{{ authStore.currentUser?.role }}</span>
                 </div>
             </div>

            <NuxtLink
              v-if="authStore.isShipper || authStore.isBroker"
              to="/create-load"
              @click="isMobileMenuOpen = false"
              class="w-full btn-primary text-center justify-center block"
            >
              {{ $t('nav.createLoad') }}
            </NuxtLink>
            <button
              @click="() => { authStore.logout(); isMobileMenuOpen = false; }"
              class="w-full btn-secondary text-center justify-center block"
            >
              {{ $t('nav.logout') }}
            </button>
          </div>
          <div v-else class="flex flex-col space-y-3">
            <NuxtLink to="/login" @click="isMobileMenuOpen = false" class="w-full btn-secondary text-center block">
              {{ $t('auth.login') }}
            </NuxtLink>
            <NuxtLink to="/register" @click="isMobileMenuOpen = false" class="w-full btn-primary text-center block">
              {{ $t('auth.register') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </USlideover>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const authStore = useAuthStore()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const isMobileMenuOpen = ref(false)

const toggleDark = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

