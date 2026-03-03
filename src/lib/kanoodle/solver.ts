// Kanoodle Solver - Fixed implementation based on original algorithm
// The board is indexed as (col << 3) + row where col is 0-10 and row is 0-4

// Piece ID mappings - our IDs to solver indices (0-11)
const PIECE_ID_TO_INDEX: Record<string, number> = {
  'l': 0, 'P': 1, 'L': 2, 'Y': 3, 'N': 4, 'i': 5, 'V': 6, 'W': 7, 'U': 8, 'I': 9, 'S': 10, 'X': 11
};

const INDEX_TO_PIECE_ID: Record<number, string> = {
  0: 'l', 1: 'P', 2: 'L', 3: 'Y', 4: 'N', 5: 'i', 6: 'V', 7: 'W', 8: 'U', 9: 'I', 10: 'S', 11: 'X'
};

// Piece class - represents a single noodle/puzzle piece
class Ie {
  x3y: Int8Array;
  o: number; // number of orientations
  l: number; // number of cells

  constructor(o: number, coords: number[]) {
    this.x3y = new Int8Array(64);
    this.o = o;
    this.l = coords.length >> 1;

    const r: Int8Array[] = [];
    const i: Int8Array[] = [];
    const c = [[1, 0], [0, 1], [-1, 0], [0, -1]];

    for (let j = 0; j < this.o; j++) {
      r[j] = new Int8Array(16);
      i[j] = new Int8Array(16);
    }

    for (let j = 0; j < this.o; j++) {
      if (j < 4) {
        for (let n = 0; n < this.l; n++) {
          r[j][n] = c[(j + 0) % 4][0] * coords[2 * n] + c[(j + 0) % 4][1] * coords[2 * n + 1];
          i[j][n] = c[(j + 1) % 4][0] * coords[2 * n] + c[(j + 1) % 4][1] * coords[2 * n + 1];
        }
      } else {
        for (let n = 0; n < this.l; n++) {
          r[j][n] = c[(j + 1) % 4][0] * coords[2 * n] + c[(j + 1) % 4][1] * coords[2 * n + 1];
          i[j][n] = c[(j + 0) % 4][0] * coords[2 * n] + c[(j + 0) % 4][1] * coords[2 * n + 1];
        }
      }
    }

    for (let j = 0; j < this.o; j++) {
      let s = 9999;
      for (let n = 0; n < this.l; n++) {
        if (s > r[j][n]) s = r[j][n];
      }
      for (let n = 0; n < this.l; n++) {
        r[j][n] -= s;
      }

      s = 9999;
      for (let n = 0; n < this.l; n++) {
        if (r[j][n] === 0 && s > i[j][n]) s = i[j][n];
      }
      for (let n = 0; n < this.l; n++) {
        i[j][n] -= s;
      }

      // Find first cell at origin and swap if needed
      s = 0;
      for (let n = 1; n < this.l; n++) {
        if (r[j][n] === 0 && i[j][n] === 0) s = n;
      }
      if (s > 0) {
        let d = r[j][0];
        r[j][0] = r[j][s];
        r[j][s] = d;
        d = i[j][0];
        i[j][0] = i[j][s];
        i[j][s] = d;
      }

      for (let n = 0; n < this.l; n++) {
        this.x3y[(j << 3) + n] = (r[j][n] << 3) + i[j][n];
      }
    }
  }
}

// Main solver class
class Yt {
  Next: Int8Array;
  Prev: Int8Array;
  IGrid: Int8Array;
  Noodles: Ie[];
  SolutionCounter: number;
  NoodleRank: Int8Array;
  NoodleOrder: Int8Array;

  constructor() {
    this.Next = new Int8Array(16);
    this.Prev = new Int8Array(16);
    this.IGrid = new Int8Array(128);
    this.Noodles = [];
    this.SolutionCounter = 0;
    this.NoodleRank = new Int8Array(16);
    this.NoodleOrder = new Int8Array(16);
  }

