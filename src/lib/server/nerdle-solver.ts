import { loadStaticText } from '$lib/server/static-assets';

export type Feedback = 0 | 1 | 2;
export type GameMode = 'micro' | 'mini' | 'midi' | 'classic' | 'maxi';

export interface GuessRow {
	equation: string;
	feedback: Feedback[];
}

export interface NerdleSuggestion {
	eq: string;
	entropy: number;
}

const MODE_LENGTHS: Record<GameMode, number> = {
	micro: 5,
	mini: 6,
	midi: 7,
	classic: 8,
	maxi: 10
};

const SMALL_MODE_FILES: Record<Exclude<GameMode, 'maxi'>, string> = {
	micro: '/micro.txt',
	mini: '/mini.txt',
	midi: '/midi.txt',
	classic: '/classic.txt'
};

const smallEquationsCache = new Map<Exclude<GameMode, 'maxi'>, Promise<string[]>>();

async function loadSmallEquations(
	fetchFn: typeof fetch,
	origin: string,
	mode: Exclude<GameMode, 'maxi'>
): Promise<string[]> {
	let cached = smallEquationsCache.get(mode);
	if (!cached) {
		cached = loadStaticText(fetchFn, origin, SMALL_MODE_FILES[mode]).then((text) =>
			text
				.split('\n')
				.map((equation) => equation.trim())
				.filter((equation) => equation.length === MODE_LENGTHS[mode])
		);
		smallEquationsCache.set(mode, cached);
	}

	return cached;
}

function calculateFeedback(guess: string, answer: string): Feedback[] {
	const len = guess.length;
	const feedback: Feedback[] = new Array(len).fill(0);
	const answerChars = answer.split('');
	const guessChars = guess.split('');
	const used = new Array(len).fill(false);

	for (let index = 0; index < len; index += 1) {
		if (guessChars[index] === answerChars[index]) {
			feedback[index] = 2;
			used[index] = true;
		}
	}

	for (let index = 0; index < len; index += 1) {
		if (feedback[index] === 2) continue;
		for (let otherIndex = 0; otherIndex < len; otherIndex += 1) {
			if (!used[otherIndex] && guessChars[index] === answerChars[otherIndex]) {
				feedback[index] = 1;
				used[otherIndex] = true;
				break;
			}
		}
	}

	return feedback;
}

function shuffle<T>(items: T[]): T[] {
	const result = [...items];
	for (let index = result.length - 1; index > 0; index -= 1) {
		const otherIndex = Math.floor(Math.random() * (index + 1));
		[result[index], result[otherIndex]] = [result[otherIndex], result[index]];
	}
	return result;
}

function calculateEntropyFast(
	guess: string,
	possibleAnswers: string[],
	sampleSize = 3000
): number {
	if (possibleAnswers.length <= 1) return 0;

	const answersToCheck =
		possibleAnswers.length <= sampleSize
			? possibleAnswers
			: shuffle(possibleAnswers).slice(0, sampleSize);

	const patternCounts = new Map<string, number>();

	for (const answer of answersToCheck) {
		const pattern = calculateFeedback(guess, answer).join('');
		patternCounts.set(pattern, (patternCounts.get(pattern) ?? 0) + 1);
	}

	let entropy = 0;
	const total = answersToCheck.length;

	for (const count of patternCounts.values()) {
		const probability = count / total;
		if (probability > 0) {
			entropy -= probability * Math.log2(probability);
		}
	}

	return entropy;
}

function filterEquations(equations: string[], guess: string, targetFeedback: Feedback[]): string[] {
	const result: string[] = [];
	const len = guess.length;

	for (const answer of equations) {
		const actualFeedback = calculateFeedback(guess, answer);
		let matches = true;

		for (let index = 0; index < len; index += 1) {
			if (actualFeedback[index] !== targetFeedback[index]) {
				matches = false;
				break;
			}
		}

		if (matches) {
			result.push(answer);
		}
	}

	return result;
}

