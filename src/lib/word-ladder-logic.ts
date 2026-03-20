export type SolutionMode = 'short' | 'medium' | 'big' | 'all' | 'mixed';

export interface WordLadderIndex {
	wordLength: number;
	wordSet: Set<string>;
	patternMap: Map<string, string[]>;
	neighborCache: Map<string, string[]>;
}

export interface SolveWordLadderOptions {
	maxSolutions?: number;
	mode?: SolutionMode;
}

export interface SolveWordLadderResult {
	solutions: string[][];
	length: number;
	shortestLength: number;
	stepCounts: number[];
	truncated: boolean;
}

const MEDIUM_EXTRA_STEPS = 2;
const BIG_EXTRA_STEPS = 4;
const ALL_EXTRA_STEPS_FLOOR = 6;
const ALL_EXTRA_STEPS_CAP = 14;

export function buildWordLadderIndex(words: Iterable<string>): WordLadderIndex {
	const wordSet = new Set<string>();
	const patternMap = new Map<string, string[]>();
	let wordLength = 0;

	for (const rawWord of words) {
		const word = rawWord.trim();
		if (!word) continue;

		if (wordLength === 0) {
			wordLength = word.length;
		}

		if (word.length !== wordLength) continue;

		wordSet.add(word);
	}

	for (const word of wordSet) {
		for (let index = 0; index < word.length; index += 1) {
			const pattern = `${word.slice(0, index)}*${word.slice(index + 1)}`;
			const bucket = patternMap.get(pattern);
			if (bucket) {
				bucket.push(word);
			} else {
				patternMap.set(pattern, [word]);
			}
		}
	}

	return {
		wordLength,
		wordSet,
		patternMap,
		neighborCache: new Map()
	};
}

export function getWordLadderNeighbors(index: WordLadderIndex, word: string): string[] {
	const cached = index.neighborCache.get(word);
	if (cached) {
		return cached;
	}

	const neighbors = new Set<string>();

	for (let charIndex = 0; charIndex < word.length; charIndex += 1) {
		const pattern = `${word.slice(0, charIndex)}*${word.slice(charIndex + 1)}`;
		const bucket = index.patternMap.get(pattern);
		if (!bucket) continue;

		for (const candidate of bucket) {
			if (candidate !== word) {
				neighbors.add(candidate);
			}
		}
	}

	const orderedNeighbors = Array.from(neighbors).sort((left, right) => left.localeCompare(right));
	index.neighborCache.set(word, orderedNeighbors);
	return orderedNeighbors;
}

function getSafeAllModeExtraSteps(wordLength: number, maxSolutions: number): number {
	const scalingBonus = Math.ceil(maxSolutions / 20);
	return Math.max(
		ALL_EXTRA_STEPS_FLOOR,
		Math.min(ALL_EXTRA_STEPS_CAP, wordLength + 2 + scalingBonus)
	);
}

function getModeMaxSteps(
	mode: SolutionMode,
	shortestSteps: number,
	wordLength: number,
	maxSolutions: number
): number {
	if (mode === 'short') return shortestSteps;
	if (mode === 'medium') return shortestSteps + MEDIUM_EXTRA_STEPS;
	if (mode === 'big') return shortestSteps + BIG_EXTRA_STEPS;
	return shortestSteps + getSafeAllModeExtraSteps(wordLength, maxSolutions);
}

