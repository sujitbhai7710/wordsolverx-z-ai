import type { NonogramPuzzle } from './nonogram';

function createPuzzleFromGrid(grid: number[][]): NonogramPuzzle {
  const rows = grid.length;
  const cols = grid[0].length;
  const rowClues: number[][] = [];
  const colClues: number[][] = [];

  for (const row of grid) {
    const clues: number[] = [];
    let count = 0;
    for (const cell of row) {
      if (cell === 1) count++;
      else if (count > 0) { clues.push(count); count = 0; }
    }
    if (count > 0) clues.push(count);
    rowClues.push(clues.length === 0 ? [0] : clues);
  }

  for (let c = 0; c < cols; c++) {
    const clues: number[] = [];
    let count = 0;
    for (let r = 0; r < rows; r++) {
      if (grid[r][c] === 1) count++;
      else if (count > 0) { clues.push(count); count = 0; }
    }
    if (count > 0) clues.push(count);
    colClues.push(clues.length === 0 ? [0] : clues);
  }

  return { rows, cols, rowClues, colClues };
}

export const SAMPLE_PUZZLES: NonogramPuzzle[] = [
  createPuzzleFromGrid([[0,0,1,0,0],[0,1,1,1,0],[1,1,1,1,1],[0,1,1,1,0],[0,0,1,0,0]]),
  createPuzzleFromGrid([[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1]]),
  createPuzzleFromGrid([[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0]]),
  createPuzzleFromGrid([[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]]),
  createPuzzleFromGrid([[1,0,0,0,0],[1,1,0,0,0],[1,1,1,0,0],[1,1,1,1,0],[1,1,1,1,1]]),
  createPuzzleFromGrid([[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]]),
  createPuzzleFromGrid([[1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1]]),
  createPuzzleFromGrid([[1,0,0,0,0,1],[1,0,0,0,0,1],[1,1,1,1,1,1],[1,0,0,0,0,1],[1,0,0,0,0,1]]),
  createPuzzleFromGrid([[1,0,0,0,1],[1,1,0,1,1],[1,1,1,1,1],[0,1,1,1,0],[0,0,1,0,0]]),
  createPuzzleFromGrid([[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1]]),
  createPuzzleFromGrid([[0,0,1,0,0],[0,1,1,1,0],[1,1,1,1,1],[0,1,1,1,0],[0,1,1,1,0],[0,0,1,0,0],[0,1,1,1,0]]),
];

export function getPuzzleByIndex(index: number): NonogramPuzzle {
  return SAMPLE_PUZZLES[index % SAMPLE_PUZZLES.length];
}

export function getRandomPuzzle(): NonogramPuzzle {
  return SAMPLE_PUZZLES[Math.floor(Math.random() * SAMPLE_PUZZLES.length)];
}
