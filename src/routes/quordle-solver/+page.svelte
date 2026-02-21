<script lang="ts">
  import { onMount } from 'svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import { QUORDLE_WORDS_BASE64 } from '$lib/data/quordle-words-encoded';
  import { solveQuordle, type Guess } from '$lib/quordle-logic';

  type TileState = 'I' | 'M' | 'C'; // Incorrect (Gray), Misplaced (Yellow), Correct (Green)

  // Game State
  let guesses = $state<string[]>([]);
  let results = $state<TileState[][][]>([[], [], [], []]);

  // Solver State
  let allWords = $state<string[]>([]);
  let restWords = $state<string[]>([]);
  let suggestion = $state('Loading...');
  let loading = $state(true);
  let processing = $state(false);
  let error = $state<string | null>(null);

  // Input State
  let inputValue = $state('');

  let suggestionBoxRef: HTMLDivElement | undefined = $state();

  let hasGuesses = $derived(guesses.length > 0);

  onMount(async () => {
    loading = true;
    try {
      const decoded = atob(QUORDLE_WORDS_BASE64);
      const data = JSON.parse(decoded);
      if (data && Array.isArray(data.master) && Array.isArray(data.rest)) {
        allWords = data.master;
        restWords = data.rest;
        const result = solveQuordle([], data.master, data.rest);
        suggestion = result.bestGuess || 'SALET';
      } else {
        throw new Error('Word list format is invalid.');
      }
    } catch (e: any) {
      error = `Failed to load word list: ${e.message}`;
      suggestion = 'ERROR';
    } finally {
      loading = false;
    }
  });

  function handleInputChange(e: Event) {
    const val = (e.target as HTMLInputElement).value.toUpperCase().replace(/[^A-Z]/g, '');
    if (val.length <= 5) inputValue = val;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') handleSubmitGuess();
  }

  function handleSubmitGuess() {
    if (inputValue.length !== 5) {
      alert('Please enter a 5-letter word.');
      return;
    }

    guesses = [...guesses, inputValue];

    const defaultRow: TileState[] = Array(5).fill('I');
    results = [
      [...results[0], [...defaultRow]],
      [...results[1], [...defaultRow]],
      [...results[2], [...defaultRow]],
      [...results[3], [...defaultRow]],
    ];

    inputValue = '';
  }

  function isBoardSolved(boardIndex: number): boolean {
    return results[boardIndex].some((row) => row.every((tile) => tile === 'C'));
  }

  function getSolvedIndex(boardIndex: number): number {
    return results[boardIndex].findIndex((row) => row.every((tile) => tile === 'C'));
  }

  function toggleTile(boardIndex: number, rowIndex: number, tileIndex: number) {
    if (isBoardSolved(boardIndex)) return;

    const newResults = [...results];
    const newBoard = [...newResults[boardIndex]];
    const newRow = [...newBoard[rowIndex]];

    const current = newRow[tileIndex];
    let next: TileState = 'I';
    if (current === 'I') next = 'C';
    else if (current === 'C') next = 'M';
    else next = 'I';

    newRow[tileIndex] = next;
    newBoard[rowIndex] = newRow;
    newResults[boardIndex] = newBoard;
    results = newResults;
  }

  function calculateNextSuggestion() {
    processing = true;
    setTimeout(() => {
      try {
        const solverGuesses: Guess[] = guesses.map((word, curIdx) => {
          const feedbackArray: [string, string, string, string] = ['', '', '', ''];
          for (let b = 0; b < 4; b++) {
            const rowStates = results[b][curIdx];
            const feedbackString = rowStates
              .map((s) => {
                if (s === 'C') return 'g';
                if (s === 'M') return 'y';
                return 'x';
              })
              .join('');
            feedbackArray[b] = feedbackString;
          }
          return { word, feedback: feedbackArray };
        });

        const result = solveQuordle(solverGuesses, allWords, restWords);
        suggestion = result.bestGuess;
      } catch (err) {
        console.error(err);
        suggestion = 'ERROR';
      } finally {
        processing = false;
      }
    }, 50);
  }

  function handleMobileGetBestWord() {
    if (suggestionBoxRef) {
      suggestionBoxRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    calculateNextSuggestion();
  }

  function getTileClass(state: TileState): string {
    if (state === 'C') return 'bg-green-600 border-green-700 text-white';
    if (state === 'M') return 'bg-yellow-400 border-yellow-500 text-white';
    return 'bg-gray-200 border-gray-300 text-gray-700';
  }

  function getVisibleGuesses(boardIdx: number): string[] {
    const solved = isBoardSolved(boardIdx);
    const solvedIndex = getSolvedIndex(boardIdx);
    if (solved && solvedIndex !== -1) return guesses.slice(0, solvedIndex + 1);
    return guesses;
  }

  const faqs = [
    { question: 'What is the Quordle Solver?', answer: 'The Quordle Solver is a highly efficient tool designed to help you solve the daily Quordle puzzle. It predicts the best possible words to play based on the feedback from your previous guesses across all four boards simultaneously.' },
    { question: 'How do I use the Quordle Solver?', answer: 'Start by entering your first guess in the solver just as you would in the game. Then, tap the tiles on the screen to match the colors (Green, Yellow, Gray) shown in your Quordle game. Click "Get Best Word" to receive the statistically best next move.' },
    { question: 'Can it solve all four Quordle words?', answer: 'Yes! Our solver analyzes all four hidden words at once. It prioritizes guesses that give the most information across all remaining unsolved boards to ensure you solve the entire puzzle within the 9 allowed attempts.' },
    { question: 'Is this solver free to use?', answer: 'Absolutely. This Quordle Solver is 100% free and does not require any registration or download. It runs directly in your browser.' },
    { question: 'What is the best starting word for Quordle?', answer: 'Based on information theory and letter frequency analysis, "SALET" is often recommended as one of the best starting words. Our solver defaults to this suggestion to give you a strong head start.' },
  ];

  const jsonLdSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        name: 'Quordle Solver',
        description: 'Professional tool to solve 4 Wordle puzzles simultaneously (Quordle).',
        url: 'https://wordsolverx.com/quordle-solver',
        areaServed: 'Worldwide',
        serviceType: 'Puzzle Solving Service',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  });
