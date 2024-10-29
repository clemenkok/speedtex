<template>
    <div class="equation-component bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md">
      <button
        v-if="!isPlaying"
        @click="startGame"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Start
      </button>
      <div v-if="isPlaying" class="mt-4">
        <p v-html="equation" class="text-2xl font-bold text-center mb-4"></p>
        <input
          type="text"
          v-model="userAnswer"
          @input="updatePreview"
          :disabled="isCompleted"
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Type the TeX code here..."
        />
        <p class="mt-4 text-lg text-center">Preview:</p>
        <p v-html="userPreview" class="text-lg font-bold text-center mb-4"></p>
        <p class="mt-4 text-lg text-center">Time: {{ timeElapsed.toFixed(2) }} seconds</p>
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
  import { useGameStore } from '../stores/gameStore';
  import { simplify } from 'mathjs';
  
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
  const difficulty = ref('');
  
  const startGame = () => {
    isPlaying.value = true;
    isCompleted.value = false;
    feedback.value = '';
    userAnswer.value = '';
    userPreview.value = '';
    timeElapsed.value = 0;
  
    generateRandomEquation();
    startTimer();
  };
  
  const generateRandomEquation = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*', '/'];
    const randomOperator = operators[Math.floor(Math.random() * operators.length)];
  
    if (randomOperator === '+' || randomOperator === '-') {
      difficulty.value = 'easy';
    } else if (randomOperator === '*' || randomOperator === '/') {
      difficulty.value = 'medium';
    }
  
    if (randomOperator === '+') {
      equation.value = `$$${num1} + ${num2}$$`;
      correctAnswer.value = `${num1} + ${num2}`;
    } else if (randomOperator === '-') {
      equation.value = `$$${num1} - ${num2}$$`;
      correctAnswer.value = `${num1} - ${num2}`;
    } else if (randomOperator === '*') {
      equation.value = `$$${num1} \\times ${num2}$$`;
      correctAnswer.value = `${num1} * ${num2}`;
    } else if (randomOperator === '/') {
      equation.value = `$$${num1} \\div ${num2}$$`;
      correctAnswer.value = `${num1} / ${num2}`;
    }
  
    nextTick(() => {
      window.MathJax.typeset();
    });
  };
  
  const startTimer = () => {
    timerInterval = setInterval(() => {
      timeElapsed.value += 0.01;
    }, 10);
  };
  
  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  };
  
  const updatePreview = async () => {
    userPreview.value = `$$${userAnswer.value}$$`;
    await nextTick();
    window.MathJax.typeset();
  
    const normalizedUserInput = normalizeInput(userAnswer.value);
    const normalizedCorrectAnswer = normalizeInput(correctAnswer.value);
  
    try {
      const userEvaluated = simplify(normalizedUserInput);
      const correctEvaluated = simplify(normalizedCorrectAnswer);
  
      if (userEvaluated.equals(correctEvaluated)) {
        feedback.value = 'Correct!';
        stopTimer();
        isCompleted.value = true;
  
        // Add the attempt to the store
        const score = gameStore.getDifficultyWeight(difficulty.value) / timeElapsed.value;
        if (gameStore.user) {
          gameStore.addLeaderboardAttempt(gameStore.user.name, gameStore.user.nationality, score);
        }
        gameStore.addAttempt(equation.value, timeElapsed.value, difficulty.value);
  
        await nextTick();
        window.MathJax.typeset();
      }
    } catch (error) {
      feedback.value = 'Keep trying!';
    }
  };
  
  const normalizeInput = (input: string) => {
    return input.replace(/\\times/g, '*').replace(/\\div/g, '/');
  };
  
  const feedbackClass = computed(() => {
    return feedback.value === 'Correct!' ? 'text-green-600 font-bold' : 'text-red-600';
  });
  
  onMounted(() => {
    window.MathJax.typeset();
  });
  </script>
  
  <style scoped>
  .equation-component {
    margin-bottom: 20px;
  }
  </style>
  