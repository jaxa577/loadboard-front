<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
    <UCard class="max-w-lg w-full">
      <template #header>
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ $t('auth.loginTitle') }}</h1>
          <p class="text-sm text-gray-500">{{ $t('auth.loginTitle') }}</p>
        </div>
      </template>

      <UForm :state="form" @submit="onSubmit">
        <div class="space-y-4">
          <UFormGroup :label="$t('auth.email')" name="email">
            <UInput v-model="form.email" type="email" placeholder="you@example.com" required />
          </UFormGroup>

          <UFormGroup :label="$t('auth.password')" name="password">
            <UInput v-model="form.password" type="password" placeholder="••••••••" required />
          </UFormGroup>

          <UAlert
            v-if="error"
            color="red"
            variant="soft"
            :title="error"
            :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link' }"
            @close="error = ''"
          />

          <UButton
            type="submit"
            color="primary"
            :loading="loading"
            block
            size="xl"
            class="py-4 text-lg font-semibold"
          >
            {{ $t('auth.login') }}
          </UButton>
        </div>
      </UForm>

      <template #footer>
        <div class="space-y-2">
          <div class="text-sm text-gray-500">
            {{ $t('auth.dontHaveAccount') }}
            <NuxtLink to="/register" class="text-primary-600 dark:text-primary-400 font-medium">{{ $t('auth.register') }}</NuxtLink>
          </div>
          <div class="text-xs text-gray-400 border-t pt-2 mt-2">
            <p class="font-semibold mb-1">Test accounts:</p>
            <p>• {{ $t('roles.driver') }}: driver1@example.com / password123</p>
            <p>• {{ $t('roles.broker') }}: broker1@example.com / password123</p>
            <p>• {{ $t('roles.shipper') }}: shipper1@example.com / password123</p>
            <p>• {{ $t('roles.admin') }}: admin@loadboard.com / password123</p>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

// Redirect if already logged in
if (authStore.isAuthenticated) {
  navigateTo('/loads')
}

const form = reactive({
  email: '',
  password: '',
})
const loading = ref(false)
const error = ref('')

const onSubmit = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.loginWithEmail(form.email, form.password)

    // Redirect based on user role
    const role = authStore.userRole
    if (role === 'ADMIN' || role === 'admin') {
      router.push('/admin')
    } else {
      // All other users (drivers, brokers, shippers) go to loads page
      router.push('/loads')
    }
  } catch (e: any) {
    error.value = e.message || t('auth.loginError')
  } finally {
    loading.value = false
  }
}

const { t } = useI18n()

useHead({
  title: 'Вход - LoadBoard',
})
</script>
