<template>
  <div class="app-container">
    <!-- Top Header -->
    <header class="header flex justify-between items-center px-8 py-4 bg-gray-900 text-white shadow-md">
      <div class="logo flex items-center">
        <router-link to="/" class="text-xl font-bold hover:text-purple-400">SpeedTeX</router-link>
      </div>
      <div class="flex items-center gap-4">
        <span v-if="user" class="text-gray-400">Logged in as: {{ user.name }}</span>
        <a href="https://www.overleaf.com/learn/latex/List_of_Greek_letters_and_math_symbols" target="_blank" class="text-white bg-purple-600 px-4 py-2 rounded hover:bg-purple-700">
          TeX Guide
        </a>
      </div>
    </header>

    <!-- Main Content -->
    <div class="content flex h-screen bg-gray-800 text-white">
      <!-- Left Sidebar (User Info Form or Equation Component) -->
      <aside class="sidebar w-1/2 p-6 bg-gray-900 flex items-center justify-center">
        <UserInfoForm v-if="!user" />
        <EquationComponent v-else class="w-full h-full" />
      </aside>

      <!-- Right Sidebar: Recent Attempts and Leaderboard, only displayed if logged in -->
      <aside v-if="user" class="sidebar w-1/2 p-6 bg-gray-900">
        <div class="right-section h-full flex flex-col gap-4">
          <div class="card h-1/2 overflow-y-auto">
            <RecentAttempts />
          </div>
          <div class="card h-1/2 overflow-y-auto relative">
            <Leaderboard :difficulty="difficulty" />
            <!-- Toggle Switch for Difficulty Selection -->
            <div class="absolute top-2 right-4 flex items-center">
              <span class="mr-2 text-gray-300">Normal</span>
              <label class="switch">
                <input type="checkbox" v-model="isHardMode" />
                <span class="slider round"></span>
              </label>
              <span class="ml-2 text-gray-300">Hard</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import EquationComponent from './components/Equation.vue';
import RecentAttempts from './components/RecentAttempts.vue';
import Leaderboard from './components/Leaderboard.vue';
import UserInfoForm from './components/UserInfoForm.vue';
import { useGameStore } from './stores/gameStore';
import { computed, ref } from 'vue';

const gameStore = useGameStore();
const user = computed(() => gameStore.user);

const isHardMode = ref(false);  // Track the toggle state

// Compute difficulty based on the toggle state
const difficulty = computed(() => (isHardMode.value ? 'hard' : 'normal'));
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
}

.content {
  display: flex;
  flex: 1;
}

.sidebar {
  background-color: #1f2937;
  color: #d1d5db;
}

.right-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card {
  background-color: #2d3748;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 18px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4caf50;
}

input:checked + .slider:before {
  transform: translateX(16px);
}
</style>
