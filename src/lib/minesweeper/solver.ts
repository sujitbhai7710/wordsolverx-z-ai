import type { Cell, SolverResult } from './types';

export function createInitialBoard(width: number, height: number): Cell[][] {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      value: -2,
      state: 'hidden' as const,
    }))
  );
}

export function cloneBoard(board: Cell[][]): Cell[][] {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

export function getNeighbors(x: number, y: number, width: number, height: number): Array<[number, number]> {
  const neighbors: Array<[number, number]> = [];
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        neighbors.push([nx, ny]);
      }
    }
  }
  return neighbors;
}

export function countFlaggedMinesInBoard(board: Cell[][]): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.state === 'flagged') count += 1;
    }
  }
  return count;
}

export function solveMinesweeperJS(board: Cell[][], totalMines: number): SolverResult {
  const width = board[0]?.length ?? 0;
  const height = board.length;
  const result: SolverResult = {
    safeCells: [],
    mineCells: [],
    probabilityCells: [],
  };

  const workBoard = cloneBoard(board);

  const isHidden = (x: number, y: number): boolean => {
    const cell = workBoard[y][x];
    return cell.state === 'hidden' || cell.state === 'question' || cell.state === 'greenFlag' || cell.state === 'safe';
  };

  const isFlagged = (x: number, y: number): boolean => workBoard[y][x].state === 'flagged';
  const isRevealed = (x: number, y: number): boolean => workBoard[y][x].state === 'revealed';

  let changed = true;
  let iterations = 0;

  while (changed && iterations < 100) {
    changed = false;
    iterations += 1;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const cell = workBoard[y][x];
        if (cell.state !== 'revealed') continue;

        const neighbors = getNeighbors(x, y, width, height);
        const hiddenNeighbors: Array<[number, number]> = [];
        const flaggedNeighbors: Array<[number, number]> = [];

        for (const [nx, ny] of neighbors) {
          if (isHidden(nx, ny)) hiddenNeighbors.push([nx, ny]);
          else if (isFlagged(nx, ny)) flaggedNeighbors.push([nx, ny]);
        }

        const minesNeeded = cell.value - flaggedNeighbors.length;

        if (minesNeeded === 0 && hiddenNeighbors.length > 0) {
          for (const [nx, ny] of hiddenNeighbors) {
            if (!result.safeCells.some(([sx, sy]) => sx === nx && sy === ny)) {
              result.safeCells.push([nx, ny]);
              workBoard[ny][nx].state = 'safe';
              changed = true;
            }
          }
        }

        if (minesNeeded > 0 && hiddenNeighbors.length === minesNeeded) {
          for (const [nx, ny] of hiddenNeighbors) {
            if (!result.mineCells.some(([mx, my]) => mx === nx && my === ny)) {
              result.mineCells.push([nx, ny]);
              workBoard[ny][nx].state = 'flagged';
              changed = true;
            }
          }
        }
      }
    }

    if (!changed) {
      const constraints: Array<{ cells: Array<[number, number]>; mineCount: number }> = [];

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const cell = workBoard[y][x];
          if (cell.state !== 'revealed') continue;

          const neighbors = getNeighbors(x, y, width, height);
          const hiddenCells: Array<[number, number]> = [];
          let flaggedCount = 0;

          for (const [nx, ny] of neighbors) {
            if (isHidden(nx, ny)) hiddenCells.push([nx, ny]);
            else if (isFlagged(nx, ny)) flaggedCount += 1;
          }

          const mineCount = cell.value - flaggedCount;
          if (hiddenCells.length > 0 && mineCount >= 0) {
            constraints.push({ cells: hiddenCells, mineCount });
          }
        }
      }

      for (let i = 0; i < constraints.length; i += 1) {
        for (let j = i + 1; j < constraints.length; j += 1) {
          const c1 = constraints[i];
          const c2 = constraints[j];

          const c1Set = new Set(c1.cells.map(([cx, cy]) => `${cx},${cy}`));
          const c2Set = new Set(c2.cells.map(([cx, cy]) => `${cx},${cy}`));

          if (c1.cells.length < c2.cells.length && c1.cells.every(([cx, cy]) => c2Set.has(`${cx},${cy}`))) {
            const diffCells = c2.cells.filter(([cx, cy]) => !c1Set.has(`${cx},${cy}`));
            const diffMines = c2.mineCount - c1.mineCount;
            applyConstraintDelta(diffCells, diffMines);
          }

          if (c2.cells.length < c1.cells.length && c2.cells.every(([cx, cy]) => c1Set.has(`${cx},${cy}`))) {
            const diffCells = c1.cells.filter(([cx, cy]) => !c2Set.has(`${cx},${cy}`));
            const diffMines = c1.mineCount - c2.mineCount;
            applyConstraintDelta(diffCells, diffMines);
          }
        }
      }
    }

    if (!changed) {
      const allHidden: Array<[number, number]> = [];
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          if (isHidden(x, y)) allHidden.push([x, y]);
        }
      }

      const flaggedCount = countFlaggedMinesInBoard(workBoard);
      const remainingMines = totalMines - flaggedCount;

      if (remainingMines === 0 && allHidden.length > 0) {
        for (const [nx, ny] of allHidden) {
          if (!result.safeCells.some(([sx, sy]) => sx === nx && sy === ny)) {
            result.safeCells.push([nx, ny]);
            workBoard[ny][nx].state = 'safe';
            changed = true;
          }
        }
      }

      if (remainingMines === allHidden.length && allHidden.length > 0) {
        for (const [nx, ny] of allHidden) {
          if (!result.mineCells.some(([mx, my]) => mx === nx && my === ny)) {
            result.mineCells.push([nx, ny]);
            workBoard[ny][nx].state = 'flagged';
            changed = true;
          }
        }
      }
    }
  }

  const remainingHidden: Array<[number, number]> = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (isHidden(x, y)) remainingHidden.push([x, y]);
    }
  }

  const flaggedCount = countFlaggedMinesInBoard(workBoard);
  const remainingMines = totalMines - flaggedCount;

  if (
    remainingHidden.length > 0 &&
    remainingMines > 0 &&
    result.safeCells.length === 0 &&
    result.mineCells.length === 0
  ) {
    const probabilities = new Map<string, number>();
    const defaultProbability = remainingMines / remainingHidden.length;

    for (const [x, y] of remainingHidden) {
      probabilities.set(`${x},${y}`, defaultProbability);
    }

    for (const [x, y] of remainingHidden) {
      const neighbors = getNeighbors(x, y, width, height);
      let totalWeight = 0;
      let weightedSum = 0;

      for (const [nx, ny] of neighbors) {
        if (!isRevealed(nx, ny)) continue;

        const neighbor = workBoard[ny][nx];
        const nearby = getNeighbors(nx, ny, width, height);
        let hiddenCount = 0;
        let nearbyFlagged = 0;

        for (const [nnx, nny] of nearby) {
          if (isHidden(nnx, nny)) hiddenCount += 1;
          else if (isFlagged(nnx, nny)) nearbyFlagged += 1;
        }

        if (hiddenCount > 0) {
          const localProbability = (neighbor.value - nearbyFlagged) / hiddenCount;
          weightedSum += localProbability;
          totalWeight += 1;
        }
      }

      if (totalWeight > 0) {
        probabilities.set(`${x},${y}`, weightedSum / totalWeight);
      }
    }

    let maxSafety = 0;
    for (const probability of probabilities.values()) {
      const safety = 1 - probability;
      if (safety > maxSafety) maxSafety = safety;
    }

    const threshold = maxSafety * 0.95;
    for (const [key, probability] of probabilities) {
      const safety = 1 - probability;
      if (safety >= threshold && safety > 0.5) {
        const [x, y] = key.split(',').map(Number);
        result.probabilityCells.push([x, y, safety]);
      }
    }
  }

  return result;

  function applyConstraintDelta(diffCells: Array<[number, number]>, diffMines: number): void {
    if (diffMines === 0 && diffCells.length > 0) {
      for (const [nx, ny] of diffCells) {
        if (isHidden(nx, ny) && !result.safeCells.some(([sx, sy]) => sx === nx && sy === ny)) {
          result.safeCells.push([nx, ny]);
          workBoard[ny][nx].state = 'safe';
          changed = true;
        }
      }
    } else if (diffMines === diffCells.length && diffCells.length > 0) {
      for (const [nx, ny] of diffCells) {
        if (isHidden(nx, ny) && !result.mineCells.some(([mx, my]) => mx === nx && my === ny)) {
          result.mineCells.push([nx, ny]);
          workBoard[ny][nx].state = 'flagged';
          changed = true;
        }
      }
    }
  }
}
