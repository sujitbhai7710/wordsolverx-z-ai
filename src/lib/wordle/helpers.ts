import { DEFAULT_WORD_LENGTH, MAX_GUESSES } from './config'; // DEFAULT_WORD_LENGTH will be used less directly
import type { GameState, LetterState, GuessRow, GameStatus, Stats, Settings, GameMode } from './types';
import { DEFAULT_STATS, DEFAULT_SETTINGS } from './config';
import { getWeek, getYear, startOfWeek, format, differenceInDays, differenceInCalendarWeeks } from 'date-fns'; // For weekly key generation and new date-fns functions

// import sixLetterAnswers from '@/src/data/wordle/six-letter-answers.json';
// import sixLetterAllowed from '@/src/data/wordle/six-letter-allowed-guesses.json';

// Function to get the solution word for the current day (or a specific date for archive)
export const getTodaysSolution = async (date?: Date): Promise<string> => {
  // For now, we'll fetch the whole list and pick one.
  // Later, implement logic to pick a specific word based on the date for daily/archive.
  try {
    const answers: string[] = []; // sixLetterAnswers;
    if (!answers || answers.length === 0) {
      throw new Error('Answer list is empty or invalid');
    }
    // Simple random selection for now. For a daily word, you'd use a date-based index.
    const randomIndex = Math.floor(Math.random() * answers.length);
    return answers[randomIndex].toUpperCase();
  } catch (error) {
    console.error("Error fetching today's solution:", error);
    return 'SYSTEM'; // Fallback solution
  }
};

// Function to check if a guess is a valid word from the allowed list
let allowedGuessesSet: Set<string> | null = null;
const loadAllowedGuesses = async (): Promise<Set<string>> => {
  if (allowedGuessesSet) {
    return allowedGuessesSet;
  }
  try {
    const allowed: string[] = []; // sixLetterAllowed;
    allowedGuessesSet = new Set(allowed.map(word => word.toUpperCase()));
    return allowedGuessesSet;
  } catch (error) {
    console.error("Error loading allowed guesses:", error);
    return new Set(); // Fallback to empty set
  }
};
// Call it once to start loading
loadAllowedGuesses();

export const isValidGuess = async (guess: string): Promise<boolean> => {
  const validWords = await loadAllowedGuesses();
  return validWords.has(guess.toUpperCase());
};

/**
 * Evaluates a guess against the solution for a given word length.
 * @param guess The guessed word.
 * @param solution The solution word.
 * @param wordLength The length of the words (e.g., 5 or 6).
 * @returns An array of LetterState indicating the status of each letter in the guess.
 */
export const evaluateGuess = (guess: string, solution: string, wordLength: number): LetterState[] => {
  if (guess.length !== wordLength || solution.length !== wordLength) {
    console.error('Guess and solution length must match wordLength parameter.');
    return Array(wordLength).fill('empty'); // Or throw error
  }
  const splitGuess = guess.toUpperCase().split('');
  const splitSolution = solution.toUpperCase().split('');
  const result = Array<LetterState>(wordLength).fill('absent');
  const solutionLetterCounts: { [key: string]: number } = {};

  splitSolution.forEach(letter => {
    solutionLetterCounts[letter] = (solutionLetterCounts[letter] || 0) + 1;
  });

  splitGuess.forEach((letter, i) => {
    if (letter === splitSolution[i]) {
      result[i] = 'correct';
      solutionLetterCounts[letter]--;
    }
  });

  splitGuess.forEach((letter, i) => {
    if (result[i] === 'correct') return;
    if (splitSolution.includes(letter) && solutionLetterCounts[letter] > 0) {
      result[i] = 'present';
      solutionLetterCounts[letter]--;
    }
  });

  return result;
};

// --- localStorage Functions ---
const BASE_GAME_STATE_KEY = 'wordleGameState';
const STATS_KEY = 'wordleStats_v1'; // Keep v1 for now, or add wordLength if stats are separate
const SETTINGS_KEY = 'wordleSettings_v1';

