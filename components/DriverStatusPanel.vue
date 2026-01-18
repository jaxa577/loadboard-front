<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-xl font-semibold mb-4">Driver Information</h3>

    <!-- Driver Profile -->
    <div class="flex items-center mb-6 pb-6 border-b border-gray-200">
      <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mr-4">
        <span class="text-2xl font-bold text-primary-600">
          {{ getInitials(driver.name) }}
        </span>
      </div>
      <div class="flex-1">
        <h4 class="text-lg font-semibold text-gray-900">{{ driver.name }}</h4>
        <div class="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <Icon name="heroicons:star-solid" class="text-yellow-400" />
          <span>{{ driver.rating?.toFixed(1) || 'N/A' }}</span>
        </div>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="space-y-3 mb-6 pb-6 border-b border-gray-200">
      <div class="flex items-center">
        <Icon name="heroicons:phone" class="text-gray-400 mr-3" />
        <a
          :href="`tel:${driver.phone}`"
          class="text-primary-600 hover:text-primary-700 font-medium"
        >
          {{ driver.phone }}
        </a>
      </div>
      <div class="flex items-center">
        <Icon name="heroicons:envelope" class="text-gray-400 mr-3" />
        <a
          :href="`mailto:${driver.email}`"
          class="text-primary-600 hover:text-primary-700"
        >
          {{ driver.email }}
        </a>
      </div>
    </div>

    <!-- Journey Stats -->
    <div class="space-y-4 mb-6">
      <h4 class="font-semibold text-gray-900">Journey Details</h4>

      <!-- Status -->
      <div class="flex items-center justify-between">
        <span class="text-gray-600">Status</span>
        <span
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium',
            journey.status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : journey.status === 'COMPLETED'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800',
          ]"
        >
          {{ journey.status }}
        </span>
      </div>

      <!-- Duration -->
      <div class="flex items-center justify-between">
        <span class="text-gray-600">Duration</span>
        <span class="font-medium text-gray-900">{{ journeyDuration }}</span>
      </div>

      <!-- Current Speed -->
      <div v-if="currentLocation" class="flex items-center justify-between">
        <span class="text-gray-600">Current Speed</span>
        <span class="font-medium text-gray-900">
          {{ currentSpeed }} km/h
        </span>
      </div>

      <!-- ETA -->
      <div v-if="eta" class="flex items-center justify-between">
        <span class="text-gray-600">Estimated Arrival</span>
        <span class="font-medium text-gray-900">
          {{ formatETA(eta) }}
        </span>
      </div>
    </div>

    <!-- Route Info -->
    <div class="bg-gray-50 rounded-lg p-4">
      <h4 class="font-semibold text-gray-900 mb-3">Route</h4>
      <div class="space-y-3">
        <div class="flex items-start">
          <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
            <Icon name="heroicons:map-pin" class="text-green-600" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">Origin</p>
            <p class="text-sm text-gray-600">
              {{ load.originCity }}<span v-if="load.originRegion">, {{ load.originRegion }}</span>
            </p>
          </div>
        </div>

        <div class="ml-4 border-l-2 border-dashed border-gray-300 h-8"></div>

        <div class="flex items-start">
          <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
            <Icon name="heroicons:flag" class="text-red-600" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">Destination</p>
            <p class="text-sm text-gray-600">
              {{ load.destinationCity }}<span v-if="load.destinationRegion">, {{ load.destinationRegion }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Cargo Info -->
    <div class="mt-6 pt-6 border-t border-gray-200">
      <h4 class="font-semibold text-gray-900 mb-3">Cargo</h4>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Type</span>
          <span class="font-medium text-gray-900">{{ load.cargoType }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Weight</span>
          <span class="font-medium text-gray-900">{{ load.weight }} kg</span>
        </div>
        <div v-if="load.volume" class="flex justify-between">
          <span class="text-gray-600">Volume</span>
          <span class="font-medium text-gray-900">{{ load.volume }} m³</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  journey: any;
  driver: any;
  currentLocation: { latitude: number; longitude: number } | null;
  load: any;
  eta: Date | null;
}

const props = defineProps<Props>();

const getInitials = (name: string) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const journeyDuration = computed(() => {
  const start = new Date(props.journey.startTime);
  const end = props.journey.endTime ? new Date(props.journey.endTime) : new Date();
  const diff = end.getTime() - start.getTime();

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
});

const currentSpeed = computed(() => {
  // This would come from the latest location update
  // For now, showing a placeholder
  return '0';
});

const formatETA = (date: Date) => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff < 0) return 'Arrived';

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  const dateStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return `${dateStr} (in ${timeStr})`;
};
</script>
