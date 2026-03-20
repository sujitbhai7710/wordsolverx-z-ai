<script lang="ts">
  import { onMount } from 'svelte';

  type LetterResult = 'correct' | 'present' | 'absent';

  interface GuessEntry {
    word: string;
    result: LetterResult[];
  }

  interface Suggestion {
    word: string;
    entropy: number;
    expected_remaining: number;
    is_possible_answer: boolean;
    freq_score?: number;
  }

  interface SolveResult {
    remaining_count: number;
    possible_answers: string[];
    best_guesses: Suggestion[];
    solve_time_ms: number;
  }

  interface WasmSolver {
    get_starters(count: number): string[];
    solve(guesses: Array<{ word: string; result: string }>): SolveResult;
    word_count(): number;
    free(): void;
  }

  let solver: WasmSolver | null = null;
  let isReady = false;
  let loading = true;
  let errorMessage = '';
  let newWord = '';
  let guesses: GuessEntry[] = [];
  let starters: string[] = [];
  let suggestions: Suggestion[] = [];
  let possibleAnswers: string[] = [];
  let remainingCount = 0;
  let solveTimeMs = 0;
  let copied = false;

  const RESULT_CLASS: Record<LetterResult, string> = {
    absent: 'bg-slate-400 border-slate-500 text-white',
    present: 'bg-amber-400 border-amber-500 text-slate-900',
    correct: 'bg-emerald-500 border-emerald-600 text-white'
  };

  const RESULT_EMOJI: Record<LetterResult, string> = {
    absent: '[ ]',
    present: '[~]',
    correct: '[x]'
  };

  function resultToPattern(result: LetterResult[]) {
    return result
      .map((value) => (value === 'correct' ? 'G' : value === 'present' ? 'Y' : 'B'))
      .join('');
  }

  function cycleLetterResult(guessIndex: number, letterIndex: number) {
    const current = guesses[guessIndex].result[letterIndex];
    const next: LetterResult =
      current === 'absent' ? 'present' : current === 'present' ? 'correct' : 'absent';

    guesses = guesses.map((guess, gIndex) =>
      gIndex !== guessIndex
        ? guess
        : {
            ...guess,
            result: guess.result.map((entry, rIndex) => (rIndex === letterIndex ? next : entry))
          }
    );

    runSolve();
  }

  function addGuess(word = newWord) {
    const normalized = word.toLowerCase().trim();
    if (normalized.length !== 5 || !/^[a-z]{5}$/.test(normalized)) {
      errorMessage = 'Enter a valid 5-letter word before adding it.';
      return;
    }

    guesses = [
      ...guesses,
      {
        word: normalized,
        result: ['absent', 'absent', 'absent', 'absent', 'absent']
      }
    ];

    newWord = '';
    errorMessage = '';
    runSolve();
  }

  function removeGuess(index: number) {
    guesses = guesses.filter((_, guessIndex) => guessIndex !== index);
    runSolve();
  }

  function resetSolver() {
    guesses = [];
    suggestions = starters.map((word, index) => ({
      word,
      entropy: 4.2 - index * 0.12,
      expected_remaining: 140 - index * 10,
      is_possible_answer: true
    }));
    possibleAnswers = [];
    remainingCount = solver?.word_count() || 0;
    solveTimeMs = 0;
    errorMessage = '';
  }

  function useSuggestion(word: string) {
    newWord = word;
  }

  async function copyResults() {
    if (!guesses.length) {
      return;
    }

    const text = guesses
      .map((guess) => `${guess.word.toUpperCase()}: ${guess.result.map((entry) => RESULT_EMOJI[entry]).join('')}`)
      .join('\n');

    await navigator.clipboard.writeText(text);
    copied = true;
    window.setTimeout(() => {
      copied = false;
    }, 1500);
  }

  function runSolve() {
    if (!solver) {
      return;
    }

    if (!guesses.length) {
      resetSolver();
      return;
    }

    try {
      const result = solver.solve(
        guesses.map((guess) => ({
          word: guess.word,
          result: resultToPattern(guess.result)
        }))
      );

      suggestions = result.best_guesses || [];
      possibleAnswers =
        result.possible_answers.length > 0 && result.possible_answers.length <= 50
          ? result.possible_answers
          : [];
      remainingCount = result.remaining_count;
      solveTimeMs = result.solve_time_ms;
      errorMessage = '';
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Could not solve this Phoodle state.';
    }
  }

  onMount(() => {
    let disposed = false;
    let blobUrl: string | null = null;

    void (async () => {
      try {
        const jsResponse = await fetch('/phoodle-wasm/phoodle_solver.js');
        if (!jsResponse.ok) {
          throw new Error(`Failed to load WASM glue code: ${jsResponse.status}`);
        }

        const jsCode = await jsResponse.text();
        blobUrl = URL.createObjectURL(new Blob([jsCode], { type: 'application/javascript' }));
        const wasmModule = await import(/* @vite-ignore */ blobUrl);
        await wasmModule.default('/phoodle-wasm/phoodle_solver_bg.wasm');

        if (disposed) return;

        solver = new wasmModule.PhoodleSolver() as WasmSolver;
        starters = solver.get_starters(10);
        isReady = true;
        remainingCount = solver.word_count();
        resetSolver();
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Failed to load the Phoodle WASM solver.';
      } finally {
        if (!disposed) {
          loading = false;
        }
      }
    })();

    return () => {
      disposed = true;
      solver?.free();
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  });
</script>

<section class="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.16),_transparent_34%),linear-gradient(180deg,#fff8f1_0%,#ffffff_42%,#fffdf7_100%)] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
  <div class="pointer-events-none absolute inset-x-0 top-0 mx-auto h-72 max-w-5xl rounded-full bg-orange-200/30 blur-3xl"></div>

  <div class="relative mx-auto max-w-6xl space-y-8">
    <div class="rounded-[2rem] border border-orange-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(249,115,22,0.12)] backdrop-blur sm:p-8">
      <div class="flex flex-wrap items-start justify-between gap-6">
        <div class="max-w-3xl">
          <p class="inline-flex rounded-full bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
            WASM powered solver
          </p>
          <h2 class="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Phoodle Solver</h2>
          <p class="mt-4 text-base leading-8 text-slate-600">
            Use the same standalone WASM solver from the original Phoodle project. Add your guesses, tap the result colors to match the game, and get the strongest next food-word suggestions instantly.
          </p>
          <a class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition hover:text-orange-700" href="https://www.phoodle.net/" rel="noopener noreferrer" target="_blank">
            Play Phoodle
            <span aria-hidden="true">-></span>
          </a>
        </div>

        <div class="min-w-[240px] rounded-3xl border border-orange-100 bg-orange-50/80 p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">Solver status</p>
          {#if loading}
            <p class="mt-3 text-sm font-medium text-slate-600">Loading WASM solver...</p>
          {:else if isReady}
            <p class="mt-3 text-2xl font-black text-slate-900">{remainingCount.toLocaleString()}</p>
            <p class="mt-1 text-sm text-slate-600">
              {#if guesses.length}
                possible words remaining
              {:else}
                total candidate words loaded
              {/if}
            </p>
          {:else}
            <p class="mt-3 text-sm font-medium text-rose-600">Solver unavailable</p>
          {/if}
        </div>
      </div>
    </div>

    <div class="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div class="space-y-6">
        <section class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(148,163,184,0.12)] sm:p-8">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 class="text-xl font-bold text-slate-900">Add your guess</h3>
              <p class="mt-1 text-sm text-slate-500">Type the 5-letter food word you just tried in Phoodle.</p>
            </div>
            <div class="rounded-full bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-700">
              {guesses.length}/6 guesses
            </div>
          </div>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              bind:value={newWord}
              class="h-12 flex-1 rounded-2xl border-2 border-slate-200 px-4 text-lg font-bold uppercase tracking-[0.25em] text-slate-900 outline-none transition focus:border-orange-400"
              maxlength="5"
              on:keydown={(event) => event.key === 'Enter' && addGuess()}
              placeholder="CRISP"
              spellcheck="false"
            />
            <button class="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:translate-y-[-1px] disabled:opacity-60" disabled={!isReady} on:click={() => addGuess()} type="button">
              Add guess
            </button>
          </div>

          {#if !guesses.length && starters.length}
            <div class="mt-6">
              <p class="text-sm font-medium text-slate-500">Try one of these starters</p>
              <div class="mt-3 flex flex-wrap gap-2">
                {#each starters.slice(0, 8) as starter}
                  <button class="rounded-full border border-orange-200 bg-white px-3 py-2 font-mono text-sm font-semibold uppercase text-orange-700 transition hover:border-orange-400 hover:bg-orange-50" on:click={() => addGuess(starter)} type="button">
                    {starter}
                  </button>
                {/each}
              </div>
            </div>
          {/if}

          {#if errorMessage}
            <div class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          {/if}
        </section>

        <section class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(148,163,184,0.12)] sm:p-8">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 class="text-xl font-bold text-slate-900">Your guesses</h3>
              <p class="mt-1 text-sm text-slate-500">Tap letters to cycle absent, present, and correct.</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:text-orange-700" disabled={!guesses.length} on:click={copyResults} type="button">
                {#if copied}Copied{:else}Copy{/if}
              </button>
              <button class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-700" on:click={resetSolver} type="button">
                Reset
              </button>
            </div>
          </div>

          {#if !guesses.length}
            <div class="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center text-sm text-slate-500">
              Add your first guess above, then tap each tile until it matches the Phoodle feedback.
            </div>
          {:else}
            <div class="mt-6 space-y-4">
              {#each guesses as guess, guessIndex}
                <div class="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50/70 px-4 py-4">
                  <div class="w-6 text-sm font-semibold text-slate-400">{guessIndex + 1}.</div>
                  <div class="flex flex-1 flex-wrap gap-2">
                    {#each guess.word.split('') as letter, letterIndex}
                      <button class={`flex h-11 w-11 items-center justify-center rounded-2xl border-2 text-base font-black uppercase transition hover:scale-[1.04] ${RESULT_CLASS[guess.result[letterIndex]]}`} on:click={() => cycleLetterResult(guessIndex, letterIndex)} type="button">
                        {letter}
                      </button>
                    {/each}
                  </div>
                  <button class="rounded-full p-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-50" on:click={() => removeGuess(guessIndex)} type="button">
                    Remove
                  </button>
                </div>
              {/each}
            </div>
          {/if}

          <div class="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
            <div class="flex items-center gap-2"><span class="h-3 w-3 rounded bg-slate-400"></span>Absent</div>
            <div class="flex items-center gap-2"><span class="h-3 w-3 rounded bg-amber-400"></span>Wrong spot</div>
            <div class="flex items-center gap-2"><span class="h-3 w-3 rounded bg-emerald-500"></span>Correct</div>
          </div>
        </section>
      </div>

      <div class="space-y-6">
        <section class="rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 shadow-[0_24px_70px_rgba(249,115,22,0.1)] sm:p-8">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 class="text-xl font-bold text-slate-900">Best next guesses</h3>
              <p class="mt-1 text-sm text-slate-500">
                {#if guesses.length}
                  Click any suggestion to load it into the guess box.
                {:else}
                  Your starter suggestions appear here as soon as the solver loads.
                {/if}
              </p>
            </div>
            {#if guesses.length}
              <div class="rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-700 shadow-sm">
                {solveTimeMs.toFixed(1)}ms
              </div>
            {/if}
          </div>

          <div class="mt-6 space-y-3">
            {#each suggestions.slice(0, 10) as suggestion, index}
              <button class={`w-full rounded-3xl border px-4 py-4 text-left transition hover:bg-white/80 ${index === 0 ? 'border-orange-300 bg-white/80 shadow-sm' : 'border-white/70 bg-white/55'}`} on:click={() => useSuggestion(suggestion.word)} type="button">
                <div class="flex items-center justify-between gap-4">
                  <div class="flex min-w-0 items-center gap-3">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-black text-orange-700">
                      {index + 1}
                    </div>
                    <div>
                      <p class="font-mono text-lg font-bold uppercase tracking-[0.18em] text-slate-900">{suggestion.word}</p>
                      {#if suggestion.is_possible_answer}
                        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Likely answer</p>
                      {/if}
                    </div>
                  </div>
                  <div class="text-right text-xs text-slate-500">
                    <p>Entropy {suggestion.entropy.toFixed(2)}</p>
                    <p>~{Math.round(suggestion.expected_remaining)} left</p>
                  </div>
                </div>
              </button>
            {/each}
          </div>
        </section>

        {#if possibleAnswers.length}
          <section class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(148,163,184,0.12)] sm:p-8">
            <h3 class="text-xl font-bold text-slate-900">Possible answers</h3>
            <p class="mt-1 text-sm text-slate-500">{possibleAnswers.length} answer candidates fit your current clues.</p>

            <div class="mt-6 flex max-h-72 flex-wrap gap-2 overflow-y-auto pr-1">
              {#each possibleAnswers as answer}
                <button class="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm font-semibold uppercase text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700" on:click={() => useSuggestion(answer)} type="button">
                  {answer}
                </button>
              {/each}
            </div>
          </section>
        {/if}
      </div>
    </div>
  </div>
</section>
