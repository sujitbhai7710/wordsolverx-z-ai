<script lang="ts">
  let { data } = $props<{ data: { todayStr: string } }>();
  let todayStr = $derived(data.todayStr);

  const answerTodayGames = [
    { name: 'Wordle Answer Today', href: '/wordle-answer-today', color: 'from-emerald-500 to-green-600', icon: 'W', isPopular: true },
    { name: 'Canuckle Answer Today', href: '/canuckle-answer-today', color: 'from-rose-500 to-red-600', icon: 'Ca', isPopular: true },
    { name: 'Betweenle Answer Today', href: '/betweenle-answer-today', color: 'from-indigo-500 to-fuchsia-700', icon: 'Bt', isPopular: true },
    { name: 'Colorfle Answer Today', href: '/colorfle-answer-today', color: 'from-fuchsia-500 to-pink-600', icon: 'Cf', isPopular: true },
    { name: 'Nerdle Answer Today', href: '/nerdle-answer-today', color: 'from-emerald-500 to-teal-600', icon: 'Nd', isPopular: true },
    { name: 'Phoodle Answer Today', href: '/phoodle-answer-today', color: 'from-orange-500 to-red-500', icon: 'P' },
    { name: 'Quordle Answer Today', href: '/quordle-answer-today', color: 'from-blue-500 to-indigo-600', icon: 'Q', isPopular: true },
    { name: 'Colordle Answer Today', href: '/colordle-answer-today', color: 'from-pink-500 to-purple-600', icon: 'C' },
    { name: 'Countryle Answer Today', href: '/countryle-answer-today', color: 'from-emerald-500 to-teal-600', icon: 'Cy' },
    { name: 'Framed Answer Today', href: '/framed-answer-today', color: 'from-amber-500 to-orange-600', icon: 'Fr' },
    { name: 'Semantle Answer Today', href: '/semantle-answer-today', color: 'from-cyan-500 to-teal-600', icon: 'S' },
    { name: 'Waffle Answer Today', href: '/waffle-answer-today', color: 'from-amber-500 to-yellow-600', icon: 'W' },
    { name: 'Globle Answer Today', href: '/globle-answer-today', color: 'from-sky-500 to-blue-600', icon: 'G' },
    { name: 'Dotadle Answer Today', href: '/dotadle-answer-today', color: 'from-red-600 to-rose-700', icon: 'D' },
    { name: 'LoLdle Answer Today', href: '/loldle-answer-today', color: 'from-violet-500 to-purple-700', icon: 'L' },
    { name: 'Pokedle Answer Today', href: '/pokedle-answer-today', color: 'from-yellow-400 to-amber-500', icon: 'P' },
    { name: 'Narutodle Answer Today', href: '/narutodle-answer-today', color: 'from-orange-600 to-red-600', icon: 'N' },
    { name: 'Smashdle Answer Today', href: '/smashdle-answer-today', color: 'from-red-500 to-pink-600', icon: 'S' },
    { name: 'One Piecedle Answer Today', href: '/onepiecedle-answer-today', color: 'from-blue-600 to-cyan-600', icon: 'O' },
    { name: 'Contexto Answer Today', href: '/contexto-answer-today', color: 'from-violet-500 to-fuchsia-600', icon: 'Cx' },
    { name: 'Searchle Answer Today', href: '/searchle-answer-today', color: 'from-purple-500 to-pink-600', icon: 'Se' },
    { name: 'Phrazle Answer Today', href: '/phrazle-answer-today', color: 'from-emerald-500 to-lime-600', icon: 'Ph' },
    { name: 'Spotle Answer Today', href: '/spotle-answer-today', color: 'from-emerald-500 to-teal-600', icon: 'Sp' },
    { name: 'Worgle Answer Today', href: '/worgle-answer-today', color: 'from-slate-700 to-slate-900', icon: 'Wo' },
  ];

  const solverTools = [
    { name: '5-Letter Wordle Solver', href: '/5-letter-wordle-solver', color: 'from-emerald-500 to-green-600', icon: '5', isPopular: true },
    { name: 'Nerdle Solver', href: '/nerdle-solver', color: 'from-teal-500 to-emerald-600', icon: 'Nd', isPopular: true },
    { name: 'Betweenle Solver', href: '/betweenle-solver', color: 'from-indigo-500 to-fuchsia-700', icon: 'Bt', isPopular: true },
    { name: 'Colorfle Solver', href: '/colorfle-solver', color: 'from-fuchsia-500 to-pink-600', icon: 'Cf', isPopular: true },
    { name: 'Boggle Solver', href: '/boggle-solver', color: 'from-emerald-500 to-cyan-600', icon: 'Bg' },
    { name: 'Hangman Solver', href: '/hangman-solver', color: 'from-orange-500 to-amber-600', icon: 'H' },
    { name: 'Light Out Solver', href: '/light-out-solver', color: 'from-emerald-500 to-cyan-600', icon: 'Lo' },
    { name: 'Phoodle Solver', href: '/phoodle-solver', color: 'from-orange-500 to-red-500', icon: 'Ph' },
    { name: 'Quordle Solver', href: '/quordle-solver', color: 'from-blue-500 to-indigo-600', icon: 'Q' },
    { name: 'Squaredle Solver', href: '/squaredle-solver', color: 'from-red-500 to-rose-700', icon: 'Sq' },
    { name: 'Colordle Solver', href: '/colordle-solver', color: 'from-pink-500 to-purple-600', icon: 'C' },
    { name: 'Countryle Solver', href: '/countryle-solver', color: 'from-emerald-500 to-teal-600', icon: 'Cy' },
    { name: 'Waffle Solver', href: '/waffle-solver', color: 'from-amber-500 to-yellow-600', icon: 'W' },
    { name: 'Word Ladder Solver', href: '/word-ladder-solver', color: 'from-violet-500 to-fuchsia-600', icon: 'WL' },
    { name: 'LoLdle Solver', href: '/loldle-solver', color: 'from-violet-500 to-purple-700', icon: 'L' },
    { name: 'Dotadle Solver', href: '/dotadle-solver', color: 'from-red-600 to-rose-700', icon: 'D' },
    { name: 'Pokedle Solver', href: '/pokedle-solver', color: 'from-yellow-400 to-amber-500', icon: 'P' },
    { name: 'Smashdle Solver', href: '/smashdle-solver', color: 'from-rose-500 to-pink-600', icon: 'S' },
    { name: 'Narutodle Solver', href: '/narutodle-solver', color: 'from-orange-500 to-red-600', icon: 'N' },
    { name: 'Onepiecedle Solver', href: '/onepiecedle-solver', color: 'from-blue-500 to-cyan-600', icon: 'O' },
    { name: 'Soundmap Solver', href: '/soundmap-solver', color: 'from-green-500 to-emerald-600', icon: 'SM' },
    { name: 'Searchle Solver', href: '/searchle-solver', color: 'from-purple-500 to-pink-600', icon: 'Se' },
    { name: 'Spotle Solver', href: '/spotle-solver', color: 'from-emerald-500 to-teal-600', icon: 'S' },
  ];

  const jsonLd = JSON.stringify([
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'WordSolverX', url: 'https://wordsolver.tech' },
    { '@context': 'https://schema.org', '@type': 'WebPage', name: 'WordSolverX Homepage', description: 'Daily puzzle answers, solver tools, and Wordle resources for popular word and trivia games.', url: 'https://wordsolver.tech' },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'What is WordSolverX?', acceptedAnswer: { '@type': 'Answer', text: 'WordSolverX is your ultimate companion for word puzzle games like Wordle, Quordle, Phoodle, and more.' } },
      { '@type': 'Question', name: 'When are the answers updated?', acceptedAnswer: { '@type': 'Answer', text: 'All game answers are updated daily at midnight.' } },
      { '@type': 'Question', name: 'Is WordSolverX free to use?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, WordSolverX is 100% free.' } },
    ]},
  ]);
