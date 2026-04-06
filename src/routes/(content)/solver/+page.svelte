<script lang="ts">
  import GameCard from '$lib/components/GameCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';

  type SolverCard = {
    name: string;
    href: string;
    description: string;
    color: string;
    icon: string;
    isPopular?: boolean;
  };

  const wordleLengthSolvers: SolverCard[] = [3, 4, 5, 6, 7, 8, 9, 10, 11].map((length) => ({
    name: `${length}-Letter Wordle Solver`,
    href: `/${length}-letter-wordle-solver`,
    description: `Solve ${length}-letter Wordle boards with clue filtering, ranked next guesses, and quick switching between Wordle lengths.`,
    color: length <= 5 ? 'from-green-500 to-emerald-600' : length <= 8 ? 'from-emerald-500 to-teal-600' : 'from-teal-500 to-cyan-600',
    icon: `${length}`,
    isPopular: length === 5
  }));

  const solvers: SolverCard[] = [
    ...wordleLengthSolvers,
    { name: 'Wordle Analyzer', href: '/wordle-analyzer', description: 'Replay a finished Wordle, compare every turn to an AI line, and generate spoiler-safe recap links.', color: 'from-emerald-500 via-teal-500 to-sky-600', icon: 'WA', isPopular: true },
    { name: 'Canuckle Solver', href: '/canuckle-solver', description: 'Dedicated Canuckle solver with the Canadian answer list plus linked answer today and archive pages.', color: 'from-rose-500 to-red-600', icon: 'Ca', isPopular: true },
    { name: 'Nerdle Solver', href: '/nerdle-solver', description: 'All-modes equation solver for Micro, Mini, Midi, Classic, and Maxi Nerdle.', color: 'from-teal-500 to-emerald-600', icon: 'Nd', isPopular: true },
    { name: 'Worldle Solver', href: '/worldle-solver', description: 'Geography solver for Worldle using distance and direction clues.', color: 'from-sky-500 to-blue-700', icon: 'Wr', isPopular: true },
    { name: 'Betweenle Solver', href: '/betweenle-solver', description: 'Solve Betweenle faster with top and bottom bounds plus distance percentages.', color: 'from-indigo-500 to-fuchsia-700', icon: 'Bt', isPopular: true },
    { name: 'Colorfle Solver', href: '/colorfle-solver', description: 'Solve Colorfle from target hex values or clue feedback.', color: 'from-fuchsia-500 to-pink-600', icon: 'Cf', isPopular: true },
    { name: 'Boggle Solver', href: '/boggle-solver', description: 'Find every valid word on custom or random Boggle boards from 3x3 to 10x10.', color: 'from-emerald-500 to-cyan-600', icon: 'Bg' },
    { name: 'Hangman Solver', href: '/hangman-solver', description: 'Worker-backed hangman helper with entropy-based next-letter suggestions and ranked answers.', color: 'from-orange-500 to-amber-600', icon: 'Hg', isPopular: true },
    { name: 'Kanoodle Solver', href: '/kanoodle-solver', description: 'Online Kanoodle solver and noodle solver with hints, solution counting, and challenge mode.', color: 'from-emerald-500 via-sky-500 to-fuchsia-600', icon: 'K', isPopular: true },
    { name: 'Light Out Solver', href: '/light-out-solver', description: 'Interactive Lights Out solver with linked toggle mode, edit mode, and optimal step cards.', color: 'from-emerald-500 to-cyan-600', icon: 'Lo' },
    { name: 'Phoodle Solver', href: '/phoodle-solver', description: 'WASM-powered Phoodle helper with the same standalone food-word solving logic.', color: 'from-orange-500 to-red-500', icon: 'Ph' },
    { name: 'Minesweeper Solver', href: '/minesweeper-solver', description: 'Online Minesweeper solver with board editing, safe move detection, and mine probability hints.', color: 'from-indigo-500 to-violet-700', icon: 'Ms', isPopular: true },
    { name: 'Thirdle Solver', href: '/thirdle-solver', description: '3-letter Wordle-style solver with fast clue filtering and ranked next guesses.', color: 'from-lime-500 to-emerald-600', icon: 'Th' },
    { name: 'Hardle Solver', href: '/hardle-solver', description: 'Variant solver where green and yellow clue roles can swap.', color: 'from-red-500 to-orange-600', icon: 'Hd' },
    { name: 'Warmle Solver', href: '/warmle-solver', description: 'Alphabet-distance Wordle solver with adjustable Warmle distance.', color: 'from-amber-500 to-rose-500', icon: 'Wa' },
    { name: 'Woodle Solver', href: '/woodle-solver', description: 'Count-based Wordle helper with exact and misplaced totals.', color: 'from-stone-500 to-amber-700', icon: 'Wd' },
    { name: 'Wordle Peaks Solver', href: '/w-peaks-solver', description: 'Earlier-or-later alphabet clue solver for Wordle Peaks.', color: 'from-cyan-500 to-sky-700', icon: 'Wp' },
    { name: 'Xordle Solver', href: '/xordle-solver', description: 'Merged-clue Xordle solver with built-in length switching.', color: 'from-violet-500 to-indigo-700', icon: 'X' },
    { name: 'Fibble Solver', href: '/fibble-solver', description: 'Lie-aware Fibble solver with clue matching and ranked guesses.', color: 'from-pink-500 to-rose-600', icon: 'Fb' },
    { name: 'Dordle Solver', href: '/dordle-solver', description: 'Solve two linked boards at once with shared guesses.', color: 'from-blue-500 to-cyan-600', icon: 'Do' },
    { name: 'Quordle Solver', href: '/quordle-solver', description: 'Solve all four Quordle words at once with one shared solver page.', color: 'from-blue-500 to-indigo-600', icon: 'Q', isPopular: true },
    { name: 'Octordle Solver', href: '/octordle-solver', description: 'Eight-board Octordle solver with ranked next guesses and word-length selection.', color: 'from-indigo-500 to-fuchsia-700', icon: 'O8' },
    { name: 'Spotle Wordle Solver', href: '/spotle-wordle-solver', description: 'Blank-clue Wordle-variant solver kept separate from the music Spotle page.', color: 'from-teal-500 to-cyan-700', icon: 'Sw' },
    { name: 'Squaredle Solver', href: '/squaredle-solver', description: 'Solve custom or official Squaredle boards with path highlighting and compressed dictionary search.', color: 'from-red-500 to-rose-700', icon: 'Sq' },
    { name: 'Colordle Solver', href: '/colordle-solver', description: 'Find the hex color with visual clues.', color: 'from-pink-500 to-purple-600', icon: 'Cd' },
    { name: 'Countryle Solver', href: '/countryle-solver', description: 'Filter countries by Countryle clue feedback and direction.', color: 'from-emerald-500 to-teal-600', icon: 'Cy', isPopular: true },
    { name: 'Waffle Solver', href: '/waffle-solver', description: 'Crack waffle grid puzzles.', color: 'from-amber-500 to-yellow-600', icon: 'Wf' },
    { name: 'LoLdle Solver', href: '/loldle-solver', description: 'Filter League of Legends champions by full clue data.', color: 'from-violet-500 to-purple-700', icon: 'L' },
    { name: 'Dotadle Solver', href: '/dotadle-solver', description: 'Solve Dotadle with accurate Dota 2 hero attributes.', color: 'from-red-600 to-rose-700', icon: 'D' },
    { name: 'Pokedle Solver', href: '/pokedle-solver', description: 'Narrow Pokemon answers with type, habitat, and stats.', color: 'from-yellow-400 to-amber-500', icon: 'P' },
    { name: 'Smashdle Solver', href: '/smashdle-solver', description: 'Find the Smash fighter by universe, weight, and more.', color: 'from-rose-500 to-pink-600', icon: 'S' },
    { name: 'Narutodle Solver', href: '/narutodle-solver', description: 'Use rank, village, nature type clues to solve faster.', color: 'from-orange-500 to-red-600', icon: 'N' },
    { name: 'Onepiecedle Solver', href: '/onepiecedle-solver', description: 'Solve One Piece daily character puzzles with precision.', color: 'from-blue-500 to-cyan-600', icon: 'O' },
    { name: 'Soundmap Solver', href: '/soundmap-solver', description: 'Solve the Soundmap Artist Guesser with smart feedback filters.', color: 'from-green-500 to-emerald-600', icon: 'SM' },
    { name: 'Searchle Solver', href: '/searchle-solver', description: 'Autocomplete puzzle solver for Searchle.', color: 'from-purple-500 to-pink-600', icon: 'Se' },
    { name: 'Spotle Solver', href: '/spotle-solver', description: 'Spotify artist solver for Spotle.', color: 'from-emerald-500 to-teal-600', icon: 'Sp' },
    { name: 'Weaver Solver', href: '/weaver-solver', description: 'Find the shortest word ladder path.', color: 'from-violet-500 to-fuchsia-600', icon: 'Wv' },
    { name: 'Word Ladder Solver', href: '/word-ladder-solver', description: 'Find all shortest paths with OWL2 and SOWPODS dictionaries.', color: 'from-fuchsia-500 to-violet-600', icon: 'WL' },
  ];

  const faqs = [
    {
      question: 'How do puzzle solvers work?',
      answer: 'Our solvers use word frequency data and elimination algorithms to narrow down possible answers. You enter the letters you\'ve guessed and the colors you got back, and the solver filters its word list to show only words that match your clues. It\'s like having a super-powered process of elimination.'
    },
    {
      question: 'Are these solvers free to use?',
      answer: 'Yes, every solver on this page is completely free. No sign-up required, no limits on how many times you can use them. Just pick a solver and start getting help with your puzzle.'
    },
    {
      question: 'Which solver should I use for regular Wordle?',
      answer: 'Use the 5-Letter Wordle Solver for standard Wordle. If you play custom-length boards, the dedicated 3 to 11 letter Wordle solver pages use the same clue entry flow with the right answer bank for each length.'
    },
    {
      question: 'Why are there separate Dordle, Quordle, Octordle, and Canuckle solver pages?',
      answer: 'Each puzzle family now has its own dedicated solver route so users can land directly on the right interface, switch lengths where available, and move between related pages more easily.'
    },
    {
      question: 'Can I use these solvers on my phone?',
      answer: 'Absolutely. All our solvers work great on mobile browsers. Just open this site on your phone, pick your solver, and enter your clues the same way you would on a computer.'
    },
    {
      question: 'Will using a solver ruin the fun?',
      answer: 'That depends on how you use it. Some people only use solvers when they\'re completely stuck on their last guess. Others use them to learn new words and improve their game. Think of it as a learning tool rather than a cheat sheet.'
    }
  ];
