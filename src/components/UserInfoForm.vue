<template>
  <div class="user-registration bg-gray-700 text-white p-6 rounded-lg shadow-md max-w-md w-full mx-auto mt-8">
    <h3 class="text-2xl font-bold mb-4 text-center">Register User</h3>
    <form @submit.prevent="registerUser">
      <!-- Username Input -->
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Username:</label>
        <input
          type="text"
          v-model="username"
          class="input-field"
          placeholder="Enter your username"
          required
        />
      </div>

      <!-- Nationality Select -->
      <div class="mb-6">
        <label class="block text-sm font-bold mb-2">Nationality:</label>
        <select v-model="nationality" class="input-field" required>
          <option disabled value="">Select your nationality</option>
          <option v-for="country in countries" :key="country.name" :value="country.name">
            {{ country.name }} {{ country.emoji }}
          </option>
        </select>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center">
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Import axios

// Import countries data from countries.json
import countriesData from '../../public/countries.json'; // Adjust path as necessary

const username = ref('');
const nationality = ref('');
const countries = ref<{ name: string; emoji: string }[]>([]);

// Load countries data from local JSON file
onMounted(() => {
  countries.value = countriesData;
});

// Function to handle user registration
const registerUser = async () => {
  try {
    const response = await axios.post('/api/users/register', {
      username: username.value,
      nationality: nationality.value,
    });
    alert('User registered successfully!');
  } catch (error) {
    // Check if error is an AxiosError and handle accordingly
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 409) {
        alert('User with this username and nationality already exists.');
      } else {
        alert('Failed to register user. Please try again.');
      }
    } else {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  }
};
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  background-color: #4b5563; /* Dark gray background */
  color: #d1d5db; /* Light gray text */
  appearance: none; /* Remove default browser styling */
  outline: none;
  transition: border-color 0.2s;
  font-size: 0.875rem;
}

/* Focus styling for inputs and selects */
.input-field:focus {
  border-color: #3b82f6; /* Blue border on focus */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* Blue outline */
}
</style>
