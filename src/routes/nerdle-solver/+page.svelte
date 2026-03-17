<script lang="ts">
	import { onMount } from 'svelte';

	type FeedbackColor = 'absent' | 'correct' | 'present';

	interface GuessRow {
		equation: string;
		feedback: FeedbackColor[];
	}

	interface ScoredEquation {
		eq: string;
		score: number;
	}

	const VALID_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '='];

	let allEquations = $state<string[]>([]);
	let isLoading = $state(true);
	let guesses = $state<GuessRow[]>([]);
	let copiedEq = $state<string | null>(null);
	let currentInput = $state('');
	let displayedResults = $state<ScoredEquation[]>([]);

	function filterEquations(equations: string[], guess: string, feedback: FeedbackColor[]): string[] {
		return equations.filter((eq) => {
			for (let i = 0; i < 8; i++) {
				const guessChar = guess[i];
				const feedbackColor = feedback[i];

				if (feedbackColor === 'correct') {
					if (eq[i] !== guessChar) return false;
				} else if (feedbackColor === 'present') {
					if (eq[i] === guessChar) return false;
					if (!eq.includes(guessChar)) return false;
				} else if (feedbackColor === 'absent') {
					const hasCorrectOrPresent = guess.split('').some((char, idx) => {
						return char === guessChar && (feedback[idx] === 'correct' || feedback[idx] === 'present');
					});
					if (hasCorrectOrPresent) continue;
					if (eq.includes(guessChar)) return false;
				}
			}
			return true;
		});
	}

	function scoreEquation(eq: string): number {
		const uniqueChars = new Set(eq.split(''));
		let score = uniqueChars.size * 10;
		score += ['+', '-', '*', '/'].filter((op) => eq.includes(op)).length * 5;
		if (eq.includes('=')) score += 3;
		return score;
	}

	function getBestGuesses(remaining: string[], count = 15): ScoredEquation[] {
		if (!remaining.length) return [];

		const scored = remaining.map((eq) => ({ eq, score: scoreEquation(eq) }));
		scored.sort((a, b) => b.score - a.score);

		if (remaining.length <= count) {
			return scored;
		}

		return scored.slice(0, count);
	}

	let filteredEquations = $derived.by(() => {
		let filtered = allEquations;
		for (const guess of guesses) {
			if (guess.feedback.some((f) => f !== 'absent')) {
				filtered = filterEquations(filtered, guess.equation, guess.feedback);
			}
		}
		return filtered;
	});

	let bestGuesses = $derived.by(() => getBestGuesses(filteredEquations, 15));
	let isInputValid = $derived(currentInput.length === 8 && allEquations.includes(currentInput));

	function addGuess(eq: string): void {
		if (eq.length !== 8 || guesses.some((g) => g.equation === eq)) {
			return;
		}

		guesses = [...guesses, { equation: eq, feedback: Array(8).fill('absent') as FeedbackColor[] }];
		currentInput = '';
	}

	function toggleFeedback(guessIndex: number, charIndex: number): void {
		const cycle: FeedbackColor[] = ['absent', 'correct', 'present'];
		const nextGuesses = guesses.map((row, idx) => {
			if (idx !== guessIndex) return row;
			const nextFeedback = [...row.feedback];
			const current = nextFeedback[charIndex];
			nextFeedback[charIndex] = cycle[(cycle.indexOf(current) + 1) % 3];
			return { ...row, feedback: nextFeedback };
		});
		guesses = nextGuesses;
	}

	function removeGuess(index: number): void {
		guesses = guesses.filter((_, i) => i !== index);
	}

	function reset(): void {
		guesses = [];
		currentInput = '';
		displayedResults = getBestGuesses(allEquations, 15);
	}

	async function copyEq(eq: string): Promise<void> {
		try {
			await navigator.clipboard.writeText(eq);
			copiedEq = eq;
			setTimeout(() => {
				copiedEq = null;
			}, 1500);
		} catch (error) {
			console.error('Failed to copy equation:', error);
		}
	}

	function handleCopyClick(event: MouseEvent, eq: string): void {
		event.stopPropagation();
		void copyEq(eq);
	}

	function handleKeypadPress(char: string): void {
		if (currentInput.length < 8) {
			currentInput = currentInput + char;
		}
	}

	function handleSubmit(): void {
		displayedResults = [...bestGuesses];
	}

	function handleKeyDown(event: KeyboardEvent): void {
		if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
			return;
		}

		const key = event.key;
		if (key === 'Enter' && currentInput.length === 8) {
			if (allEquations.includes(currentInput) && !guesses.some((g) => g.equation === currentInput)) {
				addGuess(currentInput);
			}
			return;
		}

		if (key === 'Backspace') {
			currentInput = currentInput.slice(0, -1);
			return;
		}

		if (VALID_CHARS.includes(key) && currentInput.length < 8) {
			currentInput = currentInput + key;
		}
	}

	function feedbackClasses(color: FeedbackColor): string {
		if (color === 'correct') return 'bg-[#10b981] border-[#059669]';
		if (color === 'present') return 'bg-[#a855f7] border-[#9333ea]';
		return 'bg-[#3f3f46] border-[#27272a]';
	}

	onMount(async () => {
		try {
			const response = await fetch('/equations.txt');
			const text = await response.text();
			const equations = text
				.split('\n')
				.map((entry) => entry.trim())
				.filter((entry) => entry.length === 8);
			allEquations = equations;
			displayedResults = getBestGuesses(equations, 15);
		} catch (error) {
			console.error('Failed to load equations:', error);
		} finally {
			isLoading = false;
		}
	});

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<svelte:head>
	<title>Nerdle Solver - Free Online Math Puzzle Helper | WordSolverX</title>
	<meta name="description" content="Solve Nerdle puzzles instantly with our free Nerdle solver. Enter equations, set tile feedback colors, and get top-ranked suggestions from 17,723 valid equations." />
	<link rel="canonical" href="https://wordsolverx.com/nerdle-solver" />
	<meta property="og:title" content="Nerdle Solver - Free Online Math Puzzle Helper" />
	<meta property="og:description" content="Use the Nerdle equation solver with smart ranked suggestions and tile feedback filtering." />
	<meta property="og:url" content="https://wordsolverx.com/nerdle-solver" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="WordSolverX" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Nerdle Solver - Free Online Math Puzzle Helper" />
	<meta name="twitter:description" content="Type equations, set colors, and solve Nerdle in fewer guesses." />
	<meta name="twitter:image" content="https://wordsolverx.com/wordsolverx.webp" />
