<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    <UContainer class="py-6">
      <div class="grid lg:grid-cols-[260px_1fr] gap-6">
        <aside class="hidden lg:block sticky top-[88px] self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
          <UCard>
            <template #header>
              <div class="flex items-center space-x-3">
                <UAvatar :alt="authStore.currentUser?.name" size="lg" :text="avatarInitials" />
                <div>
                  <p class="font-semibold">{{ authStore.currentUser?.name || 'Гость' }}</p>
                  <p class="text-xs text-gray-500">{{ roleLabel }}</p>
                </div>
              </div>
            </template>
            <nav class="space-y-2">
              <UButton
                v-for="link in filteredLinks"
                :key="link.to"
                :to="link.to"
                color="gray"
                :variant="isActiveLink(link.to) ? 'solid' : 'ghost'"
                block
                :icon="link.icon"
                class="justify-start"
              >
                {{ link.label }}
              </UButton>
            </nav>
          </UCard>
        </aside>

        <main>
          <slot />
        </main>
      </div>
    </UContainer>

    <div class="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 lg:hidden">
      <div class="flex items-center justify-around p-2">
        <NuxtLink
          v-for="link in filteredLinks"
          :key="link.to"
          :to="link.to"
          :class="[
            'flex flex-col items-center text-xs',
            isActiveLink(link.to)
              ? 'text-primary-600 dark:text-primary-400 font-semibold'
              : 'text-gray-600 dark:text-gray-300'
          ]"
        >
          <Icon :name="link.icon" class="w-6 h-6 mb-1" />
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const { t } = useI18n()

const baseLinks = computed(() => [
  { label: t('nav.profile'), to: '/profile', icon: 'heroicons:user' },
  { label: t('nav.applications'), to: '/responses', icon: 'heroicons:inbox' },
  { label: t('nav.loads'), to: '/loads', icon: 'heroicons:rectangle-stack' },
  { label: t('nav.tracking'), to: '/tracking', icon: 'heroicons:map-pin' },
  { label: t('nav.messages'), to: '/chat', icon: 'heroicons:chat-bubble-left-right' },
])

const roleLinksMap = computed(() => ({
  driver: [
    ...baseLinks.value,
  ],
  broker: [...baseLinks.value],
  provider: [
    { label: t('nav.profile'), to: '/profile', icon: 'heroicons:user' },
    { label: t('nav.createLoad'), to: '/create-load', icon: 'heroicons:plus-circle' },
    { label: t('nav.myLoads'), to: '/loads', icon: 'heroicons:cube' },
    { label: t('nav.applications'), to: '/responses', icon: 'heroicons:inbox' },
    { label: t('nav.tracking'), to: '/tracking', icon: 'heroicons:map-pin' },
    { label: t('nav.messages'), to: '/chat', icon: 'heroicons:chat-bubble-left-right' },
  ],
}))

const filteredLinks = computed(() => {
  if (!authStore.userRole) return baseLinks.value
  return roleLinksMap.value[authStore.userRole] || baseLinks.value
})

const roleLabel = computed(() => {
  const roleKey = authStore.userRole || 'driver'
  return t(`roles.${roleKey}`)
})

const avatarInitials = computed(() => authStore.currentUser?.name?.slice(0, 2) || 'SN')

const route = useRoute()
const isActiveLink = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchCurrentUser().catch(() => {})
  }
})
</script>

