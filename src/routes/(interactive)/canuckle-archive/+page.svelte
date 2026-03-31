<script lang="ts">
	import { fetchArchive } from '$lib/canuckle';
	import { generateCollectionPageSchema } from '$lib/seo';

	const archiveResponse = fetchArchive();
	const archive = archiveResponse.success && archiveResponse.data ? archiveResponse.data : [];

	const collectionSchema = generateCollectionPageSchema(
		'Canuckle Answer Archive',
		'Complete archive of all Canuckle puzzle answers with puzzle numbers, dates, and fun facts about Canada.',
		'https://wordsolver.tech/canuckle-archive',
		archive.map((entry) => ({
			name: `Canuckle #${entry.puzzleNumber} - ${entry.word}`,
			url: `https://wordsolver.tech/canuckle-archive#puzzle-${entry.puzzleNumber}`
		}))
	);
</script>

<svelte:head>
	<title>Canuckle Archive - Complete History of All Canuckle Answers | WordSolverX</title>
	<meta
		name="description"
		content="Browse the complete archive of all Canuckle puzzle answers. View puzzle numbers, dates, words, and fun Canadian facts for every past Canuckle puzzle."
	/>
	<meta
		name="keywords"
		content="canuckle archive, past canuckle answers, canuckle answer history, canuckle puzzle list, canadian wordle archive, all canuckle answers"
	/>
	<link rel="canonical" href="https://wordsolver.tech/canuckle-archive" />
	<meta property="og:title" content="Canuckle Archive - All Past Canuckle Answers | WordSolverX" />
	<meta
		property="og:description"
		content="Complete history of every Canuckle answer. Browse puzzle numbers, dates, and fun facts."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://wordsolver.tech/canuckle-archive" />
	<meta property="og:site_name" content="WordSolverX" />
	<meta property="og:image" content="https://wordsolver.tech/wordsolverx.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Canuckle Archive - All Past Canuckle Answers | WordSolverX" />
	<meta
		name="twitter:description"
		content="Complete history of every Canuckle answer with puzzle numbers, dates, and fun facts."
	/>
	<meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
	{@html `<script type="application/ld+json">${JSON.stringify(collectionSchema)}</script>`}
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-red-950">
	<section class="bg-gradient-to-r from-red-600 to-red-700 py-16 shadow-lg">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1 class="text-4xl font-extrabold text-white sm:text-6xl tracking-tight">
					Canuckle Archive
				</h1>
				<p class="mt-6 max-w-3xl mx-auto text-xl text-white/95 sm:text-2xl font-medium leading-relaxed">
					Browse every Canuckle puzzle answer with fun facts about Canada.
				</p>
			</div>
		</div>
	</section>

	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		{#if archive.length === 0}
			<div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Archive Data Available</h2>
				<p class="text-gray-500">Could not load the Canuckle archive at this time.</p>
			</div>
		{:else}
			<div class="space-y-6">
				{#each archive as entry (entry.puzzleNumber)}
					<div id="puzzle-{entry.puzzleNumber}" class="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700 scroll-mt-28">
						<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
							<div>
								<p class="text-sm font-semibold uppercase tracking-[0.24em] text-red-600 dark:text-red-300">
									Puzzle #{entry.puzzleNumber}
								</p>
								<p class="text-gray-600 dark:text-gray-400 text-sm mt-1">{entry.date}</p>
							</div>
							<div class="text-sm text-gray-500 dark:text-gray-400">
								Avg guesses: <span class="font-bold text-red-600 dark:text-red-400">{entry.avgGuesses}</span>
							</div>
						</div>

						<div class="flex gap-3 mb-6">
							{#each entry.word.toUpperCase().split('') as letter}
								<div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold bg-red-500 text-white border-2 border-red-600 shadow-md">
									{letter}
								</div>
							{/each}
						</div>

						<div class="bg-red-50 dark:bg-red-900/20 rounded-2xl p-5 border border-red-100 dark:border-red-800/30">
							<h3 class="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
								<span class="text-red-500">🍁</span> Fun Fact
							</h3>
							<p class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{entry.funFact}</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
