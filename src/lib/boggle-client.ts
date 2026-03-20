export interface Position {
	row: number;
	col: number;
}

export interface FoundWord {
	word: string;
	path: Position[];
	score: number;
}

export interface BoggleStats {
	totalWords: number;
	totalScore: number;
	wordLengths: Record<number, number>;
}

export interface BoggleSolveResult {
	success: boolean;
	board: string[][];
	letters: string;
	size: number;
	words: FoundWord[];
	stats: BoggleStats;
	dictionarySize: number;
}

export type DiceType = 'classic' | 'revised' | 'none';

class TrieNode {
	children = new Map<string, TrieNode>();
	isWord = false;
}

class Trie {
	root = new TrieNode();
	private wordCount = 0;

	insert(word: string): void {
		const normalizedWord = word.toUpperCase().trim();
		if (!normalizedWord) return;

		let node = this.root;
		for (const char of normalizedWord) {
			if (!node.children.has(char)) {
				node.children.set(char, new TrieNode());
			}
			node = node.children.get(char)!;
		}

		if (!node.isWord) {
			node.isWord = true;
			this.wordCount += 1;
		}
	}

	size(): number {
		return this.wordCount;
	}
}

const BOGGLE_SCORES: Record<number, number> = {
	3: 1,
	4: 1,
	5: 2,
	6: 3,
	7: 5,
	8: 11
};

const BIG_BOARD_SCORES: Record<number, number> = {
	9: 15,
	10: 20,
	11: 25,
	12: 30,
	13: 35,
	14: 40,
	15: 45,
	16: 50
};

const DIRECTIONS: Position[] = [
	{ row: -1, col: -1 },
	{ row: -1, col: 0 },
	{ row: -1, col: 1 },
	{ row: 0, col: -1 },
	{ row: 0, col: 1 },
	{ row: 1, col: -1 },
	{ row: 1, col: 0 },
	{ row: 1, col: 1 }
];

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

function calculateScore(wordLength: number): number {
	if (wordLength < 3) return 0;
	return BOGGLE_SCORES[wordLength] ?? BIG_BOARD_SCORES[wordLength] ?? 50 + (wordLength - 16) * 5;
}

class BoggleSolver {
	private trie: Trie;
	private board: string[][] = [];
	private rows = 0;
	private cols = 0;
	private minWordLength: number;

	constructor(dictionary: string[], minWordLength = 3) {
		this.trie = new Trie();
		this.minWordLength = minWordLength;

		for (const word of dictionary) {
			const trimmed = word.trim().toUpperCase();
			if (trimmed.length >= minWordLength && /^[A-Z]+$/.test(trimmed)) {
				this.trie.insert(trimmed);
			}
		}
	}

	solve(board: string[][]): FoundWord[] {
		this.board = board.map((row) => row.map((cell) => cell.toUpperCase()));
		this.rows = board.length;
		this.cols = board[0]?.length ?? 0;

		const foundWords = new Map<string, FoundWord>();
		const visited = Array(this.rows)
			.fill(null)
			.map(() => Array(this.cols).fill(false));

		for (let row = 0; row < this.rows; row += 1) {
			for (let col = 0; col < this.cols; col += 1) {
				this.dfs(row, col, '', [], visited, foundWords, this.trie.root);
			}
		}

		return Array.from(foundWords.values()).sort((left, right) => {
			if (right.word.length !== left.word.length) {
				return right.word.length - left.word.length;
			}
			return left.word.localeCompare(right.word);
		});
	}

	private dfs(
		row: number,
		col: number,
		currentWord: string,
		path: Position[],
		visited: boolean[][],
		foundWords: Map<string, FoundWord>,
		trieNode: TrieNode
	): void {
		if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
			return;
		}

		if (visited[row][col]) {
			return;
		}

		const letter = this.board[row][col];
		const lettersToAdd = letter === 'Q' ? 'QU' : letter;
		const newWord = currentWord + lettersToAdd;

		let currentNode = trieNode;
		for (const char of lettersToAdd) {
			if (!currentNode.children.has(char)) {
				return;
			}
			currentNode = currentNode.children.get(char)!;
		}

		visited[row][col] = true;
		path.push({ row, col });

		if (currentNode.isWord && newWord.length >= this.minWordLength && !foundWords.has(newWord)) {
			foundWords.set(newWord, {
				word: newWord,
				path: [...path],
				score: calculateScore(newWord.length)
			});
		}

		for (const direction of DIRECTIONS) {
			this.dfs(
				row + direction.row,
				col + direction.col,
				newWord,
				path,
				visited,
				foundWords,
				currentNode
			);
		}

		visited[row][col] = false;
		path.pop();
	}

	getDictionarySize(): number {
		return this.trie.size();
	}
}

let weightedLetterPool = '';
let solverPromise: Promise<BoggleSolver> | null = null;

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

function buildStats(words: FoundWord[]): BoggleStats {
	return {
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
}

export async function loadBoggleSolver(): Promise<BoggleSolver> {
	if (!solverPromise) {
		solverPromise = fetch('/dictionary.txt')
			.then(async (response) => {
				if (!response.ok) {
					throw new Error(`Failed to load dictionary: ${response.status}`);
				}
				return response.text();
			})
			.then((content) => {
				const words = content
					.split('\n')
					.map((word) => word.trim().toUpperCase())
					.filter((word) => word.length >= 3 && word.length <= 15 && /^[A-Z]+$/.test(word));
				return new BoggleSolver(words, 3);
			});
	}

	return solverPromise;
}

export function generateRandomBoggleBoard(size: number, diceType: DiceType): string {
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
		if (vowels.includes(letter)) {
			vowelCount += 1;
		}
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

export async function solveBoggleBoard(letters: string, size: number): Promise<BoggleSolveResult> {
	const solver = await loadBoggleSolver();
	const sanitizedLetters = letters.toUpperCase().replace(/[^A-Z]/g, '');
	const board = parseBoard(sanitizedLetters, size);
	const words = solver.solve(board);

	return {
		success: true,
		board,
		letters: sanitizedLetters,
		size,
		words,
		stats: buildStats(words),
		dictionarySize: solver.getDictionarySize()
	};
}
