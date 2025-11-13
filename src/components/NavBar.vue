<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <nav class="fixed w-full bg-gray-800 text-white z-50 shadow-md">
    <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
      <!-- Desktop Menu -->
      <div class="hidden md:flex gap-8 items-center">
        <RouterLink to="/" class="hover:text-blue-300" active-class="text-blue-400 font-semibold">
          Home
        </RouterLink>
        <!-- <RouterLink
          to="/countdown"
          class="hover:text-blue-300"
          active-class="text-blue-400 font-semibold"
        >
          Countdown
        </RouterLink> -->

        <RouterLink
          to="/slots"
          class="hover:text-blue-300"
          active-class="text-blue-400 font-semibold"
          @click="isOpen = false"
        >
          Slots
        </RouterLink>

        <!-- External Link Button -->
        <a
          href="https://isaiah-pham.github.io"
          target="_blank"
          rel="noopener noreferrer"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm font-semibold transition-colors"
        >
          Looking for Isaiah Pham?
        </a>
      </div>

      <!-- Mobile Hamburger -->
      <button class="md:hidden flex flex-col gap-1" @click="isOpen = !isOpen">
        <span class="w-6 h-0.5 bg-white"></span>
        <span class="w-6 h-0.5 bg-white"></span>
        <span class="w-6 h-0.5 bg-white"></span>
      </button>
    </div>

    <!-- Mobile Dropdown -->
    <div v-if="isOpen" class="md:hidden bg-gray-900 flex flex-col items-center gap-6 py-6">
      <RouterLink
        to="/"
        class="text-lg hover:text-blue-300"
        active-class="text-blue-400 font-semibold"
        @click="isOpen = false"
      >
        Home
      </RouterLink>

      <RouterLink
        to="/countdown"
        class="text-lg hover:text-blue-300"
        active-class="text-blue-400 font-semibold"
        @click="isOpen = false"
      >
        Countdown
      </RouterLink>

      <RouterLink
        to="/slots"
        class="text-lg hover:text-blue-300"
        active-class="text-blue-400 font-semibold"
        @click="isOpen = false"
      >
        Slots
      </RouterLink>

      <!-- External Link for Mobile -->
      <a
        href="https://isaiah-pham.github.io"
        target="_blank"
        rel="noopener noreferrer"
        class="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm font-semibold transition-colors"
        @click="isOpen = false"
      >
        Looking for Isaiah Pham?
      </a>
    </div>
  </nav>
</template>
