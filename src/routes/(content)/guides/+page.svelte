<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';

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
      link: '/phoodle-answer-today',
      linkText: 'See Phoodle Answer Today',
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

  const faqs = [
    {
      question: 'What\'s the best Wordle starting word?',
      answer: 'Words like "CRANE", "SLATE", "CRATE", and "TRACE" are popular because they contain common letters in good positions. The ideal starting word has a mix of vowels and common consonants. Our Wordle Solver can show you the mathematically best options based on letter frequency.'
    },
    {
      question: 'How is Quordle different from Wordle?',
      answer: 'Quordle gives you nine guesses to solve four Wordle puzzles at the same time. Each guess applies to all four boards. The key strategy is to use your first few guesses to gather information across all boards, then solve them one by one.'
    },
    {
      question: 'What kinds of words appear in Phoodle?',
      answer: 'Phoodle uses food-related words including ingredients (like "flour", "basil"), cooking terms (like "grill", "whisk"), dishes (like "pasta", "curry"), and kitchen items. Thinking about food categories can help narrow down possibilities.'
    },
    {
      question: 'How do I get better at Semantle?',
      answer: 'Semantle is about word meaning, not spelling. Start with common words and pay attention to the similarity score. Words with scores above 30 are getting "warm." Think about synonyms, related concepts, and word associations rather than letter patterns.'
    },
    {
      question: 'Is there a strategy for Colordle?',
      answer: 'Yes! Learn to recognize common color names and their hex codes. Colors like "Crimson", "Navy", and "Forest Green" appear often. Also, pay attention to the RGB hints — they tell you whether you\'re too red, too green, or too blue.'
    }
  ];
</script>

<svelte:head>
  <title>Guides & Strategies - Expert Tips for Word Puzzles | WordSolverX</title>
  <meta name="description" content="Expert guides and strategies for Wordle, Quordle, Phoodle, Waffle, Colordle, and Semantle. Learn the best techniques to improve your puzzle-solving skills." />
  <link rel="canonical" href="https://wordsolver.tech/guides" />
  <meta property="og:title" content="Guides & Strategies - Expert Tips for Word Puzzles | WordSolverX" />
  <meta property="og:description" content="Read practical puzzle guides, strategy tips, and improvement advice for Wordle, Quordle, Phoodle, Waffle, Colordle, and Semantle." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolver.tech/guides" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Guides & Strategies - Expert Tips for Word Puzzles | WordSolverX" />
  <meta name="twitter:description" content="Improve your puzzle solving with practical guides and strategy breakdowns from WordSolverX." />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        'name': 'Puzzle Guides & Strategies',
        'description': 'Expert guides for word puzzle games',
        'url': 'https://wordsolver.tech/guides'
      },
      {
        '@type': 'WebPage',
        'name': 'Puzzle Guides & Strategies',
        'description': 'Strategy articles and learning content for daily puzzle fans.',
        'url': 'https://wordsolver.tech/guides'
      }
    ]
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

    <!-- SEO Content Section -->
    <article class="mt-16">
      <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Why Strategy Matters in Word Games
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Word games might seem simple on the surface — just guess a word, right? But anyone who's played Wordle knows there's more to it than that. A good strategy can mean the difference between solving in three guesses or running out of tries completely.
        </p>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          The key insight is that word games are really about information gathering. Every guess you make gives you clues. The question is: are you using those clues effectively? A strategic player thinks about which letters to test, which positions to try, and how to narrow down possibilities with each guess.
        </p>
        <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          This page collects our best strategies for each game. Whether you're a beginner looking to improve or an experienced player wanting to shave guesses off your average, you'll find something useful here.
        </p>
      </section>

      <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mt-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Universal Tips for All Word Games
        </h2>
        <div class="space-y-6 text-lg text-gray-600 dark:text-gray-300">
          <p class="leading-relaxed">
            No matter which word game you're playing, these principles will help you improve:
          </p>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Start with Common Letters</h3>
            <p class="text-gray-600 dark:text-gray-300">
              In English, letters like E, A, R, I, O, T, N, and S appear most frequently. Testing these letters early helps you narrow down possibilities faster. That's why starting words like "CRANE" or "SLATE" work so well — they pack multiple common letters into one guess.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Think About Letter Positions</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Some letters are more likely to appear in certain positions. For example, Y often ends words, Q is almost always followed by U, and S commonly starts or ends words. Use these patterns to make educated guesses.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Don't Waste Guesses</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Every guess should teach you something new. If you've already ruled out certain letters, don't use them again. If you know a letter is in the word but not in a certain position, try it somewhere else. Make each guess count.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Learn From Your Mistakes</h3>
            <p class="text-gray-600 dark:text-gray-300">
              After each game, think about what worked and what didn't. Did your starting word give you good information? Did you get stuck because you didn't consider a certain letter? Reviewing your games helps you improve over time.
            </p>
          </div>
        </div>
      </section>

      <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mt-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Game-Specific Strategies
        </h2>
        <div class="space-y-6 text-lg text-gray-600 dark:text-gray-300">
          <p class="leading-relaxed">
            Each word game has its own quirks. Here's a quick overview of what makes each one unique:
          </p>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800/30">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Wordle</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Focus on eliminating letters quickly. Your first two guesses should test as many common letters as possible. Then use the remaining guesses to narrow down based on what you've learned.
              </p>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Quordle</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Play defensively. Use early guesses to gather information across all four boards. Don't focus on solving one board until you have enough clues to make it count.
              </p>
            </div>
            <div class="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-100 dark:border-orange-800/30">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Phoodle</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Think food! Ingredients, cooking methods, dishes, kitchen tools — the word will always relate to food somehow. Keep a mental list of food words you encounter.
              </p>
            </div>
            <div class="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-pink-100 dark:border-pink-800/30">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Colordle</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Learn color names! There are hundreds of named colors. Pay attention to the RGB hints — they tell you which direction to adjust. The closer your hex code, the warmer you are.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 border border-purple-100 dark:border-purple-800/30 mt-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Practice Makes Perfect
        </h2>
        <div class="space-y-4 text-lg text-gray-600 dark:text-gray-300">
          <p class="leading-relaxed">
            The best way to get better at word games is to play them regularly. Each game teaches you something new — a word you hadn't thought of, a pattern you didn't notice, a strategy that works better than expected.
          </p>
          <p class="leading-relaxed">
            Don't be afraid to use our solvers when you're stuck. They're not just for finding answers — they're learning tools. Seeing which words the solver suggests can expand your vocabulary and show you patterns you might have missed.
          </p>
          <p class="leading-relaxed">
            Most importantly, have fun! Word games are meant to be enjoyable. Whether you solve in two guesses or six, the satisfaction of figuring it out is what keeps us coming back every day.
          </p>
        </div>
      </section>

      <div class="mt-12">
        <FAQSection title="Frequently Asked Questions" {faqs} />
      </div>
    </article>
  </div>
</div>
