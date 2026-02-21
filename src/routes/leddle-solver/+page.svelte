<script lang="ts">
  import { onMount } from 'svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  interface Champion {
    [key: string]: any;
    championName: string;
    gender: string;
    positions: string[];
    species: string[];
    resource: string;
    range_type: string[];
    regions: string[];
    release_date: string;
    release_year: number;
  }

  interface Guess {
    guessedChampion: Champion;
    feedback: Record<string, string>;
  }

  const ATTRIBUTES_CONFIG: Record<string, { label: string; type: string; feedbackTypes: string[] }> = {
    gender: { label: 'Gender', type: 'categorical', feedbackTypes: ['unknown', 'green', 'red'] },
    positions: { label: 'Position(s)', type: 'multi-select', feedbackTypes: ['unknown', 'green', 'orange', 'red'] },
    species: { label: 'Species', type: 'multi-select', feedbackTypes: ['unknown', 'green', 'orange', 'red'] },
    resource: { label: 'Resource', type: 'categorical', feedbackTypes: ['unknown', 'green', 'red'] },
    range_type: { label: 'Range Type', type: 'multi-select', feedbackTypes: ['unknown', 'green', 'orange', 'red'] },
    regions: { label: 'Region(s)', type: 'multi-select', feedbackTypes: ['unknown', 'green', 'orange', 'red'] },
    release_year: { label: 'Release Year', type: 'numerical_directional', feedbackTypes: ['unknown', 'green', 'red-down', 'red-up'] },
  };

  const FEEDBACK_CLASSES: Record<string, string> = {
    unknown: 'bg-gray-300 text-gray-700 border-gray-400',
    green: 'bg-green-500 text-white border-green-600',
    orange: 'bg-orange-400 text-gray-700 border-orange-500',
    red: 'bg-red-500 text-white border-red-600',
    'red-down': 'bg-red-500 text-white border-red-600',
    'red-up': 'bg-red-500 text-white border-red-600',
  };

  const FEEDBACK_SYMBOLS: Record<string, string> = {
    unknown: '?',
    green: '✓',
    orange: '≈',
    red: '✗',
    'red-down': '⬇️',
    'red-up': '⬆️',
  };

  let allChampions = $state<Champion[]>([]);
  let guesses = $state<Guess[]>([]);
  let currentActiveGuess = $state<Champion | null>(null);
  let currentFeedback = $state<Record<string, string>>({});
  let searchQuery = $state('');
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  let championSuggestions = $derived.by(() => {
    if (!searchQuery) return [];
    return allChampions.filter((c) => c.championName.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  });

  let possibleChampions = $derived.by(() => {
    if (guesses.length === 0) return allChampions;

    const checkMatch = (potential: Champion, guessed: Champion, feedback: Record<string, string>) => {
      for (const attrKey of Object.keys(ATTRIBUTES_CONFIG)) {
        const color = feedback[attrKey];
        if (color === 'unknown') continue;

        const potentialVal = potential[attrKey];
        const guessedVal = guessed[attrKey];

        if (ATTRIBUTES_CONFIG[attrKey].type === 'multi-select') {
          const intersection = potentialVal.filter((v: string) => guessedVal.includes(v));
          const isExactMatch = potentialVal.length === guessedVal.length && intersection.length === potentialVal.length;
          if (color === 'green' && !isExactMatch) return false;
          if (color === 'orange' && (isExactMatch || intersection.length === 0)) return false;
          if (color === 'red' && intersection.length > 0) return false;
        } else if (ATTRIBUTES_CONFIG[attrKey].type === 'categorical') {
          if (color === 'green' && potentialVal !== guessedVal) return false;
          if (color === 'red' && potentialVal === guessedVal) return false;
        } else if (attrKey === 'release_year') {
          if (color === 'green' && potentialVal !== guessedVal) return false;
          if (color === 'red-down' && potentialVal >= guessedVal) return false;
          if (color === 'red-up' && potentialVal <= guessedVal) return false;
        }
      }
      return true;
    };

    return allChampions.filter((potentialChampion) => {
      if (guesses.some((g) => g.guessedChampion.championName === potentialChampion.championName)) return false;
      return guesses.every((guess) => checkMatch(potentialChampion, guess.guessedChampion, guess.feedback));
    });
  });

  onMount(async () => {
    try {
      const response = await fetch('/champions_detailed.csv');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const csvText = await response.text();
      const lines = csvText.split('\n').filter((line) => line.trim() !== '');
      const headers = lines[0].split(',').map((h) => h.trim());

      const champions = lines.slice(1).map((line) => {
        const values: string[] = [];
        let inQuotes = false;
        let currentValue = '';
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') inQuotes = !inQuotes;
          else if (char === ',' && !inQuotes) { values.push(currentValue.trim()); currentValue = ''; }
          else currentValue += char;
        }
        values.push(currentValue.trim());

        const champion: Partial<Champion> = {};
        headers.forEach((header, i) => {
          let val = values[i] || '';
          if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
          (champion as any)[header] = val;
        });

        if (!champion.championName || (champion.championName as string).trim() === '') return null;

        champion.release_year = parseInt(((champion.release_date || '0-0-0') as string).split('-')[0]) || 0;

        const safeJsonParse = (str: string) => {
          try { return JSON.parse(str.replace(/'/g, '"')); }
          catch { return [str]; }
        };

        ['positions', 'regions', 'species', 'range_type'].forEach((key) => {
          (champion as any)[key] = safeJsonParse((champion as any)[key] || '[]');
        });

        return champion as Champion;
      }).filter((c): c is Champion => c !== null);

      allChampions = champions;
    } catch (e: any) {
      console.error('Error loading CSV:', e);
      error = 'Error loading champion data. Please check the console.';
    } finally {
      isLoading = false;
    }
  });

  function selectChampionForGuess(champion: Champion) {
    currentActiveGuess = champion;
    searchQuery = champion.championName;
    const initialFeedback: Record<string, string> = {};
    Object.keys(ATTRIBUTES_CONFIG).forEach((attrKey) => { initialFeedback[attrKey] = 'unknown'; });
    currentFeedback = initialFeedback;
  }

  function toggleFeedback(attrKey: string) {
    const feedbackTypes = ATTRIBUTES_CONFIG[attrKey].feedbackTypes;
    const currentStatus = currentFeedback[attrKey];
    const currentIndex = feedbackTypes.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % feedbackTypes.length;
    currentFeedback = { ...currentFeedback, [attrKey]: feedbackTypes[nextIndex] };
  }

  function handleAddGuess() {
    if (!currentActiveGuess) return;
    guesses = [...guesses, { guessedChampion: currentActiveGuess, feedback: currentFeedback }];
    currentActiveGuess = null;
    currentFeedback = {};
    searchQuery = '';
  }

  function deleteGuess(index: number) {
    if (confirm('Are you sure you want to delete this guess?')) {
      guesses = guesses.filter((_: any, i: number) => i !== index);
    }
  }

  function resetAll() {
    guesses = [];
    currentActiveGuess = null;
    currentFeedback = {};
    searchQuery = '';
  }

  const jsonLdSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Leddle Solver',
    description: 'Professional solver for the Leddle (League of Legends) champion guessing game.',
    url: 'https://wordsolverx.com/leddle-solver',
    areaServed: 'Worldwide',
    serviceType: 'Puzzle Solving Service',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  });
</script>

<svelte:head>
  <title>Leddle Solver - LoL Champion Puzzle Helper | WordSolverX</title>
  <meta name="description" content="Solve the daily Leddle puzzle with our free solver. Enter champion guesses, set feedback, and filter candidates by attributes." />
  <meta name="keywords" content="Leddle Solver, LoL Wordle, League of Legends Puzzle, Leddle Answer, Champion Guessing Game" />
  <link rel="canonical" href="https://wordsolverx.com/leddle-solver" />
  <meta property="og:title" content="Leddle Solver - LoL Champion Puzzle Helper" />
  <meta property="og:description" content="Find today's Leddle answer with our free solver." />
  <meta property="og:url" content="https://wordsolverx.com/leddle-solver" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Leddle Solver" />
  <meta name="twitter:description" content="Solve today's Leddle champion puzzle instantly." />
  {@html `<script type="application/ld+json">${jsonLdSchema}</script>`}
</svelte:head>

{#if isLoading}
  <div class="text-center p-8">Loading champion data...</div>
{:else if error}
  <div class="text-center p-8 text-red-500">{error}</div>
{:else}
  <div class="bg-gray-100 text-gray-800 min-h-screen flex flex-col items-center p-4">
    <Breadcrumbs />
    <h1 class="text-4xl font-bold text-blue-600 mb-8">Leddle Solver</h1>
    <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- Left Column -->
      <div class="md:col-span-1 bg-white p-6 rounded-lg shadow-lg flex flex-col space-y-4">
        <div>
          <label for="championSearch" class="block text-sm font-medium text-gray-700 mb-1">Search Champion to Guess:</label>
          <div class="flex space-x-2">
            <input
              type="text"
              id="championSearch"
              placeholder="Type champion name..."
              class="flex-grow bg-white text-gray-900 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              oninput={(e) => {
                searchQuery = (e.target as HTMLInputElement).value;
                if (currentActiveGuess) currentActiveGuess = null;
              }}
            />
            <button onclick={() => (searchQuery = '')} class="p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-md" title="Clear Search">X</button>
          </div>
          {#if championSuggestions.length > 0 && !currentActiveGuess}
            <div class="mt-2 bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto shadow-sm">
              {#each championSuggestions as champion}
                <button
                  class="w-full text-left p-2 hover:bg-gray-200 cursor-pointer text-sm"
                  onclick={() => selectChampionForGuess(champion)}
                >
                  {champion.championName}
                </button>
              {/each}
            </div>
          {/if}
        </div>

        {#if currentActiveGuess}
          <div class="space-y-3">
            <h2 class="text-xl font-semibold text-blue-500 border-b border-gray-300 pb-2">Current Guess Details</h2>
            <p class="text-lg font-bold text-gray-900">{currentActiveGuess.championName}</p>
            <div class="grid grid-cols-2 gap-3">
              {#each Object.entries(ATTRIBUTES_CONFIG) as [attrKey, config]}
                {@const attrVal = currentActiveGuess[attrKey]}
                {@const displayVal = Array.isArray(attrVal) ? attrVal.join(', ') : attrVal || 'N/A'}
                {@const feedbackStatus = currentFeedback[attrKey] || 'unknown'}
                <div class="flex flex-col">
                  <span class="text-xs text-gray-500 mb-1">{config.label}</span>
                  <button
                    class="border p-2 rounded-md text-sm font-medium w-full text-left truncate {FEEDBACK_CLASSES[feedbackStatus]}"
                    onclick={() => toggleFeedback(attrKey)}
                  >
                    <span class="mr-2">{FEEDBACK_SYMBOLS[feedbackStatus]}</span>
                    {displayVal}
                  </button>
                </div>
              {/each}
            </div>
            <button onclick={handleAddGuess} class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-150">
              Add Guess to History & Filter
            </button>
          </div>
        {:else}
          <div class="text-gray-500 py-10">
            <h3 class="font-semibold text-lg text-gray-700 mb-3">How to Use the Solver</h3>
            <ol class="list-decimal list-inside text-left space-y-2 text-sm">
              <li>Search for a champion and select them to make a guess.</li>
              <li>The champion's properties will appear. Click on each property to cycle through feedback colors based on what the game shows you.</li>
              <li>Once feedback is set, click "Add Guess to History & Filter".</li>
              <li>The list of "Possible Champions" will update.</li>
            </ol>
          </div>
        {/if}
      </div>

      <!-- Middle Column -->
      <div class="md:col-span-1 bg-white p-6 rounded-lg shadow-lg flex flex-col">
        <h2 class="text-xl font-semibold text-blue-500 mb-3 border-b border-gray-300 pb-2">Possible Champions ({possibleChampions.length})</h2>
        <div class="space-y-2 overflow-y-auto flex-grow max-h-[70vh]">
          {#if possibleChampions.length > 0}
            {#each possibleChampions.slice(0, 100) as champion}
              <button
                class="w-full flex items-center p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-md cursor-pointer transition duration-150 space-x-3 text-left"
                onclick={() => selectChampionForGuess(champion)}
              >
                <div class="flex-grow min-w-0">
                  <p class="font-semibold text-sm text-gray-700 truncate">{champion.championName}</p>
                  <p class="text-xs text-gray-500 truncate">{champion.regions.join(', ')} | {champion.release_year}</p>
                </div>
              </button>
            {/each}
            {#if possibleChampions.length > 100}
              <p class="text-center text-sm text-gray-500 pt-2">...and {possibleChampions.length - 100} more.</p>
            {/if}
          {:else}
            <p class="text-gray-500 italic">{guesses.length > 0 ? 'No champions match all feedback.' : 'Make a guess to see suggestions.'}</p>
          {/if}
        </div>
      </div>

      <!-- Right Column -->
      <div class="md:col-span-1 bg-white p-6 rounded-lg shadow-lg flex flex-col">
        <div class="flex justify-between items-center mb-3 border-b border-gray-300 pb-2">
          <h2 class="text-xl font-semibold text-blue-500">Guess History</h2>
          <button onclick={resetAll} class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md text-sm transition duration-150">
            Reset All
          </button>
        </div>
        <div class="space-y-3 overflow-y-auto flex-grow max-h-[70vh]">
          {#if guesses.length > 0}
            {#each guesses as guess, index}
              <div class="p-3 bg-gray-50 border border-gray-200 rounded-md shadow relative">
                <h4 class="text-md font-semibold text-blue-600 mb-2">Guess #{index + 1}: {guess.guessedChampion.championName}</h4>
                <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                  {#each Object.entries(guess.feedback) as [attrKey, feedbackStatus]}
                    <div class="flex items-center p-1 rounded-sm {FEEDBACK_CLASSES[feedbackStatus]}">
                      <span class="font-semibold mr-1 text-gray-700">{ATTRIBUTES_CONFIG[attrKey].label}:</span>
                      <span class="truncate">
                        {Array.isArray(guess.guessedChampion[attrKey]) ? guess.guessedChampion[attrKey].join(', ') : guess.guessedChampion[attrKey] || 'N/A'}
                      </span>
                      <span class="ml-auto font-bold text-sm">{FEEDBACK_SYMBOLS[feedbackStatus]}</span>
                    </div>
                  {/each}
                </div>
                <button onclick={() => deleteGuess(index)} class="absolute top-2 right-2 p-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded" title="Delete this guess">
                  🗑️
                </button>
              </div>
            {/each}
          {:else}
            <p class="text-gray-500 italic">No guesses made yet.</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
