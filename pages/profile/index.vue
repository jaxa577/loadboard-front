<template>
  <NuxtLayout name="app">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">{{ $t('profile.profile') }}</h1>

      <div class="card mb-6">
        <div class="flex items-center space-x-6 mb-6">
          <div class="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <Icon name="heroicons:user" class="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ profileStore.profile?.name }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400">{{ profileStore.profile?.phone }}</p>
            <p v-if="profileStore.profile?.company" class="text-gray-600 dark:text-gray-400">
              {{ profileStore.profile.company }}
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <NuxtLink to="/profile/edit" class="btn-secondary">
            {{ $t('profile.editProfile') }}
          </NuxtLink>
          <NuxtLink to="/profile/docs" class="btn-secondary">
            {{ $t('common.documents', 'Documents') }}
          </NuxtLink>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('nav.myLoads') }}</h3>
          <NuxtLink to="/profile/loads" class="text-primary-600 dark:text-primary-400 hover:underline">
            {{ $t('common.viewAll', 'View all') }} →
          </NuxtLink>
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('profile.history') }}</h3>
          <NuxtLink to="/profile/history" class="text-primary-600 dark:text-primary-400 hover:underline">
            {{ $t('common.viewAll', 'View all') }} →
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const profileStore = useProfileStore()

onMounted(async () => {
  try {
    await profileStore.fetchProfile()
  } catch (error) {
    console.error('Error fetching profile:', error)
  }
})

useHead({
  title: 'Профиль - LoadBoard',
})
</script>

