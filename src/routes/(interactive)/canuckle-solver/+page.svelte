<script lang="ts">
	import FAQSection from '$lib/components/FAQSection.svelte';
	import { validateGuess } from '$lib/canuckle';
	import {
		generateFAQSchema,
		generateHowToSchema,
		generateWebApplicationSchema,
		generateWebPageSchema
	} from '$lib/seo';

	let guessInput = $state('');
	let tileStates = $state<('gray' | 'yellow' | 'green')[]>(['gray', 'gray', 'gray', 'gray', 'gray']);
	let results = $state<string[]>([]);
	let hasChecked = $state(false);

	const wordList = $derived.by(() => {
		const words = [
			'MAPLE', 'HOCKEY', 'CANOE', 'BEAVER', 'IGLOO', 'NORTH', 'MOOSE', 'LOONS',
			'PINES', 'SNOWY', 'LAKER', 'BROOK', 'GRIZZ', 'CEDAR', 'TROUT', 'EAGLE',
			'FJORD', 'TUNDRA', 'LARCH', 'WHALE', 'BEARS', 'WOLVES', 'OTTER', 'GEODE',
			'PRONG', 'STOKE', 'GRUEL', 'RADII', 'PLAIT', 'APHID', 'BOGGY', 'PIPES',
			'FRILL', 'TEAMS', 'HYENA', 'DRAFT', 'VINES', 'MAMBA', 'SLEEP', 'BITER',
			'MILKY', 'WRIST', 'MANIC', 'SPOOR'
		];
		return words;
	});

	function cycleTileState(index: number) {
		const order: ('gray' | 'yellow' | 'green')[] = ['gray', 'yellow', 'green'];
		const currentIndex = order.indexOf(tileStates[index]);
		tileStates[index] = order[(currentIndex + 1) % 3];
	}

	function handleCheck() {
		const guess = guessInput.toUpperCase().trim();
		if (guess.length !== 5) return;

		const pattern = guess.split('').map((letter, i) => {
			const state = tileStates[i];
			return { letter, state, index: i };
		});

		const matching = wordList.filter((word) => {
			const upperWord = word.toUpperCase();
			for (const { letter, state, index } of pattern) {
				if (state === 'green') {
					if (upperWord[index] !== letter) return false;
				} else if (state === 'yellow') {
					if (!upperWord.includes(letter) || upperWord[index] === letter) return false;
				} else {
					if (upperWord.includes(letter)) return false;
				}
			}
			return true;
		});

		results = matching;
		hasChecked = true;
	}

	function handleReset() {
		guessInput = '';
		tileStates = ['gray', 'gray', 'gray', 'gray', 'gray'];
		results = [];
		hasChecked = false;
	}

	const faqs = [
		{
			question: 'What is Canuckle?',
			answer:
				'Canuckle is a Canadian-themed Wordle game where each daily answer is a five-letter word related to Canada. It was created to celebrate Canadian culture, geography, and history through a fun word puzzle format.'
		},
		{
			question: 'How does the Canuckle Solver work?',
			answer:
				'Enter your guess, then tap each letter tile to set the color feedback you received in the game (gray for absent, yellow for present, green for correct). Click "Check" to see all matching Canadian-themed words that fit your clues.'
		},
		{
			question: 'Is the Canuckle Solver free to use?',
			answer:
				'Yes, the Canuckle Solver is completely free with no registration or limits. Use it as a learning tool to improve your word-guessing skills and discover Canadian vocabulary.'
		}
	];

	const webPageSchema = generateWebPageSchema(
		'Canuckle Solver - Free Canadian Wordle Helper Tool',
		'Solve Canuckle puzzles fast with our free Canadian Wordle helper. Filter by letter positions and colors to find the answer.',
		'https://wordsolver.tech/canuckle-solver'
	);
	const webAppSchema = generateWebApplicationSchema(
		'Canuckle Solver',
		'A free tool to help solve Canuckle, the Canadian-themed Wordle variant with five-letter words related to Canada.'
	);
	const faqSchema = generateFAQSchema(faqs);
	const howToSchema = generateHowToSchema('How to Use the Canuckle Solver', [
		{
			name: 'Enter Your Guess',
			text: 'Type the five-letter word you guessed in Canuckle into the input field.'
		},
		{
			name: 'Set Color Feedback',
			text: 'Tap each letter tile to cycle through gray (absent), yellow (present), or green (correct) to match the feedback from your game.'
		},
		{
			name: 'Get Matching Words',
			text: 'Click "Check" to see all possible Canadian-themed words that match your color pattern.'
		}
	]);
