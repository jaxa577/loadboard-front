<template>
  <div class="flex items-center space-x-4">
    <UButton
      v-if="authStore.isDriver && load.status === 'OPEN' && !hasApplied"
      color="primary"
      @click="applyToLoad"
      :loading="loading"
    >
      {{ $t('load.apply') }}
    </UButton>
    <UButton
      v-if="authStore.isDriver && hasApplied"
      color="gray"
      variant="outline"
      disabled
    >
      {{ $t('load.alreadyApplied') }}
    </UButton>
    <UButton
      v-if="authStore.isShipper && load.shipperId === authStore.currentUser?.id"
      color="gray"
      variant="outline"
      @click="editLoad"
    >
      {{ $t('common.edit') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import type { Load } from '~/types'

const props = defineProps<{
  load: Load
}>()

const emit = defineEmits<{
  loadUpdated: []
}>()

const authStore = useAuthStore()
const loadsStore = useLoadsStore()
const router = useRouter()
const { t } = useI18n()
const toast = useToastNotification()
const loading = ref(false)

// Check if current user has already applied to this load
const hasApplied = computed(() => {
  if (!authStore.currentUser || !props.load.applications) return false
  return props.load.applications.some(
    (app: any) => app.applicantId === authStore.currentUser?.id
  )
})

const applyToLoad = async () => {
  loading.value = true
  try {
    await loadsStore.applyToLoad(props.load.id, 'DRIVER')
    toast.success(t('load.applySuccess'))
    // Refresh load to update applications
    await loadsStore.fetchLoad(props.load.id)
    // Emit event to parent to update UI
    emit('loadUpdated')
  } catch (error) {
    toast.handleApiError(error, t('load.applyError'))
  } finally {
    loading.value = false
  }
}

const editLoad = () => {
  router.push(`/create-load?id=${props.load.id}`)
}
</script>