</script>

<svelte:head>
  <title>WordSolverX | Daily Puzzle Answers, Solvers & Wordle Tools</title>
  <meta name="description" content="Get daily puzzle answers, smart solver tools, archives, and practice modes for Wordle, Betweenle, Worldle, Quordle, Phoodle, Colordle, and more on WordSolverX." />
  <link rel="canonical" href="https://wordsolver.tech/" />
  <meta property="og:title" content="WordSolverX | Daily Puzzle Answers, Solvers & Wordle Tools" />
  <meta property="og:description" content="Find daily answers, puzzle solvers, archives, and free practice tools for Wordle and dozens of popular daily games." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolver.tech/" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="WordSolverX | Daily Puzzle Answers, Solvers & Wordle Tools" />
  <meta name="twitter:description" content="Daily answers, archives, and free solver tools for Wordle, Betweenle, Quordle, Phoodle, and more." />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<div class="min-h-screen bg-white">
  <!-- Hero Section - Light Theme -->
  <section class="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-20 pb-24 lg:pt-28 lg:pb-32">
    <div class="absolute inset-0 z-0">
      <div class="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-green-200/40 blur-[120px]"></div>
      <div class="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-200/40 blur-[100px]"></div>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 border border-green-200 mb-8">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span class="text-sm font-medium text-green-700">Updated daily at midnight</span>
      </div>

      <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
        Your Ultimate
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">Word Game</span>
        Companion
      </h1>

      <p class="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
        Daily answers, advanced solvers, and unlimited practice for Wordle, Quordle, Phoodle, and 10+ more puzzle games.
      </p>

      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <a href="/wordle-answer-today" class="group px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all">
          Today's Answers <span class="inline-block ml-2 group-hover:translate-x-1 transition-transform">-&gt;</span>
        </a>
        <a href="/archive" class="px-8 py-4 rounded-xl bg-white text-gray-700 font-bold text-lg border border-gray-200 shadow-sm hover:bg-gray-50 hover:-translate-y-0.5 transition-all">
          Browse Archive
        </a>
      </div>

      <form class="mt-10 mx-auto flex max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl" data-card-filter-form>
        <input
          type="search"
          placeholder="Search the whole website..."
          class="min-w-0 flex-1 bg-transparent px-5 py-4 text-base text-gray-900 placeholder:text-gray-400 outline-none"
          data-card-filter-input="home-search"
        />
        <button
          type="submit"
          class="border-l border-gray-200 bg-green-500 px-6 py-4 text-base font-semibold text-white transition hover:bg-green-400"
        >
          Search
        </button>
      </form>

      <div class="mt-12 flex flex-wrap justify-center gap-8 text-gray-600">
        {#each ['100% Free', '15+ Games', 'Verified Answers'] as badge}
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
            <span class="text-sm font-medium">{badge}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Answer Today Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
    <div class="text-center mb-12">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Updated for {todayStr}
      </div>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Answer Today</h2>
      <p class="text-gray-600 max-w-xl mx-auto">Get the latest answers for all your favorite daily word puzzles - updated every midnight.</p>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {#each answerTodayGames as game}
        <div
          data-card-filter-item="home-search"
          data-filter-section="answers"
          data-search-text={`${game.name} ${game.href}`}
        >
          <a
            href={game.href}
            class="group relative block h-full overflow-hidden rounded-2xl bg-gradient-to-br {game.color} p-4 sm:p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="bg-white/20 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl font-bold backdrop-blur-sm">
                {game.icon}
              </div>
              {#if game.isPopular}
                <span class="bg-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full text-gray-800 uppercase tracking-wider">
                  Popular
                </span>
              {/if}
            </div>
            <h3 class="text-sm sm:text-base font-bold text-white leading-tight">{game.name}</h3>
            <div class="mt-2 flex items-center text-xs font-semibold text-white/80 uppercase tracking-wider group-hover:text-white transition-colors">
              View
              <svg class="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </a>
        </div>
      {/each}
    </div>
    <p class="mt-6 text-center text-gray-600" hidden data-card-filter-empty="home-search" data-empty-scope="answers">No answer pages matched your search.</p>
  </section>

  <!-- Solver Tools Section -->
  <section class="bg-gray-50 border-y border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-wider mb-4">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          Advanced Tools
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Solver Tools</h2>
        <p class="text-gray-600 max-w-xl mx-auto">Stuck on a puzzle? Use our solvers to narrow down possibilities.</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {#each solverTools as tool}
          <div
            data-card-filter-item="home-search"
            data-filter-section="solvers"
            data-search-text={`${tool.name} ${tool.href}`}
          >
            <a
              href={tool.href}
              class="group relative block h-full overflow-hidden rounded-2xl bg-gradient-to-br {tool.color} p-4 sm:p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="bg-white/20 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl font-bold backdrop-blur-sm">
                  {tool.icon}
                </div>
                {#if tool.isPopular}
                  <span class="bg-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full text-gray-800 uppercase tracking-wider">
                    Popular
                  </span>
                {/if}
              </div>
              <h3 class="text-sm sm:text-base font-bold text-white leading-tight">{tool.name}</h3>
              <div class="mt-2 flex items-center text-xs font-semibold text-white/80 uppercase tracking-wider group-hover:text-white transition-colors">
                Open
                <svg class="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a>
          </div>
        {/each}
      </div>
      <p class="mt-6 text-center text-gray-600" hidden data-card-filter-empty="home-search" data-empty-scope="solvers">No solver tools matched your search.</p>
    </div>
  </section>

  <!-- Features Section -->
  <section class="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-14">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-3">Why Choose WordSolverX?</h2>
      <p class="text-gray-600">Built for puzzle enthusiasts, by puzzle enthusiasts.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
        <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-green-600">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h3 class="text-lg font-bold mb-2 text-gray-900">Lightning Fast</h3>
        <p class="text-gray-600 text-sm">Answers updated every midnight. No delays, no waiting.</p>
      </div>
      <div class="text-center p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
        <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-blue-600">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 class="text-lg font-bold mb-2 text-gray-900">100% Accurate</h3>
        <p class="text-gray-600 text-sm">Verified solutions pulled directly from each game source.</p>
      </div>
      <div class="text-center p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
        <div class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-purple-600">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        </div>
        <h3 class="text-lg font-bold mb-2 text-gray-900">Advanced Solvers</h3>
        <p class="text-gray-600 text-sm">Multi-length solvers to crack any word puzzle instantly.</p>
      </div>
    </div>
  </section>
</div>
