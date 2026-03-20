import { Trie, TrieNode } from '$lib/server/boggle/trie';

interface Position {
	row: number;
	col: number;
}

export interface FoundWord {
	word: string;
	path: Position[];
	score: number;
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

function calculateScore(wordLength: number): number {
	if (wordLength < 3) return 0;
	return BOGGLE_SCORES[wordLength] ?? BIG_BOARD_SCORES[wordLength] ?? 50 + (wordLength - 16) * 5;
}

export class BoggleSolver {
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
