<script lang="ts">
	import { onMount } from 'svelte';

	type Feedback = 'absent' | 'present' | 'correct';

	interface Suggestion {
		word: string;
		entropy: number;
		expected_remaining: number;
		is_possible_answer: boolean;
	}

	interface WasmSolver {
		reset(): void;
		remaining_count(): number;
		get_possible_answers(): string[];
		add_guess(word: string, feedback: string[]): boolean;
		get_suggestions(max_count: number): Suggestion[];
		is_valid_word(word: string): boolean;
		word_count(): number;
	}

	interface WasmModuleShape {
		CanuckleSolver: new () => WasmSolver;
		default: (input?: string | URL | Request | Response | ArrayBuffer | Promise<any>) => Promise<any>;
	}

	const keyboardRows = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
		['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
	];

	let wasmPromise: Promise<WasmModuleShape> | null = null;

	function loadWasmModule(): Promise<WasmModuleShape> {
		if (!wasmPromise) {
			wasmPromise = (async () => {
				const modulePath = '/wasm/canuckle_solver_wasm.js';
				// @ts-expect-error served from static /wasm at runtime
				const module = (await import(
					/* @vite-ignore */ modulePath
				)) as unknown as WasmModuleShape;
				await module.default();
				return module;
			})();
		}
		return wasmPromise;
	}

	let solver = $state<WasmSolver | null>(null);
	let loading = $state(true);
	let loadError = $state('');
	let validationError = $state('');
	let currentGuess = $state('');
	let guesses = $state<Array<{ word: string; feedback: Feedback[] }>>([]);
	let suggestions = $state<Suggestion[]>([]);
	let possibleAnswers = $state<string[]>([]);
	let remainingCount = $state(0);
	let keyboardState = $state<Record<string, Feedback>>({});
	let draftFeedback = $state<Feedback[]>(['absent', 'absent', 'absent', 'absent', 'absent']);

	const showFeedbackSelector = $derived(currentGuess.length === 5);

	function refreshSolverState() {
		if (!solver) {
			return;
		}

		solver.reset();
		for (const guess of guesses) {
			solver.add_guess(guess.word, guess.feedback);
		}

		suggestions = solver.get_suggestions(10) ?? [];
		possibleAnswers = guesses.length > 0 ? (solver.get_possible_answers() ?? []).slice(0, 20) : [];
		remainingCount = guesses.length > 0 ? solver.remaining_count() : solver.word_count();
	}

	function updateKeyboard(word: string, feedback: Feedback[]) {
		const nextState = { ...keyboardState };
		word.split('').forEach((letter, index) => {
			const state = feedback[index];
			if (state === 'correct') {
				nextState[letter] = 'correct';
				return;
			}
			if (state === 'present' && nextState[letter] !== 'correct') {
				nextState[letter] = 'present';
				return;
			}
			if (!nextState[letter]) {
				nextState[letter] = 'absent';
			}
		});
		keyboardState = nextState;
	}

	function handleGuessInput(value: string) {
		currentGuess = value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
		validationError = '';
		draftFeedback = ['absent', 'absent', 'absent', 'absent', 'absent'];
	}

	function cycleDraftFeedback(index: number) {
		const order: Feedback[] = ['absent', 'present', 'correct'];
		const currentIndex = order.indexOf(draftFeedback[index]);
		draftFeedback[index] = order[(currentIndex + 1) % order.length];
		draftFeedback = [...draftFeedback];
	}

	function submitGuess() {
		if (!solver || currentGuess.length !== 5) {
			return;
		}

		const guess = currentGuess.toUpperCase();
		if (!solver.is_valid_word(guess)) {
			validationError = 'That word is not in the Canuckle solver dictionary.';
			return;
		}

		const feedback = [...draftFeedback];
		guesses = [...guesses, { word: guess, feedback }];
		updateKeyboard(guess, feedback);
		currentGuess = '';
		draftFeedback = ['absent', 'absent', 'absent', 'absent', 'absent'];
		validationError = '';
		refreshSolverState();
	}

	function handleReset() {
		guesses = [];
		currentGuess = '';
		draftFeedback = ['absent', 'absent', 'absent', 'absent', 'absent'];
		keyboardState = {};
		validationError = '';
		refreshSolverState();
	}

	function handleKeyPress(key: string) {
		if (key === 'BACK') {
			handleGuessInput(currentGuess.slice(0, -1));
			return;
		}
		if (key === 'ENTER') {
			return;
		}
		if (currentGuess.length < 5) {
			handleGuessInput(currentGuess + key);
		}
	}

	function getFeedbackClasses(state: Feedback) {
		if (state === 'correct') {
			return 'bg-green-600 text-white border-green-700';
		}
		if (state === 'present') {
			return 'bg-yellow-500 text-white border-yellow-600';
		}
		return 'bg-gray-500 text-white border-gray-600';
	}

	function getKeyClasses(key: string) {
		const state = keyboardState[key];
		if (state === 'correct') {
			return 'bg-green-600 text-white';
		}
		if (state === 'present') {
			return 'bg-yellow-500 text-white';
		}
		if (state === 'absent') {
			return 'bg-gray-500 text-white';
		}
		return 'bg-gray-200 text-gray-800';
	}

	onMount(async () => {
		try {
			const wasmModule = await loadWasmModule();
			solver = new wasmModule.CanuckleSolver();
			refreshSolverState();
		} catch (error) {
			loadError = error instanceof Error ? error.message : 'Failed to load the Canuckle solver.';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Canuckle Solver - WASM Entropy Helper | WordSolverX</title>
	<meta
		name="description"
		content="Use the original Canuckle WASM solver with entropy-ranked suggestions, feedback entry, and live remaining-answer filtering."
	/>
	<link rel="canonical" href="https://wordsolver.tech/canuckle-solver" />
</svelte:head>

<div class="min-h-screen bg-red-50">
	<header class="bg-red-600 px-4 py-4 text-white">
		<div class="mx-auto flex max-w-4xl items-center justify-between">
			<h1 class="text-2xl font-bold">CANUCKLE</h1>
			<span class="text-sm font-medium">Answers and Solver</span>
		</div>
	</header>

	<nav class="mx-auto mt-4 flex max-w-4xl gap-2 px-4">
		<a
			class="flex-1 rounded-lg bg-gray-200 px-4 py-3 text-center font-bold text-gray-700"
			href="/canuckle-answer-today"
		>
			Today's Answer
		</a>
		<a
			class="flex-1 rounded-lg bg-gray-200 px-4 py-3 text-center font-bold text-gray-700"
			href="/canuckle-archive"
		>
			Archive
		</a>
		<a class="flex-1 rounded-lg bg-red-600 px-4 py-3 text-center font-bold text-white" href="/canuckle-solver">
			Solver
		</a>
	</nav>

	<main class="mx-auto max-w-4xl px-4 py-6">
		{#if loading}
			<div class="rounded-xl bg-white p-10 text-center shadow-md">
				<div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
				<p class="text-gray-600">Loading WASM Solver...</p>
			</div>
		{:else if loadError}
			<div class="rounded-xl bg-white p-10 text-center shadow-md">
				<p class="font-semibold text-red-600">{loadError}</p>
			</div>
		{:else}
			<div class="space-y-4">
				<div class="grid gap-4 md:grid-cols-3">
					<div class="rounded-xl bg-white p-4 text-center shadow-md">
						<div class="text-3xl font-bold text-gray-900">{remainingCount}</div>
						<div class="text-xs uppercase tracking-wide text-gray-500">Possible Words</div>
					</div>
					<div class="rounded-xl bg-white p-4 text-center shadow-md">
						<div class="text-3xl font-bold text-gray-900">{guesses.length}</div>
						<div class="text-xs uppercase tracking-wide text-gray-500">Guesses Made</div>
					</div>
					<div class="rounded-xl bg-white p-4 text-center shadow-md">
						<div class="text-3xl font-bold text-gray-900">
							{suggestions[0] ? suggestions[0].entropy.toFixed(2) : '0.00'}
						</div>
						<div class="text-xs uppercase tracking-wide text-gray-500">Best Entropy</div>
					</div>
				</div>

				<section class="rounded-xl bg-white p-6 shadow-md">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-xl font-bold text-gray-900">Best Guesses</h2>
						<button
							class="rounded-lg bg-gray-200 px-4 py-2 font-bold text-gray-700"
							type="button"
							onclick={handleReset}
						>
							Reset
						</button>
					</div>

					<div class="space-y-2">
						{#each suggestions.slice(0, 5) as suggestion, index}
							<button
								class={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left ${
									index === 0
										? 'border-2 border-green-600 bg-green-50'
										: suggestion.is_possible_answer
											? 'bg-blue-50'
											: 'bg-gray-50'
								}`}
								type="button"
								onclick={() => handleGuessInput(suggestion.word)}
							>
								<div class="flex items-center gap-3">
									<span class="text-lg font-bold text-gray-900">{suggestion.word}</span>
									{#if index === 0}
										<span class="rounded bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white">BEST</span>
									{/if}
									{#if suggestion.is_possible_answer}
										<span class="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">POSSIBLE</span>
									{/if}
								</div>
								<div class="text-right">
									<div class="text-sm font-semibold text-gray-900">
										Entropy: {suggestion.entropy.toFixed(3)}
									</div>
									<div class="text-xs text-gray-500">
										~{suggestion.expected_remaining.toFixed(1)} words left
									</div>
								</div>
							</button>
						{/each}
					</div>
				</section>

				<section class="rounded-xl bg-white p-6 shadow-md">
					<h2 class="mb-4 text-xl font-bold text-gray-900">Your Guesses</h2>

					<div class="mb-6 space-y-2">
						{#each guesses as guess}
							<div class="flex justify-center gap-1">
								{#each guess.word.split('') as letter, index}
									<div
										class={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-xl font-bold ${getFeedbackClasses(guess.feedback[index])}`}
									>
										{letter}
									</div>
								{/each}
							</div>
						{/each}

						{#if showFeedbackSelector}
							<div class="rounded-lg bg-gray-50 p-4">
								<p class="mb-3 text-center text-sm text-gray-600">
									Click each letter to set feedback from Canuckle.
								</p>
								<div class="mb-4 flex justify-center gap-1">
									{#each currentGuess.split('') as letter, index}
										<button
											class={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-xl font-bold ${getFeedbackClasses(draftFeedback[index])}`}
											type="button"
											onclick={() => cycleDraftFeedback(index)}
										>
											{letter}
										</button>
									{/each}
								</div>
								<div class="flex justify-center gap-2">
									<button
										class="rounded-lg bg-red-600 px-4 py-2 font-bold text-white"
										type="button"
										onclick={submitGuess}
									>
										Submit Guess
									</button>
									<button
										class="rounded-lg bg-gray-200 px-4 py-2 text-gray-700"
										type="button"
										onclick={() => handleGuessInput('')}
									>
										Cancel
									</button>
								</div>
							</div>
						{/if}

						{#each Array(Math.max(0, 6 - guesses.length)) as _, rowIndex}
							<div class="flex justify-center gap-1">
								{#each Array(5) as _, columnIndex}
									<div
										class="h-12 w-12 rounded-lg border-2 border-gray-200"
										aria-label={`empty-${rowIndex}-${columnIndex}`}
									></div>
								{/each}
							</div>
						{/each}
					</div>

					<div class="mb-4 flex gap-2">
						<input
							class="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-lg uppercase tracking-[0.3em] text-gray-900 outline-none focus:border-red-500"
							maxlength="5"
							placeholder="Type a guess..."
							type="text"
							value={currentGuess}
							oninput={(event) => handleGuessInput((event.currentTarget as HTMLInputElement).value)}
						/>
						<button
							class={`rounded-lg px-4 py-3 font-bold text-white ${
								currentGuess.length === 5 ? 'bg-red-600' : 'bg-gray-400'
							}`}
							disabled={currentGuess.length !== 5}
							type="button"
						>
							Set Feedback
						</button>
					</div>

					{#if validationError}
						<p class="mb-4 text-sm font-medium text-red-600">{validationError}</p>
					{/if}

					<div class="space-y-2">
						{#each keyboardRows as row}
							<div class="flex justify-center gap-1">
								{#each row as key}
									<button
										class={`rounded-lg px-2 py-3 text-sm font-bold ${
											key === 'ENTER' || key === 'BACK'
												? 'min-w-[64px] bg-gray-300 text-gray-700'
												: `min-w-[36px] ${getKeyClasses(key)}`
										}`}
										type="button"
										onclick={() => handleKeyPress(key)}
									>
										{key === 'BACK' ? 'Back' : key}
									</button>
								{/each}
							</div>
						{/each}
					</div>
				</section>

				{#if possibleAnswers.length > 0 && possibleAnswers.length <= 20}
					<section class="rounded-xl bg-white p-6 shadow-md">
						<h2 class="text-xl font-bold text-gray-900">Remaining Possible Answers</h2>
						<p class="mb-4 mt-1 text-sm text-gray-500">
							{possibleAnswers.length} words match your clues.
						</p>
						<div class="flex flex-wrap gap-2">
							{#each possibleAnswers as word}
								<button
									class="rounded-lg bg-red-50 px-4 py-2 font-bold text-red-800"
									type="button"
									onclick={() => handleGuessInput(word)}
								>
									{word}
								</button>
							{/each}
						</div>
					</section>
				{/if}
			</div>
		{/if}
	</main>

	<footer class="px-4 py-8 text-center text-sm text-gray-600">
		<a class="font-semibold text-red-600" href="https://www.canucklegame.ca" rel="noopener noreferrer" target="_blank">
			Play the official game
		</a>
		<p class="mt-2">This page now uses the original Canuckle WASM solver logic during play.</p>
	</footer>
</div>
