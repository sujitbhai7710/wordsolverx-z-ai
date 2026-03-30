<script lang="ts">
	import AuthorCard from '$lib/components/AuthorCard.svelte';
	import type { NerdleModeData } from '$lib/nerdle-answers';
	import {
		PRESTON_HAYES_AUTHOR_DESCRIPTION,
		PRESTON_HAYES_AUTHOR_IMAGE,
		PRESTON_HAYES_AUTHOR_NAME
	} from '$lib/authors';

	let { data } = $props();

	let copiedToken = $state<string | null>(null);
	let h1Title = $derived(`Nerdle Answer Today ( ${data.formattedDate} )`);
	let modes = $derived((data.answerData?.modes ?? []) as NerdleModeData[]);

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
	<div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-4xl space-y-8">
			<section class="text-center">
				<p class="text-sm font-medium uppercase tracking-[0.22em] text-emerald-700">Today&apos;s Puzzle</p>
				<h1 class="mt-3 text-3xl font-black leading-tight sm:text-4xl">{h1Title}</h1>
				<p class="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
					Find every Nerdle answer for {data.formattedDate} in one place, including Classic, Micro,
					Mini, Midi, Maxi, Mini Bi, Quad, Speed, and Instant.
				</p>
				<p class="mx-auto mt-3 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
					This page is built to help you check the latest equations quickly, compare mode answers,
					and jump straight to the solver if you want help instead of spoilers.
				</p>
				<div class="mt-5 flex flex-wrap items-center justify-center gap-3">
					<div class="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 shadow-sm">
						<span class="text-slate-600">Classic Puzzle #</span>
						<span class="font-bold text-emerald-700">
							{Number.isFinite(data.answerData.classicPuzzleNumber) ? data.answerData.classicPuzzleNumber : 'N/A'}
						</span>
					</div>
					<a
						href="/nerdle-solver"
						class="inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
					>
						Use Nerdle Solver
					</a>
				</div>
			</section>

			{#if modes.length > 0}
				<div class="space-y-8">
					{#each modes as mode}
						<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
							<div class="mb-6">
								<h2 class="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
									Nerdle {mode.name} Answer for {data.formattedDate}
								</h2>
								<p class="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
									{mode.description}. {mode.answers.length > 1
										? `This mode has ${mode.answers.length} answers today.`
										: 'This mode has one answer today.'}
								</p>
							</div>

							{#if mode.answers.length > 0}
								<div class="space-y-6">
									{#each mode.answers as answerEntry, index}
										<div class="rounded-xl border border-slate-200 p-4">
											<div class="mb-3 flex flex-wrap items-center justify-between gap-3">
												<p class="text-sm font-medium text-slate-700">
													Puzzle #{answerEntry.puzzleNumber}
												</p>
												<button
													type="button"
													onclick={() => copyText(answerEntry.answer, `${mode.id}-${index}`)}
													class="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
												>
													{copiedToken === `${mode.id}-${index}` ? 'Copied' : 'Copy Answer'}
												</button>
											</div>

											<div class="mb-4 flex flex-wrap justify-center gap-2 md:gap-3">
												{#each answerEntry.answer.split('') as char, charIndex}
													<div
														class="flex h-12 w-10 items-center justify-center rounded-lg text-lg font-bold text-white transition-all duration-300 hover:scale-105 sm:h-14 sm:w-12 sm:text-2xl"
														style={getTileStyle(char, charIndex)}
													>
														{char}
													</div>
												{/each}
											</div>

											<p class="text-center text-sm text-slate-500">
												Answer: <span class="font-semibold text-slate-800">{answerEntry.answer}</span>
											</p>
										</div>
									{/each}
								</div>
							{:else}
								<p class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
									No answer stored for this mode yet.
								</p>
							{/if}
						</section>
					{/each}
				</div>
			{:else}
				<section class="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-900 shadow-sm">
					<h2 class="text-xl font-bold">No Nerdle mode data is available yet.</h2>
					<p class="mt-2 text-sm sm:text-base">
						The page will show all modes as soon as the latest Nerdle data is available in the worker.
					</p>
				</section>
			{/if}

			<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
				<h2 class="text-2xl font-black tracking-tight text-slate-900">More Nerdle Help</h2>
				<div class="mt-4 grid gap-4 sm:grid-cols-2">
					<a
						href="/nerdle-solver"
						class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 transition-colors hover:bg-emerald-100"
					>
						<h3 class="text-lg font-bold text-emerald-900">Nerdle Solver</h3>
						<p class="mt-2 text-sm leading-6 text-emerald-800">
							Use the solver when you want help narrowing equations without directly revealing the answer first.
						</p>
					</a>
					<a
						href={`/nerdle-archive?date=${data.answerData.date}`}
						class="rounded-2xl border border-violet-200 bg-violet-50 p-5 transition-colors hover:bg-violet-100"
					>
						<h3 class="text-lg font-bold text-violet-900">Nerdle Archive</h3>
						<p class="mt-2 text-sm leading-6 text-violet-800">
							Check older Nerdle answers by date and browse past mode history from the archive page.
						</p>
					</a>
				</div>
			</section>

			<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
				<h2 class="text-2xl font-black tracking-tight text-slate-900">Nerdle Answer Today FAQs</h2>
				<div class="mt-6 space-y-4">
					{#each data.faqItems as faq}
						<div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
							<h3 class="text-lg font-bold text-slate-900">{faq.question}</h3>
							<p class="mt-2 text-sm leading-6 text-slate-600 sm:text-base">{faq.answer}</p>
						</div>
					{/each}
				</div>
			</section>

			<AuthorCard
				name={PRESTON_HAYES_AUTHOR_NAME}
				image={PRESTON_HAYES_AUTHOR_IMAGE}
				description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
			/>
		</div>
	</div>
</main>
