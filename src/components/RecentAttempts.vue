<template>
  <div class="recent-attempts w-full h-full flex flex-col">
    <h3 class="text-xl font-bold mb-4 text-center">Recent Attempts</h3>
    <div class="table-container flex-grow overflow-y-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="text-center">Equation</th>
            <th class="text-center">Time (seconds)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(attempt, index) in paginatedAttempts" :key="index">
            <td class="text-center" v-html="attempt.equation"></td>
            <td class="text-center">{{ attempt.time.toFixed(2) }}</td>
          </tr>
          <tr v-if="!paginatedAttempts.length">
            <td colspan="2" class="text-center text-gray-400">No recent attempts</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalPages > 1" class="pagination mt-auto flex justify-center items-center">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Previous
      </button>
      <span class="mx-2 text-white">{{ currentPage }} / {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import axios from '../api/axios';

// Define the structure of an Attempt
interface Attempt {
  equation: string;
  time: number;
}

// Define reactive properties for current page and attempts per page
const currentPage = ref(1);
const itemsPerPage = 5;
const attempts = ref<Attempt[]>([]); // Define the type of attempts as an array of Attempt

// Fetch recent attempts from the backend
const fetchRecentAttempts = async () => {
  try {
    const response = await axios.get<Attempt[]>('/attempts'); // Type response as an array of Attempt
    attempts.value = response.data;
  } catch (error) {
    console.error('Error fetching recent attempts:', error);
  }
};

// Computed properties for pagination and sorting
const sortedAttempts = computed(() => {
  return [...attempts.value].sort((a, b) => b.time - a.time);
});

const totalPages = computed(() => {
  return Math.ceil(sortedAttempts.value.length / itemsPerPage);
});

const paginatedAttempts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedAttempts.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Watch paginatedAttempts to re-render MathJax whenever they update
watch(paginatedAttempts, async () => {
  await nextTick();
  if (window.MathJax) {
    window.MathJax.typeset();
  }
});

// Fetch recent attempts on component mount
onMounted(fetchRecentAttempts);
</script>

<style scoped>
.table-container {
  overflow-y: auto;
  max-height: calc(100% - 4rem);
}
.pagination {
  padding-top: 0.5rem;
}

/* Table and scrollbar styling (as before) */
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

.table-container::-webkit-scrollbar {
  width: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #2d3748;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: #4a5568;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background-color: #718096;
}
</style>
