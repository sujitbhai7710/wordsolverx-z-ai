/// <reference lib="webworker" />

import type {
	AnalyzedPlay,
	AnalyzerAiTurn,
	AnalyzerGuessTurn,
	AverageRemaining,
	ClueRequirements,
	LuckEstimate,
	RankedAverageEntry,
	RemainingAnswers,
	RemainingAverageRankings,
	RemainingCounts,
	RemainingPreview,
	WordleAnalyzerResult,
	WordleAnalyzerWordData,
	WordleAnalyzerWorkerRequest,
	WordleAnalyzerWorkerResponse
} from '$lib/wordle-analyzer/types';

const PREVIEW_LIMIT = 30;
const POSITION_LABELS = ['1st', '2nd', '3rd', '4th', '5th'];
const STRATEGY_LABELS: Record<number, string> = {
	0: 'Eliminate likely words',
	1: 'Eliminate likely words with a possible answer',
	2: 'Take a punt on a likely word',
	3: 'Play the last likely word',
	4: 'Eliminate unlikely words',
	5: 'Eliminate unlikely words with a possible answer',
	6: 'Take a punt on a remaining word',
	7: 'Play the last remaining word'
};

interface MergedClueRequirements {
	additionalRequiredLetters: string[];
	positionalMatches: string[];
	positionalNotMatches: Array<Set<string>>;
	remainingMustNotContain: Set<string>;
}

let wordDataPromise: Promise<WordleAnalyzerWordData> | null = null;
let initialAveragesPromise: Promise<RemainingAverageRankings> | null = null;
let commonWordSetPromise: Promise<Set<string>> | null = null;
let allWordSetPromise: Promise<Set<string>> | null = null;

function fetchJson<T>(path: string) {
	return fetch(path).then(async (response) => {
		if (!response.ok) {
			throw new Error(`Failed to load ${path}: ${response.status}`);
		}

		return (await response.json()) as T;
	});
}

function getWordData() {
	if (!wordDataPromise) {
		wordDataPromise = fetchJson<WordleAnalyzerWordData>('/data/wordle-analyzer/word-data.json');
	}

	return wordDataPromise;
}

function getInitialRemainingAverages() {
	if (!initialAveragesPromise) {
		initialAveragesPromise = fetchJson<{ common: [string, number][]; all: [string, number][] }>(
			'/data/wordle-analyzer/initial-remaining-averages.json'
		).then((data) => ({
			common: data.common.map(([word, value]) => ({ word, value })),
			all: data.all.map(([word, value]) => ({ word, value }))
		}));
	}

	return initialAveragesPromise;
}

async function getCommonWordSet() {
	if (!commonWordSetPromise) {
		commonWordSetPromise = getWordData().then((data) => new Set(data.common));
	}

	return commonWordSetPromise;
}

async function getAllWordSet() {
	if (!allWordSetPromise) {
		allWordSetPromise = getWordData().then((data) => new Set([...data.common, ...data.other]));
	}

	return allWordSetPromise;
}

function buildInitialRemainingAnswers(wordData: WordleAnalyzerWordData): RemainingAnswers {
	return {
		common: [...wordData.common],
		other: [...wordData.other]
	};
}

function getRemainingCounts(remainingAnswers: RemainingAnswers): RemainingCounts {
	const common = remainingAnswers.common.length;
	const other = remainingAnswers.other.length;

	return {
		common,
		other,
		total: common + other
	};
}

function buildRemainingPreview(remainingAnswers: RemainingAnswers): RemainingPreview | null {
	const counts = getRemainingCounts(remainingAnswers);
	if (counts.total <= PREVIEW_LIMIT) {
		return {
			common: remainingAnswers.common,
			other: remainingAnswers.other,
			type: 'all'
		};
	}

	if (counts.common <= PREVIEW_LIMIT) {
		return {
			common: remainingAnswers.common,
			other: [],
			type: 'common-only'
		};
	}

	return null;
}

