<template>
    <div class="recent-attempts w-full mt-8">
      <h3 class="text-xl font-bold mb-4">Recent Attempts:</h3>
      <table class="w-full">
        <thead>
          <tr>
            <th class="text-left">Equation</th>
            <th class="text-left">Time (seconds)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(attempt, index) in recentAttempts" :key="index">
            <td v-html="attempt.equation"></td>
            <td>{{ attempt.time.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useGameStore } from '../stores/gameStore';
  import { computed } from 'vue';
  
  const gameStore = useGameStore();
  
  // Computed property to get recent attempts reactively
  const recentAttempts = computed(() => gameStore.history);
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th,
  td {
    padding: 8px;
    border-bottom: 1px solid #ddd;
  }
  </style>
  