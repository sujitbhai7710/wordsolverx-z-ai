import type { Stats, Settings } from './types';

export const MAX_GUESSES = 6;
export const DEFAULT_WORD_LENGTH = 5;
export const MAX_SHARE_RESULTS = 30;
export const REVEAL_TIME_MS = 350;
export const WELCOME_INFO_MODAL_MS = 350;
export const GAME_LOST_INFO_MODAL_MS = 500;
export const NOTIFICATION_TIME_MS = 2000;

export const KEY_BG_ABSENT = 'bg-gray-500 dark:bg-gray-700';
export const KEY_BG_PRESENT = 'bg-yellow-500 dark:bg-yellow-600';
export const KEY_BG_CORRECT = 'bg-green-500 dark:bg-green-600';

export const TILE_BG_EMPTY = 'bg-transparent';
export const TILE_BG_TBD = 'bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-500';
export const TILE_BG_ABSENT = 'bg-gray-500 dark:bg-gray-700 text-white';
export const TILE_BG_PRESENT = 'bg-yellow-500 dark:bg-yellow-600 text-white';
export const TILE_BG_CORRECT = 'bg-green-500 dark:bg-green-600 text-white';

// Colorblind mode alternatives
export const TILE_BG_PRESENT_CB = 'bg-blue-500 dark:bg-blue-600 text-white'; // Blue for present
export const TILE_BG_CORRECT_CB = 'bg-orange-500 dark:bg-orange-600 text-white'; // Orange for correct
// Absent remains gray, TBD and Empty also remain the same.

export const DEFAULT_STATS: Stats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    fail: 0,
  },
  lastWinTs: null,
};

export const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  hardMode: false,
  colorblindMode: false,
  showTimer: false,
  gameMode: 'daily',
};

// Ensure Stats and Settings types are imported if not in the same file or globally available
// For simplicity, assuming they are available. If not, add:
// import { Stats, Settings } from './types'; 