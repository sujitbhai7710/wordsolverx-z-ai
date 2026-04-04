import { WORDLEBOT_WORDLE_SOLVER_LENGTHS } from '$lib/wordlebot-wasm/routes';

const LENGTHS = new Set<string>(WORDLEBOT_WORDLE_SOLVER_LENGTHS.map(String));

export function match(param: string) {
	return LENGTHS.has(param);
}
