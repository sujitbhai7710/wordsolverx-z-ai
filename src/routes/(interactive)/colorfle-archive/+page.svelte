<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import { getColorfleArchiveEntries } from '$lib/colorfle';

  const allEntries = getColorfleArchiveEntries(365);
  let days = $state(30);
  let selectedDate = $state(allEntries[0]?.date ?? '');

  const visibleEntries = $derived(allEntries.slice(0, days));
  const selectedEntry = $derived(
    allEntries.find((entry) => entry.date === selectedDate) ?? visibleEntries[0] ?? null
  );
</script>

<svelte:head>
  <title>Colorfle Archive - Daily Color Answers History | WordSolverX</title>
  <meta name="description" content="Browse the Colorfle archive with recent puzzle dates, source colors, and final target hex results for past Colorfle games." />
  <link rel="canonical" href="https://wordsolver.tech/colorfle-archive" />
  <meta property="og:title" content="Colorfle Archive - Daily Color Answers History" />
  <meta property="og:description" content="Check past Colorfle answer colors and target hex codes with a static date archive." />
  <meta property="og:url" content="https://wordsolver.tech/colorfle-archive" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Colorfle Archive" />
  <meta name="twitter:description" content="Past Colorfle puzzle answers with source colors and final target hex values." />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Colorfle Archive',
    description: 'Archive of previous Colorfle daily color answers.',
    url: 'https://wordsolver.tech/colorfle-archive'
  })}</script>`}
</svelte:head>

<div class="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <Breadcrumbs />

    <section class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">Colorfle Archive</p>
          <h1 class="mt-3 text-4xl font-black text-gray-900 dark:text-white">Past Colorfle Answers</h1>
          <p class="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
            Browse the last {allEntries.length} archived Colorfle puzzles. Pick a date to inspect the exact source colors and final target hex.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          {#each [30, 90, 365] as option}
            <button
              type="button"
              class={`rounded-xl px-4 py-2 text-sm font-semibold ${days === option ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'}`}
              onclick={() => (days = option)}
            >
              Last {option} days
            </button>
          {/each}
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8">
        <label for="colorfle-archive-date" class="block text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Select date</label>
        <input
          id="colorfle-archive-date"
          class="mt-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          type="date"
          value={selectedDate}
          min={allEntries[allEntries.length - 1]?.date}
          max={allEntries[0]?.date}
          onchange={(event) => (selectedDate = (event.currentTarget as HTMLInputElement).value)}
        />

        <div class="mt-6 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
          {#each visibleEntries as entry}
            <button
              type="button"
              class={`w-full rounded-2xl border p-4 text-left transition-colors ${selectedEntry?.date === entry.date ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/30' : 'border-gray-200 hover:border-indigo-300 dark:border-gray-700 dark:hover:border-indigo-700'}`}
              onclick={() => (selectedDate = entry.date)}
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">#{entry.puzzleNumber}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{entry.date}</p>
                </div>
                <div class="flex items-center gap-2">
                  {#each entry.colors as color}
                    <span class="h-7 w-7 rounded-lg border border-gray-200 dark:border-gray-700" style={`background:${color.hex}`}></span>
                  {/each}
                </div>
              </div>
            </button>
          {/each}
        </div>
      </article>

      <article class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8">
        {#if selectedEntry}
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">Selected puzzle</p>
          <h2 class="mt-3 text-3xl font-black text-gray-900 dark:text-white">Colorfle #{selectedEntry.puzzleNumber}</h2>
          <p class="mt-2 text-gray-600 dark:text-gray-300">{selectedEntry.date}</p>

          <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {#each selectedEntry.colors as color}
              <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div class="h-28" style={`background:${color.hex}`}></div>
                <div class="p-4">
                  <p class="font-semibold text-gray-900 dark:text-white">{color.name}</p>
                  <p class="mt-1 font-mono text-sm text-gray-600 dark:text-gray-300">{color.hex}</p>
                </div>
              </div>
            {/each}
          </div>

          <div class="mt-8 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="h-52" style={`background:${selectedEntry.targetColor.hex}`}></div>
            <div class="p-5 bg-white dark:bg-gray-900">
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Target Hex</p>
              <p class="mt-2 text-2xl font-black text-gray-900 dark:text-white">{selectedEntry.targetColor.hex}</p>
            </div>
          </div>
        {/if}
      </article>
    </section>
  </div>
</div>
