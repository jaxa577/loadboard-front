<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ $t('tracking.title') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {{ $t('tracking.description') }}
          </p>
        </div>

        <!-- WebSocket Status Indicator -->
        <div class="flex items-center gap-2 px-3 py-2 rounded-lg" :class="ws.connected.value ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'">
          <div class="flex items-center gap-2">
            <div
              class="w-2 h-2 rounded-full"
              :class="ws.connected.value ? 'bg-green-500 animate-pulse' : 'bg-gray-400'"
            ></div>
            <span class="text-sm font-medium" :class="ws.connected.value ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'">
              {{ ws.connected.value ? $t('tracking.live') : $t('tracking.offline') }}
            </span>
          </div>
        </div>
      </div>
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
      <div class="space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto p-1 pr-2">
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
      <UCard :ui="{ body: { padding: 'p-0 sm:p-0', base: 'h-full' } }" class="overflow-hidden h-[calc(100vh-14rem)]">
        <div v-if="selectedJourney" class="h-full relative">
          <!-- Check if coordinates are available -->
          <div v-if="!selectedJourney.load?.originLatitude || !selectedJourney.load?.destinationLatitude" class="h-full flex items-center justify-center text-gray-500">
            <div class="text-center">
              <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <p class="font-semibold">{{ $t('tracking.noCoordinates') }}</p>
              <p class="text-sm mt-2">{{ $t('tracking.noCoordinatesDesc') }}</p>
              <p class="text-sm text-gray-400 mt-1">{{ $t('tracking.coordinatesRequired') }}</p>
            </div>
          </div>

          <!-- Map Container -->
          <div v-else ref="mapContainer" class="w-full h-full rounded-lg overflow-hidden"></div>

          <!-- Journey Info Overlay (only show if map is visible) -->
          <div v-if="selectedJourney.load?.originLatitude && selectedJourney.load?.destinationLatitude" class="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
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
        <div v-else class="h-full flex items-center justify-center text-gray-500 bg-gray-50 dark:bg-gray-800">
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
  layout: 'app'
})

const api = useApi()
const { t } = useI18n()
const ws = useWebSocket()

