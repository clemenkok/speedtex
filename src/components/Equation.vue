<template>
  <div class="equation-component bg-gray-800 p-6 rounded-lg shadow-md w-full h-full flex flex-col items-center justify-center">
    <!-- Display current difficulty -->
    <p class="text-white font-bold mb-4">Difficulty: {{ currentDifficulty }}</p>

    <!-- Game Start Button -->
    <button
      v-if="!isPlaying"
      @click="startGame"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
    >
      Start
    </button>

    <!-- Equation and Input Section -->
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

      <!-- Re-roll Buttons for Each Difficulty -->
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

    <!-- Play Again Button -->
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
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();

let timerInterval: number | undefined = undefined;
const equation = ref('');
const correctAnswer = ref('');
const userAnswer = ref('');
const userPreview = ref('');
const feedback = ref('');
const timeElapsed = ref(0);
const isPlaying = ref(false);
const isCompleted = ref(false);

// Computed property for current difficulty (based on selected re-roll)
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

// Normalize equations to compare answers
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

// Predefined equations for hard difficulty
const predefinedEquations = [
  `f(\\mathbf{x}^{(k+1)}) \\le f(\\mathbf{x}^{(k)}) + \\beta \\alpha \\nabla_{d^{(k)}}f(\\mathbf{x}^{(k)})`,
  `\\beta^{(k)}=\\frac{\\mathbf{g}^{(k)\\top}(\\mathbf{g}^{(k)}-\\mathbf{g}^{(k-1)})}{\\mathbf{g}^{(k-1)\\top}\\mathbf{g}^{(k-1)}}`,
  `\\mathbf{v}^{(k+1)}=\\beta\\mathbf{v}^{(k)}-\\alpha\\nabla f(\\mathbf{x}^{(k)}+\\beta \\mathbf{v}^{(k)})`,
];

// Functions for random equations
const randomIntegral = () => {
  const variables = ['x', 'y', 'z'];
  const variable = variables[Math.floor(Math.random() * variables.length)];
  return `\\int_{0}^{1} ${variable}^2 \\, d${variable}`;
};

const randomPDE = () => {
  const operators = ['\\nabla^2', '\\frac{\\partial^2}{\\partial x^2}', '\\frac{\\partial}{\\partial t}'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  return `${operator} u(x, t) = \\alpha u(x, t)`;
};

// Generate equation based on selected difficulty
const generateRandomEquation = (difficulty: string) => {
  let equationContent = '';

  if (difficulty === 'normal') {
    const choice = Math.random();
    equationContent = choice < 0.5 ? randomIntegral() : randomPDE();
  } else {
    equationContent = predefinedEquations[Math.floor(Math.random() * predefinedEquations.length)];
  }

  equation.value = `$$${equationContent}$$`;
  correctAnswer.value = equationContent;
  currentDifficulty.value = difficulty; // Update current difficulty

  nextTick(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  });
};

// Start game function
const startGame = () => {
  isPlaying.value = true;
  isCompleted.value = false;
  feedback.value = '';
  userAnswer.value = '';
  userPreview.value = '';
  timeElapsed.value = 0;

  generateRandomEquation(currentDifficulty.value); // Use initial difficulty
  startTimer();
};

// Timer functions
const startTimer = () => {
  timerInterval = window.setInterval(() => {
    timeElapsed.value += 0.01;
  }, 10);
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
};

// Re-roll function with specific difficulty
const reRollEquation = (difficulty: string) => {
  stopTimer();
  timeElapsed.value = 0;
  feedback.value = '';
  userAnswer.value = '';
  userPreview.value = '';
  isCompleted.value = false;

  generateRandomEquation(difficulty);
  startTimer();
};

// Preview update function
const updatePreview = async () => {
  userPreview.value = `$$${userAnswer.value}$$`;
  await nextTick();
  if (window.MathJax) {
    window.MathJax.typeset();
  }

  const normalizedUserInput = normalizeEquation(userAnswer.value);
  const normalizedCorrectAnswer = normalizeEquation(correctAnswer.value);

  if (normalizedUserInput === normalizedCorrectAnswer) {
    feedback.value = 'Correct!';
    stopTimer();
    isCompleted.value = true;

    const score = gameStore.getDifficultyWeight(currentDifficulty.value) / timeElapsed.value;
    if (gameStore.user) {
      gameStore.addLeaderboardAttempt(
        gameStore.user.name,
        gameStore.user.nationality,
        score,
        currentDifficulty.value,
        equation.value,
        timeElapsed.value
      );
    }
    gameStore.addAttempt(equation.value, timeElapsed.value, currentDifficulty.value);
  } else {
    feedback.value = 'Keep trying!';
  }
};

onMounted(() => {
  if (window.MathJax) {
    window.MathJax.typeset();
  }
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
