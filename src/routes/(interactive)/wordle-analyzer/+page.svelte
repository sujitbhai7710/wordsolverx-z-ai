<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import FAQSection from '$lib/components/FAQSection.svelte';
	import WordleAnalyzerClient from '$lib/components/wordle-analyzer/WordleAnalyzerClient.svelte';
	import {
		generateBreadcrumbSchema,
		generateFAQSchema,
		generateHowToSchema,
		generateSoftwareApplicationSchema,
		generateWebPageSchema
	} from '$lib/seo';

	const pageTitle = 'Wordle Analyzer - Replay and Grade Every Move';
	const pageDescription =
		'Paste a finished Wordle, see turn-by-turn AI comparison, check hard mode discipline, and generate spoiler-safe share links. Analyze every guess after the answer is known.';
	const pageUrl = 'https://wordsolver.tech/wordle-analyzer';

	const faqs = [
		{
			question: 'How is the Wordle Analyzer different from a Wordle solver?',
			answer:
				'A solver helps you find the next move while a puzzle is live. The analyzer reviews a completed game and grades each guess against what an AI would have done with the same information. It shows how much you gained or lost at every step.'
		},
		{
			question: 'Can shared links spoil the answer?',
			answer:
				'No. Shared analyzer links encode the game in the URL query string. When you open one, the page shows a spoiler warning and waits for you to confirm before revealing the answer and analysis.'
		},
		{
			question: 'What does hard mode checking flag?',
			answer:
				'Hard mode requires every guess to respect confirmed clues — green letters must stay in place, yellow letters must appear somewhere. The analyzer flags any guess that violates a locked clue, even if it was technically a valid word.'
		},
		{
			question: 'What is guess quality?',
			answer:
				'Quality measures how well your guess narrowed the remaining possibilities. A guess that splits the remaining pool roughly in half scores near 100%. A guess that barely reduces the candidate set scores low. It is calculated from entropy — how much information each guess revealed.'
		},
		{
			question: 'Does this work for Wordle variants like Dordle or Quordle?',
			answer:
				'No. The analyzer is built for the original 5-letter Wordle only. Variants with multiple simultaneous boards produce different clue states that this tool does not model.'
		},
		{
			question: 'Where does the AI line come from?',
			answer:
				'The AI line is recalculated after each of your guesses using the same clue state you had at that moment. It is the best-ranked guess from a dictionary of 12,000+ words based on information gain — not a fixed strategy or pre-programmed sequence.'
		},
		{
			question: 'What do the "remaining words preview" labels mean?',
			answer:
				'"Common" labels words from the official answer list. "Other" labels words that are valid guesses but were never actual answers. The analyzer tracks both because a good early guess narrows the entire guess pool, not just the plausible answers.'
		},
		{
			question: 'Can I analyze games in unlimited or practice mode?',
			answer:
				'Yes. Enter any sequence of 1-6 guesses followed by the answer, mark hard mode if you played it, and run the analysis. The tool works for any finished game regardless of whether it was the daily puzzle.'
		}
	];

	const schemas = JSON.stringify([
		generateFAQSchema(faqs),
		generateHowToSchema('How to use the Wordle Analyzer', [
			{
				name: 'Enter your guesses',
				text: 'Type your guesses in order in the top rows. Place the final answer in the last row labeled "Answer." Each guess must be exactly 5 letters.'
			},
			{
				name: 'Mark hard mode if used',
				text: 'Toggle the hard mode checkbox if you played by hard mode rules. This enables rule-violation checking for every guess.'
			},
			{
				name: 'Run the analysis',
				text: 'Click Analyze Game to replay the puzzle. The tool rebuilds the clue state after each turn and compares your line against the AI alternative.'
			},
			{
				name: 'Review and share',
				text: 'Scroll through the turn-by-turn breakdown. Copy the spoiler-safe link or the emoji recap to share with friends.'
			}
		]),
		{
			...generateSoftwareApplicationSchema('Wordle Analyzer', 'GameApplication'),
			keywords: ['wordle analyzer', 'wordle replay', 'wordle review', 'wordle hard mode checker']
		},
		generateBreadcrumbSchema([
			{ name: 'Home', url: 'https://wordsolver.tech' },
			{ name: 'Solver', url: 'https://wordsolver.tech/solver' },
			{ name: 'Wordle Analyzer', url: pageUrl }
		]),
		generateWebPageSchema('Wordle Analyzer', pageDescription, pageUrl)
	]);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta
		name="keywords"
		content="wordle analyzer, wordle replay, wordle review tool, wordle hard mode checker, wordle share link"
	/>
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={pageUrl} />
	<link rel="canonical" href={pageUrl} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	{@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-white">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<Breadcrumbs />
	</div>

	<WordleAnalyzerClient />

	<div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
		<article class="space-y-10">
			<section class="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
				<h2 class="text-3xl font-bold text-slate-900 mb-5">What is the Wordle Analyzer?</h2>
				<p class="text-slate-600 leading-relaxed mb-4">
					The Wordle Analyzer is a post-game review tool. You paste a finished game — your guesses and the answer — and it replays every turn, comparing your line against what an AI would have picked with the same information. It tells you how much information each guess revealed and whether it matched the best available option.
				</p>
				<p class="text-slate-600 leading-relaxed mb-4">
					Unlike a solver that helps you during a live puzzle, the analyzer works after the fact. It has access to the answer, which means it can calculate exactly how many possibilities each guess eliminated and whether a different choice would have been stronger.
				</p>
				<p class="text-slate-600 leading-relaxed">
					The AI line is not a fixed sequence — it recalculates after every one of your guesses using only the information that was available at that point. If you played SLATE and got feedback, the AI line shows what it would have picked next given those same clues.
				</p>
			</section>

			<section class="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
				<h2 class="text-3xl font-bold text-slate-900 mb-5">What the Analysis Metrics Mean</h2>
				<p class="text-slate-600 leading-relaxed mb-5">
					Each analyzed turn shows four key numbers that tell you how well your guess performed.
				</p>
				<div class="space-y-4 mb-4">
					<div class="rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
						<h3 class="font-bold text-emerald-900 mb-2">Guess Quality</h3>
						<p class="text-emerald-800 text-sm">
							Measures how evenly your guess split the remaining candidates. A quality near 100% means the guess narrowed the pool roughly in half. Below 50% means the guess barely reduced the search space — another word would have been better.
						</p>
					</div>
					<div class="rounded-2xl bg-sky-50 border border-sky-200 p-5">
						<h3 class="font-bold text-sky-900 mb-2">Average Remaining</h3>
						<p class="text-sky-800 text-sm">
							The average number of candidates that would remain after this guess across all possible answer combinations. Lower is better. Shown separately for the official answer list ("common") and the full valid guess list ("all").
						</p>
					</div>
					<div class="rounded-2xl bg-amber-50 border border-amber-200 p-5">
						<h3 class="font-bold text-amber-900 mb-2">Remaining After</h3>
						<p class="text-amber-800 text-sm">
							The total number of words still consistent with the clues after this guess. This is the most intuitive metric — a good guess drops this number dramatically, especially early in the game when the clue state is sparse.
						</p>
					</div>
					<div class="rounded-2xl bg-violet-50 border border-violet-200 p-5">
						<h3 class="font-bold text-violet-900 mb-2">Hard Mode Violations</h3>
						<p class="text-violet-800 text-sm">
							Lists any guesses that ignored confirmed clues. A "locked green" must stay in that position. A confirmed yellow must appear somewhere in the word. Violations are flagged even if the guess was a valid dictionary word.
						</p>
					</div>
				</div>
			</section>

			<section class="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
				<h2 class="text-3xl font-bold text-slate-900 mb-5">How the AI Line Is Calculated</h2>
				<p class="text-slate-600 leading-relaxed mb-4">
					After each of your guesses, the analyzer builds the current clue state — which letters are green, yellow, or gray — and evaluates every valid 5-letter word as a potential next guess. For each candidate, it simulates what the clue pattern would look like against the actual answer and calculates how evenly that pattern would split the remaining pool.
				</p>
				<p class="text-slate-600 leading-relaxed mb-4">
					This is entropy-based solving. A guess that produces many different possible clue patterns — each splitting the remaining candidates into groups of similar size — scores higher than one that mostly produces similar patterns. The AI picks the guess with the highest entropy score, not the one most likely to be correct.
				</p>
				<p class="text-slate-600 leading-relaxed">
					The distinction matters. A guess that is likely to be the answer scores poorly on entropy because it does not reveal much information when it is wrong. A guess that is unlikely to be correct but produces highly informative clue patterns scores high because it eliminates the most candidates regardless of whether it was right.
				</p>
			</section>

			<section class="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
				<h2 class="text-3xl font-bold text-slate-900 mb-5">When Hard Mode Checks Matter</h2>
				<p class="text-slate-600 leading-relaxed mb-4">
					Wordle's hard mode forces every guess to respect confirmed information. Once a letter is green, it must stay in that position for all future guesses. Once a letter is yellow, it must appear somewhere in a future guess. Breaking these rules is not illegal — the game allows it — but it violates hard mode's constraints.
				</p>
				<p class="text-slate-600 leading-relaxed mb-4">
					The analyzer flags violations even if you eventually solved the puzzle. A common scenario: you get a green letter in position 2, then later in the game you use it in position 4. Technically a valid English word, but it violates the hard mode lock on position 2. The analysis will note this so you know it happened.
				</p>
				<p class="text-slate-600 leading-relaxed">
					Most players accidentally break hard mode at least once per week. The violation is usually minor — swapping a locked letter to a different position — but it means you broke the discipline you committed to. The analyzer keeps you honest.
				</p>
			</section>

			<section class="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-lg">
				<h2 class="text-3xl font-bold text-slate-900 mb-5">Common Patterns in Wordle Analysis</h2>
				<div class="space-y-5">
					<div class="flex gap-4">
						<span class="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">1</span>
						<div>
							<h3 class="font-bold text-slate-900">First guesses rarely score above 70%</h3>
							<p class="text-slate-600 mt-1 text-sm">With no information, any opening guess splits the pool by letter frequency. A good opener like CRANE or SLATE scores 60-65% because the remaining pool is still large and diverse. Excellent openers like TRAWL or TRACE can reach 68-72%.</p>
						</div>
					</div>
					<div class="flex gap-4">
						<span class="flex-shrink-0 w-10 h-10 rounded-xl bg-sky-100 text-sky-700 font-bold flex items-center justify-center">2</span>
						<div>
							<h3 class="font-bold text-slate-900">The biggest quality jumps happen at turns 2 and 3</h3>
							<p class="text-slate-600 mt-1 text-sm">After the first guess you have actual clue patterns to work with. A good second guess can jump to 80-90% quality because it tests specific constraints. Turn 3 is where the pool usually shrinks to single digits if you've been playing well.</p>
						</div>
					</div>
					<div class="flex gap-4">
						<span class="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center">3</span>
						<div>
							<h3 class="font-bold text-slate-900">"Your line gained more information" is common after a lucky guess</h3>
							<p class="text-slate-600 mt-1 text-sm">If your guess happened to match the answer perfectly, the analyzer labels it as gaining more information than the AI — not because you played better, but because getting the exact answer in N guesses is better than the AI's expected N+1. This is luck, not skill, and the analyzer notes it with a luck label.</p>
						</div>
					</div>
					<div class="flex gap-4">
						<span class="flex-shrink-0 w-10 h-10 rounded-xl bg-violet-100 text-violet-700 font-bold flex items-center justify-center">4</span>
						<div>
							<h3 class="font-bold text-slate-900">Late turns often show 100% quality</h3>
							<p class="text-slate-600 mt-1 text-sm">When only 2-3 candidates remain, any valid guess scores 100% quality because it eliminates everything except the answer. By turn 5 or 6, the hard part is done — the question is just which of the remaining words it is.</p>
						</div>
					</div>
				</div>
			</section>

			<section class="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
				<h2 class="text-3xl font-bold text-slate-900 mb-5">What the AI Line Cannot Tell You</h2>
				<p class="text-slate-600 leading-relaxed mb-4">
					The AI line optimizes for information gain across all possible answers. It does not care about your specific clue state or whether you are close to solving. It would recommend the same guess whether you have 1 guess left or 6.
				</p>
				<p class="text-slate-600 leading-relaxed mb-4">
					This creates situations where the AI and human strategies diverge. In a 2-guess situation with 10 candidates left, the AI recommends the highest-entropy guess. You might instead pick one of the 10 candidates directly — it has 10% chance of being right, and if it is wrong you learn exactly which one it is. This is a valid strategy, but it is not what the AI recommends.
				</p>
				<p class="text-slate-600 leading-relaxed">
					Use the analyzer to learn which patterns of clues are most informative, not to copy a specific sequence. After 10-20 analyzed games, most players develop an intuition for which letter patterns split the pool well — and they stop needing the tool for the hardest decisions.
				</p>
			</section>

			<div class="rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
				<FAQSection class="py-0" {faqs} title="Wordle Analyzer FAQs" />
			</div>

			<section class="rounded-3xl bg-slate-100 p-8 text-center space-y-6">
				<h2 class="text-2xl font-bold text-slate-900">More Solvers</h2>
				<div class="flex flex-wrap justify-center gap-3">
					<a href="/5-letter-wordle-solver" class="px-5 py-2.5 bg-white rounded-xl font-semibold text-slate-700 shadow-sm hover:shadow-md transition-shadow">5-Letter Wordle Solver</a>
					<a href="/nerdle-solver" class="px-5 py-2.5 bg-white rounded-xl font-semibold text-slate-700 shadow-sm hover:shadow-md transition-shadow">Nerdle Solver</a>
					<a href="/boggle-solver" class="px-5 py-2.5 bg-white rounded-xl font-semibold text-slate-700 shadow-sm hover:shadow-md transition-shadow">Boggle Solver</a>
					<a href="/weaver-solver" class="px-5 py-2.5 bg-white rounded-xl font-semibold text-slate-700 shadow-sm hover:shadow-md transition-shadow">Weaver Solver</a>
				</div>
			</section>
		</article>
	</div>
</main>