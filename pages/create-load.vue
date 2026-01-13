<template>
  <NuxtLayout name="app">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-0">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
        {{ isEdit ? $t('load.editLoad') : $t('nav.createLoad') }}
      </h1>

      <LoadForm :load="load" @submit="handleSubmit" />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Load } from '~/types'

const route = useRoute()
const router = useRouter()
const loadsStore = useLoadsStore()
const { t } = useI18n()
const toast = useToastNotification()

const isEdit = computed(() => !!route.query.id)
const load = ref<Load | null>(null)

onMounted(async () => {
  if (isEdit.value) {
    try {
      const id = route.query.id as string
      load.value = await loadsStore.fetchLoad(id)
    } catch (error) {
      console.error('Error fetching load:', error)
      toast.handleApiError(error, t('load.fetchError'))
    }
  }
})

const handleSubmit = async (loadData: Partial<Load>) => {
  try {
    if (isEdit.value && load.value) {
      await loadsStore.updateLoad(load.value.id, loadData)
      toast.success(t('load.updateSuccess'))
    } else {
      await loadsStore.createLoad(loadData)
      toast.success(t('load.createSuccess'))
    }
    router.push('/loads')
  } catch (error) {
    toast.handleApiError(error, t('load.saveError'))
  }
}

useHead({
  title: isEdit.value ? 'Редактировать груз - SNG LoadBoard' : 'Создать груз - SNG LoadBoard',
})
</script>

