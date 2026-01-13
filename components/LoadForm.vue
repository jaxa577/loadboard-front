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
        <div class="space-y-4">
          <!-- Negotiable Price Checkbox -->
          <div class="flex items-center space-x-2">
            <input
              id="negotiablePrice"
              v-model="formData.negotiablePrice"
              type="checkbox"
              class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            />
            <label for="negotiablePrice" class="text-sm font-medium text-gray-900 dark:text-white">
              Negotiable Price (Договорная цена)
            </label>
          </div>

          <!-- Price and Currency -->
          <div v-if="!formData.negotiablePrice" class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Price" required>
              <UInput v-model.number="formData.price" type="number" placeholder="50000" />
            </UFormGroup>
            <UFormGroup label="Currency" required>
              <USelect v-model="formData.currency" :options="currencies" />
            </UFormGroup>
          </div>

          <!-- Prepayment -->
          <div class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <UFormGroup label="Prepayment Amount (Optional)">
                <UInput v-model.number="formData.prepayment" type="number" placeholder="10000" />
              </UFormGroup>
              <UFormGroup v-if="formData.prepayment" label="Prepayment Currency">
                <USelect v-model="formData.prepaymentCurrency" :options="currencies" />
              </UFormGroup>
            </div>
          </div>

          <!-- Other fields -->
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Number of Trucks (Optional)">
              <UInput v-model.number="formData.trucksCount" type="number" placeholder="1" min="1" />
            </UFormGroup>
            <UFormGroup :label="$t('load.paymentType')" required>
              <USelect v-model="formData.paymentType" :options="paymentTypes" />
            </UFormGroup>
            <UFormGroup :label="$t('load.loadingDate')" required>
              <UInput v-model="formData.loadingDate" type="date" />
            </UFormGroup>
            <UFormGroup :label="$t('load.contactPhone')">
              <UInput v-model="formData.contactPhone" type="tel" placeholder="+7 (999) 123-45-67" />
            </UFormGroup>
          </div>
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

const countries = [
  'Russia', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Belarus',
  'Tajikistan', 'Turkmenistan', 'Azerbaijan', 'Armenia', 'Georgia', 'Moldova',
  'Germany', 'France', 'Italy', 'Spain', 'Poland', 'Netherlands', 'Belgium',
  'Austria', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Greece',
  'Portugal', 'Sweden', 'Finland', 'Denmark', 'Norway', 'Switzerland',
  'Turkey', 'China', 'South Korea', 'Japan'
]

const currencies = [
  { label: 'USD ($)', value: 'USD' },
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'RUB (₽)', value: 'RUB' },
  { label: 'KZT (₸)', value: 'KZT' },
  { label: 'CNY (¥)', value: 'CNY' },
  { label: 'TRY (₺)', value: 'TRY' },
  { label: 'KRW (₩)', value: 'KRW' },
]

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
  negotiablePrice: (props.load as any)?.negotiablePrice || false,
  price: (props.load as any)?.price || 0,
  currency: (props.load as any)?.currency || 'USD',
  prepayment: (props.load as any)?.prepayment || undefined,
  prepaymentCurrency: (props.load as any)?.prepaymentCurrency || 'USD',
  trucksCount: (props.load as any)?.trucksCount || undefined,
  paymentType: (props.load as any)?.paymentType || 'CASH',
  loadingDate: (props.load as any)?.loadingDate ? new Date((props.load as any).loadingDate).toISOString().split('T')[0] : '',
  contactPhone: (props.load as any)?.contactPhone || '',
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

  if (!formData.value.cargoType || !formData.value.weight) {
    toast.warning(t('validation.fillCargoFields'))
    return
  }

  if (!formData.value.negotiablePrice && !formData.value.price) {
    toast.warning('Please specify price or mark it as negotiable')
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
    negotiablePrice: formData.value.negotiablePrice,
    price: formData.value.negotiablePrice ? undefined : Number(formData.value.price),
    currency: formData.value.currency,
    prepayment: formData.value.prepayment ? Number(formData.value.prepayment) : undefined,
    prepaymentCurrency: formData.value.prepayment ? formData.value.prepaymentCurrency : undefined,
    trucksCount: formData.value.trucksCount ? Number(formData.value.trucksCount) : undefined,
    paymentType: formData.value.paymentType,
    loadingDate: formData.value.loadingDate,
    contactPhone: formData.value.contactPhone || undefined,
    // photos: formData.value.photos, // Temporarily disabled until Minio is ready
    // documents: formData.value.documents, // Temporarily disabled until Minio is ready
  }

  emit('submit', loadData)
}
</script>
