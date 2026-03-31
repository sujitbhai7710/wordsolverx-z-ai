<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import {
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateSoftwareApplicationSchema,
    generateWebPageSchema,
  } from '$lib/seo';
  import type { Country, GameClue } from '$lib/countryle';
  import { generateClues, parseCoordinates } from '$lib/countryle';

  const faqs = [
    {
      question: 'How does the Countryle solver work?',
      answer:
        'The solver lets you enter a country guess and displays colour-coded clues for continent, hemisphere, population, surface area, average temperature, and geographic direction. Green means correct, yellow means close, and grey means wrong. Use the feedback to refine your next guess.',
    },
    {
      question: 'What do the colours mean in Countryle clues?',
      answer:
        'Green indicates the property matches the answer exactly or is within a tight threshold. Yellow means the value is close but not exact — the answer is a little more or a little less. Grey means the property is completely different from the target country.',
    },
    {
      question: 'Can this tool solve Countryle in one guess?',
      answer:
        'No tool can guarantee a single-guess solve because Countryle hides the answer until you narrow it down. However, this solver accelerates the process by filtering candidates based on continent, hemisphere, and numeric ranges, so you can reach the answer in fewer attempts.',
    },
  ];

  const pageTitle = 'Countryle Solver - Free Country Guessing Helper Tool | WordSolverX';
  const pageDescription =
    'Use the free Countryle solver to get colour-coded clues for continent, hemisphere, population, surface area, temperature, and direction. Solve Countryle faster every day.';
  const pageKeywords =
    'countryle solver, countryle helper, countryle clue solver, countryle country solver, countryle game solver, countryle cheat, countryle hints';
  const pageUrl = 'https://wordsolver.tech/countryle-solver';

  const schemas = JSON.stringify([
    generateFAQSchema(faqs),
    generateHowToSchema('How to use the Countryle solver', [
      {
        name: 'Enter a country guess',
        text: 'Type a country name into the search box and select it from the suggestion list to use as your guess.',
      },
      {
        name: 'Review the clue feedback',
        text: 'The solver shows colour-coded results for continent, hemisphere, population, surface area, temperature, and direction — green for correct, yellow for close, grey for wrong.',
      },
      {
        name: 'Refine and repeat',
        text: 'Use the feedback to narrow down the candidate countries and enter your next guess until the answer is found.',
      },
    ]),
    generateSoftwareApplicationSchema('Countryle Solver', 'UtilitiesApplication'),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolver.tech' },
      { name: 'Solver', url: 'https://wordsolver.tech/solver' },
      { name: 'Countryle Solver', url: pageUrl },
    ]),
    generateWebPageSchema('Countryle Solver', pageDescription, pageUrl),
  ]);

  let searchQuery = $state('');
  let answerName = $state('');
  let clues = $state<GameClue[]>([]);
  let guessHistory = $state<Array<{ name: string; clues: GameClue[] }>>([]);
  let errorMessage = $state('');
  let showAnswerInput = $state(false);

  const COUNTRIES: Country[] = [
    { id: 1, country: 'France', continent: 'Europe', percentOfRenewableE: 23, co2Total: 306, coastlineLength: 4853, maxAltitude: 4808, population: 67390000, avgTemperature: 12.2, surface: 643801, density: 119, PIB: 2957880000000, rankingFifa: 2, footballMatches: 987, coordinates: '46.6034,2.3488', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=46.6034,2.3488' },
    { id: 2, country: 'Brazil', continent: 'South America', percentOfRenewableE: 83, co2Total: 486, coastlineLength: 7491, maxAltitude: 2994, population: 212559000, avgTemperature: 25.2, surface: 8515767, density: 25, PIB: 1608980000000, rankingFifa: 1, footballMatches: 1243, coordinates: '-14.2350,-51.9253', hemisphere: 'Southern', mapsUrl: 'https://maps.google.com/?q=-14.2350,-51.9253' },
    { id: 3, country: 'Japan', continent: 'Asia', percentOfRenewableE: 20, co2Total: 1067, coastlineLength: 29751, maxAltitude: 3776, population: 126476000, avgTemperature: 15.4, surface: 377975, density: 347, PIB: 4937420000000, rankingFifa: 20, footballMatches: 654, coordinates: '36.2048,138.2529', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=36.2048,138.2529' },
    { id: 4, country: 'Australia', continent: 'Oceania', percentOfRenewableE: 24, co2Total: 417, coastlineLength: 25760, maxAltitude: 2228, population: 25499900, avgTemperature: 21.8, surface: 7692024, density: 3, PIB: 1392680000000, rankingFifa: 24, footballMatches: 489, coordinates: '-25.2744,133.7751', hemisphere: 'Southern', mapsUrl: 'https://maps.google.com/?q=-25.2744,133.7751' },
    { id: 5, country: 'Germany', continent: 'Europe', percentOfRenewableE: 19, co2Total: 675, coastlineLength: 2389, maxAltitude: 2962, population: 83783942, avgTemperature: 9.6, surface: 357022, density: 240, PIB: 4223300000000, rankingFifa: 14, footballMatches: 1102, coordinates: '51.1657,10.4515', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=51.1657,10.4515' },
    { id: 6, country: 'Nigeria', continent: 'Africa', percentOfRenewableE: 17, co2Total: 131, coastlineLength: 853, maxAltitude: 2419, population: 206139589, avgTemperature: 26.8, surface: 923768, density: 226, PIB: 440777000000, rankingFifa: 30, footballMatches: 567, coordinates: '9.0820,8.6753', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=9.0820,8.6753' },
    { id: 7, country: 'Canada', continent: 'North America', percentOfRenewableE: 68, co2Total: 565, coastlineLength: 202080, maxAltitude: 5959, population: 37742154, avgTemperature: -5.4, surface: 9984670, density: 4, PIB: 1643400000000, rankingFifa: 48, footballMatches: 398, coordinates: '56.1304,-106.3468', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=56.1304,-106.3468' },
    { id: 8, country: 'Argentina', continent: 'South America', percentOfRenewableE: 31, co2Total: 180, coastlineLength: 4989, maxAltitude: 6961, population: 45195774, avgTemperature: 14.5, surface: 2780400, density: 17, PIB: 383067000000, rankingFifa: 8, footballMatches: 876, coordinates: '-38.4161,-63.6167', hemisphere: 'Southern', mapsUrl: 'https://maps.google.com/?q=-38.4161,-63.6167' },
    { id: 9, country: 'India', continent: 'Asia', percentOfRenewableE: 20, co2Total: 2442, coastlineLength: 7516, maxAltitude: 8848, population: 1380004385, avgTemperature: 24.7, surface: 3287263, density: 464, PIB: 2875140000000, rankingFifa: 106, footballMatches: 432, coordinates: '20.5937,78.9629', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=20.5937,78.9629' },
    { id: 10, country: 'South Africa', continent: 'Africa', percentOfRenewableE: 8, co2Total: 477, coastlineLength: 2798, maxAltitude: 3450, population: 59308690, avgTemperature: 17.5, surface: 1221037, density: 49, PIB: 351432000000, rankingFifa: 62, footballMatches: 612, coordinates: '-30.5595,22.9375', hemisphere: 'Southern', mapsUrl: 'https://maps.google.com/?q=-30.5595,22.9375' },
    { id: 11, country: 'Mexico', continent: 'North America', percentOfRenewableE: 18, co2Total: 480, coastlineLength: 9330, maxAltitude: 5636, population: 128932753, avgTemperature: 21.0, surface: 1964375, density: 66, PIB: 1268870000000, rankingFifa: 12, footballMatches: 789, coordinates: '23.6345,-102.5528', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=23.6345,-102.5528' },
    { id: 12, country: 'Italy', continent: 'Europe', percentOfRenewableE: 18, co2Total: 330, coastlineLength: 7600, maxAltitude: 4810, population: 60461826, avgTemperature: 13.4, surface: 301340, density: 206, PIB: 2107700000000, rankingFifa: 7, footballMatches: 1045, coordinates: '41.8719,12.5674', hemisphere: 'Northern', mapsUrl: 'https://maps.google.com/?q=41.8719,12.5674' },
  ];

  function findCountry(name: string): Country | undefined {
    const lower = name.toLowerCase().trim();
    return COUNTRIES.find((c) => c.country.toLowerCase() === lower);
  }

  function handleGuess() {
    errorMessage = '';
    if (!searchQuery.trim()) {
      errorMessage = 'Please enter a country name.';
      return;
    }
    if (!answerName.trim()) {
      errorMessage = 'Please enter the answer country first.';
      return;
    }

    const answer = findCountry(answerName);
    if (!answer) {
      errorMessage = `Answer country "${answerName}" not found in the dataset.`;
      return;
    }

    const guess = findCountry(searchQuery);
    if (!guess) {
      errorMessage = `Country "${searchQuery}" not found in the dataset.`;
      return;
    }

    const newClues = generateClues(guess, answer);
    clues = newClues;
    guessHistory = [{ name: guess.country, clues: newClues }, ...guessHistory];
    searchQuery = '';
  }

  function resetSolver() {
    searchQuery = '';
    answerName = '';
    clues = [];
    guessHistory = [];
    errorMessage = '';
    showAnswerInput = false;
  }

  function clueColor(clue: GameClue): string {
    if (clue.isCorrect) return 'bg-emerald-100 border-emerald-400 text-emerald-900 dark:bg-emerald-900/30 dark:border-emerald-500 dark:text-emerald-200';
    if (clue.result.includes('little')) return 'bg-amber-100 border-amber-400 text-amber-900 dark:bg-amber-900/30 dark:border-amber-500 dark:text-amber-200';
    return 'bg-gray-100 border-gray-400 text-gray-800 dark:bg-gray-800/60 dark:border-gray-600 dark:text-gray-300';
  }

  function clueIcon(clue: GameClue): string {
    if (clue.isCorrect) return '✓';
    if (clue.result.includes('little')) return '~';
    return '✗';
  }

  let filteredCountries = $derived(
    searchQuery.length > 0
      ? COUNTRIES.filter((c) => c.country.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8)
      : []
  );
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="keywords" content={pageKeywords} />
  <link rel="canonical" href={pageUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:image" content="https://wordsolver.tech/wordsolverx.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
    <Breadcrumbs />

    <section class="mt-6 rounded-[2rem] bg-gradient-to-br from-emerald-600 to-teal-600 px-6 py-8 text-white shadow-2xl shadow-emerald-500/20 sm:px-8 sm:py-10">
      <div class="max-w-4xl">
        <p class="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
          Interactive tool
        </p>
        <h1 class="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Countryle Solver</h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-emerald-50/90 sm:text-lg">
          Enter your Countryle guesses and get instant colour-coded feedback on continent, hemisphere, population, surface area, temperature, and direction. Green means correct, yellow means close, grey means wrong.
        </p>
      </div>
    </section>

    <div class="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300" for="answer-input">Answer Country</label>
        <div class="mt-1 flex gap-3">
          <input
            id="answer-input"
            class="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500"
            placeholder="Enter the answer country (e.g. France)"
            type="text"
            bind:value={answerName}
          />
          <button
            class="rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            onclick={resetSolver}
          >
            Reset
          </button>
        </div>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300" for="guess-input">Your Guess</label>
        <div class="relative mt-1">
          <input
            id="guess-input"
            class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500"
            placeholder="Type a country name to guess..."
            type="text"
            bind:value={searchQuery}
            onkeydown={(e) => { if (e.key === 'Enter') handleGuess(); }}
          />
          {#if filteredCountries.length > 0}
            <div class="absolute z-10 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-700">
              {#each filteredCountries as country}
                <button
                  class="w-full px-4 py-2.5 text-left text-sm text-slate-800 hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-emerald-900/30"
                  onclick={() => { searchQuery = country.country; handleGuess(); }}
                >
                  {country.country}
                  <span class="ml-2 text-xs text-slate-400">{country.continent}</span>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <button
        class="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-500 hover:to-teal-500"
        onclick={handleGuess}
      >
        Get Clues
      </button>

      {#if errorMessage}
        <p class="mt-3 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">{errorMessage}</p>
      {/if}
    </div>

    {#if clues.length > 0}
      <div class="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Clue Results</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Guess: <span class="font-semibold">{guessHistory[0]?.name}</span>
        </p>
        <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {#each clues as clue}
            <div class={`rounded-xl border-2 p-4 ${clueColor(clue)}`}>
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold uppercase tracking-wide">{clue.property}</span>
                <span class="text-lg font-black">{clueIcon(clue)}</span>
              </div>
              <div class="mt-2">
                <div class="text-xs opacity-70">Your guess</div>
                <div class="text-base font-semibold">{clue.guessValue}</div>
              </div>
              <div class="mt-1">
                <div class="text-xs opacity-70">Result</div>
                <div class="text-sm font-medium">{clue.result}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if guessHistory.length > 1}
      <div class="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Guess History</h2>
        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-700">
                <th class="pb-2 text-left font-semibold text-gray-600 dark:text-gray-400">#</th>
                <th class="pb-2 text-left font-semibold text-gray-600 dark:text-gray-400">Country</th>
                <th class="pb-2 text-center font-semibold text-gray-600 dark:text-gray-400">Continent</th>
                <th class="pb-2 text-center font-semibold text-gray-600 dark:text-gray-400">Hemisphere</th>
                <th class="pb-2 text-center font-semibold text-gray-600 dark:text-gray-400">Population</th>
                <th class="pb-2 text-center font-semibold text-gray-600 dark:text-gray-400">Surface</th>
                <th class="pb-2 text-center font-semibold text-gray-600 dark:text-gray-400">Temp</th>
                <th class="pb-2 text-center font-semibold text-gray-600 dark:text-gray-400">Direction</th>
              </tr>
            </thead>
            <tbody>
              {#each guessHistory as entry, i}
                <tr class="border-b border-slate-100 dark:border-slate-700/50">
                  <td class="py-2 text-gray-500 dark:text-gray-400">{guessHistory.length - i}</td>
                  <td class="py-2 font-semibold text-gray-900 dark:text-white">{entry.name}</td>
                  {#each entry.clues as clue}
                    <td class="py-2 text-center">
                      <span class={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${clue.isCorrect ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200' : clue.result.includes('little') ? 'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                        {clueIcon(clue)}
                      </span>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}

    <article class="mt-10 grid gap-6 lg:grid-cols-2">
      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Why use it</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Turn Countryle guesses into strategic feedback</h2>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          Countryle gives you six clues per guess, but reading each one manually is slow. This solver presents all six clues in a colour-coded grid so you can see at a glance which properties match, which are close, and which are completely wrong.
        </p>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          The guess history table tracks every attempt with colour indicators, making it easy to spot patterns across multiple guesses and narrow down the answer faster.
        </p>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Best workflow</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Focus on continent and hemisphere first</h2>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          Start with guesses from different continents and hemispheres to quickly eliminate half the candidate set. Once you have the continent right, use population and surface area clues to find the closest match within that region.
        </p>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          If you want to see the answer without solving, visit the <a class="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 dark:text-emerald-300" href="/countryle-answer-today">Countryle Answer Today</a> page for the current country with full details.
        </p>
      </section>
    </article>

    <div class="mt-10 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <FAQSection {faqs} />
    </div>
  </div>
</main>
