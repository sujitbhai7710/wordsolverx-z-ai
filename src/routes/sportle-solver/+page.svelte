<script lang="ts">
  import { onMount } from 'svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  interface Artist {
    [key: string]: any;
    artist: string;
    countryCode: string;
    countryName: string;
    continent: string;
    genre: string;
    gender: string;
    group_size: number;
    debut_album_year: number;
    popularity: number;
  }

  interface Guess {
    guessedArtist: Artist;
    feedback: Record<string, string>;
  }

  const ATTRIBUTES_CONFIG: Record<string, { label: string; type: string; feedbackTypes: string[] }> = {
    debut_album_year: { label: 'Debut Album', type: 'debut', feedbackTypes: ['gray', 'yellow', 'green'] },
    group_size: { label: 'Members', type: 'members', feedbackTypes: ['gray', 'green'] },
    popularity: { label: 'Popularity', type: 'popularity', feedbackTypes: ['gray', 'yellow', 'green'] },
    gender: { label: 'Gender', type: 'gender', feedbackTypes: ['gray', 'green'] },
    genre: { label: 'Genre', type: 'genre', feedbackTypes: ['gray', 'green'] },
    countryName: { label: 'Nationality', type: 'nationality', feedbackTypes: ['gray', 'yellow', 'green'] },
  };

  const FEEDBACK_CLASSES: Record<string, string> = {
    gray: 'bg-gray-500 text-white border-gray-600',
    yellow: 'bg-yellow-500 text-white border-yellow-600',
    green: 'bg-green-500 text-white border-green-600',
  };

  const FEEDBACK_LABELS: Record<string, string> = {
    debut_album_year: 'Debut Year',
    group_size: 'Members',
    popularity: 'Popularity Rank',
    gender: 'Gender',
    genre: 'Genre',
    countryName: 'Country',
  };

  const COUNTRY_CODE_MAP: { [key: string]: string } = {
    ca: 'Canada', us: 'US', pr: 'Puerto Rico', bb: 'Barbados',
    gb: 'United Kingdom', tt: 'Trinidad and Tobago', co: 'Colombia', kr: 'Korea, South',
    fr: 'France', au: 'Australia', mx: 'Mexico', se: 'Sweden', pa: 'Panama',
    in: 'India', nl: 'Netherlands', de: 'Germany', ar: 'Argentina', ie: 'Ireland',
    br: 'Brazil', jm: 'Jamaica', no: 'Norway', es: 'Spain',
  };

  let allArtists = $state<Artist[]>([]);
  let guesses = $state<Guess[]>([]);
  let currentActiveGuess = $state<Artist | null>(null);
  let currentFeedback = $state<Record<string, string>>({});
  let searchQuery = $state('');
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  let artistSuggestions = $derived.by(() => {
    if (!searchQuery) return [];
    return allArtists.filter((a) => a.artist.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  });

  let possibleArtists = $derived.by(() => {
    if (guesses.length === 0) return allArtists;

    const checkMatch = (potential: Artist, guessed: Artist, feedback: Record<string, string>) => {
      for (const attrKey of Object.keys(ATTRIBUTES_CONFIG)) {
        const color = feedback[attrKey];
        if (!color || color === 'gray') continue;

        const potentialVal = potential[attrKey];
        const guessedVal = guessed[attrKey];

        switch (attrKey) {
          case 'debut_album_year':
            if (color === 'green' && potentialVal !== guessedVal) return false;
            if (color === 'yellow' && (Math.abs(potentialVal - guessedVal) > 5 || potentialVal === guessedVal)) return false;
            break;
          case 'group_size':
            if (color === 'green' && potentialVal !== guessedVal) return false;
            break;
          case 'popularity':
            if (color === 'green' && potentialVal !== guessedVal) return false;
            if (color === 'yellow' && (Math.abs(potentialVal - guessedVal) > 50 || potentialVal === guessedVal)) return false;
            break;
          case 'gender':
          case 'genre':
            if (color === 'green' && potentialVal !== guessedVal) return false;
            break;
          case 'countryName':
            if (color === 'green' && potential.countryName !== guessed.countryName) return false;
            if (color === 'yellow' && (potential.countryName === guessed.countryName || potential.continent !== guessed.continent)) return false;
            break;
        }
      }
      return true;
    };

    return allArtists.filter((potentialArtist) => {
      if (guesses.some((g) => g.guessedArtist.artist === potentialArtist.artist)) return false;
      return guesses.every((guess) => checkMatch(potentialArtist, guess.guessedArtist, guess.feedback));
    });
  });

  onMount(async () => {
    try {
      const [artistRes, continentRes] = await Promise.all([fetch('/details.csv'), fetch('/Countries-Continents.csv')]);
      if (!artistRes.ok) throw new Error(`HTTP error! status: ${artistRes.status}`);
      if (!continentRes.ok) throw new Error(`HTTP error! status: ${continentRes.status}`);

      const [artistCsvText, continentCsvText] = await Promise.all([artistRes.text(), continentRes.text()]);

      const continentLines = continentCsvText.split('\n').slice(1).filter((line) => line.trim() !== '');
      const continentData: { [country: string]: string } = {};
      for (const line of continentLines) {
        const parts: string[] = [];
        let inQuotes = false;
        let currentPart = '';
        for (const char of line) {
          if (char === '"') inQuotes = !inQuotes;
          else if (char === ',' && !inQuotes) { parts.push(currentPart.trim()); currentPart = ''; }
          else currentPart += char;
        }
        parts.push(currentPart.trim());
        if (parts.length === 2) {
          continentData[parts[1].replace(/"/g, '')] = parts[0];
        }
      }

      const getContinent = (countryCode: string) => {
        const countryName = COUNTRY_CODE_MAP[countryCode.toLowerCase()];
        return continentData[countryName] || 'Unknown';
      };

      const artistLines = artistCsvText.split('\n').filter((line) => line.trim() !== '');
      const artistHeaders = artistLines[0].split(',').map((h) => h.trim());

      const artists = artistLines.slice(1).map((line) => {
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

        const artistRaw: { [key: string]: string } = {};
        artistHeaders.forEach((header, i) => { artistRaw[header] = values[i]; });
        if (!artistRaw.artist) return null;

        const countryCode = artistRaw.country || '';
        const countryName = COUNTRY_CODE_MAP[countryCode.toLowerCase()] || 'Unknown';

        return {
          artist: artistRaw.artist,
          countryCode,
          countryName,
          continent: getContinent(countryCode),
          genre: artistRaw.genre,
          gender: artistRaw.gender,
          group_size: parseInt(artistRaw.group_size) || 1,
          debut_album_year: parseInt(artistRaw.debut_album_year) || 0,
          popularity: (parseInt(artistRaw.index) || 0) + 1,
        } as Artist;
      }).filter((a): a is Artist => a !== null && a.debut_album_year > 0);

      allArtists = artists;
    } catch (e: any) {
      console.error('Error loading data:', e);
      error = 'Error loading data. Please check the console.';
    } finally {
      isLoading = false;
    }
  });

  function selectArtistForGuess(artist: Artist) {
    currentActiveGuess = artist;
    searchQuery = artist.artist;
    const initialFeedback: Record<string, string> = {};
    Object.keys(ATTRIBUTES_CONFIG).forEach((attrKey) => { initialFeedback[attrKey] = 'gray'; });
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
    guesses = [...guesses, { guessedArtist: currentActiveGuess, feedback: currentFeedback }];
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
    name: 'Sportle Solver',
    description: 'Professional solver for the Sportle music artist guessing game.',
    url: 'https://wordsolverx.com/sportle-solver',
    areaServed: 'Worldwide',
    serviceType: 'Puzzle Solving Service',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  });
</script>

<svelte:head>
  <title>Sportle Solver - Music Artist Puzzle Helper | WordSolverX</title>
  <meta name="description" content="Solve the daily Sportle puzzle with our free solver. Enter artist guesses, set feedback, and filter candidates." />
  <meta name="keywords" content="Sportle Solver, Sportle Answer, Music Game Solver, Sportle Help" />
  <link rel="canonical" href="https://wordsolverx.com/sportle-solver" />
  <meta property="og:title" content="Sportle Solver - Music Artist Puzzle Helper" />
  <meta property="og:description" content="Find today's Sportle answer with our free solver." />
  <meta property="og:url" content="https://wordsolverx.com/sportle-solver" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Sportle Solver" />
  <meta name="twitter:description" content="Solve today's Sportle puzzle instantly." />
  {@html `<script type="application/ld+json">${jsonLdSchema}</script>`}
</svelte:head>

{#if isLoading}
  <div class="text-center p-8">Loading artist data...</div>
{:else if error}
  <div class="text-center p-8 text-red-500">{error}</div>
{:else}
  <div class="bg-gray-100 text-gray-800 min-h-screen flex flex-col items-center p-4">
    <Breadcrumbs />
    <h1 class="text-4xl font-bold text-green-600 mb-8">Sportle Solver</h1>
    <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- Left Column -->
      <div class="md:col-span-1 bg-white p-6 rounded-lg shadow-lg flex flex-col space-y-4">
        <div>
          <label for="artistSearch" class="block text-sm font-medium text-gray-700 mb-1">Search Artist to Guess:</label>
          <div class="flex space-x-2">
            <input
              type="text"
              id="artistSearch"
              placeholder="Type artist name..."
              class="flex-grow bg-white text-gray-900 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={searchQuery}
              oninput={(e) => {
                searchQuery = (e.target as HTMLInputElement).value;
                if (currentActiveGuess) currentActiveGuess = null;
              }}
            />
            <button onclick={() => (searchQuery = '')} class="p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-md" title="Clear Search">X</button>
          </div>
          {#if artistSuggestions.length > 0 && !currentActiveGuess}
            <div class="mt-2 bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto shadow-sm">
              {#each artistSuggestions as artist}
                <button
                  class="w-full text-left p-2 hover:bg-gray-200 cursor-pointer text-sm"
                  onclick={() => selectArtistForGuess(artist)}
                >
                  {artist.artist}
                </button>
              {/each}
            </div>
          {/if}
        </div>

        {#if currentActiveGuess}
          <div class="space-y-3">
            <h2 class="text-xl font-semibold text-green-500 border-b border-gray-300 pb-2">Current Guess Details</h2>
            <p class="text-lg font-bold text-gray-900">{currentActiveGuess.artist}</p>
            <div class="grid grid-cols-2 gap-3">
              {#each Object.entries(ATTRIBUTES_CONFIG) as [attrKey, config]}
                {@const attrVal = currentActiveGuess[attrKey]}
                {@const displayVal = Array.isArray(attrVal) ? attrVal.join(', ') : attrVal}
                {@const feedbackStatus = currentFeedback[attrKey] || 'gray'}
                <div class="flex flex-col">
                  <span class="text-xs text-gray-500 mb-1">{config.label}</span>
                  <button
                    class="border p-2 rounded-md text-sm font-medium w-full text-left truncate {FEEDBACK_CLASSES[feedbackStatus]}"
                    onclick={() => toggleFeedback(attrKey)}
                  >
                    {displayVal || 'N/A'}
                  </button>
                </div>
              {/each}
            </div>
            <button onclick={handleAddGuess} class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-150">
              Add Guess to History & Filter
            </button>
          </div>
        {:else}
          <div class="text-gray-500 py-10">
            <h3 class="font-semibold text-lg text-gray-700 mb-3">How to Use the Solver</h3>
            <ol class="list-decimal list-inside text-left space-y-2 text-sm">
              <li>Search for an artist and select them to make a guess.</li>
              <li>The artist's properties will appear. Click on each property to cycle through feedback colors.</li>
              <li>Once feedback is set, click "Add Guess to History & Filter".</li>
              <li>The list of "Possible Artists" will update.</li>
            </ol>
          </div>
        {/if}
      </div>

      <!-- Middle Column -->
      <div class="md:col-span-1 bg-white p-6 rounded-lg shadow-lg flex flex-col">
        <h2 class="text-xl font-semibold text-green-500 mb-3 border-b border-gray-300 pb-2">Possible Artists ({possibleArtists.length})</h2>
        <div class="space-y-2 overflow-y-auto flex-grow max-h-[70vh]">
          {#if possibleArtists.length > 0}
            {#each possibleArtists.slice(0, 100) as artist}
              <button
                class="w-full flex items-center p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-md cursor-pointer transition duration-150 space-x-3 text-left"
                onclick={() => selectArtistForGuess(artist)}
              >
                <div class="flex-grow min-w-0">
                  <p class="font-semibold text-sm text-gray-700 truncate">{artist.artist}</p>
                  <p class="text-xs text-gray-500 truncate">{artist.genre} | {artist.debut_album_year}</p>
                </div>
              </button>
            {/each}
            {#if possibleArtists.length > 100}
              <p class="text-center text-sm text-gray-500 pt-2">...and {possibleArtists.length - 100} more.</p>
            {/if}
          {:else}
            <p class="text-gray-500 italic">{guesses.length > 0 ? 'No artists match all feedback.' : 'Make a guess to see suggestions.'}</p>
          {/if}
        </div>
      </div>

      <!-- Right Column -->
      <div class="md:col-span-1 bg-white p-6 rounded-lg shadow-lg flex flex-col">
        <div class="flex justify-between items-center mb-3 border-b border-gray-300 pb-2">
          <h2 class="text-xl font-semibold text-green-500">Guess History</h2>
          <button onclick={resetAll} class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md text-sm transition duration-150">
            Reset All
          </button>
        </div>
        <div class="space-y-3 overflow-y-auto flex-grow max-h-[70vh]">
          {#if guesses.length > 0}
            {#each guesses as guess, index}
              <div class="p-3 bg-gray-50 border border-gray-200 rounded-md shadow relative">
                <h4 class="text-md font-semibold text-green-600 mb-2">Guess #{index + 1}: {guess.guessedArtist.artist}</h4>
                <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                  {#each Object.entries(guess.feedback) as [attrKey, feedbackStatus]}
                    <div class="flex items-center p-1 rounded-sm {FEEDBACK_CLASSES[feedbackStatus as string]}">
                      <span class="font-semibold mr-1 text-gray-700">{FEEDBACK_LABELS[attrKey]}:</span>
                      <span class="truncate">
                        {Array.isArray(guess.guessedArtist[attrKey]) ? guess.guessedArtist[attrKey].join(', ') : guess.guessedArtist[attrKey] || 'N/A'}
                      </span>
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
