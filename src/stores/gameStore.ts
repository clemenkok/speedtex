// stores/gameStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

// Define the types for LeaderboardEntry and Attempt
type LeaderboardEntry = {
  name: string;
  nationality: string;
  score: number;
  difficulty: string;
  equation: string;  // Required: equation for leaderboard
  time: number;      // Required: time taken
};

type Attempt = {
  equation: string;
  time: number;
  score: number;
  difficulty: string;
};

export const useGameStore = defineStore('gameStore', () => {
  // Store for recent attempts
  const history = ref<Attempt[]>([]);
  
  // Store for leaderboard entries
  const leaderboard = ref<LeaderboardEntry[]>([]);
  
  // User information, including selected difficulty
  const user = ref<{ name: string; nationality: string; difficulty: string } | null>(null);

  // Method to get a weight based on difficulty
  const getDifficultyWeight = (difficulty: string): number => {
    return difficulty === 'hard' ? 3 : 1;  // Hard mode has a higher weight
  };

  // Method to add an attempt to recent history
  const addAttempt = (equation: string, time: number, difficulty: string) => {
    const difficultyWeight = getDifficultyWeight(difficulty);
    const score = difficultyWeight / time;
    history.value.push({ equation, time, score, difficulty });
  };

  // Method to add a leaderboard attempt (requires equation and time)
  const addLeaderboardAttempt = (
    name: string,
    nationality: string,
    score: number,
    difficulty: string,
    equation: string,
    time: number
  ) => {
    leaderboard.value.push({ name, nationality, score, difficulty, equation, time });
    
    // Sort leaderboard based on difficulty setting
    if (difficulty === 'normal') {
      leaderboard.value.sort((a, b) => b.score - a.score);
    } else {
      leaderboard.value.sort((a, b) => a.equation.localeCompare(b.equation));
    }
  };

  // Method to set user information (name, nationality, and difficulty)
  const setUser = (name: string, nationality: string, difficulty: string) => {
    user.value = { name, nationality, difficulty };
  };

  // Method to update difficulty dynamically (used when switching modes)
  const setDifficulty = (difficulty: string) => {
    if (user.value) {
      user.value.difficulty = difficulty;
    }
  };

  return {
    history,
    leaderboard,
    user,
    addAttempt,
    addLeaderboardAttempt,
    getDifficultyWeight,
    setUser,
    setDifficulty,
  };
});
