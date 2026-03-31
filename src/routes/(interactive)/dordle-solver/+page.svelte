<script lang="ts">
	import FAQSection from '$lib/components/FAQSection.svelte';
	import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
	import {
		checkGuess,
		getBestGuesses,
		filterPossibleAnswers
	} from '$lib/dordle';
	import { ANSWER_WORDS, ALLOWED_WORDS } from '$lib/dordle-words';
	import {
		generateWebPageSchema,
		generateFAQSchema,
		generateHowToSchema,
		generateWebApplicationSchema
	} from '$lib/seo';

	type TileColor = 'gray' | 'yellow' | 'green';

	let board1Word = $state('');
	let board2Word = $state('');
	let board1Colors = $state<TileColor[]>(['gray', 'gray', 'gray', 'gray', 'gray']);
	let board2Colors = $state<TileColor[]>(['gray', 'gray', 'gray', 'gray', 'gray']);
	let board1Guesses = $state<Array<{ word: string; colors: TileColor[] }>>([]);
	let board2Guesses = $state<Array<{ word: string; colors: TileColor[] }>>([]);
	let suggestions = $state<Array<{ word: string; entropy: number; isPossibleAnswer: boolean }>>([]);
	let board1Possible = $state<string[]>([...ANSWER_WORDS]);
	let board2Possible = $state<string[]>([...ANSWER_WORDS]);
	let showSuggestions = $state(false);
	let isComputing = $state(false);
	let errorMessage = $state('');

	const colorCycle: TileColor[] = ['gray', 'yellow', 'green'];

	function cycleColor(colors: TileColor[], index: number): TileColor[] {
		const current = colors[index];
		const nextIndex = (colorCycle.indexOf(current) + 1) % colorCycle.length;
		const updated = [...colors];
		updated[index] = colorCycle[nextIndex];
		return updated;
	}

	function cycleBoard1Color(index: number) {
		board1Colors = cycleColor(board1Colors, index);
	}

	function cycleBoard2Color(index: number) {
		board2Colors = cycleColor(board2Colors, index);
	}

	function colorToNumber(c: TileColor): number {
		if (c === 'green') return 2;
		if (c === 'yellow') return 1;
		return 0;
	}

	function colorClass(c: TileColor): string {
		if (c === 'green') return 'bg-green-500 text-white border-green-600';
		if (c === 'yellow') return 'bg-yellow-400 text-white border-yellow-500';
		return 'bg-gray-400 text-white border-gray-500';
	}

	function addBoard1Guess() {
		const word = board1Word.toLowerCase().trim();
		if (word.length !== 5) {
			errorMessage = 'Please enter a 5-letter word for Board 1.';
			return;
		}
		errorMessage = '';
		board1Guesses = [...board1Guesses, { word, colors: [...board1Colors] }];
		const patterns = board1Guesses.map((g) => ({
			guess: g.word,
			pattern: g.colors.map(colorToNumber)
		}));
		board1Possible = filterPossibleAnswers(ANSWER_WORDS, patterns);
		board1Word = '';
		board1Colors = ['gray', 'gray', 'gray', 'gray', 'gray'];
	}

	function addBoard2Guess() {
		const word = board2Word.toLowerCase().trim();
		if (word.length !== 5) {
			errorMessage = 'Please enter a 5-letter word for Board 2.';
			return;
		}
		errorMessage = '';
		board2Guesses = [...board2Guesses, { word, colors: [...board2Colors] }];
		const patterns = board2Guesses.map((g) => ({
			guess: g.word,
			pattern: g.colors.map(colorToNumber)
		}));
		board2Possible = filterPossibleAnswers(ANSWER_WORDS, patterns);
		board2Word = '';
		board2Colors = ['gray', 'gray', 'gray', 'gray', 'gray'];
	}

	function removeBoard1Guess(index: number) {
		board1Guesses = board1Guesses.filter((_, i) => i !== index);
		const patterns = board1Guesses.map((g) => ({
			guess: g.word,
			pattern: g.colors.map(colorToNumber)
		}));
		board1Possible = filterPossibleAnswers(ANSWER_WORDS, patterns);
	}

	function removeBoard2Guess(index: number) {
		board2Guesses = board2Guesses.filter((_, i) => i !== index);
		const patterns = board2Guesses.map((g) => ({
			guess: g.word,
			pattern: g.colors.map(colorToNumber)
		}));
		board2Possible = filterPossibleAnswers(ANSWER_WORDS, patterns);
	}

	function getSuggestions() {
		isComputing = true;
		errorMessage = '';

		try {
			const combined = new Set([...board1Possible, ...board2Possible]);
			const allPossible = [...combined];

			const b1 = board1Possible.length <= board2Possible.length ? board1Possible : board2Possible;
			const pool = b1.length > 0 ? b1 : allPossible;

			suggestions = getBestGuesses(pool, [...ANSWER_WORDS, ...ALLOWED_WORDS], 10);
			showSuggestions = true;
		} catch {
			errorMessage = 'Error computing suggestions. Please try again.';
		} finally {
			isComputing = false;
		}
	}

	function resetAll() {
		board1Word = '';
		board2Word = '';
		board1Colors = ['gray', 'gray', 'gray', 'gray', 'gray'];
		board2Colors = ['gray', 'gray', 'gray', 'gray', 'gray'];
		board1Guesses = [];
		board2Guesses = [];
		board1Possible = [...ANSWER_WORDS];
		board2Possible = [...ANSWER_WORDS];
		suggestions = [];
		showSuggestions = false;
		errorMessage = '';
	}

	const faqs = [
		{
			question: 'What is Dordle?',
			answer:
				'Dordle is a word-guessing game where you solve two Wordle puzzles simultaneously. Each guess you make applies to both boards, and you have 7 tries to solve both words. It\'s a step up in difficulty from the original Wordle.'
		},
		{
			question: 'How does the Dordle Solver work?',
			answer:
				'Enter your guessed word for each board, then click each tile to set its color feedback (gray = absent, yellow = present but wrong position, green = correct). The solver filters possible answers and suggests optimal next guesses using entropy-based analysis.'
		},
		{
			question: 'What are the best starting words for Dordle?',
			answer:
				'Good starting words for Dordle use common letters like S, E, A, R, O, T. Words like "crane", "slate", "trace", or "soare" are popular choices because they cover frequently occurring letters across both boards.'
		}
	];

	const webPageSchema = generateWebPageSchema(
		'Dordle Solver - Free Dual Wordle Solver Tool',
		'Solve Dordle puzzles fast with our free dual-board solver. Enter your guesses and color feedback to get the best next word suggestions.',
		'https://wordsolver.tech/dordle-solver'
	);

	const faqSchema = generateFAQSchema(faqs);

	const howToSchema = generateHowToSchema('How to Use the Dordle Solver', [
		{
			name: 'Enter your guess',
			text: 'Type the 5-letter word you guessed in the Dordle game into the input field for Board 1 or Board 2.'
		},
		{
			name: 'Set tile colors',
			text: 'Click each tile to cycle through gray (absent), yellow (present), and green (correct) to match the feedback from the Dordle game.'
		},
		{
			name: 'Get suggestions',
			text: 'Click "Get Suggestions" to see the best next guesses ranked by information gain, helping you solve both boards efficiently.'
		}
	]);

	const webAppSchema = generateWebApplicationSchema(
		'Dordle Solver',
		'A free online tool that helps you solve Dordle puzzles by analyzing your guesses and suggesting optimal next words.'
	);

	const schemas = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [webPageSchema, faqSchema, howToSchema, webAppSchema]
	});
