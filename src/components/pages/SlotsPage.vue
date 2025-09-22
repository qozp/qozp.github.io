<script setup lang="ts">
import { onMounted, ref } from 'vue'
import confetti from 'canvas-confetti'

const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '7️⃣']
const reels = ref<string[][]>([['❔'], ['❔'], ['❔']])
const result = ref<string>('')
const spinning = ref(false)

function spin() {
  result.value = ''
  spinning.value = true
  reels.value = [['❔'], ['❔'], ['❔']]

  reels.value.forEach((_, i) => {
    let count = 0
    const interval = setInterval(() => {
      reels.value[i].push(symbols[Math.floor(Math.random() * symbols.length)])
      if (reels.value[i].length > 1) {
        reels.value[i].shift()
      }
      count++
    }, 120)

    setTimeout(
      () => {
        clearInterval(interval)
        reels.value[i] = [symbols[Math.floor(Math.random() * symbols.length)]]

        if (i === reels.value.length - 1) {
          spinning.value = false
          if (reels.value.every((r) => r[0] === reels.value[0][0])) {
            result.value = '🎉 Jackpot! You won!'
            launchConfetti()
          } else {
            result.value = 'Try again!'
          }
        }
      },
      1000 + i * 600,
    )
  })

  //   reels.value = [
  //     symbols[Math.floor(Math.random() * symbols.length)],
  //     symbols[Math.floor(Math.random() * symbols.length)],
  //     symbols[Math.floor(Math.random() * symbols.length)],
  //   ]
}

const launchConfetti = () => {
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 },
  })
}

onMounted(() => {})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white"
  >
    <h1 class="text-4xl font-bold mb-6">🎰 Slot Machine</h1>

    <!-- Reels -->
    <div class="flex space-x-4 mb-6">
      <div
        v-for="(reel, index) in reels"
        :key="index"
        class="w-20 h-20 flex items-center justify-center bg-gray-800 rounded-lg text-3xl font-bold"
      >
        <transition-group name="slide" tag="div" class="flex flex-col">
          <div
            v-for="(symbol, idx) in reel"
            :key="idx + '-' + symbol"
            class="w-20 h-6 flex items-center justify-center text-3xl font-bold"
          >
            {{ symbol }}
          </div>
        </transition-group>
      </div>
    </div>

    <!-- Spin Button -->
    <button
      @click="spin"
      :disable="spinning"
      class="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-lg font-semibold transition-colors"
    >
      {{ spinning ? 'Spinning...' : 'Spin' }}
    </button>

    <!-- Result -->
    <p v-if="result" class="mt-4 text-xl font-medium">
      {{ result }}
    </p>
  </div>
</template>

<style scoped>
/* smooth vertical sliding */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-enter-from {
  transform: translateY(100%);
}
.slide-enter-to {
  transform: translateY(0%);
}
.slide-leave-from {
  transform: translateY(0%);
}
.slide-leave-to {
  transform: translateY(-100%);
}
</style>