</script>

<svelte:head>
  <title>Puzzle Solver Tools - Wordle, Betweenle, Quordle & More | WordSolverX</title>
  <meta name="description" content="Free puzzle solver tools for 3 to 11 letter Wordle, Canuckle, Quordle, Betweenle, Phoodle, Waffle, Colordle, and more with fast clue-based filtering." />
  <link rel="canonical" href="https://wordsolver.tech/solver" />
  <meta property="og:title" content="Puzzle Solver Tools - Wordle, Betweenle, Quordle & More | WordSolverX" />
  <meta property="og:description" content="Use free solver tools for 3 to 11 letter Wordle, Canuckle, Betweenle, Worldle, Quordle, Phoodle, Waffle, Colordle, and more daily puzzle games." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolver.tech/solver" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Puzzle Solver Tools - Wordle, Betweenle, Quordle & More | WordSolverX" />
  <meta name="twitter:description" content="Find the right puzzle solver fast with WordSolverX's full collection of free clue-based tools for Wordle, Canuckle, Quordle, and more." />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        'name': 'Puzzle Solver Tools',
        'description': 'Advanced solver tools for word puzzles',
        'url': 'https://wordsolver.tech/solver'
      },
      {
        '@type': 'WebPage',
        'name': 'Puzzle Solver Tools',
        'description': 'Directory of solver tools for word and puzzle games.',
        'url': 'https://wordsolver.tech/solver'
      },
      {
        '@type': 'FAQPage',
        'mainEntity': faqs.map((faq) => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': { '@type': 'Answer', 'text': faq.answer }
        }))
      }
    ]
  })}</script>`}
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <Breadcrumbs />

    <div class="text-center mb-16">
      <h1 class="text-4xl font-extrabold sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
        Solver Tools
      </h1>
      <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
        Stuck on a puzzle? Use our smart solvers to crack any word game
      </p>
    </div>

    <form class="mb-10 mx-auto flex max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800" data-card-filter-form>
      <input
        data-card-filter-input="solver-search"
        type="search"
        placeholder="Search solvers..."
        class="min-w-0 flex-1 bg-transparent px-5 py-4 text-base text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
      />
      <button
        type="submit"
        class="border-l border-gray-200 bg-blue-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-500 dark:border-gray-700"
      >
        Search
      </button>
    </form>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {#each solvers as solver}
        <div
          data-card-filter-item="solver-search"
          data-filter-section="solvers"
          data-search-text={`${solver.name} ${solver.description} ${solver.href}`}
        >
          <GameCard name={solver.name} href={solver.href} description={solver.description} color={solver.color} icon={solver.icon} isPopular={solver.isPopular ?? false} actionText="Open Solver" />
        </div>
      {/each}
    </div>
    <p
      class="mt-6 text-center text-gray-600 dark:text-gray-300"
      hidden
      data-card-filter-empty="solver-search"
      data-empty-scope="solvers"
    >
      No solver tools matched your search.
    </p>

    <!-- SEO Content Section -->
    <article class="mt-16 max-w-4xl mx-auto">
      <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          What Are Puzzle Solvers?
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Puzzle solvers are tools that help you figure out the answer to word games when you're stuck. Think of them like a smart friend who knows every word in the dictionary. You tell the solver what letters you've already guessed and what feedback you got (like the green and yellow tiles in Wordle), and it narrows down the possibilities to show you the most likely answers.
        </p>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          The best part? You don't have to use them to "cheat." Many players use solvers to learn new words, understand patterns, or just get a hint when they're completely stuck on their last guess. It's like having a hint system built into the game.
        </p>
      </section>

      <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mt-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          How Our Solvers Work
        </h2>
        <div class="space-y-6 text-lg text-gray-600 dark:text-gray-300">
          <p class="leading-relaxed">
            Every solver on this page works a little differently, but they all share the same basic idea: process of elimination combined with smart word ranking. Here's what makes each one special:
          </p>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Wordle Solver</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Our most popular tool. Enter your guesses and the colors you got back, and it filters through thousands of 5-letter words to show you the best options. It even ranks words by how common they are, so the most likely answers appear first.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Quordle Solver</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Quordle is like playing four Wordles at once. Our solver handles all four boards simultaneously, helping you find words that work across multiple puzzles. It's especially useful when you're down to your last few guesses.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Waffle Solver</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Waffle gives you all the letters upfront but scrambles them in a grid. Our solver uses advanced algorithms to figure out the correct arrangement, showing you exactly where each letter should go.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Weaver Solver</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Weaver is a word ladder game where you change one letter at a time to get from one word to another. Our solver finds the shortest path between your starting and ending words, which can be surprisingly tricky to figure out on your own.
            </p>
          </div>
        </div>
      </section>

      <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mt-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Tips for Getting the Most Out of Solvers
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-2xl">1</span> Start Strong
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Use a good starting word like "CRANE" or "SLATE" before turning to the solver. This gives you more information to work with and makes the solver's job easier.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-2xl">2</span> Enter Clues Carefully
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Double-check that you're entering the right colors for each letter. One wrong input can throw off the entire result. Take your time getting it right.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-2xl">3</span> Learn From Results
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Don't just copy the answer. Look at the other words the solver suggests. You might discover new words that could help you in future puzzles.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-2xl">4</span> Use as a Last Resort
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Try to solve the puzzle yourself first. Use the solver when you're truly stuck or want to understand why a certain word was the answer.
            </p>
          </div>
        </div>
      </section>

      <section class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border border-blue-100 dark:border-blue-800/30 mt-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Why Use WordSolverX?
        </h2>
        <div class="space-y-4 text-lg text-gray-600 dark:text-gray-300">
          <p class="leading-relaxed">
            There are plenty of solver tools out there, but here's what makes WordSolverX different:
          </p>
          <ul class="list-disc list-inside space-y-3 ml-4">
            <li><strong class="text-gray-900 dark:text-white">No ads cluttering your screen</strong> - just clean, fast tools that work</li>
            <li><strong class="text-gray-900 dark:text-white">Mobile-friendly design</strong> - works perfectly on your phone while you play</li>
            <li><strong class="text-gray-900 dark:text-white">Multiple games covered</strong> - one site for all your puzzle-solving needs</li>
            <li><strong class="text-gray-900 dark:text-white">Fast and accurate</strong> - results update instantly as you type</li>
            <li><strong class="text-gray-900 dark:text-white">No sign-up required</strong> - just open and use, no barriers</li>
          </ul>
          <p class="leading-relaxed mt-6">
            We built these tools because we love word games ourselves. Every solver here was created to solve a real problem we faced while playing. We hope they help you as much as they've helped us.
          </p>
        </div>
      </section>

      <div class="mt-12">
        <FAQSection title="Frequently Asked Questions About Solvers" {faqs} />
      </div>
    </article>
  </div>
</div>


