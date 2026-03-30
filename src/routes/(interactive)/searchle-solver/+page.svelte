<script lang="ts">
  import { onMount } from 'svelte';
  import type { SearchleDailyPuzzle } from '$lib/searchle/daily';
  import {
    type SearchleFeedback,
    type SearchleGuess,
    type SearchleSuggestion
  } from '$lib/searchle/searchleSolver';
  import FAQSection from '$lib/components/FAQSection.svelte';

  type SearchleRuntime = Pick<
    typeof import('$lib/searchle/searchleSolver'),
    'getSearchlePromptSuggestions' | 'solveSearchle'
  >;

  let searchleRuntimePromise: Promise<SearchleRuntime> | null = null;

  interface GuessResult {
    word: string;
    isCorrect: boolean;
    feedback: SearchleFeedback[];
  }

  type LetterState = SearchleFeedback;

  let { data } = $props<{
    data: {
      dailyPuzzle: SearchleDailyPuzzle;
    };
  }>();

  let prompt = $state('');
  let suggestions = $state<SearchleSuggestion[]>([]);
  let isLoading = $state(false);
  let runtimeLoading = $state(false);
  let error = $state<string | null>(null);
  let guesses = $state<GuessResult[]>([]);
  let currentGuess = $state('');
  let letterStates = $state<LetterState[]>([]);
  let isSolved = $state(false);
  let possibleWords = $state(0);
  let useDaily = $state(false);
  let promptSuggestions = $state<string[]>([]);
  let showPromptSuggestions = $state(false);
  let activePromptSuggestionIndex = $state(-1);
  let promptInput: HTMLInputElement | null = $state(null);
  let searchleRuntime = $state<SearchleRuntime | null>(null);
  const dailyPuzzle = $derived(data.dailyPuzzle);

  function loadSearchleRuntime(): Promise<SearchleRuntime> {
    if (!searchleRuntimePromise) {
      searchleRuntimePromise = import('$lib/searchle/searchleSolver').then((module) => ({
        getSearchlePromptSuggestions: module.getSearchlePromptSuggestions,
        solveSearchle: module.solveSearchle
      }));
    }

    return searchleRuntimePromise;
  }

  async function ensureSearchleRuntime(): Promise<SearchleRuntime | null> {
    if (searchleRuntime) return searchleRuntime;

    runtimeLoading = true;

    try {
      const runtime = await loadSearchleRuntime();
      searchleRuntime = runtime;
      return runtime;
    } catch {
      error = 'Failed to load Searchle solver data';
      return null;
    } finally {
      runtimeLoading = false;
    }
  }

  onMount(() => {
    void ensureSearchleRuntime();
  });

  async function refreshPromptSuggestions(query: string) {
    if (!query.trim()) {
      promptSuggestions = [];
      showPromptSuggestions = false;
      activePromptSuggestionIndex = -1;
      return;
    }

    const runtime = await ensureSearchleRuntime();
    if (!runtime) return;
    if (prompt !== query) return;

    promptSuggestions = runtime.getSearchlePromptSuggestions(query);
    showPromptSuggestions = promptSuggestions.length > 0 && query.trim().length > 0;
    activePromptSuggestionIndex = promptSuggestions.length > 0 ? 0 : -1;
  }

  function applyPromptSuggestion(suggestion: string) {
    prompt = suggestion;
    showPromptSuggestions = false;
    activePromptSuggestionIndex = -1;
    promptInput?.focus();
    const cursorPosition = suggestion.length;
    promptInput?.setSelectionRange(cursorPosition, cursorPosition);
  }

  function handlePromptInput(event: Event) {
    prompt = (event.currentTarget as HTMLInputElement).value;
    void refreshPromptSuggestions(prompt);
  }

  async function handleSolve() {
    if (!prompt.trim() || isLoading) return;

    isLoading = true;
    error = null;
    suggestions = [];
    guesses = [];
    isSolved = false;
    possibleWords = 0;
    useDaily = false;
    showPromptSuggestions = false;
    activePromptSuggestionIndex = -1;

    try {
      const runtime = await ensureSearchleRuntime();
      if (!runtime) return;
      const result = runtime.solveSearchle(prompt.trim(), []);
      suggestions = result.suggestions;
      possibleWords = result.totalWords;
    } catch {
      error = 'Failed to get suggestions';
    } finally {
      isLoading = false;
    }
  }

  function playDaily() {
    if (!dailyPuzzle) return;
    prompt = dailyPuzzle.prompt;
    useDaily = true;
    guesses = [];
    isSolved = false;
    suggestions = [];
    void refreshPromptSuggestions(prompt);
  }

  function selectWord(word: string) {
    currentGuess = word;
    letterStates = word.split('').map(() => 'unknown');
  }

  function toggleLetterState(index: number) {
    const states: LetterState[] = ['unknown', 'absent', 'partial', 'correct'];
    const next = [...letterStates];
    const currentIndex = states.indexOf(next[index]);
    next[index] = states[(currentIndex + 1) % states.length];
    letterStates = next;
  }

  async function submitGuess() {
    if (!currentGuess || letterStates.length === 0) return;

    const isCorrect = letterStates.every((state) => state === 'correct');
    const newGuess: GuessResult = {
      word: currentGuess,
      isCorrect,
      feedback: [...letterStates]
    };

    guesses = [...guesses, newGuess];

    if (isCorrect) {
      isSolved = true;
      return;
    }

    currentGuess = '';
    letterStates = [];
    isLoading = true;

    try {
      const runtime = await ensureSearchleRuntime();
      if (!runtime) return;
      const previousGuesses: SearchleGuess[] = guesses.map((guess) => ({
        word: guess.word,
        feedback: guess.feedback
      }));
      const result = runtime.solveSearchle(prompt.trim(), previousGuesses);
      suggestions = result.suggestions;
      possibleWords = result.totalWords;
    } catch {
      error = 'Failed to get next suggestions';
    } finally {
      isLoading = false;
    }
  }

  function handleReset() {
    guesses = [];
    currentGuess = '';
    letterStates = [];
    isSolved = false;
    suggestions = [];
    possibleWords = 0;
    error = null;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (showPromptSuggestions && promptSuggestions.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        activePromptSuggestionIndex =
          activePromptSuggestionIndex < promptSuggestions.length - 1
            ? activePromptSuggestionIndex + 1
            : 0;
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        activePromptSuggestionIndex =
          activePromptSuggestionIndex > 0
            ? activePromptSuggestionIndex - 1
            : promptSuggestions.length - 1;
        return;
      }

      if (event.key === 'Escape') {
        showPromptSuggestions = false;
        activePromptSuggestionIndex = -1;
        return;
      }

      if (event.key === 'Enter' && !currentGuess) {
        const activeSuggestion = promptSuggestions[activePromptSuggestionIndex] ?? promptSuggestions[0];
        if (activeSuggestion) {
          event.preventDefault();
          applyPromptSuggestion(activeSuggestion);
          return;
        }
      }
    }

    if (event.key !== 'Enter') return;
    if (currentGuess && letterStates.length > 0) {
      void submitGuess();
    } else {
      void handleSolve();
    }
  }

  function getStateColor(state: LetterState) {
    switch (state) {
      case 'correct':
        return 'bg-green-500 text-white border-green-500';
      case 'partial':
        return 'bg-yellow-500 text-white border-yellow-500';
      case 'absent':
        return 'bg-slate-500 text-white border-slate-500';
      default:
        return 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600';
    }
  }

  const faqs = [
    {
      question: 'What is Searchle Solver?',
      answer:
        'Searchle Solver helps you find the missing word in the Searchle autocomplete puzzle using entropy-based suggestions.'
    },
    {
      question: 'How do I use the solver?',
      answer:
        'Start typing a Searchle-style prompt to get autocomplete query suggestions, pick one, click Solve, then click a guess word and mark the feedback colors.'
    },
    {
      question: "Does it work with today's Searchle?",
      answer:
        "Yes. Tap Play Daily to load today's prompt and solve it with the same tools."
    },
    {
      question: 'Where does the data come from?',
      answer:
        'The solver uses the copied allsearches dataset, including the real answer, lucky guess, and extra guesses for each prompt.'
    }
  ];

