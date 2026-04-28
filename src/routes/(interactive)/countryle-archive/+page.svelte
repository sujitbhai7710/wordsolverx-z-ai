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
  <link rel="canonical" href="https://wordsolverx.com/countryle-archive" />
  <meta property="og:title" content="Countryle Archive - Daily Country Answers History" />
  <meta property="og:description" content="Look up previous Countryle answers with a static archive of countries and date-based puzzle entries." />
  <meta property="og:url" content="https://wordsolverx.com/countryle-archive" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Countryle Archive" />
  <meta name="twitter:description" content="Search the saved Countryle answer archive by date." />
  <meta name="twitter:image" content="https://wordsolverx.com/wordsolverx.webp" />
</svelte:head>

<div class="min-h-screen py-10">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <Breadcrumbs />

    <section class="rounded-xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">Countryle Archive</p>
      <h1 class="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-50">Past Countryle Answers</h1>
      <p class="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
        Search the archived Countryle dataset by date and review the saved country details for each puzzle.
      </p>
    </section>

    <section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article class="rounded-xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
        <label for="countryle-archive-date" class="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Select date</label>
        <input
          id="countryle-archive-date"
          class="mt-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          type="date"
          value={selectedDate}
          min={availableDates[availableDates.length - 1]}
          max={availableDates[0]}
          onchange={(event) => (selectedDate = (event.currentTarget as HTMLInputElement).value)}
        />

        <div class="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-400">
          {availableDates.length} archive entries available.
        </div>

        <div class="mt-6 max-h-[30rem] space-y-3 overflow-y-auto pr-1">
          {#each availableDates.slice(0, 60) as dateKey}
            {@const entry = archive[dateKey]}
            <button
              type="button"
              class={`w-full rounded-lg border p-4 text-left transition-colors ${selectedDate === dateKey ? 'border-teal-500 bg-teal-50 dark:border-teal-600 dark:bg-teal-950/30' : 'border-slate-200 hover:border-teal-300 dark:border-slate-700 dark:hover:border-teal-700'}`}
              onclick={() => (selectedDate = dateKey)}
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="font-semibold text-slate-900 dark:text-slate-50">{entry.country.country}</p>
                  <p class="text-sm text-slate-600 dark:text-slate-300">{entry.date} · #{entry.gameNumber}</p>
                </div>
                <span class="text-sm text-slate-500 dark:text-slate-400">{entry.country.continent}</span>
              </div>
            </button>
          {/each}
        </div>
      </article>

      <article class="rounded-xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
        {#if selectedEntry}
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">Selected puzzle</p>
          <h2 class="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50">{selectedEntry.country.country}</h2>
          <p class="mt-2 text-slate-600 dark:text-slate-300">{selectedEntry.date} · Game #{selectedEntry.gameNumber}</p>

          <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-900"><p class="text-sm text-slate-500 dark:text-slate-400">Continent</p><p class="mt-2 font-bold text-slate-900 dark:text-slate-50">{selectedEntry.country.continent}</p></div>
            <div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-900"><p class="text-sm text-slate-500 dark:text-slate-400">Hemisphere</p><p class="mt-2 font-bold text-slate-900 dark:text-slate-50">{selectedEntry.country.hemisphere}</p></div>
            <div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-900"><p class="text-sm text-slate-500 dark:text-slate-400">Population</p><p class="mt-2 font-bold text-slate-900 dark:text-slate-50">{formatPopulation(selectedEntry.country.population)}</p></div>
            <div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-900"><p class="text-sm text-slate-500 dark:text-slate-400">Surface Area</p><p class="mt-2 font-bold text-slate-900 dark:text-slate-50">{selectedEntry.country.surface.toLocaleString()} km²</p></div>
            <div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-900"><p class="text-sm text-slate-500 dark:text-slate-400">Avg. Temperature</p><p class="mt-2 font-bold text-slate-900 dark:text-slate-50">{formatTemperature(selectedEntry.country.avgTemperature)}</p></div>
            <div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-900"><p class="text-sm text-slate-500 dark:text-slate-400">Coordinates</p><p class="mt-2 font-bold text-slate-900 dark:text-slate-50">{selectedEntry.country.coordinates}</p></div>
          </div>

          {#if selectedEntry.country.mapsUrl}
            <a href={selectedEntry.country.mapsUrl} target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center rounded-lg bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-700 hover:bg-teal-100 dark:bg-teal-950/20 dark:text-teal-300 dark:hover:bg-teal-950/30">
              View on Google Maps
            </a>
          {/if}
        {/if}
      </article>
    </section>

    <!-- SEO Article Section -->
    <article class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Countryle Archive Matters</h2>
      <div class="prose prose-slate dark:prose-invert max-w-none">
        <p>
          The Countryle archive is an indispensable resource for geography enthusiasts and daily puzzle players who want to deepen their knowledge of world countries. Each entry in the archive contains not just the country name, but rich geographical data including continent, hemisphere, population, surface area, average temperature, and precise coordinates. This makes the archive far more than a simple answer list; it is a comprehensive geographical reference tool that pairs perfectly with the daily puzzle experience.
        </p>
        <p>
          Studying the archive reveals patterns in how Countryle selects its daily answers. The game draws from all recognized countries and territories, giving players exposure to the full diversity of the world's nations. By reviewing past answers, players can identify which continents and regions appear most frequently, learn about lesser-known countries they might not encounter in everyday life, and build a mental map of global geography that improves both their puzzle performance and their real-world knowledge.
        </p>
        <p>
          The archive is particularly valuable for students and educators. Geography teachers can use the archive to create daily warm-up exercises, quiz students on country facts, or design lessons around the diverse countries that appear in the puzzle rotation. The detailed metadata for each entry, including population figures and temperature data, provides ready-made lesson material that connects puzzle-solving with curriculum objectives.
        </p>

        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Countryle Answers Work</h3>
        <p>
          Countryle challenges players to guess a mystery country based on geographical clues provided after each guess. After each attempt, the game reveals how far the guessed country is from the answer in terms of distance, direction, and sometimes additional metrics like population comparison. This feedback system allows players to narrow down the possibilities geographically, using their knowledge of world geography to triangulate the correct answer.
        </p>
        <p>
          The answer pool includes all internationally recognized countries and some territories. Each daily puzzle selects one country from this pool, and the archive records the complete dataset for each entry including the country name, continent, hemisphere classification, population, surface area, average temperature, and GPS coordinates. This deterministic selection process means the archive is a complete and reliable record of every past puzzle solution.
        </p>
        <p>
          The game operates on a daily cycle with a fixed mapping between dates and answers. Every player worldwide receives the same country on the same date, and the archive preserves this shared experience. The geographic metadata stored with each entry makes the archive uniquely informative compared to simpler puzzle answer databases.
        </p>

        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Notable Past Countryle Answers</h3>
        <p>
          The Countryle archive features a wide range of countries spanning every continent and region of the world. Particularly memorable entries often include smaller or lesser-known nations that surprise players who are more familiar with major world countries. Island nations, landlocked countries, and nations with unique geographical characteristics tend to generate the most interesting puzzle experiences and the most educational archive entries.
        </p>
        <p>
          Patterns in the archive show that the game provides balanced coverage across continents, ensuring players encounter countries from Africa, Asia, Europe, North America, South America, and Oceania over time. This geographic diversity is one of Countryle's greatest strengths as a learning tool, and the archive makes this diversity visible and explorable.
        </p>

        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How to Use the Countryle Archive</h3>
        <p>
          Use the date picker and country list above to navigate the archive. Select any past date to view the complete country profile for that day's puzzle, including all geographical metadata. The Google Maps link on each entry allows you to explore the country visually, deepening your geographic understanding of each answer.
        </p>

        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How does Countryle calculate distance between guesses?</h4>
        <p>
          Countryle uses the great-circle distance between the capital or geographic center of the guessed country and the target country. The direction clue helps players understand which way to "move" their next guess on the map.
        </p>

        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the archive include all geographical metadata?</h4>
        <p>
          Yes. Each archive entry includes the country name, continent, hemisphere, population, surface area, average temperature, coordinates, and a direct Google Maps link. This makes the archive a comprehensive geographical reference.
        </p>

        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can the archive help me improve at geography?</h4>
        <p>
          Absolutely. Regular review of past answers, especially the geographical metadata, helps build mental models of world geography. Paying attention to population figures, surface areas, and temperature data reinforces factual knowledge that translates directly to improved puzzle performance.
        </p>

        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Is the Countryle archive different from the Worldle or Globle archives?</h4>
        <p>
          Yes. While all three games involve guessing countries, they use different clue mechanisms and display different metadata. The Countryle archive specifically preserves the distance-based clue system and detailed statistics unique to Countryle's gameplay format.
        </p>
      </div>
    </article>
  </div>
</div>
