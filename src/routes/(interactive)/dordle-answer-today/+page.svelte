<script lang="ts">
	let { data } = $props();

	let countdown = $state(data.countdown);
	let timerInterval: ReturnType<typeof setInterval> | undefined;

	import { onMount, onDestroy } from 'svelte';
	import { getTimeUntilNextDaily } from '$lib/dordle';
	import AuthorCard from '$lib/components/AuthorCard.svelte';
	import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
	import {
		PRESTON_HAYES_AUTHOR_DESCRIPTION,
		PRESTON_HAYES_AUTHOR_IMAGE,
		PRESTON_HAYES_AUTHOR_NAME
	} from '$lib/authors';

	onMount(() => {
		timerInterval = setInterval(() => {
			countdown = getTimeUntilNextDaily();
		}, 1000);
	});

	onDestroy(() => {
		if (timerInterval) clearInterval(timerInterval);
	});

	function padZero(n: number): string {
		return n.toString().padStart(2, '0');
	}
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<meta name="keywords" content={data.meta.keywords} />
	<link rel="canonical" href="https://wordsolver.tech/dordle-answer-today" />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:url" content="https://wordsolver.tech/dordle-answer-today" />
	<meta property="og:site_name" content="WordSolverX" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.meta.title} />
	<meta name="twitter:description" content={data.meta.description} />
	{@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<div class="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen font-sans">
	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<!-- Header -->
		<header class="text-center mb-12">
			<div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-4">
				<span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
				Updated Daily
			</div>
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
				Dordle Answer for Today
			</h1>
			<p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
				<span class="font-semibold text-gray-900 dark:text-white">{data.formattedDate}</span> —
				Puzzle <span class="font-bold text-emerald-600">#{data.seed}</span>
			</p>
		</header>

		<!-- Navigation links -->
		<div class="flex flex-wrap justify-center gap-3 mb-12">
			<a
				href="/dordle-solver"
				class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-sm transition-all"
			>
				Dordle Solver
			</a>
			<a
				href="/dordle-archive"
				class="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
			>
				Browse Archive
			</a>
		</div>

		<!-- Answer Display -->
		<section class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 mb-12">
			<div class="text-center mb-8">
				<p class="text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
					Today's Dordle Answers
				</p>
				<p class="text-gray-500 dark:text-gray-400">
					Puzzle #{data.seed} — {data.formattedDate}
				</p>
			</div>

			<!-- Two words side by side -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-xl mx-auto">
				<!-- Word 1 -->
				<div class="text-center">
					<p class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Word 1</p>
					<div class="flex justify-center gap-2">
						{#each data.answer1.toUpperCase().split('') as letter}
							<span class="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl bg-green-500 text-white font-bold text-2xl shadow-md">
								{letter}
							</span>
						{/each}
					</div>
				</div>

				<!-- Word 2 -->
				<div class="text-center">
					<p class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Word 2</p>
					<div class="flex justify-center gap-2">
						{#each data.answer2.toUpperCase().split('') as letter}
							<span class="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl bg-emerald-500 text-white font-bold text-2xl shadow-md">
								{letter}
							</span>
						{/each}
					</div>
				</div>
			</div>
		</section>

		<!-- Countdown -->
		<section class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl shadow-xl p-8 mb-12 text-center text-white">
			<h2 class="text-2xl font-bold mb-4">Next Dordle In</h2>
			<div class="flex justify-center gap-4 sm:gap-6">
				<div class="bg-white/20 rounded-2xl p-4 min-w-[80px]">
					<span class="block text-3xl sm:text-4xl font-extrabold">{padZero(countdown.hours)}</span>
					<span class="text-sm uppercase tracking-wider opacity-80">Hours</span>
				</div>
				<div class="bg-white/20 rounded-2xl p-4 min-w-[80px]">
					<span class="block text-3xl sm:text-4xl font-extrabold">{padZero(countdown.minutes)}</span>
					<span class="text-sm uppercase tracking-wider opacity-80">Minutes</span>
				</div>
				<div class="bg-white/20 rounded-2xl p-4 min-w-[80px]">
					<span class="block text-3xl sm:text-4xl font-extrabold">{padZero(countdown.seconds)}</span>
					<span class="text-sm uppercase tracking-wider opacity-80">Seconds</span>
				</div>
			</div>
			<p class="mt-4 text-white/80 text-sm">Resets daily at midnight IST</p>
		</section>

		<!-- Seed Info -->
		<section class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-12">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Puzzle Details</h2>
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
				<div class="text-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
					<span class="block text-sm text-gray-500 dark:text-gray-400 mb-1">Seed Number</span>
					<span class="text-2xl font-bold text-gray-900 dark:text-white">#{data.seed}</span>
				</div>
				<div class="text-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
					<span class="block text-sm text-gray-500 dark:text-gray-400 mb-1">Date</span>
					<span class="text-2xl font-bold text-gray-900 dark:text-white">{data.formattedDate}</span>
				</div>
				<div class="text-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
					<span class="block text-sm text-gray-500 dark:text-gray-400 mb-1">Total Words</span>
					<span class="text-2xl font-bold text-gray-900 dark:text-white">2</span>
				</div>
			</div>
		</section>

		<!-- FAQ -->
		<article class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 mb-12">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
			<div class="space-y-4">
				<details class="group bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100 dark:border-green-800/30 overflow-hidden" open>
					<summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-green-100/50 dark:hover:bg-green-800/20 transition-colors">
						<span>What is the Dordle answer for today, {data.formattedDate}?</span>
						<svg class="w-5 h-5 text-green-600 dark:text-green-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</summary>
					<div class="p-5 pt-0 text-gray-600 dark:text-gray-300">
						The Dordle answers for today, {data.formattedDate} (Puzzle #{data.seed}), are <span class="font-bold text-gray-900 dark:text-white uppercase">{data.answer1}</span> and <span class="font-bold text-gray-900 dark:text-white uppercase">{data.answer2}</span>.
					</div>
				</details>
				<details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
					<summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
						<span>When does Dordle reset?</span>
						<svg class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</summary>
					<div class="p-5 pt-0 text-gray-600 dark:text-gray-300">
						Dordle resets every day at midnight IST (Indian Standard Time). A new pair of five-letter words is selected using a deterministic seed algorithm.
					</div>
				</details>
				<details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
					<summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
						<span>How many guesses do you get in Dordle?</span>
						<svg class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</summary>
					<div class="p-5 pt-0 text-gray-600 dark:text-gray-300">
						You get 7 guesses to solve both five-letter words in Dordle. Each guess applies to both boards simultaneously, so choose your words wisely.
					</div>
				</details>
			</div>
		</article>

		<!-- SEO Content -->
		<article class="space-y-8">
			<section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
				<h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">What is Dordle?</h2>
				<p class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
					Dordle challenges you to solve two Wordle puzzles at the same time with the same guesses. Each word you enter is checked against both boards, and you get color-coded feedback for each. You have 7 guesses to find both words — making it significantly harder than the original Wordle.
				</p>
				<p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
					The game uses a deterministic algorithm based on a daily seed number, meaning every player worldwide gets the same two words each day. This makes comparing scores and strategies with friends easy and fun.
				</p>
			</section>

			<section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
				<h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">How to Play Dordle Better</h2>
				<div class="space-y-4 text-lg text-gray-600 dark:text-gray-300">
					<p class="leading-relaxed">
						Your opening moves matter a lot in Dordle. Start with words that cover the most common letters — vowels and frequent consonants like S, T, R, N, and L. Information gathering is key because you only have 7 guesses for two puzzles.
					</p>
					<p class="leading-relaxed">
						Pay attention to which board gives you more information. If one board has several green and yellow tiles while the other is mostly gray, focus your next guess on narrowing down the harder board.
					</p>
					<p class="leading-relaxed">
						Our <a href="/dordle-solver" class="text-green-600 dark:text-green-400 hover:underline font-semibold">Dordle Solver</a> can help when you're stuck — enter your guesses and get data-driven suggestions for the optimal next word.
					</p>
				</div>
			</section>
		</article>

		<!-- Author -->
		<div class="mt-12">
			<AuthorCard
				name={PRESTON_HAYES_AUTHOR_NAME}
				image={PRESTON_HAYES_AUTHOR_IMAGE}
				description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
			/>
		</div>

		<InternalLinkSection currentGame="Dordle" />
	</div>
</div>
