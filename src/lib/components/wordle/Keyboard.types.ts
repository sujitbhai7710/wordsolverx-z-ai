/**
 * Keyboard Component Types
 * Type definitions for the Keyboard component
 */

export interface KeyboardProps {
	onKeyPress: (key: string) => void;
	letterStates: Map<string, 'correct' | 'present' | 'absent' | 'unused'>;
	layout?: 'qwerty' | 'alphabetic';
	disabled?: boolean;
}

export type LetterState = 'correct' | 'present' | 'absent' | 'unused';
export type KeyboardLayout = 'qwerty' | 'alphabetic';

export const QWERTY_LAYOUT = [
	['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
	['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
	['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

export const ALPHABETIC_LAYOUT = [
	['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
	['J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'],
	['ENTER', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'BACKSPACE']
];
