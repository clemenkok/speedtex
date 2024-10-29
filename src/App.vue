<template>
  <header class="bg-gray-800 text-white p-6 flex items-center justify-center gap-4">
    <div class="text-3xl font-bold flex items-center">
      Speed<span v-html="texLogo" class="ml-1"></span>
    </div>
  </header>
  <main class="container mx-auto flex py-8">
    <div v-if="!gameStore.user" class="w-full">
      <UserInfoForm />
    </div>
    <div v-else class="flex flex-row w-full gap-8 justify-center">
      <EquationComponent />
      <div class="flex flex-col gap-8 w-1/3">
        <RecentAttemptsComponent />
        <LeaderboardComponent />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import EquationComponent from './components/EquationComponent.vue';
import RecentAttemptsComponent from './components/RecentAttemptsComponent.vue';
import LeaderboardComponent from './components/LeaderboardComponent.vue';
import UserInfoForm from './components/UserInfoForm.vue';
import { useGameStore } from './stores/gameStore';
import { onMounted, ref, nextTick } from 'vue';

const gameStore = useGameStore();
const texLogo = ref('$$\\TeX$$');

onMounted(() => {
  nextTick(() => {
    window.MathJax.typeset();
  });
});
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #333; /* Dark grey */
  gap: 1rem;
}
.container {
  display: flex;
  flex-direction: row;
}
</style>