const getGameStateKey = (wordLength: number, gameMode: GameMode, dateRef?: Date | string | null): string => {
  const baseKey = `wordleGameState_${wordLength}`;
  let modeSpecificKeyPart = "";

  switch (gameMode) {
    case 'daily':
      // For daily, use local date string or current date
      const dailyDate = dateRef instanceof Date ? dateRef : (dateRef ? new Date(dateRef) : new Date());
      // Format the date to ensure consistent key format regardless of locale
      const dailyDateStr = `${dailyDate.getFullYear()}-${dailyDate.getMonth() + 1}-${dailyDate.getDate()}`;
      modeSpecificKeyPart = `daily_${dailyDateStr}`;
      break;
    case 'archive':
      // For archive, dateRef must be a date string or Date object for the specific archive day
      if (!dateRef) throw new Error('Date reference is required for archive mode game state key.');
      const archiveDateStr = dateRef instanceof Date ? dateRef.toDateString() : dateRef;
      modeSpecificKeyPart = `archive_${archiveDateStr.replace(/[^a-zA-Z0-9-_]/g, '-')}`;
      break;
    case 'weekly':
      // For weekly, dateRef should be any date within that week
      const refDateForWeek = dateRef instanceof Date ? dateRef : (dateRef ? new Date(dateRef) : new Date());
      const year = getYear(refDateForWeek);
      const week = getWeek(refDateForWeek, { weekStartsOn: 1 }); // ISO week
      modeSpecificKeyPart = `weekly_${year}-W${String(week).padStart(2, '0')}`;
      break;
    case 'infinity':
      // Infinity mode might not need a date/week based key, or use a constant one.
      // Using a constant key means only one infinity game is saved at a time.
      modeSpecificKeyPart = 'infinity';
      break;
    case 'challenge':
      // For challenge mode, dateRef should be the challenge ID
      if (!dateRef) throw new Error('Challenge ID is required for challenge mode game state key.');
      modeSpecificKeyPart = `challenge_${dateRef.toString()}`;
      break;
    default:
      // Fallback or error for unknown game mode
      console.error('Unknown game mode for getGameStateKey, defaulting to daily-like key');
      modeSpecificKeyPart = `unknown_${new Date().toDateString().replace(/[^a-zA-Z0-9-_]/g, '-')}`;
  }
  return `${baseKey}_${modeSpecificKeyPart}_v1`;
};

export const saveGameState = (gameState: GameState, wordLength: number, gameMode: GameMode, dateRef?: Date | string | null) => {
  try {
    const key = getGameStateKey(wordLength, gameMode, dateRef);
    localStorage.setItem(key, JSON.stringify(gameState));
  } catch (e) {
    console.error("Error saving game state to localStorage:", e);
  }
};

export const loadGameState = (wordLength: number, gameMode: GameMode, dateRef?: Date | string | null): GameState | null => {
  try {
    const key = getGameStateKey(wordLength, gameMode, dateRef);
    const stateJSON = localStorage.getItem(key);
    if (stateJSON) {
      const loadedState = JSON.parse(stateJSON) as GameState;
      if (loadedState && loadedState.solution && loadedState.board && loadedState.wordLength === wordLength) {
        // Additional validation for specific modes if necessary
        if ((gameMode === 'daily' || gameMode === 'archive') && dateRef) {
          const expectedDateStr = dateRef instanceof Date ? dateRef.toDateString() : dateRef;
          if (loadedState.solutionDate !== expectedDateStr) {
            console.warn(`Loaded game for ${loadedState.solutionDate} but expected ${expectedDateStr} (${gameMode}). Discarding.`);
            clearGameState(wordLength, gameMode, dateRef);
            return null;
          }
        }
        // For weekly, solutionDate in GameState might be the specific start-of-week date used for seeding.
        // The key itself ensures it's the correct week.
        return loadedState;
      }
    }
  } catch (e) {
    console.error("Error loading game state from localStorage:", e);
  }
  return null;
};

export const clearGameState = (wordLength: number, gameMode: GameMode, dateRef?: Date | string | null) => {
  try {
    const key = getGameStateKey(wordLength, gameMode, dateRef);
    localStorage.removeItem(key);
  } catch (e) {
    console.error("Error clearing game state from localStorage:", e);
  }
};

