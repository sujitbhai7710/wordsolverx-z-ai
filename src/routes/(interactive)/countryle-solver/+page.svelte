<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import { generateFAQSchema, generateHowToSchema, generateBreadcrumbSchema } from '$lib/seo';
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
    },
    {
      question: 'What do the temperature clues mean?',
      answer: '"Hotter" means the target country has a higher average temperature than your guess. "A bit hotter" means it is slightly warmer. "Same" means similar average temperature. The thresholds match the original Countryle game.'
    },
    {
      question: 'Which direction does the compass arrow point?',
      answer: 'The arrow points FROM your guessed country TOWARD the target country. If you guess France and the arrow points East, the answer is east of France — like Turkey or Russia.'
    },
    {
      question: 'What is the best country to guess first?',
      answer: 'Countries near the center of continents work well because they produce useful directional clues. Turkey, Algeria, and Kazakhstan are strong openers — they split the world into manageable regions after a single guess.'
    }
  ];

  const schemas = JSON.stringify([
    generateFAQSchema(faqs),
    generateHowToSchema('How to use the Countryle solver', [
      { name: 'Select your guessed country', text: 'Type the country name and pick it from the dropdown.' },
      { name: 'Set the clue feedback', text: 'Toggle hemisphere, continent, temperature, population, and direction to match what Countryle showed you.' },
      { name: 'Add clue and review results', text: 'Click Add Clue to filter. The remaining countries are ranked by how well they match all your clues.' }
    ]),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolver.tech' },
      { name: 'Solver', url: 'https://wordsolver.tech/solver' },
      { name: 'Countryle Solver', url: 'https://wordsolver.tech/countryle-solver' }
    ])
  ]);

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
  {@html `<script type="application/ld+json">${schemas}</script>`}
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

    <article class="space-y-8">
      <section class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8">
        <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-5">What is Countryle?</h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          Countryle is a daily geography guessing game. You guess a country and get five clues back: hemisphere, continent, average temperature, population, and compass direction. The goal is to identify the mystery country in as few guesses as possible.
        </p>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          It works like Wordle but for countries instead of words. Each guess narrows the field. If your guess shows "Different hemisphere," you can eliminate every country on that side of the equator. If the temperature is "Hotter," you cut every cold country. The clues compound fast.
        </p>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          Most players solve it in 3-4 guesses once they learn how to read the clues. The trick is picking opening guesses that split the world into roughly equal halves.
        </p>
      </section>

      <section class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8">
        <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-5">Why Two Guesses Usually Crack It</h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          Guess Turkey first. You get five clues. Hemisphere — same or different, which immediately cuts the field in half. Continent — same or different, which either confirms Eurasia or eliminates it. Temperature, population, and direction further constrain the answer.
        </p>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          After one well-placed guess, you're typically down to 15-25 countries. A second guess — say, Brazil if the direction points southwest — brings that down to 3-5 countries. The third guess is usually the answer.
        </p>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          The solver automates this. Enter each guess's feedback and watch the candidate list shrink. By the second or third clue, the answer is almost always in the top 3 ranked results.
        </p>
      </section>

      <section class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8">
        <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-5">The Best Countries to Guess First</h2>
        <div class="grid gap-4 md:grid-cols-3 mb-5">
          <div class="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-5">
            <h3 class="font-bold text-emerald-800 dark:text-emerald-300 mb-2">Turkey</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Straddles Europe and Asia. Moderate temperature. Large population. Central position makes the direction arrow highly informative — it points toward most of the world's countries.</p>
          </div>
          <div class="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-5">
            <h3 class="font-bold text-emerald-800 dark:text-emerald-300 mb-2">Algeria</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">North Africa. Northern hemisphere. Hot climate. Medium-large population. The direction clue from Algeria cleanly separates Africa + Europe from Asia + the Americas.</p>
          </div>
          <div class="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-5">
            <h3 class="font-bold text-emerald-800 dark:text-emerald-300 mb-2">Kazakhstan</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Central Asia. Cold winters. Large land area. Eastern hemisphere. Its position makes the compass direction split Asia into clear sub-regions on the first guess.</p>
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          The common thread: these countries sit near the center of their continent. A guess from the center produces directional clues that cut the world into meaningful slices. A guess from the edge — say, Iceland — mostly tells you "the answer isn't near Iceland," which isn't helpful.
        </p>
      </section>

      <section class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8">
        <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-5">How Our Countryle Solver Ranks Countries</h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          After you add a clue, the solver filters the country list to only those that match every hint you've entered. Then it scores each remaining country based on how well it satisfies all the constraints simultaneously.
        </p>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          Countries that match more precisely — closer temperature, closer population, more aligned compass direction — get higher scores. The top results are the most likely answers given what you've told the solver so far.
        </p>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          The scoring uses the same comparison logic as the original Countryle game, including the percentage-based thresholds for population and temperature proximity. No approximations.
        </p>
      </section>

      <section class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8">
        <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-5">Understanding Each Clue Type</h2>
        <div class="space-y-5">
          <div class="rounded-2xl bg-gray-50 dark:bg-gray-800 p-5">
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">Hemisphere</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Same or different. The equator divides the world into northern and southern. Most countries are in the northern hemisphere, so "Different" is more informative — it cuts far more candidates.</p>
          </div>
          <div class="rounded-2xl bg-gray-50 dark:bg-gray-800 p-5">
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">Continent</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Same or different. Seven continents. If your guess and the answer share a continent, you've narrowed it to roughly 30-50 countries. If not, you've eliminated an entire landmass.</p>
          </div>
          <div class="rounded-2xl bg-gray-50 dark:bg-gray-800 p-5">
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">Temperature</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Hotter, a bit hotter, same, a bit colder, colder. This uses the country's average annual temperature. Tropical countries like Indonesia read "hotter" compared to most guesses; Scandinavian countries read "colder."</p>
          </div>
          <div class="rounded-2xl bg-gray-50 dark:bg-gray-800 p-5">
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">Population</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Larger, a bit larger, same, a bit smaller, smaller. The "a bit" variants indicate the answer is within a certain percentage threshold. This helps distinguish between countries of similar size like France and the UK.</p>
          </div>
          <div class="rounded-2xl bg-gray-50 dark:bg-gray-800 p-5">
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">Compass direction</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Eight directions: N, NE, E, SE, S, SW, W, NW. This points FROM your guessed country TOWARD the answer. It's the most precise single clue — combined with continent, it often identifies the region.</p>
          </div>
        </div>
      </section>

      <section class="rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 shadow-sm border border-gray-200 dark:border-gray-800 p-8">
        <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-5">When the Direction Arrow Points the Wrong Way</h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          The most common mistake in Countryle: reading the compass direction backward. The arrow points from your guess toward the answer — not from the answer toward your guess.
        </p>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          Example: you guess Brazil. The arrow points East. That means the answer is east of Brazil — countries like Nigeria, Chad, or further east. It does NOT mean you should guess something west of Brazil.
        </p>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          This trips up roughly half of new players. If your results keep getting worse instead of better, check whether you've been reading the direction clue in reverse.
        </p>
      </section>

      <section class="rounded-3xl bg-gray-100 dark:bg-gray-900 p-8 text-center space-y-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">More Solvers</h2>
        <div class="flex flex-wrap justify-center gap-3">
          <a href="/worldle-solver" class="px-5 py-2.5 bg-white dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md transition-shadow">Worldle Solver</a>
          <a href="/countryle-answer-today" class="px-5 py-2.5 bg-white dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md transition-shadow">Countryle Answer Today</a>
          <a href="/spotle-solver" class="px-5 py-2.5 bg-white dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md transition-shadow">Spotle Solver</a>
          <a href="/5-letter-wordle-solver" class="px-5 py-2.5 bg-white dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md transition-shadow">Wordle Solver</a>
        </div>
      </section>
    </article>

    <FAQSection title="Countryle Solver FAQ" {faqs} />
  </div>
</div>
