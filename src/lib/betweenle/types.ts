export interface BetweenleDailyAnswer {
  date: string;
  word: string;
  puzzleNumber: number;
}

export interface BetweenleSolverResult {
  boundTopIdx: number;
  boundBottomIdx: number;
  effectiveTopWord: string;
  effectiveBottomWord: string;
  remaining: number;
  suggestionIdx: number;
  suggestionWord: string;
  isSolved: boolean;
  useDistance: boolean;
  closerTo: 'top' | 'bottom' | '';
  topDist: number;
  bottomDist: number;
}

export type BetweenleGameMode = 'daily' | 'unlimited' | 'custom';

export type BetweenleGuessDirection = 'after' | 'before' | 'match';

export interface BetweenleGuess {
  word: string;
  position: number;
  direction: BetweenleGuessDirection;
  closerTo: 'top' | 'bottom';
}

export interface BetweenleGameSetup {
  mode: BetweenleGameMode;
  word: string;
  secretPosition: number;
  puzzleNumber: number | null;
  date: string | null;
}