function buildClueRequirements(answer: string, guess: string): ClueRequirements {
	const remainingAnswerLetters = [...answer];
	const positionalMatches = ['', '', '', '', ''];
	const positionalNotMatches = ['', '', '', '', ''];
	const additionalRequiredLetters: string[] = [];
	const remainingMustNotContain = new Set<string>();

	for (let index = 0; index < guess.length; index += 1) {
		const guessedLetter = guess[index];
		if (answer[index] === guessedLetter) {
			remainingAnswerLetters.splice(remainingAnswerLetters.indexOf(guessedLetter), 1);
			positionalMatches[index] = guessedLetter;
		} else {
			positionalNotMatches[index] = guessedLetter;
		}
	}

	for (let index = 0; index < guess.length; index += 1) {
		if (positionalMatches[index]) {
			continue;
		}

		const guessedLetter = guess[index];
		if (remainingAnswerLetters.includes(guessedLetter)) {
			remainingAnswerLetters.splice(remainingAnswerLetters.indexOf(guessedLetter), 1);
			additionalRequiredLetters.push(guessedLetter);
		} else {
			remainingMustNotContain.add(guessedLetter);
		}
	}

	return {
		positionalMatches,
		positionalNotMatches,
		additionalRequiredLetters,
		remainingMustNotContain: [...remainingMustNotContain]
	};
}

function clueRequirementsToColors(requirements: ClueRequirements) {
	const remainingRequiredLetters = [...requirements.additionalRequiredLetters];
	let colors = '';

	for (let index = 0; index < requirements.positionalMatches.length; index += 1) {
		if (requirements.positionalMatches[index]) {
			colors += 'c';
			continue;
		}

		const disallowedLetter = requirements.positionalNotMatches[index];
		if (!disallowedLetter) {
			colors += 'a';
			continue;
		}

		const requiredIndex = remainingRequiredLetters.indexOf(disallowedLetter);
		if (requiredIndex !== -1) {
			remainingRequiredLetters.splice(requiredIndex, 1);
			colors += 'p';
			continue;
		}

		colors += 'a';
	}

	return colors;
}

function matchesClueRequirements(word: string, requirements: ClueRequirements) {
	const remainingRequiredLetters = [...requirements.additionalRequiredLetters];
	const mustNotContain = new Set(requirements.remainingMustNotContain);

	for (let index = 0; index < word.length; index += 1) {
		const letter = word[index];
		const match = requirements.positionalMatches[index];
		const notMatch = requirements.positionalNotMatches[index];

		if (match) {
			if (match !== letter) {
				return false;
			}
			continue;
		}

		if (notMatch && letter === notMatch) {
			return false;
		}

		const requiredIndex = remainingRequiredLetters.indexOf(letter);
		if (requiredIndex !== -1) {
			remainingRequiredLetters.splice(requiredIndex, 1);
		} else if (mustNotContain.has(letter)) {
			return false;
		}
	}

	return remainingRequiredLetters.length === 0;
}

function mergeClueRequirements(clues: ClueRequirements[]): MergedClueRequirements {
	let requiredLetters = '';
	const positionalMatches = ['', '', '', '', ''];
	const positionalNotMatches = positionalMatches.map(() => new Set<string>());
	const remainingMustNotContain = new Set<string>();

	for (const clue of clues) {
		let nextRequired = clue.additionalRequiredLetters.join('');

		for (const [index, match] of clue.positionalMatches.entries()) {
			if (match) {
				positionalMatches[index] = match;
				nextRequired += match;
			}
		}

		for (const letter of nextRequired) {
			requiredLetters = requiredLetters.replace(letter, '');
		}

		requiredLetters += nextRequired;

		for (const letter of clue.remainingMustNotContain) {
			remainingMustNotContain.add(letter);
		}

		for (const [index, notMatch] of clue.positionalNotMatches.entries()) {
			if (notMatch) {
				positionalNotMatches[index].add(notMatch);
			}
		}
	}

	return {
		additionalRequiredLetters: [...requiredLetters],
		positionalMatches,
		positionalNotMatches,
		remainingMustNotContain
	};
}

