<script lang="ts">
  import { onMount } from 'svelte';
  import {
    fetchTodayPuzzle,
    getDictionarySize,
    isDictionaryLoaded,
    loadDictionary,
    solveSquaredle,
    type FoundWord,
    type SolverResult
  } from '$lib/squaredle/client-solver';

  const sizeOptions = [3, 4, 5, 6, 7, 8];

  function createEmptyGrid(size: number): string[][] {
    return Array.from({ length: size }, () => Array(size).fill(''));
  }

  let gridSize = 5;
  let grid = createEmptyGrid(5);
  let isLoadingDict = true;
  let dictProgress = 0;
  let dictSize = 0;
  let isSolving = false;
  let isLoadingToday = false;
  let result: SolverResult | null = null;
  let errorMessage = '';
  let highlightedWord: FoundWord | null = null;
  let selectedLength: number | null = null;
  let isOfficialPuzzle = false;
  let officialWordCount = 0;
  let officialBonusCount = 0;
  let gridSectionRef: HTMLElement | null = null;
  let resultsSectionRef: HTMLElement | null = null;

  $: allLengths = result ? Object.keys(result.byLength).map(Number).sort((a, b) => b - a) : [];
  $: filteredWords =
    result && selectedLength ? result.byLength[selectedLength] || [] : result?.words || [];

  function setGridSizeValue(size: number) {
    gridSize = size;
    grid = createEmptyGrid(size);
    result = null;
    highlightedWord = null;
    errorMessage = '';
    isOfficialPuzzle = false;
  }

  function handleCellInput(row: number, col: number, value: string) {
    grid = grid.map((currentRow, rowIndex) =>
      rowIndex !== row
        ? currentRow
        : currentRow.map((cell, colIndex) =>
            colIndex !== col ? cell : value.slice(-1).toLowerCase().replace(/[^a-z]/g, '')
          )
    );
    result = null;
    highlightedWord = null;
    errorMessage = '';
    isOfficialPuzzle = false;
  }

  function handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const lines = pastedText.split('\n').filter((line) => line.trim());
    const nextGrid = lines
      .map((line) =>
        line
          .split(/[\s,]+/)
          .filter(Boolean)
          .map((value) => value.slice(-1).toLowerCase().replace(/[^a-z]/g, ''))
      )
      .filter((row) => row.length);

    if (!nextGrid.length) return;

    const maxSize = Math.max(nextGrid.length, ...nextGrid.map((row) => row.length));
    const normalized = Array.from({ length: maxSize }, (_, rowIndex) =>
      Array.from({ length: maxSize }, (_, colIndex) => nextGrid[rowIndex]?.[colIndex] || '')
    );

    gridSize = maxSize;
    grid = normalized;
    result = null;
    highlightedWord = null;
    errorMessage = '';
    isOfficialPuzzle = false;
  }

  function clearGrid() {
    grid = createEmptyGrid(gridSize);
    result = null;
    highlightedWord = null;
    errorMessage = '';
    isOfficialPuzzle = false;
  }

  function hasLetters() {
    return grid.some((row) => row.some((cell) => cell.trim() !== ''));
  }

  async function solveBoard(officialOnly = false) {
    if (!isDictionaryLoaded()) {
      errorMessage = 'Dictionary is still loading.';
      return;
    }

    if (!hasLetters()) {
      errorMessage = 'Enter some letters in the grid first.';
      return;
    }

    isSolving = true;
    errorMessage = '';
    highlightedWord = null;

    try {
      let officialWords: Set<string> | undefined;
      let bonusWords: Set<string> | undefined;

      if (officialOnly) {
        const todayPuzzle = await fetchTodayPuzzle();
        if (todayPuzzle) {
          officialWords = new Set([...todayPuzzle.words, ...todayPuzzle.bonusWords]);
          bonusWords = new Set(todayPuzzle.bonusWords);
        }
      }

      result = solveSquaredle(grid, 2, officialWords, bonusWords);
      selectedLength = null;

      // Auto-scroll to results section after solving
      requestAnimationFrame(() => {
        resultsSectionRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to solve puzzle.';
    } finally {
      isSolving = false;
    }
  }

  async function loadTodayPuzzle() {
    isLoadingToday = true;
    errorMessage = '';

    try {
      const puzzle = await fetchTodayPuzzle();
      if (!puzzle?.grid) {
        throw new Error('Could not load today\'s Squaredle puzzle.');
      }

      gridSize = puzzle.grid.length;
      grid = puzzle.grid;
      result = null;
      highlightedWord = null;
      isOfficialPuzzle = true;
      officialWordCount = puzzle.words.length;
      officialBonusCount = puzzle.bonusWords.length;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Could not load today\'s puzzle.';
    } finally {
      isLoadingToday = false;
    }
  }

  function isHighlighted(row: number, col: number) {
    return highlightedWord?.path.some((position) => position.row === row && position.col === col) || false;
  }

  function getPathIndex(row: number, col: number) {
    return highlightedWord?.path.findIndex((position) => position.row === row && position.col === col) ?? -1;
  }

  function gridTemplate(size: number) {
    return `grid-template-columns: repeat(${size}, minmax(0, 1fr));`;
  }

  onMount(async () => {
    try {
      await loadDictionary((progress) => {
        dictProgress = progress;
      });
      dictSize = getDictionarySize();
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to load Squaredle dictionary.';
    } finally {
      isLoadingDict = false;
    }
  });
</script>

<section class="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.14),_transparent_36%),linear-gradient(180deg,#fff7f7_0%,#ffffff_42%,#fffafa_100%)] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
  <div class="pointer-events-none absolute inset-x-0 top-0 mx-auto h-72 max-w-5xl rounded-full bg-red-200/30 blur-3xl"></div>

  <div class="relative mx-auto max-w-6xl space-y-8">
    <div class="rounded-[2rem] border border-red-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(239,68,68,0.1)] backdrop-blur sm:p-8">
      <div class="flex flex-wrap items-start justify-between gap-6">
        <div class="max-w-3xl">
          <p class="inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
            Official board + client solver
          </p>
          <h2 class="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Squaredle Solver</h2>
          <p class="mt-4 text-base leading-8 text-slate-600">
            Paste or type any Squaredle board, load today's official puzzle, then solve it in the browser with the same compressed dictionary and path-finding logic from the original project.
          </p>
          <a class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition hover:text-red-700" href="https://squaredle.app" rel="noopener noreferrer" target="_blank">
            Play Squaredle
            <span aria-hidden="true">-></span>
          </a>
        </div>

        <div class="min-w-[240px] rounded-3xl border border-red-100 bg-red-50/80 p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">Dictionary status</p>
          {#if isLoadingDict}
            <p class="mt-3 text-sm font-medium text-slate-600">Loading dictionary... {dictProgress}%</p>
          {:else}
            <p class="mt-3 text-2xl font-black text-slate-900">{dictSize.toLocaleString()}</p>
            <p class="mt-1 text-sm text-slate-600">words available for local solving</p>
          {/if}
        </div>
      </div>
    </div>

    {#if isOfficialPuzzle && !result}
      <div class="rounded-3xl border border-teal-200 bg-teal-50 px-5 py-4 text-sm text-teal-800 shadow-sm">
        Today's official Squaredle puzzle is loaded: {officialWordCount} words plus {officialBonusCount} bonus words.
      </div>
    {/if}

    {#if errorMessage}
      <div class="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm">
        {errorMessage}
      </div>
    {/if}

    <div class="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div class="space-y-6" bind:this={gridSectionRef}>
        <section class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(148,163,184,0.12)] sm:p-8">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 class="text-xl font-bold text-slate-900">Puzzle grid</h3>
              <p class="mt-1 text-sm text-slate-500">Type one letter per cell or paste a full board from the clipboard.</p>
            </div>
            <select bind:value={gridSize} class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-red-400" on:change={() => setGridSizeValue(gridSize)}>
              {#each sizeOptions as size}
                <option value={size}>{size} x {size}</option>
              {/each}
            </select>
          </div>

          <div class="mt-6 rounded-[1.75rem] bg-gradient-to-br from-red-600 to-rose-700 p-3 shadow-[0_20px_40px_rgba(127,29,29,0.25)]" on:paste={handlePaste}>
            <div class="grid gap-1.5" style={gridTemplate(gridSize)}>
              {#each grid as row, rowIndex}
                {#each row as cell, colIndex}
                  {@const highlighted = isHighlighted(rowIndex, colIndex)}
                  {@const pathIndex = getPathIndex(rowIndex, colIndex)}
                  <div class="relative aspect-square">
                    <input
                      value={cell}
                      class={`h-full w-full rounded-2xl border-2 text-center text-lg font-black uppercase outline-none transition ${highlighted ? 'border-yellow-400 bg-yellow-300 text-slate-900 shadow-lg' : 'border-white/50 bg-white text-slate-900 focus:border-yellow-300'}`}
                      maxlength="1"
                      on:input={(event) => handleCellInput(rowIndex, colIndex, (event.currentTarget as HTMLInputElement).value)}
                      spellcheck="false"
                    />
                    {#if highlighted}
                      <div class="absolute -top-2 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-black text-slate-900">
                        {pathIndex + 1}
                      </div>
                    {/if}
                  </div>
                {/each}
              {/each}
            </div>
          </div>

          <div class="mt-6 grid gap-3 sm:grid-cols-2">
            <button class="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:translate-y-[-1px] disabled:opacity-60" disabled={isSolving || isLoadingDict} on:click={() => solveBoard(false)} type="button">
              {#if isSolving}Solving...{:else}Solve all words{/if}
            </button>
            <button class="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:text-red-700 disabled:opacity-60" disabled={isSolving || isLoadingDict} on:click={() => solveBoard(true)} type="button">
              Solve official
            </button>
            <button class="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:text-red-700 disabled:opacity-60" disabled={isLoadingToday} on:click={loadTodayPuzzle} type="button">
              {#if isLoadingToday}Loading today...{:else}Load today{/if}
            </button>
            <button class="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900" on:click={clearGrid} type="button">
              Clear grid
            </button>
          </div>
        </section>
      </div>

      <div class="space-y-6" bind:this={resultsSectionRef}>
        <section class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(148,163,184,0.12)] sm:p-8">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 class="text-xl font-bold text-slate-900">Solve results</h3>
              <p class="mt-1 text-sm text-slate-500">
                {#if result}
                  {result.totalWords.toLocaleString()} words found in {result.executionTime.toFixed(1)}ms.
                {:else}
                  Solve a board to see ranked words and hover paths.
                {/if}
              </p>
            </div>

            {#if result}
              <div class="rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-red-700">
                {result.totalWords.toLocaleString()} words
              </div>
            {/if}
          </div>

          {#if result}
            <div class="mt-5 flex flex-wrap gap-2">
              <button class={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedLength === null ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:text-red-700'}`} on:click={() => (selectedLength = null)} type="button">
                All
              </button>
              {#each allLengths as length}
                <button class={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedLength === length ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:text-red-700'}`} on:click={() => (selectedLength = length)} type="button">
                  {length} letters
                </button>
              {/each}
            </div>

            <div class="mt-6 max-h-[46rem] space-y-3 overflow-y-auto pr-1">
              {#each filteredWords as word}
                <button class={`w-full rounded-3xl border px-4 py-4 text-left transition hover:border-red-300 hover:bg-red-50 ${highlightedWord?.word === word.word ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50/60'}`} on:mouseenter={() => (highlightedWord = word)} on:focus={() => (highlightedWord = word)} on:click={() => { highlightedWord = word; requestAnimationFrame(() => { gridSectionRef?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); }} type="button">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="font-mono text-lg font-bold uppercase tracking-[0.16em] text-slate-900">{word.word}</p>
                      <p class="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {word.length} letters
                        {#if word.isBonus}
                          <span class="ml-2 rounded-full bg-amber-100 px-2 py-1 text-[10px] text-amber-700">Bonus</span>
                        {/if}
                      </p>
                    </div>
                    <div class="text-right text-xs text-slate-500">
                      <p>Score {word.score}</p>
                      <p>{word.path.length} steps</p>
                    </div>
                  </div>
                </button>
              {/each}
            </div>
          {:else}
            <div class="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center text-sm text-slate-500">
              Dictionary loads once, then all solving runs in the browser from the compressed word list.
            </div>
          {/if}
        </section>
      </div>
    </div>
  </div>
</section>