</script>

<svelte:head>
  <title>Searchle Solver - Autocomplete Guess Helper | WordSolverX</title>
  <meta
    name="description"
    content="Solve Searchle fast with entropy-ranked guesses, daily prompts, and feedback tracking. Find the missing autocomplete word in seconds."
  />
  <meta
    name="keywords"
    content="searchle solver, searchle autocomplete, searchle helper, searchle puzzle, daily searchle"
  />
  <meta property="og:title" content="Searchle Solver - Autocomplete Guess Helper" />
  <meta
    property="og:description"
    content="Enter the Searchle prompt and get the best autocomplete guesses ranked by entropy."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolver.tech/searchle-solver" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="https://wordsolver.tech/searchle-solver" />
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
  <main class="max-w-4xl mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
        <span>Daily Searchle Solver</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
        Searchle Solver
      </h1>
      <p class="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
        Enter the partial search prompt and our entropy algorithm finds the autocomplete answer.
      </p>
    </div>

    {#if dailyPuzzle && !useDaily}
      <div class="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg rounded-2xl">
        <div class="p-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium">Today&apos;s Searchle</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">{dailyPuzzle.date}</span>
            </div>
            <p class="text-purple-100 text-sm">"{dailyPuzzle.prompt}"</p>
          </div>
          <button
            type="button"
            onclick={playDaily}
            class="bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg"
          >
            Play Daily
          </button>
        </div>
      </div>
    {/if}

    <div class="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-2xl">
      <div class="p-6">
        <label for="searchle-prompt-input" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Enter the search prompt (with ... for the missing word)
        </label>
        <div class="flex gap-3">
          <div class="relative flex-1">
            <input
              id="searchle-prompt-input"
              type="text"
              bind:this={promptInput}
              bind:value={prompt}
              oninput={handlePromptInput}
              onkeydown={handleKeyDown}
              onfocus={() => void refreshPromptSuggestions(prompt)}
              onblur={() => setTimeout(() => {
                showPromptSuggestions = false;
                activePromptSuggestionIndex = -1;
              }, 120)}
              placeholder="e.g., Why does my cat... or How to make..."
              class="w-full pl-4 pr-4 py-4 text-lg rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
            />
            {#if showPromptSuggestions}
              <div class="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                <div class="border-b border-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-slate-800">
                  Searchle Queries
                </div>
                <div class="max-h-80 overflow-y-auto py-2">
                  {#each promptSuggestions as suggestion, index}
                    <button
                      type="button"
                      onmousedown={(event) => event.preventDefault()}
                      onclick={() => applyPromptSuggestion(suggestion)}
                      class={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${index === activePromptSuggestionIndex ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-200' : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'}`}
                    >
                      <span class="truncate text-sm font-medium">{suggestion}</span>
                      <span class="text-xs uppercase tracking-[0.18em] text-slate-400">Pick</span>
                    </button>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
          <button
            type="button"
            onclick={handleSolve}
            disabled={isLoading || !prompt.trim()}
            class="bg-purple-500 hover:bg-purple-600 text-white px-6 rounded-xl"
          >
            {isLoading || runtimeLoading ? 'Loading' : 'Solve'}
          </button>
        </div>
        {#if possibleWords > 0}
          <div class="mt-3 text-sm text-slate-500">{possibleWords} possible answers</div>
        {/if}
      </div>
    </div>

    {#if error}
      <div class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
        <div class="py-4 text-center text-red-600 dark:text-red-400">{error}</div>
      </div>
    {/if}

    {#if isSolved && guesses.length > 0}
      <div class="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-xl rounded-2xl">
        <div class="py-8 text-center">
          <h2 class="text-xl font-bold mb-2">Solved</h2>
          <p class="font-mono text-4xl uppercase tracking-[0.2em] font-bold mb-2">
            {guesses[guesses.length - 1].word}
          </p>
          <p class="text-green-100 mb-4">
            Completed in {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}
          </p>
          <button
            type="button"
            onclick={handleReset}
            class="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg"
          >
            New Puzzle
          </button>
        </div>
      </div>
    {/if}

    {#if guesses.length > 0 && !isSolved}
      <div class="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div class="py-5 text-center">
          <h3 class="text-sm font-medium text-slate-500 mb-4">Your Guesses</h3>
          <div class="flex flex-wrap justify-center gap-3">
            {#each guesses as guess}
              <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <span class="font-mono font-bold uppercase">{guess.word}</span>
                <span class={guess.isCorrect ? 'text-green-500' : 'text-red-500'}>
                  {guess.isCorrect ? 'OK' : 'X'}
                </span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}

    {#if suggestions.length > 0 && !isSolved}
      <div class="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div class="px-6 pt-5 pb-2">
          <h3 class="text-lg font-semibold">Best Guesses</h3>
          <p class="text-sm text-slate-500 mt-1">
            Ordered so the most likely answers stay on top, followed by the lucky guess and the extra guesses.
          </p>
        </div>
        <div class="px-6 pb-6 grid grid-cols-2 md:grid-cols-5 gap-2">
          {#each suggestions as suggestion, index}
            <button
              type="button"
              onclick={() => selectWord(suggestion.word)}
              disabled={currentGuess === suggestion.word}
              class={`flex flex-col items-center p-3 rounded-xl font-mono text-center transition-all ${currentGuess === suggestion.word ? 'bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-400' : 'bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20'} ${index === 0 ? 'ring-1 ring-green-400' : ''}`}
            >
              <span class="text-lg font-bold uppercase">{suggestion.word}</span>
              <span class="text-xs text-slate-500">{suggestion.score}%</span>
              {#if suggestion.category === 'answer'}
                <span class="mt-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">High Chances</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    {/if}

    {#if currentGuess && letterStates.length > 0 && !isSolved}
      <div class="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div class="py-5">
          <h3 class="text-sm font-medium text-slate-500 mb-3 text-center">
            Click each letter to match Searchle feedback
          </h3>
          <div class="flex justify-center gap-2 mb-4">
            {#each letterStates as state, idx}
              <button
                type="button"
                onclick={() => toggleLetterState(idx)}
                class={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all hover:scale-105 ${getStateColor(state)}`}
              >
                {currentGuess[idx].toUpperCase()}
              </button>
            {/each}
          </div>
          <div class="flex justify-center gap-3">
            <button type="button" onclick={() => { currentGuess = ''; letterStates = []; }} class="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg">
              Cancel
            </button>
            <button
              type="button"
              onclick={submitGuess}
              disabled={letterStates.every((s) => s === 'unknown')}
              class="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
            >
              Submit Guess
            </button>
          </div>
        </div>
      </div>
    {/if}

    <div class="grid md:grid-cols-2 gap-4">
      <a href="/searchle-answer-today" class="block">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 transition-colors rounded-2xl p-4 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">Ans</div>
          <div>
            <h3 class="font-semibold text-slate-900 dark:text-white">Daily Answers</h3>
            <p class="text-sm text-slate-500">View today&apos;s and past answers</p>
          </div>
          <span class="ml-auto text-slate-400">&gt;</span>
        </div>
      </a>
    </div>
  </main>

  <FAQSection {faqs} />
</div>
