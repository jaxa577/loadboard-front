<template>
  <NuxtLayout name="app">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Редактировать профиль</h1>
      
      <div class="card">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Имя
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="input"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              v-model="formData.email"
              type="email"
              class="input"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Компания
            </label>
            <input
              v-model="formData.company"
              type="text"
              class="input"
            />
          </div>

          <div class="flex items-center justify-end space-x-4">
            <NuxtLink to="/profile" class="btn-secondary">
              Отмена
            </NuxtLink>
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const profileStore = useProfileStore()
const router = useRouter()

const loading = ref(false)

const formData = ref({
  name: profileStore.profile?.name || '',
  email: profileStore.profile?.email || '',
  company: profileStore.profile?.company || '',
})

onMounted(async () => {
  try {
    await profileStore.fetchProfile()
    if (profileStore.profile) {
      formData.value = {
        name: profileStore.profile.name,
        email: profileStore.profile.email || '',
        company: profileStore.profile.company || '',
      }
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
  }
})

const toast = useToastNotification()

const handleSubmit = async () => {
  loading.value = true
  try {
    await profileStore.updateProfile(formData.value)
    toast.success('Профиль успешно обновлен')
    router.push('/profile')
  } catch (error) {
    toast.handleApiError(error, 'Ошибка сохранения')
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Редактировать профиль - SNG LoadBoard',
})
</script>

