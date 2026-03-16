<template>
  <NuxtLayout name="app">
    <UContainer>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Оценки водителей</h1>
          <p class="text-gray-500">Оставьте отзыв после завершения заказа</p>
        </div>
      </div>

      <UCard class="mb-6">
        <UForm :state="form" @submit="onSubmit">
          <div class="grid md:grid-cols-3 gap-4">
            <UFormGroup label="ID водителя">
              <UInput v-model="form.driverId" placeholder="1" />
            </UFormGroup>
            <UFormGroup label="Оценка">
              <USelect v-model.number="form.stars" :options="[1,2,3,4,5]" />
            </UFormGroup>
            <UFormGroup label="Комментарий" class="md:col-span-3">
              <UTextarea v-model="form.comment" placeholder="Как прошла перевозка?" />
            </UFormGroup>
          </div>
          <UDivider class="my-4" />
          <UButton type="submit" color="primary" :loading="loading">Оставить оценку</UButton>
        </UForm>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">История оценок</h3>
        </template>
        <div class="space-y-3">
          <div
            v-for="rating in ratingsStore.ratings"
            :key="rating.id"
            class="border-b border-gray-100 dark:border-gray-800 pb-3"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold">Driver #{{ rating.driverId }}</p>
                <p class="text-sm text-gray-500">{{ rating.comment }}</p>
              </div>
              <div class="flex items-center space-x-1">
                <Icon v-for="i in 5" :key="i" :name="i <= rating.stars ? 'heroicons:star-20-solid' : 'heroicons:star'" class="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            <p class="text-xs text-gray-400 mt-1">От: {{ rating.providerName }} • {{ formatDate(rating.createdAt) }}</p>
          </div>
        </div>
      </UCard>
    </UContainer>
  </NuxtLayout>
</template>

<script setup lang="ts">
const ratingsStore = useRatingsStore()
const loading = ref(false)

const form = reactive({
  driverId: '',
  stars: 5,
  comment: '',
})

onMounted(() => {
  ratingsStore.fetchRatings()
})

const onSubmit = async () => {
  loading.value = true
  await ratingsStore.rate(form)
  loading.value = false
  form.driverId = ''
  form.stars = 5
  form.comment = ''
}

const formatDate = (date: string) => new Date(date).toLocaleString('ru-RU')

useHead({ title: 'Оценки - LoadBoard' })
</script>

