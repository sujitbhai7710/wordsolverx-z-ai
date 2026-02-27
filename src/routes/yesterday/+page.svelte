<script lang="ts">
  import GameCard from '$lib/components/GameCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import { getJSTToday } from '$lib/utils';
  import { format, subDays } from 'date-fns';

  const yesterdayStr = format(subDays(getJSTToday(), 1), 'MMMM d, yyyy');

  const games = [
    { name: 'Wordle', href: '/wordle-answer-yesterday', description: "Yesterday's Wordle answer and hints.", color: 'from-green-500 to-emerald-600', icon: 'W' },
    { name: 'Phoodle', href: '/phoodle-answer-yesterday', description: "Yesterday's food puzzle answer.", color: 'from-orange-500 to-red-500', icon: '🍕' },
    { name: 'Semantle', href: '/semantle-answer-yesterday', description: "Yesterday's Semantle word.", color: 'from-cyan-500 to-teal-600', icon: '🧠' },
    { name: 'Colordle', href: '/colordle-answer-yesterday', description: "Yesterday's hex color answer.", color: 'from-pink-500 to-purple-600', icon: '🎨' },
  ];

  const faqs = [
    {
      question: 'Why would I need yesterday\'s puzzle answer?',
      answer: 'Maybe you missed a day and want to check if your guess would have been right. Or perhaps you\'re keeping track of your streak and want to verify past results. Some people also use yesterday\'s answers to practice or understand patterns in the games.'
    },
    {
      question: 'How often are yesterday\'s answers updated?',
      answer: 'We update all yesterday pages right after midnight when the new puzzle goes live. So if you check in the morning, the previous day\'s answer will always be ready for you.'
    },
    {
      question: 'Can I see answers from more than one day ago?',
      answer: 'Absolutely! We have full archives for each game. Just click on any game card above, then look for the archive link. You can browse answers going back months or even years for some games.'
    },
    {
      question: 'Do you have yesterday\'s answers for all puzzle games?',
      answer: 'We cover yesterday\'s answers for Wordle, Phoodle, Semantle, and Colordle. For games like Quordle, Waffle, and Globle, we focus on today\'s answers since those puzzles are a bit more complex. Check our main Today page for the full list.'
    },
    {
      question: 'Is it cheating to look up yesterday\'s answer?',
      answer: 'Not at all! Since the puzzle is already over, looking up the answer can\'t affect your current streak. Many players use past answers to learn common patterns and improve their guessing strategy for future puzzles.'
    }
  ];
</script>

<svelte:head>
  <title>Yesterday's Puzzle Answers ({yesterdayStr}) - WordSolverX</title>
  <meta name="description" content="All of yesterday's puzzle answers — Wordle, Phoodle, Semantle, Colordle for {yesterdayStr}. Missed a day? Catch up on past solutions here." />
  <link rel="canonical" href="https://wordsolverx.com/yesterday" />
  <meta name="robots" content="noindex, follow" />
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

    <!-- SEO Content Section -->
    <article class="mt-16 max-w-4xl mx-auto">
      <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Missed a Day? No Problem
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Life gets busy. Sometimes you forget to check the daily puzzle, or maybe you just want to see what the answer was after the day is over. That's exactly why we created this page. Here you'll find all the answers from yesterday's puzzles in one convenient spot.
        </p>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Whether you're maintaining a streak, curious about a word you didn't guess, or just browsing through past solutions for fun, we've got you covered. Each game card above takes you directly to that game's yesterday page with the full answer and any hints or explanations.
        </p>
      </section>

      <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mt-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Why Look at Past Answers?
        </h2>
        <div class="space-y-6 text-lg text-gray-600 dark:text-gray-300">
          <p class="leading-relaxed">
            Looking at yesterday's answer isn't just about curiosity. Many dedicated players use past answers to spot patterns and improve their game. For example, Wordle tends to avoid obscure words, so reviewing past solutions can give you a sense of what kinds of words are likely to appear.
          </p>
          <p class="leading-relaxed">
            For Phoodle players, past answers can help you build a mental list of food-related terms. The game draws from cooking ingredients, dishes, kitchen tools, and more. Seeing what words have been used before can prepare you for future puzzles.
          </p>
          <p class="leading-relaxed">
            Semantle works differently — it's about word similarity scores rather than exact matches. But reviewing past answers can still help you understand how the game thinks about word relationships. You might discover that certain types of words tend to cluster together.
          </p>
          <p class="leading-relaxed">
            Colordle is all about color recognition. By looking at past color answers, you can train your eye to recognize color names and their hex codes. It's surprisingly addictive once you start learning the names of colors you never knew existed.
          </p>
        </div>
      </section>

      <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mt-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Tips for Using This Page
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-2xl">📅</span> Check Regularly
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              We update this page every day right after midnight. Make it a habit to check in the morning if you missed the previous day's puzzle.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-2xl">📚</span> Browse Archives
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Each game page links to its full archive. You can explore weeks or months of past answers to really understand the patterns.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-2xl">🎯</span> Practice Makes Perfect
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Use past answers to practice your guessing strategy. Think about what clues would have led you to the right answer.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-2xl">🔗</span> Share with Friends
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Compare answers with friends who also missed the puzzle. It's a fun way to stay connected over shared word game interests.
            </p>
          </div>
        </div>
      </section>

      <div class="mt-12">
        <FAQSection title="Common Questions About Yesterday's Answers" {faqs} />
      </div>
    </article>
  </div>
</div>
