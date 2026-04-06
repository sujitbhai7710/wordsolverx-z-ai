import type { AnalyzerColor, ParsedAnalyzerShareState } from './types';

const ANALYZER_ALPHABET = [...'abcdefghijklmnopqrstuvwxyz'];
const ANALYZER_ALPHABET_INDEX = Object.fromEntries(
	ANALYZER_ALPHABET.map((letter, index) => [letter, index])
) as Record<string, number>;

function createSeededRandom(seed: number) {
	let value = seed | 0;

	return () => {
		value = (value + 1831565813) | 0;
		let mixed = Math.imul(value ^ (value >>> 15), 1 | value);
		mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
		return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
	};
}

function shuffleAlphabet(seed: number) {
	const random = createSeededRandom(seed);
	const shuffled = [...ANALYZER_ALPHABET];

	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(random() * (index + 1));
		[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
	}

	return shuffled;
}

function encodeWordSequence(seed: number, raw: string) {
	const shuffled = shuffleAlphabet(seed);

	return [...raw]
		.map(
			(letter, index) =>
				shuffled[(ANALYZER_ALPHABET_INDEX[letter] + index) % shuffled.length]
		)
		.join('');
}

function decodeWordSequence(seed: number, encoded: string) {
	const shuffled = shuffleAlphabet(seed);
	const shuffledIndex = Object.fromEntries(
		shuffled.map((letter, index) => [letter, index])
	) as Record<string, number>;
	const paddedLength = Math.ceil(encoded.length / shuffled.length) * shuffled.length;

	return [...encoded]
		.map(
			(letter, index) =>
				ANALYZER_ALPHABET[
					(shuffledIndex[letter] - index + paddedLength) % shuffled.length
				]
		)
		.join('');
}

export function buildAnalyzerSearchParams(enteredWords: string[], hardMode: boolean) {
	const seed = Math.floor(Math.random() * 100);
	const encoded = encodeWordSequence(seed, enteredWords.join(''));
	const params = new URLSearchParams();

	params.set('seed', String(seed));
	params.set('guesses', encoded);
	if (hardMode) {
		params.set('hm', '1');
	}

	return params;
}

export function parseAnalyzerSearchParams(
	searchParams: URLSearchParams
): ParsedAnalyzerShareState | null {
	const encoded = searchParams.get('guesses');
	if (!encoded) {
		return null;
	}

	const seed = Number(searchParams.get('seed'));
	if (!Number.isInteger(seed) || seed < 0 || !/^[a-z]+$/.test(encoded)) {
		return null;
	}

	const decoded = decodeWordSequence(seed, encoded);
	if (!decoded || decoded.length % 5 !== 0) {
		return null;
	}

	const enteredWords = Array.from({ length: decoded.length / 5 }, (_, index) =>
		decoded.slice(index * 5, index * 5 + 5)
	);

	if (enteredWords.length < 2 || enteredWords.length > 7) {
		return null;
	}

	const answer = enteredWords.at(-1);
	if (!answer) {
		return null;
	}

	return {
		enteredWords,
		guesses: enteredWords.slice(0, -1),
		answer,
		hardMode: searchParams.get('hm') === '1'
	};
}

export function buildAnalyzerShareText(
	colorRows: AnalyzerColor[][],
	solved: boolean,
	shareUrl: string
) {
	const emojiMap: Record<AnalyzerColor, string> = {
		a: '\u2b1c',
		p: '\ud83d\udfe8',
		c: '\ud83d\udfe9'
	};

	const header = `Wordle ${solved ? colorRows.length : 'X'}/6`;
	const rows = colorRows.map((row) => row.map((color) => emojiMap[color]).join(''));

	return [header, '', ...rows, '', shareUrl].join('\n');
}
