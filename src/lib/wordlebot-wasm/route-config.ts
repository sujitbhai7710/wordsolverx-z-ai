import {
	generateCollectionPageSchema,
	generateFAQSchema,
	generateHowToSchema,
	generateSoftwareApplicationSchema,
	generateWebPageSchema
} from '$lib/seo';
import { getMainDailyDate, getMainDailyDateKey, getMainDailyDateLabel } from '$lib/main-daily-date';
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
			? `This page opens directly into the ${wordLength}-letter Wordle solver, so you can start filtering answers right away without changing settings first.`
			: game.lengths.length > 1
				? `Yes. This solver keeps the built-in length switcher for ${Math.min(...game.lengths)} to ${Math.max(...game.lengths)} letter boards on the same page.`
				: `This solver only supports ${game.lengths[0]} letters because that is the only format this puzzle uses.`;

	const feedbackAnswer =
		game.feedback === 'woodle'
			? 'Add your guess, then set how many letters are exact matches and how many are misplaced. The solver filters the answer list using those totals.'
			: game.feedback === 'warmle'
				? 'Add your guess, then tap each tile to match Warmle feedback. Yellow means the answer letter is alphabetically close, and you can also change the Warmle distance setting.'
				: game.feedback === 'peaks'
					? 'Add your guess, then tap tiles until they match the game. In Wordle Peaks, gray means the target letter comes earlier alphabetically and yellow means it comes later.'
					: game.feedback === 'xordle'
						? 'Add your guess, then tap each merged clue tile so the board matches the Xordle feedback you saw in the game.'
						: game.slug === 'fibble'
							? "Enter the guess you played, then tap each tile to match Fibble's clue pattern. The solver keeps the lie-aware filtering used in Fibble."
							: game.slug === 'hardle'
								? 'Enter the guess and tap the clue tiles until they match Hardle. This solver keeps Hardle’s green and yellow clue behavior.'
								: game.slug === 'spotle'
									? 'Enter the guess and tap each tile through gray, green, yellow, and blank states until the feedback matches your game.'
									: 'Enter the guess you used, then tap each tile until the colors match the puzzle feedback. The solver instantly filters the remaining answers and ranks strong next plays.';

	return [
		{
			question: `How does this ${title} solver work?`,
			answer:
				'The solver replays your guesses against the same rules as the puzzle, removes impossible answers, and ranks the best next words from the remaining candidate list.'
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
			? `${title} asks you to solve ${game.boards} linked boards with the same guesses, so strong suggestions need to gather information across every unsolved grid instead of helping only one board.`
			: `${title} still rewards efficient information gathering, but the solver handles the filtering work as soon as you match the clue pattern correctly.`;

	const lengthLine =
		game.slug === 'wordle' && wordLength
			? `${wordLength}-letter Wordle boards have a very different answer pool from classic 5-letter Wordle, so this dedicated page loads straight into the right solver and keeps the clues focused on that exact length.`
			: `This page loads the matching solver bundle for the puzzle and word length you actually need, which keeps the page fast on mobile and desktop.`;

	return [
		{
			title: `How this ${title} solver helps`,
			paragraphs: [
				`This ${title} solver narrows the answer list by applying your guesses to the puzzle’s rules, then ranking the next plays that should reveal the most useful information.`,
				boardLine
			]
		},
		{
			title: `Why this page stays quick`,
			paragraphs: [
				lengthLine,
				'Only the matching game logic and interface load for each route, which keeps the experience cleaner and more responsive than a one-size-fits-all helper.'
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
			`${wordLength} letter word finder`,
			'wordsolverx wordle solver'
		];
	}

	if (game.slug === 'spotle') {
		return [
			'spotle wordle solver',
			'spotle word game solver',
			'blank clue wordle solver',
			'spotle answer helper',
			'wordsolverx spotle wordle'
		];
	}

	return [
		`${base} solver`,
		`${base} helper`,
		`${base} answer finder`,
		`${base} clue solver`,
		`wordsolverx ${base}`
	];
}

function buildSolverChips(game: WordlebotGameConfig, wordLength?: number) {
	if (game.slug === 'wordle' && wordLength) {
		return [`${wordLength} letters`, 'Hard mode', 'Fast clue filtering'];
	}

	return [getBoardLabel(game), getLengthLabel(game, wordLength), 'Ranked next guesses'];
}

export function getWordleLengthPageConfig(wordLength: number): WordlebotPageConfig {
	const game = getWordlebotGame('wordle');
	const pageUrl = `https://wordsolver.tech${getWordleLengthSolverPath(wordLength)}`;
	const title = `${wordLength}-Letter Wordle Solver`;
	const description = `Use the ${wordLength}-letter Wordle solver to filter clues, rank next guesses, and solve custom-length Wordle boards faster.`;

	return {
		appConfig: { pageType: 'solver', game: 'wordle', wordLength },
		title,
		eyebrow: 'Wordle solver by word length',
		description,
		pageUrl,
		keywords: buildSolverKeywords(game, wordLength),
		faqTitle: `${title} FAQs`,
		faqs: buildSolverFaqs(game, wordLength),
		howToTitle: `How to use the ${wordLength}-letter Wordle solver`,
		howToSteps: [
			{ name: 'Type your guess', text: `Enter the ${wordLength}-letter word you played in Wordle.` },
			{ name: 'Match the clue colors', text: 'Tap each tile until it matches the gray, yellow, or green result from your game.' },
			{ name: 'Review the ranked answers', text: 'Run the solver to see the best next guesses and the most likely remaining answers.' }
		],
		sections: buildSolverSections(game, wordLength),
		chips: buildSolverChips(game, wordLength),
		cta:
			wordLength === 5
				? {
						label: 'See Wordle answer today',
						href: '/wordle-answer-today'
					}
				: {
						label: 'Open 5-letter Wordle solver',
						href: getWordleLengthSolverPath(5)
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
			? 'Use the Canuckle solver to filter the Canadian answer list, rank strong next guesses, and move quickly between the answer today, archive, and solver pages.'
			: game.slug === 'spotle'
				? 'Use the Spotle Wordle solver with blank-clue support, fast candidate filtering, and dedicated next-guess ranking.'
				: `Use the ${sentenceCaseGame(game)} solver with built-in clue matching, length switching where available, and fast next-guess suggestions.`;

	const cta =
		game.slug === 'canuckle'
			? { label: 'See Canuckle answer today', href: getCanucklePagePath('today') }
			: game.slug === 'quordle'
				? { label: 'View Quordle answer today', href: '/quordle-answer-today' }
				: undefined;

	return {
		appConfig: {
			pageType: 'solver',
			game: game.slug,
			wordLength: getBestLengthForWordlebotGame(game.slug, 5)
		},
		title,
		eyebrow: game.boards > 1 ? 'Multi-board puzzle solver' : 'Interactive puzzle solver',
		description,
		pageUrl,
		keywords: buildSolverKeywords(game),
		faqTitle: `${title} FAQs`,
		faqs: buildSolverFaqs(game),
		howToTitle: `How to use the ${title.toLowerCase()}`,
		howToSteps: [
			{ name: 'Add the guess you played', text: 'Enter the word you used before setting any clue feedback.' },
			{ name: 'Match every board or clue state', text: 'Tap each tile or count selector until the board matches the result you saw in the game.' },
			{ name: 'Calculate the next move', text: 'Run the solver to see the strongest next guesses and the remaining likely answers.' }
		],
		sections: buildSolverSections(game),
		chips: buildSolverChips(game),
		cta
	};
}

export function getCanuckleTodayPageConfig(): WordlebotPageConfig {
	const targetDate = getMainDailyDate();
	const visibleDateKey = getMainDailyDateKey(targetDate);
	const displayDate = getMainDailyDateLabel(targetDate);
	const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(targetDate);

	return {
		appConfig: { pageType: 'canuckle-daily', visibleDateKey },
		title: 'Canuckle Answer Today',
		displayTitle: `Canuckle Answer Today (${displayDate})`,
		metaTitle: `Canuckle Answer Today - ${currentMonth} - Updated`,
		eyebrow: 'Daily Canuckle answer, fact, and puzzle number',
		description:
			"See the Canuckle answer today, check the current puzzle number, and read the matching Canadian fact with quick links to the archive and solver.",
		pageUrl: `https://wordsolver.tech${getCanucklePagePath('today')}`,
		keywords: [
			'canuckle answer today',
			'canuckle today',
			'canuckle puzzle today',
			'canuckle hint today',
			'wordsolverx canuckle'
		],
		faqTitle: 'Canuckle Answer Today FAQs',
		faqs: [
			{
				question: 'How is the Canuckle answer today page calculated?',
				answer:
					'This page follows the same Canuckle date schedule as the live game, including the original 2022 launch window and the restarted daily sequence.'
			},
			{
				question: 'Can I move from Canuckle today to the solver?',
				answer:
					'Yes. The Canuckle solver is linked directly from this page so you can go from the answer today view to clue-based solving in one click.'
			},
			{
				question: 'Does the Canuckle answer today page also link to the archive?',
				answer:
					'Yes. You can switch from today’s answer to the Canuckle archive to review older puzzle numbers, dates, answers, and facts.'
			}
		],
		howToTitle: 'How to use the Canuckle answer today page',
		howToSteps: [
			{ name: 'Check the puzzle number', text: "Use the page to confirm today's Canuckle index and date." },
			{ name: 'Reveal the answer when needed', text: 'Open the answer panel only when you want to see the current solution.' },
			{ name: 'Jump to the archive or solver', text: 'Use the page tabs to move between the Canuckle archive and solver quickly.' }
		],
		sections: [
			{
				title: 'What you get on this Canuckle answer today page',
				paragraphs: [
					'This page is built for fast daily lookup. It highlights the live Canuckle puzzle number, the matching date, and the Canadian fact tied to that answer.',
					'Because the answer today route is separated from the solver and archive, it is easier for both users and search engines to understand what the page is for.'
				]
			},
			{
				title: 'Where to go after checking today’s answer',
				paragraphs: [
					'Open the Canuckle solver if you want clue-based help instead of a direct reveal. That page lets you enter guesses, mark feedback, and narrow the answer list quickly.',
					'If you are researching earlier puzzles, the Canuckle archive gives you a searchable history of dates, answers, and facts without leaving WordSolverX.'
				]
			}
		],
		chips: ['Answer today', 'Daily fact', 'Puzzle number'],
		cta: {
			label: 'Browse Canuckle archive',
			href: getCanucklePagePath('archive')
		}
	};
}

export function getCanuckleArchivePageConfig(): WordlebotPageConfig {
	const visibleDateKey = getMainDailyDateKey();

	return {
		appConfig: { pageType: 'canuckle-archive', visibleDateKey },
		title: 'Canuckle Archive',
		eyebrow: 'Search past Canuckle answers by date or puzzle number',
		description:
			'Browse the Canuckle archive with puzzle numbers, dates, answers, and Canadian facts in one searchable page built for quick lookups.',
		pageUrl: 'https://wordsolver.tech/canuckle-archive',
		keywords: [
			'canuckle archive',
			'canuckle answers',
			'past canuckle puzzles',
			'canuckle answer history',
			'wordsolverx canuckle archive'
		],
		faqTitle: 'Canuckle Archive FAQs',
		faqs: [
			{
				question: 'Can I search old Canuckle answers here?',
				answer:
					'Yes. The Canuckle archive lets you search by puzzle number, date, answer, or fact text so you can find earlier entries quickly.'
			},
			{
				question: 'Does this page include the full Canuckle answer history?',
				answer:
					'The archive covers the visible Canuckle puzzle range available from the current dataset, including dates, answers, and facts for each indexed puzzle.'
			},
			{
				question: 'Can I jump from the archive to the Canuckle solver?',
				answer:
					'Yes. The archive keeps the Canuckle solver and answer today page close by so you can move between research and solving without opening a separate tool.'
			}
		],
		howToTitle: 'How to use the Canuckle archive',
		howToSteps: [
			{ name: 'Search by date or answer', text: 'Use the archive search box to filter by puzzle number, date, answer, or fact text.' },
			{ name: 'Open any archive entry', text: 'Expand a puzzle card to read the full Canuckle fact, answer, and available distribution details.' },
			{ name: 'Switch to today or the solver', text: 'Use the top tabs to move between the live answer page and the Canuckle solver when needed.' }
		],
		sections: [
			{
				title: 'Why the Canuckle archive matters',
				paragraphs: [
					'Past Canuckle answers help you avoid repeats, confirm puzzle dates, and revisit older Canadian facts without digging through daily posts one by one.',
					'Keeping the archive on a permanent route also gives Google a clearer archive destination than a long list of thin date pages.'
				]
			},
			{
				title: 'What makes this archive easy to use',
				paragraphs: [
					'The page loads into a searchable list so you can scan large sections of Canuckle history quickly on desktop or mobile.',
					'Because the archive lives alongside the dedicated answer today and solver routes, the full Canuckle section now has a cleaner internal-linking structure for both users and crawlers.'
				]
			}
		],
		chips: ['Archive page', 'Searchable answers', 'Date lookup'],
		cta: {
			label: 'See Canuckle answer today',
			href: getCanucklePagePath('today')
		}
	};
}

export function getWordlebotStructuredData(config: WordlebotPageConfig) {
	if (config.appConfig.pageType === 'solver') {
		return JSON.stringify([
			generateFAQSchema(config.faqs),
			generateHowToSchema(config.howToTitle, config.howToSteps),
			generateSoftwareApplicationSchema(config.title, 'GameApplication'),
			generateWebPageSchema(config.title, config.description, config.pageUrl)
		]);
	}

	if (config.appConfig.pageType === 'canuckle-archive') {
		return JSON.stringify([
			generateCollectionPageSchema(config.title, config.description, config.pageUrl, [
				{
					name: 'Canuckle Answer Today',
					url: `https://wordsolver.tech${getCanucklePagePath('today')}`
				},
				{
					name: 'Canuckle Archive',
					url: `https://wordsolver.tech${getCanucklePagePath('archive')}`
				},
				{
					name: 'Canuckle Solver',
					url: `https://wordsolver.tech${getCanucklePagePath('solver')}`
				}
			]),
			generateFAQSchema(config.faqs),
			generateWebPageSchema(config.title, config.description, config.pageUrl)
		]);
	}

	return JSON.stringify([
		generateFAQSchema(config.faqs),
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
				{ name: 'Canuckle Answer Today', href: getCanucklePagePath('today') },
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