function getGuessRequirementIssues(guess: string, requirements: MergedClueRequirements) {
	const missingPositionalMatches = new Set<string>();
	const violatedPositionalNotMatches = new Set<string>();
	const missingAdditionalRequiredLetters = new Set<string>();
	const violatedMustNotContain = new Set<string>();
	const remainingRequiredLetters = [...requirements.additionalRequiredLetters];

	for (const [index, disallowedLetters] of requirements.positionalNotMatches.entries()) {
		if (disallowedLetters.has(guess[index])) {
			violatedPositionalNotMatches.add(
				`${POSITION_LABELS[index]} letter must not be "${guess[index].toUpperCase()}"`
			);
		}
	}

	for (const [index, letter] of [...guess].entries()) {
		const positionalMatch = requirements.positionalMatches[index];
		if (positionalMatch && positionalMatch !== letter) {
			missingPositionalMatches.add(
				`${POSITION_LABELS[index]} letter must be "${positionalMatch.toUpperCase()}"`
			);
		}

		const requiredIndex = remainingRequiredLetters.indexOf(letter);
		if (requiredIndex !== -1) {
			remainingRequiredLetters.splice(requiredIndex, 1);
		} else if (requirements.remainingMustNotContain.has(letter)) {
			violatedMustNotContain.add(`Too many "${letter.toUpperCase()}"s`);
		}
	}

	for (const letter of remainingRequiredLetters) {
		missingAdditionalRequiredLetters.add(`Too few "${letter.toUpperCase()}"s`);
	}

	return {
		missingPositionalMatches: [...missingPositionalMatches],
		violatedPositionalNotMatches: [...violatedPositionalNotMatches],
		missingAdditionalRequiredLetters: [...missingAdditionalRequiredLetters],
		violatedMustNotContain: [...violatedMustNotContain]
	};
}

function matchesHardModeGuess(guess: string, requirements: MergedClueRequirements) {
	let requiredLetters = requirements.additionalRequiredLetters.join('');

	for (const [index, letter] of [...guess].entries()) {
		const positionalMatch = requirements.positionalMatches[index];
		if (positionalMatch) {
			if (positionalMatch !== letter) {
				return false;
			}
			continue;
		}

		requiredLetters = requiredLetters.replace(letter, '');
	}

	return requiredLetters.length === 0;
}

function getAllRemainingWords(remainingAnswers: RemainingAnswers) {
	return [...remainingAnswers.common, ...remainingAnswers.other];
}

function computeGuessDistribution(remainingAnswers: RemainingAnswers, guess: string) {
	const distributions = {
		common: [] as number[],
		all: [] as number[]
	};
	const allRemainingWords = getAllRemainingWords(remainingAnswers);
	const patternCache = new Map<string, [number, number]>();

	for (const answer of allRemainingWords) {
		if (guess === answer) {
			distributions.common.push(0);
			distributions.all.push(0);
			continue;
		}

		const clue = buildClueRequirements(answer, guess);
		const clueKey = clueRequirementsToColors(clue);
		const cached = patternCache.get(clueKey);

		if (cached) {
			distributions.common.push(cached[0]);
			distributions.all.push(cached[1]);
			continue;
		}

		let commonCount = 0;
		let allCount = 0;

		for (const candidate of allRemainingWords) {
			if (!matchesClueRequirements(candidate, clue)) {
				continue;
			}

			allCount += 1;
			if (remainingAnswers.common.includes(candidate)) {
				commonCount += 1;
			}
		}

		patternCache.set(clueKey, [commonCount, allCount]);
		distributions.common.push(commonCount);
		distributions.all.push(allCount);
	}

	return distributions;
}

