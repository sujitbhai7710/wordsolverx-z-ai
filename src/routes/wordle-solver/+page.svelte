<script lang="ts">
	import AdvancedSolverClient from '$lib/components/advanced-solver/AdvancedSolverClient.svelte';
	import FAQSection from '$lib/components/FAQSection.svelte';
	import {
		SEO_KEYWORDS,
		generateFAQSchema,
		generateHowToSchema,
		generateSoftwareApplicationSchema,
		generateWebApplicationSchema,
		generateWebPageSchema
	} from '$lib/seo';

	const faqs = [
		{
			question: 'What is the All Wordle Solver?',
			answer:
				'The All Wordle Solver is a powerful, high-performance tool that helps you solve any letter wordle within seconds. It supports puzzles ranging from 3 to 12 letters and provides near-instant calculations.'
		},
		{
			question: 'How do I solve any letter Wordle within seconds?',
			answer:
				'Simply select your word length, enter your current guess, and tap the letters to match the colors from the game (Gray, Yellow, or Green). Our solver analyzes thousands of possibilities to give you the perfect suggestion in a heartbeat.'
		},
		{
			question: 'What is the new Prefer NYT option?',
			answer:
				'Prefer NYT keeps curated Wordle-style answers ranked first, but the updated solver now falls back to the wider word pool automatically if those curated answers no longer fit your board.'
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
		'Solve any letter Wordle within seconds with our high-performance solver supporting 3-12 letter words.'
	);
	const faqSchema = generateFAQSchema(faqs);
	const howToSchema = generateHowToSchema('How to use the All Wordle Solver', [
		{
			name: 'Enter Letters',
			text: 'Enter the letters you know in the corresponding "Correct", "Present", or "Absent" fields.'
		},
		{
			name: 'Select Word Length',
			text: 'Choose the word length (3 to 12 letters) from the dropdown menu.'
		},
		{
			name: 'Get Answers',
			text: 'Click "Solve" to see a list of all possible words that match your criteria.'
		}
	]);
	const softwareAppSchema = generateSoftwareApplicationSchema(
		'All Wordle Solver',
		'GameApplication',
		'Any'
	);
	const webPageSchema = generateWebPageSchema(
		'All Wordle Solver - Wordle Solver for 4-12 Letter Puzzles',
		'Solve Wordle puzzles and Wordle variants with our all wordle solver, fast suggestions, and free clue-based help on WordSolverX.',
		'https://wordsolver.tech/wordle-solver'
	);
</script>

<svelte:head>
	<title>All Wordle Solver - Wordle Solver for 4-12 Letter Puzzles</title>
	<meta
		name="description"
		content="Use our Wordle Solver and All Wordle Solver to solve Wordle puzzles fast with smart suggestions, hard mode support, and free clue-based help."
	/>
	<meta name="keywords" content={SEO_KEYWORDS.allWordleSolver.join(', ')} />
	<meta
		property="og:title"
		content="All Wordle Solver - Wordle Solver for 4-12 Letter Puzzles"
	/>
	<meta
		property="og:description"
		content="Use our Wordle Solver and All Wordle Solver to solve Wordle puzzles fast with smart suggestions and free clue-based help."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://wordsolver.tech/wordle-solver" />
	<meta property="og:site_name" content="WordSolverX" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content="All Wordle Solver - Wordle Solver for 4-12 Letter Puzzles"
	/>
	<meta
		name="twitter:description"
		content="Use our Wordle Solver and All Wordle Solver to solve Wordle puzzles fast with smart suggestions and free clue-based help."
	/>
	<meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
	<link rel="canonical" href="https://wordsolver.tech/wordle-solver" />
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
					All Wordle Solver
				</h1>
				<p class="mt-6 max-w-3xl mx-auto text-xl text-white/95 sm:text-2xl font-medium leading-relaxed">
					Use our Wordle Solver to solve Wordle puzzles fast with smart suggestions and simple clues.
				</p>
				<div class="mt-8 flex flex-wrap justify-center gap-4 text-sm font-bold text-green-100">
					<span class="bg-white/10 px-4 py-2 rounded-full border border-white/20">3-12 Letters</span>
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
						Choose your word length from 3 to 12. Whether you're playing the classic NYT Wordle or
						a longer custom variation, we've got you covered.
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

	<section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
		<article class="space-y-12">
			<div class="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
				<h2 class="text-3xl font-bold text-gray-900 mb-6">Why Use a Wordle Solver?</h2>
				<div class="prose prose-lg max-w-none text-gray-600">
					<p class="mb-6 leading-relaxed">
						Wordle has become a daily ritual for millions of players worldwide. But sometimes, you hit a wall. Maybe you're down to your last guess, or you've encountered an unfamiliar word. That's where a Wordle solver becomes invaluable — not as a cheat, but as a learning tool that helps you understand word patterns and improve your overall game.
					</p>
					<p class="mb-6 leading-relaxed">
						Our All Wordle Solver goes beyond the basic 5-letter format. With support for 3 to 12 letter words, it handles every Wordle variant you might encounter. From the classic NYT Wordle to Quordle, Octordle, and custom puzzles, this tool adapts to your needs. The algorithm analyzes thousands of words in milliseconds, giving you the best possible suggestions based on your current clues.
					</p>
					<p class="leading-relaxed">
						What sets this Wordle Solver apart is the easy workflow. You can enter your guesses, mark the colors, and quickly narrow the answer list with helpful suggestions that stay simple to use.
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
		</article>
	</section>
</div>
