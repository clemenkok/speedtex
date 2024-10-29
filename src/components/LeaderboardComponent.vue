<template>
    <div class="leaderboard w-full mt-8">
      <h3 class="text-xl font-bold mb-4">Leaderboard:</h3>
      <div class="leaderboard-table border-t border-gray-300 mt-4">
        <div class="leaderboard-header grid grid-cols-3 font-semibold py-2">
          <div>Player</div>
          <div>Nationality</div>
          <div>Score</div>
        </div>
        <div
          v-for="(attempt, index) in leaderboardEntries"
          :key="index"
          class="leaderboard-row grid grid-cols-3 py-2 border-b border-gray-200"
        >
          <div>{{ attempt.name }}</div>
          <div>{{ attempt.nationality }}</div>
          <div>{{ attempt.score.toFixed(2) }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useGameStore } from '../stores/gameStore';
  import { computed } from 'vue';
  
  const gameStore = useGameStore();
  
  // Computed property to get leaderboard entries reactively
  const leaderboardEntries = computed(() => gameStore.leaderboard);
  </script>
  
  <style scoped>
  .leaderboard {
    max-width: 350px;
    padding-left: 20px;
  }
  .leaderboard-header,
  .leaderboard-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
  }
  </style>
  