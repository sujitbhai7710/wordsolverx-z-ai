import {
	generateFAQSchema,
	generateHowToSchema,
	generateSoftwareApplicationSchema,
	generateWebPageSchema
} from '$lib/seo';
import {
	getBestLengthForWordlebotGame,
	getWordlebotGame,
	WORDLEBOT_GAMES
} from './game-config';
import {
	getCanucklePagePath,
	getGameForVariantRoute,
	getWordleLengthSolverPath,
	WORDLEBOT_WORDLE_SOLVER_LENGTHS,
	type WordlebotVariantRouteSlug
} from './routes';
import type { WordlebotGameConfig, WordlebotPageConfig } from './types';

function sentenceCaseGame(game: WordlebotGameConfig) {
	return game.slug === 'w-peaks' ? 'Wordle Peaks' : game.name;
}

function getBoardLabel(game: WordlebotGameConfig) {
	return `${game.boards} board${game.boards === 1 ? '' : 's'}`;
}

function getLengthLabel(game: WordlebotGameConfig, wordLength?: number) {
	if (game.slug === 'wordle' && wordLength) {
		return `${wordLength} letters`;
	}

	if (game.lengths.length === 1) {
		return `${game.lengths[0]} letters`;
	}

	return `${Math.min(...game.lengths)}-${Math.max(...game.lengths)} letters`;
}

function buildSolverFaqs(game: WordlebotGameConfig, wordLength?: number) {
	const title = sentenceCaseGame(game);
	const lengthAnswer =
		game.slug === 'wordle' && wordLength
			? `This page is dedicated to ${wordLength}-letter Wordle boards, so it opens directly into the ${wordLength}-letter solver instead of making you switch lengths first.`
			: game.lengths.length > 1
				? `Yes. The page includes a built-in length selector, so you can move between ${Math.min(...game.lengths)} and ${Math.max(...game.lengths)} letters without leaving the same solver family.`
				: `This solver is locked to ${game.lengths[0]} letters because that is the only format this game supports.`;

	const feedbackAnswer =
		game.feedback === 'woodle'
			? 'Add your guess, then choose how many letters are exact matches and how many are misplaced. The solver uses the same Woodle feedback model as the reference WASM project.'
			: game.feedback === 'warmle'
				? 'Add your guess, then tap each tile to match Warmle feedback. Yellow means the answer letter is alphabetically nearby, and the solver also lets you adjust the Warmle distance setting.'
				: game.feedback === 'peaks'
					? 'Add your guess, then tap each tile until it matches the game. In Wordle Peaks, gray means the answer letter comes earlier alphabetically, while yellow means it comes later.'
					: game.feedback === 'xordle'
						? 'Add your guess, then tap each merged clue tile to match the Xordle response. The solver keeps the exact merged-feedback logic from the standalone WASM version.'
						: game.slug === 'fibble'
							? "Enter the guess you played, then tap each tile to match the Fibble clue pattern. The solver keeps Fibble's lie-aware logic from the original project."
							: game.slug === 'hardle'
								? 'Enter the guess and tap the clue tiles until they match Hardle. This version preserves the Hardle clue-swapping behavior from the original WASM solver.'
								: game.slug === 'spotle'
									? 'Enter the guess and tap tiles through gray, green, yellow, and blank states. The solver uses the same four-state Spotle logic as the reference app.'
									: 'Enter the guess you used in the game, then tap each tile until it matches the feedback you saw. The solver uses the same standalone WASM logic as the reference project.';

	return [
		{
			question: `Does this ${title} page use the standalone WASM solver logic?`,
			answer:
				'Yes. The page loads the same per-length WebAssembly solver files from the reference WordleBot WASM project, so scoring, filtering, and candidate lists stay aligned.'
		},
		{
			question: `How do I enter feedback for ${title}?`,
			answer: feedbackAnswer
		},
		{
			question: `Can I change the word length on this ${title} page?`,
			answer: lengthAnswer
		}
	];
}