/**
 * Initializes a new game state for a given solution and word length.
 * @param solutionWord The solution word.
 * @param wordLength The length of the words.
 * @returns A new GameState object.
 */
export const initializeNewGameState = (solution: string, wordLength: number): GameState => {
  const maxGuessesForLength = wordLength === 6 ? 7 : MAX_GUESSES;
  const board: GuessRow[] = Array(maxGuessesForLength).fill(null).map(() => ({
    guess: Array(wordLength).fill(''),
    states: Array(wordLength).fill('empty'),
  }));
  // solutionDate will be set by the caller in page.tsx according to mode
  return {
    solution,
    solutionDate: "", // Placeholder, to be set by calling code in page.tsx
    board,
    evaluations: [],
    currentRowIndex: 0,
    gameStatus: 'IN_PROGRESS',
    lastPlayedTs: null,
    lastCompletedTs: null,
    wordLength: wordLength,
  };
};

/**
 * Recomputes keyboard letter states from guesses for a given word length.
 * @param guesses Array of GuessRow from the game board.
 * @param solution The solution word.
 * @param wordLength The length of the words.
 * @returns An object mapping letters to their LetterState.
 */
export const getLetterStatesFromGuesses = (guesses: GuessRow[], solution: string, wordLength: number): { [key: string]: LetterState } => {
  const letterStates: { [key: string]: LetterState } = {};
  guesses.forEach(guessRow => {
    // Ensure the guess row itself is consistent with the wordLength, though primarily relies on `evaluateGuess`
    if (guessRow.guess.join('').length === wordLength && guessRow.guess.some(l => l !== '')) {
      const evaluation = evaluateGuess(guessRow.guess.join(''), solution, wordLength);
      guessRow.guess.forEach((letter, i) => {
        if (i < wordLength) { // Ensure we only process letters within the current word length
          const char = letter.toUpperCase();
          const currentState = letterStates[char];
          const newState = evaluation[i];

          if (newState === 'correct') {
            letterStates[char] = 'correct';
          } else if (newState === 'present' && currentState !== 'correct') {
            letterStates[char] = 'present';
          } else if (newState === 'absent' && !currentState) {
            letterStates[char] = 'absent';
          }
        }
      });
    }
  });
  return letterStates;
};

// --- localStorage Functions for Stats & Settings ---

const getStatsKey = (wordLength: number, gameMode: GameMode): string => {
  // Sanitize gameMode for key if necessary, though current GameMode types are safe
  return `wordleStats_${wordLength}_${gameMode}_v1`;
};

