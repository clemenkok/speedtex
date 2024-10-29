<template>
  <div class="leaderboard w-full h-full flex flex-col">
    <h3 class="text-xl font-bold mb-4 text-center">Leaderboard</h3>
    <table class="w-full">
      <thead>
        <tr>
          <th class="text-center">Player</th>
          <th class="text-center">Nationality</th>
          <th class="text-center">Equation</th>
          <th class="text-center">Score</th>
          <th class="text-center">Time (s)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in filteredLeaderboard" :key="index">
          <td class="text-center">{{ entry.name }}</td>
          <td class="text-center">{{ entry.nationality }}</td>
          <td class="text-center">{{ entry.equation || '-' }}</td>
          <td class="text-center">{{ entry.score.toFixed(2) }}</td>
          <td class="text-center">{{ entry.time.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore';

// Define props for difficulty
const props = defineProps<{ difficulty: string }>();
const gameStore = useGameStore();

// Filter leaderboard based on difficulty
const filteredLeaderboard = computed(() => {
  return gameStore.leaderboard.filter(entry => entry.difficulty === props.difficulty);
});
</script>

<style scoped>
.leaderboard {
  background-color: #2d3748;
  padding: 1rem;
  border-radius: 0.5rem;
}

.table-container {
  overflow-y: auto;
  max-height: calc(100% - 4rem); /* Adjusts to fit in the card with the title and pagination */
}

table {
  width: 100%;
  table-layout: fixed; /* Ensures columns stay consistent in width */
}

th, td {
  text-align: center;
  padding: 0.75rem;
  white-space: nowrap; /* Prevents text from wrapping */
  overflow: hidden;
  text-overflow: ellipsis; /* Adds ellipsis to truncated text */
}

thead th {
  font-weight: bold;
}
</style>
