import framedDataJson from '../../static/framed_data.json';

export type FramedGameType = 'daily' | 'one-frame' | 'titleshot' | 'poster';

export interface FramedGameConfig {
  key: FramedGameType;
  label: string;
  description: string;
  emoji: string;
  referencePuzzle: number;
  color: string;
  gradient: string;
}

export interface FramedEntry {
  date: string;
  puzzleNumber: number;
  answer: string;
}

interface FramedModeDataset {
  key: FramedGameType;
  label: string;
  color: string;
  gradient: string;
  referencePuzzle: number;
  latestPuzzleNumber?: number;
  entries: FramedEntry[];
}

interface FramedDataset {
  generatedAt: string;
  referenceDate: string;
  modes: Record<FramedGameType, FramedModeDataset>;
}

export const GAME_TYPES: FramedGameConfig[] = [
  {
    key: 'daily',
    label: 'Framed Classic',
    description: 'Guess the movie from 6 frames, one revealed at a time.',
    emoji: '🎬',
    referencePuzzle: 1483,
    color: '#e50914',
    gradient: 'from-red-600 to-red-900'
  },
  {
    key: 'one-frame',
    label: 'One Frame',
    description: 'Guess the movie from just a single frame.',
    emoji: '📸',
    referencePuzzle: 486,
    color: '#6366f1',
    gradient: 'from-violet-500 to-purple-700'
  },
  {
    key: 'titleshot',
    label: 'Titleshot',
    description: 'Guess the movie from a title card screenshot.',
    emoji: '🔤',
    referencePuzzle: 302,
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    key: 'poster',
    label: 'Poster',
    description: 'Guess the movie from its poster art.',
    emoji: '🖼️',
    referencePuzzle: 252,
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-700'
  }
];

const dataset = framedDataJson as FramedDataset;
const REFERENCE_DATE = new Date(`${dataset.referenceDate}T00:00:00Z`);

function normalizeDate(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function getPuzzleNumber(gameType: FramedGameType, date: Date = new Date()): number {
  const game = GAME_TYPES.find((entry) => entry.key === gameType);
  if (!game) throw new Error(`Unknown Framed game type: ${gameType}`);

  const target = normalizeDate(date);
  const diffMs = target.getTime() - REFERENCE_DATE.getTime();
  return game.referencePuzzle + Math.round(diffMs / 86400000);
}

export function formatFramedDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

export function getFramedMode(gameType: FramedGameType): FramedModeDataset {
  return dataset.modes[gameType];
}

export function getFramedEntry(gameType: FramedGameType, dateKey: string): FramedEntry | null {
  return dataset.modes[gameType]?.entries.find((entry) => entry.date === dateKey) ?? null;
}

export function getFramedAvailableDates(): string[] {
  return [...new Set(Object.values(dataset.modes).flatMap((mode) => mode.entries.map((entry) => entry.date)))].sort(
    (left, right) => right.localeCompare(left)
  );
}

export function getFramedEntriesForDate(dateKey: string): Array<FramedEntry & { game: FramedGameConfig }> {
  return GAME_TYPES.map((game) => {
    const entry = getFramedEntry(game.key, dateKey);
    return entry ? { ...entry, game } : null;
  }).filter((entry): entry is FramedEntry & { game: FramedGameConfig } => entry !== null);
}

export function getLatestFramedDateKey(): string | null {
  const dates = getFramedAvailableDates();
  return dates.length > 0 ? dates[0] : null;
}

export function getTodayFramedEntries(dateKey?: string): Array<FramedEntry & { game: FramedGameConfig }> {
  if (!dateKey) {
    const latestKey = getLatestFramedDateKey();
    if (latestKey) return getFramedEntriesForDate(latestKey);
    return [];
  }

  return getFramedEntriesForDate(dateKey);
}
