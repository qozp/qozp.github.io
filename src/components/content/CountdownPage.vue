<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import confetti from 'canvas-confetti'

// Dates
const startDate = new Date('2025-09-03T00:00:00').getTime()
const targetDate = new Date('2025-10-09T23:59:59').getTime()

// Flight coords (LAX → DCA as example)
const startCoords: [number, number] = [34.053666452, -117.600664264] // ONT
const endCoords: [number, number] = [34.895671, -82.218859] // GSP

// Countdown refs
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
let interval: number

// Map state
let map: L.Map
let planeMarker: L.Marker

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

  updatePlanePosition(now)
}

const updatePlanePosition = (now: number) => {
  const progress = Math.min(1, Math.max(0, (now - startDate) / (targetDate - startDate)))

  const lat = startCoords[0] + (endCoords[0] - startCoords[0]) * progress
  const lng = startCoords[1] + (endCoords[1] - startCoords[1]) * progress

  if (planeMarker) {
    planeMarker.setLatLng([lat, lng])
  }
}

const launchConfetti = () => {
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 },
  })
}

onMounted(() => {
  // Init map
  map = L.map('map').setView(startCoords, 4)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)

  // Plane icon
  const planeIcon = L.divIcon({
    html: '✈️',
    className: '',
    iconSize: [30, 30],
  })

  planeMarker = L.marker(startCoords, { icon: planeIcon }).addTo(map)

  // Start countdown
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
  launchConfetti()
})

onUnmounted(() => {
  clearInterval(interval)
  map.remove()
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
