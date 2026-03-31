export const FILLED = 1;
export const BLANK = 0;
export const UNKNOWN = -1;

export type CellState = typeof FILLED | typeof BLANK | typeof UNKNOWN;
export type Grid = CellState[][];
export type Clues = number[][];

export interface NonogramPuzzle {
  rows: number;
  cols: number;
  rowClues: Clues;
  colClues: Clues;
}

export interface SolveResult {
  solution: Grid | null;
  solved: boolean;
  steps: SolveStep[];
  error?: string;
}

export interface SolveStep {
  type: 'line' | 'propagation' | 'backtrack' | 'guess';
  description: string;
  cells: { row: number; col: number; value: CellState }[];
  gridSnapshot: Grid;
}

export function generateLineArrangements(
  clues: number[],
  length: number,
  currentLine: CellState[] = []
): CellState[][] {
  if (clues.length === 0) {
    const arrangement = [...currentLine];
    while (arrangement.length < length) arrangement.push(BLANK);
    return [arrangement];
  }

  const minSpace = clues.reduce((sum, c) => sum + c, 0) + clues.length - 1;
  const remaining = length - currentLine.length;
  if (minSpace > remaining) return [];

  const arrangements: CellState[][] = [];
  const firstClue = clues[0];
  const remainingClues = clues.slice(1);

  for (let start = 0; start <= remaining - minSpace; start++) {
    const newLine = [...currentLine];
    for (let i = 0; i < start; i++) newLine.push(BLANK);
    for (let i = 0; i < firstClue; i++) newLine.push(FILLED);
    if (remainingClues.length > 0) newLine.push(BLANK);
    const subArrangements = generateLineArrangements(remainingClues, length, newLine);
    arrangements.push(...subArrangements);
  }

  return arrangements;
}

export function filterValidArrangements(
  arrangements: CellState[][],
  currentLine: CellState[]
): CellState[][] {
  return arrangements.filter(arrangement => {
    for (let i = 0; i < currentLine.length; i++) {
      if (currentLine[i] !== UNKNOWN && currentLine[i] !== arrangement[i]) return false;
    }
    return true;
  });
}

export function findDeterminedCells(
  arrangements: CellState[][],
  length: number,
  currentLine: CellState[]
): { index: number; value: CellState }[] {
  if (arrangements.length === 0) return [];
  const determined: { index: number; value: CellState }[] = [];
  for (let i = 0; i < length; i++) {
    if (currentLine[i] !== UNKNOWN) continue;
    const firstValue = arrangements[0][i];
    const allSame = arrangements.every(arr => arr[i] === firstValue);
    if (allSame) determined.push({ index: i, value: firstValue });
  }
  return determined;
}

export function solveLine(
  clues: number[],
  currentLine: CellState[]
): { index: number; value: CellState }[] {
  const length = currentLine.length;
  const allArrangements = generateLineArrangements(clues, length);
  const validArrangements = filterValidArrangements(allArrangements, currentLine);
  return findDeterminedCells(validArrangements, length, currentLine);
}

export function createEmptyGrid(rows: number, cols: number): Grid {
  return Array(rows).fill(null).map(() => Array(cols).fill(UNKNOWN));
}

export function copyGrid(grid: Grid): Grid {
  return grid.map(row => [...row]);
}

export function isGridSolved(grid: Grid): boolean {
  return grid.every(row => row.every(cell => cell !== UNKNOWN));
}

export function hasContradiction(grid: Grid, rowClues: Clues, colClues: Clues): boolean {
  const rows = grid.length;
  const cols = grid[0].length;
  for (let r = 0; r < rows; r++) {
    const arrangements = generateLineArrangements(rowClues[r], cols);
    const valid = filterValidArrangements(arrangements, grid[r]);
    if (valid.length === 0) return true;
  }
  for (let c = 0; c < cols; c++) {
    const colLine = grid.map(row => row[c]);
    const arrangements = generateLineArrangements(colClues[c], rows);
    const valid = filterValidArrangements(arrangements, colLine);
    if (valid.length === 0) return true;
  }
  return false;
}

export function propagate(
  grid: Grid,
  rowClues: Clues,
  colClues: Clues,
  onStep?: (step: SolveStep) => void
): { grid: Grid; progress: boolean } {
  const rows = grid.length;
  const cols = grid[0].length;
  let currentGrid = copyGrid(grid);
  let madeProgress = true;
  let totalProgress = false;

  while (madeProgress) {
    madeProgress = false;
    for (let r = 0; r < rows; r++) {
      const determined = solveLine(rowClues[r], currentGrid[r]);
      if (determined.length > 0) {
        madeProgress = true;
        totalProgress = true;
        const cells = determined.map(d => ({ row: r, col: d.index, value: d.value }));
        for (const d of determined) currentGrid[r][d.index] = d.value;
        if (onStep) onStep({ type: 'line', description: `Row ${r + 1}: Determined ${determined.length} cell(s)`, cells, gridSnapshot: copyGrid(currentGrid) });
      }
    }
    for (let c = 0; c < cols; c++) {
      const colLine = currentGrid.map(row => row[c]);
      const determined = solveLine(colClues[c], colLine);
      if (determined.length > 0) {
        madeProgress = true;
        totalProgress = true;
        const cells = determined.map(d => ({ row: d.index, col: c, value: d.value }));
        for (const d of determined) currentGrid[d.index][c] = d.value;
        if (onStep) onStep({ type: 'line', description: `Column ${c + 1}: Determined ${determined.length} cell(s)`, cells, gridSnapshot: copyGrid(currentGrid) });
      }
    }
  }

  return { grid: currentGrid, progress: totalProgress };
}

