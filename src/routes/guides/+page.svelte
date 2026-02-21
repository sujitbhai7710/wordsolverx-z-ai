<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  const guides = [
    {
      title: 'Wordle Strategy Guide',
      description: 'Learn the best starting words, elimination strategies, and how to solve Wordle in 3 guesses or fewer.',
      gradient: 'from-green-500 to-emerald-600',
      icon: '🟩',
      link: '/wordle-solver',
      linkText: 'Try Wordle Solver',
    },
    {
      title: 'Quordle Tips & Tricks',
      description: 'Master the art of solving four puzzles simultaneously. Learn word selection and board management.',
      gradient: 'from-blue-500 to-indigo-600',
      icon: '🔷',
      link: '/quordle-solver',
      linkText: 'Try Quordle Solver',
    },
    {
      title: 'Phoodle Food Word Guide',
      description: 'A curated list of common food terms, cooking methods, and ingredients that appear in Phoodle.',
      gradient: 'from-orange-500 to-red-500',
      icon: '🍕',
      link: '/phoodle-solver',
      linkText: 'Try Phoodle Solver',
    },
    {
      title: 'Waffle Puzzle Strategy',
      description: 'How to approach waffle grids: identify fixed letters, plan swaps, and solve in minimum moves.',
      gradient: 'from-amber-500 to-yellow-600',
      icon: '🧇',
      link: '/waffle-solver',
      linkText: 'Try Waffle Solver',
    },
    {
      title: 'Colordle Color Theory',
      description: 'Understand hex codes, RGB values, and color proximity to guess the daily Colordle faster.',
      gradient: 'from-pink-500 to-purple-600',
      icon: '🎨',
      link: '/colordle-solver',
      linkText: 'Try Colordle Solver',
    },
    {
      title: 'Semantle Word Similarity',
      description: 'How semantic similarity works, what word2vec is, and strategies for narrowing down the secret word.',
      gradient: 'from-cyan-500 to-teal-600',
      icon: '🧠',
      link: '/semantle-answer-today',
      linkText: "Today's Semantle Answer",
    },
  ];
</script>

<svelte:head>
  <title>Guides & Strategies - Expert Tips for Word Puzzles | WordSolverX</title>
  <meta name="description" content="Expert guides and strategies for Wordle, Quordle, Phoodle, Waffle, Colordle, and Semantle. Learn the best techniques to improve your puzzle-solving skills." />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Puzzle Guides & Strategies',
    'description': 'Expert guides for word puzzle games',
    'url': 'https://wordsolverx.com/guides'
  })}</script>`}
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <Breadcrumbs />

    <div class="text-center mb-16">
      <h1 class="text-4xl font-extrabold sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600">
        Guides & Strategies
      </h1>
      <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
        Master every word puzzle with expert tips and techniques
      </p>
    </div>

    <div class="space-y-6">
      {#each guides as guide}
        <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row">
            <div class="sm:w-24 sm:min-h-full bg-gradient-to-br {guide.gradient} flex items-center justify-center p-4 sm:p-6">
              <span class="text-4xl">{guide.icon}</span>
            </div>
            <div class="flex-1 p-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{guide.title}</h2>
              <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{guide.description}</p>
              <a
                href={guide.link}
                class="inline-flex items-center text-sm font-semibold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r {guide.gradient} hover:opacity-80 transition-opacity"
              >
                {guide.linkText}
                <svg class="w-4 h-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
