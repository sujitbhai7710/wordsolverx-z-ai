<script lang="ts">
  import { onMount } from 'svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';

  interface CellConstraint {
    index: number;
    letter: string;
    status: 'green' | 'yellow' | 'none' | 'grey';
  }

  let wasmReady = $state(false);
  let solveFunc = $state<any>(null);
  let board = $state<string[]>(Array(21).fill(''));
  let statuses = $state<('green' | 'yellow' | 'none')[]>(Array(21).fill('none'));
  let solutions = $state<string[][]>([]);
  let loading = $state(false);
  let solving = $state(false);
  let selectedDate = $state('');
  let solutionsRef: HTMLDivElement | undefined = $state();
  let toastMessage = $state('');
  let toastType = $state<'success' | 'error'>('success');
  let toastVisible = $state(false);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    toastMessage = message;
    toastType = type;
    toastVisible = true;
    setTimeout(() => (toastVisible = false), 3000);
  }

  onMount(async () => {
    selectedDate = new Date().toISOString().split('T')[0];
    try {
      const wasm = await import('$lib/waffle-wasm/waffle_wasm');
      await wasm.default();
      solveFunc = wasm.solve_waffle_wasm;
      wasmReady = true;
    } catch (err) {
      console.error('WASM Init Error:', err);
      showToast('Failed to load Waffle engine.', 'error');
    }
  });

  function getGlobalIdx(r: number, c: number): number {
    if (r === 0) return c;
    if (r === 1) return 5 + c / 2;
    if (r === 2) return 8 + c;
    if (r === 3) return 13 + c / 2;
    if (r === 4) return 16 + c;
    return 0;
  }

  function handleCellChange(pIdx: number, val: string) {
    board[pIdx] = val.toUpperCase().slice(-1);
    solutions = [];
  }

  function toggleStatus(pIdx: number) {
    if (solutions.length > 0) return;
    const current = statuses[pIdx];
    if (current === 'none') statuses[pIdx] = 'yellow';
    else if (current === 'yellow') statuses[pIdx] = 'green';
    else statuses[pIdx] = 'none';
    solutions = [];
  }

  function clearGrid() {
    board = Array(21).fill('');
    statuses = Array(21).fill('none');
    solutions = [];
    showToast('Grid cleared');
  }

  function calculateStartingColors(puzzle: string, solution: string): ('green' | 'yellow' | 'none')[] {
    const res: ('green' | 'yellow' | 'none')[] = Array(21).fill('none');
    const across = [[0, 1, 2, 3, 4], [8, 9, 10, 11, 12], [16, 17, 18, 19, 20]];
    const down = [[0, 5, 8, 13, 16], [2, 6, 10, 14, 18], [4, 7, 12, 15, 20]];

    [...across, ...down].forEach((indices) => {
      const target = indices.map((i) => solution[i]);
      const current = indices.map((i) => puzzle[i]);
      const wordColors: string[] = Array(5).fill('none');
      const available = [...target];

      current.forEach((char, i) => {
        if (char === target[i]) {
          wordColors[i] = 'green';
          available[i] = '';
        }
      });

      current.forEach((char, i) => {
        if (wordColors[i] === 'none') {
          const idx = available.indexOf(char);
          if (idx !== -1) {
            wordColors[i] = 'yellow';
            available[idx] = '';
          }
        }
      });

      indices.forEach((idx, i) => {
        if (wordColors[i] === 'green') res[idx] = 'green';
        else if (wordColors[i] === 'yellow' && res[idx] !== 'green') res[idx] = 'yellow';
      });
    });
    return res;
  }

  async function fetchAndFill(url: string) {
    loading = true;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      const puzzle = data.puzzle as string;
      const solution = data.solution as string;
      const colors = calculateStartingColors(puzzle, solution);
      board = puzzle.split('');
      statuses = colors;
      solutions = [];
      showToast('Puzzle loaded successfully');
    } catch (err) {
      showToast('Failed to load puzzle.', 'error');
    } finally {
      loading = false;
    }
  }

  async function solve() {
    if (!wasmReady || !solveFunc) return;
    const anyEmpty = board.some((c) => !c);
    if (anyEmpty) {
      showToast('Please fill all letters first!', 'error');
      return;
    }

    solving = true;
    await new Promise((r) => setTimeout(r, 100));

    try {
      const puzzleStr = board.join('').toLowerCase();
      const constraints: CellConstraint[] = statuses.map((s, i) => ({
        index: i,
        letter: board[i],
        status: s,
      }));

      const result = solveFunc(puzzleStr, JSON.stringify(constraints));

      if (result === 'NOT_FOUND') {
        showToast('No solution found.', 'error');
      } else {
        const found = JSON.parse(result);
        solutions = found;
        showToast(`Found ${found.length} valid arrangement(s)`);
        setTimeout(() => {
          solutionsRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred during solving.', 'error');
    } finally {
      solving = false;
    }
  }

  function getCellStatusClass(status: string, isInteractive: boolean): string {
    if (!isInteractive) return 'bg-green-500 text-white border-green-600 shadow-sm';
    if (status === 'green') return 'bg-green-500 text-white border-green-600 shadow-lg shadow-green-500/30';
    if (status === 'yellow') return 'bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-500/30';
    return 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:border-amber-400 dark:hover:border-amber-600';
  }

  const faqs = [
    { question: 'How does the Waffle Solver work?', answer: 'Our solver uses a smart algorithm to test thousands of letter combinations against the dictionary to find the only solution that fits the grid constraints (green and yellow letters) in the fewest moves.' },
    { question: 'Can I solve past Waffles?', answer: "Yes! Use the date picker next to the 'Auto Fill Today' button to load and solve Waffle puzzles from previous days." },
    { question: 'Is it free to use?', answer: 'Absolutely. This Waffle Solver is 100% free and open for everyone to use daily.' },
    { question: 'What do the colors mean?', answer: 'Green means the letter is in the correct spot. Yellow means the letter is in the word (row or column) but in the wrong spot. Gray/White means the letter is not in that specific word.' },
  ];

  const jsonLdSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        name: 'Waffle Solver',
        description: 'High-performance solver for the daily Waffle word puzzle.',
        url: 'https://wordsolver.tech/waffle-solver',
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

  const solverLinks = [
    { href: '/5-letter-wordle-solver', label: '5-Letter Wordle Solver' },
    { href: '/quordle-solver', label: 'Quordle Solver' },
    { href: '/phoodle-answer-today', label: 'Phoodle Answer Today' },
    { href: '/waffle-answer-today', label: 'Waffle Answer Today' },
  ];
</script>

<svelte:head>
  <title>Waffle Solver - Solve Any Waffle Puzzle Instantly | WordSolverX</title>
  <meta name="description" content="Solve today's Waffle puzzle with our high-performance WASM-powered solver. Auto-fill or manually enter your grid and get instant solutions." />
  <meta name="keywords" content="Waffle Solver, Waffle Answer, Waffle Puzzle, Waffle Game Helper, Waffle Cheat" />
  <link rel="canonical" href="https://wordsolver.tech/waffle-solver" />
  <meta property="og:title" content="Waffle Solver - Instant Puzzle Solutions" />
  <meta property="og:description" content="Solve any Waffle puzzle instantly with our Rust-powered engine." />
  <meta property="og:url" content="https://wordsolver.tech/waffle-solver" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Waffle Solver" />
  <meta name="twitter:description" content="Solve today's Waffle puzzle instantly." />
  {@html `<script type="application/ld+json">${jsonLdSchema}</script>`}
</svelte:head>

<!-- Toast Notification -->
{#if toastVisible}
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-sm transition-all {toastType === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}">
    {toastMessage}
  </div>
{/if}

<div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6">
  <div class="max-w-4xl mx-auto space-y-12">
    <Breadcrumbs />

    <!-- Header Section -->
    <div class="text-center space-y-6">
      <div class="flex justify-center mb-6">
        <img
          src="/waffle-solver.webp"
          alt="Waffle Solver Featured"
          width="150"
          height="150"
          class="rounded-3xl shadow-lg"
        />
      </div>
      <h1 class="text-6xl font-black text-gray-900 dark:text-white tracking-tight sm:text-7xl">
        Waffle <span class="text-amber-600">Solver</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
        The world's fastest Waffle helper. Solve any grid in milliseconds using our high-performance Rust engine.
      </p>
    </div>

    <!-- Main Content Card -->
    <div class="bg-white dark:bg-gray-900 rounded-[48px] shadow-2xl p-6 sm:p-14 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
      <div class="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
        <svg class="w-64 h-64 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" /></svg>
      </div>

      <!-- Input Grid Area -->
      <div class="flex flex-col items-center gap-6 relative z-10 w-full px-2">
        <div class="flex flex-col items-center gap-3">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Input Pattern</span>
          <div class="inline-block p-4 sm:p-6 rounded-[24px] shadow-sm border-2 sm:border-4 ring-1 bg-gray-50 dark:bg-gray-950 border-white dark:border-gray-900 ring-gray-200 dark:ring-gray-800">
            <div class="grid grid-cols-5 gap-1.5 sm:gap-2">
              {#each Array(5) as _, r}
                {#each Array(5) as _, c}
                  {@const pIdx = getGlobalIdx(r, c)}
                  {@const isEmpty = (r === 1 || r === 3) && (c === 1 || c === 3)}
                  {#if isEmpty}
                    <div class="w-10 h-10 sm:w-12 sm:h-12"></div>
                  {:else}
                    <div class="relative group">
                      <input
                        type="text"
                        value={board[pIdx] ? board[pIdx].toUpperCase() : ''}
                        maxlength={1}
                        oninput={(e) => handleCellChange(pIdx, (e.target as HTMLInputElement).value)}
                        onclick={() => toggleStatus(pIdx)}
                        class="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl sm:text-3xl font-black rounded-lg sm:rounded-xl transition-all duration-300 focus:outline-none cursor-pointer focus:ring-2 sm:focus:ring-8 focus:ring-amber-500/20 active:scale-90 uppercase {getCellStatusClass(statuses[pIdx], true)}"
                      />
                    </div>
                  {/if}
                {/each}
              {/each}
            </div>
          </div>
        </div>
      </div>

      <!-- Top Controls -->
      <div class="flex flex-col items-center gap-6 relative z-10 pt-8 border-t border-gray-100 dark:border-gray-800 w-full max-w-2xl mx-auto">
        <p class="text-center text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
          Load Puzzle Data
        </p>

        <div class="flex flex-wrap items-center justify-center gap-3 w-full">
          <button
            onclick={() => fetchAndFill('https://api.wafflegame.workers.dev/today')}
            disabled={loading}
            class="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md shadow-amber-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            {loading ? 'Fetching...' : 'Auto Fill Today'} {!loading ? '🚀' : ''}
          </button>

          <div class="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/50 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
            <input
              type="date"
              value={selectedDate}
              oninput={(e) => (selectedDate = (e.target as HTMLInputElement).value)}
              class="bg-transparent border-none rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-0 w-32 dark:text-gray-200"
            />
            <button
              onclick={() => fetchAndFill(`https://api.wafflegame.workers.dev/date/${selectedDate}`)}
              disabled={loading || !selectedDate}
              class="px-4 py-1.5 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg font-bold text-xs shadow-sm transition-all active:scale-95 border border-gray-100 dark:border-gray-600"
            >
              Load
            </button>
          </div>

          <button
            onclick={clearGrid}
            class="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
          >
            🗑️ Reset
          </button>
        </div>
      </div>

      <!-- Solve Action -->
      <div class="w-full flex flex-col items-center gap-4 pt-8 relative z-10">
        <button
          onclick={solve}
          disabled={solving || !wasmReady}
          class="px-12 py-3 rounded-2xl text-xl font-black shadow-lg transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-widest text-white {solving ? 'bg-gray-500 animate-pulse' : 'bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95 shadow-green-600/30'}"
        >
          {solving ? 'Solving...' : 'Solve'}
        </button>
        <p class="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
          {wasmReady ? 'Engine Standby • Client Side Execution' : 'Loading Neural Engine...'}
        </p>
      </div>

      <!-- Solutions Display Area -->
      {#if solutions.length > 0}
        <div bind:this={solutionsRef} class="mt-20 border-t-2 border-gray-100 dark:border-gray-800 pt-16">
          <div class="text-center mb-12">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Success
            </div>
            <h3 class="text-4xl font-black text-gray-900 dark:text-white mb-2">
              {solutions.length} Valid Solution{solutions.length !== 1 ? 's' : ''} Found
            </h3>
            <p class="text-gray-500 dark:text-gray-400">All arrangements below satisfy the puzzle constraints.</p>
          </div>

          <div class="flex flex-wrap justify-center gap-12 sm:gap-16">
            {#each solutions as sol, idx}
              <div class="flex flex-col items-center gap-6">
                <div class="inline-block p-4 sm:p-6 rounded-[24px] shadow-sm border-2 sm:border-4 ring-1 bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 ring-green-200 dark:ring-gray-800/20">
                  <div class="grid grid-cols-5 gap-1.5 sm:gap-2">
                    {#each Array(5) as _, r}
                      {#each Array(5) as _, c}
                        {@const pIdx = getGlobalIdx(r, c)}
                        {@const isEmpty = (r === 1 || r === 3) && (c === 1 || c === 3)}
                        {#if isEmpty}
                          <div class="w-10 h-10 sm:w-12 sm:h-12"></div>
                        {:else}
                          <div class="relative">
                            <input
                              type="text"
                              value={sol[pIdx] ? sol[pIdx].toUpperCase() : ''}
                              readonly
                              class="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl sm:text-3xl font-black rounded-lg sm:rounded-xl transition-all duration-300 cursor-default pointer-events-none uppercase bg-green-500 text-white border-green-600 shadow-sm"
                            />
                          </div>
                        {/if}
                      {/each}
                    {/each}
                  </div>
                </div>
                <span class="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-black uppercase tracking-widest">
                  Option #{idx + 1}
                </span>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- SEO Content Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
      <div class="bg-white dark:bg-gray-900 p-12 rounded-[56px] shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
        <h3 class="text-3xl font-black mb-8 flex items-center gap-4">
          <span class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-[24px]">📖</span>
          How to Use
        </h3>
        <div class="space-y-8">
          <div class="flex gap-6">
            <div class="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-[18px] flex items-center justify-center font-black text-xl shadow-sm">1</div>
            <div>
              <h4 class="font-black text-lg mb-1">Fill the Board</h4>
              <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Type the letters currently visible in your Waffle puzzle grid. You can also use "Auto Fill Today" to get them instantly.</p>
            </div>
          </div>
          <div class="flex gap-6">
            <div class="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-[18px] flex items-center justify-center font-black text-xl shadow-sm">2</div>
            <div>
              <h4 class="font-black text-lg mb-1">Mark the Hints</h4>
              <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Click each cell to sync colors. Green means the letter is correct, Yellow means it's in the grid but wrong spot.</p>
            </div>
          </div>
          <div class="flex gap-6">
            <div class="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-[18px] flex items-center justify-center font-black text-xl shadow-sm">3</div>
            <div>
              <h4 class="font-black text-lg mb-1">Execute Solver</h4>
              <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Click "Solve". Our tool will find every possible dictionary-valid combination that fits your constraints.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-900 p-12 rounded-[56px] shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
        <h3 class="text-3xl font-black mb-8 flex items-center gap-4">
          <span class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-[24px]">🧇</span>
          What is Waffle?
        </h3>
        <div class="space-y-6">
          <div>
            <h4 class="font-black text-xl text-gray-900 dark:text-white mb-3 leading-snug">A Daily Word Puzzle</h4>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">Waffle is a popular daily word game that looks like a crossword but plays like a logic puzzle. You are given a grid of letters (shaped like a waffle) and must swap them to form six valid words within 15 moves.</p>
          </div>
          <div>
            <h4 class="font-black text-xl text-gray-900 dark:text-white mb-3 leading-snug">How to Play</h4>
            <ul class="list-disc list-inside text-gray-500 dark:text-gray-400 leading-relaxed space-y-2">
              <li>Drag and swap letters anywhere on the board.</li>
              <li><strong>Green</strong> letters are in the correct position.</li>
              <li><strong>Yellow</strong> letters are in the word (row or column) but wrong position.</li>
              <li><strong>Grey</strong> letters (or white) are not in that specific word.</li>
            </ul>
          </div>
          <div>
            <h4 class="font-black text-xl text-gray-900 dark:text-white mb-3 leading-snug">Winning Strategy</h4>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">Every Waffle puzzle is solvable in exactly 10 moves, earning you 5 stars. Our solver helps you find the target arrangement so you can achieve that perfect score.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <img
        src="/waffle-solver7.webp"
        alt="How to use Waffle Solver"
        width="600"
        height="400"
        class="rounded-2xl shadow-md w-full"
        loading="lazy"
      />
    </div>

    <FAQSection title="Waffle Solver FAQ" {faqs} />

    <!-- SEO Content Section -->
    <section class="mt-12 space-y-12">
      <div class="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Why Use a Waffle Solver?</h2>
        <div class="prose prose-lg max-w-none text-gray-600">
          <p class="mb-6 leading-relaxed">
            Waffle is one of the most challenging word puzzles because it combines word knowledge with spatial reasoning. Unlike Wordle where you guess sequentially, Waffle requires you to rearrange letters across multiple intersecting words simultaneously. A solver helps you navigate this complexity by finding all valid arrangements that satisfy the puzzle constraints.
          </p>
          <p class="mb-6 leading-relaxed">
            The game's unique mechanic — swapping letters anywhere on the board — creates thousands of possible arrangements. Most are invalid (they don't form real words), but many are valid. Our WASM-powered solver evaluates every possibility in milliseconds, showing you all solutions so you can choose the one that requires the fewest swaps.
          </p>
          <p class="leading-relaxed">
            Beyond just finding answers, the solver helps you understand the puzzle's structure. By seeing all valid solutions, you learn which letter patterns are common and develop intuition for future puzzles. Many players use the solver as a learning tool, not just a shortcut.
          </p>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">How Our Waffle Solver Works</h2>
        <div class="prose prose-lg max-w-none text-gray-600">
          <p class="mb-6 leading-relaxed">
            The solver uses WebAssembly (WASM) for near-native performance. When you enter your puzzle state — the letters and their color hints — the solver generates all possible arrangements that match your constraints. Each arrangement is then validated against a comprehensive word dictionary.
          </p>
          <p class="mb-6 leading-relaxed">
            The validation process checks all six words: three across and three down. Every word must be a valid English word from our dictionary. The solver also ensures that the letter counts match — if the puzzle has two 'E's, the solution must use exactly two 'E's in the same positions.
          </p>
          <p class="leading-relaxed">
            What makes this solver special is its speed. The WASM engine can evaluate thousands of arrangements per second, delivering results almost instantly. This means you spend less time waiting and more time solving. The "Auto Fill Today" feature even fetches the current puzzle directly from the Waffle API, eliminating manual entry.
          </p>
        </div>
      </div>

      <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 border border-amber-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Tips for Getting Better at Waffle</h2>
        <div class="space-y-6 text-lg text-gray-600">
          <p class="leading-relaxed">
            Waffle rewards both vocabulary and strategy. Here are tips to improve your game:
          </p>
          <ul class="space-y-4 ml-4">
            <li class="leading-relaxed">
              <strong class="text-gray-900">Start with green letters</strong> — Green letters are already in the correct position. Build your strategy around these anchors, as they won't need to move.
            </li>
            <li class="leading-relaxed">
              <strong class="text-gray-900">Identify word patterns</strong> — Look at the green and yellow letters together. Often, you can identify which words they belong to based on common patterns.
            </li>
            <li class="leading-relaxed">
              <strong class="text-gray-900">Count letter frequencies</strong> — If you see two 'S's in the puzzle, they might both go at the ends of words. Letter frequency patterns can guide your swaps.
            </li>
            <li class="leading-relaxed">
              <strong class="text-gray-900">Work on one word at a time</strong> — Once you've identified a likely word, focus on getting its letters in place. This creates a ripple effect that helps solve adjacent words.
            </li>
            <li class="leading-relaxed">
              <strong class="text-gray-900">Use the solver to learn</strong> — After solving (or when stuck), use the solver to see the target arrangement. Compare it to your thought process and identify where you went wrong.
            </li>
          </ul>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Understanding Waffle Scoring</h2>
        <div class="prose prose-lg max-w-none text-gray-600">
          <p class="mb-6 leading-relaxed">
            Waffle uses a clever scoring system based on the number of swaps you make. Every puzzle is designed to be solvable in exactly 10 swaps, which earns you 5 stars (a perfect score). Each additional swap costs you half a star.
          </p>
          <div class="grid md:grid-cols-2 gap-6 not-prose mb-6">
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 class="font-bold text-gray-900 mb-2">⭐⭐⭐⭐⭐ 5 Stars</h3>
              <p class="text-gray-600 text-sm">Solved in 10 swaps or fewer. This is the target for every puzzle and shows mastery.</p>
            </div>
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 class="font-bold text-gray-900 mb-2">⭐⭐⭐⭐ 4 Stars</h3>
              <p class="text-gray-600 text-sm">Solved in 11-12 swaps. Very good, but there was a more efficient path.</p>
            </div>
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 class="font-bold text-gray-900 mb-2">⭐⭐⭐ 3 Stars</h3>
              <p class="text-gray-600 text-sm">Solved in 13-14 swaps. Average performance. Review your swaps for inefficiencies.</p>
            </div>
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 class="font-bold text-gray-900 mb-2">⭐⭐ or less</h3>
              <p class="text-gray-600 text-sm">15+ swaps. Consider using the solver to understand the optimal path.</p>
            </div>
          </div>
          <p class="leading-relaxed">
            The solver helps you achieve perfect scores by showing you the target arrangement. Once you know where each letter should go, you can plan your swaps to reach the solution in exactly 10 moves.
          </p>
        </div>
      </div>
    </section>

    <!-- Internal Links Section -->
    <div class="bg-gray-100 dark:bg-gray-800/50 p-8 sm:p-12 rounded-[40px] text-center space-y-8">
      <h2 class="text-3xl font-black text-gray-900 dark:text-white">Explore More Solvers</h2>
      <div class="flex flex-wrap justify-center gap-4">
        {#each solverLinks as link}
          <a href={link.href} class="px-6 py-3 bg-white dark:bg-gray-700 rounded-xl font-bold text-gray-800 dark:text-white shadow-sm hover:scale-105 transition-transform">
            {link.label}
          </a>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
</style>
