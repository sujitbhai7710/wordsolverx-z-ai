<script lang="ts">
	import FAQSection from '$lib/components/FAQSection.svelte';
	import AdvancedSolverClient from '$lib/components/advanced-solver/AdvancedSolverClient.svelte';
	import {
		generateFAQSchema,
		generateHowToSchema,
		generateSoftwareApplicationSchema,
		generateWebApplicationSchema,
		generateWebPageSchema,
		SEO_KEYWORDS
	} from '$lib/seo';

	const faqs = [
		{
			question: 'What is the All Wordle Solver?',
			answer:
				'The All Wordle Solver is a powerful, high-performance tool that helps you solve any letter wordle within seconds. It supports puzzles ranging from 4 to 12 letters and provides near-instant calculations.'
		},
		{
			question: 'How do I solve any letter Wordle within seconds?',
			answer:
				'Simply select your word length, enter your current guess, and tap the letters to match the colors from the game (Gray, Yellow, or Green). Our solver analyzes thousands of possibilities to give you the perfect suggestion in a heartbeat.'
		},
		{
			question: 'Does this work for Quordle, Octordle, and Dordle?',
			answer:
				'Yes! Because our tool supports multiple word lengths and provides fast results, it is ideal for solving multi-word games like Quordle, Octordle, and other Wordle-style variants.'
		},
		{
			question: 'What is the "Hard Mode" feature?',
			answer:
				'Hard Mode forces the solver to only suggest words that follow all confirmed hints. If a letter is green (correct) or yellow (present), every subsequent suggestion will strictly adhere to those rules, just like the official NYT Wordle Hard Mode.'
		},
		{
			question: 'Is it really free?',
			answer:
				'Yes, the All Wordle Solver is 100% free with no ads, no registration, and no limits. Our goal is to provide the best word puzzle tools to the community.'
		}
	];

	const webAppSchema = generateWebApplicationSchema(
		'All Wordle Solver',
		'Solve any letter Wordle within seconds with our high-performance solver supporting 4-12 letter words.'
	);
	const faqSchema = generateFAQSchema(faqs);
	const howToSchema = generateHowToSchema('How to use the Multi Wordle Solver', [
		{
			name: 'Enter Letters',
			text: 'Enter the letters you know in the corresponding "Correct", "Present", or "Absent" fields.'
		},
		{
			name: 'Select Word Length',
			text: 'Choose the word length (4 to 12 letters) from the dropdown menu.'
		},
		{
			name: 'Get Answers',
			text: 'Click "Solve" to see a list of all possible words that match your criteria.'
		}
	]);
	const softwareAppSchema = generateSoftwareApplicationSchema(
		'Multi Wordle Solver',
		'GameApplication',
		'Any'
	);
	const webPageSchema = generateWebPageSchema(
		'Multi Wordle Solver - Solve Any Letter Wordle Within Seconds (4-12 Letters)',
		'Solve Wordle variants from 4 to 12 letters with smart filtering, fast suggestions, and free clue-based help on WordSolverX.',
		'https://wordsolverx.com/wordle-solver'
	);
</script>

