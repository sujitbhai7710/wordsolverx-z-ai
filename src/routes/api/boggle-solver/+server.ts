import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BoggleSolver } from '$lib/server/boggle/solver';
import { loadStaticText } from '$lib/server/static-assets';

let solverPromise: Promise<BoggleSolver> | null = null;

function parseBoard(letters: string, size: number): string[][] {
	const board: string[][] = [];
	const upperLetters = letters.toUpperCase();

	for (let row = 0; row < size; row += 1) {
		const currentRow: string[] = [];
		for (let col = 0; col < size; col += 1) {
			const index = row * size + col;
			currentRow.push(upperLetters[index] || '');
		}
		board.push(currentRow);
	}

	return board;
}

const CLASSIC_DICE = [
	'AACIOT',
	'ABILTY',
	'ABJMOQ',
	'ACDEMP',
	'ACELRS',
	'ADENVZ',
	'AHMORS',
	'BIFORX',
	'DENOSW',
	'DKNOTU',
	'EEFHIY',
	'EGKLUY',
	'EGINTV',
	'EHINPS',
	'ELPSTU',
	'HILRUX'
];

const REVISED_DICE = [
	'AAEEGN',
	'ABBJOO',
	'ACHOPS',
	'AFFKPS',
	'AOOTTW',
	'CIMOTU',
	'DEILRX',
	'DELRVY',
	'DISTTY',
	'EEGHNW',
	'EEINSU',
	'EHRTVW',
	'EIOSST',
	'ELRTTY',
	'HIMNUQ',
	'HLNNRZ'
];

const BOGGLE_WEIGHTED_LETTERS: Array<{ letter: string; weight: number }> = [
	{ letter: 'E', weight: 16 },
	{ letter: 'A', weight: 14 },
	{ letter: 'I', weight: 12 },
	{ letter: 'T', weight: 11 },
	{ letter: 'O', weight: 10 },
	{ letter: 'N', weight: 10 },
	{ letter: 'S', weight: 10 },
	{ letter: 'R', weight: 9 },
	{ letter: 'L', weight: 7 },
	{ letter: 'U', weight: 6 },
	{ letter: 'D', weight: 5 },
	{ letter: 'H', weight: 5 },
	{ letter: 'G', weight: 4 },
	{ letter: 'P', weight: 4 },
	{ letter: 'M', weight: 4 },
	{ letter: 'C', weight: 4 },
	{ letter: 'Y', weight: 4 },
	{ letter: 'B', weight: 3 },
	{ letter: 'F', weight: 3 },
	{ letter: 'K', weight: 3 },
	{ letter: 'W', weight: 3 },
	{ letter: 'V', weight: 3 },
	{ letter: 'X', weight: 2 },
	{ letter: 'J', weight: 2 },
	{ letter: 'Z', weight: 2 },
	{ letter: 'Q', weight: 2 }
];

let weightedLetterPool = '';

function initializeWeightedPool(): string {
	if (weightedLetterPool) return weightedLetterPool;
	let pool = '';
	for (const { letter, weight } of BOGGLE_WEIGHTED_LETTERS) {
		pool += letter.repeat(weight);
	}
	weightedLetterPool = pool;
	return pool;
}

function getWeightedRandomLetter(): string {
	const pool = initializeWeightedPool();
	return pool[Math.floor(Math.random() * pool.length)];
}

function generateRandomBoard(size: number, diceType: 'classic' | 'revised' | 'none'): string {
	if (size === 4 && diceType !== 'none') {
		const dice = diceType === 'classic' ? CLASSIC_DICE : REVISED_DICE;
		const shuffled = [...dice].sort(() => Math.random() - 0.5);
		return shuffled.map((die) => die[Math.floor(Math.random() * 6)]).join('');
	}

	const totalCells = size * size;
	const vowels = 'AEIOU';
	const minVowels = Math.floor(totalCells * 0.35);
	let result = '';
	let vowelCount = 0;

	for (let index = 0; index < totalCells; index += 1) {
		const letter = getWeightedRandomLetter();
		if (vowels.includes(letter)) vowelCount += 1;
		result += letter;
	}

	if (vowelCount < minVowels) {
		const consonantIndices: number[] = [];
		for (let index = 0; index < result.length; index += 1) {
			if (!vowels.includes(result[index])) {
				consonantIndices.push(index);
			}
		}

		consonantIndices.sort(() => Math.random() - 0.5);
		const weightedVowels = 'EEEEEAAAAIIIIOOUU';
		const vowelsNeeded = minVowels - vowelCount;

		for (let index = 0; index < Math.min(vowelsNeeded, consonantIndices.length); index += 1) {
			const targetIndex = consonantIndices[index];
			const replacement = weightedVowels[Math.floor(Math.random() * weightedVowels.length)];
			result = result.slice(0, targetIndex) + replacement + result.slice(targetIndex + 1);
		}
	}

	return result;
}

async function getSolver(fetchFn: typeof fetch, origin: string): Promise<BoggleSolver> {
	if (!solverPromise) {
		solverPromise = loadStaticText(fetchFn, origin, '/dictionary.txt').then((content) => {
			const words = content
				.split('\n')
				.map((word) => word.trim().toUpperCase())
				.filter((word) => word.length >= 3 && word.length <= 15 && /^[A-Z]+$/.test(word));
			return new BoggleSolver(words, 3);
		});
	}

	return solverPromise;
}

export const POST: RequestHandler = async ({ request, fetch, url }) => {
	try {
		const body = (await request.json()) as { letters?: string; size?: number };
		const boardSize = Math.max(3, Math.min(10, Number.parseInt(String(body.size ?? 4), 10) || 4));
		const sanitizedLetters = (body.letters ?? '').toUpperCase().replace(/[^A-Z]/g, '');

		if (sanitizedLetters.length !== boardSize * boardSize) {
			return json(
				{
					error: `Expected ${boardSize * boardSize} letters for a ${boardSize}x${boardSize} board, got ${sanitizedLetters.length}`
				},
				{ status: 400 }
			);
		}

		const solver = await getSolver(fetch, url.origin);
		const board = parseBoard(sanitizedLetters, boardSize);
		const words = solver.solve(board);
		const stats = {
			totalWords: words.length,
			totalScore: words.reduce((sum, word) => sum + word.score, 0),
			wordLengths: words.reduce(
				(accumulator, word) => {
					accumulator[word.word.length] = (accumulator[word.word.length] || 0) + 1;
					return accumulator;
				},
				{} as Record<number, number>
			)
		};

		return json({
			success: true,
			board,
			letters: sanitizedLetters,
			size: boardSize,
			words,
			stats,
			dictionarySize: solver.getDictionarySize()
		});
	} catch (error) {
		console.error('Boggle solver API error:', error);
		return json({ error: 'Failed to solve board' }, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ url }) => {
	try {
		const size = Number.parseInt(url.searchParams.get('size') ?? '4', 10);
		const diceType = (url.searchParams.get('diceType') ?? 'revised') as 'classic' | 'revised' | 'none';
		const boardSize = Math.max(3, Math.min(10, size));

		return json({
			success: true,
			letters: generateRandomBoard(boardSize, diceType),
			size: boardSize
		});
	} catch (error) {
		console.error('Random Boggle board generation error:', error);
		return json({ error: 'Failed to generate random board' }, { status: 500 });
	}
};
