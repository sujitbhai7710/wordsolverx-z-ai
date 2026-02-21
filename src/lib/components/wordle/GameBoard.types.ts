/**
 * GameBoard Component Types
 * Type definitions for the GameBoard component
 */

export interface GameBoardProps {
	wordLength: number;
	maxGuesses: number;
	guesses: string[];
	currentGuess: string;
	evaluations: LetterEvaluation[][];
	isRevealing?: boolean;
	invalidGuess?: boolean;
	gameWon?: boolean;
	gameLost?: boolean;
}

export interface LetterEvaluation {
	letter: string;
	state: 'correct' | 'present' | 'absent';
}
