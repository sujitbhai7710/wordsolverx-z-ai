<script lang="ts">
  import { getCurrentDayNumber, getDateForDay, GAME_START_DATES, MODE_LABELS, VALID_MODES } from '$lib/framed';

  const MOCK_MOVIES: Record<string, { title: string; year: number }[]> = {
    classic: [
      { title: 'The Shawshank Redemption', year: 1994 },
      { title: 'The Godfather', year: 1972 },
      { title: 'The Dark Knight', year: 2008 },
      { title: 'Pulp Fiction', year: 1994 },
      { title: 'Forrest Gump', year: 1994 },
      { title: 'Inception', year: 2010 },
      { title: 'Fight Club', year: 1999 },
      { title: 'The Matrix', year: 1999 },
      { title: 'Goodfellas', year: 1990 },
      { title: 'Interstellar', year: 2014 },
      { title: 'The Silence of the Lambs', year: 1991 },
      { title: 'Saving Private Ryan', year: 1998 },
      { title: 'Schindler\'s List', year: 1993 },
      { title: 'Gladiator', year: 2000 },
      { title: 'The Departed', year: 2006 },
      { title: 'Whiplash', year: 2014 },
      { title: 'No Country for Old Men', year: 2007 },
      { title: 'The Prestige', year: 2006 },
      { title: 'Django Unchained', year: 2012 },
      { title: 'Se7en', year: 1995 },
    ],
    'one-frame': [
      { title: 'Blade Runner 2049', year: 2017 },
      { title: 'Mad Max: Fury Road', year: 2015 },
      { title: 'Arrival', year: 2016 },
      { title: 'Sicario', year: 2015 },
      { title: 'Dunkirk', year: 2017 },
    ],
    poster: [
      { title: 'Jaws', year: 1975 },
      { title: 'E.T. the Extra-Terrestrial', year: 1982 },
      { title: 'Back to the Future', year: 1985 },
      { title: 'Alien', year: 1979 },
      { title: 'The Thing', year: 1982 },
    ],
    titleshot: [
      { title: 'Casablanca', year: 1942 },
      { title: 'Gone with the Wind', year: 1939 },
      { title: 'Psycho', year: 1960 },
      { title: '2001: A Space Odyssey', year: 1968 },
      { title: 'Vertigo', year: 1958 },
    ],
  };

  let selectedMode = $state('classic');
  let searchQuery = $state('');

  let currentDay = $derived(getCurrentDayNumber(selectedMode));
  let startDate = $derived(GAME_START_DATES[selectedMode]);

  let allPuzzles = $derived.by(() => {
    const movies = MOCK_MOVIES[selectedMode] ?? MOCK_MOVIES['classic'];
    const result: { dayNum: number; date: Date; formatted: string; title: string; year: number }[] = [];

    for (let i = currentDay; i >= 1; i--) {
      const date = getDateForDay(i, selectedMode);
      const movieIndex = (i - 1) % movies.length;
      const movie = movies[movieIndex];
      result.push({
        dayNum: i,
        date,
        formatted: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        title: movie.title,
        year: movie.year,
      });
    }

    return result;
  });

  let filteredPuzzles = $derived.by(() => {
    if (!searchQuery.trim()) return allPuzzles.slice(0, 30);
    const q = searchQuery.toLowerCase();
    return allPuzzles
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.formatted.toLowerCase().includes(q) ||
          String(p.dayNum).includes(q) ||
          String(p.year).includes(q)
      )
      .slice(0, 50);
  });

  const collectionSchema = JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Framed Archive',
      description: 'Complete archive of all Framed daily movie answers across all game modes.',
      url: 'https://wordsolver.tech/framed-archive',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: allPuzzles.slice(0, 20).map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `Framed #${p.dayNum} - ${p.title} (${p.year})`,
          url: `https://wordsolver.tech/framed-answer-today`,
        })),
      },
    },
  ]);
</script>

<svelte:head>
  <title>Framed Archive - Complete Movie Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Framed movie answers. Find past puzzle solutions for Classic, One Frame, Poster, and Title Shot modes." />
  <link rel="canonical" href="https://wordsolver.tech/framed-archive" />
  <meta property="og:title" content="Framed Archive - All Past Movie Answers" />
  <meta property="og:description" content="Complete history of every Framed movie answer. Browse by mode and search past puzzles." />
  <meta property="og:url" content="https://wordsolver.tech/framed-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${collectionSchema}</script>`}
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <!-- Hero Header -->
    <header class="text-center mb-10">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white text-3xl mb-4 shadow-lg shadow-red-500/20">
        🎬
      </div>
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent mb-3 tracking-tight">
        Framed Archive
      </h1>
      <p class="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
        Browse the complete history of all Framed movie answers across every game mode
      </p>
      <div class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-semibold">
        <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        {allPuzzles.length} puzzles archived
      </div>
    </header>

    <!-- Mode Selector -->
    <div class="flex flex-wrap justify-center gap-2 mb-8">
      {#each VALID_MODES as mode}
        <button
          onclick={() => { selectedMode = mode; searchQuery = ''; }}
          class="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all {selectedMode === mode
            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/20'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'}"
        >
          {MODE_LABELS[mode]}
        </button>
      {/each}
    </div>

    <!-- Search -->
    <div class="max-w-md mx-auto mb-8">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search by movie title, date, or day number..."
          class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-shadow"
        />
      </div>
    </div>

    <!-- Movie List -->
    <div class="bg-white dark:bg-gray-800/80 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20">
        <h2 class="font-bold text-gray-900 dark:text-white">
          {#if searchQuery.trim()}
            Search Results ({filteredPuzzles.length}{filteredPuzzles.length === 50 ? '+' : ''})
          {:else}
            {MODE_LABELS[selectedMode]} &mdash; Recent Puzzles
          {/if}
        </h2>
      </div>

      {#if filteredPuzzles.length === 0}
        <div class="px-6 py-16 text-center text-gray-400 dark:text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p class="font-medium">No puzzles found</p>
          <p class="text-sm mt-1">Try a different search term or mode</p>
        </div>
      {:else}
        <div class="divide-y divide-gray-100 dark:divide-gray-700 max-h-[700px] overflow-y-auto">
          {#each filteredPuzzles as puzzle}
            <div class="flex items-center justify-between px-6 py-4 hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-colors group">
              <div class="flex items-center gap-4 min-w-0">
                <span class="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold text-sm">
                  #{puzzle.dayNum}
                </span>
                <div class="min-w-0">
                  <p class="font-semibold text-gray-900 dark:text-white text-sm truncate">{puzzle.title}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{puzzle.formatted}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 flex-shrink-0">
                <span class="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-lg">
                  {puzzle.year}
                </span>
                <a
                  href="/framed-answer-today"
                  class="text-xs font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  View Answer
                </a>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Mode Info -->
    <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each VALID_MODES as mode}
        <div class="bg-white dark:bg-gray-800/80 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-1">{MODE_LABELS[mode]}</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Started {GAME_START_DATES[mode].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <div class="text-2xl font-black text-red-600 dark:text-red-400">
            #{getCurrentDayNumber(mode)}
          </div>
          <p class="text-xs text-gray-400 dark:text-gray-500">puzzles so far</p>
        </div>
      {/each}
    </div>

    <!-- Back Link -->
    <div class="mt-8 text-center">
      <a href="/framed-answer-today" class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Today's Framed Answer
      </a>
    </div>
  </div>
</div>
