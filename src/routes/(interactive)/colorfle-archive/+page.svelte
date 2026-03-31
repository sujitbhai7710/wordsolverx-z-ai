<script lang="ts">
  let { data } = $props();
  let searchQuery = $state('');

  const filteredEntries = $derived.by(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return data.archiveEntries;
    }

    return data.archiveEntries.filter((entry) =>
      [entry.puzzleNumber.toString(), entry.targetHex, ...entry.colorNames, ...entry.colorHexes]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  });
</script>

<svelte:head>
  <title>Colorfle Archive - Past Color Mixing Puzzle Answers | WordSolverX</title>
  <meta
    name="description"
    content="Browse recent Colorfle puzzle answers with target colors, source colors, and hex codes."
  />
  <link rel="canonical" href="https://wordsolver.tech/colorfle-archive" />
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <section class="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-900 pb-20 pt-16">
    <div class="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
      <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5">
        <span class="text-sm font-medium text-white/90">{data.archiveEntries.length} puzzles available</span>
      </div>
      <h1 class="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
        Colorfle Archive
      </h1>
      <p class="mx-auto mt-4 max-w-2xl text-lg text-white/80">
        Recent Colorfle answers built from the same deterministic color-mixing logic used on the daily page.
      </p>
    </div>
  </section>

  <div class="relative z-20 mx-auto max-w-5xl -mt-4 px-4 pb-12 sm:px-6 lg:px-8">
    <div class="mb-8 overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-lg dark:border-purple-800 dark:bg-gray-800">
      <input
        bind:value={searchQuery}
        class="w-full bg-transparent px-5 py-4 text-base text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
        placeholder="Search by puzzle number, hex code, or color name..."
        type="search"
      />
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each filteredEntries as entry}
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-4 flex items-center justify-between">
            <span class="text-sm font-bold text-purple-600 dark:text-purple-400">#{entry.puzzleNumber}</span>
            <div
              class="h-10 w-10 rounded-lg border border-black/10 shadow-inner"
              style="background-color: {entry.targetHex}"
            ></div>
          </div>

          <div class="mb-4 flex gap-2">
            {#each entry.colorHexes as hex, i}
              <div class="flex-1">
                <div
                  class="aspect-square w-full rounded-lg border border-black/5 shadow-inner"
                  style="background-color: {hex}"
                  title={entry.colorNames[i]}
                ></div>
                <p class="mt-1 truncate text-center text-[10px] text-gray-500 dark:text-gray-400">{entry.colorNames[i]}</p>
              </div>
            {/each}
          </div>

          <div class="border-t border-gray-100 pt-3 dark:border-gray-700">
            <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Target</p>
            <p class="font-mono text-sm font-semibold text-gray-700 dark:text-gray-200">{entry.targetHex}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
