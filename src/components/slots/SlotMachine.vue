<script setup lang="ts">
import { ref } from 'vue'
import confetti from 'canvas-confetti'
import Lever from './SlotLever.vue'

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

// Balance & betting
const betAmount = 100
const balance = ref(Number(localStorage.getItem('balance')) || 1000)
function updateBalance(newBalance: number) {
  balance.value = newBalance
  localStorage.setItem('balance', balance.value.toString())
}

// Initialize reels
const reels = ref<{ symbol: string; id: number }[][]>(
  Array.from({ length: reelCount }, () =>
    Array.from({ length: cellCount }, () => ({ symbol: '❔', id: nextId++ })),
  ),
)

// Weighted symbol picker
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
const spinTimerMax = 1500
const stagger = 250

function spin() {
  if (spinning.value) return
  if (balance.value < betAmount) {
    result.value = '💸 Not enough balance!'
    return
  }

  // Deduct bet
  updateBalance(balance.value - betAmount)

  spinning.value = true
  result.value = ''
  let stoppedCount = 0
  const spinDuration = Math.floor(Math.random() * (spinTimerMax - spinTimerMin)) + spinTimerMin

  reels.value.forEach((reel, i) => {
    reel.push({ symbol: weightedRandomSymbol(), id: nextId++ })

    const interval = setInterval(
      () => {
        reel.push({ symbol: weightedRandomSymbol(), id: nextId++ })
        if (reel.length > 4) reel.shift()
      },
      80 + i * 10,
    )

    setTimeout(
      () => {
        clearInterval(interval)
        while (reel.length > 3) reel.shift()
        for (let j = 0; j < 3; j++) {
          reel[j] = { symbol: weightedRandomSymbol(), id: nextId++ }
        }

        stoppedCount++
        if (stoppedCount === reelCount) {
          const middleSymbols = reels.value.map((r) => r[1].symbol)
          setTimeout(() => {
            if (middleSymbols.every((s) => s === middleSymbols[0])) {
              result.value = `🎉 Jackpot! You won ${betAmount * 2}!`
              updateBalance(balance.value + betAmount * 2)
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

function handlePull() {
  spin()
}
</script>

<template>
  <div class="flex flex-col items-center">
    <p class="mb-4 text-lg">
      Balance: <span class="font-bold">{{ balance }}</span>
    </p>

    <div class="flex space-x-6 mb-6 items-center">
      <!-- Reels -->
      <div class="flex space-x-4">
        <div
          v-for="(reel, i) in reels"
          :key="i"
          class="w-20 h-60 overflow-hidden bg-gray-800 rounded-lg"
        >
          <transition-group name="slide" tag="div" class="flex flex-col-reverse">
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
      <Lever :spinning="spinning" @pull="handlePull" />
    </div>

    <button
      @click="handlePull"
      :disabled="spinning"
      class="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-lg font-semibold transition-colors"
      :class="spinning ? 'cursor-default' : 'cursor-pointer'"
    >
      {{ spinning ? 'Spinning...' : `Spin (-${betAmount})` }}
    </button>

    <div class="mt-4 h-8 flex items-center justify-center">
      <p v-if="result" class="text-xl font-medium">{{ result }}</p>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.25s ease-in-out,
    opacity 0.25s linear;
}
.slide-enter-from {
  transform: translateY(-50%);
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
  transform: translateY(50%);
  opacity: 0.75;
}
</style>
