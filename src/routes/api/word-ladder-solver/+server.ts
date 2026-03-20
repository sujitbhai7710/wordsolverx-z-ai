import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	solveWordLadder,
	isValidWord,
	getSuggestions,
	getWordsOfLength,
	type DictionaryType
} from '$lib/server/word-ladder';

function getDictionaryLabel(dictionary: DictionaryType): string {
	if (dictionary === 'wordsolverx') return 'Our Word List';
	if (dictionary === 'twl') return 'OWL2 (US Scrabble)';
	return 'SOWPODS (World Scrabble)';
}

export const POST: RequestHandler = async ({ request, fetch, url }) => {
	try {
		const body = (await request.json()) as {
			startWord?: string;
			endWord?: string;
			dictionary?: DictionaryType;
			maxSolutions?: number;
			mode?: 'short' | 'medium' | 'big' | 'all';
		};

		if (!body.startWord || !body.endWord) {
			return json({ error: 'Both start and end words are required' }, { status: 400 });
		}

		const start = body.startWord.toUpperCase().trim();
		const end = body.endWord.toUpperCase().trim();

		if (!/^[A-Z]+$/.test(start) || !/^[A-Z]+$/.test(end)) {
			return json({ error: 'Words must contain only letters' }, { status: 400 });
		}

		if (start.length !== end.length) {
			return json({ error: 'Start and end words must be the same length' }, { status: 400 });
		}

		const dictionary = body.dictionary ?? 'wordsolverx';
		const maxSolutions = Number.isFinite(body.maxSolutions) ? Number(body.maxSolutions) : 10;

		const [startValid, endValid] = await Promise.all([
			isValidWord(fetch, url.origin, start, dictionary),
			isValidWord(fetch, url.origin, end, dictionary)
		]);

		if (!startValid) {
			return json(
				{
					error: `"${start}" is not in the ${getDictionaryLabel(dictionary)} dictionary`
				},
				{ status: 400 }
			);
		}

		if (!endValid) {
			return json(
				{
					error: `"${end}" is not in the ${getDictionaryLabel(dictionary)} dictionary`
				},
				{ status: 400 }
			);
		}

		const result = await solveWordLadder(fetch, url.origin, start, end, dictionary, {
			maxSolutions,
			mode: body.mode ?? 'short'
		});

		return json({
			success: true,
			startWord: start,
			endWord: end,
			dictionary,
			length: result.length,
			shortestLength: result.shortestLength,
			stepCounts: result.stepCounts,
			truncated: result.truncated,
			solutionsCount: result.solutions.length,
			solutions: result.solutions
		});
	} catch (error) {
		console.error('Word ladder solver API error:', error);
		return json({ error: 'An error occurred while solving the word ladder' }, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ fetch, url }) => {
	const action = url.searchParams.get('action');
	const word = url.searchParams.get('word');
	const length = url.searchParams.get('length');
	const dictionary = (url.searchParams.get('dictionary') ?? 'wordsolverx') as DictionaryType;

	try {
		if (action === 'validate' && word) {
			const valid = await isValidWord(fetch, url.origin, word, dictionary);
			return json({ word, valid, dictionary });
		}

		if (action === 'suggestions' && word) {
			const suggestions = await getSuggestions(fetch, url.origin, word, dictionary);
			return json({ word, suggestions, dictionary });
		}

		if (action === 'words' && length) {
			const parsedLength = Number.parseInt(length, 10);
			if (Number.isNaN(parsedLength) || parsedLength < 2 || parsedLength > 15) {
				return json({ error: 'Length must be between 2 and 15' }, { status: 400 });
			}

			const words = await getWordsOfLength(fetch, url.origin, parsedLength, dictionary);
			return json({
				length: parsedLength,
				count: words.size,
				dictionary
			});
		}

		return json({ error: 'Invalid action. Use: validate, suggestions, or words' }, { status: 400 });
	} catch (error) {
		console.error('Word ladder solver API GET error:', error);
		return json({ error: 'An error occurred' }, { status: 500 });
	}
};
