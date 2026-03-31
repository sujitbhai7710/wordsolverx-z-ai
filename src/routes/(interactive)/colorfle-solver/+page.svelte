<script lang="ts">
	import {
		COLORS,
		COLOR_NAMES,
		WEIGHTS,
		checkGuess,
		getAllCombinations,
		getCombinationTargetColor,
		hexToRgb,
		solveFromHexTopN
	} from '$lib/colorfle';

	type Feedback = 'green' | 'yellow' | 'gray';

	interface GuessWithFeedback {
		colors: number[];
		feedback: Array<Feedback | null>;
	}

	interface UnifiedSuggestion {
		colors: number[];
		colorNames: string[];
		colorHexes: string[];
		targetHex: string;
		targetRgb: { r: number; g: number; b: number };
		similarity?: number;
	}

	function getContrastColor(hex: string): string {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		return luminance > 0.5 ? '#000000' : '#FFFFFF';
	}

	function isValidHex(hex: string): boolean {
		return /^#?([a-f\d]{3}|[a-f\d]{6})$/i.test(hex);
	}

	function normalizeHex(hex: string): string {
		let value = hex.startsWith('#') ? hex : `#${hex}`;
		if (value.length === 4) {
			value = `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
		}
		return value.toLowerCase();
	}

	let hexInput = $state('');
	let solving = $state(false);
	let refining = $state(false);
	let error = $state('');
	let inputHex = $state<string | null>(null);
	let suggestions = $state<UnifiedSuggestion[]>([]);
	let guesses = $state<GuessWithFeedback[]>([]);
	let isSolved = $state(false);

	const allGuessesComplete = $derived(guesses.length > 0 && guesses.every((guess) => guess.feedback.every((value) => value !== null)));
	const hasIncompleteGuesses = $derived(guesses.some((guess) => guess.feedback.some((value) => value === null)));

	function handleQuickFill(hex: string) {
		hexInput = hex;
		error = '';
	}

	async function handleSolve() {
		const trimmed = hexInput.trim();
		if (!trimmed || !isValidHex(trimmed)) {
			error = 'Please enter a valid hex color code such as #8ce874.';
			return;
		}

		solving = true;
		error = '';
		isSolved = false;
		guesses = [];
		suggestions = [];

		const normalized = normalizeHex(trimmed);
		const matches = solveFromHexTopN(normalized, 5);
		inputHex = normalized;
		suggestions = matches.map((match) => ({
			colors: [...match.colors],
			colorNames: [...match.colorNames],
			colorHexes: [...match.colorHexes],
			targetHex: match.targetHex,
			targetRgb: hexToRgb(match.targetHex),
			similarity: match.similarity
		}));
		solving = false;
	}

	function handleUseThis(suggestion: UnifiedSuggestion) {
		if (isSolved) {
			return;
		}
		guesses = [...guesses, { colors: [...suggestion.colors], feedback: [null, null, null] }];
		suggestions = [];
	}

	function cycleFeedback(guessIndex: number, colorIndex: number) {
		if (isSolved) {
			return;
		}

		const updated = guesses.map((guess, index) => {
			if (index !== guessIndex) {
				return guess;
			}

			const nextFeedback = [...guess.feedback];
			const current = nextFeedback[colorIndex];
			nextFeedback[colorIndex] =
				current === null ? 'green' : current === 'green' ? 'yellow' : current === 'yellow' ? 'gray' : null;

			return { ...guess, feedback: nextFeedback };
		});

		guesses = updated;
		isSolved = updated.some((guess) => guess.feedback.every((feedback) => feedback === 'green'));
		if (isSolved) {
			suggestions = [];
		}
	}

	async function handleRefine() {
		if (!allGuessesComplete || isSolved) {
			return;
		}

		refining = true;
		const completedGuesses = guesses.filter((guess) => guess.feedback.every((value) => value !== null)) as Array<{
			colors: number[];
			feedback: Feedback[];
		}>;

		const possibilities = getAllCombinations(0).filter((answer) =>
			completedGuesses.every((guess) => checkGuess(guess.colors, answer, guess.feedback))
		);

		if (possibilities.length === 0) {
			error = 'No matching combinations found. Check your feedback and try again.';
			suggestions = [];
			refining = false;
			return;
		}

		error = '';
		suggestions = possibilities.slice(0, 5).map((colors) => {
			const target = getCombinationTargetColor(colors, 0);
			return {
				colors,
				colorNames: colors.map((index) => COLOR_NAMES[index] ?? 'Unknown'),
				colorHexes: colors.map((index) => COLORS[index] ?? '#000000'),
				targetHex: target.hex,
				targetRgb: target.rgb
			};
		});
		refining = false;
	}

	function handleReset() {
		hexInput = '';
		solving = false;
		refining = false;
		error = '';
		inputHex = null;
		suggestions = [];
		guesses = [];
		isSolved = false;
	}

	function renderFeedbackLabel(feedback: Feedback | null): string {
		if (feedback === 'green') return 'Green';
		if (feedback === 'yellow') return 'Yellow';
		if (feedback === 'gray') return 'Gray';
		return 'Tap';
	}

	function feedbackClasses(feedback: Feedback | null): string {
		if (feedback === 'green') return 'border-emerald-500 ring-2 ring-emerald-500/30';
		if (feedback === 'yellow') return 'border-amber-400 ring-2 ring-amber-400/30';
		if (feedback === 'gray') return 'border-zinc-300 opacity-70';
		return 'border-dashed border-zinc-300';
	}
</script>

<svelte:head>
	<title>Colorfle Solver - Original Solver Flow | WordSolverX</title>
	<meta
		name="description"
		content="Solve Colorfle with the original hex-to-suggestion flow, feedback cycling, and elimination refinement."
	/>
	<link rel="canonical" href="https://wordsolver.tech/colorfle-solver" />
</svelte:head>

<div class="min-h-screen bg-background">
	<div class="fixed inset-0 -z-10 overflow-hidden">
		<div
			class="absolute left-1/4 top-0 h-96 w-96 rounded-full opacity-[0.07]"
			style="background: radial-gradient(circle, #E6194B, transparent 70%); filter: blur(80px);"
		></div>
		<div
			class="absolute right-1/4 top-1/3 h-96 w-96 rounded-full opacity-[0.07]"
			style="background: radial-gradient(circle, #4363D8, transparent 70%); filter: blur(80px);"
		></div>
		<div
			class="absolute bottom-0 left-1/2 h-96 w-96 rounded-full opacity-[0.05]"
			style="background: radial-gradient(circle, #3CB44B, transparent 70%); filter: blur(80px);"
		></div>
	</div>

	<header class="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<div class="flex items-center gap-3">
				<div class="relative h-10 w-10 overflow-hidden rounded-xl shadow-lg">
					<div
						class="absolute inset-0"
						style="background: conic-gradient(from 0deg, #E6194B, #F58231, #FFE119, #3CB44B, #46F0F0, #4363D8, #911EB4, #E6194B);"
					></div>
				</div>
				<div>
					<h1 class="text-xl font-bold tracking-tight">
						Color<span class="bg-clip-text text-transparent" style="background-image: linear-gradient(135deg, #E6194B, #F58231, #FFE119, #3CB44B, #4363D8);">fle</span>
					</h1>
					<p class="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
						Solver and Archive
					</p>
				</div>
			</div>
			<a
				class="text-xs text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
				href="https://colorfle.com/"
				rel="noopener noreferrer"
				target="_blank"
			>
				Play on colorfle.com ->
			</a>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-8">
		<div class="mb-8 grid grid-cols-3 gap-2">
			<a class="flex items-center justify-center gap-1.5 rounded-lg border bg-white px-4 py-3 text-sm font-semibold shadow-sm dark:border-slate-700 dark:bg-slate-900" href="/colorfle-solver">
				Solver
			</a>
			<a class="flex items-center justify-center gap-1.5 rounded-lg border bg-white px-4 py-3 text-sm font-semibold shadow-sm dark:border-slate-700 dark:bg-slate-900" href="/colorfle-answer-today">
				Today's Answer
			</a>
			<a class="flex items-center justify-center gap-1.5 rounded-lg border bg-white px-4 py-3 text-sm font-semibold shadow-sm dark:border-slate-700 dark:bg-slate-900" href="/colorfle-archive">
				Archive
			</a>
		</div>

		<div class="space-y-6">
			{#if isSolved}
				<section class="overflow-hidden rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 dark:border-emerald-800/50 dark:from-emerald-950/30 dark:to-teal-950/30">
					<h2 class="text-center text-xl font-bold text-emerald-800 dark:text-emerald-300">Solved!</h2>
					<p class="mt-2 text-center text-sm text-emerald-700 dark:text-emerald-400">
						You found the answer in {guesses.length} guess{guesses.length !== 1 ? 'es' : ''}.
					</p>
				</section>
			{/if}

			<section class="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
				<div class="mb-4 flex items-center justify-between gap-4">
					<div>
						<h2 class="text-lg font-semibold">Enter the Target Color</h2>
						<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
							Paste the hex color code from Colorfle to find the best match.
						</p>
					</div>
					{#if guesses.length > 0}
						<button class="rounded-lg border px-4 py-2 text-sm font-semibold" type="button" onclick={handleReset}>
							Reset
						</button>
					{/if}
				</div>

				<div class="space-y-4">
					<div class="flex items-center gap-3">
						<input
							class="h-14 w-14 cursor-pointer overflow-hidden rounded-xl border-2 border-slate-300 p-0"
							type="color"
							value={hexInput.startsWith('#') && hexInput.length === 7 ? hexInput : '#ffffff'}
							oninput={(event) => {
								hexInput = (event.currentTarget as HTMLInputElement).value;
								error = '';
							}}
						/>
						<div class="flex flex-1 gap-2">
							<div class="relative flex-1">
								<span class="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-slate-400">#</span>
								<input
									class="w-full rounded-xl border px-4 py-3 pl-7 font-mono text-lg dark:border-slate-700 dark:bg-slate-950"
									disabled={solving}
									placeholder="e.g. 8ce874"
									type="text"
									value={hexInput.startsWith('#') ? hexInput.slice(1) : hexInput}
									oninput={(event) => {
										hexInput = (event.currentTarget as HTMLInputElement).value;
										error = '';
									}}
									onkeydown={(event) => {
										if ((event as KeyboardEvent).key === 'Enter') {
											handleSolve();
										}
									}}
								/>
							</div>
							<button
								class="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white dark:bg-white dark:text-slate-900"
								disabled={solving || !hexInput.trim()}
								type="button"
								onclick={handleSolve}
							>
								{solving ? 'Solving...' : 'Solve'}
							</button>
						</div>
					</div>

					<div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
						<span>Try it:</span>
						<button class="rounded-md bg-slate-100 px-2 py-1 font-mono dark:bg-slate-800" type="button" onclick={() => handleQuickFill('8ce874')}>
							#8ce874
						</button>
						<button class="rounded-md bg-slate-100 px-2 py-1 font-mono dark:bg-slate-800" type="button" onclick={() => handleQuickFill('e6194b')}>
							#e6194b
						</button>
						<button class="rounded-md bg-slate-100 px-2 py-1 font-mono dark:bg-slate-800" type="button" onclick={() => handleQuickFill('4363d8')}>
							#4363d8
						</button>
					</div>

					{#if error}
						<p class="text-sm text-red-600">{error}</p>
					{/if}
				</div>
			</section>

			{#if guesses.length > 0}
				<section class="space-y-4">
					<div class="flex items-center gap-2">
						<h2 class="text-lg font-semibold">Guesses</h2>
						<span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800">
							{guesses.length} guess{guesses.length !== 1 ? 'es' : ''}
						</span>
					</div>

					<div class="space-y-3">
						{#each guesses as guess, guessIndex}
							<div class="rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
								<div class="mb-3 flex items-center gap-2">
									<span class="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-500 dark:bg-slate-800 dark:text-slate-400">
										#{guessIndex + 1}
									</span>
									{#if guess.feedback.every((feedback) => feedback === 'green')}
										<span class="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
											Correct!
										</span>
									{/if}
								</div>

								<div class="flex items-center justify-center gap-4">
									{#each guess.colors as colorIndex, colorPosition}
										<div class="flex flex-col items-center gap-2">
											<button
												class={`relative h-16 w-16 rounded-xl border-2 transition-all ${feedbackClasses(guess.feedback[colorPosition])}`}
												style={`background-color: ${COLORS[colorIndex]};`}
												type="button"
												onclick={() => cycleFeedback(guessIndex, colorPosition)}
											>
												{#if guess.feedback[colorPosition] === null}
													<span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white" style={`text-shadow: 0 1px 3px rgba(0,0,0,0.5); color: ${getContrastColor(COLORS[colorIndex])};`}>
														?
													</span>
												{/if}
											</button>
											<div class="text-center">
												<p class="text-[11px] font-medium">{COLOR_NAMES[colorIndex]}</p>
												<p class="text-[10px] font-mono text-slate-500 dark:text-slate-400">{COLORS[colorIndex]}</p>
												<p class="text-[10px] text-slate-500 dark:text-slate-400">{renderFeedbackLabel(guess.feedback[colorPosition])}</p>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>

					{#if !isSolved && allGuessesComplete}
						<div class="flex justify-center">
							<button
								class="rounded-xl bg-slate-900 px-8 py-3 font-semibold text-white dark:bg-white dark:text-slate-900"
								disabled={refining}
								type="button"
								onclick={handleRefine}
							>
								{refining ? 'Refining...' : 'Refine'}
							</button>
						</div>
					{:else if !isSolved && hasIncompleteGuesses}
						<p class="text-center text-xs text-slate-500 dark:text-slate-400">
							Set feedback on all colors above to enable Refine.
						</p>
					{/if}
				</section>
			{/if}

			{#if suggestions.length > 0 && !isSolved}
				<section class="space-y-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<h2 class="text-lg font-semibold">{guesses.length === 0 ? 'Best Matches' : 'Suggestions'}</h2>
							<span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800">
								{suggestions.length} result{suggestions.length !== 1 ? 's' : ''}
							</span>
						</div>
						{#if inputHex}
							<div class="flex items-center gap-2">
								<div class="h-5 w-5 rounded-md border" style={`background-color: ${inputHex};`}></div>
								<span class="font-mono text-xs text-slate-500 dark:text-slate-400">{inputHex}</span>
							</div>
						{/if}
					</div>

					<div class="space-y-3">
						{#each suggestions as suggestion, index}
							<div class={`overflow-hidden rounded-2xl border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 ${index === 0 ? 'ring-2 ring-slate-300 dark:ring-slate-700' : ''}`}>
								<div class="flex items-stretch">
									<div class="relative w-20 flex-shrink-0" style={`background-color: ${suggestion.targetHex};`}>
										<div class="absolute inset-0 flex items-center justify-center px-2 text-center font-mono text-[10px] font-bold" style={`color: ${getContrastColor(suggestion.targetHex)}; text-shadow: 0 1px 3px rgba(0,0,0,0.4);`}>
											{suggestion.targetHex}
										</div>
									</div>
									<div class="flex-1 p-4">
										<div class="mb-3 flex items-center gap-3">
											{#each suggestion.colors as _, colorIndex}
												<div class="flex flex-col items-center gap-1">
													<div
														class="h-12 w-12 rounded-xl border shadow-sm"
														style={`background-color: ${suggestion.colorHexes[colorIndex]};`}
													></div>
													<p class="text-[10px] font-medium">{suggestion.colorNames[colorIndex]}</p>
													<p class="text-[9px] font-mono text-slate-500 dark:text-slate-400">
														{Math.round(WEIGHTS[0][colorIndex] * 100)}%
													</p>
												</div>
											{/each}
										</div>
										<div class="flex items-center justify-between gap-3">
											{#if suggestion.similarity !== undefined}
												<span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold dark:bg-slate-800">
													{suggestion.similarity}% match
												</span>
											{:else}
												<div></div>
											{/if}
											<button
												class={`rounded-lg px-4 py-2 text-sm font-semibold ${
													index === 0
														? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
														: 'border'
												}`}
												type="button"
												onclick={() => handleUseThis(suggestion)}
											>
												{index === 0 ? 'Use This' : 'Use'}
											</button>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>

					{#if guesses.length === 0}
						<p class="text-center text-xs text-slate-500 dark:text-slate-400">
							Use the top suggestion first, then enter the feedback from Colorfle and refine.
						</p>
					{/if}
				</section>
			{/if}

			<section class="rounded-2xl border border-sky-200 bg-sky-50/50 p-4 dark:border-sky-900/50 dark:bg-sky-950/20">
				<h2 class="text-sm font-semibold text-sky-800 dark:text-sky-300">How to use</h2>
				<ol class="mt-2 space-y-1 text-xs text-sky-700 dark:text-sky-400">
					<li>1. Go to colorfle.com and copy the target hex color.</li>
					<li>2. Enter the hex above and click Solve.</li>
					<li>3. Use the top suggestion on Colorfle.</li>
					<li>4. Click each color tile here to set Green, Yellow, or Gray feedback.</li>
					<li>5. Click Refine for the next set of suggestions.</li>
				</ol>
			</section>
		</div>
	</main>

	<footer class="mt-12 border-t">
		<div class="mx-auto max-w-4xl px-4 py-6 text-center">
			<p class="text-xs text-slate-500 dark:text-slate-400">
				Colorfle Solver is an unofficial fan tool and now follows the original solver flow from the migrated source page.
			</p>
		</div>
	</footer>
</div>
