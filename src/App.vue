<script setup lang="ts">
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans">
    <NavBar />

    <main class="flex-1">
      <RouterView />
    </main>

    <footer class="bg-gray-900 text-gray-400 text-center py-4">© 2025 Isaiah D Pham</footer>
  </div>
</template>
