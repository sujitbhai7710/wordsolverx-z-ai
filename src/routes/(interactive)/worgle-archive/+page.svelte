<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
	import { fetchArchivePayload } from '$lib/archive-client';

	interface WorgleArchivePayload {
		availableDateStrings: string[];
		selectedDateKey: string | null;
		selectedWorgle: {
			date: string;
			word: string;
			puzzle: number;
			formattedDate: string;
		} | null;
	}

	let data = $state<WorgleArchivePayload>({
		availableDateStrings: [],
		selectedDateKey: null,
		selectedWorgle: null
	});
	let isLoading = $state(false);
	let loadError = $state<string | null>(null);
	let selectedDateParam = $state<string | null>(
		browser ? new URL(window.location.href).searchParams.get('date') : null
	);

	const startDate = new Date('2021-06-19T12:00:00Z');
	let availableDates = $derived(
		(data.availableDateStrings ?? []).map((dateString) => new Date(`${dateString}T12:00:00`))
	);

	onMount(() => {
		if (window.location.search || window.location.hash) {
			window.history.replaceState(window.history.state, '', window.location.pathname);
		}
	});

	function handleDateSelect(dateKey: string): void {
		selectedDateParam = dateKey;
	}

	async function loadArchive(dateKey: string | null): Promise<void> {
		if (!dateKey) {
			data.selectedDateKey = null;
			data.selectedWorgle = null;
			isLoading = false;
			loadError = null;
			return;
		}

		const requestDateKey = dateKey;
		isLoading = true;
		loadError = null;

		try {
			const payload = await fetchArchivePayload<WorgleArchivePayload>('worgle', requestDateKey);

			if (selectedDateParam !== requestDateKey) {
				return;
			}

			data = payload;
		} catch (error) {
			if (selectedDateParam !== requestDateKey) {
				return;
			}

			data.selectedDateKey = requestDateKey;
			data.selectedWorgle = null;
			loadError = error instanceof Error ? error.message : 'Failed to load the Worgle archive entry.';
		} finally {
			if (selectedDateParam === requestDateKey) {
				isLoading = false;
			}
		}
	}

	$effect(() => {
		if (!browser) {
			return;
		}

		void loadArchive(selectedDateParam);
	});
</script>

<svelte:head>
	<title>Worgle Archive - All Past Answers | WordSolverX</title>
	<meta name="description" content="Browse the Worgle archive by date with puzzle numbers and direct answer lookups." />
	<link rel="canonical" href="https://wordsolver.tech/worgle-archive" />
</svelte:head>

<ArchiveCalendar
	gameName="Worgle"
	gameColor="indigo"
	gameIcon="Wo"
	{startDate}
	{availableDates}
	basePath="/worgle-archive"
	selectedDate={data.selectedDateKey}
	description="Every stored Worgle answer with the matching puzzle number."
	onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="mx-auto max-w-5xl scroll-mt-28 px-4 pb-14 sm:px-6 lg:px-8">
	{#if data.selectedWorgle}
		<div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
			<p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Selected archive date</p>
			<h2 class="mt-3 text-3xl font-black text-slate-900">
				Worgle answer for {data.selectedWorgle.formattedDate}
			</h2>
			<div class="mt-6 grid gap-6 md:grid-cols-[1fr_0.8fr]">
				<div class="rounded-3xl border border-slate-200 bg-slate-50 p-6">
					<p class="text-sm font-semibold text-slate-500">Puzzle #{data.selectedWorgle.puzzle}</p>
					<div class="mt-4 flex flex-wrap gap-2">
						{#each data.selectedWorgle.word.toUpperCase().split('') as letter}
							<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-black text-white">
								{letter}
							</div>
						{/each}
					</div>
				</div>
				<div class="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white">
					<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Archive note</p>
					<p class="mt-4 text-sm leading-7 text-slate-200">
						Worgle is deterministic, so the archive doubles as a date-by-date lookup table and a puzzle-number history.
					</p>
				</div>
			</div>
		</div>
	{:else if loadError}
		<div class="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
			<h2 class="text-2xl font-bold text-rose-900">We couldn't load that Worgle date</h2>
			<p class="mt-3 text-rose-700">{loadError}</p>
		</div>
	{:else if isLoading && data.selectedDateKey}
		<div class="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
			<h2 class="text-2xl font-bold text-slate-900">Loading Worgle archive entry...</h2>
			<p class="mt-3 text-slate-600">Pulling the selected answer into the archive view now.</p>
		</div>
	{:else}
		<div class="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
			<h2 class="text-2xl font-bold text-slate-900">Choose a Worgle date above</h2>
			<p class="mt-3 text-slate-600">The selected word and puzzle number will appear here.</p>
		</div>
	{/if}
</section>