</script>

<svelte:head>
	<title>Dordle Solver - Free Dual Wordle Solver Tool | WordSolverX</title>
	<meta
		name="description"
		content="Solve Dordle puzzles fast with our free dual-board solver. Enter your guesses and color feedback to get optimal next word suggestions using entropy analysis."
	/>
	<meta
		name="keywords"
		content="dordle solver, dordle helper, dordle cheat, dual wordle solver, dordle word finder, dordle answer, solve dordle, dordle tool, dordle hints"
	/>
	<link rel="canonical" href="https://wordsolver.tech/dordle-solver" />
	<meta property="og:title" content="Dordle Solver - Free Dual Wordle Solver Tool | WordSolverX" />
	<meta
		property="og:description"
		content="Solve Dordle puzzles fast with our free dual-board solver. Enter guesses and get optimal next word suggestions."
	/>
	<meta property="og:url" content="https://wordsolver.tech/dordle-solver" />
	<meta property="og:site_name" content="WordSolverX" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Dordle Solver - Free Dual Wordle Solver Tool | WordSolverX" />
	<meta
		name="twitter:description"
		content="Solve Dordle puzzles fast with our free dual-board solver. Enter guesses and get optimal next word suggestions."
	/>
	{@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<div class="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen font-sans">
	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<!-- Hero -->
		<header class="text-center mb-12">
			<div
				class="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-400 text-sm font-semibold mb-4"
			>
				<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
				Free Solver Tool
			</div>
			<h1
				class="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6"
			>
				Dordle Solver
			</h1>
			<p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
				Solve both Dordle boards simultaneously. Enter your guesses, set color feedback, and get
				optimal next word suggestions.
			</p>
		</header>

		{#if errorMessage}
			<div
				class="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-red-700 dark:text-red-300 text-center"
			>
				{errorMessage}
			</div>
		{/if}

		<!-- Boards Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
			<!-- Board 1 -->
			<section
				class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6"
			>
				<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
					<span
						class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold"
						>1</span
					>
					Board 1
				</h2>
				<p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
					Possible answers: <span class="font-bold text-gray-900 dark:text-white"
						>{board1Possible.length}</span
					>
				</p>

				<!-- Previous guesses -->
				{#each board1Guesses as guess, gi}
					<div class="flex items-center gap-2 mb-3">
						<div class="flex gap-1">
							{#each guess.word.split('') as letter, li}
								<span
									class="w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm uppercase {colorClass(
										guess.colors[li]
									)}"
								>
									{letter}
								</span>
							{/each}
						</div>
						<button
							onclick={() => removeBoard1Guess(gi)}
							class="text-gray-400 hover:text-red-500 transition-colors"
							aria-label="Remove guess"
						>
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				{/each}

				<!-- Input row -->
				<div class="flex gap-2 mb-3">
					<input
						type="text"
						bind:value={board1Word}
						maxlength="5"
						placeholder="Enter guess"
						class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
						onkeydown={(e) => {
							if (e.key === 'Enter') addBoard1Guess();
						}}
					/>
					<button
						onclick={addBoard1Guess}
						class="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
					>
						Add
					</button>
				</div>

				<!-- Color tiles -->
				<div class="flex gap-2 justify-center">
					{#each board1Colors as color, i}
						<button
							onclick={() => cycleBoard1Color(i)}
							class="w-12 h-12 rounded-xl font-bold text-lg border-2 transition-all hover:scale-105 cursor-pointer {colorClass(color)}"
							aria-label="Tile {i + 1}: {color}"
						>
							{#if color === 'green'}G{:else if color === 'yellow'}Y{:else}B{/if}
						</button>
					{/each}
				</div>
			</section>

			<!-- Board 2 -->
			<section
				class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6"
			>
				<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
					<span
						class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold"
						>2</span
					>
					Board 2
				</h2>
				<p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
					Possible answers: <span class="font-bold text-gray-900 dark:text-white"
						>{board2Possible.length}</span
					>
				</p>

				<!-- Previous guesses -->
				{#each board2Guesses as guess, gi}
					<div class="flex items-center gap-2 mb-3">
						<div class="flex gap-1">
							{#each guess.word.split('') as letter, li}
								<span
									class="w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm uppercase {colorClass(
										guess.colors[li]
									)}"
								>
									{letter}
								</span>
							{/each}
						</div>
						<button
							onclick={() => removeBoard2Guess(gi)}
							class="text-gray-400 hover:text-red-500 transition-colors"
							aria-label="Remove guess"
						>
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				{/each}

				<!-- Input row -->
				<div class="flex gap-2 mb-3">
					<input
						type="text"
						bind:value={board2Word}
						maxlength="5"
						placeholder="Enter guess"
						class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
						onkeydown={(e) => {
							if (e.key === 'Enter') addBoard2Guess();
						}}
					/>
					<button
						onclick={addBoard2Guess}
						class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
					>
						Add
					</button>
				</div>

				<!-- Color tiles -->
				<div class="flex gap-2 justify-center">
					{#each board2Colors as color, i}
						<button
							onclick={() => cycleBoard2Color(i)}
							class="w-12 h-12 rounded-xl font-bold text-lg border-2 transition-all hover:scale-105 cursor-pointer {colorClass(color)}"
							aria-label="Tile {i + 1}: {color}"
						>
							{#if color === 'green'}G{:else if color === 'yellow'}Y{:else}B{/if}
						</button>
					{/each}
				</div>
			</section>
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-wrap justify-center gap-4 mb-8">
			<button
				onclick={getSuggestions}
				disabled={isComputing}
				class="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
			>
				{#if isComputing}
					<span class="inline-flex items-center gap-2">
						<svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
								fill="none"
							/>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						Computing...
					</span>
				{:else}
					Get Suggestions
				{/if}
			</button>
			<button
				onclick={resetAll}
				class="px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-lg transition-all"
			>
				Reset
			</button>
		</div>

		<!-- Suggestions -->
		{#if showSuggestions && suggestions.length > 0}
			<section
				class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 mb-12"
			>
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
					Best Guesses
				</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{#each suggestions as suggestion, i}
						<div
							class="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:border-green-300 dark:hover:border-green-600 transition-colors"
						>
							<div class="flex items-center gap-3">
								<span
									class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold"
									>{i + 1}</span
								>
								<span
									class="font-mono font-bold text-lg uppercase text-gray-900 dark:text-white tracking-wider"
									>{suggestion.word}</span
								>
								{#if suggestion.isPossibleAnswer}
									<span
										class="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full"
										>Answer</span
									>
								{/if}
							</div>
							<div class="text-right">
								<span class="text-sm text-gray-500 dark:text-gray-400">Score</span>
								<span class="block font-bold text-gray-900 dark:text-white"
									>{suggestion.entropy.toFixed(2)}</span
								>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- How to Use -->
		<section
			class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-12"
		>
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">How to Use the Dordle Solver</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div class="text-center p-6 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30">
					<div class="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
					<h3 class="font-bold text-gray-900 dark:text-white mb-2">Enter Your Guess</h3>
					<p class="text-gray-600 dark:text-gray-400 text-sm">Type the 5-letter word you guessed in Dordle into the input field for the corresponding board.</p>
				</div>
				<div class="text-center p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
					<div class="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
					<h3 class="font-bold text-gray-900 dark:text-white mb-2">Set Tile Colors</h3>
					<p class="text-gray-600 dark:text-gray-400 text-sm">Click each tile to cycle through gray (absent), yellow (present), and green (correct) to match the game feedback.</p>
				</div>
				<div class="text-center p-6 rounded-2xl bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800/30">
					<div class="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
					<h3 class="font-bold text-gray-900 dark:text-white mb-2">Get Suggestions</h3>
					<p class="text-gray-600 dark:text-gray-400 text-sm">Click "Get Suggestions" to see the best next guesses ranked by information gain across both boards.</p>
				</div>
			</div>
		</section>

		<!-- FAQ -->
		<FAQSection {faqs} />

		<!-- SEO Content -->
		<article class="mt-12 space-y-8">
			<section
				class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
			>
				<h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">What is Dordle?</h2>
				<p class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
					Dordle is a dual-word puzzle game that challenges you to solve two Wordle puzzles at the
					same time. Every guess you make is applied to both boards simultaneously, and you have 7
					attempts to crack both words. Created by Zairean, Dordle became an instant hit among word
					game enthusiasts who wanted more challenge than the original Wordle.
				</p>
				<p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
					The key difference from Wordle is that you must balance information gathering across two
					boards. A guess that reveals useful letters on one board might not help the other, so
					choosing your words strategically is essential. Our Dordle Solver helps you find the optimal
					next guess by analyzing both boards at once.
				</p>
			</section>

			<section
				class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
			>
				<h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
					Why Use a Dordle Solver?
				</h2>
				<div class="space-y-4 text-lg text-gray-600 dark:text-gray-300">
					<p class="leading-relaxed">
						Dordle is significantly harder than Wordle because you need to manage two puzzles
						simultaneously. Even experienced Wordle players can struggle when juggling the constraints
						of both boards.
					</p>
					<p class="leading-relaxed">
						Our solver uses entropy-based analysis to find the guess that maximizes information gain
						across both boards. Instead of guessing randomly or relying on intuition, you get
						data-driven suggestions that narrow down possibilities as efficiently as possible.
					</p>
					<p class="leading-relaxed">
						Whether you're stuck on a particularly tricky pair of words or want to learn better
						strategies, the Dordle Solver is your perfect companion. It's free, fast, and works right
						in your browser.
					</p>
				</div>
			</section>

			<section
				class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-8 border border-green-100 dark:border-green-800/30"
			>
				<h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
					Tips for Solving Dordle
				</h2>
				<div class="space-y-4 text-lg text-gray-600 dark:text-gray-300">
					<div class="flex gap-3">
						<span class="text-green-500 font-bold text-xl">+</span>
						<p class="leading-relaxed">
							<strong class="text-gray-900 dark:text-white">Start with vowel-heavy words.</strong> Words like
							"audio", "ouija", or "adieu" quickly reveal which vowels appear in each word.
						</p>
					</div>
					<div class="flex gap-3">
						<span class="text-green-500 font-bold text-xl">+</span>
						<p class="leading-relaxed">
							<strong class="text-gray-900 dark:text-white">Use common consonants early.</strong> Letters like
							S, T, R, N, and L appear in most English words. Cover them in your first few guesses.
						</p>
					</div>
					<div class="flex gap-3">
						<span class="text-green-500 font-bold text-xl">+</span>
						<p class="leading-relaxed">
							<strong class="text-gray-900 dark:text-white">Balance both boards.</strong> Don't focus too
							much on one board early on. Gather information across both puzzles before committing to a
							solution.
						</p>
					</div>
					<div class="flex gap-3">
						<span class="text-green-500 font-bold text-xl">+</span>
						<p class="leading-relaxed">
							<strong class="text-gray-900 dark:text-white">Eliminate letters aggressively.</strong> If a
							letter is gray on both boards, avoid it entirely in future guesses.
						</p>
					</div>
				</div>
			</section>
		</article>

		<InternalLinkSection currentGame="Dordle" />
	</div>
</div>
