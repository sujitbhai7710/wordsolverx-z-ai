<script lang="ts">
	import { onMount } from 'svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data }: {
		data: {
			todayKey: string;
			formattedDate: string;
			todayEntry: { date: string; word: string; puzzle: number };
			previousEntry: { date: string; word: string; puzzle: number } | null;
			last30Entries: { date: string; word: string; puzzle: number }[];
			stats: { totalSolutions: number; totalArchived: number; latestStoredDate: string | null };
			meta: { title: string; description: string; keywords?: string };
		};
	} = $props();

	let countdown = $state('00:00:00');
	let revealed = $state(false);

	function getNextIstMidnight() {
		const now = new Date();
		const formatter = new Intl.DateTimeFormat('en-CA', {
			timeZone: 'Asia/Kolkata',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
		const parts = formatter.formatToParts(now);
		const year = Number(parts.find((part) => part.type === 'year')?.value ?? 0);
		const month = Number(parts.find((part) => part.type === 'month')?.value ?? 0);
		const day = Number(parts.find((part) => part.type === 'day')?.value ?? 0);
		const nextUtcMs = Date.UTC(year, month - 1, day, 18, 30, 0, 0) + 86_400_000;
		return new Date(nextUtcMs);
	}

	function updateCountdown() {
		const diff = getNextIstMidnight().getTime() - Date.now();
		if (diff <= 0) {
			countdown = '00:00:00';
			return;
		}
		const hours = Math.floor(diff / 3_600_000);
		const minutes = Math.floor((diff % 3_600_000) / 60_000);
		const seconds = Math.floor((diff % 60_000) / 1_000);
		countdown = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	}

	onMount(() => {
		updateCountdown();
		const interval = setInterval(updateCountdown, 1000);
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<meta name="keywords" content={data.meta.keywords ?? 'worgle answer today, worgle archive'} />
	<link rel="canonical" href="https://wordsolver.tech/worgle-answer-today" />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://wordsolver.tech/worgle-answer-today" />
</svelte:head>

<div class="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_42%,#f3f4f6_100%)] px-4 py-10 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-5xl">
		<Breadcrumbs />

		<header class="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(30,41,59,0.12),transparent_34%),linear-gradient(135deg,#ffffff_0%,#f8fafc_48%,#f1f5f9_100%)] p-8 shadow-lg sm:p-10">
			<p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">Daily Worgle</p>
			<h1 class="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Worgle Answer Today</h1>
			<p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
				The current Worgle answer for <span class="font-semibold text-slate-900">{data.formattedDate}</span>, plus the running puzzle number and archive links.
			</p>
			<div class="mt-7 flex flex-wrap gap-3">
				<a
					href="#worgle-answer-card"
					class="inline-flex items-center rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
				>
					Jump to Answer
				</a>
				<a
					href="/worgle-archive"
					class="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
				>
					Open Worgle Archive
				</a>
			</div>
		</header>

		<section id="worgle-answer-card" class="mt-10 grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
			<div class="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
				<p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Puzzle #{data.todayEntry.puzzle}</p>
				<h2 class="mt-2 text-3xl font-black text-slate-900">Today&apos;s Worgle answer</h2>
				<p class="mt-3 text-base leading-7 text-slate-600">
					Worgle follows a deterministic answer list, so this page stays in sync with the current IST puzzle window and the local archive.
				</p>

				<div class="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
					{#if revealed}
						<div class="flex flex-wrap gap-2">
							{#each data.todayEntry.word.toUpperCase().split('') as letter}
								<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-black text-white">
									{letter}
								</div>
							{/each}
						</div>
						<button
							type="button"
							class="mt-5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
							onclick={() => (revealed = false)}
						>
							Hide answer
						</button>
					{:else}
						<div class="flex flex-wrap gap-2">
							{#each data.todayEntry.word.toUpperCase().split('') as _}
								<div class="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-300 bg-white text-lg font-black text-slate-300">
									?
								</div>
							{/each}
						</div>
						<button
							type="button"
							class="mt-5 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
							onclick={() => (revealed = true)}
						>
							Reveal answer
						</button>
					{/if}
				</div>

				{#if data.previousEntry}
					<p class="mt-5 text-sm text-slate-600">
						Yesterday&apos;s answer was <span class="font-semibold text-slate-900">{data.previousEntry.word.toUpperCase()}</span> for puzzle #{data.previousEntry.puzzle}.
					</p>
				{/if}
			</div>

			<div class="space-y-6">
				<div class="rounded-[2rem] bg-slate-900 p-6 text-white shadow-lg">
					<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Next reset</p>
					<p class="mt-4 text-4xl font-black">{countdown}</p>
					<p class="mt-3 text-sm leading-6 text-slate-300">
						Worgle rolls over at midnight IST. This countdown follows that schedule.
					</p>
				</div>
				<div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
					<h3 class="text-xl font-black text-slate-900">Quick stats</h3>
					<div class="mt-4 space-y-3 text-sm text-slate-600">
						<div class="flex items-center justify-between gap-4">
							<span>Total solutions in rotation</span>
							<span class="font-bold text-slate-900">{data.stats.totalSolutions}</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Archive entries stored</span>
							<span class="font-bold text-slate-900">{data.stats.totalArchived}</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Latest stored date</span>
							<span class="font-bold text-slate-900">{data.stats.latestStoredDate ?? 'Unknown'}</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
			<h2 class="text-2xl font-black text-slate-900">Recent Worgle answers</h2>
			<p class="mt-3 text-base leading-7 text-slate-600">
				The latest 30 archived Worgle answers, newest first.
			</p>
			<div class="mt-6 grid gap-3 sm:grid-cols-2">
				{#each data.last30Entries as entry}
					<div class="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
						<div>
							<p class="text-sm font-semibold text-slate-500">{entry.date}</p>
							<p class="mt-1 text-xl font-black text-slate-900">{entry.word.toUpperCase()}</p>
						</div>
						<p class="text-sm font-semibold text-slate-600">#{entry.puzzle}</p>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>
