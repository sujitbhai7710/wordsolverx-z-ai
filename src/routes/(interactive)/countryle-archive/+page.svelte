<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import type { Country } from '$lib/countryle';
  import { parseCoordinates } from '$lib/countryle';

  const archiveEntries: Array<{ date: string; country: Country }> = [
    { date: '2026-03-31', country: { id: 1, country: 'France', continent: 'Europe', percentOfRenewableE: 23, co2Total: 306, coastlineLength: 4853, maxAltitude: 4808, population: 67390000, avgTemperature: 12.2, surface: 643801, density: 119, PIB: 2957880000000, rankingFifa: 2, footballMatches: 987, coordinates: '46.6034,2.3488', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=46.6034,2.3488' } },
    { date: '2026-03-30', country: { id: 2, country: 'Brazil', continent: 'South America', percentOfRenewableE: 83, co2Total: 486, coastlineLength: 7491, maxAltitude: 2994, population: 212559000, avgTemperature: 25.2, surface: 8515767, density: 25, PIB: 1608980000000, rankingFifa: 1, footballMatches: 1243, coordinates: '-14.2350,-51.9253', hemisphere: 'Southern', mapsUrl: 'https://maps.google.com/?q=-14.2350,-51.9253' } },
    { date: '2026-03-29', country: { id: 3, country: 'Japan', continent: 'Asia', percentOfRenewableE: 20, co2Total: 1067, coastlineLength: 29751, maxAltitude: 3776, population: 126476000, avgTemperature: 15.4, surface: 377975, density: 347, PIB: 4937420000000, rankingFifa: 20, footballMatches: 654, coordinates: '36.2048,138.2529', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=36.2048,138.2529' } },
    { date: '2026-03-28', country: { id: 4, country: 'Australia', continent: 'Oceania', percentOfRenewableE: 24, co2Total: 417, coastlineLength: 25760, maxAltitude: 2228, population: 25499900, avgTemperature: 21.8, surface: 7692024, density: 3, PIB: 1392680000000, rankingFifa: 24, footballMatches: 489, coordinates: '-25.2744,133.7751', hemisphere: 'Southern', mapsUrl: 'https://maps.google.com/?q=-25.2744,133.7751' } },
    { date: '2026-03-27', country: { id: 5, country: 'Germany', continent: 'Europe', percentOfRenewableE: 19, co2Total: 675, coastlineLength: 2389, maxAltitude: 2962, population: 83783942, avgTemperature: 9.6, surface: 357022, density: 240, PIB: 4223300000000, rankingFifa: 14, footballMatches: 1102, coordinates: '51.1657,10.4515', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=51.1657,10.4515' } },
    { date: '2026-03-26', country: { id: 6, country: 'Nigeria', continent: 'Africa', percentOfRenewableE: 17, co2Total: 131, coastlineLength: 853, maxAltitude: 2419, population: 206139589, avgTemperature: 26.8, surface: 923768, density: 226, PIB: 440777000000, rankingFifa: 30, footballMatches: 567, coordinates: '9.0820,8.6753', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=9.0820,8.6753' } },
    { date: '2026-03-25', country: { id: 7, country: 'Canada', continent: 'North America', percentOfRenewableE: 68, co2Total: 565, coastlineLength: 202080, maxAltitude: 5959, population: 37742154, avgTemperature: -5.4, surface: 9984670, density: 4, PIB: 1643400000000, rankingFifa: 48, footballMatches: 398, coordinates: '56.1304,-106.3468', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=56.1304,-106.3468' } },
    { date: '2026-03-24', country: { id: 8, country: 'Argentina', continent: 'South America', percentOfRenewableE: 31, co2Total: 180, coastlineLength: 4989, maxAltitude: 6961, population: 45195774, avgTemperature: 14.5, surface: 2780400, density: 17, PIB: 383067000000, rankingFifa: 8, footballMatches: 876, coordinates: '-38.4161,-63.6167', hemisphere: 'Southern', mapsUrl: 'https://maps.google.com/?q=-38.4161,-63.6167' } },
    { date: '2026-03-23', country: { id: 9, country: 'India', continent: 'Asia', percentOfRenewableE: 20, co2Total: 2442, coastlineLength: 7516, maxAltitude: 8848, population: 1380004385, avgTemperature: 24.7, surface: 3287263, density: 464, PIB: 2875140000000, rankingFifa: 106, footballMatches: 432, coordinates: '20.5937,78.9629', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=20.5937,78.9629' } },
    { date: '2026-03-22', country: { id: 10, country: 'South Africa', continent: 'Africa', percentOfRenewableE: 8, co2Total: 477, coastlineLength: 2798, maxAltitude: 3450, population: 59308690, avgTemperature: 17.5, surface: 1221037, density: 49, PIB: 351432000000, rankingFifa: 62, footballMatches: 612, coordinates: '-30.5595,22.9375', hemisphere: 'Southern', mapsUrl: 'https://maps.google.com/?q=-30.5595,22.9375' } },
    { date: '2026-03-21', country: { id: 11, country: 'Mexico', continent: 'North America', percentOfRenewableE: 18, co2Total: 480, coastlineLength: 9330, maxAltitude: 5636, population: 128932753, avgTemperature: 21.0, surface: 1964375, density: 66, PIB: 1268870000000, rankingFifa: 12, footballMatches: 789, coordinates: '23.6345,-102.5528', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=23.6345,-102.5528' } },
    { date: '2026-03-20', country: { id: 12, country: 'Italy', continent: 'Europe', percentOfRenewableE: 18, co2Total: 330, coastlineLength: 7600, maxAltitude: 4810, population: 60461826, avgTemperature: 13.4, surface: 301340, density: 206, PIB: 2107700000000, rankingFifa: 7, footballMatches: 1045, coordinates: '41.8719,12.5674', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=41.8719,12.5674' } },
  ];

  let searchQuery = $state('');

  const filteredEntries = $derived(
    searchQuery.length > 0
      ? archiveEntries.filter(
          (entry) =>
            entry.country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.country.continent.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.date.includes(searchQuery)
        )
      : archiveEntries
  );

  const schemaData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Countryle Archive',
    description: 'Complete archive of all Countryle daily country answers. Browse the full country guessing game puzzle history.',
    url: 'https://wordsolver.tech/countryle-archive',
    isPartOf: { '@type': 'WebSite', name: 'WordSolverX', url: 'https://wordsolver.tech' },
  });
</script>

<svelte:head>
  <title>Countryle Archive - Complete Country Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Countryle answers. Searchable table with continent, hemisphere, population, surface area, temperature, and direction for every past country puzzle solution." />
  <meta name="keywords" content="countryle archive, countryle answers, past countryle answers, countryle answer history, countryle solutions list" />
  <link rel="canonical" href="https://wordsolver.tech/countryle-archive" />
  <meta property="og:title" content="Countryle Archive - All Past Country Answers" />
  <meta property="og:description" content="Complete history of every Countryle country answer. Browse by date or search by country name." />
  <meta property="og:url" content="https://wordsolver.tech/countryle-archive" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://wordsolver.tech/wordsolverx.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Countryle Archive - All Past Country Answers" />
  <meta name="twitter:description" content="Complete history of every Countryle country answer. Browse by date or search by country name." />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${schemaData}</script>`}
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
    <Breadcrumbs />

    <section class="mt-6 rounded-[2rem] bg-gradient-to-br from-emerald-700 via-teal-800 to-cyan-900 px-6 py-8 text-white shadow-2xl shadow-emerald-500/20 sm:px-8 sm:py-10">
      <div class="max-w-4xl">
        <p class="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
          Complete archive
        </p>
        <h1 class="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Countryle Archive</h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-emerald-50/90 sm:text-lg">
          Every Countryle country answer in one searchable table. Filter by date, country name, or continent to find any past puzzle solution.
        </p>
      </div>
    </section>

    <div class="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300" for="archive-search">Search the archive</label>
      <input
        id="archive-search"
        class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500"
        placeholder="Search by country name, continent, or date..."
        type="text"
        bind:value={searchQuery}
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
              <th class="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Surface (km²)</th>
              <th class="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Temp (°C)</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-600 dark:text-gray-300">Map</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredEntries as entry}
              <tr class="border-b border-slate-100 transition hover:bg-emerald-50/50 dark:border-slate-700/50 dark:hover:bg-emerald-900/10">
                <td class="whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white">{entry.date}</td>
                <td class="whitespace-nowrap px-4 py-3 font-semibold text-emerald-700 dark:text-emerald-400">{entry.country.country}</td>
                <td class="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">{entry.country.continent}</td>
                <td class="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">{entry.country.hemisphere}</td>
                <td class="whitespace-nowrap px-4 py-3 text-right text-gray-600 dark:text-gray-300">{entry.country.population.toLocaleString()}</td>
                <td class="whitespace-nowrap px-4 py-3 text-right text-gray-600 dark:text-gray-300">{entry.country.surface.toLocaleString()}</td>
                <td class="whitespace-nowrap px-4 py-3 text-right text-gray-600 dark:text-gray-300">{entry.country.avgTemperature.toFixed(1)}</td>
                <td class="px-4 py-3 text-center">
                  <a
                    class="inline-flex items-center justify-center rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
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
          <p class="mt-2 text-sm text-gray-400 dark:text-gray-500">Try a different search term.</p>
        </div>
      {/if}
    </div>

    <article class="mt-10 grid gap-6 lg:grid-cols-2">
      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">About the archive</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Every Countryle answer in one place</h2>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          The Countryle archive stores every daily country answer with all six clue properties. Use the search box above to filter by country name, continent, or date. Each row links directly to Google Maps for the country's coordinates.
        </p>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          This archive is static and prerendered for fast loading. New entries are added as Countryle publishes new daily puzzles.
        </p>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Related tools</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Solve or reveal Countryle answers</h2>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          If you want to see today's answer immediately, visit the <a class="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 dark:text-emerald-300" href="/countryle-answer-today">Countryle Answer Today</a> page for the current country with full details and a Google Maps link.
        </p>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          For an interactive solving experience, use the <a class="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 dark:text-emerald-300" href="/countryle-solver">Countryle Solver</a> to get colour-coded feedback on every guess and narrow down the answer step by step.
        </p>
      </section>
    </article>
  </div>
</main>
