<script lang="ts">
  import GameCard from '$lib/components/GameCard.svelte';
  import { getJSTToday } from '$lib/utils';
  import { format } from 'date-fns';

  const todayStr = format(getJSTToday(), 'MMMM d, yyyy');

  const answerTodayGames = [
    { name: 'Wordle', href: '/wordle-answer-today', description: 'The classic 5-letter word game by NYT.', color: 'from-emerald-500 to-green-600', icon: 'W', isPopular: true },
    { name: 'Phoodle', href: '/phoodle-answer-today', description: 'Food-themed Wordle with culinary words.', color: 'from-orange-500 to-red-500', icon: 'P' },
    { name: 'Quordle', href: '/quordle-answer-today', description: 'Solve four Wordles simultaneously.', color: 'from-blue-500 to-indigo-600', icon: 'Q', isPopular: true },
    { name: 'Colordle', href: '/colordle-answer-today', description: 'Guess the daily color hex code.', color: 'from-pink-500 to-purple-600', icon: 'C' },
    { name: 'Semantle', href: '/semantle-answer-today', description: 'Find the secret word using semantic similarity.', color: 'from-cyan-500 to-teal-600', icon: 'S' },
    { name: 'Waffle', href: '/waffle-answer-today', description: 'Swap letters on a waffle-shaped grid.', color: 'from-amber-500 to-yellow-600', icon: 'W' },
    { name: 'Globle', href: '/globle-answer-today', description: 'Guess the mystery country on the globe.', color: 'from-sky-500 to-blue-600', icon: 'G' },
    { name: 'Dotadle', href: '/dotadle-answer-today', description: 'Guess the Dota 2 hero of the day.', color: 'from-red-600 to-rose-700', icon: 'D' },
    { name: 'LoLdle', href: '/loldle-answer-today', description: 'Guess the League of Legends champion.', color: 'from-violet-500 to-purple-700', icon: 'L' },
    { name: 'Pokedle', href: '/pokedle-answer-today', description: 'Guess the Pokémon of the day.', color: 'from-yellow-400 to-amber-500', icon: 'P' },
    { name: 'Narutodle', href: '/narutodle-answer-today', description: 'Guess the Naruto character daily.', color: 'from-orange-600 to-red-600', icon: 'N' },
    { name: 'Smashdle', href: '/smashdle-answer-today', description: 'Guess the Smash Bros fighter.', color: 'from-red-500 to-pink-600', icon: 'S' },
    { name: 'One Piecedle', href: '/onepiecedle-answer-today', description: 'Guess the One Piece character.', color: 'from-blue-600 to-cyan-600', icon: 'O' },
  ];

  const solverTools = [
    { name: 'Wordle Solver', href: '/wordle-solver', description: 'Filter words by green, yellow, and gray letters.', color: 'from-emerald-500 to-green-600', icon: 'W', isPopular: true },
    { name: 'Play Multidle', href: '/multidle', description: 'Play unlimited Wordle — 4 to 12 letter words.', color: 'from-violet-500 to-purple-600', icon: 'M', isPopular: true },
    { name: 'Phoodle Solver', href: '/phoodle-solver', description: 'Solve the food-themed word puzzle.', color: 'from-orange-500 to-red-500', icon: 'P' },
    { name: 'Quordle Solver', href: '/quordle-solver', description: 'Crack all four words at once.', color: 'from-blue-500 to-indigo-600', icon: 'Q' },
    { name: 'Colordle Solver', href: '/colordle-solver', description: 'Find the hex color code answer.', color: 'from-pink-500 to-purple-600', icon: 'C' },
    { name: 'Waffle Solver', href: '/waffle-solver', description: 'Solve the waffle grid puzzle.', color: 'from-amber-500 to-yellow-600', icon: 'W' },
  ];

  const jsonLd = JSON.stringify([
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'WordSolverX', url: 'https://wordsolverx.com', potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: 'https://wordsolverx.com/archive?q={search_term_string}' }, 'query-input': 'required name=search_term_string' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'What is WordSolverX?', acceptedAnswer: { '@type': 'Answer', text: 'WordSolverX is your ultimate companion for word puzzle games like Wordle, Quordle, Phoodle, and more.' } },
      { '@type': 'Question', name: 'When are the answers updated?', acceptedAnswer: { '@type': 'Answer', text: 'All game answers are updated daily at midnight.' } },
      { '@type': 'Question', name: 'Is WordSolverX free to use?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, WordSolverX is 100% free.' } },
    ]},
  ]);
