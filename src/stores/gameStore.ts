import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/api/axios';

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
  const history = ref<Attempt[]>([]); // Holds recent attempts in memory
  const leaderboard = ref<LeaderboardEntry[]>([]);
  const user = ref<{ name: string; nationality: string; difficulty: string } | null>(null);

  // Method to get a weight based on difficulty
  const getDifficultyWeight = (difficulty: string): number => {
    return difficulty === 'hard' ? 3 : 1;
  };

  // Fetches the leaderboard from the backend
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

  // Adds a leaderboard entry to the backend and refreshes leaderboard
  const addLeaderboardEntry = async (entry: LeaderboardEntry) => {
    try {
      await apiClient.post('/leaderboard', entry);
      await fetchLeaderboard(entry.difficulty);
    } catch (error) {
      console.error('Error adding leaderboard entry:', error);
    }
  };

  // Adds an attempt locally (without backend storage)
  const addAttempt = (equation: string, time: number, difficulty: string) => {
    const difficultyWeight = getDifficultyWeight(difficulty);
    const score = difficultyWeight / time;
    const attempt = { equation, time, score, difficulty };

    // Add the attempt to the history array (no backend call)
    history.value.unshift(attempt);

    // Optionally, limit history to a certain number of attempts
    if (history.value.length > 50) {
      history.value.pop(); // Keep only the latest 50 attempts
    }
  };

  // Sets user information
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
    setUser,
    getDifficultyWeight,
  };
});
