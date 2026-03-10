<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-2 text-2xl font-bold text-primary-600 dark:text-primary-400">
          <img src="/LB.svg" alt="LoadBord Logo" class="h-8 w-8" />
          LoadBord
        </NuxtLink>

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

        <div class="flex items-center space-x-4">
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
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const toggleDark = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

