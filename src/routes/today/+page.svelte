<script lang="ts">
  import GameCard from '$lib/components/GameCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import { getJSTToday } from '$lib/utils';
  import { format } from 'date-fns';

  const todayStr = format(getJSTToday(), 'MMMM d, yyyy');

  const games = [
    { name: 'Wordle', href: '/wordle-answer-today', description: "Today's Wordle answer and hints.", color: 'from-green-500 to-emerald-600', icon: 'W' },
    { name: 'Phoodle', href: '/phoodle-answer-today', description: "Today's food-themed puzzle answer.", color: 'from-orange-500 to-red-500', icon: 'ðŸ•' },
    { name: 'Quordle', href: '/quordle-answer-today', description: "All four Quordle answers today.", color: 'from-blue-500 to-indigo-600', icon: 'Q' },
    { name: 'Colordle', href: '/colordle-answer-today', description: "Today's hex color answer.", color: 'from-pink-500 to-purple-600', icon: 'ðŸŽ¨' },
    { name: 'Semantle', href: '/semantle-answer-today', description: "Today's Semantle secret word.", color: 'from-cyan-500 to-teal-600', icon: 'ðŸ§ ' },
    { name: 'Waffle', href: '/waffle-answer-today', description: "Today's Waffle grid solution.", color: 'from-amber-500 to-yellow-600', icon: 'ðŸ§‡' },
    { name: 'Globle', href: '/globle-answer-today', description: "Today's mystery country.", color: 'from-sky-500 to-blue-600', icon: 'ðŸŒ' },
    { name: 'Narutodle', href: '/narutodle-answer-today', description: "Today's Naruto character.", color: 'from-orange-600 to-red-600', icon: 'ðŸ¥' },
    { name: 'Dotadle', href: '/dotadle-answer-today', description: "Today's Dota 2 hero.", color: 'from-red-600 to-rose-700', icon: 'âš”ï¸' },
    { name: 'LoLdle', href: '/loldle-answer-today', description: "Today's League champion.", color: 'from-violet-500 to-purple-700', icon: 'ðŸ†' },
    { name: 'PokÃ©dle', href: '/pokedle-answer-today', description: "Today's PokÃ©mon answer.", color: 'from-yellow-400 to-amber-500', icon: 'âš¡' },
    { name: 'Smashdle', href: '/smashdle-answer-today', description: "Today's Smash fighter.", color: 'from-red-500 to-pink-600', icon: 'ðŸ’¥' },
    { name: 'OnePiecedle', href: '/onepiecedle-answer-today', description: "Today's One Piece character.", color: 'from-blue-600 to-cyan-600', icon: 'ðŸ´â€â˜ ï¸' },
    { name: 'Contexto', href: '/contexto-answer-today', description: "Today's Contexto answer.", color: 'from-violet-500 to-fuchsia-600', icon: 'Cx' },
    { name: 'Searchle', href: '/searchle-answer-today', description: "Today's Searchle answer.", color: 'from-purple-500 to-pink-600', icon: 'Se' },
    { name: 'Phrazle', href: '/phrazle-answer-today', description: "Today's morning and afternoon phrases.", color: 'from-emerald-500 to-lime-600', icon: 'Ph' },
    { name: 'Spotle', href: '/spotle-answer-today', description: "Today's Spotify artist answer.", color: 'from-emerald-500 to-teal-600', icon: '🎵' },
  ];
</script>

<svelte:head>
  <title>Today's Puzzle Answers ({todayStr}) - WordSolverX</title>
  <meta name="description" content="All of today's puzzle answers in one place â€” Wordle, Phoodle, Quordle, Colordle, Semantle, Waffle, Globle and more for {todayStr}." />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': "Today's Puzzle Answers",
    'description': "All of today's puzzle answers for " + todayStr,
    'url': 'https://wordsolverx.com/today'
  })}</script>`}
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <Breadcrumbs />

    <div class="text-center mb-16">
      <h1 class="text-4xl font-extrabold sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">
        Today's Answers
      </h1>
      <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
        {todayStr} â€” Every daily puzzle answer in one place
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {#each games as game}
        <GameCard name={game.name} href={game.href} description={game.description} color={game.color} icon={game.icon} actionText="View Answer" />
      {/each}
    </div>
  </div>
</div>
