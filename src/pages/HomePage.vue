<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white"
  >
    <h1 class="text-5xl font-bold mb-6">Hello!</h1>

    <!-- Countdown Button -->
    <div class="flex flex-row items-center justify-center space-x-4">
      <!-- <RouterLink
        to="/countdown"
        class="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-lg font-semibold transition-colors"
      >
        Go to Countdown
      </RouterLink> -->

      <!-- Play Slots Button -->
      <RouterLink
        to="/slots"
        class="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white text-lg font-semibold transition-colors"
      >
        Play Slots
      </RouterLink>
    </div>
  </div>
</template>
