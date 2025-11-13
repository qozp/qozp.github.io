<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import confetti from 'canvas-confetti'
import * as turf from '@turf/turf'
import { DateTime } from 'luxon'

function generateFlightCoords(
  start: [number, number],
  end: [number, number],
  npoints = 100,
): [number, number][] {
  const startPoint = turf.point([start[1], start[0]]) // lng, lat
  const endPoint = turf.point([end[1], end[0]])
  const greatCircle = turf.greatCircle(startPoint, endPoint, { npoints })
  return greatCircle.geometry.coordinates.map((c) => [c[1], c[0]] as [number, number])
}

// Generate driving coordinates along a straight line
function generateDriveCoords(
  start: [number, number],
  end: [number, number],
  npoints = 100,
): [number, number][] {
  const coords: [number, number][] = []
  for (let i = 0; i < npoints; i++) {
    const t = i / (npoints - 1)
    const lat = start[0] + (end[0] - start[0]) * t
    const lng = start[1] + (end[1] - start[1]) * t
    coords.push([lat, lng])
  }
  return coords
}

// Dates
const startDate = DateTime.fromISO('2025-11-13T06:00:00', { zone: 'America/New_York' }).toMillis()
const targetDate = DateTime.fromISO('2025-12-13T06:00:00', { zone: 'America/New_York' }).toMillis()

// Flight coords (LAX → DCA as example)
const startCoords: [number, number] = [33.942791, -118.410042] // LAX
const endCoords: [number, number] = [33.640411, -84.419853] // ATL
const flightCoords = generateFlightCoords(startCoords, endCoords, 100)

// Drive Coords
const driveStartCoords: [number, number] = [34.69497691842614, -82.80176871880728] // Clemson edge
const driveEndCoords: [number, number] = [33.640411, -84.419853] // ATL
const driveCoords = generateDriveCoords(driveStartCoords, driveEndCoords, 100)

// Countdown refs
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
let interval: number

// Map state
let map: L.Map
let planeMarker: L.Marker
let carMarker: L.Marker

const now = ref<number | null>(null)

const planePosition = computed<[number, number] | null>(() => {
  if (now.value === null) return null // not ready yet

  const progress = Math.min(1, Math.max(0, (now.value - startDate) / (targetDate - startDate)))

  // Smooth index along flightCoords
  const exactIndex = progress * (flightCoords.length - 1)
  const lower = Math.floor(exactIndex)
  const upper = Math.min(flightCoords.length - 1, lower + 1)
  const t = exactIndex - lower

  // Linear interpolate between two points
  const [lat1, lng1] = flightCoords[lower]
  const [lat2, lng2] = flightCoords[upper]

  const lat = lat1 + (lat2 - lat1) * t
  const lng = lng1 + (lng2 - lng1) * t

  return [lat, lng] as [number, number]
})

const carPosition = computed<[number, number] | null>(() => {
  if (!now.value) return null
  const progress = Math.min(1, Math.max(0, (now.value - startDate) / (targetDate - startDate)))
  const exactIndex = progress * (driveCoords.length - 1)
  const lower = Math.floor(exactIndex)
  const upper = Math.min(driveCoords.length - 1, lower + 1)
  const t = exactIndex - lower
  const [lat1, lng1] = driveCoords[lower]
  const [lat2, lng2] = driveCoords[upper]
  return [lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t]
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

  const carIcon = L.divIcon({
    html: `<div class="w-8 h-8 flex items-center justify-center">🚗</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 20],
  })

  const route = L.polyline(flightCoords, {
    color: '#38bdf8',
    weight: 2,
    opacity: 0.6,
  }).addTo(map)

  L.polyline(driveCoords, { color: '#f97316', weight: 2, opacity: 0.6 }).addTo(map)

  const midPoint = route.getBounds().getCenter()

  planeMarker = L.marker(midPoint, { icon: planeIcon }).addTo(map)
  carMarker = L.marker(carPosition.value!, { icon: carIcon }).addTo(map)

  const update = () => {
    now.value = Date.now()
    if (planeMarker) planeMarker.setLatLng(planePosition.value!)
    if (carMarker) carMarker.setLatLng(carPosition.value!)
    updateCountdown()
  }

  // Start countdown
  updateCountdown()
  interval = window.setInterval(update, 1000)
  launchConfetti()
})

onUnmounted(() => {
  clearInterval(interval)
  map.remove()
})

watch(planePosition, (pos) => {
  if (planeMarker && pos) planeMarker.setLatLng(pos)
})
watch(carPosition, (pos) => {
  if (carMarker && pos) carMarker.setLatLng(pos)
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-indigo-700 text-white text-center px-4"
  >
    <h1 class="text-4xl font-bold mb-6 animate-pulse">Countdown to Winter Break!</h1>

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