function buildSolverSections(game: WordlebotGameConfig, wordLength?: number) {
	const title = sentenceCaseGame(game);
	const boardLine =
		game.boards > 1
			? `${title} asks you to solve ${game.boards} linked boards with the same guesses, so good suggestions need to balance information across every unsolved grid.`
			: `${title} still rewards efficient information gathering, but the solver does the heavy filtering work for you once you match the clue pattern correctly.`;

	const lengthLine =
		game.slug === 'wordle' && wordLength
			? `${wordLength}-letter Wordle boards have a very different answer space from the classic 5-letter version, so this dedicated page skips the extra setup and loads straight into the correct WASM build.`
			: `This page keeps the same fast-loading structure as the reference app, including separate WASM bundles for each supported word length so only the logic you need has to load.`;

	return [
		{
			title: `How this ${title} solver works`,
			paragraphs: [
				`This ${title} solver narrows the answer list by replaying your guesses against the same rules the puzzle uses. Once you add a guess and match the clue feedback, the page filters the remaining candidates and ranks the strongest next plays.`,
				boardLine
			]
		},
		{
			title: `Why this page is faster than a generic helper`,
			paragraphs: [
				lengthLine,
				'Each route loads the matching WASM bundle on demand, which keeps the initial payload smaller and interactions responsive on mobile and desktop.'
			]
		}
	];
}

function buildSolverKeywords(game: WordlebotGameConfig, wordLength?: number) {
	const base = sentenceCaseGame(game).toLowerCase();

	if (game.slug === 'wordle' && wordLength) {
		return [
			`${wordLength} letter wordle solver`,
			`${wordLength} letter wordle helper`,
			`${wordLength} letter wordle answer finder`,
			'wordle wasm solver',
			'wordsolverx wordle solver'
		];
	}

	if (game.slug === 'spotle') {
		return [
			'spotle wordle solver',
			'spotle word game solver',
			'spotle wasm solver',
			'blank clue wordle solver',
			'wordsolverx spotle wordle'
		];
	}

	return [
		`${base} solver`,
		`${base} helper`,
		`${base} answer finder`,
		`${base} wasm solver`,
		`wordsolverx ${base}`
	];
}

function buildSolverChips(game: WordlebotGameConfig, wordLength?: number) {
	return ['WASM solver', getBoardLabel(game), getLengthLabel(game, wordLength)];
}

export function getWordleLengthPageConfig(wordLength: number): WordlebotPageConfig {
	const game = getWordlebotGame('wordle');
	const pageUrl = `https://wordsolver.tech${getWordleLengthSolverPath(wordLength)}`;
	const title = `${wordLength}-Letter Wordle Solver`;
	const description = `Use the ${wordLength}-letter Wordle solver with the standalone WASM logic from the reference project, fast clue filtering, and direct next-guess suggestions.`;

	return {
		appConfig: { pageType: 'solver', game: 'wordle', wordLength },
		title,
		eyebrow: 'Dedicated WASM word-length solver',
		description,
		pageUrl,
		keywords: buildSolverKeywords(game, wordLength),
		faqTitle: `${title} FAQs`,
		faqs: buildSolverFaqs(game, wordLength),
		howToTitle: `How to use the ${wordLength}-letter Wordle solver`,
		howToSteps: [
			{ name: 'Enter the guess you played', text: `Type the ${wordLength}-letter guess you used in Wordle.` },
			{ name: 'Match the tile colors', text: 'Tap each tile until it matches the gray, yellow, or green clue from the game.' },
			{ name: 'Review the next suggestions', text: 'Run the solver to see the strongest next words and the remaining likely answers.' }
		],
		sections: buildSolverSections(game, wordLength),
		chips: buildSolverChips(game, wordLength),
		cta: {
			label: 'Open classic Wordle solver',
			href: '/wordle-solver'
		}
	};
}

