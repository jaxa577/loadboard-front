<template>
  <div class="relative w-full h-full">
    <div ref="mapContainer" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from "vue";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
const config = useRuntimeConfig();

interface Props {
  origin: {
    city: string;
    region?: string;
    latitude?: number;
    longitude?: number;
  } | null;
  destination: {
    city: string;
    region?: string;
    latitude?: number;
    longitude?: number;
  } | null;
  currentLocation: { latitude: number; longitude: number } | null;
  routePoints: Array<{ latitude: number; longitude: number }>;
}

const props = defineProps<Props>();

const mapContainer = ref<HTMLElement | null>(null);
let map: mapboxgl.Map | null = null;
let driverMarker: mapboxgl.Marker | null = null;
let originMarker: mapboxgl.Marker | null = null;
let destinationMarker: mapboxgl.Marker | null = null;
let routeLine: mapboxgl.GeoJSONSource | null = null;

// Mapbox access token - You'll need to add this to your .env file
// For now using a placeholder - get your free token from https://account.mapbox.com

onMounted(() => {
  if (!mapContainer.value) return;

  mapboxgl.accessToken = config.public.mapboxToken;

  // Initialize map
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: "mapbox://styles/mapbox/streets-v12",
    center: props.currentLocation
      ? [props.currentLocation.longitude, props.currentLocation.latitude]
      : [0, 0],
    zoom: 10,
  });

  map.addControl(new mapboxgl.NavigationControl(), "top-right");

  map.on("load", () => {
    // Add route line layer
    map!.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      },
    });

    map!.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#2563eb",
        "line-width": 4,
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
  { deep: true },
);

watch(
  () => props.routePoints,
  () => {
    updateRoute();
  },
  { deep: true },
);

const updateMap = () => {
  if (!map) return;

  if (props.origin && props.origin.latitude && props.origin.longitude) {
    updateOriginMarker(props.origin);
  }

  if (
    props.destination &&
    props.destination.latitude &&
    props.destination.longitude
  ) {
    updateDestinationMarker(props.destination);
  }

  if (props.currentLocation) {
    updateDriverMarker(props.currentLocation);
  }

  updateRoute();
  fitMapToBounds();
};

const updateDriverMarker = (location: {
  latitude: number;
  longitude: number;
}) => {
  if (!map) return;

  const lngLat: [number, number] = [location.longitude, location.latitude];

  if (driverMarker) {
    driverMarker.setLngLat(lngLat);
  } else {
    // Create custom truck marker
    const el = document.createElement("div");
    el.className = "driver-marker";
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
};

const updateOriginMarker = (origin: {
  latitude: number;
  longitude: number;
  city: string;
}) => {
  if (!map) return;

  const lngLat: [number, number] = [origin.longitude, origin.latitude];

  if (originMarker) {
    originMarker.setLngLat(lngLat);
  } else {
    const el = document.createElement("div");
    el.innerHTML = `
      <div style="
        background: #10b981;
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-weight: 600;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 18px; height: 18px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        Origin
      </div>
    `;

    originMarker = new mapboxgl.Marker({ element: el })
      .setLngLat(lngLat)
      .addTo(map);
  }
};

const updateDestinationMarker = (destination: {
  latitude: number;
  longitude: number;
  city: string;
}) => {
  if (!map) return;

  const lngLat: [number, number] = [
    destination.longitude,
    destination.latitude,
  ];

  if (destinationMarker) {
    destinationMarker.setLngLat(lngLat);
  } else {
    const el = document.createElement("div");
    el.innerHTML = `
      <div style="
        background: #ef4444;
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-weight: 600;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 18px; height: 18px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        Destination
      </div>
    `;

    destinationMarker = new mapboxgl.Marker({ element: el })
      .setLngLat(lngLat)
      .addTo(map);
  }
};

const updateRoute = () => {
  if (!map || !map.getSource("route")) return;

  const coordinates = props.routePoints.map((point) => [
    point.longitude,
    point.latitude,
  ]);

  (map.getSource("route") as mapboxgl.GeoJSONSource).setData({
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates,
    },
  });
};

const fitMapToBounds = () => {
  if (!map) return;

  const bounds = new mapboxgl.LngLatBounds();
  let hasPoints = false;

  // Add origin
  if (props.origin && props.origin.latitude && props.origin.longitude) {
    bounds.extend([props.origin.longitude, props.origin.latitude]);
    hasPoints = true;
  }

  // Add destination
  if (
    props.destination &&
    props.destination.latitude &&
    props.destination.longitude
  ) {
    bounds.extend([props.destination.longitude, props.destination.latitude]);
    hasPoints = true;
  }

  // Add current location
  if (props.currentLocation) {
    bounds.extend([
      props.currentLocation.longitude,
      props.currentLocation.latitude,
    ]);
    hasPoints = true;
  }

  // Add route points
  props.routePoints.forEach((point) => {
    bounds.extend([point.longitude, point.latitude]);
    hasPoints = true;
  });

  if (hasPoints) {
    map.fitBounds(bounds, {
      padding: 80,
      duration: 1000,
      maxZoom: 12,
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