  Solve(col: number, row: number, maxSolutions: number): number {
    const IGrid = this.IGrid;
    let c = col, r = row;

    // Find first empty cell
    while (IGrid[(c << 3) + r] > 0) {
      r++;
      if (r === 5) {
        c++;
        r = 0;
      }
      if (c === 11) {
        this.SolutionCounter++;
        return this.SolutionCounter > maxSolutions ? 1 : 0;
      }
    }

    const offset = (c << 3) + r;
    const Next = this.Next;
    const Prev = this.Prev;
    let p = Next[0];

    while (p < 13) {
      // Get the noodle for piece with rank p-1
      const noodleIndex = this.NoodleOrder[p - 1];
      const noodle = this.Noodles[noodleIndex];
      const numOrientations = noodle.o;
      const numCells = noodle.l;
      const nextP = Next[p];
      const prevP = Prev[p];

      // Remove p from linked list
      Prev[nextP] = prevP;
      Next[prevP] = nextP;

      // Try each orientation
      outer: for (let t = 0; t < numOrientations; t++) {
        const orientationOffset = t << 3;
        const coords = noodle.x3y;

        // Check if piece fits
        for (let d = 1; d < numCells; d++) {
          if (IGrid[coords[orientationOffset + d] + offset] > 0) {
            continue outer;
          }
        }

        // Place piece
        for (let d = 0; d < numCells; d++) {
          IGrid[coords[orientationOffset + d] + offset] = p;
        }

        if (this.Solve(c, r, maxSolutions)) return 1;

        // Remove piece
        for (let d = 0; d < numCells; d++) {
          IGrid[coords[orientationOffset + d] + offset] = 0;
        }
      }

      // Restore p to linked list (insert p back between prevP and nextP)
      Next[prevP] = p;
      Prev[p] = prevP;
      Next[p] = nextP;
      Prev[nextP] = p;
      p = nextP;
    }

    return 0;
  }

  Init(boardStr: string, seed: number): number {
    const parts = boardStr.split(",");
    const order = this.NoodleOrder;

    this.SolutionCounter = 0;
    this.InitArray(order, 0, 12, seed);

    for (let i = 0; i < 12; i++) {
      this.NoodleRank[order[i]] = i;
    }

    // Initialize Noodles array with 12 slots
    this.Noodles = new Array(12);

    // Define all 12 pieces - stored directly at their index
    // Piece 0: 'l' - L-tromino (4 cells) - 8 orientations
    this.Noodles[0] = new Ie(8, [0, 0, 1, 0, 2, 0, 0, 1]);
    // Piece 1: 'P' - 5 cells - 8 orientations
    this.Noodles[1] = new Ie(8, [0, 0, 1, 0, 2, 0, 0, 1, 1, 1]);
    // Piece 2: 'L' - Big L (5 cells) - 8 orientations
    this.Noodles[2] = new Ie(8, [0, 0, 1, 0, 2, 0, 3, 0, 0, 1]);
    // Piece 3: 'Y' - 5 cells - 8 orientations
    this.Noodles[3] = new Ie(8, [0, 0, 1, 0, 2, 0, 3, 0, 1, 1]);
    // Piece 4: 'N' - 5 cells - 8 orientations
    this.Noodles[4] = new Ie(8, [0, 0, 1, 0, 2, 0, 2, 1, 3, 1]);
    // Piece 5: 'i' - small i (3 cells) - 4 orientations
    this.Noodles[5] = new Ie(4, [0, 0, 1, 0, 0, 1]);
    // Piece 6: 'V' - 5 cells - 4 orientations
    this.Noodles[6] = new Ie(4, [0, 0, 1, 0, 2, 0, 0, 1, 0, 2]);
    // Piece 7: 'W' - 5 cells - 4 orientations
    this.Noodles[7] = new Ie(4, [0, 0, 1, 0, 1, 1, 2, 1, 2, 2]);
    // Piece 8: 'U' - 5 cells - 4 orientations
    this.Noodles[8] = new Ie(4, [0, 0, 1, 0, 2, 0, 0, 1, 2, 1]);
    // Piece 9: 'I' - long I (4 cells) - 2 orientations
    this.Noodles[9] = new Ie(2, [0, 0, 1, 0, 2, 0, 3, 0]);
    // Piece 10: 'S' - Square (4 cells) - 1 orientation
    this.Noodles[10] = new Ie(1, [0, 0, 1, 0, 0, 1, 1, 1]);
    // Piece 11: 'X' - 5 cells - 1 orientation
    this.Noodles[11] = new Ie(1, [1, 0, 0, 1, 1, 1, 2, 1, 1, 2]);

    // Initialize linked list - 0 is head, 1-12 are pieces, 13+ is tail
    for (let i = 0; i < 16; i++) {
      this.Next[i] = i + 1;
      this.Prev[i] = i - 1;
    }

    // Initialize grid - all cells start as blocked (1)
    for (let i = 0; i < 128; i++) {
      this.IGrid[i] = 1;
    }

    if (parts.length !== 5) return 0;
    for (let i = 0; i < 5; i++) {
      if (parts[i].length !== 11) return 0;
    }

    // Parse board - using our piece IDs mapped to solver indices
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 11; col++) {
        const char = parts[row].charAt(col);
        if (char === '-') {
          // Empty cell
          this.IGrid[(col << 3) + row] = 0;
        } else {
          // Piece - convert our ID to index
          const pieceIndex = PIECE_ID_TO_INDEX[char];
          if (pieceIndex !== undefined) {
            // Map piece index through order for linked list value
            const linkedListValue = this.NoodleRank[pieceIndex] + 1;
            this.IGrid[(col << 3) + row] = linkedListValue;
            
            // Remove from linked list
            const idx = linkedListValue;
            if (this.Prev[this.Next[idx]] === idx) {
              this.Prev[this.Next[idx]] = this.Prev[idx];
            }
            if (this.Next[this.Prev[idx]] === idx) {
              this.Next[this.Prev[idx]] = this.Next[idx];
            }
          } else {
            // Unknown piece, treat as empty
            this.IGrid[(col << 3) + row] = 0;
          }
        }
      }
    }

    return 1;
  }

  InitArray(arr: Int8Array, start: number, count: number, seed: number) {
    for (let i = start; i < start + count; i++) {
      arr[i] = i;
    }
    if (seed < 0) {
      // Randomize
      for (let i = 0; i < 2 * count; i++) {
        const n = Math.floor(Math.random() * count);
        const o = arr[start + (i % count)];
        arr[start + (i % count)] = arr[start + n];
        arr[start + n] = o;
      }
    }
  }

  // Convert internal grid value back to piece ID
  getPieceIdFromGridValue(value: number): string | null {
    if (value <= 0) return null;
    // value is linked list index (1-12)
    // Need to convert to original piece index
    const pieceIndex = this.NoodleOrder[value - 1];
    return INDEX_TO_PIECE_ID[pieceIndex];
  }
}