export function getVariantSolverPageConfig(variant: WordlebotVariantRouteSlug): WordlebotPageConfig {
	const gameSlug = getGameForVariantRoute(variant);
	const game = getWordlebotGame(gameSlug);
	const routePath = `/${variant}-solver`;
	const pageUrl = `https://wordsolver.tech${routePath}`;
	const title = game.slug === 'spotle' ? 'Spotle Wordle Solver' : `${sentenceCaseGame(game)} Solver`;
	const description =
		game.slug === 'canuckle'
			? 'Use the dedicated Canuckle WASM solver with the original Canadian answer bank, fast next-guess suggestions, and the same logic as the reference app.'
			: game.slug === 'spotle'
				? 'Use the Spotle Wordle solver with the reference WASM logic, blank-clue support, and fast candidate filtering without replacing the existing music Spotle tools.'
				: `Use the ${sentenceCaseGame(game)} solver with the standalone WASM logic from the reference project, built-in length switching, and fast next-guess suggestions.`;

	const cta =
		game.slug === 'canuckle'
			? { label: 'See Canuckle today', href: getCanucklePagePath('today') }
			: game.slug === 'quordle'
				? { label: 'View Quordle today', href: '/quordle-answer-today' }
				: undefined;

	return {
		appConfig: { pageType: 'solver', game: game.slug, wordLength: getBestLengthForWordlebotGame(game.slug, 5) },
		title,
		eyebrow: game.boards > 1 ? 'Multi-board WASM solver' : 'Standalone WASM puzzle solver',
		description,
		pageUrl,
		keywords: buildSolverKeywords(game),
		faqTitle: `${title} FAQs`,
		faqs: buildSolverFaqs(game),
		howToTitle: `How to use the ${title.toLowerCase()}`,
		howToSteps: [
			{ name: 'Add the guess you played', text: 'Enter the word you used in the game before setting any feedback.' },
			{ name: 'Match every board or clue state', text: 'Tap each tile or count selector until the board matches the feedback you saw in the game.' },
			{ name: 'Calculate the next move', text: 'Run the solver to see the best next guesses and the remaining likely answers.' }
		],
		sections: buildSolverSections(game),
		chips: buildSolverChips(game),
		cta
	};
}

export function getCanuckleTodayPageConfig(): WordlebotPageConfig {
	return {
		appConfig: { pageType: 'canuckle-daily' },
		title: 'Canuckle Today',
		eyebrow: 'Daily Canadian word game page',
		description:
			"Check today's Canuckle puzzle number, reveal the answer when you need it, and use the same date logic as the optimized reference app.",
		pageUrl: 'https://wordsolver.tech/canuckle',
		keywords: ['canuckle today', 'canuckle answer today', 'canuckle puzzle today', 'canuckle solver', 'wordsolverx canuckle'],
		faqTitle: 'Canuckle Today FAQs',
		faqs: [
			{
				question: 'How is the Canuckle today page calculated?',
				answer:
					'This page uses the same Canuckle schedule logic as the reference app, including the original 2022 launch window and the restarted daily sequence.'
			},
			{
				question: 'Can I open the Canuckle solver from here?',
				answer:
					'Yes. The page links straight to the dedicated Canuckle solver, which uses the separate Canuckle WebAssembly build and curated answer bank.'
			},
			{
				question: 'Does this page also link to the Canuckle archive?',
				answer:
					"Yes. You can move from today's puzzle to the archive page to browse earlier Canuckle answers, facts, and puzzle numbers."
			}
		],
		howToTitle: 'How to use the Canuckle today page',
		howToSteps: [
			{ name: 'Check the live puzzle number', text: "Use the page to confirm today's Canuckle index and date." },
			{ name: 'Reveal the answer if needed', text: 'Open the answer panel only when you want to see the solution.' },
			{ name: 'Jump into the solver or archive', text: 'Use the built-in links to continue with the Canuckle solver or archive.' }
		],
		sections: [
			{
				title: 'What this Canuckle page includes',
				paragraphs: [
					'The Canuckle today page is built for fast lookups. It shows the current puzzle number, the matching date, and the Canadian trivia fact attached to that puzzle.',
					'Because it uses the same schedule math as the reference site, the page stays aligned with the public Canuckle date sequence instead of relying on a generic daily rollover.'
				]
			},
			{
				title: 'Where to go next',
				paragraphs: [
					'If you want help solving the board, open the dedicated Canuckle solver. That page uses the separate Canuckle WASM bundle and the curated Canuckle answer bank.',
					'If you are checking older puzzles, the Canuckle archive page lets you browse past answers and facts without leaving WordSolverX.'
				]
			}
		],
		chips: ['Today page', 'Fast lookup', 'Canuckle schedule'],
		cta: {
			label: 'Open Canuckle solver',
			href: getCanucklePagePath('solver')
		}
	};
}

