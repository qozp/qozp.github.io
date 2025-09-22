<script setup lang="ts">
import { ref } from 'vue'
import confetti from 'canvas-confetti'

// Symbols with weights
const symbols = [
  { symbol: '🍒', weight: 100 },
  { symbol: '🍋', weight: 100 },
  { symbol: '🍊', weight: 100 },
  { symbol: '🍇', weight: 100 },
  { symbol: '⭐', weight: 75 },
  { symbol: '7️⃣', weight: 50 },
]

let nextId = 0
const reelCount = 3
const cellCount = 3
const spinning = ref(false)
const result = ref('')
const leverPulled = ref(false)

function pullLever() {
  if (spinning.value) return
  leverPulled.value = true
  setTimeout(() => {
    spin()
    leverPulled.value = false
  }, 300) // lever snap-back delay
}

// Initialize reels with 3 symbols each
const reels = ref<{ symbol: string; id: number }[][]>(
  Array.from({ length: reelCount }, () =>
    Array.from({ length: cellCount }, () => ({ symbol: '❔', id: nextId++ })),
  ),
)

// Weighted random symbol
function weightedRandomSymbol() {
  const totalWeight = symbols.reduce((sum, s) => sum + s.weight, 0)
  let random = Math.random() * totalWeight
  for (const s of symbols) {
    if (random < s.weight) return s.symbol
    random -= s.weight
  }
  return symbols[0].symbol
}

const spinTimerMin = 1000
const spinTimerMax = 2000
const stagger = 250 // consistent delay between reels

function spin() {
  if (spinning.value) return
  spinning.value = true
  result.value = ''
  let stoppedCount = 0

  // Randomized spin duration per reel
  const spinDuration = Math.floor(Math.random() * (spinTimerMax - spinTimerMin)) + spinTimerMin

  reels.value.forEach((reel, i) => {
    reel.push({ symbol: weightedRandomSymbol(), id: nextId++ }) // extra symbol for smooth spin

    const interval = setInterval(
      () => {
        reel.push({ symbol: weightedRandomSymbol(), id: nextId++ })
        if (reel.length > 4) reel.shift() // maintain 4 symbols while spinning
      },
      60 + i * 10,
    )

    // Stop each reel with consistent stagger
    setTimeout(
      () => {
        clearInterval(interval)
        while (reel.length > 3) reel.shift() // shrink to 3 symbols
        for (let j = 0; j < 3; j++) {
          reel[j] = { symbol: weightedRandomSymbol(), id: nextId++ }
        }

        stoppedCount++

        if (stoppedCount === reelCount) {
          const middleSymbols = reels.value.map((r) => r[1].symbol)
          setTimeout(() => {
            if (middleSymbols.every((s) => s === middleSymbols[0])) {
              result.value = '🎉 Jackpot! You won!'
              confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } })
            } else {
              result.value = '🙁 Try again!'
            }
            spinning.value = false
          }, stagger)
        }
      },
      spinDuration + i * stagger,
    )
  })
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white"
  >
    <h1 class="text-4xl font-bold mb-6">🎰 Slot Machine</h1>

    <div class="flex space-x-6 mb-6 items-center">
      <!-- Reels -->
      <div class="flex space-x-4">
        <div
          v-for="(reel, i) in reels"
          :key="i"
          class="w-20 h-60 overflow-hidden bg-gray-800 rounded-lg"
        >
          <transition-group name="slide" tag="div" class="flex flex-col">
            <div
              v-for="item in reel"
              :key="item.id"
              class="w-20 h-20 flex items-center justify-center text-3xl font-bold"
              :class="{
                'ring-4 ring-yellow-400 shadow-lg shadow-yellow-500/50 rounded-lg':
                  !spinning && reel.indexOf(item) === 1,
              }"
            >
              {{ item.symbol }}
            </div>
          </transition-group>
        </div>
      </div>

      <!-- Lever -->
      <div
        class="w-6 h-40 bg-gray-600 rounded-full relative select-none"
        :class="spinning ? 'cursor-default' : 'cursor-pointer'"
        @click="!spinning && pullLever()"
      >
        <div
          class="w-8 h-8 bg-red-500 rounded-full absolute left-1/2 transform -translate-x-1/2"
          :class="leverPulled ? 'top-[140px]' : 'top-0 transition-all duration-300'"
        ></div>
      </div>
    </div>

    <!-- Spin button -->
    <button
      @click="spin"
      :disabled="spinning"
      class="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-lg font-semibold transition-colors"
      :class="spinning ? 'cursor-default' : 'cursor-pointer'"
    >
      {{ spinning ? 'Spinning...' : 'Spin' }}
    </button>

    <!-- Result -->
    <div class="mt-4 h-8 flex items-center justify-center">
      <p v-if="result" class="text-xl font-medium">
        {{ result }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Transition-group sliding */
.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.25s ease-in-out,
    opacity 0.25s linear;
}
.slide-enter-from {
  transform: translateY(50%);
  opacity: 0.75;
}
.slide-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.slide-leave-to {
  transform: translateY(-50%);
  opacity: 0.75;
}

/* Lever transitions */
.lever-knob {
  transition: top 0.3s ease-in-out;
}
</style>
