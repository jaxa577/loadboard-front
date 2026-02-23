<template>
  <NuxtLayout name="app">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="mb-6">
        <button
          @click="navigateTo(`/loads/${route.params.id}`)"
          class="text-primary-600 hover:text-primary-700 flex items-center gap-2"
        >
          <Icon name="heroicons:arrow-left" />
          Back to Load Details
        </button>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-96">
        <div class="text-center">
          <Icon name="svg-spinners:ring-resize" class="text-4xl text-primary-600 mb-4" />
          <p class="text-gray-600">Loading tracking information...</p>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Map Section -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Live Tracking</h2>
              <p class="text-sm text-gray-600 mt-1">
                Real-time driver location updates
              </p>
            </div>
            <div class="relative" style="height: 600px;">
              <LiveTrackingMap
                v-if="journey && (currentLocation || (mapOrigin && mapDestination))"
                :origin="mapOrigin"
                :destination="mapDestination"
                :current-location="currentLocation"
                :route-points="routePoints"
              />
              <div v-else class="flex items-center justify-center h-full bg-gray-100">
                <div class="text-center">
                  <p class="text-gray-500">No active journey found</p>
                  <p class="text-sm text-gray-400 mt-2">The map will appear when a driver starts the journey</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Driver Status Panel -->
        <div class="lg:col-span-1">
          <DriverStatusPanel
            v-if="journey && driver"
            :journey="journey"
            :driver="driver"
            :current-location="currentLocation"
            :load="load"
            :eta="estimatedArrival"
          />
        </div>
      </div>

      <!-- Journey Timeline -->
      <div v-if="journey" class="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Journey Timeline</h3>
        <div class="space-y-3">
          <div class="flex items-center">
            <Icon name="heroicons:play-circle" class="text-green-600 text-xl mr-3" />
            <div>
              <p class="font-medium">Journey Started</p>
              <p class="text-sm text-gray-600">
                {{ formatDateTime(journey.startTime) }}
              </p>
            </div>
          </div>
          <div v-if="journey.status === 'COMPLETED'" class="flex items-center">
            <Icon name="heroicons:check-circle" class="text-blue-600 text-xl mr-3" />
            <div>
              <p class="font-medium">Journey Completed</p>
              <p class="text-sm text-gray-600">
                {{ formatDateTime(journey.endTime) }}
              </p>
            </div>
          </div>
          <div v-else class="flex items-center">
            <Icon name="heroicons:truck" class="text-primary-600 text-xl mr-3 animate-pulse" />
            <div>
              <p class="font-medium">En Route</p>
              <p class="text-sm text-gray-600">
                Last update: {{ formatDateTime(lastUpdate) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const route = useRoute();
const { api } = useApi();
const authStore = useAuthStore();
const { $i18n } = useNuxtApp();
const websocket = useWebSocket();

const loading = ref(true);
const error = ref('');
const load = ref<any>(null);
const journey = ref<any>(null);
const driver = ref<any>(null);
const currentLocation = ref<any>(null);
const routePoints = ref<any[]>([]);
const lastUpdate = ref<Date>(new Date());

// Check access permissions
onMounted(async () => {
  if (authStore.isDriver) {
    error.value = 'Drivers cannot access tracking page';
    loading.value = false;
    return;
  }

  await fetchTrackingData();
  setupWebSocket();
});

onUnmounted(() => {
  if (journey.value) {
    websocket.leaveJourney(journey.value.id);
  }
  websocket.disconnect();
});

const fetchTrackingData = async () => {
  try {
    loading.value = true;

    // Fetch load details
    const loadResponse = await api.get(`/loads/${route.params.id}`);
    load.value = loadResponse.data;

    // Verify user owns this load
    if (load.value.shipperId !== authStore.user?.id) {
      error.value = 'You do not have permission to view this tracking';
      loading.value = false;
      return;
    }

    // Fetch active journey
    try {
      const journeyResponse = await api.get(`/journeys/active/${route.params.id}`);
      journey.value = journeyResponse.data;

      // Fetch journey locations
      const locationsResponse = await api.get(`/journeys/${journey.value.id}/locations`);
      routePoints.value = locationsResponse.data;

      // Set current location
      if (journey.value.currentLatitude && journey.value.currentLongitude) {
        currentLocation.value = {
          latitude: journey.value.currentLatitude,
          longitude: journey.value.currentLongitude,
        };
      }

      // Fetch driver info from load applications
      const application = load.value.applications?.find(
        (app: any) => app.status === 'ACCEPTED'
      );
      if (application) {
        driver.value = application.applicant;
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        error.value = 'No active journey found for this load';
      } else {
        throw err;
      }
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load tracking data';
  } finally {
    loading.value = false;
  }
};

const setupWebSocket = () => {
  if (!journey.value) return;

  websocket.connect();

  websocket.onLocationUpdate((data: any) => {
    currentLocation.value = {
      latitude: data.latitude,
      longitude: data.longitude,
    };
    routePoints.value.push(data);
    lastUpdate.value = new Date();
  });

  websocket.onJourneyStatus((data: any) => {
    if (data.status === 'COMPLETED') {
      journey.value.status = 'COMPLETED';
      journey.value.endTime = new Date();
    }
  });

  websocket.joinJourney(journey.value.id);
};

const mapOrigin = computed(() => {
  if (!load.value) return null;
  return {
    city: load.value.originCity,
    region: load.value.originRegion,
    latitude: load.value.originLatitude,
    longitude: load.value.originLongitude,
  };
});

const mapDestination = computed(() => {
  if (!load.value) return null;
  return {
    city: load.value.destinationCity,
    region: load.value.destinationRegion,
    latitude: load.value.destinationLatitude,
    longitude: load.value.destinationLongitude,
  };
});

const estimatedArrival = computed(() => {
  if (!journey.value || !load.value || !currentLocation.value) return null;

  // Simple ETA calculation (will be improved)
  const avgSpeed = 80; // km/h assumption
  const distance = calculateDistance(
    currentLocation.value.latitude,
    currentLocation.value.longitude,
    // For now using a placeholder, would need destination coordinates
    currentLocation.value.latitude + 1,
    currentLocation.value.longitude + 1
  );

  const hoursRemaining = distance / avgSpeed;
  const eta = new Date(Date.now() + hoursRemaining * 3600000);

  return eta;
});

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  // Haversine formula
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees: number) => {
  return (degrees * Math.PI) / 180;
};

const formatDateTime = (date: string | Date | null) => {
  if (!date) return '';
  return new Date(date).toLocaleString();
};
</script>
