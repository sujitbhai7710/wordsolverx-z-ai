<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import {
    calculateDirection,
    directionLabels,
    directionOptions,
    filterCountriesByHints,
    formatPopulation,
    formatTemperature,
    getAllCountries,
    type CountryData,
    type CountryHint,
    type DiffType,
    type DirectionType
  } from '$lib/countryle';

  const countries = getAllCountries();

  let searchTerm = $state('');
  let selectedCountry = $state<CountryData | null>(null);
  let hemisphereDiff = $state<DiffType>('EQUAL');
  let continentHit = $state(true);
  let avgTemperatureDiff = $state<DiffType>('EQUAL');
  let populationDiff = $state<DiffType>('EQUAL');
  let coordinatesDiff = $state<DirectionType>('N');
  let hints = $state<CountryHint[]>([]);

  const countryMatches = $derived(
    searchTerm.trim().length === 0
      ? []
      : countries
          .filter(
            (country) =>
              country.country.toLowerCase().includes(searchTerm.toLowerCase()) &&
              !hints.some((hint) => hint.country.id === country.id)
          )
          .slice(0, 8)
  );

  const filteredResults = $derived(filterCountriesByHints(countries, hints));

  const faqs = [
    {
      question: 'How do I use the Countryle solver?',
      answer: 'Pick the country you guessed in the real game, then enter the exact feedback for hemisphere, continent, temperature, population, and compass direction. Each clue reduces the matching countries.'
    },
    {
      question: 'Does the Countryle solver use the same clue logic?',
      answer: 'Yes. The filtering logic uses the same comparison rules as the source project, including the direction tolerance and percentage-based population thresholds.'
    },
    {
      question: 'Can I solve old Countryle puzzles too?',
      answer: 'Yes. The solver works for any Countryle date as long as you enter the clue feedback from that puzzle.'
    }
  ];

  function selectCountry(country: CountryData) {
    selectedCountry = country;
    searchTerm = country.country;
  }

  function addHint() {
    if (!selectedCountry) return;

    hints = [
      ...hints,
      {
        id: `${selectedCountry.id}-${Date.now()}`,
        country: selectedCountry,
        hemisphereDiff,
        continentHit,
        avgTemperatureDiff,
        populationDiff,
        coordinatesDiff
      }
    ];

    searchTerm = '';
    selectedCountry = null;
    hemisphereDiff = 'EQUAL';
    continentHit = true;
    avgTemperatureDiff = 'EQUAL';
    populationDiff = 'EQUAL';
    coordinatesDiff = 'N';
  }

  function removeHint(id: string) {
    hints = hints.filter((hint) => hint.id !== id);
  }

  function resetSolver() {
    searchTerm = '';
    selectedCountry = null;
    hints = [];
    hemisphereDiff = 'EQUAL';
    continentHit = true;
    avgTemperatureDiff = 'EQUAL';
    populationDiff = 'EQUAL';
    coordinatesDiff = 'N';
  }
</script>

<svelte:head>
  <title>Countryle Solver - Free Country Clue Helper | WordSolverX</title>
  <meta name="description" content="Use the Countryle solver to filter countries by continent, hemisphere, temperature, population, and direction clues from the daily Countryle game." />
  <meta name="keywords" content="countryle solver, countryle helper, countryle country solver, countryle clues" />
  <link rel="canonical" href="https://wordsolver.tech/countryle-solver" />
  <meta property="og:title" content="Countryle Solver - Free Country Clue Helper" />
  <meta property="og:description" content="Filter countries by Countryle clue feedback and narrow the correct answer quickly." />
  <meta property="og:url" content="https://wordsolver.tech/countryle-solver" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Countryle Solver" />
  <meta name="twitter:description" content="A static Countryle solver with exact clue filtering and ranked matches." />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
</svelte:head>

