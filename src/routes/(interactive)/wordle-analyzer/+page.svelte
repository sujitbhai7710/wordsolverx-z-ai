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

	const pageTitle = 'Wordle Analyzer - Replay and Grade Any Finished Wordle | WordSolverX';
	const pageDescription =
		'Use the Wordle Analyzer to replay a finished Wordle, compare each turn against an AI line, check hard mode rule breaks, and generate spoiler-safe share links.';
	const pageUrl = 'https://wordsolver.tech/wordle-analyzer';

	const faqs = [
		{
			question: 'How is this different from the regular Wordle solver?',
			answer:
				'The solver helps you decide the next move during a live puzzle, while the Wordle Analyzer reviews a completed game and grades each turn after the answer is known.'
		},
		{
			question: 'Do shared links spoil the answer immediately?',
			answer:
				'No. Shared analyzer links use an encoded query string and the page shows a spoiler warning before it reveals the finished game.'
		},
		{
			question: 'Can the analyzer check hard mode mistakes?',
			answer:
				'Yes. If you mark the game as hard mode, the report flags guesses that ignored locked greens or skipped required letters.'
		}
	];

	const schemas = JSON.stringify([
		generateFAQSchema(faqs),
		generateHowToSchema('How to use the Wordle Analyzer', [
			{
				name: 'Enter your guesses',
				text: 'Add the guesses you played in order, then place the final answer in the last row.'
			},
			{
				name: 'Run the replay',
				text: 'Start the analyzer to rebuild each clue pattern and compare your line against the AI alternative.'
			},
			{
				name: 'Share or review the report',
				text: 'Copy the spoiler-safe link or the emoji recap after the analysis finishes.'
			}
		]),
		{
			...generateSoftwareApplicationSchema('Wordle Analyzer', 'GameApplication'),
			keywords: ['wordle analyzer', 'wordle replay', 'wordle bot alternative', 'wordle game review']
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

	<div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
			<FAQSection class="py-0" {faqs} title="Wordle Analyzer FAQs" />
		</div>
	</div>
</main>
