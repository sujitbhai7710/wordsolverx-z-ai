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
