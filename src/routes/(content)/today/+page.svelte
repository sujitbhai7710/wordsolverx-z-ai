<script lang="ts">
  import GameCard from '$lib/components/GameCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  let { data } = $props<{ data: { todayStr: string } }>();
  let todayStr = $derived(data.todayStr);

  const games = [
    { name: 'Wordle', href: '/wordle-answer-today', description: "Hints first, answer when you're ready.", color: 'from-green-500 to-emerald-600', icon: 'W' },
    { name: 'Canuckle', href: '/canuckle-answer-today', description: 'The daily answer, puzzle number, and the Canada fact.', color: 'from-rose-500 to-red-600', icon: 'Ca' },
    { name: 'Worldle', href: '/worldle-answer-today', description: 'Today’s country plus a quick path into the archive.', color: 'from-sky-500 to-blue-700', icon: 'Wr' },
    { name: 'Betweenle', href: '/betweenle-answer-today', description: 'The daily answer with archive dates that are easy to check.', color: 'from-indigo-500 to-fuchsia-700', icon: 'Bt' },
    { name: 'Colorfle', href: '/colorfle-answer-today', description: 'Today’s blended color, without the extra hunting around.', color: 'from-fuchsia-500 to-pink-600', icon: 'Cf' },
    { name: 'Nerdle', href: '/nerdle-answer-today', description: 'The current equation and a fast way to see older ones.', color: 'from-emerald-500 to-teal-600', icon: 'Nd' },
    { name: 'Phoodle', href: '/phoodle-answer-today', description: 'Today’s food word and the clue trail around it.', color: 'from-orange-500 to-red-500', icon: 'Ph' },
    { name: 'Quordle', href: '/quordle-answer-today', description: 'All four answers in one stop.', color: 'from-blue-500 to-indigo-600', icon: 'Q' },
    { name: 'Colordle', href: '/colordle-answer-today', description: 'The exact color, hex code, and a better daily write-up.', color: 'from-pink-500 to-purple-600', icon: 'Cd' },
    { name: 'Countryle', href: '/countryle-answer-today', description: 'The daily country answer without the guesswork after the fact.', color: 'from-emerald-500 to-teal-600', icon: 'Cy' },
    { name: 'Framed', href: '/framed-answer-today', description: 'Today’s movie answer when the stills weren’t enough.', color: 'from-amber-500 to-orange-600', icon: 'Fr' },
    { name: 'Semantle', href: '/semantle-answer-today', description: 'The hidden word and a cleaner explanation of why it fits.', color: 'from-cyan-500 to-teal-600', icon: 'Se' },
    { name: 'Waffle', href: '/waffle-answer-today', description: 'The finished grid for today’s puzzle.', color: 'from-amber-500 to-yellow-600', icon: 'Wf' },
    { name: 'Globle', href: '/globle-answer-today', description: 'Today’s mystery country with the answer up front.', color: 'from-sky-500 to-blue-600', icon: 'Gb' },
    { name: 'Narutodle', href: '/narutodle-answer-today', description: 'Today’s Naruto character, minus the digging.', color: 'from-orange-600 to-red-600', icon: 'Na' },
    { name: 'Dotadle', href: '/dotadle-answer-today', description: 'The daily Dota hero and the page around it.', color: 'from-red-600 to-rose-700', icon: 'Do' },
    { name: 'LoLdle', href: '/loldle-answer-today', description: 'Today’s League champion answer in one click.', color: 'from-violet-500 to-purple-700', icon: 'Lo' },
    { name: 'Pokedle', href: '/pokedle-answer-today', description: 'The Pokemon answer for today, kept simple.', color: 'from-yellow-400 to-amber-500', icon: 'Pk' },
    { name: 'Smashdle', href: '/smashdle-answer-today', description: 'Today’s Smash fighter, ready when you need it.', color: 'from-red-500 to-pink-600', icon: 'Sm' },
    { name: 'OnePiecedle', href: '/onepiecedle-answer-today', description: 'Today’s One Piece character without the spoiler chase.', color: 'from-blue-600 to-cyan-600', icon: 'Op' },
    { name: 'Contexto', href: '/contexto-answer-today', description: 'The answer and a faster way to confirm it.', color: 'from-violet-500 to-fuchsia-600', icon: 'Cx' },
    { name: 'Searchle', href: '/searchle-answer-today', description: 'Today’s query answer, laid out clearly.', color: 'from-purple-500 to-pink-600', icon: 'Sr' },
    { name: 'Phrazle', href: '/phrazle-answer-today', description: 'Both daily phrases, morning and afternoon.', color: 'from-emerald-500 to-lime-600', icon: 'Pz' },
    { name: 'Spotle', href: '/spotle-answer-today', description: 'Today’s artist answer and the key details around it.', color: 'from-emerald-500 to-teal-600', icon: 'Sp' },
  ];

