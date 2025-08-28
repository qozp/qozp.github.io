<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import HomeContent from './components/content/HomeContent.vue'
import AboutContent from './components/content/AboutContent.vue'
import ProjectsContent from './components/content/ProjectsContent.vue'
import SkillsContent from './components/content/SkillsContent.vue'
import ResumeContent from './components/content/ResumeContent.vue'
import ContactContent from './components/content/ContactContent.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans scroll-smooth">
    <!-- Navbar -->
    <NavBar />

    <!-- Sections -->
    <main class="flex-1">
      <section
        id="home"
        class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-700 text-white"
      >
        <HomeContent />
      </section>

      <section id="about" class="min-h-screen flex items-center justify-center bg-gray-100">
        <AboutContent />
      </section>

      <section id="projects" class="min-h-screen flex items-center justify-center bg-white">
        <ProjectsContent />
      </section>

      <section id="skills" class="min-h-screen flex items-center justify-center bg-gray-100">
        <SkillsContent />
      </section>

      <section id="resume" class="min-h-screen flex items-center justify-center bg-white">
        <ResumeContent />
      </section>

      <section id="contact" class="min-h-screen flex items-center justify-center bg-gray-100">
        <ContactContent />
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 text-center py-4">© 2025 Isaiah D Pham</footer>
  </div>
</template>