async function computeRemainingAverages(
	remainingAnswers: RemainingAnswers,
	hardModeRequirements?: MergedClueRequirements
) {
	const allRemainingWords = getAllRemainingWords(remainingAnswers);
	if (!allRemainingWords.length) {
		throw new Error('No remaining answers to analyze.');
	}

	const wordData = await getWordData();
	const allGuesses = [...wordData.common, ...wordData.other];
	const candidateGuesses = hardModeRequirements
		? allGuesses.filter((guess) => matchesHardModeGuess(guess, hardModeRequirements))
		: allGuesses;

	const commonRankings: RankedAverageEntry[] = [];
	const allRankings: RankedAverageEntry[] = [];

	for (const guess of candidateGuesses) {
		const distributions = computeGuessDistribution(remainingAnswers, guess);
		const commonAverage =
			distributions.common.reduce((sum, value) => sum + value, 0) / distributions.common.length;
		const allAverage =
			distributions.all.reduce((sum, value) => sum + value, 0) / distributions.all.length;

		commonRankings.push({ word: guess, value: commonAverage });
		allRankings.push({ word: guess, value: allAverage });
	}

	commonRankings.sort((left, right) => left.value - right.value);
	allRankings.sort((left, right) => left.value - right.value);

	return {
		common: commonRankings,
		all: allRankings
	} satisfies RemainingAverageRankings;
}

function getLuckLabel(estimate: { good: boolean; chance: number }): string {
	const { good, chance } = estimate;
	if (chance > 0.5) {
		return 'Neutral';
	}

	if (good) {
		if (chance > 0.2) return 'Lucky';
		if (chance > 0.1) return 'Very lucky';
		if (chance > 0.02) return 'Super lucky';
		if (chance > 0.01) return 'Extremely lucky';
		if (chance > 0.001) return 'Unbelievably lucky';
		return 'Literally incredible';
	}

	if (chance > 0.2) return 'Unlucky';
	if (chance > 0.1) return 'Very unlucky';
	if (chance > 0.02) return 'Super unlucky';
	if (chance > 0.01) return 'Extremely unlucky';
	if (chance > 0.001) return 'Unbelievably unlucky';
	return 'Brutally unlucky';
}

function evaluateLuck(
	guess: string,
	remainingAnswersBefore: RemainingAnswers,
	remainingAnswersAfter: RemainingAnswers,
	commonWordSet: Set<string>
): LuckEstimate {
	const shouldUseCommonDistribution =
		(remainingAnswersAfter.common.length === 0 &&
			remainingAnswersAfter.other.length === 0 &&
			commonWordSet.has(guess)) ||
		remainingAnswersAfter.common.length !== 0;

	const distributions = shouldUseCommonDistribution
		? computeGuessDistribution(
				{
					common: remainingAnswersBefore.common,
					other: []
				},
				guess
			)
		: computeGuessDistribution(remainingAnswersBefore, guess);

	const remainingCount = shouldUseCommonDistribution
		? remainingAnswersAfter.common.length
		: remainingAnswersAfter.common.length + remainingAnswersAfter.other.length;

	const sorted = [...distributions.all].sort((left, right) => right - left);
	let equalIndex = sorted.findIndex((value) => remainingCount >= value);
	if (equalIndex === -1) {
		equalIndex = sorted.length;
	}

	let equalCount = 0;
	for (let index = equalIndex; index < sorted.length && sorted[index] === remainingCount; index += 1) {
		equalCount += 1;
	}

	const lowerCount = sorted.length - equalIndex - equalCount;
	const estimate =
		lowerCount > equalIndex
			? { good: false, chance: (equalCount + equalIndex) / sorted.length }
			: { good: true, chance: (lowerCount + equalCount) / sorted.length };

	return {
		...estimate,
		label: getLuckLabel(estimate)
	};
}

function computeGuessQuality(
	remainingAnswersAfter: RemainingAnswers,
	rankings: RemainingAverageRankings,
	commonRankingIndex: number,
	allRankingIndex: number
) {
	const [rankingEntries, rankingIndex] =
		remainingAnswersAfter.common.length !== 0
			? [rankings.common, commonRankingIndex]
			: [rankings.all, allRankingIndex];

	if (rankingIndex < 0 || !rankingEntries[rankingIndex]) {
		return undefined;
	}

	let distinctRankCount = 0;
	let currentValue = -1;
	let guessRank = -1;
	const guessValue = rankingEntries[rankingIndex].value;

	for (const entry of rankingEntries) {
		if (currentValue !== entry.value) {
			if (guessValue === entry.value) {
				guessRank = distinctRankCount;
			}

			distinctRankCount += 1;
			currentValue = entry.value;
		}
	}

	if (guessRank === -1 || distinctRankCount === 0) {
		return undefined;
	}

	return 1 - guessRank / distinctRankCount;
}

