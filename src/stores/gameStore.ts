// stores/gameStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '../api/axios';

type LeaderboardEntry = {
  name: string;
  nationality: string;
  score: number;
  difficulty: string;
  equation: string;
  time: number;
};

type Attempt = {
  equation: string;
  time: number;
  score: number;
  difficulty: string;
};

// Define the return type for the store
export const useGameStore = defineStore('gameStore', () => {
  const history = ref<Attempt[]>([]);
  const leaderboard = ref<LeaderboardEntry[]>([]);
  const user = ref<{ name: string; nationality: string; difficulty: string } | null>(null);

  // Method to get a weight based on difficulty
  const getDifficultyWeight = (difficulty: string): number => {
    return difficulty === 'hard' ? 3 : 1;
  };

  const fetchLeaderboard = async (difficulty: string) => {
    try {
      const response = await apiClient.get('/leaderboard', {
        params: { difficulty },
      });
      leaderboard.value = response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const fetchAttempts = async () => {
    try {
      const response = await apiClient.get('/attempts');
      history.value = response.data;
    } catch (error) {
      console.error('Error fetching attempts:', error);
    }
  };

  const addLeaderboardEntry = async (entry: LeaderboardEntry) => {
    try {
      await apiClient.post('/leaderboard', entry);
      await fetchLeaderboard(entry.difficulty);
    } catch (error) {
      console.error('Error adding leaderboard entry:', error);
    }
  };

  const addAttempt = async (equation: string, time: number, difficulty: string) => {
    const difficultyWeight = getDifficultyWeight(difficulty);
    const score = difficultyWeight / time;
    const attempt = { equation, time, score, difficulty };

    try {
      await apiClient.post('/attempt', attempt);
      await fetchAttempts();
    } catch (error) {
      console.error('Error adding attempt:', error);
    }
  };

  const setUser = (name: string, nationality: string, difficulty: string) => {
    user.value = { name, nationality, difficulty };
  };

  return {
    history,
    leaderboard,
    user,
    addAttempt,
    addLeaderboardEntry,
    fetchLeaderboard,
    fetchAttempts,
    setUser,
    getDifficultyWeight, // Ensure this is returned here
  };
});
