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
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<meta name="keywords" content={data.meta.keywords ?? 'canuckle answer today, canuckle hint, canadian wordle'} />
	<link rel="canonical" href="https://wordsolver.tech/canuckle-answer-today" />
	{@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

{#if data.error || !data.answer}
	<div class="min-h-screen flex items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
		<div class="text-center">
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Error Loading Data</h1>
			<p class="mt-2 text-gray-500 dark:text-gray-400">Could not retrieve today's Canuckle answer.</p>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-red-950">
		<div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
			<header class="text-center">
				<h1 class="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl">
					Canuckle Answer Today ({data.answer.date})
				</h1>
				<p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
					The current Canuckle answer and clue details for {data.answer.date}
				</p>
			</header>

			<section class="mt-10 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
				<div class="text-center">
					{#if data.answer.hintTitle}
						<p class="text-sm font-semibold uppercase tracking-[0.24em] text-red-600 dark:text-red-300">
							{data.answer.hintTitle}
						</p>
					{/if}
					{#if data.answer.hintText}
						<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{data.answer.hintText}</p>
					{/if}
				</div>

				<div class="mt-8 flex justify-center gap-3">
					{#if revealed}
						{#each data.answer.word.split('') as letter}
							<div class="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-red-600 bg-red-500 text-2xl font-bold text-white shadow-md sm:h-16 sm:w-16 sm:text-3xl">
								{letter}
							</div>
						{/each}
					{:else}
						{#each Array(data.answer.word.length) as _}
							<div class="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-gray-300 bg-gray-200 text-2xl font-bold text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500 sm:h-16 sm:w-16 sm:text-3xl">
								?
							</div>
						{/each}
					{/if}
				</div>

				<div class="mt-8 text-center">
					<button
						type="button"
						onclick={() => (revealed = !revealed)}
						class="rounded-xl bg-red-600 px-8 py-3 text-lg font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 dark:shadow-red-900/30"
					>
						{revealed ? 'Hide Answer' : 'Reveal Answer'}
					</button>
				</div>

				{#if revealed}
					<div class="mt-8 grid gap-4 border-t border-gray-200 pt-8 dark:border-gray-700 sm:grid-cols-2">
						<div class="rounded-2xl bg-gray-50 p-5 dark:bg-gray-700/40">
							<p class="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
								Date
							</p>
							<p class="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">{data.answer.date}</p>
						</div>
						<div class="rounded-2xl bg-gray-50 p-5 dark:bg-gray-700/40">
							<p class="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
								Word Length
							</p>
							<p class="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">{data.answer.word.length} letters</p>
						</div>
					</div>
				{/if}

				<div class="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6 dark:border-red-800/30 dark:bg-red-900/20">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Fun Fact</h2>
					<p class="mt-3 leading-relaxed text-gray-700 dark:text-gray-300">{data.answer.funFact}</p>
				</div>
			</section>

			<section class="mt-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white">About Today's Canuckle</h2>
				<p class="mt-4 leading-7 text-gray-600 dark:text-gray-300">
					Canuckle is a Canadian-themed daily word puzzle. This page rebuilds from the live Canuckle answer source each day, so the answer, hint, and fun fact stay aligned with the current puzzle instead of a frozen migration snapshot.
				</p>
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