function getAverageRemainingForGuess(
	rankings: RemainingAverageRankings,
	commonRankingIndex: number,
	allRankingIndex: number
): AverageRemaining | undefined {
	if (commonRankingIndex < 0 || allRankingIndex < 0) {
		return undefined;
	}

	const commonEntry = rankings.common[commonRankingIndex];
	const allEntry = rankings.all[allRankingIndex];
	if (!commonEntry || !allEntry) {
		return undefined;
	}

	return {
		common: commonEntry.value,
		all: allEntry.value
	};
}

function getStrategyForRemainingAnswers(
	remainingAnswers: RemainingAnswers,
	rankings: RemainingAverageRankings
) {
	for (const [useCommonWords, remainingWords, rankingEntries] of [
		[true, remainingAnswers.common, rankings.common],
		[false, remainingAnswers.other, rankings.all]
	] as const) {
		if (remainingWords.length === 0) {
			continue;
		}

		if (remainingWords.length === 1) {
			return {
				guess: remainingWords[0],
				strategyCode: useCommonWords ? 3 : 7
			};
		}

		const candidateEntries = remainingWords.length === 2 ? rankings.all : rankingEntries;
		const bestEntry = candidateEntries[0];
		if (!bestEntry) {
			continue;
		}

		for (const entry of candidateEntries) {
			if (entry.value - bestEntry.value > 0.5 && remainingWords.length !== 2) {
				return {
					guess: bestEntry.word,
					strategyCode: useCommonWords ? 0 : 4
				};
			}

			if (remainingWords.includes(entry.word)) {
				return {
					guess: entry.word,
					strategyCode: useCommonWords
						? remainingWords.length === 2
							? 2
							: 1
						: remainingWords.length === 2
							? 6
							: 5
				};
			}
		}
	}

	throw new Error('No remaining answers available for strategy selection.');
}

function getRemainingAnswersAfterGuess(
	guess: string,
	answer: string,
	remainingAnswersBefore: RemainingAnswers
) {
	if (guess === answer) {
		return {
			remainingAnswers: {
				common: [],
				other: []
			},
			clue: buildClueRequirements(answer, guess)
		};
	}

	const clue = buildClueRequirements(answer, guess);

	return {
		clue,
		remainingAnswers: {
			common: remainingAnswersBefore.common.filter((word) => matchesClueRequirements(word, clue)),
			other: remainingAnswersBefore.other.filter((word) => matchesClueRequirements(word, clue))
		}
	};
}

function analyzePlay(
	guess: string,
	answer: string,
	mergedRequirements: MergedClueRequirements,
	remainingAnswersBefore: RemainingAnswers,
	rankings: RemainingAverageRankings,
	commonWordSet: Set<string>,
	hardMode: boolean
): AnalyzedPlay {
	const { clue, remainingAnswers } = getRemainingAnswersAfterGuess(guess, answer, remainingAnswersBefore);
	const commonRankingIndex = rankings.common.findIndex((entry) => entry.word === guess);
	const allRankingIndex = rankings.all.findIndex((entry) => entry.word === guess);
	const issues = getGuessRequirementIssues(guess, mergedRequirements);
	const hardModeViolations = [
		...issues.missingPositionalMatches,
		...issues.missingAdditionalRequiredLetters
	];
	const invalidHardModePlay = hardMode && hardModeViolations.length > 0;

	return {
		guess,
		colors: [...clueRequirementsToColors(clue)] as AnalyzedPlay['colors'],
		clue,
		averageRemaining: getAverageRemainingForGuess(rankings, commonRankingIndex, allRankingIndex),
		guessQuality: invalidHardModePlay
			? undefined
			: computeGuessQuality(remainingAnswers, rankings, commonRankingIndex, allRankingIndex),
		remainingAfter: getRemainingCounts(remainingAnswers),
		remainingPreview: buildRemainingPreview(remainingAnswers),
		commonWord: commonWordSet.has(guess),
		possibleAnswer:
			issues.missingPositionalMatches.length === 0 &&
			issues.violatedPositionalNotMatches.length === 0 &&
			issues.missingAdditionalRequiredLetters.length === 0 &&
			issues.violatedMustNotContain.length === 0,
		hardModeValid: hardModeViolations.length === 0,
		unusedClues: [
			...issues.missingPositionalMatches,
			...issues.violatedPositionalNotMatches,
			...issues.missingAdditionalRequiredLetters,
			...issues.violatedMustNotContain
		],
		hardModeViolations,
		luck: invalidHardModePlay
			? undefined
			: evaluateLuck(guess, remainingAnswersBefore, remainingAnswers, commonWordSet)
	};
}

