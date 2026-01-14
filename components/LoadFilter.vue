<template>
  <div class="flex items-center gap-3">
    <!-- Search Bar -->
    <div class="flex-1">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('filter.searchPlaceholder')"
        class="input w-full"
        @input="updateFilters"
      />
    </div>

    <!-- Filter Button with Popover -->
    <UPopover :popper="{ placement: 'bottom-end' }">
      <UButton
        icon="i-heroicons-funnel"
        color="gray"
        variant="outline"
        :label="hasActiveFilters ? $t('filter.filtersActive') : $t('filter.filters')"
        :badge="activeFilterCount"
      />

      <template #panel>
        <div class="p-4 w-[90vw] sm:w-[500px] max-w-[500px]">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('filter.advancedFilters') }}</h3>
            <UButton
              v-if="hasActiveFilters"
              size="xs"
              color="gray"
              variant="ghost"
              :label="$t('filter.clear')"
              @click="clearFilters"
            />
          </div>

          <!-- Filter Options -->
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UFormGroup :label="$t('load.originCity')">
                <UInput
                  v-model="filters.originCity"
                  :placeholder="$t('load.originCity')"
                  @input="updateFilters"
                />
              </UFormGroup>
              <UFormGroup :label="$t('load.destinationCity')">
                <UInput
                  v-model="filters.destinationCity"
                  :placeholder="$t('load.destinationCity')"
                  @input="updateFilters"
                />
              </UFormGroup>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UFormGroup :label="$t('filter.minPrice')">
                <UInput
                  v-model.number="filters.minPrice"
                  type="number"
                  :placeholder="$t('filter.minPrice')"
                  @input="updateFilters"
                />
              </UFormGroup>
              <UFormGroup :label="$t('filter.maxPrice')">
                <UInput
                  v-model.number="filters.maxPrice"
                  type="number"
                  :placeholder="$t('filter.maxPrice')"
                  @input="updateFilters"
                />
              </UFormGroup>
            </div>

            <UFormGroup :label="$t('filter.minWeight')">
              <UInput
                v-model.number="filters.minWeight"
                type="number"
                :placeholder="$t('filter.minWeight')"
                @input="updateFilters"
              />
            </UFormGroup>

            <UFormGroup :label="$t('load.cargoType')">
              <UInput
                v-model="filters.cargoType"
                :placeholder="$t('load.cargoType')"
                @input="updateFilters"
              />
            </UFormGroup>

            <UFormGroup :label="$t('load.truckType')">
              <USelect
                v-model="filters.truckType"
                :options="truckTypeOptions"
                @change="updateFilters"
              />
            </UFormGroup>

            <UFormGroup :label="$t('load.status')">
              <USelect
                v-model="filters.status"
                :options="statusOptions"
                @change="updateFilters"
              />
            </UFormGroup>
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<script setup lang="ts">
const loadsStore = useLoadsStore()
const { t } = useI18n()

const searchQuery = ref('')
const filters = ref({
  originCity: '',
  destinationCity: '',
  minWeight: null as number | null,
  maxWeight: null as number | null,
  minPrice: null as number | null,
  maxPrice: null as number | null,
  cargoType: '',
  truckType: '',
  status: '',
  urgent: null as boolean | null,
  maxDistance: null as number | null,
})

const truckTypeOptions = computed(() => [
  { value: '', label: t('filter.allTruckTypes') },
  { value: 'TENT', label: t('truckTypes.TENT') },
  { value: 'REFRIGERATOR', label: t('truckTypes.REFRIGERATOR') },
  { value: 'CONTAINER', label: t('truckTypes.CONTAINER') },
  { value: 'PLATFORM', label: t('truckTypes.PLATFORM') },
  { value: 'TANK', label: t('truckTypes.TANK') }
])

const statusOptions = computed(() => [
  { value: '', label: t('filter.allStatuses') },
  { value: 'OPEN', label: t('loadStatus.OPEN') },
  { value: 'IN_PROGRESS', label: t('loadStatus.IN_PROGRESS') },
  { value: 'COMPLETED', label: t('loadStatus.COMPLETED') }
])

const hasActiveFilters = computed(() => {
  return filters.value.originCity !== '' ||
    filters.value.destinationCity !== '' ||
    filters.value.minWeight !== null ||
    filters.value.minPrice !== null ||
    filters.value.maxPrice !== null ||
    filters.value.cargoType !== '' ||
    filters.value.truckType !== '' ||
    filters.value.status !== ''
})

const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.originCity) count++
  if (filters.value.destinationCity) count++
  if (filters.value.minWeight) count++
  if (filters.value.minPrice) count++
  if (filters.value.maxPrice) count++
  if (filters.value.cargoType) count++
  if (filters.value.truckType) count++
  if (filters.value.status) count++
  return count > 0 ? count : undefined
})

const updateFilters = () => {
  loadsStore.setFilters({
    ...filters.value,
    searchQuery: searchQuery.value
  })
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.value = {
    originCity: '',
    destinationCity: '',
    minWeight: null,
    maxWeight: null,
    minPrice: null,
    maxPrice: null,
    cargoType: '',
    truckType: '',
    status: '',
    urgent: null,
    maxDistance: null,
  }
  loadsStore.clearFilters()
}
</script>

