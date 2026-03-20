<script lang="ts">
	import { onMount } from 'svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	type GameMode = 'micro' | 'mini' | 'midi' | 'classic' | 'maxi';
	type Feedback = 0 | 1 | 2;

	interface GuessRow {
		equation: string;
		feedback: Feedback[];
	}

	interface Suggestion {
		eq: string;
		entropy: number;
	}

	const MODE_CONFIG = {
		micro: { length: 5, name: 'Micro', guesses: 6 },
		mini: { length: 6, name: 'Mini', guesses: 6 },
		midi: { length: 7, name: 'Midi', guesses: 6 },
		classic: { length: 8, name: 'Classic', guesses: 6 },
		maxi: { length: 10, name: 'Maxi', guesses: 6 }
	} as const;

	const COLORS = {
		correct: 'bg-[#00d4aa] border-[#00b894] text-white',
		present: 'bg-[#f78166] border-[#e17055] text-white',
		absent: 'bg-slate-800 border-slate-900 text-white',
		empty: 'bg-white border-slate-200 text-slate-300'
	} as const;

	const VALID_CHARS_BASIC = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '='];
	const VALID_CHARS_MAXI = [...VALID_CHARS_BASIC, '(', ')', '²', '³'];
	const MODE_ENTRIES = Object.entries(MODE_CONFIG) as Array<
		[
			GameMode,
			{
				length: number;
				name: string;
				guesses: number;
			}
		]
	>;

	let validEquations = $state<Set<string>>(new Set());
	let isLoading = $state(true);
	let loadError = $state<string | null>(null);
	let mode = $state<GameMode>('classic');
	let guesses = $state<GuessRow[]>([]);
	let copiedEq = $state<string | null>(null);
	let currentInput = $state('');
	let suggestions = $state<Suggestion[]>([]);
	let isCalculating = $state(false);
	let remaining = $state(0);
	let totalCount = $state(0);
	let requestToken = 0;

	const targetLength = $derived(MODE_CONFIG[mode].length);
	const validChars = $derived(mode === 'maxi' ? VALID_CHARS_MAXI : VALID_CHARS_BASIC);
	const isInputValid = $derived(
		currentInput.length === targetLength &&
			validEquations.has(currentInput) &&
			!guesses.some((guess) => guess.equation === currentInput)
	);
	const keypadRows = $derived(
		mode === 'maxi'
			? [
					['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
					['+', '-', '*', '/', '=', '(', ')', '²', '³']
				]
			: [
					['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
					['+', '-', '*', '/', '=']
				]
	);

	function getTileClass(length: number, filled: boolean): string {
		const sizeClass =
			length <= 6 ? 'w-12 h-14 text-2xl' : length <= 8 ? 'w-11 h-13 text-xl' : 'w-9 h-11 text-lg';
		return `${sizeClass} rounded-xl border-2 font-bold flex items-center justify-center transition-all ${
			filled ? 'bg-slate-100 border-slate-300 text-slate-900' : COLORS.empty
		}`;
	}

	function getGuessTileClass(length: number, feedback: Feedback): string {
		const sizeClass =
			length <= 6 ? 'w-11 h-13 text-xl' : length <= 8 ? 'w-10 h-12 text-lg' : 'w-9 h-11 text-base';
		const colorClass =
			feedback === 2 ? COLORS.correct : feedback === 1 ? COLORS.present : COLORS.absent;
		return `${sizeClass} rounded-xl border-2 font-bold flex items-center justify-center transition-all ${colorClass}`;
	}

	function getSuggestionTileClass(length: number): string {
		const sizeClass =
			length <= 6 ? 'w-9 h-11 text-lg' : length <= 8 ? 'w-8 h-10 text-base' : 'w-7 h-9 text-sm';
		return `${sizeClass} rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-900 flex items-center justify-center`;
	}

	async function fetchSuggestions(currentGuesses: GuessRow[], nextMode: GameMode, token: number) {
		isCalculating = true;

		try {
			const response = await fetch('/api/nerdle-solver', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					mode: nextMode,
					guesses: currentGuesses
				})
			});

			const data = await response.json();
			if (token !== requestToken || nextMode !== mode) {
				return;
			}

			if (data.success) {
				suggestions = data.suggestions;
				remaining = data.remaining;
			} else {
				suggestions = [];
				remaining = 0;
				loadError = data.error ?? 'Failed to calculate suggestions.';
			}
		} catch (error) {
			if (token !== requestToken || nextMode !== mode) {
				return;
			}
			suggestions = [];
			remaining = 0;
			loadError = error instanceof Error ? error.message : 'Failed to calculate suggestions.';
		} finally {
			if (token === requestToken && nextMode === mode) {
				isCalculating = false;
			}
		}
	}

	async function loadEquations(nextMode: GameMode) {
		const token = ++requestToken;
		isLoading = true;
		loadError = null;
		suggestions = [];
		remaining = 0;

		const fileMap: Record<GameMode, string> = {
			micro: '/micro.txt',
			mini: '/mini.txt',
			midi: '/midi.txt',
			classic: '/classic.txt',
			maxi: '/maxi.txt'
		};

		try {
			const response = await fetch(fileMap[nextMode]);
			const text = await response.text();
			const equations = text
				.split('\n')
				.map((equation) => equation.trim())
				.filter((equation) => equation.length === MODE_CONFIG[nextMode].length);

			if (token !== requestToken || nextMode !== mode) {
				return;
			}

			validEquations = new Set(equations);
			totalCount = equations.length;
			guesses = [];
			currentInput = '';
			await fetchSuggestions([], nextMode, token);
		} catch (error) {
			if (token !== requestToken || nextMode !== mode) {
				return;
			}
			loadError = error instanceof Error ? error.message : 'Failed to load equations.';
		} finally {
			if (token === requestToken && nextMode === mode) {
				isLoading = false;
			}
		}
	}

	function setMode(nextMode: GameMode) {
		if (mode === nextMode && !loadError) {
			return;
		}

		mode = nextMode;
		void loadEquations(nextMode);
	}

	function addGuess(equation: string) {
		if (
			equation.length !== targetLength ||
			guesses.some((guess) => guess.equation === equation) ||
			!validEquations.has(equation)
		) {
			return;
		}

		guesses = [
			...guesses,
			{
				equation,
				feedback: new Array(targetLength).fill(0) as Feedback[]
			}
		];
		currentInput = '';
	}

	function toggleFeedback(guessIndex: number, charIndex: number) {
		guesses = guesses.map((guess, index) => {
			if (index !== guessIndex) return guess;
			const nextFeedback = [...guess.feedback];
			const current = nextFeedback[charIndex];
			const cycleMap: Record<number, Feedback> = { 0: 2, 2: 1, 1: 0 };
			nextFeedback[charIndex] = cycleMap[current];
			return {
				...guess,
				feedback: nextFeedback
			};
		});
	}

	function removeGuess(index: number) {
		guesses = guesses.filter((_, guessIndex) => guessIndex !== index);
	}

	function resetSolver() {
		guesses = [];
		currentInput = '';
		loadError = null;
		void fetchSuggestions([], mode, requestToken);
	}

	async function copyEquation(equation: string) {
		try {
			await navigator.clipboard.writeText(equation);
			copiedEq = equation;
			window.setTimeout(() => {
				if (copiedEq === equation) {
					copiedEq = null;
				}
			}, 1500);
		} catch {
			copiedEq = null;
		}
	}

	function handleKeypadPress(char: string) {
		if (currentInput.length < targetLength) {
			currentInput += char;
		}
	}

	function handleBackspace() {
		currentInput = currentInput.slice(0, -1);
	}

	function handleSolve() {
		loadError = null;
		void fetchSuggestions(guesses, mode, requestToken);
	}

	onMount(() => {
		void loadEquations(mode);

		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.target instanceof HTMLInputElement ||
				event.target instanceof HTMLTextAreaElement ||
				event.ctrlKey ||
				event.metaKey ||
				event.altKey
			) {
				return;
			}

			if (event.key === 'Enter' && isInputValid) {
				addGuess(currentInput);
				return;
			}

			if (event.key === 'Backspace') {
				handleBackspace();
				return;
			}

			if (validChars.includes(event.key) && currentInput.length < targetLength) {
				currentInput += event.key;
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	});

	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebApplication',
				name: 'Nerdle Solver',
				description:
					'Free all-modes Nerdle solver for Micro, Mini, Midi, Classic, and Maxi equations using entropy-based guess suggestions.',
				url: 'https://wordsolverx.com/nerdle-solver',
				applicationCategory: 'GameApplication',
				offers: {
					'@type': 'Offer',
					price: '0',
					priceCurrency: 'USD'
				}
			}
		]
	});