<div class="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <Breadcrumbs />

    <section class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">Countryle Solver</p>
          <h1 class="mt-3 text-4xl font-black text-gray-900 dark:text-white">Filter Countryle Countries by Clues</h1>
          <p class="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
            Enter the exact feedback from your Countryle guess and this solver will rank the matching countries using the same clue logic as the source project.
          </p>
        </div>
        <button type="button" class="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800" onclick={resetSolver}>Reset</button>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <article class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8 space-y-5">
        <div>
          <label for="countryle-guess-country" class="block text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Guessed country</label>
          <input id="countryle-guess-country" class="mt-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white" bind:value={searchTerm} placeholder="Type a country name..." />
          {#if countryMatches.length > 0 && !selectedCountry}
            <div class="mt-3 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {#each countryMatches as country}
                <button type="button" class="w-full border-b border-gray-200 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 last:border-b-0 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800" onclick={() => selectCountry(country)}>
                  <span class="font-semibold">{country.country}</span>
                  <span class="ml-2 text-gray-500 dark:text-gray-400">{country.continent}</span>
                </button>
              {/each}
            </div>
          {/if}
        </div>

        {#if selectedCountry}
          <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-950">
            <p class="font-semibold text-gray-900 dark:text-white">Selected: {selectedCountry.country}</p>
            <div class="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
              <p>Continent: {selectedCountry.continent}</p>
              <p>Hemisphere: {selectedCountry.hemisphere}</p>
              <p>Population: {formatPopulation(selectedCountry.population)}</p>
              <p>Temperature: {formatTemperature(selectedCountry.avgTemperature)}</p>
            </div>
          </div>
        {/if}

        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">Hemisphere</p>
            <div class="mt-2 flex gap-2">
              <button type="button" class={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${hemisphereDiff === 'EQUAL' ? 'bg-emerald-600 text-white' : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200'}`} onclick={() => (hemisphereDiff = 'EQUAL')}>Same</button>
              <button type="button" class={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${hemisphereDiff === 'DIFFERENT' ? 'bg-rose-600 text-white' : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200'}`} onclick={() => (hemisphereDiff = 'DIFFERENT')}>Different</button>
            </div>
          </div>

          <div>
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">Continent</p>
            <div class="mt-2 flex gap-2">
              <button type="button" class={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${continentHit ? 'bg-emerald-600 text-white' : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200'}`} onclick={() => (continentHit = true)}>Same</button>
              <button type="button" class={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${!continentHit ? 'bg-rose-600 text-white' : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200'}`} onclick={() => (continentHit = false)}>Different</button>
            </div>
          </div>

          <div>
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">Temperature</p>
            <select class="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white" bind:value={avgTemperatureDiff}>
              <option value="MORE">Hotter</option>
              <option value="LITTLE_MORE">A bit hotter</option>
              <option value="EQUAL">Same</option>
              <option value="LITTLE_LESS">A bit colder</option>
              <option value="LESS">Colder</option>
            </select>
          </div>

          <div>
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">Population</p>
            <select class="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white" bind:value={populationDiff}>
              <option value="MORE">Larger</option>
              <option value="LITTLE_MORE">A bit larger</option>
              <option value="EQUAL">Same</option>
              <option value="LITTLE_LESS">A bit smaller</option>
              <option value="LESS">Smaller</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">Direction to target</p>
            <div class="mt-2 grid grid-cols-4 gap-2 md:grid-cols-8">
              {#each directionOptions as direction}
                <button type="button" class={`rounded-xl px-3 py-2 text-sm font-semibold ${coordinatesDiff === direction ? 'bg-sky-600 text-white' : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200'}`} onclick={() => (coordinatesDiff = direction)}>{directionLabels[direction]}</button>
              {/each}
            </div>
          </div>
        </div>

        <button type="button" class="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50" onclick={addHint} disabled={!selectedCountry}>Add Clue</button>
      </article>

      <article class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8 space-y-6">
        <div>
          <h2 class="text-2xl font-black text-gray-900 dark:text-white">Active Clues</h2>
          <div class="mt-4 space-y-3">
            {#if hints.length === 0}
              <p class="text-gray-600 dark:text-gray-300">Add your first Countryle clue to begin filtering.</p>
            {:else}
              {#each hints as hint}
                <div class="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white">{hint.country.country}</p>
                      <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Hemisphere {hint.hemisphereDiff} · Continent {hint.continentHit ? 'same' : 'different'} · Direction {hint.coordinatesDiff}
                      </p>
                    </div>
                    <button type="button" class="text-sm font-semibold text-rose-600 dark:text-rose-300" onclick={() => removeHint(hint.id)}>Remove</button>
                  </div>
                </div>
              {/each}
            {/if}
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-black text-gray-900 dark:text-white">Possible Answers</h2>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{filteredResults.length} matches</p>
          <div class="mt-4 max-h-[32rem] space-y-3 overflow-y-auto pr-1">
            {#if filteredResults.length === 0 && hints.length > 0}
              <p class="text-gray-600 dark:text-gray-300">No countries match the current clue set.</p>
            {:else}
              {#each filteredResults.slice(0, 30) as result, index}
                <div class="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white">{index + 1}. {result.country.country}</p>
                      <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{result.country.continent} · {result.country.hemisphere}</p>
                    </div>
                    <span class="text-sm font-semibold text-gray-500 dark:text-gray-400">Score {result.score.toFixed(0)}</span>
                  </div>
                  {#if selectedCountry}
                    <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      Direction from {selectedCountry.country}: {calculateDirection(selectedCountry.coordinates, result.country.coordinates)}
                    </p>
                  {/if}
                </div>
              {/each}
            {/if}
          </div>
        </div>
      </article>
    </section>

    <FAQSection title="Countryle Solver FAQ" {faqs} />
  </div>
</div>
