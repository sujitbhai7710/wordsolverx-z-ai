<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import PhoodleSolverClient from '$lib/components/phoodle/PhoodleSolverClient.svelte';
  import {
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateSoftwareApplicationSchema,
    generateWebPageSchema
  } from '$lib/seo';

  const pageTitle = 'Phoodle Solver - Free Online Food Word Helper | WordSolverX';
  const pageDescription =
    'Use the Phoodle solver to enter your guesses, match the feedback colors, and get the best next food-word suggestions with the original WASM solver logic.';
  const pageUrl = 'https://wordsolver.tech/phoodle-solver';

  const faqs = [
    {
      question: 'Does this Phoodle solver use the original WASM logic?',
      answer:
        'Yes. This page uses the same standalone WASM solver bundle from the original Phoodle solver project, so the starter and suggestion logic stays the same.'
    },
    {
      question: 'How do I enter my Phoodle feedback?',
      answer:
        'Add the guess you used in the game, then tap each letter tile until it matches the color you saw in Phoodle: absent, present, or correct.'
    },
    {
      question: 'Can I click a suggestion to reuse it?',
      answer:
        'Yes. Tapping a suggested word or a possible answer loads it into the guess input so you can add it quickly as your next try.'
    }
  ];

  const schemas = JSON.stringify([
    generateFAQSchema(faqs),
    generateHowToSchema('How to use the Phoodle solver', [
      { name: 'Add your guess', text: 'Enter the 5-letter word you tried in Phoodle.' },
      { name: 'Match the feedback', text: 'Tap each tile until it matches the result from the game.' },
      { name: 'Use the next suggestion', text: 'Read the best next guesses and possible answers, then try the best fit in Phoodle.' }
    ]),
    {
      ...generateSoftwareApplicationSchema('Phoodle Solver', 'GameApplication'),
      keywords: ['phoodle solver', 'phoodle helper', 'food word solver']
    },
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolver.tech' },
      { name: 'Solver', url: 'https://wordsolver.tech/solver' },
      { name: 'Phoodle Solver', url: pageUrl }
    ]),
    generateWebPageSchema('Phoodle Solver', pageDescription, pageUrl)
  ]);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="keywords" content="phoodle solver, phoodle helper, phoodle answer finder, food word solver" />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <link rel="canonical" href={pageUrl} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  {@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-white">
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <Breadcrumbs />
  </div>

  <PhoodleSolverClient />

  <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
      <FAQSection class="py-0" {faqs} title="Phoodle Solver FAQs" />
    </div>
  </div>
</main>