</script>

<svelte:head>
  <title>Quordle Solver Today - Solve All 4 Words | WordSolverX</title>
  <meta name="description" content="Solve today's Quordle instantly with our free solver. Enter guesses, match tile colors across all 4 boards, and get the best next word." />
  <meta name="keywords" content="Quordle Solver, Quordle Answer, Quordle Help, Quordle Hints, 4 Word Puzzle Solver" />
  <link rel="canonical" href="https://wordsolverx.com/quordle-solver" />
  <meta property="og:title" content="Quordle Solver - Solve All 4 Words" />
  <meta property="og:description" content="Get optimal word suggestions for Quordle across all 4 boards." />
  <meta property="og:url" content="https://wordsolverx.com/quordle-solver" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Quordle Solver" />
  <meta name="twitter:description" content="Solve today's Quordle puzzle with our free solver." />
  {@html `<script type="application/ld+json">${jsonLdSchema}</script>`}
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 font-sans text-gray-900">
  <!-- Header -->
  <section class="bg-gradient-to-r from-green-600 to-emerald-600 py-12 shadow-md">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <Breadcrumbs />
      <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
        Quordle Solver
      </h1>
      <p class="mt-4 text-green-50 text-lg font-medium">
        High-Performance Manual Assistant
      </p>
    </div>
  </section>

  <!-- Guide -->
  <section class="max-w-5xl mx-auto px-4 py-8">
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 class="text-xl font-bold text-gray-900 mb-4 text-center">
        How to Use the Solver
      </h2>
      <div class="flex flex-col sm:flex-row gap-6 text-gray-700 justify-center">
        <div class="flex items-center sm:flex-col gap-3 text-left sm:text-center">
          <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm">1</div>
          <div>
            <h3 class="font-bold text-sm text-green-700">Enter & Add</h3>
            <p class="text-xs text-gray-500">Type guess & click Add</p>
          </div>
        </div>
        <div class="hidden sm:block w-px bg-gray-100"></div>
        <div class="flex items-center sm:flex-col gap-3 text-left sm:text-center">
          <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm">2</div>
          <div>
            <h3 class="font-bold text-sm text-green-700">Match Colors</h3>
            <p class="text-xs text-gray-500">Tap: Green, Tap x2: Yellow</p>
          </div>
        </div>
        <div class="hidden sm:block w-px bg-gray-100"></div>
        <div class="flex items-center sm:flex-col gap-3 text-left sm:text-center">
          <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm">3</div>
          <div>
            <h3 class="font-bold text-sm text-green-700">Get Answer</h3>
            <p class="text-xs text-gray-500">Click "Get Best Word"</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="max-w-7xl mx-auto px-4 pb-12 flex flex-col items-center gap-8">
    <!-- Main Content Grid -->
    <main class="w-full flex flex-col lg:flex-row gap-8 items-start justify-center">

      <!-- Left/Middle Column: Boards -->
      <div class="flex-1 w-full order-2 lg:order-1 {!hasGuesses ? 'hidden lg:block' : ''}">
        {#if hasGuesses}
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center mb-6">
            <p class="text-yellow-800 font-bold text-sm">
              👇 Tap the tiles below to match your game colors!
            </p>
          </div>
        {/if}

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {#each [0, 1, 2, 3] as boardIdx}
            {@const solved = isBoardSolved(boardIdx)}
            {@const visibleGuesses = getVisibleGuesses(boardIdx)}
            <div class="bg-white rounded-xl p-4 shadow-lg border relative {solved ? 'border-green-400 ring-2 ring-green-100' : 'border-gray-100'}">
              {#if solved}
                <div class="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  SOLVED
                </div>
              {/if}
              <div class="text-center font-bold text-green-700 mb-3 uppercase text-sm tracking-wider">
                Board {boardIdx + 1}
              </div>
              <div class="flex flex-col gap-2 min-h-[50px]">
                {#each visibleGuesses as word, rowIdx}
                  <div class="flex gap-2 justify-center">
                    {#each word.split('') as char, tileIdx}
                      <button
                        onclick={() => toggleTile(boardIdx, rowIdx, tileIdx)}
                        class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-bold text-lg border-2 rounded cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 {getTileClass(results[boardIdx][rowIdx][tileIdx])}"
                      >
                        {char}
                      </button>
                    {/each}
                  </div>
                {/each}
                {#if guesses.length === 0}
                  <div class="text-center text-gray-400 text-sm italic py-8">
                    No guesses yet
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>

        <!-- Mobile Button: Get Best Word -->
        <div class="block lg:hidden mt-8">
          <button
            onclick={handleMobileGetBestWord}
            disabled={guesses.length === 0 || processing}
            class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {processing ? 'CALCULATING...' : 'GET BEST WORD'}
          </button>
          <div class="mt-4 flex justify-between gap-1 text-[10px] text-gray-500">
            <span>Gray: Incorrect</span>
            <span>Yellow: Misplaced</span>
            <span>Green: Correct</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Controls -->
      <div class="w-full lg:w-96 flex flex-col gap-6 order-1 lg:order-2 lg:sticky lg:top-6">
        <!-- Suggestion Box -->
        <div
          bind:this={suggestionBoxRef}
          class="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 text-center relative overflow-hidden scroll-mt-24"
        >
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Best Suggestion</p>
          <div class="text-5xl font-black text-gray-800 tracking-wider">
            {loading ? '...' : suggestion}
          </div>
        </div>

        <!-- Input Area -->
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 flex flex-col gap-4">
          <div class="flex gap-2">
            <input
              type="text"
              value={inputValue}
              oninput={handleInputChange}
              onkeydown={handleKeyDown}
              placeholder="TYPE GUESS"
              class="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-center font-bold text-xl tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-800 placeholder-gray-400"
              maxlength={5}
            />
          </div>

          <button
            onclick={handleSubmitGuess}
            disabled={inputValue.length !== 5}
            class="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm shadow-md"
          >
            Add to Boards
          </button>

          <!-- Desktop Button: Get Best Word -->
          <div class="hidden lg:block relative">
            <div class="h-px bg-gray-200 my-2"></div>
            <button
              onclick={calculateNextSuggestion}
              disabled={guesses.length === 0 || processing}
              class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {processing ? 'CALCULATING...' : 'GET BEST WORD'}
            </button>
          </div>
        </div>

        <div class="hidden lg:block bg-white/80 rounded-lg p-4 text-sm text-gray-600 border border-gray-200/50">
          <div class="flex justify-between gap-2 text-xs font-semibold">
            <div class="flex items-center gap-1.5">
              <div class="w-3 h-3 bg-gray-200 border border-gray-300 rounded"></div>
              <span>Gray</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-3 h-3 bg-yellow-400 border border-yellow-500 rounded"></div>
              <span>Yellow</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-3 h-3 bg-green-600 border border-green-700 rounded"></div>
              <span>Green</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- FAQs -->
    <section class="w-full max-w-4xl py-12">
      <FAQSection {faqs} />
    </section>
  </div>
</div>
