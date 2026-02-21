<script lang="ts">
  const archives = [
    { name: 'Wordle', href: '/wordle-answer-archive', description: 'Every NYT Wordle answer since June 2021', color: 'from-emerald-500 to-teal-600', icon: '🟩', shadow: 'shadow-emerald-500/20' },
    { name: 'Quordle', href: '/quordle-archive', description: 'All four-word puzzle solutions', color: 'from-blue-500 to-indigo-600', icon: '4️⃣', shadow: 'shadow-blue-500/20' },
    { name: 'Colordle', href: '/colordle-archive', description: 'Complete daily color answer history', color: 'from-indigo-500 to-purple-600', icon: '🎨', shadow: 'shadow-indigo-500/20' },
    { name: 'Semantle', href: '/semantle-archive', description: 'Every secret word since launch', color: 'from-purple-500 to-violet-600', icon: '🧠', shadow: 'shadow-purple-500/20' },
    { name: 'Phoodle', href: '/phoodle-archive', description: 'All food word puzzle solutions', color: 'from-orange-500 to-amber-600', icon: '🍽️', shadow: 'shadow-orange-500/20' },
    { name: 'Globle', href: '/globle-archive', description: 'Daily country answers since 2022', color: 'from-sky-500 to-cyan-600', icon: '🌍', shadow: 'shadow-sky-500/20' },
    { name: 'Waffle', href: '/waffle-archive', description: 'Complete waffle grid puzzle history', color: 'from-amber-500 to-orange-600', icon: '🧇', shadow: 'shadow-amber-500/20' },
  ];
</script>

<svelte:head>
  <title>Puzzle Answer Archive - Wordle, Quordle, Phoodle & More | WordSolverX</title>
  <meta name="description" content="Browse the complete answer archives for Wordle, Quordle, Colordle, Semantle, Phoodle, Globle, and Waffle puzzles. Calendar views, search, and direct links to every past solution." />
  <link rel="canonical" href="https://wordsolverx.com/archive" />
  <meta property="og:title" content="Puzzle Answer Archive - All Solutions | WordSolverX" />
  <meta property="og:description" content="Complete answer history for 7 popular daily puzzle games." />
  <meta property="og:url" content="https://wordsolverx.com/archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Puzzle Answer Archive",
    "description": "Browse answer archives for Wordle, Quordle, Colordle, Semantle, Phoodle, Globle, and Waffle.",
    "url": "https://wordsolverx.com/archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolverx.com" }
  })}</script>`}
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <!-- Hero -->
    <header class="text-center mb-14">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-4xl mb-5 shadow-xl shadow-teal-500/30">
        📚
      </div>
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent mb-4 tracking-tight leading-tight">
        Puzzle Answer Archive
      </h1>
      <p class="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
        Explore the complete history of your favorite daily puzzle games
      </p>
      <div class="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/40 text-teal-600 dark:text-teal-400 text-sm font-semibold border border-teal-200 dark:border-teal-800">
        <span class="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
        {archives.length} game archives available
      </div>
    </header>

    <!-- Archive Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {#each archives as archive}
        <a
          href={archive.href}
          class="group relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 {archive.shadow} backdrop-blur-sm"
        >
          <!-- Gradient top bar -->
          <div class="h-1.5 bg-gradient-to-r {archive.color}"></div>
          
          <div class="p-6">
            <div class="flex items-start gap-4">
              <!-- Icon -->
              <div class="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br {archive.color} flex items-center justify-center text-white text-2xl shadow-lg {archive.shadow} group-hover:scale-110 transition-transform">
                {archive.icon}
              </div>
              
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:{archive.color} group-hover:bg-clip-text transition-all">
                  {archive.name} Archive
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {archive.description}
                </p>
              </div>
            </div>

            <!-- Arrow -->
            <div class="mt-4 flex items-center justify-end">
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
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

    <!-- Footer CTA -->
    <div class="mt-14 text-center">
      <div class="inline-flex flex-col sm:flex-row items-center gap-4">
        <a href="/" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Home
        </a>
        <a href="/wordle-solver" class="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm">
          🟩 Try Wordle Solver
        </a>
      </div>
    </div>
  </div>
</div>
