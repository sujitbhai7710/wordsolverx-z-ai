<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  const archives = [
    { name: 'Wordle', href: '/wordle-answer-archive', description: 'Every NYT Wordle answer since June 2021', color: 'from-emerald-500 to-teal-600', icon: 'Wd', shadow: 'shadow-emerald-500/20' },
    { name: 'Quordle', href: '/quordle-archive', description: 'All four-word puzzle solutions', color: 'from-blue-500 to-indigo-600', icon: 'Qd', shadow: 'shadow-blue-500/20' },
    { name: 'Colordle', href: '/colordle-archive', description: 'Complete daily color answer history', color: 'from-indigo-500 to-purple-600', icon: 'Cd', shadow: 'shadow-indigo-500/20' },
    { name: 'Semantle', href: '/semantle-archive', description: 'Every secret word since launch', color: 'from-purple-500 to-violet-600', icon: 'Sm', shadow: 'shadow-purple-500/20' },
    { name: 'Phoodle', href: '/phoodle-archive', description: 'All food word puzzle solutions', color: 'from-orange-500 to-amber-600', icon: 'Ph', shadow: 'shadow-orange-500/20' },
    { name: 'Globle', href: '/globle-archive', description: 'Daily country answers since 2022', color: 'from-sky-500 to-cyan-600', icon: 'Gb', shadow: 'shadow-sky-500/20' },
    { name: 'Waffle', href: '/waffle-archive', description: 'Complete waffle grid puzzle history', color: 'from-amber-500 to-orange-600', icon: 'Wf', shadow: 'shadow-amber-500/20' },
    { name: 'Worldle', href: '/worldle-archive', description: 'Country silhouette answers by date', color: 'from-sky-600 to-blue-700', icon: 'WL', shadow: 'shadow-sky-500/20' },
    { name: 'Nerdle', href: '/nerdle-archive', description: 'Math equation answer history and puzzle dates', color: 'from-emerald-500 to-teal-600', icon: 'Nd', shadow: 'shadow-emerald-500/20' },
    { name: 'Searchle', href: '/searchle-archive', description: 'Autocomplete puzzle answers and prompts', color: 'from-purple-500 to-pink-600', icon: 'Sr', shadow: 'shadow-purple-500/20' },
    { name: 'Contexto', href: '/contexto-archive', description: 'Semantic answer words and game dates', color: 'from-violet-500 to-fuchsia-600', icon: 'Cx', shadow: 'shadow-violet-500/20' },
    { name: 'Phrazle', href: '/phrazle-archive', description: 'Morning and afternoon phrase archive', color: 'from-emerald-500 to-lime-600', icon: 'Pz', shadow: 'shadow-emerald-500/20' },
    { name: 'Spotle', href: '/spotle-archive', description: 'Spotify artist answer history', color: 'from-emerald-600 to-teal-600', icon: 'Sp', shadow: 'shadow-emerald-500/20' },
  ];

  const archiveItemList = archives.map((archive, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: `${archive.name} Archive`,
    url: `https://wordsolver.tech${archive.href}`
  }));
</script>

<svelte:head>
  <title>Puzzle Answer Archives | WordSolverX</title>
  <meta name="description" content="Browse archive pages for Wordle, Quordle, Colordle, Semantle, Phoodle, Globle, Waffle, Worldle, Nerdle, Searchle, Contexto, Phrazle, and Spotle." />
  <link rel="canonical" href="https://wordsolver.tech/archive" />
  <meta property="og:title" content="Puzzle Answer Archive - All Solutions | WordSolverX" />
  <meta property="og:description" content="Browse full answer history, archive calendars, and past solutions for Wordle, Quordle, Colordle, Semantle, Phoodle, Globle, Waffle, Worldle, Nerdle, Searchle, Contexto, Phrazle, and Spotle." />
  <meta property="og:url" content="https://wordsolver.tech/archive" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Puzzle Answer Archive - All Solutions | WordSolverX" />
  <meta name="twitter:description" content="Explore complete answer archives and calendar lookups for the most popular daily puzzle games." />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": "Puzzle Answer Archive",
        "description": "Browse answer archives for Wordle, Quordle, Colordle, Semantle, Phoodle, Globle, Waffle, Worldle, Nerdle, Searchle, Contexto, Phrazle, and Spotle.",
        "url": "https://wordsolver.tech/archive",
        "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolver.tech" }
      },
      {
        "@type": "WebPage",
        "name": "Puzzle Answer Archive",
        "description": "Archive hub for past puzzle answers, history pages, and answer calendars.",
        "url": "https://wordsolver.tech/archive"
      },
      {
        "@type": "ItemList",
        "name": "Puzzle archive list",
        "itemListElement": archiveItemList
      }
    ]
  })}</script>`}
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <Breadcrumbs />

    <header class="text-center mb-14">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-4xl mb-5 shadow-xl shadow-teal-500/30">
        Ar
      </div>
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent mb-4 tracking-tight leading-tight">
        Puzzle Answer Archive
      </h1>
      <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Explore the complete history of your favorite daily puzzle games
      </p>
      <div class="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/40 text-teal-600 dark:text-teal-400 text-sm font-semibold border border-teal-200 dark:border-teal-800">
        <span class="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
        {archives.length} game archives available
      </div>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {#each archives as archive}
        <a
          href={archive.href}
          class="group relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 {archive.shadow} backdrop-blur-sm"
        >
          <div class="h-1.5 bg-gradient-to-r {archive.color}"></div>
          
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br {archive.color} flex items-center justify-center text-white text-2xl font-black shadow-lg {archive.shadow} group-hover:scale-110 transition-transform">
                {archive.icon}
              </div>
              
              <div class="flex-1 min-w-0">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:{archive.color} group-hover:bg-clip-text transition-all">
                  {archive.name} Archive
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                  {archive.description}
                </p>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-end">
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-white transition-colors">
                Browse Archive
                <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </div>
        </a>
      {/each}
    </div>

    <section class="mt-14 bg-white dark:bg-gray-800/80 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
      <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-4">Why Use the Archive?</h2>
      <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
        WordSolverX archives make it easy to verify missed puzzles, compare old answers, and spot repeat patterns across different games. Each archive links to the full history page for that puzzle so you can jump straight to the exact day you want.
      </p>
      <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
        If you are researching puzzle trends, checking a streak, or just catching up after missing a day, this archive hub gives you one central place to reach every supported answer history quickly.
      </p>
      <p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
        Every archive route is organized around clean permanent pages instead of thin one-date URL variations, which makes it easier to browse answer history without landing on duplicate or low-value pages. That helps both visitors and search engines understand where the main archive content lives.
      </p>
      <p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
        If you regularly check Wordle, Quordle, Phoodle, Worldle, Searchle, Contexto, or other daily games, this archive hub is the fastest starting point for finding official past answers, confirming dates, and moving into the correct puzzle history page with fewer clicks.
      </p>
    </section>

    <div class="mt-14 text-center">
      <div class="inline-flex flex-col sm:flex-row items-center gap-4">
        <a href="/" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Home
        </a>
        <a href="/wordle-solver" class="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm">
          Try Wordle Solver
        </a>
      </div>
    </div>
  </div>
</div>