<svelte:head>
	<title>Multi Wordle Solver - Solve Any Letter Wordle Within Seconds (4-12 Letters)</title>
	<meta
		name="description"
		content="Solve any letter Wordle within seconds with our Multi Wordle Solver. Supporting 4-12 letter words, hard mode, and real-time hints. Perfect for Quordle, Octordle, and custom word puzzles."
	/>
	<meta name="keywords" content={SEO_KEYWORDS.allWordleSolver.join(', ')} />
	<meta
		property="og:title"
		content="Multi Wordle Solver - Solve Any Letter Wordle Within Seconds"
	/>
	<meta
		property="og:description"
		content="The ultimate tool to solve any letter wordle within seconds. Supports custom lengths from 4 to 12 letters. Fast, accurate, and totally free."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://wordsolverx.com/wordle-solver" />
	<meta property="og:site_name" content="WordSolverX" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content="Multi Wordle Solver - Solve Any Letter Wordle Within Seconds"
	/>
	<meta
		name="twitter:description"
		content="Solve Wordle variants of any length (4-12 letters) instantly with our super-fast solver."
	/>
	<meta name="twitter:image" content="https://wordsolverx.com/wordsolverx.webp" />
	<link rel="canonical" href="https://wordsolverx.com/wordle-solver" />
	{@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(webAppSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(howToSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(softwareAppSchema)}</script>`}
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
	<section class="bg-gradient-to-r from-green-600 to-emerald-600 py-16 shadow-lg">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1 class="text-4xl font-extrabold text-white sm:text-6xl md:text-7xl tracking-tight">
					Multi Wordle Solver
				</h1>
				<p class="mt-6 max-w-3xl mx-auto text-xl text-white/95 sm:text-2xl font-medium leading-relaxed">
					Solve any letter Wordle within seconds. The ultimate tool for 4-12 letter word puzzles.
				</p>
				<div class="mt-8 flex flex-wrap justify-center gap-4 text-sm font-bold text-green-100">
					<span class="bg-white/10 px-4 py-2 rounded-full border border-white/20">4-12 Letters</span>
					<span class="bg-white/10 px-4 py-2 rounded-full border border-white/20">Fast Suggestions</span>
					<span class="bg-white/10 px-4 py-2 rounded-full border border-white/20">Hard Mode Support</span>
					<span class="bg-white/10 px-4 py-2 rounded-full border border-white/20">100% Free</span>
				</div>
			</div>
		</div>
	</section>

	<div class="max-w-7xl mx-auto py-12 px-4">
		<AdvancedSolverClient />
	</div>

	<div class="py-12">
		<FAQSection {faqs} />
	</div>

	<section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
		<div
			class="bg-white dark:bg-gray-800 rounded-3xl p-10 md:p-14 shadow-2xl border border-gray-100 dark:border-gray-700"
		>
			<h2 class="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center">
				How to Solve Any Letter Wordle Within Seconds
			</h2>
			<div class="grid md:grid-cols-2 gap-10 text-gray-700 dark:text-gray-300">
				<div class="space-y-4">
					<h3
						class="font-bold text-xl flex items-center gap-2 text-green-600 dark:text-green-400"
					>
						<span
							class="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-sm"
						>
							1
						</span>
						Pick Your Puzzle
					</h3>
					<p class="leading-relaxed">
						Choose your word length from 4 to 12. Whether you're playing the classic NYT Wordle or
						a complex 12-letter variation, we've got you covered.
					</p>
				</div>
				<div class="space-y-4">
					<h3
						class="font-bold text-xl flex items-center gap-2 text-green-600 dark:text-green-400"
					>
						<span
							class="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-sm"
						>
							2
						</span>
						Enter Your Guesses
					</h3>
					<p class="leading-relaxed">
						Type in the words you've tried in the game. Use our keyboard or your own to quickly fill
						the grid.
					</p>
				</div>
				<div class="space-y-4">
					<h3
						class="font-bold text-xl flex items-center gap-2 text-green-600 dark:text-green-400"
					>
						<span
							class="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-sm"
						>
							3
						</span>
						Mark the Colors
					</h3>
					<p class="leading-relaxed">
						Tap letters to match the feedback from the game. Gray for incorrect, yellow for wrong spot,
						and green for correct. Accuracy is key!
					</p>
				</div>
				<div class="space-y-4">
					<h3
						class="font-bold text-xl flex items-center gap-2 text-green-600 dark:text-green-400"
					>
						<span
							class="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-sm"
						>
							4
						</span>
						Get the Answer
					</h3>
					<p class="leading-relaxed">
						Click "Get Suggestion" and let our engine find the best solution in milliseconds. Solve any
						letter Wordle within seconds and keep your streak alive.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- SEO Content Section -->
	<section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
		<article class="space-y-12">
			<div class="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
				<h2 class="text-3xl font-bold text-gray-900 mb-6">Why Use a Wordle Solver?</h2>
				<div class="prose prose-lg max-w-none text-gray-600">
					<p class="mb-6 leading-relaxed">
						Wordle has become a daily ritual for millions of players worldwide. But sometimes, you hit a wall. Maybe you're down to your last guess, or you've encountered an unfamiliar word. That's where a Wordle solver becomes invaluable — not as a cheat, but as a learning tool that helps you understand word patterns and improve your overall game.
					</p>
					<p class="mb-6 leading-relaxed">
						Our Multi Wordle Solver goes beyond the basic 5-letter format. With support for 4 to 12 letter words, it handles every Wordle variant you might encounter. From the classic NYT Wordle to Quordle, Octordle, and custom puzzles, this tool adapts to your needs. The algorithm analyzes thousands of words in milliseconds, giving you the best possible suggestions based on your current clues.
					</p>
					<p class="leading-relaxed">
						What sets our solver apart is the Hard Mode feature. When enabled, every suggestion strictly follows the clues you've already received. If a letter is confirmed green, it stays in that position. If a letter is yellow, it appears in every suggestion — just not in the same spot. This mirrors the official NYT Wordle Hard Mode, making practice sessions more realistic and beneficial.
					</p>
				</div>
			</div>

			<div class="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
				<h2 class="text-3xl font-bold text-gray-900 mb-6">How Our Wordle Solver Algorithm Works</h2>
				<div class="prose prose-lg max-w-none text-gray-600">
					<p class="mb-6 leading-relaxed">
						Behind the scenes, our solver uses a sophisticated filtering algorithm. When you enter your guesses and mark the colors, the solver immediately eliminates all words that don't match your criteria. Gray letters are removed from consideration entirely. Yellow letters must appear somewhere in the word, but not in the position you tried. Green letters are locked into their confirmed positions.
					</p>
					<p class="mb-6 leading-relaxed">
						But filtering is just the first step. The solver then ranks the remaining candidates using letter frequency analysis and positional probability. Words with common letters in common positions rank higher because they're more likely to appear in the puzzle. This approach consistently suggests words that maximize your chances of success.
					</p>
					<p class="leading-relaxed">
						For multi-word games like Quordle, where you're solving four puzzles simultaneously, the solver becomes even more valuable. You can use it to find words that work across multiple boards, sharing letters and patterns to solve all four puzzles efficiently. The same applies to Octordle, Sedecordle, and other variants — the principles remain the same, only the scale changes.
					</p>
				</div>
			</div>

			<div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 border border-green-100">
				<h2 class="text-3xl font-bold text-gray-900 mb-6">Tips for Getting Better at Wordle</h2>
				<div class="space-y-6 text-lg text-gray-600">
					<p class="leading-relaxed">
						While a solver is helpful, developing your own skills is even more rewarding. Here are strategies that will improve your Wordle game:
					</p>
					<ul class="space-y-4 ml-4">
						<li class="leading-relaxed">
							<strong class="text-gray-900">Start with vowel-rich words</strong> — Words like "ADIEU", "AUDIO", or "CANOE" help you identify vowels early. Knowing which vowels are in the word dramatically narrows down possibilities.
						</li>
						<li class="leading-relaxed">
							<strong class="text-gray-900">Use common consonants</strong> — After vowels, target common consonants like R, S, T, L, N. The word "STERN" or "SLANT" covers several of these in one guess.
						</li>
						<li class="leading-relaxed">
							<strong class="text-gray-900">Avoid repeating letters early</strong> — In your first few guesses, use words with unique letters to maximize information. Save double-letter words for when you have more clues.
						</li>
						<li class="leading-relaxed">
							<strong class="text-gray-900">Think about word patterns</strong> — English has common patterns like "-TION", "-IGHT", "-OUGH". If you identify some letters, consider what patterns might fit.
						</li>
						<li class="leading-relaxed">
							<strong class="text-gray-900">Practice with our solver</strong> — Use the solver to understand why certain words are better guesses. Over time, you'll internalize these patterns and improve naturally.
						</li>
					</ul>
				</div>
			</div>

			<div class="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
				<h2 class="text-3xl font-bold text-gray-900 mb-6">Wordle Variants and How to Tackle Them</h2>
				<div class="prose prose-lg max-w-none text-gray-600">
					<p class="mb-6 leading-relaxed">
						The Wordle phenomenon has spawned countless variants, each with its own twist. Understanding these variations helps you choose the right approach — and the right settings in our solver.
					</p>
					<div class="grid md:grid-cols-2 gap-6 not-prose mb-6">
						<div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
							<h3 class="font-bold text-gray-900 mb-2">Quordle (4 Boards)</h3>
							<p class="text-gray-600 text-sm">Four simultaneous Wordle puzzles. Each guess applies to all boards. Strategy: Find words that share letters across multiple boards.</p>
						</div>
						<div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
							<h3 class="font-bold text-gray-900 mb-2">Octordle (8 Boards)</h3>
							<p class="text-gray-600 text-sm">Eight boards at once. Requires efficient guessing and careful tracking. Use our solver to manage the complexity.</p>
						</div>
						<div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
							<h3 class="font-bold text-gray-900 mb-2">N-Letter Variants</h3>
							<p class="text-gray-600 text-sm">4-letter, 6-letter, even 12-letter Wordles. Our solver handles all lengths. Adjust the word length setting and solve normally.</p>
						</div>
						<div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
							<h3 class="font-bold text-gray-900 mb-2">Themed Wordles</h3>
							<p class="text-gray-600 text-sm">Phoodle (food), Lewdle (NSFW), Taylordle (Taylor Swift). These use specialized word lists. Our general solver still helps with letter patterns.</p>
						</div>
					</div>
					<p class="leading-relaxed">
						No matter which variant you're playing, the core principles remain the same: gather information efficiently, use letter frequency to your advantage, and let the solver handle the heavy lifting when you need it.
					</p>
				</div>
			</div>
		</article>
	</section>
</div>
