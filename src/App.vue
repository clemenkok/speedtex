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
    <div class="content flex bg-gray-800 text-white">
      <!-- User Info Form or Equation Component -->
      <aside class="sidebar flex items-center justify-center">
        <UserInfoForm v-if="!user" />
        <EquationComponent v-else class="w-full h-full" />
      </aside>

      <!-- Right Section with Recent Attempts and Leaderboard -->
      <aside class="right-section">
        <div class="card overflow-y-auto">
          <RecentAttempts />
        </div>
        <div class="card overflow-y-auto relative">
          <Leaderboard :difficulty="difficulty" />
          <!-- Toggle Switch for Difficulty Selection -->
          <div class="toggle-switch absolute top-2 right-4 flex items-center">
            <span class="mr-2 text-gray-300">Normal</span>
            <label class="switch">
              <input type="checkbox" v-model="isHardMode" />
              <span class="slider round"></span>
            </label>
            <span class="ml-2 text-gray-300">Hard</span>
          </div>
        </div>
      </aside>
    </div>

    <!-- Footer with Version -->
    <footer class="footer bg-gray-800 text-gray-400 text-center py-2">
      v0.0.1
    </footer>
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
  flex-direction: row;
  flex: 1;
}

.sidebar {
  background-color: #1f2937;
  color: #d1d5db;
  flex: 1;
  padding: 1.5rem;
}

.right-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #1f2937;
}

.card {
  background-color: #2d3748;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  flex: 1;
}

.footer {
  position: sticky;
  bottom: 0;
  width: 100%;
}

.toggle-switch {
  display: flex;
  align-items: center;
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

/* Responsive Design for Mobile */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }
  
  .sidebar, .right-section {
    width: 100%;
    padding: 1rem;
  }

  .right-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
