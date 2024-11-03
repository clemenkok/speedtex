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

      <!-- Email Input for Authentication -->
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Email:</label>
        <input
          type="email"
          v-model="email"
          class="input-field"
          placeholder="Enter your email"
          required
        />
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
import axios from 'axios'; // Import axios for making API requests

// Form state variables
const name = ref('');
const nationality = ref('');
const difficulty = ref('');
const email = ref('');
const countries = ref<{ name: string; emoji: string }[]>([]);

// Fetch countries list from the backend API
const fetchCountries = async () => {
  try {
    const response = await axios.get('/api/countries'); // Replace with actual backend endpoint
    countries.value = response.data;
  } catch (error) {
    console.error('Error loading countries:', error);
  }
};

// Handle form submission
const submitUserInfo = async () => {
  try {
    // Step 1: Authenticate user by sending their email to the backend
    const authResponse = await axios.post('/api/auth/login', { email: email.value });
    if (authResponse.data.status !== 'success') {
      console.error('Authentication failed:', authResponse.data.message);
      return;
    }

    // Step 2: Submit user info (name, nationality, difficulty) to the backend after authentication
    const userInfo = {
      name: name.value,
      nationality: nationality.value,
      difficulty: difficulty.value,
      email: email.value,
    };
    const userResponse = await axios.post('/api/user', userInfo);

    if (userResponse.data.status === 'success') {
      alert('Logged in and user info saved successfully!');
    } else {
      console.error('Error saving user info:', userResponse.data.message);
    }
  } catch (error) {
    console.error('Error submitting user info:', error);
  }
};

// Fetch countries on component mount
onMounted(fetchCountries);
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  background-color: #4b5563;
  color: #d1d5db;
  appearance: none;
  outline: none;
  transition: border-color 0.2s;
  font-size: 0.875rem;
}

.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>