</script>

<svelte:head>
  <title>WordSolverX - Daily Answers & Solvers for Wordle, Quordle, Phoodle & More</title>
  <meta name="description" content="Get daily answers, advanced solvers, and unlimited practice for Wordle, Quordle, Phoodle, and 10+ more puzzle games. 100% free." />
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
  <!-- Hero Section -->
  <section class="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 pt-20 pb-24 lg:pt-28 lg:pb-32">
    <div class="absolute inset-0 z-0">
      <div class="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-green-500/10 blur-[120px]"></div>
      <div class="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[100px]"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-[150px]"></div>
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 30px 30px;"></div>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
        <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        <span class="text-sm font-medium text-green-400">Updated daily at midnight</span>
      </div>

      <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
        Your Ultimate
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">Word Game</span>
        Companion
      </h1>

      <p class="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed">
        Daily answers, advanced solvers, and unlimited practice for Wordle, Quordle, Phoodle, and 10+ more puzzle games.
      </p>

      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <a href="/wordle-answer-today" class="group px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all">
          Today's Answers <span class="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </a>
        <a href="/archive" class="px-8 py-4 rounded-xl bg-white/10 text-white font-bold text-lg border border-white/20 hover:bg-white/20 hover:-translate-y-0.5 transition-all backdrop-blur-sm">
          Browse Archive
        </a>
      </div>

      <div class="mt-12 flex flex-wrap justify-center gap-8 text-gray-500">
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
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Updated for {todayStr}
      </div>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">Answer Today</h2>
      <p class="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Get the latest answers for all your favorite daily word puzzles — updated every midnight.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {#each answerTodayGames as game}
        <GameCard name={game.name} href={game.href} description={game.description} color={game.color} icon={game.icon} isPopular={game.isPopular} actionText="View Answer" />
      {/each}
    </div>
  </section>

  <!-- Solver Tools Section -->
  <section class="bg-white dark:bg-gray-800/50 border-y border-gray-200 dark:border-gray-700/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          Advanced Tools
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">Solver Tools</h2>
        <p class="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Stuck on a puzzle? Use our solvers to narrow down possibilities.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {#each solverTools as tool}
          <GameCard name={tool.name} href={tool.href} description={tool.description} color={tool.color} icon={tool.icon} isPopular={tool.isPopular} actionText="Open Tool" />
        {/each}
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-14">
      <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Why Choose WordSolverX?</h2>
      <p class="text-gray-500 dark:text-gray-400">Built for puzzle enthusiasts, by puzzle enthusiasts.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-2xl flex items-center justify-center mx-auto mb-5 text-green-600 dark:text-green-400">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h3 class="text-lg font-bold mb-2 text-gray-900 dark:text-white">Lightning Fast</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Answers updated every midnight. No delays, no waiting.</p>
      </div>
      <div class="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-5 text-blue-600 dark:text-blue-400">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 class="text-lg font-bold mb-2 text-gray-900 dark:text-white">100% Accurate</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Verified solutions pulled directly from each game source.</p>
      </div>
      <div class="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="w-14 h-14 bg-purple-100 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center mx-auto mb-5 text-purple-600 dark:text-purple-400">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        </div>
        <h3 class="text-lg font-bold mb-2 text-gray-900 dark:text-white">Advanced Solvers</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Multi-length solvers to crack any word puzzle instantly.</p>
      </div>
    </div>
  </section>
</div>
