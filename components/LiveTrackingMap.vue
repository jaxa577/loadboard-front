<template>
  <div class="relative w-full h-full">
    <div ref="mapContainer" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Props {
  origin: { city: string; region?: string } | null;
  destination: { city: string; region?: string } | null;
  currentLocation: { latitude: number; longitude: number } | null;
  routePoints: Array<{ latitude: number; longitude: number }>;
}

const props = defineProps<Props>();

const mapContainer = ref<HTMLElement | null>(null);
let map: mapboxgl.Map | null = null;
let driverMarker: mapboxgl.Marker | null = null;
let routeLine: mapboxgl.GeoJSONSource | null = null;

// Mapbox access token - You'll need to add this to your .env file
// For now using a placeholder - get your free token from https://account.mapbox.com
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'; // Demo token

onMounted(() => {
  if (!mapContainer.value) return;

  mapboxgl.accessToken = MAPBOX_TOKEN;

  // Initialize map
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: props.currentLocation
      ? [props.currentLocation.longitude, props.currentLocation.latitude]
      : [0, 0],
    zoom: 10,
  });

  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  map.on('load', () => {
    // Add route line layer
    map!.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [],
        },
      },
    });

    map!.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#2563eb',
        'line-width': 4,
      },
    });

    updateMap();
  });
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});

watch(
  () => props.currentLocation,
  (newLocation) => {
    if (newLocation && map) {
      updateDriverMarker(newLocation);
      updateRoute();
    }
  },
  { deep: true }
);

watch(
  () => props.routePoints,
  () => {
    updateRoute();
  },
  { deep: true }
);

const updateMap = () => {
  if (!map || !props.currentLocation) return;

  updateDriverMarker(props.currentLocation);
  updateRoute();
};

const updateDriverMarker = (location: { latitude: number; longitude: number }) => {
  if (!map) return;

  const lngLat: [number, number] = [location.longitude, location.latitude];

  if (driverMarker) {
    driverMarker.setLngLat(lngLat);
  } else {
    // Create custom truck marker
    const el = document.createElement('div');
    el.className = 'driver-marker';
    el.innerHTML = `
      <div style="
        background: #2563eb;
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-weight: 600;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 4px;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
        Driver
      </div>
    `;

    driverMarker = new mapboxgl.Marker({ element: el })
      .setLngLat(lngLat)
      .addTo(map);
  }

  // Center map on driver with smooth animation
  map.flyTo({
    center: lngLat,
    zoom: 12,
    duration: 1000,
  });
};

const updateRoute = () => {
  if (!map || !map.getSource('route')) return;

  const coordinates = props.routePoints.map((point) => [
    point.longitude,
    point.latitude,
  ]);

  (map.getSource('route') as mapboxgl.GeoJSONSource).setData({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates,
    },
  });

  // Fit map to show entire route
  if (coordinates.length > 1) {
    const bounds = coordinates.reduce(
      (bounds, coord) => bounds.extend(coord as [number, number]),
      new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number])
    );

    map.fitBounds(bounds, {
      padding: 50,
      duration: 1000,
    });
  }
};
</script>

<style>
.driver-marker {
  cursor: pointer;
}

.mapboxgl-ctrl-attrib {
  font-size: 10px;
}
</style>
