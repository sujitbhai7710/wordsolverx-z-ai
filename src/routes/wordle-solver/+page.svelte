<script lang="ts">
	import FAQSection from '$lib/components/FAQSection.svelte';
	import AdvancedSolverClient from '$lib/components/advanced-solver/AdvancedSolverClient.svelte';
	import {
		generateFAQSchema,
		generateHowToSchema,
		generateSoftwareApplicationSchema,
		generateWebApplicationSchema,
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
	<link rel="canonical" href="https://wordsolverx.com/all-wordle-solver" />
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
</div>