function pickBestPlay(answer: string, userPlay: AnalyzedPlay, aiPlay: AnalyzedPlay) {
	if (userPlay.guess === answer && aiPlay.guess === answer) {
		return 'same' as const;
	}

	if (userPlay.guess === answer) {
		return 'user' as const;
	}

	if (aiPlay.guess === answer) {
		return 'ai' as const;
	}

	if (userPlay.remainingAfter.common !== aiPlay.remainingAfter.common) {
		return userPlay.remainingAfter.common < aiPlay.remainingAfter.common ? 'user' : 'ai';
	}

	if (userPlay.remainingAfter.other !== aiPlay.remainingAfter.other) {
		return userPlay.remainingAfter.other < aiPlay.remainingAfter.other ? 'user' : 'ai';
	}

	return 'unknown' as const;
}

async function getRankingsForState(
	previousClues: ClueRequirements[],
	remainingAnswers: RemainingAnswers,
	hardMode: boolean
) {
	if (previousClues.length === 0) {
		return getInitialRemainingAverages();
	}

	const mergedRequirements = mergeClueRequirements(previousClues);

	return computeRemainingAverages(
		remainingAnswers,
		hardMode ? mergedRequirements : undefined
	);
}

async function analyzeWordlePlay(
	guesses: string[],
	answer: string,
	hardMode: boolean,
	requestId: number
) {
	const [wordData, commonWordSet, allWordSet] = await Promise.all([
		getWordData(),
		getCommonWordSet(),
		getAllWordSet()
	]);

	const invalidWords = [...new Set([...guesses, answer])].filter((word) => !allWordSet.has(word));
	if (invalidWords.length > 0) {
		throw new Error(
			`One or more words are not in the Wordle dictionary: ${invalidWords
				.map((word) => `"${word.toUpperCase()}"`)
				.join(', ')}`
		);
	}

	const guessColors = guesses.map((guess) =>
		[...clueRequirementsToColors(buildClueRequirements(answer, guess))] as AnalyzedPlay['colors']
	);

	const guessTurns: AnalyzerGuessTurn[] = [];
	let previousUserClues: ClueRequirements[] = [];
	let currentUserRemaining = buildInitialRemainingAnswers(wordData);

	for (const [turnIndex, guess] of guesses.entries()) {
		postMessage({
			type: 'progress',
			requestId,
			progress: {
				message: `Analyzing guess ${turnIndex + 1} of ${guesses.length}`,
				done: turnIndex,
				total: guesses.length + 8
			}
		} satisfies WordleAnalyzerWorkerResponse);

		const beforeRemainingCounts = getRemainingCounts(currentUserRemaining);
		const rankings = await getRankingsForState(previousUserClues, currentUserRemaining, hardMode);
		const mergedRequirements = mergeClueRequirements(previousUserClues);
		const userPlay = analyzePlay(
			guess,
			answer,
			mergedRequirements,
			currentUserRemaining,
			rankings,
			commonWordSet,
			hardMode
		);
		const strategy = getStrategyForRemainingAnswers(currentUserRemaining, rankings);
		const aiPlay = analyzePlay(
			strategy.guess,
			answer,
			mergedRequirements,
			currentUserRemaining,
			rankings,
			commonWordSet,
			hardMode
		);

		guessTurns.push({
			turn: turnIndex,
			beforeRemainingCounts,
			user: userPlay,
			ai: aiPlay,
			bestPlay: pickBestPlay(answer, userPlay, aiPlay),
			strategyCode: strategy.strategyCode,
			strategyLabel: STRATEGY_LABELS[strategy.strategyCode] ?? 'Custom strategy'
		});

		previousUserClues.push(userPlay.clue);
		currentUserRemaining = getRemainingAnswersAfterGuess(
			guess,
			answer,
			currentUserRemaining
		).remainingAnswers;
	}

	const aiTurns: AnalyzerAiTurn[] = [];
	let previousAiClues: ClueRequirements[] = [];
	let currentAiRemaining = buildInitialRemainingAnswers(wordData);

	for (let turnIndex = 0; turnIndex < 8; turnIndex += 1) {
		postMessage({
			type: 'progress',
			requestId,
			progress: {
				message: `Simulating AI turn ${turnIndex + 1}`,
				done: guesses.length + turnIndex,
				total: guesses.length + 8
			}
		} satisfies WordleAnalyzerWorkerResponse);

		const beforeRemainingCounts = getRemainingCounts(currentAiRemaining);
		const rankings = await getRankingsForState(previousAiClues, currentAiRemaining, hardMode);
		const mergedRequirements = mergeClueRequirements(previousAiClues);
		const strategy = getStrategyForRemainingAnswers(currentAiRemaining, rankings);
		const play = analyzePlay(
			strategy.guess,
			answer,
			mergedRequirements,
			currentAiRemaining,
			rankings,
			commonWordSet,
			hardMode
		);

		aiTurns.push({
			turn: turnIndex,
			beforeRemainingCounts,
			play,
			strategyCode: strategy.strategyCode,
			strategyLabel: STRATEGY_LABELS[strategy.strategyCode] ?? 'Custom strategy'
		});

		if (play.guess === answer) {
			break;
		}

		previousAiClues.push(play.clue);
		currentAiRemaining = getRemainingAnswersAfterGuess(
			play.guess,
			answer,
			currentAiRemaining
		).remainingAnswers;
	}

	return {
		answer,
		guesses,
		hardMode,
		guessColors,
		guessTurns,
		aiTurns
	} satisfies WordleAnalyzerResult;
}