function findAllShortestPaths(
	index: WordLadderIndex,
	start: string,
	end: string,
	maxSolutions: number
): { solutions: string[][]; distance: number } | null {
	const parents = new Map<string, Set<string>>();
	const distance = new Map<string, number>();
	const queue: string[] = [start];

	distance.set(start, 0);

	let endDistance = Infinity;

	while (queue.length > 0) {
		const current = queue.shift()!;
		const currentDistance = distance.get(current)!;

		if (currentDistance >= endDistance) {
			continue;
		}

		for (const neighbor of getWordLadderNeighbors(index, current)) {
			const nextDistance = currentDistance + 1;
			const knownDistance = distance.get(neighbor);

			if (knownDistance === undefined) {
				distance.set(neighbor, nextDistance);
				parents.set(neighbor, new Set([current]));
				queue.push(neighbor);

				if (neighbor === end) {
					endDistance = nextDistance;
				}
			} else if (knownDistance === nextDistance) {
				const currentParents = parents.get(neighbor);
				if (currentParents) {
					currentParents.add(current);
				} else {
					parents.set(neighbor, new Set([current]));
				}
			}
		}
	}

	if (!Number.isFinite(endDistance)) {
		return null;
	}

	const solutions: string[][] = [];

	function reconstruct(current: string, path: string[]) {
		if (solutions.length >= maxSolutions) return;

		if (current === start) {
			solutions.push([...path].reverse());
			return;
		}

		const currentParents = parents.get(current);
		if (!currentParents) return;

		for (const parent of Array.from(currentParents).sort((left, right) => left.localeCompare(right))) {
			path.push(parent);
			reconstruct(parent, path);
			path.pop();
		}
	}

	reconstruct(end, [end]);

	return {
		solutions,
		distance: endDistance
	};
}

function buildDistanceMapToEnd(index: WordLadderIndex, end: string): Map<string, number> {
	const distances = new Map<string, number>();
	const queue: string[] = [end];

	distances.set(end, 0);

	while (queue.length > 0) {
		const current = queue.shift()!;
		const currentDistance = distances.get(current)!;

		for (const neighbor of getWordLadderNeighbors(index, current)) {
			if (distances.has(neighbor)) continue;
			distances.set(neighbor, currentDistance + 1);
			queue.push(neighbor);
		}
	}

	return distances;
}

function collectPathsOfExactStepCount(
	index: WordLadderIndex,
	start: string,
	end: string,
	targetSteps: number,
	distanceToEnd: Map<string, number>,
	maxSolutions: number,
	existingSolutions: Set<string>
): string[][] {
	const paths: string[][] = [];
	const visited = new Set<string>([start]);
	const path = [start];

	function dfs(current: string, stepsUsed: number) {
		if (paths.length >= maxSolutions) return;

		if (current === end) {
			if (stepsUsed === targetSteps) {
				const key = path.join(',');
				if (!existingSolutions.has(key)) {
					existingSolutions.add(key);
					paths.push([...path]);
				}
			}
			return;
		}

		if (stepsUsed >= targetSteps) return;

		const orderedNeighbors = getWordLadderNeighbors(index, current)
			.filter((neighbor) => !visited.has(neighbor) && distanceToEnd.has(neighbor))
			.sort((left, right) => {
				const leftDistance = distanceToEnd.get(left)!;
				const rightDistance = distanceToEnd.get(right)!;
				return leftDistance - rightDistance || left.localeCompare(right);
			});

		for (const neighbor of orderedNeighbors) {
			const remainingShortest = distanceToEnd.get(neighbor)!;
			if (stepsUsed + 1 + remainingShortest > targetSteps) {
				continue;
			}

			visited.add(neighbor);
			path.push(neighbor);
			dfs(neighbor, stepsUsed + 1);
			path.pop();
			visited.delete(neighbor);
		}
	}

	dfs(start, 0);
	return paths;
}

function normalizeMaxSolutions(maxSolutions: number | undefined): number {
	if (!Number.isFinite(maxSolutions)) return 10;
	return Math.min(500, Math.max(1, Math.floor(maxSolutions!)));
}

function getInternalCollectionLimit(maxSolutions: number): number {
	return Math.min(500, Math.max(30, maxSolutions * 3));
}