export const saveStats = (stats: Stats, wordLength: number, gameMode: GameMode): void => {
  try {
    localStorage.setItem(getStatsKey(wordLength, gameMode), JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats to localStorage:', error);
  }
};

export const loadStats = (wordLength: number, gameMode: GameMode): Stats => {
  try {
    const statsString = localStorage.getItem(getStatsKey(wordLength, gameMode));
    if (statsString) {
      const stats = JSON.parse(statsString) as Stats; // Basic cast, could add more validation
      // Ensure all parts of DEFAULT_STATS are present if loaded stats are partial/old
      if (stats && typeof stats.gamesPlayed === 'number' && stats.guessDistribution) {
        return { ...DEFAULT_STATS, ...stats };
      }
    }
  } catch (error) {
    console.error('Error loading stats from localStorage:', error);
  }
  return { ...DEFAULT_STATS }; // Return a copy of default stats
};

export const updateStatsOnGameEnd = (currentStats: Stats, gameStatus: GameStatus, guessesTaken: number, wordLength: number, gameMode: GameMode, maxGuessesForMode: number): Stats => {
  const newStats = { ...currentStats }; // Operate on a copy
  newStats.gamesPlayed += 1;

  if (gameStatus === 'WIN') {
    newStats.gamesWon += 1;
    newStats.currentStreak += 1;
    if (newStats.currentStreak > newStats.maxStreak) {
      newStats.maxStreak = newStats.currentStreak;
    }
    // Use maxGuessesForMode to determine valid guess keys
    const guessKey = guessesTaken >= 1 && guessesTaken <= maxGuessesForMode ? guessesTaken : 'fail';

    if (!newStats.guessDistribution) newStats.guessDistribution = { ...DEFAULT_STATS.guessDistribution };

    // Ensure the key exists, especially for dynamic maxGuesses
    if (guessKey !== 'fail' && !(guessKey in newStats.guessDistribution)) {
      newStats.guessDistribution[guessKey as keyof Stats['guessDistribution']] = 0;
    }

    newStats.guessDistribution[guessKey as keyof Stats['guessDistribution']] =
      (newStats.guessDistribution[guessKey as keyof Stats['guessDistribution']] || 0) + 1;
    newStats.lastWinTs = Date.now();
  } else { // LOSS or other non-win status
    newStats.currentStreak = 0;
    if (!newStats.guessDistribution) newStats.guessDistribution = { ...DEFAULT_STATS.guessDistribution };
    newStats.guessDistribution.fail = (newStats.guessDistribution.fail || 0) + 1;
  }
  // Save the updated stats for the specific wordLength and gameMode
  saveStats(newStats, wordLength, gameMode);
  return newStats;
};

const EPOCH_STORAGE_KEY = 'wordleGameEpoch';

export const getGameEpoch = (): Date => {
  // Set a fixed epoch date that won't change even when localStorage is cleared
  // This ensures consistent day numbering across all users and devices
  // Reset requested by user: set to Jan 17, 2026 (or close to current date)
  const fixedEpochDate = new Date('2026-01-17T00:00:00.000Z');
  fixedEpochDate.setHours(0, 0, 0, 0);
  return fixedEpochDate;

  // Previous implementation that used localStorage and could be reset:
  /*
  const storedEpoch = localStorage.getItem(EPOCH_STORAGE_KEY);
  if (storedEpoch) {
    const epochDate = new Date(storedEpoch);
    // Check if the date is valid and not in the future (e.g. user manually changed it to something invalid)
    if (!isNaN(epochDate.getTime()) && epochDate <= new Date()) {
      epochDate.setHours(0,0,0,0); // Normalize to start of day
      return epochDate;
    }
  }
  // If no valid epoch stored, or it's in the future, set it to today and store it
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  localStorage.setItem(EPOCH_STORAGE_KEY, today.toISOString());
  return today;
  */
};

export const getGameNumber = (currentDate: Date, gameMode: 'daily' | 'weekly'): number => {
  // Get the fixed epoch date (January 1, 2023)
  const epoch = getGameEpoch();
  const normalizedCurrentDate = new Date(currentDate);
  normalizedCurrentDate.setHours(0, 0, 0, 0); // Normalize current date

  if (gameMode === 'daily') {
    // Ensure epoch is not after current date for daily calculation
    if (epoch > normalizedCurrentDate) return 1;
    const diffDays = differenceInDays(normalizedCurrentDate, epoch);
    return diffDays + 1; // Day 1 for the epoch day
  } else { // weekly
    const currentWeekStart = startOfWeek(normalizedCurrentDate, { weekStartsOn: 1 });
    const epochWeekStart = startOfWeek(epoch, { weekStartsOn: 1 });
    // Ensure epoch week is not after current week
    if (epochWeekStart > currentWeekStart) return 1;
    // Use differenceInCalendarWeeks for a more robust week count, ensuring weekStartsOn: 1 matches
    const diffWeeks = differenceInCalendarWeeks(currentWeekStart, epochWeekStart, { weekStartsOn: 1 });
    return diffWeeks + 1; // Week 1 for the epoch week
  }
};

export const saveSettings = (settings: Settings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
};

export const loadSettings = (): Settings => {
  try {
    const settingsString = localStorage.getItem(SETTINGS_KEY);
    if (settingsString) {
      const settings = JSON.parse(settingsString);
      // Add any validation or migration logic for settings if needed
      return { ...DEFAULT_SETTINGS, ...settings }; // Merge with defaults to ensure all keys exist
    }
  } catch (error) {
    console.error('Error loading settings from localStorage:', error);
  }
  return { ...DEFAULT_SETTINGS };
}; 