<script setup lang="ts">
const projects = [
  {
    id: 1,
    title: 'Portfolio Site',
    desc: 'Personal website built with Vue 3 + Vite.',
    link: 'https://github.com/',
  },
  {
    id: 2,
    title: 'Dashboard App',
    desc: 'Data visualization tool with D3.js.',
    link: 'https://github.com/',
  },
  {
    id: 3,
    title: 'API Service',
    desc: 'Node.js + Express backend for IoT data.',
    link: 'https://github.com/',
  },
]
</script>

<template>
  <h2 class="text-3xl font-semibold mb-6">Projects</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div
      v-for="p in projects"
      :key="p.id"
      class="border rounded-xl p-6 shadow hover:shadow-lg transition bg-white"
    >
      <h3 class="text-xl font-bold mb-2">{{ p.title }}</h3>
      <p class="text-gray-600 mb-4">{{ p.desc }}</p>
      <a :href="p.link" target="_blank" class="text-blue-600 hover:underline">View Project →</a>
    </div>
  </div>
</template>
