<script lang="ts">
  import { onMount } from 'svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import type { SearchleDailyPuzzle } from '$lib/searchle/daily';
  import {
    type SearchleFeedback,
    type SearchleGuess,
    type SearchleSuggestion
  } from '$lib/searchle/searchleSolver';

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

  const faqs = [
    {
      question: 'What is Searchle?',
      answer: 'Searchle is a daily puzzle game based on Google autocomplete suggestions. You see a partial search query with a blank and must guess the most common autocomplete word. Feedback shows green, yellow, or gray for each letter — same mechanic as Wordle, but the answers come from real Google search data.'
    },
    {
      question: 'How does the Searchle solver work?',
      answer: 'Type the partial search prompt (use ... for the blank), hit Solve, and the solver returns entropy-ranked autocomplete candidates. Pick a word, mark each letter green/yellow/gray to match the game feedback, and submit. The solver re-filters after each guess, shrinking the candidate pool until you find the answer.'
    },
    {
      question: 'Does the solver use the same autocomplete data as Searchle?',
      answer: 'The solver uses the same kind of Google autocomplete data that Searchle pulls from. Its word pool covers common search completions, so the suggestions line up with what the game treats as valid answers.'
    },
    {
      question: 'Can I use the solver for the daily Searchle puzzle?',
      answer: 'Yes. Click "Play Daily" to load today\'s prompt automatically. Then enter your guesses and feedback just like you would for any other prompt. The solver handles daily puzzles the same way it handles custom prompts.'
    },
    {
      question: 'What do green, yellow, and gray mean in Searchle?',
      answer: 'Green means the letter is correct and in the right position. Yellow (partial) means the letter appears in the answer but in a different position. Gray (absent) means the letter is not in the answer at all. Click each letter tile to cycle through these states.'
    },
    {
      question: 'How many guesses does it usually take to solve Searchle?',
      answer: 'Most players solve Searchle in 2-4 guesses when using the solver. The entropy-ranked first suggestion often gets close to the answer, and the feedback filter narrows it down quickly. Without a solver, players typically need 4-6 guesses.'
    }
  ];

  const solverLinks = [
    { href: '/wordle-solver', label: 'Wordle Solver' },
    { href: '/nerdle-solver', label: 'Nerdle Solver' },
    { href: '/quordle-solver', label: 'Quordle Solver' },
    { href: '/searchle-answer-today', label: 'Searchle Answer Today' },
    { href: '/spotle-solver', label: 'Spotle Solver' },
    { href: '/contexto-solver', label: 'Contexto Solver' }
  ];

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
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Searchle Solver',
        description: 'Solve Searchle with entropy-ranked autocomplete guesses and feedback tracking.',
        url: 'https://wordsolver.tech/searchle-solver'
      },
      {
        '@type': 'WebApplication',
        name: 'Searchle Solver',
        applicationCategory: 'GameApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer }
        }))
      },
      {
        '@type': 'HowTo',
        name: 'How to use the Searchle solver',
        step: [
          { '@type': 'HowToStep', name: 'Enter the search prompt', text: 'Type the partial Google search query from your Searchle game, using ... for the missing word.', position: 1 },
          { '@type': 'HowToStep', name: 'Pick a suggested word', text: 'Click one of the entropy-ranked guesses, then set the letter feedback colors to match what Searchle showed you.', position: 2 },
          { '@type': 'HowToStep', name: 'Submit and repeat', text: 'Click Submit Guess, then repeat with the updated suggestions until the answer is found.', position: 3 }
        ]
      }
    ]
  })}</script>`}
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

    <section class="mt-12 space-y-10">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">What is Searchle?</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Searchle is a daily puzzle game that turns Google autocomplete into a guessing challenge. You see a partial search query with a missing word — something like "Why does my cat..." — and you need to figure out what word fills that blank. The answer is always one of the most common Google autocomplete completions for that query.
        </p>
        <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          The game drops a new puzzle every day. Some prompts are easy — "How to make..." probably leads to "pancakes" or "money." Others are surprisingly hard. When the prompt is "Why do people..." and the answer is "yawn," you realize how weird search behavior actually is.
        </p>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
          What makes Searchle different from most word games is that you are not guessing from a dictionary. You are guessing from what millions of people actually type into Google. That makes the answers feel more human and more unpredictable than a standard word puzzle.
        </p>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">How Searchle Feedback Works</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          After each guess, Searchle gives you letter-by-letter feedback — same idea as Wordle. Each character in your guess gets one of three colors: green, yellow, or gray.
        </p>
        <div class="space-y-4 mb-4">
          <div class="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-5">
            <h3 class="text-lg font-bold text-green-900 dark:text-green-300 mb-2">Green — Correct letter, correct spot</h3>
            <p class="text-green-800 dark:text-green-200">The letter is in the answer and in the right position. If you guess "stare" and the "s" turns green, the answer starts with "s." Lock it in and work from there.</p>
          </div>
          <div class="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-5">
            <h3 class="text-lg font-bold text-yellow-900 dark:text-yellow-300 mb-2">Yellow — Right letter, wrong spot</h3>
            <p class="text-yellow-800 dark:text-yellow-200">The letter appears somewhere in the answer but not where you placed it. If your "a" in position 2 turns yellow, the answer contains "a" somewhere else. Keep it in play for other positions.</p>
          </div>
          <div class="rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5">
            <h3 class="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Gray — Letter not in the answer</h3>
            <p class="text-slate-600 dark:text-slate-400">The letter does not appear in the answer at all. Eliminate it from future guesses. Every gray letter shrinks the search space and makes your next guess sharper.</p>
          </div>
        </div>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
          The feedback is positional, not just about whether a letter exists. Two yellows in different positions tell you the letter appears twice. A green in position 1 and a yellow in position 4 means the same letter appears at least twice — once at the start and once somewhere around position 4.
        </p>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Why Use a Searchle Solver</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Searchle feels easy until it does not. The autocomplete angle makes answers slippery — you know the word is common, but which common word? A solver takes the guesswork out of those moments.
        </p>
        <div class="space-y-4 mb-4">
          <div class="rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-5">
            <h3 class="text-lg font-bold text-purple-900 dark:text-purple-300 mb-2">Autocomplete has a long tail</h3>
            <p class="text-purple-800 dark:text-purple-200">A prompt like "Why does my..." has dozens of plausible completions. Dog, cat, car, phone, eye, back — they all work. The solver ranks them by how often they actually appear in search data, so you start with the most likely answer instead of guessing randomly.</p>
          </div>
          <div class="rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-5">
            <h3 class="text-lg font-bold text-purple-900 dark:text-purple-300 mb-2">Feedback filtering is error-prone by hand</h3>
            <p class="text-purple-800 dark:text-purple-200">When you have green and yellow letters spread across multiple guesses, mentally tracking which letters are still viable gets difficult. The solver eliminates impossible words after each guess instantly, so you never accidentally reuse a gray letter.</p>
          </div>
          <div class="rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-5">
            <h3 class="text-lg font-bold text-purple-900 dark:text-purple-300 mb-2">Entropy ranking picks smarter guesses</h3>
            <p class="text-purple-800 dark:text-purple-200">The top suggestion is not just the most likely answer — it is the guess that maximizes information gain. Sometimes a slightly less likely word splits the remaining candidates better, and the solver catches that. Humans rarely think about information entropy when picking guesses.</p>
          </div>
          <div class="rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-5">
            <h3 class="text-lg font-bold text-purple-900 dark:text-purple-300 mb-2">Keep your streak alive</h3>
            <p class="text-purple-800 dark:text-purple-200">If you are on a 30-day streak and staring at a blank prompt with no ideas, the solver gives you a concrete starting point instead of a blank-page panic. One good opener often cascades into a full solve within 2-3 guesses.</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">How Our Searchle Solver Works</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          The solver loads a database of common Google autocomplete completions indexed by prompt pattern. When you enter a prompt like "Why does my cat...", it finds every completion that matches and ranks them by search frequency.
        </p>
        <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          The ranking uses entropy scoring. Instead of just sorting by raw popularity, the solver calculates how much information each guess reveals. A guess that splits the remaining candidates into roughly equal groups scores high on entropy — because no matter what feedback you get, you eliminate a large chunk of possibilities. A guess that produces lopsided feedback patterns scores lower, even if it happens to be the answer.
        </p>
        <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          After you submit a guess and mark the feedback, the solver re-filters. Any completion that contradicts your feedback — wrong letters in green positions, missing letters marked yellow — gets removed. The solver then re-ranks the survivors and presents a fresh list. Each round narrows the pool until only a handful of candidates remain.
        </p>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
          The prompt autocomplete dropdown also helps. As you type, the solver suggests matching queries from its database. Pick the right prompt before solving, and you avoid typos that would throw off the entire result set.
        </p>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Tips for Getting Better at Searchle</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          The solver does the heavy lifting, but a few mental habits make you faster even without it.
        </p>
        <div class="space-y-4 mb-4">
          <div class="rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 p-5">
            <h3 class="text-lg font-bold text-teal-900 dark:text-teal-300 mb-2">Think like a searcher, not a writer</h3>
            <p class="text-teal-800 dark:text-teal-200">People type lazy, weird things into Google. "Why does my cat stare at me" is way more common than "Why does my cat observe me." When you brainstorm answers, go for the most colloquial, everyday phrasing. Formal language rarely wins in autocomplete.</p>
          </div>
          <div class="rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 p-5">
            <h3 class="text-lg font-bold text-teal-900 dark:text-teal-300 mb-2">Pay attention to the prompt structure</h3>
            <p class="text-teal-800 dark:text-teal-200">If the prompt ends with a preposition — "How to get rid of..." — the answer is usually a concrete noun (ants, acne, mice). If it starts with "Why does..." the answer tends to be a verb (rain, hurt, bark). The grammar of the prompt heavily constrains what words fit naturally.</p>
          </div>
          <div class="rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 p-5">
            <h3 class="text-lg font-bold text-teal-900 dark:text-teal-300 mb-2">Start with the most common completion</h3>
            <p class="text-teal-800 dark:text-teal-200">The solver puts the highest-probability answer first for a reason. Even if it is wrong, the feedback from a common word eliminates more candidates than feedback from a niche word. Your first guess should test the most popular letters and patterns, not try to be clever.</p>
          </div>
          <div class="rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 p-5">
            <h3 class="text-lg font-bold text-teal-900 dark:text-teal-300 mb-2">Use partial feedback aggressively</h3>
            <p class="text-teal-800 dark:text-teal-200">A yellow letter tells you the answer contains that character somewhere else. Do not just avoid the position it was in — actively try placing it in other spots. Yellow letters are free information, and the solver uses them to cut the candidate list dramatically.</p>
          </div>
          <div class="rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 p-5">
            <h3 class="text-lg font-bold text-teal-900 dark:text-teal-300 mb-2">Learn from the solver</h3>
            <p class="text-teal-800 dark:text-teal-200">After each game, compare your instinctive guesses to what the solver suggested. You will start noticing patterns — like how "how to" prompts almost always lead to practical verbs, while "why do" prompts lead to observational ones. Build that intuition and you will need the solver less over time.</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Common Searchle Categories</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Searchle prompts fall into a handful of categories. Knowing which one you are dealing with makes the answer easier to predict.
        </p>
        <div class="space-y-4 mb-4">
          <div class="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-5">
            <h3 class="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">"Why does my..." prompts</h3>
            <p class="text-amber-800 dark:text-amber-200">These ask about common problems or odd behaviors. The answer is almost always a verb or a body part. "Why does my dog eat grass" and "Why does my back hurt" are classic examples. Think about what people complain about most often.</p>
          </div>
          <div class="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-5">
            <h3 class="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">"How to make..." prompts</h3>
            <p class="text-amber-800 dark:text-amber-200">Practical, how-to queries dominate this category. Food is common — pancakes, slime, bread — but you also see non-food items like money, friends, or a resume. The answer is typically a single concrete noun that people want to create.</p>
          </div>
          <div class="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-5">
            <h3 class="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">"How to get rid of..." prompts</h3>
            <p class="text-amber-800 dark:text-amber-200">People search for pest removal, skin fixes, and household problems. Ants, acne, mice, roaches, smells — these are the usual suspects. The answer is always something undesirable that people want gone.</p>
          </div>
          <div class="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-5">
            <h3 class="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">"What is..." prompts</h3>
            <p class="text-amber-800 dark:text-amber-200">Definition-seeking queries. The answer is usually a trending term, a financial concept, or a health condition. "What is inflation," "What is a palindrome," "What is gluten." These favor nouns that people hear about but cannot clearly define.</p>
          </div>
          <div class="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-5">
            <h3 class="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">"Is it bad to..." prompts</h3>
            <p class="text-amber-800 dark:text-amber-200">Health and habit anxiety drives these. "Is it bad to crack your knuckles," "Is it bad to sleep with socks on." The answer is an everyday action people feel guilty or uncertain about. Think small habits, not major life decisions.</p>
          </div>
        </div>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
          Once you recognize the category, you can predict the type of word that fills the blank. Combine that with the solver's frequency ranking and you have a serious advantage over pure guessing.
        </p>
      </div>
    </section>

    <div class="mt-12">
      <FAQSection title="Searchle Solver FAQ" {faqs} class="py-0" />
    </div>

    <div class="mt-8 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-6">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Explore More Solvers</h2>
      <div class="flex flex-wrap justify-center gap-3">
        {#each solverLinks as link}
          <a href={link.href} class="px-5 py-2.5 bg-white dark:bg-slate-800 rounded-xl font-semibold text-sm text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700 hover:border-purple-400 transition-colors">
            {link.label}
          </a>
        {/each}
      </div>
    </div>
  </main>
</div>
