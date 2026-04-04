<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import { formatPopulation, formatTemperature } from '$lib/countryle';
  import { getCountryleArchive, getCountryleArchiveDates } from '$lib/countryle-data';

  const archive = getCountryleArchive();
  const availableDates = getCountryleArchiveDates();
  let selectedDate = $state(availableDates[0] ?? '');
  const selectedEntry = $derived((selectedDate && archive[selectedDate]) || null);
</script>

<svelte:head>
  <title>Countryle Archive - Daily Country Answers History | WordSolverX</title>
  <meta name="description" content="Browse the Countryle archive by date and review past countries, continents, populations, coordinates, and map links from the saved static dataset." />
  <link rel="canonical" href="https://wordsolver.tech/countryle-archive" />
  <meta property="og:title" content="Countryle Archive - Daily Country Answers History" />
  <meta property="og:description" content="Look up previous Countryle answers with a static archive of countries and date-based puzzle entries." />
  <meta property="og:url" content="https://wordsolver.tech/countryle-archive" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Countryle Archive" />
  <meta name="twitter:description" content="Search the saved Countryle answer archive by date." />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
</svelte:head>

<div class="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <Breadcrumbs />

    <section class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8">
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">Countryle Archive</p>
      <h1 class="mt-3 text-4xl font-black text-gray-900 dark:text-white">Past Countryle Answers</h1>
      <p class="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
        Search the archived Countryle dataset by date and review the saved country details for each puzzle.
      </p>
    </section>

    <section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8">
        <label for="countryle-archive-date" class="block text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Select date</label>
        <input
          id="countryle-archive-date"
          class="mt-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          type="date"
          value={selectedDate}
          min={availableDates[availableDates.length - 1]}
          max={availableDates[0]}
          onchange={(event) => (selectedDate = (event.currentTarget as HTMLInputElement).value)}
        />

        <div class="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-300">
          {availableDates.length} archive entries available.
        </div>

        <div class="mt-6 max-h-[30rem] space-y-3 overflow-y-auto pr-1">
          {#each availableDates.slice(0, 60) as dateKey}
            {@const entry = archive[dateKey]}
            <button
              type="button"
              class={`w-full rounded-2xl border p-4 text-left transition-colors ${selectedDate === dateKey ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30' : 'border-gray-200 hover:border-emerald-300 dark:border-gray-700 dark:hover:border-emerald-700'}`}
              onclick={() => (selectedDate = dateKey)}
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">{entry.country.country}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{entry.date} · #{entry.gameNumber}</p>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400">{entry.country.continent}</span>
              </div>
            </button>
          {/each}
        </div>
      </article>

      <article class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8">
        {#if selectedEntry}
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">Selected puzzle</p>
          <h2 class="mt-3 text-3xl font-black text-gray-900 dark:text-white">{selectedEntry.country.country}</h2>
          <p class="mt-2 text-gray-600 dark:text-gray-300">{selectedEntry.date} · Game #{selectedEntry.gameNumber}</p>

          <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-950"><p class="text-sm text-gray-500 dark:text-gray-400">Continent</p><p class="mt-2 font-bold text-gray-900 dark:text-white">{selectedEntry.country.continent}</p></div>
            <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-950"><p class="text-sm text-gray-500 dark:text-gray-400">Hemisphere</p><p class="mt-2 font-bold text-gray-900 dark:text-white">{selectedEntry.country.hemisphere}</p></div>
            <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-950"><p class="text-sm text-gray-500 dark:text-gray-400">Population</p><p class="mt-2 font-bold text-gray-900 dark:text-white">{formatPopulation(selectedEntry.country.population)}</p></div>
            <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-950"><p class="text-sm text-gray-500 dark:text-gray-400">Surface Area</p><p class="mt-2 font-bold text-gray-900 dark:text-white">{selectedEntry.country.surface.toLocaleString()} km²</p></div>
            <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-950"><p class="text-sm text-gray-500 dark:text-gray-400">Avg. Temperature</p><p class="mt-2 font-bold text-gray-900 dark:text-white">{formatTemperature(selectedEntry.country.avgTemperature)}</p></div>
            <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-950"><p class="text-sm text-gray-500 dark:text-gray-400">Coordinates</p><p class="mt-2 font-bold text-gray-900 dark:text-white">{selectedEntry.country.coordinates}</p></div>
          </div>

          {#if selectedEntry.country.mapsUrl}
            <a href={selectedEntry.country.mapsUrl} target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-300 dark:hover:bg-emerald-950/30">
              View on Google Maps
            </a>
          {/if}
        {/if}
      </article>
    </section>
  </div>
</div>
