export type SolverGameKey =
	| 'loldle'
	| 'dotadle'
	| 'pokedle'
	| 'smashdle'
	| 'narutodle'
	| 'onepiecedle';

export type FeedbackState = 'green' | 'yellow_up' | 'yellow_down' | 'red' | null;

export interface CharacterRecord {
	[key: string]: unknown;
}

export interface GuessFeedback {
	character: CharacterRecord;
	feedback: Record<string, FeedbackState>;
	collapsed: boolean;
}

export interface AttributeConfig {
	key: string;
	label: string;
	type: 'array' | 'string' | 'number';
	compareType?: 'exact' | 'contains' | 'numeric';
}

export interface GameSolverConfig {
	key: SolverGameKey;
	name: string;
	icon: string;
	route: string;
	answerRoute: string;
	dataFile: string;
	nameKey: string;
	description: string;
	attributes: AttributeConfig[];
	keywords: string[];
}
