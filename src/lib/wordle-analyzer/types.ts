export type AnalyzerColor = 'a' | 'p' | 'c';

export interface WordleAnalyzerWordData {
	common: string[];
	other: string[];
}

export interface RemainingAnswers {
	common: string[];
	other: string[];
}

export interface ClueRequirements {
	positionalMatches: string[];
	positionalNotMatches: string[];
	additionalRequiredLetters: string[];
	remainingMustNotContain: string[];
}

export interface AverageRemaining {
	common: number;
	all: number;
}

export interface RankedAverageEntry {
	word: string;
	value: number;
}

export interface RemainingAverageRankings {
	common: RankedAverageEntry[];
	all: RankedAverageEntry[];
}

export interface RemainingCounts {
	common: number;
	other: number;
	total: number;
}

export interface RemainingPreview {
	common: string[];
	other: string[];
	type: 'all' | 'common-only';
}

export interface LuckEstimate {
	good: boolean;
	chance: number;
	label: string;
}

export interface AnalyzedPlay {
	guess: string;
	colors: AnalyzerColor[];
	clue: ClueRequirements;
	averageRemaining?: AverageRemaining;
	guessQuality?: number;
	remainingAfter: RemainingCounts;
	remainingPreview: RemainingPreview | null;
	commonWord: boolean;
	possibleAnswer: boolean;
	hardModeValid: boolean;
	unusedClues: string[];
	hardModeViolations: string[];
	luck?: LuckEstimate;
}

export interface AnalyzerGuessTurn {
	turn: number;
	beforeRemainingCounts: RemainingCounts;
	user: AnalyzedPlay;
	ai: AnalyzedPlay;
	bestPlay: 'user' | 'ai' | 'same' | 'unknown';
	strategyCode: number;
	strategyLabel: string;
}

export interface AnalyzerAiTurn {
	turn: number;
	beforeRemainingCounts: RemainingCounts;
	play: AnalyzedPlay;
	strategyCode: number;
	strategyLabel: string;
}

export interface WordleAnalyzerResult {
	answer: string;
	guesses: string[];
	hardMode: boolean;
	guessColors: AnalyzerColor[][];
	guessTurns: AnalyzerGuessTurn[];
	aiTurns: AnalyzerAiTurn[];
}

export interface AnalyzerProgressMessage {
	message: string;
	done: number;
	total: number;
}

export interface WordleAnalyzerWorkerInitRequest {
	type: 'init';
}

export interface WordleAnalyzerWorkerAnalyzeRequest {
	type: 'analyze';
	requestId: number;
	guesses: string[];
	answer: string;
	hardMode: boolean;
}

export type WordleAnalyzerWorkerRequest =
	| WordleAnalyzerWorkerInitRequest
	| WordleAnalyzerWorkerAnalyzeRequest;

export interface WordleAnalyzerWorkerReadyMessage {
	type: 'ready';
}

export interface WordleAnalyzerWorkerProgressMessage {
	type: 'progress';
	requestId: number;
	progress: AnalyzerProgressMessage;
}

export interface WordleAnalyzerWorkerResultMessage {
	type: 'result';
	requestId: number;
	result: WordleAnalyzerResult;
}

export interface WordleAnalyzerWorkerErrorMessage {
	type: 'error';
	requestId?: number;
	error: string;
}

export type WordleAnalyzerWorkerResponse =
	| WordleAnalyzerWorkerReadyMessage
	| WordleAnalyzerWorkerProgressMessage
	| WordleAnalyzerWorkerResultMessage
	| WordleAnalyzerWorkerErrorMessage;

export interface ParsedAnalyzerShareState {
	enteredWords: string[];
	guesses: string[];
	answer: string;
	hardMode: boolean;
}
