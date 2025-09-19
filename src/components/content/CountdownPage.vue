<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import confetti from 'canvas-confetti'
import * as turf from '@turf/turf'
import { DateTime } from 'luxon'

// Dates
const startDate = DateTime.fromISO('2025-08-25T00:00:00', { zone: 'America/New_York' }).toMillis()
const targetDate = DateTime.fromISO('2025-10-09T06:10:00', { zone: 'America/New_York' }).toMillis()

// Flight coords (LAX → DCA as example)
const startCoords: [number, number] = [34.053666452, -117.600664264] // ONT
const endCoords: [number, number] = [33.640411, -84.419853] // ATL

// [athing]
const start = turf.point([startCoords[1], startCoords[0]]) // note: lng, lat
const end = turf.point([endCoords[1], endCoords[0]])

// Generate great-circle line
const greatCircle = turf.greatCircle(start, end, {
  npoints: 100, // number of curve segments (more = smoother)
})

// Convert back to [lat, lng] for Leaflet
const coords: [number, number][] = greatCircle.geometry.coordinates.map(
  (c) => [c[1], c[0]] as [number, number],
)

// Countdown refs
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
let interval: number

// Map state
let map: L.Map
let planeMarker: L.Marker

const now = ref<number | null>(null)

const planePosition = computed<[number, number] | null>(() => {
  if (now.value === null) return null // not ready yet

  const progress = Math.min(1, Math.max(0, (now.value - startDate) / (targetDate - startDate)))

  // Smooth index along coords
  const exactIndex = progress * (coords.length - 1)
  const lower = Math.floor(exactIndex)
  const upper = Math.min(coords.length - 1, lower + 1)
  const t = exactIndex - lower

  // Linear interpolate between two points
  const [lat1, lng1] = coords[lower]
  const [lat2, lng2] = coords[upper]

  const lat = lat1 + (lat2 - lat1) * t
  const lng = lng1 + (lng2 - lng1) * t

  return [lat, lng] as [number, number]
})

const updateCountdown = () => {
  const now = new Date().getTime()
  const distance = targetDate - now

  if (distance <= 0) {
    days.value = hours.value = minutes.value = seconds.value = 0
    clearInterval(interval)
    return
  }

  days.value = Math.floor(distance / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((distance % (1000 * 60)) / 1000)
}

const launchConfetti = () => {
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 },
  })
}

onMounted(() => {
  now.value = Date.now()

  // Init map
  map = L.map('map').setView(planePosition.value!, 4)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)

  const planeIcon = L.divIcon({
    html: `<div class="w-8 h-8 flex items-center justify-center">✈️</div>`,
    className: '', // remove default leaflet styles
    iconSize: [32, 32], // match Tailwind w-8/h-8
    iconAnchor: [16, 16], // center of the div
  })

  const route = L.polyline(coords, {
    color: '#38bdf8',
    weight: 2,
    opacity: 0.6,
  }).addTo(map)

  const midPoint = route.getBounds().getCenter()

  planeMarker = L.marker(midPoint, { icon: planeIcon }).addTo(map)

  // Start countdown
  updateCountdown()
  interval = setInterval(() => {
    now.value = Date.now()
  }, 1000)
  launchConfetti()
})

onUnmounted(() => {
  clearInterval(interval)
  map.remove()
})

watch(planePosition, (pos) => {
  if (planeMarker) {
    planeMarker.setLatLng(pos!)
  }
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-indigo-700 text-white text-center px-4"
  >
    <h1 class="text-4xl font-bold mb-6 animate-pulse">Countdown to Fall Break!</h1>

    <!-- Countdown Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-lg mb-6">
      <div class="flex flex-col items-center">
        <p class="text-5xl sm:text-6xl font-bold">{{ days }}</p>
        <p class="uppercase text-sm sm:text-base">Days</p>
      </div>
      <div class="flex flex-col items-center">
        <p class="text-5xl sm:text-6xl font-bold">{{ hours }}</p>
        <p class="uppercase text-sm sm:text-base">Hours</p>
      </div>
      <div class="flex flex-col items-center">
        <p class="text-5xl sm:text-6xl font-bold">{{ minutes }}</p>
        <p class="uppercase text-sm sm:text-base">Minutes</p>
      </div>
      <div class="flex flex-col items-center">
        <p class="text-5xl sm:text-6xl font-bold">{{ seconds }}</p>
        <p class="uppercase text-sm sm:text-base">Seconds</p>
      </div>
    </div>

    <!-- Map -->
    <div id="map" class="w-full max-w-4xl h-96 rounded-2xl shadow-lg"></div>
  </div>
</template>