interface Journey {
  id: string
  loadId: string
  driverId: string
  startTime: string
  endTime?: string
  status: string
  currentLatitude?: number
  currentLongitude?: number
  progress?: number
  routeCoordinates?: number[][]
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
let currentLocationMarker: mapboxgl.Marker | null = null
let mockInterval: any = null

const getPointAlongRoute = (coords: number[][], progress: number) => {
  if (!coords || coords.length === 0) return null;
  if (coords.length === 1) return coords[0];
  if (progress <= 0) return coords[0];
  if (progress >= 1) return coords[coords.length - 1];

  const floatIndex = progress * (coords.length - 1);
  const lowerIndex = Math.floor(floatIndex);
  const upperIndex = Math.ceil(floatIndex);
  const segmentProgress = floatIndex - lowerIndex;

  const p1 = coords[lowerIndex];
  const p2 = coords[upperIndex];

  const lng = p1[0] + (p2[0] - p1[0]) * segmentProgress;
  const lat = p1[1] + (p2[1] - p1[1]) * segmentProgress;
  
  return [lng, lat];
}

const MOCK_JOURNEYS: Journey[] = [
  {
    id: 'mock-1', loadId: 'load-1', driverId: 'drv-1', startTime: new Date().toISOString(), status: 'IN_PROGRESS', progress: 0,
    currentLatitude: 41.311081, currentLongitude: 69.240562,
    load: { id: 'load-1', originCity: 'Tashkent', destinationCity: 'Samarkand', originLatitude: 41.311081, originLongitude: 69.240562, destinationLatitude: 39.627012, destinationLongitude: 66.974973, cargoType: 'Electronics', weight: 5000, price: 1200 }
  },
  {
    id: 'mock-2', loadId: 'load-2', driverId: 'drv-2', startTime: new Date().toISOString(), status: 'IN_PROGRESS', progress: 0.2,
    currentLatitude: 43.238949, currentLongitude: 76.889709,
    load: { id: 'load-2', originCity: 'Almaty', destinationCity: 'Astana', originLatitude: 43.238949, originLongitude: 76.889709, destinationLatitude: 51.169392, destinationLongitude: 71.449074, cargoType: 'Building Materials', weight: 20000, price: 3500 }
  },
  {
    id: 'mock-3', loadId: 'load-3', driverId: 'drv-3', startTime: new Date().toISOString(), status: 'IN_PROGRESS', progress: 0.5,
    currentLatitude: 42.874621, currentLongitude: 74.569762,
    load: { id: 'load-3', originCity: 'Bishkek', destinationCity: 'Osh', originLatitude: 42.874621, originLongitude: 74.569762, destinationLatitude: 40.513996, destinationLongitude: 72.816101, cargoType: 'Textiles', weight: 8000, price: 900 }
  },
  {
    id: 'mock-4', loadId: 'load-4', driverId: 'drv-4', startTime: new Date().toISOString(), status: 'IN_PROGRESS', progress: 0.8,
    currentLatitude: 55.755825, currentLongitude: 37.617298,
    load: { id: 'load-4', originCity: 'Moscow', destinationCity: 'St. Petersburg', originLatitude: 55.755825, originLongitude: 37.617298, destinationLatitude: 59.931058, destinationLongitude: 30.360910, cargoType: 'Medical Supplies', weight: 2000, price: 5000 }
  },
  {
    id: 'mock-5', loadId: 'load-5', driverId: 'drv-5', startTime: new Date().toISOString(), status: 'IN_PROGRESS', progress: 0.1,
    currentLatitude: 38.559772, currentLongitude: 68.787038,
    load: { id: 'load-5', originCity: 'Dushanbe', destinationCity: 'Khujand', originLatitude: 38.559772, originLongitude: 68.787038, destinationLatitude: 40.282560, destinationLongitude: 69.622156, cargoType: 'Food Products', weight: 15000, price: 1800 }
  }
]

const fetchActiveJourneys = async () => {
  try {
    loading.value = true
    error.value = null
    
    // MOCK DATA OVERRIDE
    const routes = await Promise.all(MOCK_JOURNEYS.map(async (j) => {
      try {
        const load = j.load;
        if (load && load.originLongitude && load.originLatitude && load.destinationLongitude && load.destinationLatitude) {
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${load.originLongitude},${load.originLatitude};${load.destinationLongitude},${load.destinationLatitude}?geometries=geojson`);
          const data = await res.json();
          if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            return { ...j, routeCoordinates: data.routes[0].geometry.coordinates };
          }
        }
      } catch (e) {
        console.error('OSRM fetch error for journey', j.id, e);
      }
      return j;
    }));
    
    activeJourneys.value = routes

    if (activeJourneys.value.length > 0 && !selectedJourney.value) {
      selectJourney(activeJourneys.value[0])
    }
    
    // Start mock animation loop
    if (!mockInterval) {
      mockInterval = setInterval(() => {
        activeJourneys.value.forEach(journey => {
          journey.progress = (journey.progress || 0) + 0.000005; // ~15x Slower
          if (journey.progress > 1) journey.progress = 0;
          
          if (journey.routeCoordinates && journey.routeCoordinates.length > 0) {
            const point = getPointAlongRoute(journey.routeCoordinates, journey.progress);
            if (point) {
              journey.currentLongitude = point[0];
              journey.currentLatitude = point[1];
            }
          } else if (journey.load?.originLatitude && journey.load?.destinationLatitude) {
            // Fallback straight line
            journey.currentLatitude = journey.load.originLatitude + (journey.load.destinationLatitude - journey.load.originLatitude) * journey.progress;
            journey.currentLongitude = journey.load.originLongitude + (journey.load.destinationLongitude - journey.load.originLongitude) * journey.progress;
          }

          if (selectedJourney.value?.id === journey.id && currentLocationMarker && journey.currentLongitude && journey.currentLatitude) {
            currentLocationMarker.setLngLat([journey.currentLongitude, journey.currentLatitude]);
          }
        });
      }, 50); // 20fps animation
    }
  } catch (err: any) {
    error.value = err.message || t('errors.loadError')
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
  if (!mapContainer.value || !selectedJourney.value) {
    console.log('Map initialization skipped: missing container or journey')
    return
  }

  // Destroy existing map
  if (map) {
    map.remove()
    map = null
  }

  const journey = selectedJourney.value
  const load = journey.load

  console.log('Initializing map for journey:', journey.id)
  console.log('Load coordinates:', {
    origin: [load?.originLatitude, load?.originLongitude],
    destination: [load?.destinationLatitude, load?.destinationLongitude]
  })

  if (!load?.originLatitude || !load?.originLongitude || !load?.destinationLatitude || !load?.destinationLongitude) {
    console.warn('Missing coordinates for load:', load?.id)
    return
  }

  // Initialize Mapbox (using Carto free basemap to avoid token issues)
  mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
    center: [load.originLongitude, load.originLatitude],
    zoom: 6
  })

  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl(), 'top-right')

  // Add origin marker (green)
  new mapboxgl.Marker({ color: '#10b981' })
    .setLngLat([load.originLongitude, load.originLatitude])
    .setPopup(new mapboxgl.Popup().setHTML(`<strong>${load.originCity}</strong><br>${t('tracking.origin')}`))
    .addTo(map)

  // Add destination marker (red)
  new mapboxgl.Marker({ color: '#ef4444' })
    .setLngLat([load.destinationLongitude, load.destinationLatitude])
    .setPopup(new mapboxgl.Popup().setHTML(`<strong>${load.destinationCity}</strong><br>${t('tracking.destination')}`))
    .addTo(map)

  // Add current location marker (truck icon) if available
  if (journey.currentLatitude && journey.currentLongitude) {
    const el = document.createElement('div');
    el.innerHTML = '<div style="background: white; padding: 6px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.2); border: 2px solid #2563eb; display: flex; align-items: center; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" width="24" height="24"><path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" /><path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" /><path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" /></svg></div>';
    
    currentLocationMarker = new mapboxgl.Marker({ element: el })
      .setLngLat([journey.currentLongitude, journey.currentLatitude])
      .setPopup(new mapboxgl.Popup().setHTML(`<strong>${t('tracking.currentLocation')}</strong>`))
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

    let coordinates: number[][] = [];
    if (journey.routeCoordinates && journey.routeCoordinates.length > 0) {
      coordinates = journey.routeCoordinates;
    } else {
      coordinates = [
        [load.originLongitude, load.originLatitude],
      ]
      if (journey.currentLatitude && journey.currentLongitude) {
        coordinates.push([journey.currentLongitude, journey.currentLatitude])
      }
      coordinates.push([load.destinationLongitude, load.destinationLatitude])
    }

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

// WebSocket real-time updates
const handleLocationUpdate = (data: any) => {
  console.log('Location update received:', data)

  // Update the current journey's location
  if (selectedJourney.value && data.journeyId === selectedJourney.value.id) {
    selectedJourney.value.currentLatitude = data.latitude
    selectedJourney.value.currentLongitude = data.longitude

    // Update map marker
    if (map) {
      // Remove old current location marker and add new one
      initializeMap()
    }
  }

  // Update in the journeys list
  const journeyIndex = activeJourneys.value.findIndex(j => j.id === data.journeyId)
  if (journeyIndex !== -1) {
    activeJourneys.value[journeyIndex].currentLatitude = data.latitude
    activeJourneys.value[journeyIndex].currentLongitude = data.longitude
  }
}

const handleJourneyStatus = (data: any) => {
  console.log('Journey status update:', data)

  // If journey completed or stopped, refresh the list
  if (data.status === 'COMPLETED') {
    fetchActiveJourneys()
  }
}

onMounted(() => {
  // Initial fetch
  fetchActiveJourneys()

  // Cleanup
  onUnmounted(() => {
    if (mockInterval) {
      clearInterval(mockInterval)
    }

    // Remove map
    if (map) {
      map.remove()
    }
  })
})
</script>
