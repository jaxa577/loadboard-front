<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ $t('tracking.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        {{ $t('tracking.description') }}
      </p>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-96">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">{{ $t('common.loading') }}</p>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
      <p class="text-red-800 dark:text-red-200">{{ error }}</p>
    </div>

    <div v-else-if="activeJourneys.length === 0" class="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
      <Icon name="heroicons:map-pin" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <p class="text-gray-600 dark:text-gray-400">{{ $t('tracking.noActiveJourneys') }}</p>
    </div>

    <div v-else class="grid lg:grid-cols-[350px_1fr] gap-6">
      <!-- Journey List -->
      <div class="space-y-4">
        <UCard
          v-for="journey in activeJourneys"
          :key="journey.id"
          :class="[
            'cursor-pointer transition-all',
            selectedJourney?.id === journey.id
              ? 'ring-2 ring-primary-500 dark:ring-primary-400'
              : 'hover:shadow-md'
          ]"
          @click="selectJourney(journey)"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  {{ journey.load?.originCity }} → {{ journey.load?.destinationCity }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ journey.load?.cargoType }}
                </p>
              </div>
              <UBadge color="green" variant="subtle">
                <Icon name="heroicons:map-pin" class="w-4 h-4 mr-1" />
                {{ $t('tracking.active') }}
              </UBadge>
            </div>

            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
              {{ $t('tracking.started') }}: {{ formatDate(journey.startTime) }}
            </div>

            <div v-if="journey.currentLatitude && journey.currentLongitude" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Icon name="heroicons:map-pin" class="w-4 h-4 mr-1" />
              {{ journey.currentLatitude.toFixed(4) }}, {{ journey.currentLongitude.toFixed(4) }}
            </div>

            <div class="flex items-center text-sm">
              <Icon name="heroicons:cube" class="w-4 h-4 mr-1 text-gray-500" />
              <span class="text-gray-700 dark:text-gray-300">
                {{ journey.load?.weight }} kg
              </span>
              <span class="mx-2 text-gray-400">•</span>
              <span class="text-primary-600 dark:text-primary-400 font-semibold">
                ${{ journey.load?.price }}
              </span>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Map -->
      <UCard>
        <div v-if="selectedJourney" class="h-[600px] relative">
          <div ref="mapContainer" class="w-full h-full rounded-lg overflow-hidden"></div>

          <div class="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
              {{ selectedJourney.load?.originCity }} → {{ selectedJourney.load?.destinationCity }}
            </h3>
            <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex items-center">
                <Icon name="heroicons:truck" class="w-4 h-4 mr-2" />
                {{ selectedJourney.load?.cargoType }}
              </div>
              <div class="flex items-center">
                <Icon name="heroicons:scale" class="w-4 h-4 mr-2" />
                {{ selectedJourney.load?.weight }} kg
              </div>
              <div class="flex items-center">
                <Icon name="heroicons:clock" class="w-4 h-4 mr-2" />
                {{ formatDate(selectedJourney.startTime) }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="h-[600px] flex items-center justify-center text-gray-500">
          <div class="text-center">
            <Icon name="heroicons:map" class="w-16 h-16 mx-auto mb-4" />
            <p>{{ $t('tracking.selectJourney') }}</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const { $api } = useNuxtApp()
const { t } = useI18n()

interface Journey {
  id: string
  loadId: string
  driverId: string
  startTime: string
  endTime?: string
  status: string
  currentLatitude?: number
  currentLongitude?: number
  load?: {
    id: string
    originCity: string
    destinationCity: string
    originLatitude?: number
    originLongitude?: number
    destinationLatitude?: number
    destinationLongitude?: number
    cargoType: string
    weight: number
    price: number
  }
}

const activeJourneys = ref<Journey[]>([])
const selectedJourney = ref<Journey | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const mapContainer = ref<HTMLElement | null>(null)
let map: mapboxgl.Map | null = null

const fetchActiveJourneys = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await $api<Journey[]>('/journeys/tracking/active')
    activeJourneys.value = response

    // Auto-select first journey if available
    if (activeJourneys.value.length > 0 && !selectedJourney.value) {
      selectJourney(activeJourneys.value[0])
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || t('errors.loadError')
    console.error('Error fetching active journeys:', err)
  } finally {
    loading.value = false
  }
}

const selectJourney = (journey: Journey) => {
  selectedJourney.value = journey
  nextTick(() => {
    initializeMap()
  })
}

const initializeMap = () => {
  if (!mapContainer.value || !selectedJourney.value) return

  // Destroy existing map
  if (map) {
    map.remove()
    map = null
  }

  const journey = selectedJourney.value
  const load = journey.load

  if (!load?.originLatitude || !load?.originLongitude || !load?.destinationLatitude || !load?.destinationLongitude) {
    return
  }

  // Initialize Mapbox
  mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [load.originLongitude, load.originLatitude],
    zoom: 6
  })

  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl(), 'top-right')

  // Add origin marker (green)
  new mapboxgl.Marker({ color: '#10b981' })
    .setLngLat([load.originLongitude, load.originLatitude])
    .setPopup(new mapboxgl.Popup().setHTML(`<strong>${load.originCity}</strong><br>Origin`))
    .addTo(map)

  // Add destination marker (red)
  new mapboxgl.Marker({ color: '#ef4444' })
    .setLngLat([load.destinationLongitude, load.destinationLatitude])
    .setPopup(new mapboxgl.Popup().setHTML(`<strong>${load.destinationCity}</strong><br>Destination`))
    .addTo(map)

  // Add current location marker (blue) if available
  if (journey.currentLatitude && journey.currentLongitude) {
    new mapboxgl.Marker({ color: '#3b82f6' })
      .setLngLat([journey.currentLongitude, journey.currentLatitude])
      .setPopup(new mapboxgl.Popup().setHTML('<strong>Current Location</strong>'))
      .addTo(map)
  }

  // Fit bounds to show all markers
  const bounds = new mapboxgl.LngLatBounds()
  bounds.extend([load.originLongitude, load.originLatitude])
  bounds.extend([load.destinationLongitude, load.destinationLatitude])
  if (journey.currentLatitude && journey.currentLongitude) {
    bounds.extend([journey.currentLongitude, journey.currentLatitude])
  }

  map.fitBounds(bounds, {
    padding: 100,
    maxZoom: 12
  })

  // Draw route line
  map.on('load', () => {
    if (!map) return

    const coordinates = [
      [load.originLongitude, load.originLatitude],
    ]

    if (journey.currentLatitude && journey.currentLongitude) {
      coordinates.push([journey.currentLongitude, journey.currentLatitude])
    }

    coordinates.push([load.destinationLongitude, load.destinationLatitude])

    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      }
    })

    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#2563eb',
        'line-width': 3
      }
    })
  })
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

// Polling for real-time updates
const pollInterval = ref<NodeJS.Timeout | null>(null)

onMounted(() => {
  fetchActiveJourneys()

  // Poll every 10 seconds for updates
  pollInterval.value = setInterval(() => {
    fetchActiveJourneys()
  }, 10000)
})

onUnmounted(() => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
  if (map) {
    map.remove()
  }
})
</script>
