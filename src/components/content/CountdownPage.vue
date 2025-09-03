<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import confetti from 'canvas-confetti'

const targetDate = new Date('2025-10-09T23:59:59').getTime()
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
let interval: number

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
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
  launchConfetti()
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-indigo-700 text-white text-center px-4"
  >
    <h1 class="text-4xl font-bold mb-6 animate-pulse">Countdown to Fall Break!</h1>

    <!-- Responsive Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-lg">
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
  </div>
</template>