</script>

<svelte:head>
	<title>Nerdle Solver All Modes | Micro, Mini, Midi, Classic & Maxi</title>
	<meta
		name="description"
		content="Use the WordSolverX Nerdle Solver for Micro, Mini, Midi, Classic, and Maxi Nerdle. Keep the same equation logic and get fast entropy-based guesses."
	/>
	<link rel="canonical" href="https://wordsolverx.com/nerdle-solver" />
	<meta property="og:title" content="Nerdle Solver All Modes" />
	<meta
		property="og:description"
		content="Solve every Nerdle mode with the same equation logic and copied source equation lists."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://wordsolverx.com/nerdle-solver" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Nerdle Solver All Modes" />
	<meta
		name="twitter:description"
		content="Micro, Mini, Midi, Classic, and Maxi Nerdle support with entropy-based suggestions."
	/>
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 py-10 px-4 sm:px-6">
	<div class="max-w-4xl mx-auto">
		<Breadcrumbs />

		<section class="text-center mb-8">
			<div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm mb-5">
				<div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00d4aa] to-[#00b894] flex items-center justify-center text-white shadow-sm">
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m-8 4h10m-9 4h8M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
					</svg>
				</div>
				<div class="text-left">
					<p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">All Modes</p>
					<p class="text-sm text-slate-600">Entropy-based Nerdle equation solver</p>
				</div>
			</div>

			<h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Nerdle Solver</h1>
			<p class="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
				The same solver logic and copied equation files from your original project, now inside the default WordSolverX layout and light theme.
			</p>
		</section>

		<section class="bg-white/90 border border-slate-200 rounded-[28px] shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-5 sm:p-7">
			<div class="flex flex-wrap justify-center gap-2 mb-5">
				{#each MODE_ENTRIES as [modeKey, config]}
					<button
						type="button"
						onclick={() => setMode(modeKey)}
						class={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
							mode === modeKey
								? 'bg-[#00d4aa] text-slate-950 shadow-sm'
								: 'bg-slate-100 text-slate-600 hover:bg-slate-200'
						}`}
					>
						{config.name} ({config.length})
					</button>
				{/each}
			</div>

			<div class="flex flex-wrap items-center justify-center gap-3 mb-5">
				<div class="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-slate-700">
					Remaining <span class="font-bold text-emerald-700 ml-1">{remaining.toLocaleString()}</span>
				</div>
				<div class="px-4 py-2 rounded-xl bg-orange-50 border border-orange-100 text-sm text-slate-700">
					Guesses <span class="font-bold text-orange-600 ml-1">{guesses.length}</span>
				</div>
				<div class="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
					Equations <span class="font-bold text-slate-900 ml-1">{totalCount.toLocaleString()}</span>
				</div>
				{#if guesses.length > 0}
					<button
						type="button"
						onclick={resetSolver}
						class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
					>
						Reset
					</button>
				{/if}
			</div>

			{#if loadError}
				<div class="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
					{loadError}
				</div>
			{/if}

			{#if isLoading}
				<div class="py-16 text-center">
					<div class="w-12 h-12 mx-auto rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin"></div>
					<p class="mt-4 text-slate-600">Loading {MODE_CONFIG[mode].name} equations...</p>
				</div>
			{:else}
				<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
					<div class="space-y-5">
						<div class="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
							<div class="flex justify-center mb-4">
								<div class="flex gap-1.5">
									{#each Array(targetLength).fill(null) as _, index}
										<div class={getTileClass(targetLength, Boolean(currentInput[index]))}>
											{currentInput[index] || ''}
										</div>
									{/each}
								</div>
							</div>

							<div class="space-y-2">
								{#each keypadRows as row}
									<div class="flex flex-wrap justify-center gap-1.5">
										{#each row as key}
											<button
												type="button"
												onclick={() => handleKeypadPress(key)}
												class={`${
													key === '='
														? 'bg-[#00d4aa] border-[#00b894] text-slate-950'
														: 'bg-white border-slate-200 text-slate-700'
												} min-w-10 h-11 px-3 rounded-xl border font-bold hover:translate-y-[-1px] transition-transform`}
											>
												{key === '²' ? 'x²' : key === '³' ? 'x³' : key}
											</button>
										{/each}
										{#if row === keypadRows[keypadRows.length - 1]}
											<button
												type="button"
												onclick={handleBackspace}
												class="min-w-14 h-11 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold"
											>
												DEL
											</button>
										{/if}
									</div>
								{/each}
							</div>

							<button
								type="button"
								onclick={() => addGuess(currentInput)}
								disabled={!isInputValid}
								class={`mt-4 w-full rounded-2xl py-3 font-bold transition-colors ${
									isInputValid
										? 'bg-slate-900 text-white hover:bg-slate-800'
										: 'bg-slate-200 text-slate-400 cursor-not-allowed'
								}`}
							>
								{#if currentInput.length < targetLength}
									{currentInput.length}/{targetLength} characters
								{:else if isInputValid}
									Add Guess
								{:else}
									Invalid equation
								{/if}
							</button>
						</div>

						<div class="flex justify-center gap-4 text-xs text-slate-500">
							<div class="flex items-center gap-2">
								<div class="w-4 h-4 rounded bg-[#00d4aa]"></div>
								<span>Correct</span>
							</div>
							<div class="flex items-center gap-2">
								<div class="w-4 h-4 rounded bg-[#f78166]"></div>
								<span>Present</span>
							</div>
							<div class="flex items-center gap-2">
								<div class="w-4 h-4 rounded bg-slate-800"></div>
								<span>Absent</span>
							</div>
						</div>

						{#if guesses.length > 0}
							<div class="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
								<div class="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-700">
									<div class="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
									Tap each tile to match the Nerdle feedback
								</div>

								<div class="space-y-3">
									{#each guesses as guess, guessIndex}
										<div class="flex items-center justify-center gap-2">
											<div class="flex gap-1">
												{#each guess.equation.split('') as char, charIndex}
													<button
														type="button"
														onclick={() => toggleFeedback(guessIndex, charIndex)}
														class={getGuessTileClass(targetLength, guess.feedback[charIndex])}
													>
														{char}
													</button>
												{/each}
											</div>
											<button
												type="button"
												onclick={() => removeGuess(guessIndex)}
												class="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold"
											>
												×
											</button>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>

					<div class="space-y-5">
						<button
							type="button"
							onclick={handleSolve}
							disabled={isCalculating}
							class="w-full rounded-3xl py-4 px-5 bg-gradient-to-r from-[#f78166] to-[#e17055] text-white font-bold text-lg shadow-lg disabled:opacity-70"
						>
							{#if isCalculating}
								Calculating...
							{:else}
								Get Best Guesses
							{/if}
						</button>

						<div class="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
							<div class="flex items-center justify-between gap-3 mb-4">
								<div>
									<h2 class="text-lg font-bold text-slate-900">Best Guesses</h2>
									<p class="text-sm text-slate-500">
										{remaining.toLocaleString()} possible equation{remaining === 1 ? '' : 's'}
									</p>
								</div>
								<div class="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
									Avg 3.05 guesses
								</div>
							</div>

							{#if suggestions.length === 0}
								<div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
									<p class="font-semibold text-slate-700">No matches found</p>
									<p class="text-sm text-slate-500 mt-1">Check the feedback colors and try again.</p>
								</div>
							{:else}
								<div class="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
									{#each suggestions as item, index}
										<div class="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3">
											<div class="flex items-center gap-3">
												<button
													type="button"
													onclick={() => addGuess(item.eq)}
													class="flex-1 text-left flex items-center gap-3 hover:opacity-90 transition-opacity"
												>
													<div class="w-10 text-center shrink-0">
														<p class="text-sm font-bold text-slate-700">#{index + 1}</p>
														{#if index === 0}
															<p class="text-[10px] font-bold uppercase tracking-wide text-emerald-600">Best</p>
														{/if}
													</div>

													<div class="flex gap-1 flex-1 justify-center">
														{#each item.eq.split('') as char}
															<div class={getSuggestionTileClass(targetLength)}>
																{char}
															</div>
														{/each}
													</div>
												</button>

												<div class="flex flex-col items-end gap-2 shrink-0">
													<div class="px-2 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600">
														E: {item.entropy.toFixed(2)}
													</div>
													<button
														type="button"
														onclick={() => void copyEquation(item.eq)}
														class="text-xs font-semibold text-slate-500 hover:text-emerald-600"
													>
														{copiedEq === item.eq ? 'Copied' : 'Copy'}
													</button>
												</div>
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</div>

						<div class="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
							<h3 class="font-bold text-slate-900 mb-2">How this page works</h3>
							<p class="text-sm text-slate-600 leading-relaxed">
								This is the copied all-modes Nerdle solver page using the same mode files and the same
								server-side suggestion logic. The only deliberate visual change is that the surrounding page
								stays light-themed to match WordSolverX.
							</p>
						</div>
					</div>
				</div>
			{/if}
		</section>
	</div>
</div>
