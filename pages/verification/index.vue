<template>
  <NuxtLayout name="app">
    <UContainer>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Верификация</h1>
          <p class="text-gray-500">Загрузите документы для подтверждения роли</p>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-6">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold">Driver</h3>
                <p class="text-sm text-gray-500">Права + селфи</p>
              </div>
              <UBadge :color="statusColor(driverStatus)" variant="solid">
                {{ statusLabel(driverStatus) }}
              </UBadge>
            </div>
          </template>

          <UForm :state="driverForm" @submit="submitDriver">
            <div class="space-y-4">
              <UFormGroup label="Права (лицевая)">
                <input type="file" class="hidden" ref="driverFront" @change="handleFile($event, 'driverFrontUrl')" />
                <UButton icon="i-heroicons-arrow-up-tray" @click.prevent="driverFront?.click()">Загрузить</UButton>
                <p v-if="driverForm.driverFrontUrl" class="text-xs text-gray-500 mt-1">Загружено</p>
              </UFormGroup>
              <UFormGroup label="Права (оборотная)">
                <input type="file" class="hidden" ref="driverBack" @change="handleFile($event, 'driverBackUrl')" />
                <UButton icon="i-heroicons-arrow-up-tray" @click.prevent="driverBack?.click()">Загрузить</UButton>
                <p v-if="driverForm.driverBackUrl" class="text-xs text-gray-500 mt-1">Загружено</p>
              </UFormGroup>
              <UFormGroup label="Селфи">
                <input type="file" class="hidden" ref="driverSelfie" @change="handleFile($event, 'driverSelfieUrl')" />
                <UButton icon="i-heroicons-arrow-up-tray" @click.prevent="driverSelfie?.click()">Загрузить</UButton>
                <p v-if="driverForm.driverSelfieUrl" class="text-xs text-gray-500 mt-1">Загружено</p>
              </UFormGroup>
            </div>

            <UDivider class="my-4" />

            <UButton type="submit" color="primary" :loading="loadingDriver">Отправить</UButton>
          </UForm>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold">Broker</h3>
                <p class="text-sm text-gray-500">Паспорт/ID + селфи</p>
              </div>
              <UBadge :color="statusColor(brokerStatus)" variant="solid">
                {{ statusLabel(brokerStatus) }}
              </UBadge>
            </div>
          </template>

          <UForm :state="brokerForm" @submit="submitBroker">
            <div class="space-y-4">
              <UFormGroup label="Паспорт / ID">
                <input type="file" class="hidden" ref="brokerPassport" @change="handleFile($event, 'brokerPassportUrl')" />
                <UButton icon="i-heroicons-arrow-up-tray" @click.prevent="brokerPassport?.click()">Загрузить</UButton>
                <p v-if="brokerForm.brokerPassportUrl" class="text-xs text-gray-500 mt-1">Загружено</p>
              </UFormGroup>
              <UFormGroup label="Селфи">
                <input type="file" class="hidden" ref="brokerSelfie" @change="handleFile($event, 'brokerSelfieUrl')" />
                <UButton icon="i-heroicons-arrow-up-tray" @click.prevent="brokerSelfie?.click()">Загрузить</UButton>
                <p v-if="brokerForm.brokerSelfieUrl" class="text-xs text-gray-500 mt-1">Загружено</p>
              </UFormGroup>
            </div>

            <UDivider class="my-4" />

            <UButton type="submit" color="primary" :loading="loadingBroker">Отправить</UButton>
          </UForm>
        </UCard>
      </div>
    </UContainer>
  </NuxtLayout>
</template>

<script setup lang="ts">
const verificationStore = useVerificationStore()
const uploader = useMockUpload()

const driverForm = reactive({
  driverFrontUrl: '',
  driverBackUrl: '',
  driverSelfieUrl: '',
})
const brokerForm = reactive({
  brokerPassportUrl: '',
  brokerSelfieUrl: '',
})

const driverFront = ref<HTMLInputElement | null>(null)
const driverBack = ref<HTMLInputElement | null>(null)
const driverSelfie = ref<HTMLInputElement | null>(null)
const brokerPassport = ref<HTMLInputElement | null>(null)
const brokerSelfie = ref<HTMLInputElement | null>(null)

const loadingDriver = ref(false)
const loadingBroker = ref(false)

const driverStatus = computed(() => verificationStore.statusByRole('driver') || 'pending')
const brokerStatus = computed(() => verificationStore.statusByRole('broker') || 'pending')

const handleFile = async (event: Event, key: keyof typeof driverForm | keyof typeof brokerForm) => {
  const files = (event.target as HTMLInputElement).files
  if (!files?.length) return
  const uploaded = await uploader.upload(files[0])
  if (key in driverForm) {
    // @ts-expect-error index access
    driverForm[key] = uploaded.url
  }
  if (key in brokerForm) {
    // @ts-expect-error index access
    brokerForm[key] = uploaded.url
  }
}

const submitDriver = async () => {
  loadingDriver.value = true
  await verificationStore.upload('driver', {
    front: driverForm.driverFrontUrl,
    back: driverForm.driverBackUrl,
    selfie: driverForm.driverSelfieUrl,
  })
  loadingDriver.value = false
}

const submitBroker = async () => {
  loadingBroker.value = true
  await verificationStore.upload('broker', {
    passport: brokerForm.brokerPassportUrl,
    selfie: brokerForm.brokerSelfieUrl,
  })
  loadingBroker.value = false
}

const statusLabel = (status: string | null) => {
  const map: Record<string, string> = {
    pending: 'Ожидание',
    verified: 'Подтвержден',
    rejected: 'Отклонен',
  }
  return map[status || 'pending']
}

const statusColor = (status: string | null) => {
  const map: Record<string, string> = {
    pending: 'gray',
    verified: 'green',
    rejected: 'red',
  }
  return map[status || 'pending']
}

useHead({
  title: 'Верификация - SNG LoadBoard',
})
</script>

