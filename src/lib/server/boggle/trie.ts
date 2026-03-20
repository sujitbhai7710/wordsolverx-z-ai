export class TrieNode {
	children: Map<string, TrieNode>;
	isWord: boolean;

	constructor() {
		this.children = new Map();
		this.isWord = false;
	}
}

export class Trie {
	root: TrieNode;
	private wordCount: number;

	constructor() {
		this.root = new TrieNode();
		this.wordCount = 0;
	}

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

	search(word: string): boolean {
		const node = this.findNode(word);
		return node?.isWord ?? false;
	}

	startsWith(prefix: string): boolean {
		return this.findNode(prefix) !== null;
	}

	findNode(prefix: string): TrieNode | null {
		const normalizedPrefix = prefix.toUpperCase();
		let node = this.root;

		for (const char of normalizedPrefix) {
			if (!node.children.has(char)) {
				return null;
			}
			node = node.children.get(char)!;
		}

		return node;
	}

	size(): number {
		return this.wordCount;
	}

	clear(): void {
		this.root = new TrieNode();
		this.wordCount = 0;
	}
}