export function findBestGuessCell(grid: Grid, rowClues: Clues, colClues: Clues): { row: number; col: number } | null {
  const rows = grid.length;
  const cols = grid[0].length;
  let bestCell: { row: number; col: number } | null = null;
  let minOptions = Infinity;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === UNKNOWN) {
        const rowArrangements = filterValidArrangements(generateLineArrangements(rowClues[r], cols), grid[r]);
        const colLine = grid.map(row => row[c]);
        const colArrangements = filterValidArrangements(generateLineArrangements(colClues[c], rows), colLine);
        const options = Math.max(1, Math.min(rowArrangements.length, colArrangements.length));
        if (options < minOptions) { minOptions = options; bestCell = { row: r, col: c }; }
      }
    }
  }
  return bestCell;
}

export function solveNonogram(
  puzzle: NonogramPuzzle,
  onStep?: (step: SolveStep) => void,
  maxBacktracks: number = 10000
): SolveResult {
  const { rows, cols, rowClues, colClues } = puzzle;
  const steps: SolveStep[] = [];

  const recordStep = (step: SolveStep) => { steps.push(step); if (onStep) onStep(step); };

  let grid = createEmptyGrid(rows, cols);

  recordStep({ type: 'propagation', description: 'Starting constraint propagation phase', cells: [], gridSnapshot: copyGrid(grid) });
  const propagationResult = propagate(grid, rowClues, colClues, recordStep);
  grid = propagationResult.grid;

  if (isGridSolved(grid)) return { solution: grid, solved: true, steps };
  if (hasContradiction(grid, rowClues, colClues)) return { solution: null, solved: false, steps, error: 'Contradiction detected' };

  recordStep({ type: 'backtrack', description: 'Starting backtracking phase', cells: [], gridSnapshot: copyGrid(grid) });

  let backtrackCount = 0;
  const backtrackStack: { grid: Grid; cell: { row: number; col: number }; triedFilled: boolean }[] = [];

  while (!isGridSolved(grid) && backtrackCount < maxBacktracks) {
    const guessCell = findBestGuessCell(grid, rowClues, colClues);
    if (!guessCell) break;

    recordStep({ type: 'guess', description: `Guessing cell (${guessCell.row + 1}, ${guessCell.col + 1}) = FILLED`, cells: [{ row: guessCell.row, col: guessCell.col, value: FILLED }], gridSnapshot: copyGrid(grid) });

    const gridCopy = copyGrid(grid);
    gridCopy[guessCell.row][guessCell.col] = FILLED;
    backtrackStack.push({ grid: copyGrid(grid), cell: guessCell, triedFilled: true });

    const result = propagate(gridCopy, rowClues, colClues, recordStep);

    if (hasContradiction(result.grid, rowClues, colClues)) {
      backtrackCount++;
      const lastGuess = backtrackStack.pop();
      if (!lastGuess) return { solution: null, solved: false, steps, error: 'No more guesses to backtrack' };

      recordStep({ type: 'backtrack', description: `Backtracking: cell (${lastGuess.cell.row + 1}, ${lastGuess.cell.col + 1}) must be BLANK`, cells: [{ row: lastGuess.cell.row, col: lastGuess.cell.col, value: BLANK }], gridSnapshot: copyGrid(lastGuess.grid) });

      grid = copyGrid(lastGuess.grid);
      grid[lastGuess.cell.row][lastGuess.cell.col] = BLANK;
      const retryResult = propagate(grid, rowClues, colClues, recordStep);
      grid = retryResult.grid;

      if (hasContradiction(grid, rowClues, colClues)) {
        while (backtrackStack.length > 0) {
          backtrackCount++;
          const previous = backtrackStack.pop()!;
          recordStep({ type: 'backtrack', description: `Backtracking further`, cells: [{ row: previous.cell.row, col: previous.cell.col, value: BLANK }], gridSnapshot: copyGrid(previous.grid) });
          grid = copyGrid(previous.grid);
          grid[previous.cell.row][previous.cell.col] = BLANK;
          const retryAgain = propagate(grid, rowClues, colClues, recordStep);
          grid = retryAgain.grid;
          if (!hasContradiction(grid, rowClues, colClues)) break;
        }
      }
    } else {
      grid = result.grid;
    }
  }

  if (backtrackCount >= maxBacktracks) return { solution: grid, solved: false, steps, error: `Maximum backtracks (${maxBacktracks}) exceeded` };
  if (!isGridSolved(grid)) return { solution: grid, solved: false, steps, error: 'Could not find complete solution' };

  return { solution: grid, solved: true, steps };
}

export function validateSolution(grid: Grid, rowClues: Clues, colClues: Clues): boolean {
  const rows = grid.length;
  const cols = grid[0].length;
  for (let r = 0; r < rows; r++) {
    const computedClues = computeLineClues(grid[r]);
    if (!cluesMatch(computedClues, rowClues[r])) return false;
  }
  for (let c = 0; c < cols; c++) {
    const colLine = grid.map(row => row[c]);
    const computedClues = computeLineClues(colLine);
    if (!cluesMatch(computedClues, colClues[c])) return false;
  }
  return true;
}

export function computeLineClues(line: CellState[]): number[] {
  const clues: number[] = [];
  let currentRun = 0;
  for (const cell of line) {
    if (cell === FILLED) { currentRun++; }
    else if (currentRun > 0) { clues.push(currentRun); currentRun = 0; }
  }
  if (currentRun > 0) clues.push(currentRun);
  return clues.length === 0 ? [0] : clues;
}

function cluesMatch(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, idx) => val === b[idx]);
}