function getBestGuessesOptimized(
	possibleAnswers: string[],
	count = 10
): NerdleSuggestion[] {
	if (possibleAnswers.length === 0) {
		return [];
	}

	if (possibleAnswers.length <= 50) {
		const scored = possibleAnswers.map((equation) => ({
			eq: equation,
			entropy: calculateEntropyFast(equation, possibleAnswers, possibleAnswers.length)
		}));
		scored.sort((left, right) => right.entropy - left.entropy);
		return scored.slice(0, count);
	}

	if (possibleAnswers.length <= 500) {
		const candidates = shuffle(possibleAnswers).slice(0, Math.min(200, possibleAnswers.length));
		const scored = candidates.map((equation) => ({
			eq: equation,
			entropy: calculateEntropyFast(equation, possibleAnswers, possibleAnswers.length)
		}));
		scored.sort((left, right) => right.entropy - left.entropy);
		return scored.slice(0, count);
	}

	const candidateCount = Math.min(150, Math.floor(possibleAnswers.length / 1000) + 50);
	const entropySampleSize = Math.min(5000, Math.floor(possibleAnswers.length / 10) + 1000);
	const candidates = shuffle(possibleAnswers).slice(0, candidateCount);
	const scored = candidates.map((equation) => ({
		eq: equation,
		entropy: calculateEntropyFast(equation, possibleAnswers, entropySampleSize)
	}));
	scored.sort((left, right) => right.entropy - left.entropy);
	return scored.slice(0, count);
}

function forEachLineOfLength(
	text: string,
	targetLength: number,
	visitor: (line: string) => void
): void {
	let start = 0;

	for (let index = 0; index <= text.length; index += 1) {
		if (index !== text.length && text.charCodeAt(index) !== 10) {
			continue;
		}

		let end = index;
		if (end > start && text.charCodeAt(end - 1) === 13) {
			end -= 1;
		}

		const line = text.slice(start, end).trim();
		if (line.length === targetLength) {
			visitor(line);
		}

		start = index + 1;
	}
}

function sampleMaxiEquations(text: string, sampleSize: number): { total: number; sample: string[] } {
	const sample: string[] = [];
	let total = 0;

	forEachLineOfLength(text, MODE_LENGTHS.maxi, (line) => {
		total += 1;

		if (sample.length < sampleSize) {
			sample.push(line);
			return;
		}

		const randomIndex = Math.floor(Math.random() * total);
		if (randomIndex < sampleSize) {
			sample[randomIndex] = line;
		}
	});

	return { total, sample };
}

function filterMaxiEquations(text: string, guesses: GuessRow[]): { total: number; filtered: string[] } {
	const filtered: string[] = [];
	let total = 0;

	forEachLineOfLength(text, MODE_LENGTHS.maxi, (line) => {
		total += 1;
		let matches = true;

		for (const guess of guesses) {
			const actualFeedback = calculateFeedback(guess.equation, line);
			for (let index = 0; index < MODE_LENGTHS.maxi; index += 1) {
				if (actualFeedback[index] !== guess.feedback[index]) {
					matches = false;
					break;
				}
			}
			if (!matches) break;
		}

		if (matches) {
			filtered.push(line);
		}
	});

	return { total, filtered };
}

export async function solveNerdle(
	fetchFn: typeof fetch,
	origin: string,
	mode: GameMode,
	guesses: GuessRow[] = []
): Promise<{
	total: number;
	remaining: number;
	suggestions: NerdleSuggestion[];
}> {
	if (mode !== 'maxi') {
		const allEquations = await loadSmallEquations(fetchFn, origin, mode);
		let filtered = allEquations;

		for (const guess of guesses) {
			filtered = filterEquations(filtered, guess.equation, guess.feedback);
		}

		return {
			total: allEquations.length,
			remaining: filtered.length,
			suggestions: getBestGuessesOptimized(filtered, 10)
		};
	}

	const maxiText = await loadStaticText(fetchFn, origin, '/maxi.txt', { cache: false });

	if (guesses.length === 0) {
		const { total, sample } = sampleMaxiEquations(maxiText, 5000);
		return {
			total,
			remaining: total,
			suggestions: getBestGuessesOptimized(sample, 10)
		};
	}

	const { total, filtered } = filterMaxiEquations(maxiText, guesses);
	return {
		total,
		remaining: filtered.length,
		suggestions: getBestGuessesOptimized(filtered, 10)
	};
}
