<script lang="ts">
	import type { NerdleModeData } from '$lib/nerdle-answers';

	let { data } = $props();

	let copiedToken = $state<string | null>(null);
	let selectedModeId = $state('classic');
	let h1Title = $derived(`Nerdle Answer Today ( ${data.formattedDate} )`);
	let modes = $derived((data.answerData?.modes ?? []) as NerdleModeData[]);
	let selectedMode = $derived(
		modes.find((mode) => mode.id === selectedModeId) ?? (modes.length > 0 ? modes[0] : null)
	);

	$effect(() => {
		if (!modes.some((mode) => mode.id === selectedModeId) && modes.length > 0) {
			selectedModeId = modes[0].id;
		}
	});

	function getTileStyle(char: string, index: number): string {
		const isOperator = ['+', '-', '*', '/', '='].includes(char);
		const isEquals = char === '=';
		const background = isEquals
			? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
			: isOperator
				? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
				: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)';
		const shadow = isEquals
			? '0 4px 20px rgba(16, 185, 129, 0.3)'
			: isOperator
				? '0 4px 20px rgba(139, 92, 246, 0.3)'
				: '0 4px 20px rgba(0, 0, 0, 0.2)';

		return `animation-delay: ${index * 100}ms; background: ${background}; box-shadow: ${shadow};`;
	}

	async function copyText(text: string, token: string): Promise<void> {
		await navigator.clipboard.writeText(text);
		copiedToken = token;
		setTimeout(() => {
			if (copiedToken === token) {
				copiedToken = null;
			}
		}, 1400);
	}

	async function copyAllModeAnswers(): Promise<void> {
		if (!selectedMode || selectedMode.answers.length === 0) {
			return;
		}

		const merged = selectedMode.answers.map((entry) => entry.answer).join('\n');
		await copyText(merged, `all-${selectedMode.id}`);
	}
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<meta name="keywords" content={data.meta.keywords} />
	<link rel="canonical" href={data.meta.canonical} />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={data.meta.canonical} />
	<meta property="og:image" content="https://wordsolver.tech/wordsolverx.webp" />
	<meta property="og:site_name" content="WordSolverX" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.meta.title} />
	<meta name="twitter:description" content={data.meta.description} />
	<meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
	{@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-900">
	<div class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-3xl">
			<div class="text-center mb-8">
				<p class="text-slate-600 text-sm mb-2">Today&apos;s Puzzle</p>
				<h1 class="text-3xl sm:text-4xl font-black mb-2 leading-tight">{h1Title}</h1>
				<div class="inline-flex items-center gap-2 bg-white border border-emerald-100 rounded-full px-4 py-2 shadow-sm">
					<span class="text-slate-600">Classic Puzzle #</span>
					<span class="text-emerald-700 font-bold">
						{Number.isFinite(data.answerData.classicPuzzleNumber) ? data.answerData.classicPuzzleNumber : 'N/A'}
					</span>
				</div>
			</div>

			<div class="rounded-2xl border border-slate-200 bg-white p-8 mb-8 shadow-sm">
				<div class="text-center mb-6 space-y-3">
					<h2 class="text-lg font-semibold text-slate-700">All Nerdle Modes</h2>
					<div class="flex flex-wrap justify-center gap-2">
						{#each modes as mode}
							<button
								type="button"
								onclick={() => (selectedModeId = mode.id)}
								class={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
									selectedModeId === mode.id
										? 'bg-emerald-600 text-white'
										: 'bg-slate-100 text-slate-700 hover:bg-slate-200'
								}`}
							>
								{mode.name}
							</button>
						{/each}
					</div>
				</div>

				{#if selectedMode}
					<div class="mb-4 text-center">
						<p class="text-slate-700 font-semibold">{selectedMode.name}</p>
						<p class="text-slate-500 text-sm">{selectedMode.description}</p>
					</div>

					{#if selectedMode.answers.length > 0}
						<div class="space-y-6">
							{#each selectedMode.answers as answerEntry, index}
								<div class="rounded-xl border border-slate-200 p-4">
									<div class="text-sm text-slate-600 mb-3 text-center">Puzzle #{answerEntry.puzzleNumber}</div>
									<div class="flex justify-center gap-2 md:gap-3 flex-wrap mb-4">
										{#each answerEntry.answer.split('') as char, charIndex}
											<div
												class="w-12 h-14 md:w-14 md:h-16 rounded-lg flex items-center justify-center text-xl md:text-2xl text-white font-bold transition-all duration-300 hover:scale-105"
												style={getTileStyle(char, charIndex)}
											>
												{char}
											</div>
										{/each}
									</div>
									<button
										type="button"
										onclick={() => copyText(answerEntry.answer, `${selectedMode.id}-${index}`)}
										class="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
									>
										{copiedToken === `${selectedMode.id}-${index}`
											? 'Copied'
											: `Copy ${selectedMode.answers.length > 1 ? `Answer ${index + 1}` : 'Answer'}`}
									</button>
								</div>
							{/each}
						</div>

						{#if selectedMode.answers.length > 1}
							<button
								type="button"
								onclick={copyAllModeAnswers}
								class="mt-4 w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
							>
								{copiedToken === `all-${selectedMode.id}` ? 'Copied All' : 'Copy All Answers'}
							</button>
						{/if}
					{:else}
						<div class="text-center py-8">
							<p class="text-slate-500">No answer stored for this mode yet.</p>
						</div>
					{/if}
				{:else}
					<div class="text-center py-8">
						<p class="text-slate-500">No mode data available right now.</p>
					</div>
				{/if}
			</div>

			<div class="flex flex-wrap justify-between items-center gap-3 text-sm">
				<a href={`/nerdle-archive?date=${data.answerData.date}`} class="text-violet-700 hover:text-violet-600 font-medium transition-colors">
					View in Nerdle Archive
				</a>
				<div class="flex flex-wrap gap-4">
					<a
						href="https://www.nerdlegame.com/"
						target="_blank"
						rel="noopener noreferrer"
						class="text-slate-700 hover:text-slate-900 transition-colors"
					>
						Play on Nerdle ->
					</a>
					<a href="/nerdle-archive" class="text-slate-700 hover:text-slate-900 transition-colors">Browse Archive -></a>
				</div>
			</div>
		</div>
	</div>
</main>
