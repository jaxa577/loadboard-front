<template>
  <UCard v-if="applications.length > 0 || loading">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ $t('application.applications') }} ({{ applications.length }})
      </h3>
    </template>

    <div v-if="loading" class="text-center py-4">
      <div class="text-gray-500 dark:text-gray-400">{{ $t('common.loading') }}</div>
    </div>

    <div v-else-if="applications.length === 0" class="text-center py-8">
      <p class="text-gray-500 dark:text-gray-400">{{ $t('application.noApplications') }}</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="app in applications"
        :key="app.id"
        class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <div class="font-semibold text-gray-900 dark:text-white">
                {{ app.applicant?.name || 'Unknown' }}
              </div>
              <UBadge
                :color="getStatusColor(app.status)"
                variant="soft"
              >
                {{ getStatusLabel(app.status) }}
              </UBadge>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p v-if="app.applicant?.company">
                <span class="font-medium">{{ $t('profile.company') }}:</span>
                {{ app.applicant.company }}
              </p>
              <p v-if="app.applicant?.phone">
                <span class="font-medium">{{ $t('auth.phone') }}:</span>
                {{ app.applicant.phone }}
              </p>
              <p v-if="app.applicant?.rating">
                <span class="font-medium">{{ $t('profile.rating') }}:</span>
                ⭐ {{ app.applicant.rating.toFixed(1) }}
              </p>
              <p>
                <span class="font-medium">{{ $t('common.role') }}:</span>
                {{ $t(`roles.${app.role.toLowerCase()}`) }}
              </p>
              <p class="text-xs text-gray-500">
                {{ $t('application.appliedAt') }}: {{ formatDate(app.createdAt) }}
              </p>
            </div>
          </div>

          <div v-if="canManageApplications && app.status === 'PENDING'" class="flex items-center space-x-2 ml-4">
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
          </div>

          <div v-else-if="app.status === 'ACCEPTED'" class="ml-4">
            <UButton
              color="primary"
              size="sm"
              @click="handleOpenChat(app.applicantId)"
            >
              {{ $t('nav.messages') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  loadId: string
  canManageApplications: boolean
}>()

const { t, locale } = useI18n()
const toast = useToastNotification()
const router = useRouter()
const config = useRuntimeConfig()

const applications = ref<any[]>([])
const loading = ref(true)
const actionLoading = ref<string | null>(null)

const fetchApplications = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await $fetch(`${config.public.apiBase}/loads/${props.loadId}/applications`, {
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
    await $fetch(`${config.public.apiBase}/applications/${applicationId}/accept`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    toast.success(t('application.acceptSuccess'))
    await fetchApplications()
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
    await $fetch(`${config.public.apiBase}/applications/${applicationId}/reject`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    toast.success(t('application.rejectSuccess'))
    await fetchApplications()
  } catch (error) {
    toast.handleApiError(error, t('application.rejectError'))
  } finally {
    actionLoading.value = null
  }
}

const handleOpenChat = (userId: string) => {
  router.push(`/chat/${userId}`)
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
</script>
