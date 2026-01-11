<template>
  <UForm @submit.prevent="handleSubmit">
    <div class="space-y-6">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('load.route') }}</h3>
        </template>
        <div class="grid md:grid-cols-2 gap-4">
          <UFormGroup :label="$t('load.originCountry')" required>
            <USelect v-model="formData.originCountry" :options="countries" :placeholder="$t('load.selectCountry')" />
          </UFormGroup>
          <UFormGroup :label="$t('load.originCity')" required>
            <UInput v-model="formData.originCity" placeholder="Moscow" />
          </UFormGroup>
          <UFormGroup :label="$t('load.destinationCountry')" required>
            <USelect v-model="formData.destinationCountry" :options="countries" :placeholder="$t('load.selectCountry')" />
          </UFormGroup>
          <UFormGroup :label="$t('load.destinationCity')" required>
            <UInput v-model="formData.destinationCity" placeholder="Almaty" />
          </UFormGroup>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('load.cargoDetails') }}</h3>
        </template>
        <div class="grid md:grid-cols-2 gap-4">
          <UFormGroup :label="$t('load.cargoType')" required>
            <UInput v-model="formData.cargoType" placeholder="Electronics, Furniture, etc." />
          </UFormGroup>
          <UFormGroup :label="$t('load.truckType')" required>
            <USelect v-model="formData.truckType" :options="truckTypes" />
          </UFormGroup>
          <UFormGroup :label="$t('load.weight')" required>
            <UInput v-model.number="formData.weight" type="number" placeholder="5000" />
          </UFormGroup>
          <UFormGroup :label="$t('load.volume')">
            <UInput v-model.number="formData.volume" type="number" placeholder="20" />
          </UFormGroup>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('load.terms') }}</h3>
        </template>
        <div class="grid md:grid-cols-2 gap-4">
          <UFormGroup :label="$t('load.price')" required>
            <UInput v-model.number="formData.price" type="number" placeholder="50000" />
          </UFormGroup>
          <UFormGroup :label="$t('load.paymentType')" required>
            <USelect v-model="formData.paymentType" :options="paymentTypes" />
          </UFormGroup>
          <UFormGroup :label="$t('load.loadingDate')" required>
            <UInput v-model="formData.loadingDate" type="date" />
          </UFormGroup>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('load.photos') }}</h3>
        </template>
        <FileUpload
          :label="$t('load.uploadPhotos')"
          :max-files="10"
          :max-size-m-b="5"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          accepted-formats-text="JPG, PNG, WEBP (max 5MB each)"
          v-model="formData.photos"
        />
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('load.documents') }}</h3>
        </template>
        <FileUpload
          :label="$t('load.uploadDocuments')"
          :max-files="5"
          :max-size-m-b="10"
          accept="image/jpeg,image/jpg,image/png,application/pdf"
          accepted-formats-text="PDF, JPG, PNG (max 10MB each)"
          v-model="formData.documents"
        />
      </UCard>

      <div class="flex items-center justify-end space-x-3">
        <UButton color="gray" variant="outline" to="/loads">{{ $t('common.cancel') }}</UButton>
        <UButton type="submit" color="primary">{{ props.load ? $t('common.save') : $t('common.create') }}</UButton>
      </div>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { Load } from '~/types'

const props = defineProps<{
  load?: Load | null
}>()

const emit = defineEmits<{
  submit: [data: any]
}>()

const { t } = useI18n()
const authStore = useAuthStore()
const toast = useToastNotification()

const countries = ['Russia', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Belarus', 'Tajikistan', 'Turkmenistan', 'Azerbaijan', 'Armenia', 'Georgia', 'Moldova']

const truckTypes = computed(() => [
  { label: t('truckTypes.TENT'), value: 'TENT' },
  { label: t('truckTypes.REFRIGERATOR'), value: 'REFRIGERATOR' },
  { label: t('truckTypes.CONTAINER'), value: 'CONTAINER' },
  { label: t('truckTypes.PLATFORM'), value: 'PLATFORM' },
  { label: t('truckTypes.TANK'), value: 'TANK' },
])

const paymentTypes = computed(() => [
  { label: t('paymentTypes.CASH'), value: 'CASH' },
  { label: t('paymentTypes.CARD'), value: 'CARD' },
  { label: t('paymentTypes.TRANSFER'), value: 'TRANSFER' },
])

const formData = ref({
  originCountry: (props.load as any)?.originCountry || 'Russia',
  originCity: (props.load as any)?.originCity || '',
  destinationCountry: (props.load as any)?.destinationCountry || 'Russia',
  destinationCity: (props.load as any)?.destinationCity || '',
  cargoType: (props.load as any)?.cargoType || '',
  weight: (props.load as any)?.weight || 0,
  volume: (props.load as any)?.volume || undefined,
  truckType: (props.load as any)?.truckType || 'TENT',
  price: (props.load as any)?.price || 0,
  paymentType: (props.load as any)?.paymentType || 'CASH',
  loadingDate: (props.load as any)?.loadingDate ? new Date((props.load as any).loadingDate).toISOString().split('T')[0] : '',
  photos: (props.load as any)?.photos || [],
  documents: (props.load as any)?.documents || [],
})

const handleSubmit = () => {
  // Validation
  if (!formData.value.originCountry || !formData.value.originCity ||
      !formData.value.destinationCountry || !formData.value.destinationCity) {
    toast.warning(t('validation.fillRouteFields'))
    return
  }

  if (!formData.value.cargoType || !formData.value.weight || !formData.value.price) {
    toast.warning(t('validation.fillCargoFields'))
    return
  }

  if (!formData.value.loadingDate) {
    toast.warning(t('validation.selectLoadingDate'))
    return
  }

  // Convert to backend format
  const loadData = {
    originCountry: formData.value.originCountry,
    originCity: formData.value.originCity,
    destinationCountry: formData.value.destinationCountry,
    destinationCity: formData.value.destinationCity,
    cargoType: formData.value.cargoType,
    weight: Number(formData.value.weight),
    volume: formData.value.volume ? Number(formData.value.volume) : undefined,
    truckType: formData.value.truckType,
    price: Number(formData.value.price),
    paymentType: formData.value.paymentType,
    loadingDate: formData.value.loadingDate,
    photos: formData.value.photos,
    documents: formData.value.documents,
  }

  emit('submit', loadData)
}
</script>