// Check for isolated empty cells that can't be filled
function hasIsolatedCells(board: (string | null)[][]): boolean {
  const rows = board.length;
  const cols = board[0].length;
  
  // For empty board, there are no isolated cells
  const hasAnyPiece = board.some(row => row.some(cell => cell !== null));
  if (!hasAnyPiece) return false;
  
  const visited = board.map(row => row.map(cell => cell !== null));

  function floodFill(r: number, c: number): number {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return 0;
    if (visited[r][c]) return 0;
    visited[r][c] = true;
    return 1 + floodFill(r - 1, c) + floodFill(r, c + 1) + floodFill(r + 1, c) + floodFill(r, c - 1);
  }

  const regions: number[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!visited[r][c]) {
        regions.push(floodFill(r, c));
      }
    }
  }

  return regions.length > 0 && Math.min(...regions) <= 2;
}

// Main solve function
export function kanoodleSolve(
  board: (string | null)[][],
  options: { findAll?: boolean; maxSolutions?: number } = {}
): { solved: boolean; grid: (string | null)[][] | null; solutions: (string | null)[][][]; totalCount: number; limitReached?: boolean; message?: string } {
  const { findAll = false, maxSolutions = 1000 } = options;

  // Convert board to string format using our piece IDs
  let boardStr = "";
  for (let row = 0; row < 5; row++) {
    if (row > 0) boardStr += ",";
    for (let col = 0; col < 11; col++) {
      const cell = board[row]?.[col];
      if (cell === null || cell === undefined) {
        boardStr += "-";
      } else {
        boardStr += cell;
      }
    }
  }

  const solver = new Yt();
  const seed = findAll ? 0 : -1;

  // Check for isolated cells
  if (!hasIsolatedCells(board) && solver.Init(boardStr, seed)) {
    if (findAll) {
      // Find all solutions
      const solutions: (string | null)[][][] = [];
      
      function collectSolutions(col: number, row: number): boolean {
        const IGrid = solver.IGrid;
        let c = col, r = row;

        while (IGrid[(c << 3) + r] > 0) {
          r++;
          if (r === 5) {
            c++;
            r = 0;
          }
          if (c === 11) {
            // Found a solution - collect it
            const solution: (string | null)[][] = [];
            for (let gr = 0; gr < 5; gr++) {
              solution[gr] = [];
              for (let gc = 0; gc < 11; gc++) {
                solution[gr][gc] = solver.getPieceIdFromGridValue(IGrid[(gc << 3) + gr]);
              }
            }
            solutions.push(solution);
            return solutions.length >= maxSolutions;
          }
        }

        const offset = (c << 3) + r;
        const Next = solver.Next;
        const Prev = solver.Prev;
        let p = Next[0];

        while (p < 13) {
          const noodleIndex = solver.NoodleOrder[p - 1];
          const noodle = solver.Noodles[noodleIndex];
          const numOrientations = noodle.o;
          const numCells = noodle.l;
          const nextP = Next[p];
          const prevP = Prev[p];

          Prev[nextP] = prevP;
          Next[prevP] = nextP;

          outer: for (let t = 0; t < numOrientations; t++) {
            const orientationOffset = t << 3;
            const coords = noodle.x3y;

            for (let d = 1; d < numCells; d++) {
              if (IGrid[coords[orientationOffset + d] + offset] > 0) continue outer;
            }

            for (let d = 0; d < numCells; d++) {
              IGrid[coords[orientationOffset + d] + offset] = p;
            }

            if (collectSolutions(c, r)) return true;

            for (let d = 0; d < numCells; d++) {
              IGrid[coords[orientationOffset + d] + offset] = 0;
            }
          }

          // Restore p to linked list (insert p back between prevP and nextP)
          Next[prevP] = p;
          Prev[p] = prevP;
          Next[p] = nextP;
          Prev[nextP] = p;
          p = nextP;
        }

        return false;
      }

      collectSolutions(0, 0);

      return {
        solved: solutions.length > 0,
        grid: solutions[0] || null,
        solutions,
        totalCount: solutions.length,
        limitReached: solutions.length >= maxSolutions
      };
    } else {
      // Find one solution
      if (solver.Solve(0, 0, 0)) {
        const solution: (string | null)[][] = [];
        for (let row = 0; row < 5; row++) {
          solution[row] = [];
          for (let col = 0; col < 11; col++) {
            solution[row][col] = solver.getPieceIdFromGridValue(solver.IGrid[(col << 3) + row]);
          }
        }
        return { solved: true, grid: solution, solutions: [solution], totalCount: 1 };
      }
      return { solved: false, grid: null, solutions: [], totalCount: 0 };
    }
  }

  return { solved: false, grid: null, solutions: [], totalCount: 0, message: "invalid input data :-(" };
}