</script>

<svelte:head>
	<title>Canuckle Solver - Free Canadian Wordle Helper Tool | WordSolverX</title>
	<meta
		name="description"
		content="Use our free Canuckle Solver to find Canadian Wordle answers fast. Filter by letter positions and colors to narrow down the correct five-letter Canadian word."
	/>
	<meta
		name="keywords"
		content="canuckle solver, canadian wordle solver, canuckle helper, canuckle cheat, canuckle answer finder, canadian word game, five letter canadian words"
	/>
	<link rel="canonical" href="https://wordsolver.tech/canuckle-solver" />
	<meta property="og:title" content="Canuckle Solver - Free Canadian Wordle Helper Tool | WordSolverX" />
	<meta
		property="og:description"
		content="Use our free Canuckle Solver to find Canadian Wordle answers fast. Filter by letter positions and colors to narrow down the correct word."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://wordsolver.tech/canuckle-solver" />
	<meta property="og:site_name" content="WordSolverX" />
	<meta property="og:image" content="https://wordsolver.tech/wordsolverx.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Canuckle Solver - Free Canadian Wordle Helper Tool | WordSolverX" />
	<meta
		name="twitter:description"
		content="Use our free Canuckle Solver to find Canadian Wordle answers fast. Filter by letter positions and colors."
	/>
	<meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
	{@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(webAppSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(howToSchema)}</script>`}
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-red-950">
	<section class="bg-gradient-to-r from-red-600 to-red-700 py-16 shadow-lg">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1 class="text-4xl font-extrabold text-white sm:text-6xl md:text-7xl tracking-tight">
					Canuckle Solver
				</h1>
				<p class="mt-6 max-w-3xl mx-auto text-xl text-white/95 sm:text-2xl font-medium leading-relaxed">
					Find Canadian Wordle answers fast with our free Canuckle helper tool.
				</p>
				<div class="mt-8 flex flex-wrap justify-center gap-4 text-sm font-bold text-red-100">
					<span class="bg-white/10 px-4 py-2 rounded-full border border-white/20">5-Letter Words</span>
					<span class="bg-white/10 px-4 py-2 rounded-full border border-white/20">Canadian Themed</span>
					<span class="bg-white/10 px-4 py-2 rounded-full border border-white/20">Instant Results</span>
					<span class="bg-white/10 px-4 py-2 rounded-full border border-white/20">100% Free</span>
				</div>
			</div>
		</div>
	</section>

	<div class="max-w-3xl mx-auto py-12 px-4">
		<div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Enter Your Guess</h2>

			<div class="flex flex-col items-center gap-6">
				<input
					type="text"
					maxlength="5"
					bind:value={guessInput}
					placeholder="Enter 5-letter word"
					class="w-full max-w-xs text-center text-2xl font-bold tracking-widest uppercase px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 outline-none transition"
				/>

				<p class="text-sm text-gray-500 dark:text-gray-400">
					Tap tiles to set color feedback: <span class="font-semibold text-gray-700 dark:text-gray-300">Gray</span> → <span class="font-semibold text-yellow-600">Yellow</span> → <span class="font-semibold text-green-600">Green</span>
				</p>

				<div class="flex gap-3">
					{#each tileStates as state, i}
						<button
							type="button"
							onclick={() => cycleTileState(i)}
							class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl text-xl sm:text-2xl font-bold uppercase transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-red-400
								{state === 'gray' ? 'bg-gray-400 dark:bg-gray-600 text-white border-2 border-gray-500 dark:border-gray-500' : ''}
								{state === 'yellow' ? 'bg-yellow-400 text-gray-900 border-2 border-yellow-500 shadow-md shadow-yellow-200 dark:shadow-yellow-900/30' : ''}
								{state === 'green' ? 'bg-green-500 text-white border-2 border-green-600 shadow-md shadow-green-200 dark:shadow-green-900/30' : ''}
							"
						>
							{guessInput[i]?.toUpperCase() || '?'}
						</button>
					{/each}
				</div>

				<div class="flex gap-3 w-full max-w-xs">
					<button
						type="button"
						onclick={handleCheck}
						disabled={guessInput.length !== 5}
						class="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-lg shadow-lg shadow-red-200 dark:shadow-red-900/30 transition hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
					>
						Check
					</button>
					<button
						type="button"
						onclick={handleReset}
						class="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-lg transition hover:bg-gray-50 dark:hover:bg-gray-700"
					>
						Reset
					</button>
				</div>
			</div>

			{#if hasChecked}
				<div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
					<h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
						{results.length > 0 ? `Matching Words (${results.length})` : 'No Matching Words Found'}
					</h3>
					{#if results.length > 0}
						<div class="flex flex-wrap justify-center gap-3">
							{#each results as word}
								<span class="inline-flex items-center px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 font-bold tracking-wider uppercase text-lg">
									{word}
								</span>
							{/each}
						</div>
					{:else}
						<p class="text-center text-gray-500 dark:text-gray-400">
							No words in our Canadian word list match your pattern. Try adjusting your color feedback.
						</p>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<div class="py-12">
		<FAQSection {faqs} />
	</div>

	<section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
		<div class="bg-white dark:bg-gray-800 rounded-3xl p-10 md:p-14 shadow-2xl border border-gray-100 dark:border-gray-700">
			<h2 class="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center">
				How to Solve Canuckle Fast
			</h2>
			<div class="grid md:grid-cols-2 gap-10 text-gray-700 dark:text-gray-300">
				<div class="space-y-4">
					<h3 class="font-bold text-xl flex items-center gap-2 text-red-600 dark:text-red-400">
						<span class="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-sm">1</span>
						Enter Your Guess
					</h3>
					<p class="leading-relaxed">
						Type the five-letter word you tried in today's Canuckle puzzle into the input field. Every answer is a word with a Canadian connection.
					</p>
				</div>
				<div class="space-y-4">
					<h3 class="font-bold text-xl flex items-center gap-2 text-red-600 dark:text-red-400">
						<span class="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-sm">2</span>
						Set the Colors
					</h3>
					<p class="leading-relaxed">
						Tap each letter tile to cycle through gray, yellow, and green to match the feedback from your Canuckle game.
					</p>
				</div>
				<div class="space-y-4">
					<h3 class="font-bold text-xl flex items-center gap-2 text-red-600 dark:text-red-400">
						<span class="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-sm">3</span>
						Click Check
					</h3>
					<p class="leading-relaxed">
						Hit the Check button to see all matching Canadian words that fit your clue pattern. The solver filters our word list instantly.
					</p>
				</div>
				<div class="space-y-4">
					<h3 class="font-bold text-xl flex items-center gap-2 text-red-600 dark:text-red-400">
						<span class="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-sm">4</span>
						Find the Answer
					</h3>
					<p class="leading-relaxed">
						Review the matching words and pick the one that fits best. Repeat with new guesses until you solve today's Canuckle puzzle.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
		<article class="space-y-12">
			<div class="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
				<h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">What is Canuckle?</h2>
				<div class="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
					<p class="mb-6 leading-relaxed">
						Canuckle is a beloved Canadian twist on the Wordle format. Each daily puzzle features a five-letter word that has some connection to Canada — whether it's about geography, wildlife, food, culture, or history. Players get six attempts to guess the word, with color-coded feedback after each try.
					</p>
					<p class="mb-6 leading-relaxed">
						What makes Canuckle special is the fun fact that accompanies every answer. After solving the puzzle, you learn something new about Canada, from the habits of Arctic wildlife to the origins of everyday Canadian slang. It's a game that entertains and educates at the same time.
					</p>
					<p class="leading-relaxed">
						Our Canuckle Solver helps you find the answer by filtering Canadian-themed words based on the color feedback you've received. Whether you're stuck on the last guess or just want to confirm your answer, the solver narrows down the possibilities in seconds.
					</p>
				</div>
			</div>

			<div class="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
				<h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Tips for Playing Canuckle</h2>
				<div class="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
					<p class="mb-6 leading-relaxed">
						Starting with a word that contains common Canadian letters is a great strategy. Words like "MAPLE", "NORTH", or "MOOSE" cover many letters that frequently appear in Canadian-themed answers. Pay attention to the unique Canadian vocabulary that sets Canuckle apart from standard Wordle.
					</p>
					<p class="mb-6 leading-relaxed">
						Think about Canada's diverse landscape and culture when guessing. Canuckle answers might reference animals like beavers and moose, geographical features like fjords and tundra, or cultural touchstones like hockey and maple syrup. The more Canadian words you know, the better you'll do.
					</p>
					<p class="leading-relaxed">
						Don't forget that Canuckle uses the same color system as Wordle — green means the letter is in the right spot, yellow means it's in the word but in a different position, and gray means it's not in the word at all. Use this feedback systematically to eliminate possibilities.
					</p>
				</div>
			</div>
		</article>
	</section>
</div>