</svelte:head>

{#if isLoading}
	<div class="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 flex items-center justify-center">
		<div class="text-center">
			<div class="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
			<p class="text-slate-600">Loading equations...</p>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 relative overflow-hidden">
		<div class="absolute inset-0 overflow-hidden pointer-events-none">
			<div class="absolute -top-20 -right-20 w-60 h-60 bg-emerald-200/40 rounded-full blur-3xl"></div>
			<div class="absolute top-1/3 -left-20 w-60 h-60 bg-purple-200/30 rounded-full blur-3xl"></div>
			<div class="absolute bottom-20 right-1/4 w-40 h-40 bg-teal-200/30 rounded-full blur-3xl"></div>
		</div>

		<div class="relative z-10 container mx-auto px-4 py-5 max-w-lg">
			<div class="text-center mb-4">
				<div class="inline-flex items-center gap-2 mb-1">
					<div class="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
						<svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m-8 5h10m-9 5h8M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
						</svg>
					</div>
					<h1 class="text-2xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
						Nerdle Solver
					</h1>
				</div>
				<p class="text-slate-500 text-xs">Type or tap to enter equations</p>
			</div>

			<div class="flex flex-wrap justify-center gap-2 mb-3">
				<div class="px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs">
					<span class="text-slate-500 mr-1">Solutions:</span>
					<span class="text-emerald-600 font-bold">{filteredEquations.length.toLocaleString()}</span>
				</div>
				<div class="px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs">
					<span class="text-slate-500 mr-1">Guesses:</span>
					<span class="text-purple-600 font-bold">{guesses.length}</span>
				</div>
				{#if guesses.length > 0}
					<button type="button" onclick={reset} class="h-6 px-2 text-xs text-slate-500 hover:text-slate-700 rounded hover:bg-slate-100">
						Reset
					</button>
				{/if}
			</div>

			<div class="mb-3">
				<div class="rounded-xl bg-white/90 border border-slate-200 shadow-md">
					<div class="pt-3 pb-2 px-3">
						<div class="flex justify-center mb-2">
							<div class="flex gap-0.5">
								{#each Array(8) as _, index}
									<div
										class={`w-10 h-12 rounded-lg font-bold text-xl flex items-center justify-center border-2 shadow-sm transition-all ${
											currentInput[index]
												? 'bg-white border-emerald-400 text-slate-800'
												: 'bg-slate-100 border-slate-300 text-slate-300'
										}`}
									>
										{currentInput[index] ?? ''}
									</div>
								{/each}
							</div>
						</div>

						<div class="space-y-1">
							<div class="flex justify-center gap-0.5">
								{#each ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as key}
									<button
										type="button"
										onclick={() => handleKeypadPress(key)}
										class="w-8 h-10 text-base font-bold p-0 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700"
									>
										{key}
									</button>
								{/each}
							</div>

							<div class="flex justify-center gap-0.5">
								{#each ['+', '-', '*', '/', '='] as key}
									<button
										type="button"
										onclick={() => handleKeypadPress(key)}
										class={`w-10 h-10 text-base font-bold p-0 rounded border ${
											key === '='
												? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-300'
												: 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
										}`}
									>
										{key}
									</button>
								{/each}

								<button
									type="button"
									onclick={() => (currentInput = currentInput.slice(0, -1))}
									class="w-12 h-10 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded p-0 font-bold text-xs"
								>
									DEL
								</button>
							</div>

							<button
								type="button"
								onclick={() => addGuess(currentInput)}
								disabled={!isInputValid}
								class={`w-full py-2 font-bold text-base rounded ${
									isInputValid
										? 'bg-emerald-600 hover:bg-emerald-700 text-white'
										: 'bg-slate-200 text-slate-400 cursor-not-allowed'
								}`}
							>
								{#if currentInput.length < 8}
									{currentInput.length}/8 characters
								{:else if isInputValid}
									Add Guess
								{:else}
									Invalid equation
								{/if}
							</button>
						</div>
					</div>
				</div>
			</div>

			<div class="flex justify-center gap-3 mb-3 text-xs">
				<div class="flex items-center gap-1">
					<div class="w-4 h-4 rounded bg-[#10b981]"></div>
					<span class="text-slate-600">Correct</span>
				</div>
				<div class="flex items-center gap-1">
					<div class="w-4 h-4 rounded bg-[#a855f7]"></div>
					<span class="text-slate-600">Present</span>
				</div>
				<div class="flex items-center gap-1">
					<div class="w-4 h-4 rounded bg-[#3f3f46]"></div>
					<span class="text-slate-600">Absent</span>
				</div>
			</div>

			{#if guesses.length > 0}
				<div class="mb-3 rounded-xl bg-white/90 border border-slate-200 shadow-md">
					<div class="py-2 px-3 border-b border-slate-200">
						<h2 class="text-slate-700 text-xs font-semibold">Your Guesses - Tap to set colors</h2>
					</div>
					<div class="space-y-1.5 p-3 pt-2">
						{#each guesses as guess, gIndex}
							<div class="flex items-center justify-center gap-1.5">
								<div class="flex gap-0.5">
									{#each guess.equation.split('') as char, cIndex}
										<button
											type="button"
											onclick={() => toggleFeedback(gIndex, cIndex)}
											class={`w-10 h-12 rounded-lg font-bold text-lg flex items-center justify-center border-2 transition-all text-white shadow-sm ${feedbackClasses(
												guess.feedback[cIndex]
											)}`}
										>
											{char}
										</button>
									{/each}
								</div>
								<button
									type="button"
									onclick={() => removeGuess(gIndex)}
									class="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
								>
									X
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<div class="mb-3">
				<button
					type="button"
					onclick={handleSubmit}
					class="w-full py-3 text-base font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg rounded-lg"
				>
					Submit and Get Solutions
				</button>
			</div>

			<div class="rounded-xl bg-white/90 border border-slate-200 shadow-md">
				<div class="py-2 px-3 border-b border-slate-200">
					<h2 class="text-slate-700 text-xs font-semibold">
						Suggested Guesses {#if filteredEquations.length > 0}({filteredEquations.length.toLocaleString()} possible){/if}
					</h2>
				</div>
				<div class="p-3 pt-2">
					{#if displayedResults.length === 0}
						<div class="text-center py-4 text-red-500 text-sm">
							<p class="font-medium">No matches found.</p>
							<p class="text-slate-500 text-xs mt-1">Check your feedback colors.</p>
						</div>
					{:else}
						<div class="h-[280px] overflow-y-auto pr-2">
							<div class="flex flex-col gap-2">
								{#each displayedResults as item, index}
									<div
										role="button"
										tabindex="0"
										onclick={() => addGuess(item.eq)}
										onkeydown={(event) => {
											if (event.key === 'Enter' || event.key === ' ') {
												event.preventDefault();
												addGuess(item.eq);
											}
										}}
										class="group flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-200 text-left"
									>
										<div class="flex flex-col items-center w-8">
											<span class="text-slate-500 text-sm font-bold">#{index + 1}</span>
											{#if index < 3}
												<span class={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
													index === 0
														? 'bg-yellow-400 text-yellow-900'
														: index === 1
															? 'bg-slate-300 text-slate-700'
															: 'bg-amber-600 text-white'
												}`}>
													TOP
												</span>
											{/if}
										</div>

										<div class="flex gap-1 flex-1 justify-center">
											{#each item.eq.split('') as char}
												<div class="w-8 h-10 rounded font-bold text-lg flex items-center justify-center border shadow-sm bg-white border-slate-300 text-slate-800">
													{char}
												</div>
											{/each}
										</div>

										<div class="flex flex-col items-center gap-1">
											<div class="text-[10px] px-1.5 py-0 h-5 rounded border bg-emerald-50 border-emerald-200 text-emerald-700 flex items-center">
												Score: {item.score}
											</div>
											<button
												type="button"
												onclick={(event) => handleCopyClick(event, item.eq)}
												class="h-6 w-6 text-slate-400 hover:text-emerald-600 rounded"
											>
												{copiedEq === item.eq ? 'OK' : 'CP'}
											</button>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>

			<div class="text-center mt-4 text-slate-500 text-xs">
				<p>Tap cells: Gray -> Green -> Purple | Type or tap to enter</p>
				<p class="text-slate-400 mt-0.5">Powered by 17,723 valid Nerdle equations</p>
			</div>
		</div>
	</div>
{/if}
