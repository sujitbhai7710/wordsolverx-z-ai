import type { WordlebotGameConfig, WordlebotGameSlug } from './types';

export const WORDLEBOT_LETTER_LENGTHS = [3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export const WORDLEBOT_GAMES: WordlebotGameConfig[] = [
	{
		slug: 'canuckle',
		name: 'Canuckle',
		rankingKey: 'Canuckle',
		boards: 1,
		lengths: [5],
		defaultMax: 6,
		feedback: 'standard',
		description:
			'The Canadian-themed 5-letter game with its own accepted-word list and curated answer bank.'
	},
	{
		slug: 'wordle',
		name: 'Wordle',
		rankingKey: 'Wordle',
		boards: 1,
		lengths: [...WORDLEBOT_LETTER_LENGTHS],
		defaultMax: 6,
		feedback: 'standard',
		description: 'Classic Wordle feedback with green, yellow, and gray tiles.'
	},
	{
		slug: 'xordle',
		name: 'Xordle',
		rankingKey: 'Xordle',
		boards: 1,
		lengths: [...WORDLEBOT_LETTER_LENGTHS],
		defaultMax: 9,
		feedback: 'xordle',
		description: 'Each clue merges feedback from two hidden words with no shared letters.'
	},
	{
		slug: 'fibble',
		name: 'Fibble',
		rankingKey: 'Fibble',
		boards: 1,
		lengths: [...WORDLEBOT_LETTER_LENGTHS],
		defaultMax: 9,
		feedback: 'standard',
		description: 'Exactly one clue tile can be a lie on each guess.'
	},
	{
		slug: 'warmle',
		name: 'Warmle',
		rankingKey: 'Warmle',
		boards: 1,
		lengths: [...WORDLEBOT_LETTER_LENGTHS],
		defaultMax: 6,
		feedback: 'warmle',
		description: "Yellow means the answer's letter is nearby alphabetically.",
		supportsWarmleDistance: true
	},
	{
		slug: 'hardle',
		name: 'Hardle',
		rankingKey: 'Hardle',
		boards: 1,
		lengths: [...WORDLEBOT_LETTER_LENGTHS],
		defaultMax: 8,
		feedback: 'standard',
		description: 'Green and yellow clues can swap roles.'
	},
	{
		slug: 'woodle',
		name: 'Woodle',
		rankingKey: 'Woodle',
		boards: 1,
		lengths: [...WORDLEBOT_LETTER_LENGTHS],
		defaultMax: 8,
		feedback: 'woodle',
		description: 'You only know how many letters are exact matches and misplaced.'
	},
	{
		slug: 'w-peaks',
		name: 'Wordle Peaks',
		rankingKey: 'W-Peaks',
		boards: 1,
		lengths: [...WORDLEBOT_LETTER_LENGTHS],
		defaultMax: 6,
		feedback: 'peaks',
		description:
			'Each tile shows whether the answer letter is before, after, or equal alphabetically.'
	},
	{
		slug: 'thirdle',
		name: 'Thirdle',
		rankingKey: 'Thirdle',
		boards: 1,
		lengths: [3],
		defaultMax: 3,
		feedback: 'standard',
		description: 'A 3-letter mode that allows any 3-letter guess.'
	},
	{
		slug: 'dordle',
		name: 'Dordle',
		rankingKey: 'Dordle',
		boards: 2,
		lengths: [...WORDLEBOT_LETTER_LENGTHS],
		defaultMax: 7,
		feedback: 'standard',
		description: 'Solve two Wordles at once with the same guesses.'
	},
	{
		slug: 'quordle',
		name: 'Quordle',
		rankingKey: 'Quordle',
		boards: 4,
		lengths: [...WORDLEBOT_LETTER_LENGTHS],
		defaultMax: 9,
		feedback: 'standard',
		description: 'Solve four boards at the same time.'
	},
	{
		slug: 'octordle',
		name: 'Octordle',
		rankingKey: 'Octordle',
		boards: 8,
		lengths: [...WORDLEBOT_LETTER_LENGTHS],
		defaultMax: 13,
		feedback: 'standard',
		description: 'Solve eight boards at the same time.'
	},
	{
		slug: 'spotle',
		name: 'Spotle',
		rankingKey: 'Spotle',
		boards: 1,
		lengths: [5],
		defaultMax: 6,
		feedback: 'spotle',
		description: 'Some clue positions can be blank, so tiles support an empty state.'
	}
];

export function getWordlebotGame(slug: WordlebotGameSlug): WordlebotGameConfig {
	return WORDLEBOT_GAMES.find((game) => game.slug === slug) ?? WORDLEBOT_GAMES[0];
}

export function getLengthsForWordlebotGame(slug: WordlebotGameSlug): number[] {
	return [...getWordlebotGame(slug).lengths];
}

export function getBestLengthForWordlebotGame(
	slug: WordlebotGameSlug,
	preferredLength: number
): number {
	const lengths = getLengthsForWordlebotGame(slug);
	return lengths.includes(preferredLength) ? preferredLength : lengths[0];
}
