<template>
  <div class="card">
    <!-- Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('filter.searchPlaceholder')"
        class="input w-full"
        @input="updateFilters"
      />
    </div>

    <!-- Filter Options -->
    <div class="grid md:grid-cols-4 gap-4 mb-4">
      <input
        v-model="filters.originCity"
        type="text"
        :placeholder="$t('load.originCity')"
        class="input"
        @input="updateFilters"
      />
      <input
        v-model="filters.destinationCity"
        type="text"
        :placeholder="$t('load.destinationCity')"
        class="input"
        @input="updateFilters"
      />
      <input
        v-model.number="filters.minPrice"
        type="number"
        :placeholder="$t('filter.minPrice')"
        class="input"
        @input="updateFilters"
      />
      <input
        v-model.number="filters.maxPrice"
        type="number"
        :placeholder="$t('filter.maxPrice')"
        class="input"
        @input="updateFilters"
      />
    </div>

    <div class="grid md:grid-cols-5 gap-4">
      <input
        v-model.number="filters.minWeight"
        type="number"
        :placeholder="$t('filter.minWeight')"
        class="input"
        @input="updateFilters"
      />
      <input
        v-model="filters.cargoType"
        type="text"
        :placeholder="$t('load.cargoType')"
        class="input"
        @input="updateFilters"
      />
      <select
        v-model="filters.truckType"
        class="input"
        @change="updateFilters"
      >
        <option value="">{{ $t('filter.allTruckTypes') }}</option>
        <option value="TENT">{{ $t('truckTypes.TENT') }}</option>
        <option value="REFRIGERATOR">{{ $t('truckTypes.REFRIGERATOR') }}</option>
        <option value="CONTAINER">{{ $t('truckTypes.CONTAINER') }}</option>
        <option value="PLATFORM">{{ $t('truckTypes.PLATFORM') }}</option>
        <option value="TANK">{{ $t('truckTypes.TANK') }}</option>
      </select>
      <select
        v-model="filters.status"
        class="input"
        @change="updateFilters"
      >
        <option value="">{{ $t('filter.allStatuses') }}</option>
        <option value="OPEN">{{ $t('loadStatus.OPEN') }}</option>
        <option value="IN_PROGRESS">{{ $t('loadStatus.IN_PROGRESS') }}</option>
        <option value="COMPLETED">{{ $t('loadStatus.COMPLETED') }}</option>
      </select>
      <button
        @click="clearFilters"
        class="btn-secondary"
      >
        {{ $t('filter.clear') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const loadsStore = useLoadsStore()

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

