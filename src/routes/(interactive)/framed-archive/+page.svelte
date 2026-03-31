<script lang="ts">
  import { VALID_MODES } from '$lib/framed';

  let { data } = $props();
  let selectedMode = $state('classic');
  let searchQuery = $state('');

  type ArchiveEntry = {
    movie: { title: string; year: number | null };
    dateKey: string;
    dayNumber: number;
    label: string;
  };

  const modeEntries = $derived((data.archiveEntriesByMode[selectedMode] ?? []) as ArchiveEntry[]);
  const filteredEntries = $derived.by(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return modeEntries;
    }

    return modeEntries.filter((entry: ArchiveEntry) =>
      [entry.movie.title, entry.dateKey, String(entry.dayNumber), entry.label].join(' ').toLowerCase().includes(query)
    );
  });
</script>

<svelte:head>
  <title>Framed Archive - Recent Movie Answers | WordSolverX</title>
  <meta
    name="description"
    content="Browse recent Framed answers for Classic, One Frame, Poster, and Title Shot."
  />
  <link rel="canonical" href="https://wordsolver.tech/framed-archive" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
  <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
    <header class="mb-10 text-center">
      <h1 class="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
        Framed Archive
      </h1>
      <p class="mx-auto mt-4 max-w-2xl text-base text-gray-500 dark:text-gray-400 sm:text-lg">
        Recent Framed answers sourced from the live movie lists and official challenge APIs.
      </p>
    </header>

    <div class="mb-8 flex flex-wrap justify-center gap-2">
      {#each VALID_MODES as mode}
        <button
          onclick={() => {
            selectedMode = mode;
            searchQuery = '';
          }}
          class="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all {selectedMode === mode
            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/20'
            : 'border border-gray-200 bg-white text-gray-600 hover:border-red-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-red-700'}"
        >
          {data.archiveEntriesByMode[mode]?.[0]?.label ?? mode}
        </button>
      {/each}
    </div>

    <div class="mb-8 rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <input
        bind:value={searchQuery}
        class="w-full rounded-2xl bg-transparent px-5 py-4 text-base text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
        placeholder="Search by movie title, date, or day number..."
        type="text"
      />
    </div>

    <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
      {#if filteredEntries.length === 0}
        <div class="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
          No Framed answers matched that search.
        </div>
      {:else}
        <div class="divide-y divide-gray-100 dark:divide-gray-700">
          {#each filteredEntries as entry}
            <div class="flex items-center justify-between gap-4 px-6 py-4">
              <div class="min-w-0">
                <p class="font-semibold text-gray-900 dark:text-white">{entry.movie.title}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Day #{entry.dayNumber} · {entry.dateKey}
                </p>
              </div>
              {#if entry.movie.year}
                <span class="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {entry.movie.year}
                </span>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