function interleaveSolutionBuckets(
	stepBuckets: Map<number, string[][]>,
	maxSolutions: number
): string[][] {
	const orderedBuckets = Array.from(stepBuckets.entries())
		.sort((left, right) => left[0] - right[0])
		.map(([, solutions]) => [...solutions]);

	const mixedSolutions: string[][] = [];

	while (mixedSolutions.length < maxSolutions) {
		let addedInRound = false;

		for (const bucket of orderedBuckets) {
			const nextSolution = bucket.shift();
			if (!nextSolution) continue;

			mixedSolutions.push(nextSolution);
			addedInRound = true;

			if (mixedSolutions.length >= maxSolutions) {
				break;
			}
		}

		if (!addedInRound) {
			break;
		}
	}

	return mixedSolutions;
}

export function solveWordLadderWithIndex(
	index: WordLadderIndex,
	startWord: string,
	endWord: string,
	options: SolveWordLadderOptions = {}
): SolveWordLadderResult {
	const start = startWord.trim();
	const end = endWord.trim();
	const maxSolutions = normalizeMaxSolutions(options.maxSolutions);
	const mode = options.mode ?? 'mixed';

	if (!start || !end || start.length !== end.length || start.length !== index.wordLength) {
		return {
			solutions: [],
			length: 0,
			shortestLength: 0,
			stepCounts: [],
			truncated: false
		};
	}

	if (start === end) {
		return {
			solutions: [[start]],
			length: 1,
			shortestLength: 1,
			stepCounts: [0],
			truncated: false
		};
	}

	if (!index.wordSet.has(start) || !index.wordSet.has(end)) {
		return {
			solutions: [],
			length: 0,
			shortestLength: 0,
			stepCounts: [],
			truncated: false
		};
	}

	const internalCollectionLimit = mode === 'short' ? maxSolutions : getInternalCollectionLimit(maxSolutions);
	const shortest = findAllShortestPaths(index, start, end, internalCollectionLimit);
	if (!shortest) {
		return {
			solutions: [],
			length: 0,
			shortestLength: 0,
			stepCounts: [],
			truncated: false
		};
	}

	const shortestLength = shortest.distance + 1;
	if (mode === 'short') {
		const limitedSolutions = shortest.solutions.slice(0, maxSolutions);
		const stepCounts = Array.from(
			new Set(limitedSolutions.map((solution) => solution.length - 1))
		).sort((left, right) => left - right);

		return {
			solutions: limitedSolutions,
			length: shortestLength,
			shortestLength,
			stepCounts,
			truncated: shortest.solutions.length > maxSolutions
		};
	}

	const stepBuckets = new Map<number, string[][]>();
	stepBuckets.set(shortest.distance, [...shortest.solutions]);

	const solutionKeys = new Set(shortest.solutions.map((solution) => solution.join(',')));
	const distanceToEnd = buildDistanceMapToEnd(index, end);
	const maxSteps = getModeMaxSteps(mode, shortest.distance, index.wordLength, maxSolutions);
	let reachedInternalLimit = shortest.solutions.length >= internalCollectionLimit;

	for (let targetSteps = shortest.distance + 1; targetSteps <= maxSteps; targetSteps += 1) {
		const extraSolutions = collectPathsOfExactStepCount(
			index,
			start,
			end,
			targetSteps,
			distanceToEnd,
			internalCollectionLimit,
			solutionKeys
		);

		if (extraSolutions.length > 0) {
			stepBuckets.set(targetSteps, extraSolutions);
		}

		if (extraSolutions.length >= internalCollectionLimit) {
			reachedInternalLimit = true;
		}
	}

	const allCollectedSolutions = Array.from(stepBuckets.values()).flat();
	const mixedSolutions = interleaveSolutionBuckets(stepBuckets, maxSolutions);
	const stepCounts = Array.from(new Set(mixedSolutions.map((solution) => solution.length - 1))).sort(
		(left, right) => left - right
	);

	return {
		solutions: mixedSolutions,
		length: shortestLength,
		shortestLength,
		stepCounts,
		truncated: reachedInternalLimit || allCollectedSolutions.length > maxSolutions
	};
}
