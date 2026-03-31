<script lang="ts">
	import AuthorCard from '$lib/components/AuthorCard.svelte';
	import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
	import {
		PRESTON_HAYES_AUTHOR_DESCRIPTION,
		PRESTON_HAYES_AUTHOR_IMAGE,
		PRESTON_HAYES_AUTHOR_NAME
	} from '$lib/authors';

	let { data } = $props();
	let revealed = $state(false);

	const letterColors = $derived(
		data.answer?.word.toUpperCase().split('').map(() => 'bg-red-500 text-white border-red-600') ?? []
	);
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<meta name="keywords" content={data.meta.keywords ?? 'canuckle answer today, canuckle hint, canadian wordle'} />
	<link rel="canonical" href="https://wordsolver.tech/canuckle-answer-today" />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://wordsolver.tech/canuckle-answer-today" />
	<meta property="og:site_name" content="WordSolverX" />
	<meta property="og:image" content="https://wordsolver.tech/wordsolverx.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.meta.title} />
	<meta name="twitter:description" content={data.meta.description} />
	<meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
	{@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

{#if data.error || !data.answer}
	<div class="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
		<div class="text-center">
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Data</h1>
			<p class="text-gray-500">Could not retrieve today's Canuckle answer.</p>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-red-950 font-sans">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<header class="text-center mb-12">
				<h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-4">
					Canuckle Answer Today ({data.answer.date})
				</h1>
				<p class="text-lg text-gray-600 dark:text-gray-400">
					Today's Canuckle solution for <span class="font-semibold text-red-600 dark:text-red-400">{data.answer.date}</span>
				</p>
			</header>

			<div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-8">
				<div class="text-center mb-8">
					<p class="text-sm font-semibold uppercase tracking-[0.24em] text-red-600 dark:text-red-300 mb-2">
						Puzzle #{data.answer.puzzleNumber}
					</p>
					<p class="text-gray-600 dark:text-gray-400 text-sm">{data.answer.date}</p>
				</div>

				<div class="flex justify-center gap-3 mb-8">
					{#if revealed}
						{#each data.answer.word.toUpperCase().split('') as letter, i}
							<div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-bold {letterColors[i] ?? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'} border-2 shadow-md">
								{letter}
							</div>
						{/each}
					{:else}
						{#each Array(5) as _, i}
							<div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-bold bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-2 border-gray-300 dark:border-gray-600">
								?
							</div>
						{/each}
					{/if}
				</div>

				<div class="text-center">
					<button
						type="button"
						onclick={() => revealed = !revealed}
						class="px-8 py-3 rounded-xl bg-red-600 text-white font-bold text-lg shadow-lg shadow-red-200 dark:shadow-red-900/30 transition hover:bg-red-700"
					>
						{revealed ? 'Hide Answer' : 'Reveal Answer'}
					</button>
				</div>

				{#if revealed}
					<div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
						<div class="grid sm:grid-cols-2 gap-6">
							<div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5">
								<p class="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-1">Average Guesses</p>
								<p class="text-3xl font-bold text-red-600 dark:text-red-400">{data.answer.avgGuesses}</p>
							</div>
							<div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5">
								<p class="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-1">Puzzle Number</p>
								<p class="text-3xl font-bold text-red-600 dark:text-red-400">#{data.answer.puzzleNumber}</p>
							</div>
						</div>

						<div class="mt-6 bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-100 dark:border-red-800/30">
							<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
								<span class="text-red-500">🍁</span> Fun Fact
							</h3>
							<p class="text-gray-700 dark:text-gray-300 leading-relaxed">{data.answer.funFact}</p>
						</div>
					</div>
				{/if}
			</div>

			<article class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-8">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">About Today's Canuckle</h2>
				<div class="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
					<p class="leading-relaxed">
						Today's Canuckle puzzle is <strong class="text-red-600 dark:text-red-400">#{data.answer.puzzleNumber}</strong>, released on <strong class="text-gray-900 dark:text-white">{data.answer.date}</strong>. The answer is a five-letter Canadian-themed word. Players across Canada and around the world attempt to solve it daily, with an average of <strong class="text-gray-900 dark:text-white">{data.answer.avgGuesses}</strong> guesses needed.
					</p>
				</div>
			</article>

			<section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-8">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
				<div class="space-y-4">
					<details class="group bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800/30 overflow-hidden" open>
						<summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white">
							What is the Canuckle answer for today, {data.answer.date}?
							<span class="text-red-500 group-open:rotate-180 transition-transform">▼</span>
						</summary>
						<div class="px-5 pb-5 text-gray-600 dark:text-gray-300">
							The Canuckle answer for today, {data.answer.date}, is <span class="font-bold uppercase text-gray-900 dark:text-white">{data.answer.word}</span>. This is Canuckle puzzle #{data.answer.puzzleNumber}.
						</div>
					</details>

					<details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
						<summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
							How many guesses does it take on average?
							<span class="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
						</summary>
						<div class="px-5 pb-5 text-gray-600 dark:text-gray-300">
							The average number of guesses for today's Canuckle puzzle is {data.answer.avgGuesses}.
						</div>
					</details>

					<details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
						<summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
							What is Canuckle?
							<span class="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
						</summary>
						<div class="px-5 pb-5 text-gray-600 dark:text-gray-300">
							Canuckle is a Canadian-themed Wordle game where each answer is a five-letter word related to Canada. A new puzzle is released daily with a fun fact about Canadian culture, geography, or history.
						</div>
					</details>
				</div>
			</section>

			<div class="mt-12">
				<AuthorCard
					name={PRESTON_HAYES_AUTHOR_NAME}
					image={PRESTON_HAYES_AUTHOR_IMAGE}
					description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
				/>
			</div>

			<div class="mt-16">
				<InternalLinkSection currentGame="Canuckle" />
			</div>
		</div>
	</div>
{/if}
