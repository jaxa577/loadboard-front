<template>
  <div class="flex flex-wrap items-center gap-3">
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
      v-if="canManageLoad"
      color="gray"
      variant="outline"
      @click="editLoad"
    >
      {{ $t('common.edit') }}
    </UButton>
    <UButton
      v-if="canManageLoad && load.status !== 'ARCHIVED'"
      color="blue"
      variant="outline"
      icon="i-heroicons-archive-box"
      @click="showArchiveModal = true"
      :loading="archiving"
    >
      {{ $t('common.archive') }}
    </UButton>
    <UButton
      v-if="canManageLoad"
      color="red"
      variant="outline"
      icon="i-heroicons-trash"
      @click="showDeleteModal = true"
      :loading="deleting"
    >
      {{ $t('common.delete') }}
    </UButton>

    <!-- Archive Confirmation Modal -->
    <UModal v-model="showArchiveModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">{{ $t('load.archiveConfirmTitle') }}</h3>
        </template>
        <p class="text-gray-600 dark:text-gray-400">{{ $t('load.archiveConfirmMessage') }}</p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="ghost" @click="showArchiveModal = false">
              {{ $t('common.cancel') }}
            </UButton>
            <UButton color="blue" @click="archiveLoad" :loading="archiving">
              {{ $t('common.archive') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">{{ $t('load.deleteConfirmTitle') }}</h3>
        </template>
        <p class="text-gray-600 dark:text-gray-400">{{ $t('load.deleteConfirmMessage') }}</p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="ghost" @click="showDeleteModal = false">
              {{ $t('common.cancel') }}
            </UButton>
            <UButton color="red" @click="deleteLoad" :loading="deleting">
              {{ $t('common.delete') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
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
const archiving = ref(false)
const deleting = ref(false)
const showArchiveModal = ref(false)
const showDeleteModal = ref(false)

// Check if current user can manage this load
const canManageLoad = computed(() => {
  if (!authStore.currentUser) return false
  return (authStore.isShipper || authStore.isBroker) && props.load.shipperId === authStore.currentUser.id
})

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

const archiveLoad = async () => {
  archiving.value = true
  try {
    await loadsStore.archiveLoad(props.load.id)
    toast.success(t('load.archiveSuccess'))
    showArchiveModal.value = false
    emit('loadUpdated')
  } catch (error) {
    toast.handleApiError(error, t('load.archiveError'))
  } finally {
    archiving.value = false
  }
}

const deleteLoad = async () => {
  deleting.value = true
  try {
    await loadsStore.deleteLoad(props.load.id)
    toast.success(t('load.deleteSuccess'))
    showDeleteModal.value = false
    // Navigate back to loads list
    router.push('/loads')
  } catch (error) {
    toast.handleApiError(error, t('load.deleteError'))
  } finally {
    deleting.value = false
  }
}
</script>

