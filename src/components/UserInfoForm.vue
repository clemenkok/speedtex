<template>
  <div class="user-info-form bg-gray-700 text-white p-6 rounded-lg shadow-md max-w-md w-full mx-auto mt-8">
    <h2 class="text-2xl font-bold mb-4 text-center">Welcome to SpeedTeX</h2>
    <form @submit.prevent="submitUserInfo">
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Name:</label>
        <input
          type="text"
          v-model="name"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-600 text-white"
          required
        />
      </div>
      <div class="mb-6">
        <label class="block text-sm font-bold mb-2">Nationality:</label>
        <select
          v-model="nationality"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-600 text-white"
          required
        >
          <option disabled value="">Select your nationality</option>
          <option v-for="country in countries" :key="country.name" :value="country.name">
            {{ country.emoji }} {{ country.name }}
          </option>
        </select>
      </div>
      <div class="mb-6">
        <label class="block text-sm font-bold mb-2">Difficulty:</label>
        <select
          v-model="difficulty"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-600 text-white"
          required
        >
          <option disabled value="">Select difficulty</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div class="flex justify-center">
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();
const name = ref('');
const nationality = ref('');
const difficulty = ref('');  // New field for difficulty
const countries = ref<{ name: string; emoji: string }[]>([]);

const submitUserInfo = () => {
  if (name.value && nationality.value && difficulty.value) {
    gameStore.setUser(name.value, nationality.value, difficulty.value);
  }
};

onMounted(async () => {
  try {
    const response = await fetch('/countries.json');
    countries.value = await response.json();
  } catch (error) {
    console.error('Error loading countries:', error);
  }
});
</script>
