import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGameStore = defineStore('gameStore', () => {
  const history = ref<{ equation: string; time: number; score: number }[]>([]);
  const leaderboard = ref<{ name: string; nationality: string; score: number }[]>([]);
  const user = ref<{ name: string; nationality: string } | null>(null);

  // Get difficulty weight for score calculation
  const getDifficultyWeight = (difficulty: string): number => {
    if (difficulty === 'easy') return 1;
    if (difficulty === 'medium') return 2;
    if (difficulty === 'hard') return 3;
    return 1; // Default to easy
  };

  // Add an attempt to the recent history
  const addAttempt = (equation: string, time: number, difficulty: string) => {
    const difficultyWeight = getDifficultyWeight(difficulty);
    const score = difficultyWeight / time;
    history.value.push({ equation, time, score });
    console.log('Recent Attempts Updated:', history.value); // Debugging
  };
  
  const addLeaderboardAttempt = (name: string, nationality: string, score: number) => {
    leaderboard.value.push({ name, nationality, score });
    leaderboard.value.sort((a, b) => b.score - a.score);
    console.log('Leaderboard Updated:', leaderboard.value); // Debugging
  };
  
  // Set user information
  const setUser = (name: string, nationality: string) => {
    user.value = { name, nationality };
  };

  return {
    history,
    leaderboard,
    user,
    addAttempt,
    addLeaderboardAttempt,
    getDifficultyWeight,
    setUser,
  };
});
