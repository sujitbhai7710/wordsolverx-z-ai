export type CellState = 'hidden' | 'revealed' | 'flagged' | 'question' | 'greenFlag' | 'safe';

export interface Cell {
  value: number;
  state: CellState;
  probability?: number;
}

export type SelectedTool =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | 'flag'
  | 'greenFlag'
  | 'clear';

export interface SolverResult {
  safeCells: Array<[number, number]>;
  mineCells: Array<[number, number]>;
  probabilityCells: Array<[number, number, number]>;
}

export const NUMBER_COLORS: Record<number, string> = {
  1: '#3B82F6',
  2: '#22C55E',
  3: '#EF4444',
  4: '#8B5CF6',
  5: '#F97316',
  6: '#06B6D4',
  7: '#EC4899',
  8: '#6366F1',
};
