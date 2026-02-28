<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import FAQSection from '$lib/components/FAQSection.svelte';
	import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
	import type { SpotleArtist, SpotleAnswer } from '$lib/spotle';

	type SpotleDay = {
		date: string;
		dayNumber: number;
		artistName: string;
		artist: SpotleArtist | null;
	};

	const props = $props() as {
		data: {
			todayStr: string;
			todayFormatted: string;
			todayAnswer: SpotleAnswer | null;
			todayArtist: SpotleArtist | null;
			artists: SpotleArtist[];
			answers: SpotleAnswer[];
			last30Days: SpotleDay[];
			faqItems: { question: string; answer: string }[];
			schemaJson: string;
			meta: { title: string; description: string };
			labels: { countryNames: Record<string, string>; genderNames: Record<string, string> };
		};
	};

	const pageData = $derived(props.data);
	const todayStr = $derived(pageData.todayStr);
	const todayFormatted = $derived(pageData.todayFormatted);
	const todayAnswer = $derived(pageData.todayAnswer);
	const todayArtist = $derived(pageData.todayArtist);
	const artists = $derived(pageData.artists);
	const answers = $derived(pageData.answers);
	const faqItems = $derived(pageData.faqItems);
	const schemaJson = $derived(pageData.schemaJson);
	const meta = $derived(pageData.meta);
	const labels = $derived(pageData.labels);

	const todayDate = new Date();
	todayDate.setHours(0, 0, 0, 0);
	let selectedMonth = $state(new Date());
	let selectedDay = $state<SpotleDay | null>(null);

	const calendarDays = $derived.by(() => {
		const monthStart = startOfMonth(selectedMonth);
		const monthEnd = endOfMonth(selectedMonth);
		const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
		const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
		const days: Date[] = [];
		let cursor = gridStart;
		while (cursor <= gridEnd) {
			days.push(new Date(cursor));
			cursor = addDays(cursor, 1);
		}
		return days;
	});

	const answerLookup = $derived.by(() => {
		const map = new Map<string, SpotleDay>();
		for (const answer of answers) {
			const artist =
				artists.find((entry) => entry.artist.toLowerCase() === answer.artist.toLowerCase()) ??
				null;
			map.set(answer.date, {
				date: answer.date,
				dayNumber: answer.dayNumber,
				artistName: answer.artist,
				artist
			});
		}
		return map;
	});

	function prevMonth() {
		selectedMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1);
	}

	function nextMonth() {
		selectedMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1);
	}

	function pickDay(dateStr: string) {
		const entry = answerLookup.get(dateStr) ?? null;
		selectedDay = entry;
	}
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
	<link rel="canonical" href="https://wordsolverx.com/spotle-answer-today" />
	<meta property="og:title" content={meta.title} />
	<meta property="og:description" content={meta.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://wordsolverx.com/spotle-answer-today" />
	<meta property="og:site_name" content="WordSolverX" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={meta.title} />
	<meta name="twitter:description" content={meta.description} />
	{@html `<script type="application/ld+json">${schemaJson}</script>`}
</svelte:head>

<div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
	<div class="max-w-6xl mx-auto">
		<Breadcrumbs />

		<header class="text-center mb-10">
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Spotle Answer</p>
			<h1 class="text-4xl sm:text-5xl font-black text-gray-900 mt-3">
				Spotle Answer Today
			</h1>
			<p class="text-lg text-gray-500 mt-3">{todayFormatted}</p>
		</header>

		<section class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
			<div class="lg:col-span-2 bg-white border border-gray-200 rounded-3xl shadow-lg p-6">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">Today&apos;s Artist</h2>
				{#if todayArtist}
					<div class="flex flex-col md:flex-row gap-6 items-center md:items-start">
						<div class="flex-1">
							<p class="text-sm font-semibold text-emerald-600">Day #{todayAnswer?.dayNumber}</p>
							<h3 class="text-3xl font-black text-gray-900 mt-2">{todayArtist.artist}</h3>
							<p class="text-gray-500 mt-1">
								{labels.countryNames[todayArtist.country] ?? todayArtist.country.toUpperCase()} - {todayArtist.genre}
							</p>
							<div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 text-sm">
								<div class="bg-gray-50 border border-gray-200 rounded-xl p-3">
									<p class="text-xs text-gray-500">Rank</p>
									<p class="font-semibold text-gray-900">#{todayArtist.index + 1}</p>
								</div>
								<div class="bg-gray-50 border border-gray-200 rounded-xl p-3">
									<p class="text-xs text-gray-500">Debut</p>
									<p class="font-semibold text-gray-900">{todayArtist.debut_album_year}</p>
								</div>
								<div class="bg-gray-50 border border-gray-200 rounded-xl p-3">
									<p class="text-xs text-gray-500">Group</p>
									<p class="font-semibold text-gray-900">
										{todayArtist.group_size === 1 ? 'Solo' : `${todayArtist.group_size} members`}
									</p>
								</div>
								<div class="bg-gray-50 border border-gray-200 rounded-xl p-3">
									<p class="text-xs text-gray-500">Gender</p>
									<p class="font-semibold text-gray-900">
										{labels.genderNames[todayArtist.gender] ?? todayArtist.gender}
									</p>
								</div>
							</div>
						</div>
					</div>
				{:else}
					<div class="text-gray-500">
						Answer not available for today. Check the calendar below for recent answers.
					</div>
				{/if}
			</div>

			<div class="bg-white border border-gray-200 rounded-3xl shadow-lg p-6">
				<h3 class="text-xl font-bold text-gray-900 mb-3">Quick Stats</h3>
				<div class="space-y-3 text-sm text-gray-600">
					<div class="flex items-center justify-between">
						<span>Total Artists</span>
						<span class="font-semibold text-gray-900">{artists.length}</span>
					</div>
					<div class="flex items-center justify-between">
						<span>Total Answers</span>
						<span class="font-semibold text-gray-900">{answers.length}</span>
					</div>
					<div class="flex items-center justify-between">
						<span>Latest Day</span>
						<span class="font-semibold text-gray-900">#{todayAnswer?.dayNumber ?? '-'}</span>
					</div>
				</div>
			</div>
		</section>

		<section class="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 mb-12">
			<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
				<div>
					<h2 class="text-2xl font-bold text-gray-900">Calendar Archive</h2>
					<p class="text-gray-500 text-sm">Tap a day to reveal the answer.</p>
				</div>
				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={prevMonth}
						class="h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
					>
						&lt;
					</button>
					<div class="text-sm font-semibold text-gray-900 min-w-[140px] text-center">
						{format(selectedMonth, 'MMMM yyyy')}
					</div>
					<button
						type="button"
						onclick={nextMonth}
						class="h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
					>
						&gt;
					</button>
				</div>
			</div>

			<div class="max-w-md">
				<div class="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 shadow-sm">
					<div class="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-emerald-700 mb-3">
						{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
							<div>{day}</div>
						{/each}
					</div>

					<div class="grid grid-cols-7 gap-1">
						{#each calendarDays as day}
							{@const dateStr = format(day, 'yyyy-MM-dd')}
							{@const entry = answerLookup.get(dateStr)}
							{@const inMonth = isSameMonth(day, selectedMonth)}
							{@const isFuture = day > todayDate}
							<button
								type="button"
								disabled={isFuture || !entry}
								onclick={() => entry && !isFuture && pickDay(dateStr)}
								class={`h-9 w-9 rounded-full text-xs font-semibold flex items-center justify-center transition ${
									entry && !isFuture
										? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
										: 'bg-white text-gray-300 border border-emerald-100'
								} ${!inMonth ? 'opacity-30' : ''} ${isFuture ? 'cursor-not-allowed opacity-30' : ''} ${isSameDay(day, todayDate) ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-white' : ''}`}
							>
								{format(day, 'd')}
							</button>
						{/each}
					</div>
				</div>

				{#if selectedDay}
					<div class="mt-4 border border-emerald-100 bg-emerald-50 rounded-2xl p-4">
						<p class="text-xs uppercase tracking-[0.2em] text-emerald-600">
							{format(new Date(selectedDay.date), 'MMMM d, yyyy')}
						</p>
						<div class="flex gap-3 mt-3 items-center">
							<div>
								<p class="text-sm text-emerald-700 font-semibold">Day #{selectedDay.dayNumber}</p>
								<p class="text-lg font-black text-gray-900">{selectedDay.artistName}</p>
								{#if selectedDay.artist}
									<p class="text-xs text-gray-600 mt-1">
										#{selectedDay.artist.index + 1} - {selectedDay.artist.genre} -
										{labels.countryNames[selectedDay.artist.country] ??
										selectedDay.artist.country.toUpperCase()}
									</p>
								{/if}
							</div>
						</div>
					</div>
				{:else}
					<div class="mt-4 rounded-2xl border border-dashed border-emerald-100 bg-white/70 p-4 text-sm text-gray-500">
						Select a date with an answer to see the artist.
					</div>
				{/if}
			</div>

		</section>

		<FAQSection title="Spotle Answers FAQ (Last 30 Days)" faqs={faqItems} />
	</div>
</div>
