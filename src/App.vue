<script setup lang="ts"></script>

<template>
  <div class="min-h-screen flex flex-col font-sans">
    <!-- Navbar -->
    <nav class="bg-gray-800 text-white px-6 py-4 flex gap-6">
      <RouterLink to="/" class="hover:underline">Home</RouterLink>
      <RouterLink to="/about" class="hover:underline">About</RouterLink>
      <RouterLink to="/projects" class="hover:underline">Projects</RouterLink>
      <RouterLink to="/resume" class="hover:underline">Resume</RouterLink>
      <RouterLink to="/contact" class="hover:underline">Contact</RouterLink>
    </nav>

    <!-- Main -->
    <main class="flex-1 p-8">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 text-center py-4">© 2025 Your Name</footer>
  </div>
</template>
