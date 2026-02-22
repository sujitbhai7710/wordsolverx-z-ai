<script lang="ts">
  import GameCard from '$lib/components/GameCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';

  const solvers = [
    { name: 'Wordle Solver', href: '/wordle-solver', description: 'Advanced 5-letter word solver with smart filtering.', color: 'from-green-500 to-emerald-600', icon: 'W', isPopular: true },
    { name: 'All Wordle Solver', href: '/wordle-solver', description: 'Solver for 4–11 letter Wordle variants.', color: 'from-teal-500 to-cyan-600', icon: '🔤', isPopular: true },
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
      answer: 'The Wordle Solver is designed specifically for the standard 5-letter game. If you\'re playing a variant with different word lengths (4 letters, 6 letters, etc.), use the All Wordle Solver which handles 4-11 letter words.'
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
  <title>Puzzle Solver Tools - Wordle, Quordle, Waffle & More | WordSolverX</title>
  <meta name="description" content="Free solver tools for Wordle, Quordle, Phoodle, Waffle, Colordle and more. Get unstuck with smart word filtering and elimination. No sign-up required." />
  <link rel="canonical" href="https://wordsolverx.com/solver" />
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
              <span class="text-2xl">🎯</span> Start Strong
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Use a good starting word like "CRANE" or "SLATE" before turning to the solver. This gives you more information to work with and makes the solver's job easier.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-2xl">📝</span> Enter Clues Carefully
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Double-check that you're entering the right colors for each letter. One wrong input can throw off the entire result. Take your time getting it right.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-2xl">🧠</span> Learn From Results
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Don't just copy the answer. Look at the other words the solver suggests. You might discover new words that could help you in future puzzles.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-2xl">⏰</span> Use as a Last Resort
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
            <li><strong class="text-gray-900 dark:text-white">No ads cluttering your screen</strong> — just clean, fast tools that work</li>
            <li><strong class="text-gray-900 dark:text-white">Mobile-friendly design</strong> — works perfectly on your phone while you play</li>
            <li><strong class="text-gray-900 dark:text-white">Multiple games covered</strong> — one site for all your puzzle-solving needs</li>
            <li><strong class="text-gray-900 dark:text-white">Fast and accurate</strong> — results update instantly as you type</li>
            <li><strong class="text-gray-900 dark:text-white">No sign-up required</strong> — just open and use, no barriers</li>
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
