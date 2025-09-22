<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  spinning: boolean
}>()

const emit = defineEmits<{
  (e: 'pull'): void
}>()

const leverPosition = ref(0)
const leverPulled = ref(false)
let isDragging = false
let startY = 0

function startDrag(e: MouseEvent | TouchEvent) {
  if (props.spinning) return
  isDragging = true
  startY = 'touches' in e ? e.touches[0].clientY : e.clientY
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', endDrag)
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('touchend', endDrag)
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!isDragging) return
  const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY
  const diff = currentY - startY
  leverPosition.value = Math.min(140, Math.max(0, diff))
}

function endDrag() {
  if (!isDragging) return
  isDragging = false

  if (leverPosition.value > 80) {
    pullLever()
  }
  leverPosition.value = 0
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', endDrag)
}

function pullLever() {
  if (props.spinning) return
  leverPulled.value = true
  setTimeout(() => {
    emit('pull')
    leverPulled.value = false
  }, 300)
}
</script>

<template>
  <div
    class="w-6 h-40 bg-gray-600 rounded-full relative select-none"
    :class="spinning ? 'cursor-default' : 'cursor-pointer'"
    @mousedown="startDrag"
    @touchstart.prevent="startDrag"
    @click="!spinning && pullLever()"
  >
    <div
      class="w-8 h-8 bg-red-500 rounded-full absolute left-1/2 transform -translate-x-1/2 transition-[top] duration-200 ease-out"
      :style="{ top: leverPulled ? '140px' : leverPosition + 'px' }"
    ></div>
  </div>
</template>
