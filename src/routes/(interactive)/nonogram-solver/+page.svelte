<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import {
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateWebApplicationSchema,
    generateWebPageSchema,
  } from '$lib/seo';
  import {
    solveNonogram,
    createEmptyGrid,
    FILLED,
    BLANK,
    UNKNOWN,
    type SolveStep,
    type NonogramPuzzle,
    type Grid,
    type Clues,
  } from '$lib/nonogram';
  import { SAMPLE_PUZZLES, getRandomPuzzle } from '$lib/nonogram-puzzles';

  const pageTitle = 'Nonogram Solver - Free Step-by-Step Picross Solver | WordSolverX';
  const pageDescription =
    'Solve any Nonogram (Picross) puzzle step by step with this free online solver. Enter row and column clues, watch the algorithm work, and learn solving strategies visually.';
  const pageUrl = 'https://wordsolver.tech/nonogram-solver';

  const faqs = [
    {
      question: 'What is a Nonogram puzzle?',
      answer:
        'A Nonogram, also known as Picross or Hanjie, is a picture logic puzzle where you fill in cells on a grid based on numerical clues for each row and column. Each clue indicates the lengths of consecutive filled cell groups.',
    },
    {
      question: 'How does the step-by-step solver work?',
      answer:
        'The solver uses constraint propagation to deduce cells that must be filled or blank based on the clues, then uses backtracking with educated guesses when no further deduction is possible. Every step is recorded so you can watch the process.',
    },
    {
      question: 'Can I use this solver for any Nonogram size?',
      answer:
        'Yes. You can configure the grid from 1x1 up to 25x25. Enter your own row and column clues (space-separated numbers), or load one of the built-in sample puzzles to get started quickly.',
    },
  ];

  const schemas = JSON.stringify([
    generateFAQSchema(faqs),
    generateHowToSchema('How to use the Nonogram solver', [
      {
        name: 'Set up your puzzle',
        text: 'Choose the grid size using the row and column controls, then enter the clue numbers for each row and column as space-separated values.',
      },
      {
        name: 'Run the solver',
        text: 'Click the Solve button to let the algorithm determine the filled and blank cells using constraint propagation and backtracking.',
      },
      {
        name: 'Step through the solution',
        text: 'Use the playback controls to step forward and backward through each deduction, or let it animate automatically at your preferred speed.',
      },
    ]),
    generateWebApplicationSchema('Nonogram Solver', pageDescription),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolver.tech' },
      { name: 'Solver', url: 'https://wordsolver.tech/solver' },
      { name: 'Nonogram Solver', url: pageUrl },
    ]),
    generateWebPageSchema('Nonogram Solver', pageDescription, pageUrl),
  ]);

  let numRows = $state(5);
  let numCols = $state(5);
  let rowClueStrings = $state<string[]>(Array(5).fill(''));
  let colClueStrings = $state<string[]>(Array(5).fill(''));

  let resultSteps = $state<SolveStep[]>([]);
  let currentStepIndex = $state(0);
  let isPlaying = $state(false);
  let showGridLines = $state(true);
  let animationSpeed = $state(500);
  let showSamples = $state(false);
  let solveError = $state('');
  let isSolving = $state(false);

  let playTimer: ReturnType<typeof setInterval> | null = null;

  let currentGrid = $derived.by((): Grid => {
    if (resultSteps.length === 0) return createEmptyGrid(numRows, numCols);
    const idx = Math.min(currentStepIndex, resultSteps.length - 1);
    return resultSteps[idx].gridSnapshot;
  });

  let progressPercent = $derived.by(() => {
    if (resultSteps.length === 0) return 0;
    const grid = currentGrid;
    const total = grid.length * (grid[0]?.length ?? 0);
    if (total === 0) return 0;
    const filled = grid.flat().filter((c) => c !== UNKNOWN).length;
    return Math.round((filled / total) * 100);
  });

  let stepDescription = $derived(
    resultSteps.length > 0
      ? resultSteps[Math.min(currentStepIndex, resultSteps.length - 1)]?.description ?? ''
      : ''
  );

  let hasResult = $derived(resultSteps.length > 0);
  let isAtStart = $derived(currentStepIndex <= 0);
  let isAtEnd = $derived(currentStepIndex >= resultSteps.length - 1);

  $effect(() => {
    return () => { if (playTimer) clearInterval(playTimer); };
  });

  function handleResizeRows(delta: number) {
    const next = Math.max(1, Math.min(25, numRows + delta));
    if (next === numRows) return;
    numRows = next;
    rowClueStrings = Array(numRows).fill('');
    resetResult();
  }

  function handleResizeCols(delta: number) {
    const next = Math.max(1, Math.min(25, numCols + delta));
    if (next === numCols) return;
    numCols = next;
    colClueStrings = Array(numCols).fill('');
    resetResult();
  }

  function resetResult() {
    resultSteps = [];
    currentStepIndex = 0;
    solveError = '';
    stopPlaying();
  }

  function parseClue(str: string): number[] {
    const nums = str.trim().split(/\s+/).map(Number).filter((n) => !isNaN(n) && n >= 0);
    return nums.length === 0 ? [0] : nums;
  }

  function handleSolve() {
    resetResult();
    isSolving = true;
    const rowClues: Clues = rowClueStrings.map(parseClue);
    const colClues: Clues = colClueStrings.map(parseClue);
    const puzzle: NonogramPuzzle = { rows: numRows, cols: numCols, rowClues, colClues };
    const steps: SolveStep[] = [];

    try {
      const res = solveNonogram(puzzle, (step) => steps.push(step));
      resultSteps = steps;
      currentStepIndex = 0;
      if (!res.solved && res.error) solveError = res.error;
    } catch (e) {
      solveError = e instanceof Error ? e.message : 'An error occurred';
    }
    isSolving = false;
  }

  function loadPuzzle(puzzle: NonogramPuzzle) {
    resetResult();
    numRows = puzzle.rows;
    numCols = puzzle.cols;
    rowClueStrings = puzzle.rowClues.map((c) => c.join(' '));
    colClueStrings = puzzle.colClues.map((c) => c.join(' '));
    showSamples = false;
  }

  function loadRandomPuzzle() {
    loadPuzzle(getRandomPuzzle());
  }

  function stepForward() {
    if (currentStepIndex < resultSteps.length - 1) currentStepIndex++;
  }

  function stepBack() {
    if (currentStepIndex > 0) currentStepIndex--;
  }

  function togglePlay() {
    if (isPlaying) {
      stopPlaying();
    } else {
      if (isAtEnd) currentStepIndex = 0;
      isPlaying = true;
      playTimer = setInterval(() => {
        if (currentStepIndex < resultSteps.length - 1) {
          currentStepIndex++;
        } else {
          stopPlaying();
        }
      }, Math.max(50, 1100 - animationSpeed));
    }
  }

  function stopPlaying() {
    isPlaying = false;
    if (playTimer) { clearInterval(playTimer); playTimer = null; }
  }

  function cellClass(cell: number): string {
    if (cell === FILLED) return 'bg-violet-500';
    if (cell === BLANK) return 'bg-slate-800/60';
    return 'bg-slate-700/30';
  }

  function cellSymbol(cell: number): string {
    if (cell === BLANK) return '\u2715';
    return '';
  }

  function cellTextClass(cell: number): string {
    if (cell === BLANK) return 'text-slate-500 text-xs';
    return '';
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta
    name="keywords"
    content="nonogram solver, picross solver, nonogram online, picross puzzle solver, nonogram step by step, hanjie solver, free nonogram solver, online nonogram solver"
  />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:image" content="https://wordsolver.tech/wordsolverx.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <link rel="canonical" href={pageUrl} />
  {@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-slate-950">
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <Breadcrumbs />
  </div>

  <section class="mx-auto max-w-5xl px-4 pb-8 sm:px-6 lg:px-8">
    <div
      class="rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-600 via-purple-600 to-violet-600 px-6 py-8 text-white shadow-2xl shadow-violet-500/20 sm:px-8 sm:py-10"
    >
      <p
        class="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100"
      >
        Puzzle solver tool
      </p>
      <h1 class="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Nonogram Solver</h1>
      <p class="mt-4 max-w-3xl text-base leading-8 text-slate-100 sm:text-lg">
        Enter your Nonogram clues and let the solver work through the puzzle step by step.
        Watch constraint propagation and backtracking in action, or load a sample puzzle to get started.
      </p>
    </div>
  </section>

  <div class="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
    <!-- Grid Size Configuration -->
    <section class="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
      <h2 class="text-xl font-bold text-white">Grid Configuration</h2>
      <div class="mt-4 flex flex-wrap gap-6">
        <div class="flex items-center gap-3">
          <span class="text-sm text-slate-300">Rows</span>
          <button
            onclick={() => handleResizeRows(-1)}
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-white hover:bg-slate-600"
          >-</button>
          <span class="w-8 text-center text-lg font-bold text-white">{numRows}</span>
          <button
            onclick={() => handleResizeRows(1)}
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-white hover:bg-slate-600"
          >+</button>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-slate-300">Columns</span>
          <button
            onclick={() => handleResizeCols(-1)}
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-white hover:bg-slate-600"
          >-</button>
          <span class="w-8 text-center text-lg font-bold text-white">{numCols}</span>
          <button
            onclick={() => handleResizeCols(1)}
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-white hover:bg-slate-600"
          >+</button>
        </div>
        <button
          onclick={() => { showSamples = true; }}
          class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
        >
          Load Sample Puzzle
        </button>
        <button
          onclick={loadRandomPuzzle}
          class="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
        >
          Random Puzzle
        </button>
      </div>
    </section>

    <!-- Clue Inputs -->
    <section class="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
      <h2 class="text-xl font-bold text-white">Clue Input</h2>
      <p class="mt-1 text-sm text-slate-400">Enter space-separated numbers for each row and column (e.g. "1 3 1" means one filled, gap, three filled, gap, one filled).</p>

      <div class="mt-6 grid gap-8 lg:grid-cols-2">
        <!-- Row Clues -->
        <div>
          <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Row Clues</h3>
          <div class="flex flex-col gap-2">
            {#each Array(numRows) as _, i}
              <div class="flex items-center gap-2">
                <span class="w-12 text-right text-xs text-slate-400">Row {i + 1}</span>
                <input
                  type="text"
                  bind:value={rowClueStrings[i]}
                  placeholder="e.g. 1 3 1"
                  class="flex-1 rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </div>
            {/each}
          </div>
        </div>

        <!-- Column Clues -->
        <div>
          <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Column Clues</h3>
          <div class="flex flex-col gap-2">
            {#each Array(numCols) as _, i}
              <div class="flex items-center gap-2">
                <span class="w-12 text-right text-xs text-slate-400">Col {i + 1}</span>
                <input
                  type="text"
                  bind:value={colClueStrings[i]}
                  placeholder="e.g. 2 1"
                  class="flex-1 rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </div>
            {/each}
          </div>
        </div>
      </div>

      <div class="mt-6 flex gap-3">
        <button
          onclick={handleSolve}
          disabled={isSolving}
          class="rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 hover:bg-violet-500 disabled:opacity-50"
        >
          {isSolving ? 'Solving...' : 'Solve'}
        </button>
        <button
          onclick={resetResult}
          class="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10"
        >
          Reset
        </button>
      </div>

      {#if solveError}
        <p class="mt-3 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">{solveError}</p>
      {/if}
    </section>

    <!-- Grid Display -->
    <section class="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-white">Puzzle Grid</h2>
        {#if hasResult}
          <span class="text-sm text-slate-400">Step {currentStepIndex + 1} of {resultSteps.length}</span>
        {/if}
      </div>

      <!-- Progress Bar -->
      {#if hasResult}
        <div class="mt-4">
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span>{stepDescription}</span>
            <span>{progressPercent}% complete</span>
          </div>
          <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-700">
            <div
              class="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
              style="width: {progressPercent}%"
            ></div>
          </div>
        </div>
      {/if}

      <!-- Playback Controls -->
      {#if hasResult}
        <div class="mt-4 flex items-center gap-2">
          <button
            onclick={stepBack}
            disabled={isAtStart}
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-40"
            title="Step back"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onclick={togglePlay}
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600 text-white hover:bg-violet-500"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {#if isPlaying}
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6" /></svg>
            {:else}
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
            {/if}
          </button>
          <button
            onclick={stepForward}
            disabled={isAtEnd}
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-40"
            title="Step forward"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
          <span class="ml-2 text-xs text-slate-400">Speed</span>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            bind:value={animationSpeed}
            class="w-32 accent-violet-500"
          />
          <span class="text-xs text-slate-400">{animationSpeed}ms</span>
        </div>
      {/if}

      <!-- The Grid -->
      <div class="mt-6 flex justify-center overflow-x-auto">
        <div class="inline-block">
          <!-- Column clue headers -->
          <div class="flex">
            <div style="width: {Math.max(40, Math.ceil(Math.log10(numRows + 1)) * 10 + 16)}px"></div>
            {#each Array(numCols) as _, c}
              <div
                class="flex flex-col items-center justify-end px-1 pb-1 text-xs text-slate-400"
                style="width: {numCols <= 10 ? 40 : 32}px; min-height: {rowClueStrings.length > 0 ? 40 : 24}px;"
              >
                {#each parseClue(colClueStrings[c]) as num}
                  <span class="leading-tight">{num}</span>
                {/each}
              </div>
            {/each}
          </div>
          <!-- Grid rows with row clues -->
          {#each Array(numRows) as _, r}
            <div class="flex">
              <div
                class="flex items-center justify-end gap-0.5 pr-2 text-xs text-slate-400"
                style="width: {Math.max(40, Math.ceil(Math.log10(numRows + 1)) * 10 + 16)}px;"
              >
                {#each parseClue(rowClueStrings[r]) as num}
                  <span>{num}</span>
                {/each}
              </div>
              {#each Array(numCols) as _, c}
                <div
                  class="flex items-center justify-center text-center font-bold {cellClass(currentGrid[r]?.[c] ?? UNKNOWN)} {cellTextClass(currentGrid[r]?.[c] ?? UNKNOWN)}"
                  style="width: {numCols <= 10 ? 40 : 32}px; height: {numCols <= 10 ? 40 : 32}px; {showGridLines ? 'border: 1px solid rgba(255,255,255,0.08);' : ''} {(c + 1) % 5 === 0 && c < numCols - 1 ? 'border-right: 3px solid rgba(139,92,246,0.5);' : ''} {(r + 1) % 5 === 0 && r < numRows - 1 ? 'border-bottom: 3px solid rgba(139,92,246,0.5);' : ''}"
                >
                  {cellSymbol(currentGrid[r]?.[c] ?? UNKNOWN)}
                </div>
              {/each}
            </div>
          {/each}
        </div>
      </div>

      <!-- Legend -->
      <div class="mt-4 flex items-center gap-6 text-xs text-slate-400">
        <div class="flex items-center gap-2">
          <div class="h-4 w-4 rounded bg-violet-500"></div>
          <span>Filled</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex h-4 w-4 items-center justify-center rounded bg-slate-800/60 text-slate-500" style="font-size:10px">\u00d7</div>
          <span>Blank</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-4 w-4 rounded bg-slate-700/30"></div>
          <span>Unknown</span>
        </div>
      </div>
    </section>

    <!-- Settings -->
    <section class="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
      <h2 class="text-xl font-bold text-white">Settings</h2>
      <div class="mt-4 flex flex-wrap gap-6">
        <label class="flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            bind:checked={showGridLines}
            class="h-4 w-4 rounded accent-violet-500"
          />
          Show grid lines
        </label>
      </div>
    </section>

    <!-- Sample Puzzles Dialog -->
    {#if showSamples}
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div class="mx-4 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">Sample Puzzles</h2>
            <button
              onclick={() => { showSamples = false; }}
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-white hover:bg-slate-600"
            >\u2715</button>
          </div>
          <div class="mt-4 flex flex-col gap-3">
            {#each SAMPLE_PUZZLES as puzzle, i}
              <button
                onclick={() => loadPuzzle(puzzle)}
                class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white hover:bg-white/10"
              >
                <span class="font-semibold">Puzzle {i + 1}</span>
                <span class="text-slate-400">{puzzle.rows}\u00d7{puzzle.cols}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>
    {/if}

    <!-- Content Sections -->
    <article class="grid gap-6 lg:grid-cols-2">
      <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
        <h2 class="text-2xl font-bold text-white">What is a Nonogram?</h2>
        <p class="mt-4 text-sm leading-8 text-slate-300">
          A Nonogram, also called Picross or Hanjie, is a picture logic puzzle played on a grid. Each row and column has a set of numbers indicating the lengths of consecutive filled cell groups. The goal is to reveal a hidden picture by filling in the correct cells.
        </p>
        <p class="mt-4 text-sm leading-8 text-slate-300">
          Nonograms are popular in newspapers, puzzle books, and as mobile apps. They combine logic and pattern recognition, making them a great brain exercise for all ages.
        </p>
      </section>

      <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
        <h2 class="text-2xl font-bold text-white">How this solver works</h2>
        <p class="mt-4 text-sm leading-8 text-slate-300">
          The solver first uses constraint propagation, examining each row and column to determine which cells must be filled or blank. If ambiguity remains, it makes educated guesses and backtracks when contradictions are found.
        </p>
        <p class="mt-4 text-sm leading-8 text-slate-300">
          Every deduction is recorded as a step, so you can watch the algorithm solve the puzzle from start to finish using the playback controls.
        </p>
      </section>
    </article>

    <section class="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
      <h2 class="text-2xl font-bold text-white">Tips for entering clues</h2>
      <div class="mt-5 grid gap-5 md:grid-cols-3">
        <div class="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h3 class="text-lg font-bold text-white">Space-separated numbers</h3>
          <p class="mt-3 text-sm leading-7 text-slate-300">
            Enter each clue group separated by spaces. For example, "2 3" means two filled cells, a gap, then three filled cells.
          </p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h3 class="text-lg font-bold text-white">Use 0 for empty</h3>
          <p class="mt-3 text-sm leading-7 text-slate-300">
            A row or column with no filled cells should have a clue of "0". This tells the solver the entire line is blank.
          </p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h3 class="text-lg font-bold text-white">Try sample puzzles</h3>
          <p class="mt-3 text-sm leading-7 text-slate-300">
            Not sure where to start? Load one of the built-in sample puzzles to see the solver in action, then try your own.
          </p>
        </div>
      </div>
    </section>

    <div class="mt-10 rounded-3xl border border-white/10 bg-white/5 p-2 shadow-xl backdrop-blur-sm">
      <FAQSection class="py-0" {faqs} title="Nonogram Solver FAQs" />
    </div>
  </div>
</main>