// Generate a random puzzle by solving an empty board
export function generateRandomPuzzle(): (string | null)[][] {
  // Create empty board
  const board: (string | null)[][] = Array.from({ length: 5 }, () => Array.from({ length: 11 }, () => null));
  
  // Solve it to get a solution
  const result = kanoodleSolve(board, { findAll: false, maxSolutions: 1 });
  
  return result.grid || board;
}

// Generate a puzzle with some pieces pre-placed
export function generatePuzzleWithPieces(pieceCount: number): { board: (string | null)[][]; solution: (string | null)[][]; placedPieces: string[]; remainingPieces: string[] } {
  // First get a full solution
  const solution = generateRandomPuzzle();
  
  // Get all unique piece IDs from solution
  const allPieces = ['l', 'P', 'L', 'Y', 'N', 'i', 'V', 'W', 'U', 'I', 'S', 'X'];
  
  // Shuffle piece IDs
  const shuffledPieces = [...allPieces].sort(() => Math.random() - 0.5);
  
  // Select pieces to keep on board
  const piecesToKeep = new Set(shuffledPieces.slice(0, pieceCount));
  const remainingPieces = shuffledPieces.slice(pieceCount);
  
  // Create board by keeping only selected pieces
  const board: (string | null)[][] = solution.map(row => 
    row.map(cell => {
      if (cell && piecesToKeep.has(cell)) {
        return cell;
      }
      return null;
    })
  );
  
  return { board, solution, placedPieces: Array.from(piecesToKeep), remainingPieces };
}

// Export board creation function
export function createEmptyBoard(): (string | null)[][] {
  return Array.from({ length: 5 }, () => Array.from({ length: 11 }, () => null));
}
