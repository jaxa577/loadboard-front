<template>
  <NuxtLayout name="app">
    <UContainer>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Мои ТС</h1>
          <p class="text-gray-500">Добавляйте, редактируйте и удаляйте транспорт</p>
        </div>
        <UButton color="primary" @click="startCreate">Добавить ТС</UButton>
      </div>

      <UCard>
        <UForm :state="form" @submit="submit">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Номер машины">
              <UInput v-model="form.number" placeholder="A123BC77" required />
            </UFormGroup>
            <UFormGroup label="VIN">
              <UInput v-model="form.vin" placeholder="1HGCM82633A123456" required />
            </UFormGroup>
            <UFormGroup label="Категория">
              <USelect v-model="form.category" :options="categories" />
            </UFormGroup>
            <UFormGroup label="Грузоподъёмность, кг">
              <UInput v-model.number="form.capacity" type="number" placeholder="5000" />
            </UFormGroup>
          </div>
          <UDivider class="my-4" />
          <UButton type="submit" color="primary" :loading="saving">
            {{ editingId ? 'Сохранить' : 'Добавить' }}
          </UButton>
        </UForm>
      </UCard>

      <UDivider class="my-6" />

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard v-for="vehicle in vehiclesStore.vehicles" :key="vehicle.id">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">{{ vehicle.number }}</h3>
                <p class="text-sm text-gray-500">{{ vehicle.vin }}</p>
              </div>
              <UBadge variant="solid">{{ vehicle.category }}</UBadge>
            </div>
          </template>
          <p class="text-sm text-gray-500 mb-2">Грузоподъёмность: {{ vehicle.capacity }} кг</p>
          <div class="flex items-center space-x-2">
            <UButton size="xs" color="gray" @click="edit(vehicle)">Редактировать</UButton>
            <UButton size="xs" color="red" variant="solid" @click="remove(vehicle.id)">Удалить</UButton>
          </div>
        </UCard>
      </div>
    </UContainer>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Vehicle } from '~/types'

const vehiclesStore = useVehiclesStore()
const saving = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  number: '',
  vin: '',
  category: 'грузовик',
  capacity: 0,
})

const categories = ['тягач', 'грузовик', 'пикап']

onMounted(() => {
  vehiclesStore.fetchVehicles()
})

const startCreate = () => {
  editingId.value = null
  Object.assign(form, { number: '', vin: '', category: 'грузовик', capacity: 0 })
}

const edit = (vehicle: Vehicle) => {
  editingId.value = vehicle.id
  Object.assign(form, {
    number: vehicle.number,
    vin: vehicle.vin,
    category: vehicle.category,
    capacity: vehicle.capacity,
  })
}

const submit = async () => {
  saving.value = true
  try {
    if (editingId.value) {
      await vehiclesStore.updateVehicle(editingId.value, form)
    } else {
      await vehiclesStore.addVehicle(form)
    }
    startCreate()
  } finally {
    saving.value = false
  }
}

const remove = async (id: string) => {
  if (confirm('Удалить транспортное средство?')) {
    await vehiclesStore.deleteVehicle(id)
  }
}

useHead({ title: 'Мои ТС - SNG LoadBoard' })
</script>

