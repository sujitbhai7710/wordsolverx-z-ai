<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  let { data } = $props();
  let searchQuery = $state('');

  const filteredEntries = $derived.by(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return data.archiveEntries;
    }

    return data.archiveEntries.filter((entry) =>
      [entry.dateKey, entry.displayDate, entry.country.country, entry.country.continent, entry.country.hemisphere]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  });
</script>

<svelte:head>
  <title>Countryle Archive - Recent Country Answers | WordSolverX</title>
  <meta
    name="description"
    content="Browse recent Countryle answers with country details, clue properties, and direct map links."
  />
  <link rel="canonical" href="https://wordsolver.tech/countryle-archive" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
    <Breadcrumbs />

    <section class="mt-6 rounded-[2rem] bg-gradient-to-br from-emerald-700 via-teal-800 to-cyan-900 px-6 py-8 text-white shadow-2xl shadow-emerald-500/20 sm:px-8 sm:py-10">
      <h1 class="text-4xl font-black tracking-tight sm:text-5xl">Countryle Archive</h1>
      <p class="mt-4 max-w-3xl text-base leading-7 text-emerald-50/90 sm:text-lg">
        Recent Countryle answers rebuilt from the same daily source used for the live answer page.
      </p>
    </section>

    <div class="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300" for="archive-search">Search the archive</label>
      <input
        id="archive-search"
        bind:value={searchQuery}
        class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        placeholder="Search by country name, continent, or date..."
        type="text"
      />
    </div>

    <div class="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
              <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Date</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Country</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Continent</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Hemisphere</th>
              <th class="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Population</th>
              <th class="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Surface</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-600 dark:text-gray-300">Map</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredEntries as entry}
              <tr class="border-b border-slate-100 transition hover:bg-emerald-50/50 dark:border-slate-700/50 dark:hover:bg-emerald-900/10">
                <td class="whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white">{entry.displayDate}</td>
                <td class="whitespace-nowrap px-4 py-3 font-semibold text-emerald-700 dark:text-emerald-400">{entry.country.country}</td>
                <td class="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">{entry.country.continent}</td>
                <td class="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">{entry.country.hemisphere}</td>
                <td class="whitespace-nowrap px-4 py-3 text-right text-gray-600 dark:text-gray-300">{entry.country.population.toLocaleString()}</td>
                <td class="whitespace-nowrap px-4 py-3 text-right text-gray-600 dark:text-gray-300">{entry.country.surface.toLocaleString()} km²</td>
                <td class="px-4 py-3 text-center">
                  <a
                    class="inline-flex items-center justify-center rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300"
                    href={entry.country.mapsUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    View
                  </a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      {#if filteredEntries.length === 0}
        <div class="p-8 text-center">
          <p class="text-lg font-semibold text-gray-500 dark:text-gray-400">No matching entries found.</p>
        </div>
      {/if}
    </div>
  </div>
</main>
