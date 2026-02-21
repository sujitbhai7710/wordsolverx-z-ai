export type LetterState = 'absent' | 'present' | 'correct' | 'empty' | 'tbd';

export type GameStatus = 'IN_PROGRESS' | 'WIN' | 'FAIL';

export interface GuessRow {
  guess: string[];
  states: LetterState[];
}

export interface GameState {
  solution: string;
  solutionDate: string; // Date for which the solution is valid (YYYY-MM-DD or similar)
  board: GuessRow[];
  evaluations: LetterState[][]; // for submitted rows
  currentRowIndex: number;
  gameStatus: GameStatus;
  lastPlayedTs: number | null;
  lastCompletedTs: number | null;
  wordLength: number; // Added to store the word length for the game state
  // Add more as needed for stats, settings, etc.
}

export interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7?: number; // Optional for games with more guesses (e.g., 6-letter words)
    fail: number;
  };
  lastWinTs: number | null; // Timestamp of the last win, for share countdown
}

export type GameMode = 'daily' | 'weekly' | 'infinity' | 'archive' | 'challenge';

export interface Settings {
  hardMode: boolean;
  darkMode: boolean;
  colorblindMode: boolean;
  showTimer: boolean;
  gameMode: GameMode;
}

export interface WordData {
  words: string[];
  valid: string[];
} 