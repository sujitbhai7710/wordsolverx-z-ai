export const REVEAL_DELAYS = [0.7, 1.1, 1.5, 1.9, 2.3, 2.7];

export function toggleCellBitboard(
  bitboard: number,
  size: number,
  row: number,
  col: number
): number {
  let result = bitboard;
  result ^= 1 << (row * size + col);
  if (row > 0) result ^= 1 << ((row - 1) * size + col);
  if (row < size - 1) result ^= 1 << ((row + 1) * size + col);
  if (col > 0) result ^= 1 << (row * size + (col - 1));
  if (col < size - 1) result ^= 1 << (row * size + (col + 1));
  return result;
}

export function generateRandomPuzzle(size: number): number {
  let bitboard = 0;
  const numMoves = Math.floor(Math.random() * (size * size)) + Math.floor((size * size) / 2);
  for (let index = 0; index < numMoves; index += 1) {
    const cell = Math.floor(Math.random() * size * size);
    bitboard = toggleCellBitboard(bitboard, size, Math.floor(cell / size), cell % size);
  }
  return bitboard;
}

function findFreeColumns(matrix: number[][]): number[] {
  const freeCols = new Set<number>();
  const width = matrix[0].length - 1;
  for (let col = 0; col < width; col += 1) {
    freeCols.add(col);
  }

  for (let row = 0; row < matrix.length; row += 1) {
    for (let col = 0; col < width; col += 1) {
      if (matrix[row][col] !== 0) {
        freeCols.delete(col);
        break;
      }
    }
  }

  return [...freeCols];
}

function backSubstitute(matrix: number[][], freeVarAssignments: Map<number, number>): number[] {
  const width = matrix[0].length - 1;
  const solution = Array(width).fill(0);
  freeVarAssignments.forEach((value, col) => {
    solution[col] = value;
  });

  for (let row = matrix.length - 1; row >= 0; row -= 1) {
    let pivotCol = -1;
    for (let col = 0; col < width; col += 1) {
      if (matrix[row][col] === 1) {
        pivotCol = col;
        break;
      }
    }

    if (pivotCol === -1) {
      continue;
    }

    let sum = matrix[row][width];
    for (let col = pivotCol + 1; col < width; col += 1) {
      if (matrix[row][col] === 1) {
        sum ^= solution[col];
      }
    }
    solution[pivotCol] = sum;
  }

  return solution;
}

export function solveLightsOutOptimal(bitboard: number, size: number): number[] | null {
  const cellCount = size * size;
  const matrix = Array.from({ length: cellCount }, () => Array(cellCount + 1).fill(0));

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const index = row * size + col;
      matrix[index][index] = 1;
      if (row > 0) matrix[index][(row - 1) * size + col] = 1;
      if (row < size - 1) matrix[index][(row + 1) * size + col] = 1;
      if (col > 0) matrix[index][row * size + (col - 1)] = 1;
      if (col < size - 1) matrix[index][row * size + (col + 1)] = 1;
      if ((bitboard & (1 << index)) !== 0) {
        matrix[index][cellCount] = 1;
      }
    }
  }

  let pivotRow = 0;
  for (let col = 0; col < cellCount && pivotRow < cellCount; col += 1) {
    let found = -1;
    for (let row = pivotRow; row < cellCount; row += 1) {
      if (matrix[row][col] === 1) {
        found = row;
        break;
      }
    }

    if (found === -1) {
      continue;
    }

    [matrix[pivotRow], matrix[found]] = [matrix[found], matrix[pivotRow]];

    for (let row = 0; row < cellCount; row += 1) {
      if (row !== pivotRow && matrix[row][col] === 1) {
        for (let k = 0; k <= cellCount; k += 1) {
          matrix[row][k] ^= matrix[pivotRow][k];
        }
      }
    }
    pivotRow += 1;
  }

  for (let row = pivotRow; row < cellCount; row += 1) {
    if (matrix[row][cellCount] === 1) {
      return null;
    }
  }

  const freeCols = findFreeColumns(matrix);
  if (freeCols.length === 0) {
    const solution = backSubstitute(matrix, new Map());
    return solution.map((value, index) => (value === 1 ? index : -1)).filter((index) => index !== -1);
  }

  let bestSolution: number[] | null = null;
  let bestLength = Infinity;
  const numCombinations = 2 ** freeCols.length;

  for (let combo = 0; combo < numCombinations; combo += 1) {
    const freeVarAssignments = new Map<number, number>();
    for (let index = 0; index < freeCols.length; index += 1) {
      freeVarAssignments.set(freeCols[index], (combo >> index) & 1);
    }

    const solution = backSubstitute(matrix, freeVarAssignments);
    const length = solution.filter((value) => value === 1).length;

    if (length < bestLength) {
      bestLength = length;
      bestSolution = solution;
    }
  }

  if (!bestSolution) {
    return null;
  }

  const moves: number[] = [];
  for (let index = 0; index < cellCount; index += 1) {
    if (bestSolution[index] === 1) {
      moves.push(index);
    }
  }

  return moves;
}

export function buildStepBoards(initialBoard: number, solution: number[] | null, size: number): number[] {
  if (!solution || solution.length === 0) {
    return [];
  }

  const boards: number[] = [];
  let currentBoard = initialBoard;

  for (const cell of solution) {
    boards.push(currentBoard);
    currentBoard = toggleCellBitboard(currentBoard, size, Math.floor(cell / size), cell % size);
  }

  boards.push(currentBoard);
  return boards;
}
