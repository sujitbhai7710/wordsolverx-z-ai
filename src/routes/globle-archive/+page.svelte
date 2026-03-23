<script lang="ts">
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import GlobleCluesSection from '$lib/components/GlobleCluesSection.svelte';

  let { data } = $props();

  const startDate = new Date(2022, 0, 1); // January 1, 2022
</script>

<svelte:head>
  <title>Globle Archive - Complete Country Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Globle country answers. Calendar view with search and direct links to every past geography puzzle solution." />
  <link rel="canonical" href="https://wordsolver.tech/globle-archive" />
  <meta property="og:title" content="Globle Archive - All Past Country Answers" />
  <meta property="og:description" content="Complete history of every Globle country answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolver.tech/globle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Globle Archive",
    "description": "Complete archive of all Globle daily country answers.",
    "url": "https://wordsolver.tech/globle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolver.tech" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Globle"
  gameColor="sky"
  gameIcon="🌍"
  {startDate}
  basePath="/globle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Globle daily country answer. Find any past geography puzzle solution."
/>

<section id="archive-answer" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedGloble}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-gray-900 dark:text-white">
          Globle answer for {data.selectedGloble.formattedDate}
        </h2>
      </div>
      <GlobleCluesSection country={data.selectedGloble.country} date={data.selectedGloble.formattedDate}>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <div class="p-8 text-center">
            <div class="mb-6">
              <span class="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium tracking-wide text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">ANSWER</span>
            </div>
            <h3 class="mb-8 text-5xl font-black tracking-tight text-slate-900 dark:text-white">{data.selectedGloble.country.name}</h3>
            <div class="grid gap-4 text-left md:grid-cols-2">
              <div class="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-slate-700 dark:to-slate-600">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Continent</div>
                <div class="text-lg font-bold text-slate-900 dark:text-white">{data.selectedGloble.country.continent}</div>
              </div>
              <div class="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-4 dark:from-slate-700 dark:to-slate-600">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Subregion</div>
                <div class="text-lg font-bold text-slate-900 dark:text-white">{data.selectedGloble.country.subregion}</div>
              </div>
              <div class="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-4 dark:from-slate-700 dark:to-slate-600">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Country Code</div>
                <div class="text-lg font-bold text-slate-900 dark:text-white">{data.selectedGloble.country.code}</div>
              </div>
              <div class="rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 p-4 dark:from-slate-700 dark:to-slate-600">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Coordinates</div>
                <div class="text-lg font-bold text-slate-900 dark:text-white">
                  {data.selectedGloble.country.latitude.toFixed(2)}°, {data.selectedGloble.country.longitude.toFixed(2)}°
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlobleCluesSection>
    </div>
  {:else}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Choose a country date from the archive</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        The selected Globle answer and clue section will appear here without sending users to a thin dated page.
      </p>
    </div>
  {/if}
</section>