</script>

<svelte:head>
  <title>Today's Puzzle Answers ({todayStr}) - WordSolverX</title>
  <meta name="description" content="All of today's puzzle answers in one place - Wordle, Canuckle, Betweenle, Phoodle, Quordle, Colordle, Semantle, Waffle, Globle and more for {todayStr}." />
  <link rel="canonical" href="https://wordsolver.tech/today" />
  <meta property="og:title" content={"Today's Puzzle Answers (" + todayStr + ") - WordSolverX"} />
  <meta property="og:description" content="See today's verified puzzle answers, daily solution links, and quick access to all supported games in one place." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolver.tech/today" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={"Today's Puzzle Answers (" + todayStr + ") - WordSolverX"} />
  <meta name="twitter:description" content="Daily answers for Wordle, Canuckle, Worldle, Betweenle, Phoodle, Quordle, Colordle, Semantle, Waffle, and more." />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        'name': "Today's Puzzle Answers",
        'description': "All of today's puzzle answers for " + todayStr,
        'url': 'https://wordsolver.tech/today'
      },
      {
        '@type': 'WebPage',
        'name': "Today's Puzzle Answers",
        'description': "Hub page for all of today's verified puzzle answers.",
        'url': 'https://wordsolver.tech/today'
      }
    ]
  })}</script>`}
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <Breadcrumbs />

    <div class="text-center mb-16">
      <h1 class="text-4xl font-extrabold sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">
        Today's Answers
      </h1>
      <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
        {todayStr} - the pages people usually end up opening one by one
      </p>
    </div>

    <form class="mb-10 mx-auto flex max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800" data-card-filter-form>
      <input
        type="search"
        placeholder="Search answer today pages..."
        class="min-w-0 flex-1 bg-transparent px-5 py-4 text-base text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
        data-card-filter-input="today-search"
      />
      <button
        type="submit"
        class="border-l border-gray-200 bg-green-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-green-500 dark:border-gray-700"
      >
        Search
      </button>
    </form>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {#each games as game}
        <div data-card-filter-item="today-search" data-filter-section="answers" data-search-text={`${game.name} ${game.description} ${game.href}`}>
          <GameCard name={game.name} href={game.href} description={game.description} color={game.color} icon={game.icon} actionText="View Answer" />
        </div>
      {/each}
    </div>
    <p class="mt-6 text-center text-gray-600 dark:text-gray-300" hidden data-card-filter-empty="today-search" data-empty-scope="answers">No answer pages matched your search.</p>

    <article class="mt-16 max-w-4xl mx-auto space-y-8">
      <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-4">Why This Page Exists</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          This page is for the days when you already know which puzzle you want, but you do not want to bounce through menus to find the answer page. Pick a card, open the current page, and jump straight into the hints, answer, or archive.
        </p>
      </section>
      <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-4">Use It Two Ways</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          If you still want to solve first, open the page for hints and then switch to the matching solver. If you missed a day, the archive links are the quickest way back to older results without guessing dates from memory.
        </p>
      </section>
    </article>
  </div>
</div>
