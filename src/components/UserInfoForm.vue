<template>
    <div class="user-info-form bg-white p-6 rounded-lg shadow-md max-w-md w-full mx-auto mt-8">
      <h2 class="text-2xl font-bold mb-4 text-center">Welcome to SpeedTeX</h2>
      <form @submit.prevent="submitUserInfo">
        <div class="mb-4">
          <label class="block text-sm font-bold mb-2">Name:</label>
          <input
            type="text"
            v-model="name"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-bold mb-2">Nationality:</label>
          <select
            v-model="nationality"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option disabled value="">Select your nationality</option>
            <option>USA</option>
            <option>Canada</option>
            <option>India</option>
            <option>UK</option>
            <option>Germany</option>
            <option>France</option>
            <option>Australia</option>
            <option>China</option>
            <option>Japan</option>
            <!-- Add more countries as needed -->
          </select>
        </div>
        <div class="flex justify-center">
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Start Game
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useGameStore } from '../stores/gameStore';
  
  const gameStore = useGameStore();
  const name = ref('');
  const nationality = ref('');
  
  const submitUserInfo = () => {
    if (name.value && nationality.value) {
      gameStore.setUser(name.value, nationality.value);
      console.log('Submitted User Info:', gameStore.user); // Debug: Confirm user is set after submission
    }
  };
  </script>
  
  <style scoped>
  .user-info-form {
    margin-top: 20vh; /* To center vertically */
  }
  </style>
  