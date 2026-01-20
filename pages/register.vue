<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
    <UCard class="max-w-2xl w-full">
      <template #header>
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ $t('auth.registerTitle') }}</h1>
          <p class="text-sm text-gray-500">{{ $t('auth.createAccount') }}</p>
        </div>
      </template>

      <UForm :state="form" @submit="onSubmit">
        <div class="space-y-4">
          <UFormGroup :label="$t('auth.role')" name="role" required>
            <USelect v-model="form.role" :options="roles" option-attribute="label" value-attribute="value" />
          </UFormGroup>

          <UFormGroup :label="$t('auth.name')" name="name" required>
            <UInput v-model="form.name" :placeholder="$t('auth.namePlaceholder')" />
          </UFormGroup>

          <UFormGroup :label="$t('auth.email')" name="email" required>
            <UInput v-model="form.email" type="email" placeholder="you@example.com" />
          </UFormGroup>

          <UFormGroup :label="$t('auth.password')" name="password" required>
            <UInput v-model="form.password" type="password" placeholder="••••••••" />
            <template #help>
              <p class="text-xs text-gray-500">{{ $t('auth.passwordHelp') }}</p>
            </template>
          </UFormGroup>

          <UFormGroup :label="$t('auth.phone')" name="phone">
            <UInput v-model="form.phone" type="tel" placeholder="+7-999-123-4567" />
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
            {{ $t('auth.register') }}
          </UButton>
        </div>
      </UForm>

      <template #footer>
        <div class="space-y-2">
          <div class="text-sm text-gray-500">
            {{ $t('auth.haveAccount') }}
            <NuxtLink to="/login" class="text-primary-600 dark:text-primary-400 font-medium">{{ $t('auth.login') }}</NuxtLink>
          </div>
          <div class="text-xs text-gray-400 border-t pt-2 mt-2">
            <p class="font-semibold mb-1">{{ $t('auth.roleDescriptions') }}</p>
            <p>• <strong>{{ $t('roles.driver') }}:</strong> {{ $t('auth.driverDesc') }}</p>
            <p>• <strong>{{ $t('roles.broker') }}:</strong> {{ $t('auth.brokerDesc') }}</p>
            <p>• <strong>{{ $t('roles.shipper') }}:</strong> {{ $t('auth.shipperDesc') }}</p>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { UserRole } from '~/types'

const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()

// Redirect if already logged in
if (authStore.isAuthenticated) {
  navigateTo('/loads')
}

const form = reactive({
  role: 'driver' as UserRole,
  name: '',
  email: '',
  password: '',
  phone: '',
})

const loading = ref(false)
const error = ref('')

const roles = computed(() => [
  { label: t('roles.driver'), value: 'driver' },
  { label: t('roles.broker'), value: 'broker' },
  { label: t('roles.shipper'), value: 'provider' },
])

const onSubmit = async () => {
  loading.value = true
  error.value = ''

  // Validation
  if (!form.name || !form.email || !form.password) {
    error.value = t('auth.fillRequired')
    loading.value = false
    return
  }

  if (form.password.length < 6) {
    error.value = t('auth.passwordMinLength')
    loading.value = false
    return
  }

  try {
    await authStore.register(form)

    // Redirect based on user role
    const role = authStore.userRole
    if (role === 'ADMIN' || role === 'admin') {
      router.push('/admin')
    } else {
      // All other users (drivers, brokers, shippers) go to loads page
      router.push('/loads')
    }
  } catch (e: any) {
    error.value = e.message || t('auth.registerError')
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Регистрация - SNG LoadBoard',
})
</script>
