import {
	buildWordLadderIndex,
	getWordLadderNeighbors,
	solveWordLadderWithIndex,
	type SolveWordLadderOptions,
	type SolveWordLadderResult,
	type WordLadderIndex
} from '$lib/word-ladder-logic';
import { loadStaticText } from '$lib/server/static-assets';

export type DictionaryType = 'wordsolverx' | 'twl' | 'sowpods';

interface WordsData {
	words: string[];
}

const WORDSOLVERX_FILES: Record<number, string> = {
	3: '/3letterwords.json',
	4: '/4letterwords.json',
	5: '/words.json',
	6: '/6letterwords.json',
	7: '/7letterwords.json',
	8: '/8letterwords.json',
	9: '/9letterwords.json',
	10: '/10letterwords.json',
	11: '/11letterwords.json',
	12: '/12letterwords.json'
};

const textDictionaryCache = new Map<'twl' | 'sowpods', Promise<Map<number, Set<string>>>>();
const wordSolverXCache = new Map<number, Promise<Set<string>>>();
const indexCache = new Map<string, Promise<WordLadderIndex>>();

function normalizeWords(words: Iterable<string>): Set<string> {
	const normalized = new Set<string>();

	for (const word of words) {
		const cleanWord = word.trim();
		if (!cleanWord) continue;
		normalized.add(cleanWord.toUpperCase());
	}

	return normalized;
}

async function loadTextDictionary(
	fetchFn: typeof fetch,
	origin: string,
	type: 'twl' | 'sowpods'
): Promise<Map<number, Set<string>>> {
	let cached = textDictionaryCache.get(type);
	if (!cached) {
		const filename = type === 'twl' ? '/data/twl06.txt' : '/data/sowpods.txt';
		cached = loadStaticText(fetchFn, origin, filename).then((content) => {
			const byLength = new Map<number, Set<string>>();
			const words = content
				.split('\n')
				.map((word) => word.trim().toUpperCase())
				.filter((word) => word.length > 0);

			for (const word of words) {
				const length = word.length;
				if (!byLength.has(length)) {
					byLength.set(length, new Set());
				}
				byLength.get(length)!.add(word);
			}

			return byLength;
		});
		textDictionaryCache.set(type, cached);
	}

	return cached;
}

async function loadWordSolverXWords(
	fetchFn: typeof fetch,
	origin: string,
	length: number
): Promise<Set<string>> {
	const file = WORDSOLVERX_FILES[length];
	if (!file) {
		return new Set();
	}

	let cached = wordSolverXCache.get(length);
	if (!cached) {
		cached = loadStaticText(fetchFn, origin, file).then((content) => {
			const data = JSON.parse(content) as WordsData;
			if (!Array.isArray(data.words)) {
				throw new Error('Invalid WordSolverX word list format');
			}

			return normalizeWords(data.words.filter((word) => word && word.length === length));
		});
		wordSolverXCache.set(length, cached);
	}

	return cached;
}

export async function getWordsOfLength(
	fetchFn: typeof fetch,
	origin: string,
	length: number,
	dictionary: DictionaryType = 'wordsolverx'
): Promise<Set<string>> {
	if (dictionary === 'wordsolverx') {
		return loadWordSolverXWords(fetchFn, origin, length);
	}

	const dict = await loadTextDictionary(fetchFn, origin, dictionary);
	return dict.get(length) ?? new Set();
}

async function getWordLadderIndex(
	fetchFn: typeof fetch,
	origin: string,
	length: number,
	dictionary: DictionaryType = 'wordsolverx'
): Promise<WordLadderIndex> {
	const cacheKey = `${dictionary}:${length}`;
	let cached = indexCache.get(cacheKey);

	if (!cached) {
		cached = getWordsOfLength(fetchFn, origin, length, dictionary).then((words) =>
			buildWordLadderIndex(words)
		);
		indexCache.set(cacheKey, cached);
	}

	return cached;
}

export async function isValidWord(
	fetchFn: typeof fetch,
	origin: string,
	word: string,
	dictionary: DictionaryType = 'wordsolverx'
): Promise<boolean> {
	const normalizedWord = word.trim().toUpperCase();
	if (!normalizedWord) return false;

	const words = await getWordsOfLength(fetchFn, origin, normalizedWord.length, dictionary);
	return words.has(normalizedWord);
}

export async function solveWordLadder(
	fetchFn: typeof fetch,
	origin: string,
	startWord: string,
	endWord: string,
	dictionary: DictionaryType = 'wordsolverx',
	options: number | SolveWordLadderOptions = 10
): Promise<SolveWordLadderResult> {
	const start = startWord.toUpperCase().trim();
	const end = endWord.toUpperCase().trim();

	if (!start || !end || start.length !== end.length) {
		return {
			solutions: [],
			length: 0,
			shortestLength: 0,
			stepCounts: [],
			truncated: false
		};
	}

	const index = await getWordLadderIndex(fetchFn, origin, start.length, dictionary);
	const normalizedOptions: SolveWordLadderOptions =
		typeof options === 'number' ? { maxSolutions: options, mode: 'short' } : options;

	return solveWordLadderWithIndex(index, start, end, normalizedOptions);
}

export async function getSuggestions(
	fetchFn: typeof fetch,
	origin: string,
	word: string,
	dictionary: DictionaryType = 'wordsolverx'
): Promise<string[]> {
	const normalizedWord = word.trim().toUpperCase();
	const index = await getWordLadderIndex(fetchFn, origin, normalizedWord.length, dictionary);
	return getWordLadderNeighbors(index, normalizedWord);
}
