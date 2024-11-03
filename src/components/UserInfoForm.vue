<template>
  <div class="user-info-form bg-gray-700 text-white p-6 rounded-lg shadow-md max-w-md w-full mx-auto mt-8">
    <h2 class="text-2xl font-bold mb-4 text-center">Welcome to SpeedTeX</h2>
    <form @submit.prevent="submitUserInfo">
      <!-- Name Input -->
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Name:</label>
        <input
          type="text"
          v-model="name"
          class="input-field"
          placeholder="Enter your name"
          required
        />
      </div>

      <!-- Nationality Select -->
      <div class="mb-6">
        <label class="block text-sm font-bold mb-2">Nationality:</label>
        <select
          v-model="nationality"
          class="input-field"
          required
        >
          <option disabled value="">Select your nationality</option>
          <option v-for="country in countries" :key="country.name" :value="country.name">
            {{ country.name }} {{ country.emoji }}
          </option>
        </select>
      </div>

      <!-- Difficulty Select -->
      <div class="mb-6">
        <label class="block text-sm font-bold mb-2">Difficulty:</label>
        <select
          v-model="difficulty"
          class="input-field"
          required
        >
          <option disabled value="">Select difficulty</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center">
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
const difficulty = ref('');
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

<style scoped>
/* Consistent styling for all form inputs and selects */
.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  background-color: #4b5563; /* Dark gray background */
  color: #d1d5db; /* Light gray text */
  appearance: none; /* Remove default browser styling */
  -webkit-appearance: none; /* Remove default styling in Safari */
  outline: none;
  transition: border-color 0.2s;
  font-size: 0.875rem;
}

/* Focus styling for inputs and selects */
.input-field:focus {
  border-color: #3b82f6; /* Blue border on focus */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* Blue outline */
}

/* Custom arrow for select dropdowns */
.input-field::after {
  content: '▼';
  font-size: 0.75rem;
  color: #d1d5db;
  position: absolute;
  right: 0.75rem;
  pointer-events: none;
}

/* Style the dropdown options */
select.input-field option {
  background-color: #4b5563;
  color: #d1d5db;
}
</style>
