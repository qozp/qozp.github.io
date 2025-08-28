<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')

function submitForm() {
  alert(`Thanks ${name.value}, I’ll be in touch at ${email.value}!`)
  name.value = ''
  email.value = ''
  message.value = ''
}
</script>

<template>
  <h2 class="text-3xl font-semibold mb-6">Contact Me</h2>
  <form @submit.prevent="submitForm" class="max-w-md mx-auto space-y-4">
    <input
      v-model="name"
      type="text"
      placeholder="Your Name"
      class="w-full border rounded p-2"
      required
    />
    <input
      v-model="email"
      type="email"
      placeholder="Your Email"
      class="w-full border rounded p-2"
      required
    />
    <textarea
      v-model="message"
      placeholder="Your Message"
      class="w-full border rounded p-2 h-32"
      required
    ></textarea>
    <button
      type="submit"
      class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
    >
      Send
    </button>
  </form>
</template>
