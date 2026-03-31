<script lang="ts">
  import {
    generateCollectionPageSchema,
    generateWebPageSchema
  } from '$lib/seo';
  import {
    COLORS,
    COLOR_NAMES,
    getPuzzleAnswerByNumber,
    type PuzzleAnswer,
    getPuzzleNumber
  } from '$lib/colorfle';

  const currentPuzzleNumber = getPuzzleNumber();
  const archiveCount = Math.min(currentPuzzleNumber, 100);

  const archiveEntries: PuzzleAnswer[] = [];
  for (let i = currentPuzzleNumber; i > currentPuzzleNumber - archiveCount && i > 0; i--) {
    archiveEntries.push(getPuzzleAnswerByNumber(i));
  }

  let searchQuery = $state('');

  const filteredEntries = $derived.by(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return archiveEntries;
    return archiveEntries.filter((entry) =>
      [entry.puzzleNumber.toString(), entry.targetHex, ...entry.colorNames, ...entry.colorHexes].some((v) =>
        v.toLowerCase().includes(query)
      )
    );
  });

  const schemas = $derived.by(() =>
    JSON.stringify([
      generateCollectionPageSchema(
        'Colorfle Archive',
        'Browse past Colorfle puzzle answers. See color combinations, hex codes, and target colors for previous daily puzzles.',
        'https://wordsolver.tech/colorfle-archive',
        archiveEntries.slice(0, 50).map((entry) => ({
          name: `Colorfle #${entry.puzzleNumber} - ${entry.targetHex}`,
          url: `https://wordsolver.tech/colorfle-archive#puzzle-${entry.puzzleNumber}`
        }))
      ),
      generateWebPageSchema(
        'Colorfle Archive',
        'Complete archive of past Colorfle color mixing puzzle answers with color swatches and hex codes.',
        'https://wordsolver.tech/colorfle-archive'
      )
    ])
  );
</script>

<svelte:head>
  <title>Colorfle Archive - Past Color Mixing Puzzle Answers | WordSolverX</title>
  <meta name="description" content="Browse the complete Colorfle archive. View past puzzle answers with color swatches, hex codes, and target mixed colors for every daily colorfle puzzle." />
  <meta name="keywords" content="colorfle archive, colorfle past answers, colorfle puzzle history, color mixing puzzle archive, colorfle old puzzles, colorfle answers list" />
  <link rel="canonical" href="https://wordsolver.tech/colorfle-archive" />
  <meta property="og:title" content="Colorfle Archive - Past Color Mixing Puzzle Answers" />
  <meta property="og:description" content="Browse all past Colorfle puzzle answers with color swatches and hex codes." />
  <meta property="og:url" content="https://wordsolver.tech/colorfle-archive" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://wordsolver.tech/wordsolverx.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Colorfle Archive - Past Color Mixing Puzzle Answers" />
  <meta name="twitter:description" content="Browse all past Colorfle puzzle answers with color swatches and hex codes." />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- Hero Section -->
  <section class="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-900 pt-16 pb-20">
    <div class="absolute inset-0">
      <div class="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-pink-500/10 blur-[120px]"></div>
      <div class="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px]"></div>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
        <span class="text-sm font-medium text-white/90">{archiveEntries.length} puzzles available</span>
      </div>

      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">Colorfle</span> Archive
      </h1>
      <p class="max-w-2xl mx-auto text-lg text-white/80 mb-10">
        Browse past Colorfle puzzle answers. View color combinations, hex codes, and target mixed colors for every daily puzzle.
      </p>
    </div>
  </section>

  <!-- Archive Content -->
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20 pb-12">
    <!-- Search -->
    <form class="mb-8 flex overflow-hidden rounded-2xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 shadow-lg" onsubmit={(e) => e.preventDefault()}>
      <input
        bind:value={searchQuery}
        type="search"
        placeholder="Search by puzzle number, hex code, or color name..."
        class="min-w-0 flex-1 bg-transparent px-5 py-4 text-base text-gray-900 dark:text-white outline-none placeholder:text-gray-400"
      />
      <button
        type="submit"
        class="border-l border-purple-200 dark:border-purple-800 bg-purple-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-purple-500"
      >
        Search
      </button>
    </form>

    <!-- Archive Grid -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each filteredEntries as entry}
        <div id="puzzle-{entry.puzzleNumber}" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 hover:border-purple-300 dark:hover:border-purple-500 transition-all hover:shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-bold text-purple-600 dark:text-purple-400">#{entry.puzzleNumber}</span>
            <div
              class="w-10 h-10 rounded-lg shadow-inner border border-black/10"
              style="background-color: {entry.targetHex}"
              title="Target: {entry.targetHex}"
            ></div>
          </div>

          <div class="flex gap-2 mb-4">
            {#each entry.colorHexes as hex, ci}
              <div class="flex-1">
                <div
                  class="w-full aspect-square rounded-lg shadow-inner border border-black/5"
                  style="background-color: {hex}"
                  title={entry.colorNames[ci]}
                ></div>
                <p class="text-[10px] text-center text-gray-500 dark:text-gray-400 mt-1 truncate">{entry.colorNames[ci]}</p>
              </div>
            {/each}
          </div>

          <div class="pt-3 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target</p>
                <p class="text-sm font-mono font-semibold text-gray-700 dark:text-gray-200">{entry.targetHex}</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Weights</p>
                <p class="text-xs text-gray-600 dark:text-gray-300">50 / 34 / 16</p>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>

    {#if searchQuery.trim() && filteredEntries.length === 0}
      <p class="mt-8 text-center text-gray-500 dark:text-gray-400 text-lg">No Colorfle puzzles matched your search.</p>
    {/if}

    <!-- Quick Links -->
    <div class="mt-12 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-2xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      <div class="relative z-10">
        <h2 class="text-2xl sm:text-3xl font-bold mb-2">More Colorfle Tools</h2>
        <p class="text-white/80 mb-6">Get today's answer or use the solver to find color combinations.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/colorfle-answer-today" class="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl font-semibold transition-all text-center border border-white/10 hover:border-white/20">
            Today's Answer
          </a>
          <a href="/colorfle-solver" class="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl font-semibold transition-all text-center border border-white/10 hover:border-white/20">
            Colorfle Solver
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
