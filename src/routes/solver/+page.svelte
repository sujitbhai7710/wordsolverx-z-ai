<script lang="ts">
  import GameCard from '$lib/components/GameCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  const solvers = [
    { name: 'Wordle Solver', href: '/wordle-solver', description: 'Advanced 5-letter word solver with smart filtering.', color: 'from-green-500 to-emerald-600', icon: 'W', isPopular: true },
    { name: 'All Wordle Solver', href: '/all-wordle-solver', description: 'Solver for 4–11 letter Wordle variants.', color: 'from-teal-500 to-cyan-600', icon: '🔤', isPopular: true },
    { name: 'Phoodle Solver', href: '/phoodle-solver', description: 'Food-themed word solver for Phoodle.', color: 'from-orange-500 to-red-500', icon: '🍕' },
    { name: 'Quordle Solver', href: '/quordle-solver', description: 'Solve all four Quordle words at once.', color: 'from-blue-500 to-indigo-600', icon: 'Q' },
    { name: 'Colordle Solver', href: '/colordle-solver', description: 'Find the hex color with visual clues.', color: 'from-pink-500 to-purple-600', icon: '🎨' },
    { name: 'Waffle Solver', href: '/waffle-solver', description: 'Crack waffle grid puzzles.', color: 'from-amber-500 to-yellow-600', icon: '🧇' },
    { name: 'Weaver Solver', href: '/weaver-solver', description: 'Find the shortest word ladder path.', color: 'from-violet-500 to-fuchsia-600', icon: '🔗' },
    { name: 'Lewdle Solver', href: '/lewdle-solver', description: 'Solver for the NSFW word game.', color: 'from-rose-500 to-red-600', icon: '🔞' },
    { name: 'Leddle Solver', href: '/leddle-solver', description: 'LED-themed word puzzle solver.', color: 'from-lime-500 to-green-600', icon: '💡' },
    { name: 'Sportle Solver', href: '/sportle-solver', description: 'Sports-themed word solver.', color: 'from-sky-500 to-blue-600', icon: '⚽' },
    { name: 'Binance WOTD', href: '/binance-wotd-solver', description: 'Binance Word of the Day solver.', color: 'from-yellow-400 to-amber-500', icon: '₿' },
  ];
</script>

<svelte:head>
  <title>Puzzle Solver Tools - Wordle, Quordle, Waffle & More | WordSolverX</title>
  <meta name="description" content="Advanced solver tools for Wordle, Quordle, Phoodle, Waffle, Colordle and more. Get unstuck with smart word filtering and elimination." />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Puzzle Solver Tools',
    'description': 'Advanced solver tools for word puzzles',
    'url': 'https://wordsolverx.com/solver'
  })}</script>`}
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <Breadcrumbs />

    <div class="text-center mb-16">
      <h1 class="text-4xl font-extrabold sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
        Solver Tools
      </h1>
      <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
        Stuck on a puzzle? Use our smart solvers to crack any word game
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {#each solvers as solver}
        <GameCard name={solver.name} href={solver.href} description={solver.description} color={solver.color} icon={solver.icon} isPopular={solver.isPopular} actionText="Open Solver" />
      {/each}
    </div>
  </div>
</div>
