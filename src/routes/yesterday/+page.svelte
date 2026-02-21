<script lang="ts">
  import GameCard from '$lib/components/GameCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import { getJSTToday } from '$lib/utils';
  import { format, subDays } from 'date-fns';

  const yesterdayStr = format(subDays(getJSTToday(), 1), 'MMMM d, yyyy');

  const games = [
    { name: 'Wordle', href: '/wordle-answer-yesterday', description: "Yesterday's Wordle answer and hints.", color: 'from-green-500 to-emerald-600', icon: 'W' },
    { name: 'Phoodle', href: '/phoodle-answer-yesterday', description: "Yesterday's food puzzle answer.", color: 'from-orange-500 to-red-500', icon: '🍕' },
    { name: 'Semantle', href: '/semantle-answer-yesterday', description: "Yesterday's Semantle word.", color: 'from-cyan-500 to-teal-600', icon: '🧠' },
    { name: 'Colordle', href: '/colordle-answer-yesterday', description: "Yesterday's hex color answer.", color: 'from-pink-500 to-purple-600', icon: '🎨' },
  ];
</script>

<svelte:head>
  <title>Yesterday's Puzzle Answers ({yesterdayStr}) - WordSolverX</title>
  <meta name="description" content="All of yesterday's puzzle answers — Wordle, Phoodle, Semantle, Colordle for {yesterdayStr}." />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': "Yesterday's Puzzle Answers",
    'description': "All puzzle answers from " + yesterdayStr,
    'url': 'https://wordsolverx.com/yesterday'
  })}</script>`}
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <Breadcrumbs />

    <div class="text-center mb-16">
      <h1 class="text-4xl font-extrabold sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-slate-600">
        Yesterday's Answers
      </h1>
      <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
        {yesterdayStr} — Missed yesterday? Catch up here
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {#each games as game}
        <GameCard name={game.name} href={game.href} description={game.description} color={game.color} icon={game.icon} actionText="View Answer" />
      {/each}
    </div>
  </div>
</div>
