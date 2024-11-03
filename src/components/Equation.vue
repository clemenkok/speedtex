<template>
  <div class="equation-component bg-gray-800 p-6 rounded-lg shadow-md w-full h-full flex flex-col items-center justify-center">
    <p class="text-white font-bold mb-4">Difficulty: {{ currentDifficulty }}</p>

    <button
      v-if="!isPlaying"
      @click="startGame"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
    >
      Start
    </button>

    <div v-if="isPlaying" class="mt-4 w-full flex flex-col items-center">
      <p v-html="equation" class="text-2xl font-bold text-center mb-4"></p>
      <input
        type="text"
        v-model="userAnswer"
        @input="updatePreview"
        :disabled="isCompleted"
        class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
        placeholder="Type the TeX code here..."
      />
      <p class="mt-4 text-lg text-center text-white">Preview:</p>
      <p v-html="userPreview" class="text-lg font-bold text-center mb-4 text-white"></p>
      <p class="mt-4 text-lg text-center text-white">Time: {{ timeElapsed.toFixed(2) }} seconds</p>
      <p v-if="feedback" :class="feedbackClass" class="text-center mt-4">{{ feedback }}</p>

      <div class="flex gap-4 mt-4">
        <button
          v-if="!isCompleted"
          @click="reRollEquation('normal')"
          class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Re-roll Normal Equation
        </button>
        <button
          v-if="!isCompleted"
          @click="reRollEquation('hard')"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Re-roll Hard Equation
        </button>
      </div>
    </div>

    <div v-if="isCompleted" class="mt-4">
      <button
        @click="startGame"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Play Again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';
import axios from '../api/axios'; // Import Axios instance with baseURL

// Game state variables
const equation = ref('');
const correctAnswer = ref('');
const userAnswer = ref('');
const userPreview = ref('');
const feedback = ref('');
const timeElapsed = ref(0);
const isPlaying = ref(false);
const isCompleted = ref(false);
// Timer interval reference
let timerInterval: number | undefined = undefined;

// User data (assuming it's fetched/stored globally or from a store)
const user = ref({ name: 'Player1', nationality: 'Country', difficulty: 'normal' });

const currentDifficulty = ref('normal');

// Feedback classes for visual indicators
const feedbackClass = computed(() => {
  if (feedback.value === 'Correct!') {
    return 'text-green-600 font-bold';
  } else if (feedback.value === 'Invalid input!') {
    return 'text-red-600 font-bold';
  } else {
    return 'text-yellow-600';
  }
});

const normalizeEquation = (input: string) => {
  return input
    .replace(/^\$\$|\$\$$/g, '')
    .replace(/\\mathbf/g, '')
    .replace(/\\nabla/g, '∇')
    .replace(/\\times/g, '*')
    .replace(/\\div/g, '/')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\int/g, '∫')
    .replace(/\\partial/g, '∂')
    .replace(/\\top/g, 'ᵗ')
    .replace(/\\left/g, '')
    .replace(/\\right/g, '')
    .replace(/\\frac/g, '')
    .replace(/\\,/g, '')
    .replace(/\\!/g, '')
    .replace(/[\s{}]/g, '')
    .toLowerCase();
};

// Generate equation based on selected difficulty
const generateRandomEquation = (difficulty: string) => {
  const predefinedEquations = [
    `f(\\mathbf{x}^{(k+1)}) \\le f(\\mathbf{x}^{(k)}) + \\beta \\alpha \\nabla_{d^{(k)}}f(\\mathbf{x}^{(k)})`,
    `\\beta^{(k)}=\\frac{\\mathbf{g}^{(k)\\top}(\\mathbf{g}^{(k)}-\\mathbf{g}^{(k-1)})}{\\mathbf{g}^{(k-1)\\top}\\mathbf{g}^{(k-1)}}`,
    `\\mathbf{v}^{(k+1)}=\\beta\\mathbf{v}^{(k)}-\\alpha\\nabla f(\\mathbf{x}^{(k)}+\\beta \\mathbf{v}^{(k)})`,
  ];
  equation.value = difficulty === 'normal' ? `$$\\int_{0}^{1} x^2 \\, dx$$` : `$$${predefinedEquations[Math.floor(Math.random() * predefinedEquations.length)]}$$`;
  correctAnswer.value = equation.value;
};

// Start the game
const startGame = () => {
  isPlaying.value = true;
  isCompleted.value = false;
  feedback.value = '';
  userAnswer.value = '';
  userPreview.value = '';
  timeElapsed.value = 0;
  generateRandomEquation(currentDifficulty.value);
  startTimer();
};

// Timer functions
const startTimer = () => {
  timerInterval = window.setInterval(() => {
    timeElapsed.value += 0.01;
  }, 10);
};

const stopTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
};

// Preview update and score submission
const updatePreview = async () => {
  userPreview.value = `$$${userAnswer.value}$$`;
  await nextTick();
  if (window.MathJax) window.MathJax.typeset();

  if (normalizeEquation(userAnswer.value) === normalizeEquation(correctAnswer.value)) {
    feedback.value = 'Correct!';
    stopTimer();
    isCompleted.value = true;
    
    const score = (currentDifficulty.value === 'hard' ? 3 : 1) / timeElapsed.value;
    await submitScore(equation.value, timeElapsed.value, score, currentDifficulty.value);
  } else {
    feedback.value = 'Keep trying!';
  }
};

// API call to submit score
const submitScore = async (equation: string, time: number, score: number, difficulty: string) => {
  const payload = {
    name: user.value.name,
    nationality: user.value.nationality,
    score,
    difficulty,
    equation,
    time,
  };

  try {
    await axios.post('/leaderboard', payload);
  } catch (error) {
    console.error('Failed to submit score:', error);
  }
};

// Reroll Equation
const reRollEquation = (difficulty: string) => {
  stopTimer();
  isCompleted.value = false;
  generateRandomEquation(difficulty);
  startTimer();
};

onMounted(() => {
  if (window.MathJax) window.MathJax.typeset();
});
</script>

<style scoped>
.equation-component {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