export function getCanuckleArchivePageConfig(): WordlebotPageConfig {
	return {
		appConfig: { pageType: 'canuckle-archive' },
		title: 'Canuckle Archive',
		eyebrow: 'Search past Canuckle puzzles',
		description:
			'Browse the Canuckle archive with puzzle numbers, dates, answers, and trivia facts using the same optimized data flow as the reference app.',
		pageUrl: 'https://wordsolver.tech/canuckle-archive',
		keywords: ['canuckle archive', 'canuckle answers', 'past canuckle puzzles', 'canuckle history', 'wordsolverx canuckle archive'],
		faqTitle: 'Canuckle Archive FAQs',
		faqs: [
			{
				question: 'Can I search old Canuckle answers here?',
				answer:
					'Yes. The archive includes searchable puzzle numbers, dates, answers, and facts so you can find older Canuckle entries quickly.'
			},
			{
				question: 'Is this archive tied to the same source data as the solver?',
				answer:
					'Yes. The archive and solver use the same Canuckle dataset, which keeps the answers, dates, and visible puzzle range in sync.'
			},
			{
				question: 'Can I jump from the archive to the Canuckle solver?',
				answer:
					'Yes. Every archive view keeps the solver one click away so you can move from research to solving without opening a separate toolset.'
			}
		],
		howToTitle: 'How to use the Canuckle archive',
		howToSteps: [
			{ name: 'Search by answer or date', text: 'Use the archive search box to filter by puzzle number, date, answer, or fact text.' },
			{ name: 'Open any archived entry', text: 'Expand a puzzle card to read the full Canuckle fact and answer details.' },
			{ name: 'Switch to the solver when needed', text: 'Move straight into the Canuckle solver when you want live solving help.' }
		],
		sections: [
			{
				title: 'A faster Canuckle archive',
				paragraphs: [
					'This archive is designed for quick scanning and search. Instead of loading a heavy calendar widget first, it renders a searchable list of archived Canuckle puzzles with incremental loading.',
					'That keeps the page lighter for Google and for users who only want to confirm a previous answer or fact.'
				]
			},
			{
				title: 'Why the archive matters for puzzle players',
				paragraphs: [
					'Past Canuckle answers help you avoid repeats, verify older trivia facts, and revisit themed Canadian words from earlier puzzles.',
					'Because this archive sits alongside the dedicated today and solver pages, it also creates a cleaner path for both users and crawlers to move through the full Canuckle experience.'
				]
			}
		],
		chips: ['Archive page', 'Searchable answers', 'Optimized load'],
		cta: {
			label: 'Open Canuckle today',
			href: getCanucklePagePath('today')
		}
	};
}

export function getWordlebotStructuredData(config: WordlebotPageConfig) {
	return JSON.stringify([
		generateFAQSchema(config.faqs),
		generateHowToSchema(config.howToTitle, config.howToSteps),
		generateSoftwareApplicationSchema(config.title, 'GameApplication'),
		generateWebPageSchema(config.title, config.description, config.pageUrl)
	]);
}

export function getWordlebotGameIndexLinks() {
	return WORDLEBOT_GAMES.map((game) => {
		if (game.slug === 'wordle') {
			return WORDLEBOT_WORDLE_SOLVER_LENGTHS.map((length) => ({
				name: `${length}-Letter Wordle Solver`,
				href: getWordleLengthSolverPath(length)
			}));
		}

		if (game.slug === 'spotle') {
			return [{ name: 'Spotle Wordle Solver', href: '/spotle-wordle-solver' }];
		}

		if (game.slug === 'canuckle') {
			return [
				{ name: 'Canuckle Today', href: getCanucklePagePath('today') },
				{ name: 'Canuckle Archive', href: getCanucklePagePath('archive') },
				{ name: 'Canuckle Solver', href: getCanucklePagePath('solver') }
			];
		}

		return [
			{
				name: `${sentenceCaseGame(game)} Solver`,
				href: `/${game.slug}-solver`
			}
		];
	}).flat();
}
