<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import BetweenleGameClient from '$lib/components/betweenle/BetweenleGameClient.svelte';
  import {
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateSoftwareApplicationSchema,
    generateWebPageSchema,
  } from '$lib/seo';

  const pageTitle = 'Betweenle Unlimited Game - Play Unlimited and Custom Betweenle | WordSolverX';
  const pageDescription =
    'Play Betweenle Unlimited online with the same sorted word-list logic, replay daily puzzles, or start a custom Betweenle round. Free browser game with no signup required.';
  const pageUrl = 'https://wordsolverx.com/betweenle-unlimited';

  const faqs = [
    {
      question: 'What is Betweenle Unlimited?',
      answer:
        'Betweenle Unlimited is a practice mode that lets you play as many Betweenle-style rounds as you want without waiting for the next daily puzzle.',
    },
    {
      question: 'Does this Betweenle unlimited game use the same logic as the solver?',
      answer:
        'Yes. This page uses the same alphabetical Betweenle word list and the same top-and-bottom bound logic as the WordSolverX Betweenle solver.',
    },
    {
      question: 'Can I play a custom Betweenle game?',
      answer:
        'Yes. The custom mode lets you choose any valid 5-letter dictionary word from the Betweenle list and start a private round for practice or sharing.',
    },
    {
      question: 'Can I replay older Betweenle daily puzzles?',
      answer:
        'Yes. Use the archive date picker in the game to load older daily Betweenle puzzles and practice specific dates.',
    },
  ];

  const schemas = JSON.stringify([
    generateFAQSchema(faqs),
    generateHowToSchema('How to play Betweenle Unlimited', [
      {
        name: 'Choose a mode',
        text: "Start today's puzzle, a Betweenle unlimited round, an archive day, or a custom Betweenle game.",
      },
      {
        name: 'Guess a 5-letter word',
        text: 'Each guess updates the top and bottom bounds based on whether the answer is alphabetically before or after your guess.',
      },
      {
        name: 'Keep narrowing the range',
        text: 'Use the percentages and the closer-bound indicator to split the dictionary range until you find the hidden word.',
      },
    ]),
    {
      ...generateSoftwareApplicationSchema('Betweenle Unlimited Game', 'GameApplication'),
      keywords: [
        'betweenle unlimited',
        'betweenle unlimited game',
        'custom betweenle',
        'play betweenle online',
      ],
    },
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolverx.com' },
      { name: 'Betweenle Unlimited', url: pageUrl },
    ]),
    generateWebPageSchema(pageTitle, pageDescription, pageUrl),
  ]);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta
    name="keywords"
    content="betweenle unlimited, betweenle unlimited game, custom betweenle, play betweenle unlimited online, betweenle practice game"
  />
  <link rel="canonical" href={pageUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:image" content="https://wordsolverx.com/wordsolverx.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  {@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-slate-50 py-8 dark:bg-slate-950">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <Breadcrumbs />
  </div>

  <section class="mx-auto mt-6 max-w-6xl px-4 sm:px-6 lg:px-8">
    <BetweenleGameClient />
  </section>

  <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="grid gap-6 lg:grid-cols-2">
      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <h1 class="text-3xl font-black text-slate-900 dark:text-white">Play Betweenle Unlimited without waiting for tomorrow</h1>
        <p class="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
          This Betweenle unlimited game is built for fast practice. Instead of solving one puzzle and stopping, you can reset into a new round instantly, keep learning the alphabetical search pattern, and test how quickly you can close the range.
        </p>
        <p class="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
          If you want help on a hard board, open the <a class="font-semibold text-indigo-600 dark:text-indigo-300" href="/betweenle-solver">Betweenle solver</a>. If you want to check the official daily answer, use the <a class="font-semibold text-indigo-600 dark:text-indigo-300" href="/betweenle-answer-today">Betweenle answer page</a>.
        </p>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <h2 class="text-3xl font-black text-slate-900 dark:text-white">Custom Betweenle and archive practice</h2>
        <p class="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
          The custom Betweenle mode lets you pick a secret word from the dictionary for private practice, while the archive picker lets you revisit older daily puzzles. Together, those modes make this page more than a single Betweenle unlimited game page. It is a full Betweenle practice hub.
        </p>
        <p class="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
          Because the same dictionary powers the game and the solver, the strategies you learn here transfer directly to real daily Betweenle play.
        </p>
      </article>
    </div>

    <div class="mt-10 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <FAQSection class="py-0" {faqs} title="Betweenle Unlimited FAQs" />
    </div>
  </section>
</main>
