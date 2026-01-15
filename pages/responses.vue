<template>
  <NuxtLayout name="app">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {{ pageTitle }}
      </h1>

      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">{{ $t('common.loading') }}</div>
      </div>

      <div v-else-if="applications.length === 0" class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">{{ $t('application.noApplications') }}</p>
      </div>

      <div v-else class="space-y-4">
        <!-- Driver View: Shows loads they applied to -->
        <div
          v-if="authStore.isDriver"
          v-for="app in applications"
          :key="app.id"
          class="card hover:shadow-lg transition-shadow"
        >
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <NuxtLink
                  :to="`/loads/${app.loadId}`"
                  class="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {{ app.load?.originCity }}, {{ $t(`countries.${app.load?.originCountry}`) }} →
                  {{ app.load?.destinationCity }}, {{ $t(`countries.${app.load?.destinationCountry}`) }}
                </NuxtLink>
                <UBadge :color="getStatusColor(app.status)" variant="soft">
                  {{ getStatusLabel(app.status) }}
                </UBadge>
              </div>

              <div class="grid md:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <span class="font-medium">{{ $t('load.price') }}:</span>
                  {{ formatPrice(app.load?.price) }}
                </div>
                <div>
                  <span class="font-medium">{{ $t('load.cargoType') }}:</span>
                  {{ app.load?.cargoType }}
                </div>
                <div>
                  <span class="font-medium">{{ $t('load.weight') }}:</span>
                  {{ app.load?.weight }} кг
                </div>
              </div>

              <p class="text-xs text-gray-500 mt-2">
                {{ $t('application.appliedAt') }}: {{ formatDate(app.createdAt) }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <UButton
                color="primary"
                variant="outline"
                size="sm"
                @click="openChat(app.load?.shipperId)"
              >
                {{ $t('nav.messages') }}
              </UButton>
              <UButton
                color="gray"
                variant="outline"
                size="sm"
                @click="viewLoad(app.loadId)"
              >
                {{ $t('common.view') }}
              </UButton>
            </div>
          </div>
        </div>

        <!-- Shipper/Broker View: Shows applications on their loads -->
        <div
          v-else
          v-for="app in applications"
          :key="app.id"
          class="card hover:shadow-lg transition-shadow"
        >
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <div class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ app.applicant?.name || 'Unknown' }}
                </div>
                <UBadge :color="getStatusColor(app.status)" variant="soft">
                  {{ getStatusLabel(app.status) }}
                </UBadge>
              </div>

              <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span class="font-medium">{{ $t('common.role') }}:</span>
                {{ $t(`roles.${app.role.toLowerCase()}`) }}
              </div>

              <NuxtLink
                :to="`/loads/${app.loadId}`"
                class="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                {{ app.load?.originCity }}, {{ $t(`countries.${app.load?.originCountry}`) }} →
                {{ app.load?.destinationCity }}, {{ $t(`countries.${app.load?.destinationCountry}`) }}
              </NuxtLink>

              <p class="text-xs text-gray-500 mt-2">
                {{ $t('application.appliedAt') }}: {{ formatDate(app.createdAt) }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <template v-if="app.status === 'PENDING'">
                <UButton
                  color="green"
                  size="sm"
                  @click="handleAccept(app.id)"
                  :loading="actionLoading === app.id"
                >
                  {{ $t('application.accept') }}
                </UButton>
                <UButton
                  color="red"
                  variant="outline"
                  size="sm"
                  @click="handleReject(app.id)"
                  :loading="actionLoading === app.id"
                >
                  {{ $t('application.reject') }}
                </UButton>
              </template>
              <UButton
                color="primary"
                :variant="app.status === 'ACCEPTED' ? 'solid' : 'outline'"
                size="sm"
                @click="openChat(app.applicantId)"
              >
                {{ $t('nav.messages') }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const authStore = useAuthStore()
const router = useRouter()
const toast = useToastNotification()
const config = useRuntimeConfig()

const applications = ref<any[]>([])
const loading = ref(true)
const actionLoading = ref<string | null>(null)

const pageTitle = computed(() => {
  if (authStore.isDriver) {
    return t('application.myApplications')
  }
  return t('application.applications')
})

const fetchApplications = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await $fetch(`${config.public.apiBase}/applications/my`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    applications.value = response as any[]
  } catch (error) {
    console.error('Error fetching applications:', error)
    toast.handleApiError(error, 'Error loading applications')
  } finally {
    loading.value = false
  }
}

const handleAccept = async (applicationId: string) => {
  actionLoading.value = applicationId
  try {
    const token = localStorage.getItem('token')
    const application = applications.value.find(app => app.id === applicationId)

    await $fetch(`${config.public.apiBase}/applications/${applicationId}/accept`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    toast.success(t('application.acceptSuccess') + ' - ' + t('application.messageSent'))
    await fetchApplications()

    // Open chat with the applicant after a short delay
    if (application) {
      setTimeout(() => {
        router.push(`/chat/${application.applicantId}`)
      }, 1500)
    }
  } catch (error) {
    toast.handleApiError(error, t('application.acceptError'))
  } finally {
    actionLoading.value = null
  }
}

const handleReject = async (applicationId: string) => {
  actionLoading.value = applicationId
  try {
    const token = localStorage.getItem('token')
    const application = applications.value.find(app => app.id === applicationId)

    await $fetch(`${config.public.apiBase}/applications/${applicationId}/reject`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    toast.success(t('application.rejectSuccess') + ' - ' + t('application.messageSent'))
    await fetchApplications()

    // Optionally open chat after rejection as well
    if (application) {
      setTimeout(() => {
        router.push(`/chat/${application.applicantId}`)
      }, 1500)
    }
  } catch (error) {
    toast.handleApiError(error, t('application.rejectError'))
  } finally {
    actionLoading.value = null
  }
}

const openChat = (userId: string) => {
  router.push(`/chat/${userId}`)
}

const viewLoad = (loadId: string) => {
  router.push(`/loads/${loadId}`)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'yellow'
    case 'ACCEPTED':
      return 'green'
    case 'REJECTED':
      return 'red'
    default:
      return 'gray'
  }
}

const getStatusLabel = (status: string) => {
  return t(`application.status.${status.toLowerCase()}`)
}

const formatPrice = (price: number) => {
  if (!price) return 'N/A'
  return new Intl.NumberFormat(locale.value).format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchApplications()
})

useHead({
  title: 'Заявки - SNG LoadBoard',
})
</script>
