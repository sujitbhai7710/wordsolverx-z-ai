const LETTER_FREQUENCY: Record<string, number> = {
  e: 1, t: 2, a: 3, o: 4, i: 5, n: 6, s: 7, h: 8, r: 9,
  d: 10, l: 11, c: 12, u: 13, m: 14, w: 15, f: 16, g: 17, y: 18,
  p: 19, b: 20, v: 21, k: 22, j: 23, x: 24, q: 25, z: 26
};

let wordSet: Set<string> | null = null;
let prefixSet: Set<string> | null = null;
let wordScores: Map<string, number> | null = null;

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

export interface FoundWord {
  word: string;
  length: number;
  score: number;
  path: Array<{ row: number; col: number }>;
  isBonus?: boolean;
}

export interface SolverResult {
  words: FoundWord[];
  totalWords: number;
  byLength: Record<number, FoundWord[]>;
  executionTime: number;
}

export interface OfficialPuzzle {
  grid: string[][];
  words: string[];
  bonusWords: string[];
  date: string;
  puzzleType: string;
}

function calculateWordScore(word: string): number {
  let score = 0;
  const normalized = word.toLowerCase();
  for (const char of normalized) {
    score += LETTER_FREQUENCY[char] || 15;
  }
  return Math.round(score * Math.pow(word.length, 1.5));
}

async function decompressGzip(response: Response): Promise<string> {
  if (typeof DecompressionStream !== 'undefined') {
    const ds = new DecompressionStream('gzip');
    const decompressed = response.body?.pipeThrough(ds);

    if (!decompressed) {
      throw new Error('Missing compressed response body');
    }

    const reader = decompressed.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;

    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    return new TextDecoder().decode(combined);
  }

  const fallback = await fetch('/squaredle/words_alpha.txt');
  return await fallback.text();
}

export async function loadDictionary(onProgress?: (progress: number) => void): Promise<number> {
  if (wordSet) {
    return wordSet.size;
  }

  let text = '';

  try {
    const compressed = await fetch('/squaredle/words_alpha.txt.gz');
    if (compressed.ok) {
      text = await decompressGzip(compressed);
    } else {
      throw new Error('Compressed dictionary unavailable');
    }
  } catch {
    const fallback = await fetch('/squaredle/words_alpha.txt');
    if (!fallback.ok) {
      throw new Error('Failed to load dictionary');
    }
    text = await fallback.text();
  }

  const words = text
    .split('\n')
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word.length >= 2 && /^[a-z]+$/.test(word));

  wordSet = new Set(words);
  prefixSet = new Set();
  wordScores = new Map();

  let processed = 0;
  const CHUNK_SIZE = 3000;
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let j = 1; j < word.length; j += 1) {
      prefixSet.add(word.slice(0, j));
    }
    wordScores.set(word, calculateWordScore(word));
    processed += 1;

    if (onProgress && processed % 30000 === 0) {
      onProgress(Math.round((processed / words.length) * 100));
    }

    // Yield to main thread every CHUNK_SIZE words to prevent blocking
    if (processed % CHUNK_SIZE === 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }
  }

  onProgress?.(100);
  return wordSet.size;
}

export function isDictionaryLoaded(): boolean {
  return wordSet !== null;
}

export function getDictionarySize(): number {
  return wordSet?.size || 0;
}

function buildPrefixSet(words: Set<string>): Set<string> {
  const prefixes = new Set<string>();
  for (const word of words) {
    for (let i = 1; i < word.length; i += 1) {
      prefixes.add(word.slice(0, i));
    }
  }
  return prefixes;
}

function dfs(
  row: number,
  col: number,
  currentPrefix: string,
  path: Array<{ row: number; col: number }>,
  visited: boolean[][],
  grid: string[][],
  rows: number,
  cols: number,
  foundWords: Map<string, FoundWord>,
  targetWords: Set<string>,
  targetPrefixes: Set<string>,
  bonusWords?: Set<string>
) {
  visited[row][col] = true;

  if (targetWords.has(currentPrefix) && !foundWords.has(currentPrefix)) {
    foundWords.set(currentPrefix, {
      word: currentPrefix,
      length: currentPrefix.length,
      score: wordScores?.get(currentPrefix) || calculateWordScore(currentPrefix),
      path: [...path],
      isBonus: bonusWords?.has(currentPrefix) || false
    });
  }

  for (const [dr, dc] of DIRECTIONS) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) continue;
    if (visited[newRow][newCol]) continue;

    const nextChar = grid[newRow][newCol];
    if (!nextChar) continue;

    const nextPrefix = currentPrefix + nextChar;
    if (!targetPrefixes.has(nextPrefix) && !targetWords.has(nextPrefix)) continue;

    path.push({ row: newRow, col: newCol });
    dfs(
      newRow,
      newCol,
      nextPrefix,
      path,
      visited,
      grid,
      rows,
      cols,
      foundWords,
      targetWords,
      targetPrefixes,
      bonusWords
    );
    path.pop();
  }

  visited[row][col] = false;
}

export function solveSquaredle(
  grid: string[][],
  minWordLength = 2,
  officialWords?: Set<string>,
  bonusWords?: Set<string>
): SolverResult {
  const startedAt = performance.now();

  if (!wordSet || !prefixSet) {
    throw new Error('Dictionary not loaded. Call loadDictionary first.');
  }

  if (!grid.length || !grid[0]?.length) {
    return { words: [], totalWords: 0, byLength: {}, executionTime: 0 };
  }

  const rows = grid.length;
  const cols = grid[0].length;
  const foundWords = new Map<string, FoundWord>();
  const normalizedGrid = grid.map((row) => row.map((cell) => (cell || '').toLowerCase().trim()));
  const targetWords = officialWords || wordSet;
  const targetPrefixes = officialWords ? buildPrefixSet(officialWords) : prefixSet;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const startChar = normalizedGrid[row][col];
      if (!startChar) continue;
      if (!targetPrefixes.has(startChar) && !targetWords.has(startChar)) continue;

      const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
      dfs(
        row,
        col,
        startChar,
        [{ row, col }],
        visited,
        normalizedGrid,
        rows,
        cols,
        foundWords,
        targetWords,
        targetPrefixes,
        bonusWords
      );
    }
  }

  const words = Array.from(foundWords.values())
    .filter((entry) => entry.length >= minWordLength)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.length !== a.length) return b.length - a.length;
      return a.word.localeCompare(b.word);
    });

  const byLength: Record<number, FoundWord[]> = {};
  for (const word of words) {
    (byLength[word.length] ||= []).push(word);
  }

  return {
    words,
    totalWords: words.length,
    byLength,
    executionTime: performance.now() - startedAt
  };
}

export async function fetchTodayPuzzle(): Promise<OfficialPuzzle | null> {
  try {
    const response = await fetch('/api/squaredle-today');
    const data = await response.json();

    if (data.success && data.grid) {
      return {
        grid: data.grid,
        words: data.words || data.validWords || [],
        bonusWords: data.bonusWords || [],
        date: data.date,
        puzzleType: data.puzzleType || 'daily'
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch Squaredle puzzle:', error);
    return null;
  }
}
