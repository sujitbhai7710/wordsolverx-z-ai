<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Canuckle Archive - Recent Canuckle Answers | WordSolverX</title>
	<meta
		name="description"
		content="Browse recent Canuckle answers with their dates, daily hints, and Canadian fun facts."
	/>
	<link rel="canonical" href="https://wordsolver.tech/canuckle-archive" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-red-950">
	<section class="bg-gradient-to-r from-red-600 to-red-700 py-16 shadow-lg">
		<div class="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
			<h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">Canuckle Archive</h1>
			<p class="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-white/95">
				Recent Canuckle answers pulled from the live source used by the game.
			</p>
		</div>
	</section>

	<div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
		{#if !data.archive?.length}
			<div class="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl dark:border-gray-700 dark:bg-gray-800">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white">No Archive Data Available</h2>
				<p class="mt-2 text-gray-500 dark:text-gray-400">Could not load the Canuckle archive at this time.</p>
			</div>
		{:else}
			<div class="space-y-6">
				{#each data.archive as entry (entry.dateKey)}
					<div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
						<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p class="text-sm font-semibold uppercase tracking-[0.24em] text-red-600 dark:text-red-300">
									{entry.date}
								</p>
								{#if entry.hintTitle}
									<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{entry.hintTitle}</p>
								{/if}
							</div>
						</div>

						<div class="mt-6 flex gap-3">
							{#each entry.word.split('') as letter}
								<div class="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-red-600 bg-red-500 text-xl font-bold text-white shadow-md sm:h-14 sm:w-14 sm:text-2xl">
									{letter}
								</div>
							{/each}
						</div>

						{#if entry.hintText}
							<p class="mt-5 text-sm text-gray-600 dark:text-gray-300">{entry.hintText}</p>
						{/if}

						<div class="mt-5 rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-800/30 dark:bg-red-900/20">
							<h3 class="text-sm font-bold text-gray-900 dark:text-white">Fun Fact</h3>
							<p class="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{entry.funFact}</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