self.addEventListener('message', async (event: MessageEvent<WordleAnalyzerWorkerRequest>) => {
	const data = event.data;

	if (data?.type === 'init') {
		try {
			await Promise.all([
				getWordData(),
				getInitialRemainingAverages(),
				getCommonWordSet(),
				getAllWordSet()
			]);
			postMessage({ type: 'ready' } satisfies WordleAnalyzerWorkerResponse);
		} catch (error) {
			postMessage({
				type: 'error',
				error: error instanceof Error ? error.message : 'Failed to initialize the Wordle analyzer.'
			} satisfies WordleAnalyzerWorkerResponse);
		}
		return;
	}

	if (data?.type !== 'analyze') {
		return;
	}

	try {
		const normalizedGuesses = data.guesses.map((guess) => guess.trim().toLowerCase());
		const normalizedAnswer = data.answer.trim().toLowerCase();

		const result = await analyzeWordlePlay(
			normalizedGuesses,
			normalizedAnswer,
			Boolean(data.hardMode),
			data.requestId
		);

		postMessage({
			type: 'result',
			requestId: data.requestId,
			result
		} satisfies WordleAnalyzerWorkerResponse);
	} catch (error) {
		postMessage({
			type: 'error',
			requestId: data.requestId,
			error: error instanceof Error ? error.message : 'The Wordle analyzer could not finish the request.'
		} satisfies WordleAnalyzerWorkerResponse);
	}
});
