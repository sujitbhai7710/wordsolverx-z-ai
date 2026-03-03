// Kanoodle Game Types

export type CellValue = string | null; // Piece ID like 'l', 'P', 'L', etc. or null for empty

export type Board = CellValue[][];

export interface PieceInfo {
  id: string;
  name: string;
  color: string;
  size: number; // number of cells
  shape: number[][]; // Base shape as 2D array
}

export interface PlacedPiece {
  id: string;
  cells: { row: number; col: number }[];
}

export interface GameState {
  board: Board;
  placedPieces: Set<string>;
  message: string;
  isSolving: boolean;
  challengeMode: boolean;
  timeRemaining: number;
  gameStarted: boolean;
  gameWon: boolean;
  sidebarOpen: boolean;
  darkMode: boolean;
  selectedTimeOption: number;
  solutions: Board[];
  currentSolutionIndex: number;
  selectedPiece: string | null;
  pieces: PieceInfo[];
}

// Board dimensions - 5 rows × 11 columns
export const BOARD_ROWS = 5;
export const BOARD_COLS = 11;

// Time options for challenge mode (in seconds)
export const TIME_OPTIONS = [60, 120, 180, 300, 600]; // 1, 2, 3, 5, 10 minutes

// Piece count options for random games
export const PIECE_COUNT_OPTIONS = [1, 2, 3, 4, 5, 6];

// All 12 pieces with their properties and shapes
export const PIECES: PieceInfo[] = [
  { id: 'l', name: 'Small L', color: '#FA430A', size: 4, shape: [[1, 1, 1], [1, 0, 0]] },
  { id: 'P', name: 'P Shape', color: '#033699', size: 5, shape: [[1, 1, 1], [1, 1, 0]] },
  { id: 'L', name: 'Big L', color: '#72E946', size: 5, shape: [[1, 0, 0, 0], [1, 1, 1, 1]] },
  { id: 'Y', name: 'Y Shape', color: '#A3987F', size: 5, shape: [[0, 1], [1, 1], [0, 1], [0, 1]] },
  { id: 'N', name: 'N Shape', color: '#10783A', size: 5, shape: [[1, 1, 0, 0], [0, 1, 1, 1]] },
  { id: 'i', name: 'Small i', color: '#A2DDD7', size: 3, shape: [[1, 1], [1, 0]] },
  { id: 'V', name: 'V Shape', color: '#B90006', size: 5, shape: [[1, 0, 0], [1, 0, 0], [1, 1, 1]] },
  { id: 'W', name: 'W Shape', color: '#FEE01F', size: 5, shape: [[1, 0, 0], [1, 1, 0], [0, 1, 1]] },
  { id: 'U', name: 'U Shape', color: '#F13679', size: 5, shape: [[1, 0, 1], [1, 1, 1]] },
  { id: 'I', name: 'Long I', color: '#7A8184', size: 4, shape: [[1], [1], [1], [1]] },
  { id: 'S', name: 'Square', color: '#FDD7CB', size: 4, shape: [[1, 1], [1, 1]] },
  { id: 'X', name: 'X Shape', color: '#612690', size: 5, shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]] },
];

// Get piece color by ID
export function getPieceColor(pieceId: string): string {
  const piece = PIECES.find(p => p.id === pieceId);
  return piece?.color || '#ccc';
}

// Get piece name by ID
export function getPieceName(pieceId: string): string {
  const piece = PIECES.find(p => p.id === pieceId);
  return piece?.name || 'Unknown';
}

// Get piece info by ID
export function getPieceInfo(pieceId: string): PieceInfo | undefined {
  return PIECES.find(p => p.id === pieceId);
}
