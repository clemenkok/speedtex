// stores/gameStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

type LeaderboardEntry = {
  name: string;
  nationality: string;
  score: number;
  difficulty: string;
  equation: string;  // Required equation
  time: number;      // Required time
};

type Attempt = {
  equation: string;
  time: number;
  score: number;
  difficulty: string;
};

export const useGameStore = defineStore('gameStore', () => {
  const history = ref<Attempt[]>([]);
  const leaderboard = ref<LeaderboardEntry[]>([]);
  const user = ref<{ name: string; nationality: string; difficulty: string } | null>(null);

  const getDifficultyWeight = (difficulty: string): number => {
    return difficulty === 'hard' ? 3 : 1;
  };

  const addAttempt = (equation: string, time: number, difficulty: string) => {
    const difficultyWeight = getDifficultyWeight(difficulty);
    const score = difficultyWeight / time;
    history.value.push({ equation, time, score, difficulty });
  };

  // Updated addLeaderboardAttempt to require `time` and `equation`
  const addLeaderboardAttempt = (
    name: string,
    nationality: string,
    score: number,
    difficulty: string,
    equation: string,
    time: number
  ) => {
    leaderboard.value.push({ name, nationality, score, difficulty, equation, time });
    if (difficulty === 'normal') {
      leaderboard.value.sort((a, b) => b.score - a.score);
    } else {
      leaderboard.value.sort((a, b) => a.equation.localeCompare(b.equation));
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
    addLeaderboardAttempt,
    getDifficultyWeight,
    setUser,
  };
});
