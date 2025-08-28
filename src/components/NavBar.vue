<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
]

const activeSection = ref('home')
let observer: IntersectionObserver | null = null

// Track mobile menu state
const isOpen = ref(false)

onMounted(() => {
  const options = { threshold: 0.5 }
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, options)

  sections.forEach((s) => {
    const el = document.getElementById(s.id)
    if (el) observer?.observe(el)
  })
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    isOpen.value = false // close menu on mobile after clicking
  }
}
</script>

<template>
  <nav class="fixed w-full bg-gray-800 text-white z-50 shadow-md">
    <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
      <!-- Logo / Name -->
      <div class="text-lg font-bold">Isaiah Pham</div>

      <!-- Desktop Menu -->
      <div class="hidden md:flex gap-8">
        <button
          v-for="s in sections"
          :key="s.id"
          @click="scrollToSection(s.id)"
          class="relative transition-colors"
          :class="activeSection === s.id ? 'text-blue-400 font-semibold' : 'hover:text-blue-300'"
        >
          {{ s.label }}
          <span
            class="absolute left-0 -bottom-1 h-[2px] bg-blue-400 transition-all duration-300"
            :class="activeSection === s.id ? 'w-full' : 'w-0'"
          ></span>
        </button>
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
      <button
        v-for="s in sections"
        :key="s.id"
        @click="scrollToSection(s.id)"
        class="text-lg transition-colors"
        :class="activeSection === s.id ? 'text-blue-400 font-semibold' : 'hover:text-blue-300'"
      >
        {{ s.label }}
      </button>
    </div>
  </nav>
</template>
