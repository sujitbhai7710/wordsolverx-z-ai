<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
	import { getDailyAnswers, getDateFromSeed, formatDate, formatSeed, getSeedForDate } from '$lib/dordle';
	import { ANSWER_WORDS } from '$lib/dordle-words';

	const startDate = new Date(2022, 0, 24);

	let selectedSeedParam = $derived(browser ? page.url.searchParams.get('seed') : null);
	let selectedDateParam = $derived(browser ? page.url.searchParams.get('date') : null);

	let selectedSeed = $state<number | null>(null);
	let selectedAnswers = $state<[string, string] | null>(null);
	let selectedFormattedDate = $state('');

	function loadSeed(seed: number) {
		const [a1, a2] = getDailyAnswers(seed, ANSWER_WORDS);
		const date = getDateFromSeed(seed);
		selectedSeed = seed;
		selectedAnswers = [a1, a2];
		selectedFormattedDate = formatDate(date);
	}

	function loadDate(dateKey: string) {
		const date = new Date(`${dateKey}T12:00:00Z`);
		const seed = getSeedForDate(date);
		loadSeed(seed);
	}

	$effect(() => {
		if (!browser) return;
		if (selectedSeedParam) {
			loadSeed(parseInt(selectedSeedParam, 10));
		} else if (selectedDateParam) {
			loadDate(selectedDateParam);
		} else {
			selectedSeed = null;
			selectedAnswers = null;
			selectedFormattedDate = '';
		}
	});

	// Build seed list for quick seed selector
	const today = new Date();
	const currentSeed = getSeedForDate(today);
	const seedOptions = Array.from({ length: Math.min(currentSeed, 50) }, (_, i) => currentSeed - i);
</script>

<svelte:head>
	<title>Dordle Archive - Complete Dual-Word Answer History | WordSolverX</title>
	<meta
		name="description"
		content="Browse the complete archive of all Dordle answers. Every past dual-word puzzle solution with calendar view and seed search."
	/>
	<link rel="canonical" href="https://wordsolver.tech/dordle-archive" />
	<meta property="og:title" content="Dordle Archive - All Past Dual-Word Answers" />
	<meta
		property="og:description"
		content="Complete history of every Dordle answer. Browse by calendar date or seed number."
	/>
	<meta property="og:url" content="https://wordsolver.tech/dordle-archive" />
	<meta property="og:type" content="website" />
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Dordle Archive',
		description: 'Complete archive of all Dordle daily dual-word puzzle answers.',
		url: 'https://wordsolver.tech/dordle-archive',
		isPartOf: { '@type': 'WebSite', name: 'WordSolverX', url: 'https://wordsolver.tech' }
	})}</script>`}
</svelte:head>

<ArchiveCalendar
	gameName="Dordle"
	gameColor="green"
	gameIcon="Dl"
	{startDate}
	basePath="/dordle-archive"
	selectedDate={selectedDateParam}
	description="Every Dordle dual-word puzzle answer. Browse the complete daily challenge history."
/>

<!-- Seed Selector -->
<section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
	<div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-6">
		<h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Seed Lookup</h2>
		<div class="flex flex-wrap gap-2">
			{#each seedOptions as seed}
				<a
					href="/dordle-archive?seed={seed}#archive-answer"
					class="px-3 py-1.5 rounded-lg text-sm font-mono font-semibold transition-colors
						{selectedSeed === seed
							? 'bg-green-600 text-white'
							: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400'}"
				>
					#{seed}
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Selected Answer -->
<section id="archive-answer" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
	{#if selectedAnswers && selectedSeed !== null}
		<div class="mb-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
			<div class="mb-8 text-center">
				<p class="text-sm font-semibold uppercase tracking-[0.24em] text-green-600 dark:text-green-300">Archive Entry</p>
				<h2 class="mt-3 text-3xl font-black text-gray-900 dark:text-white">
					Dordle #{selectedSeed} — {selectedFormattedDate}
				</h2>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-xl mx-auto">
				<div class="text-center">
					<p class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Word 1</p>
					<div class="flex justify-center gap-2">
						{#each selectedAnswers[0].toUpperCase().split('') as letter}
							<span class="w-14 h-14 flex items-center justify-center rounded-xl bg-green-500 text-white font-bold text-2xl shadow-md">
								{letter}
							</span>
						{/each}
					</div>
				</div>
				<div class="text-center">
					<p class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Word 2</p>
					<div class="flex justify-center gap-2">
						{#each selectedAnswers[1].toUpperCase().split('') as letter}
							<span class="w-14 h-14 flex items-center justify-center rounded-xl bg-emerald-500 text-white font-bold text-2xl shadow-md">
								{letter}
							</span>
						{/each}
					</div>
				</div>
			</div>

			<div class="mt-8 text-center">
				<a
					href="/dordle-answer-today"
					class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all"
				>
					See Today's Answer
				</a>
			</div>
		</div>
	{:else}
		<div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Select a date or seed above</h2>
			<p class="mt-3 text-gray-600 dark:text-gray-300">
				Choose a date from the calendar or pick a seed number to view past Dordle answers.
			</p>
		</div>
	{/if}
</section>
