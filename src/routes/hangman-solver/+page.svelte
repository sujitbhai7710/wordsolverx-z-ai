<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import HangmanSolverClient from '$lib/components/hangman/HangmanSolverClient.svelte';
  import {
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateSoftwareApplicationSchema,
    generateWebPageSchema
  } from '$lib/seo';

  const pageTitle = 'Hangman Solver - Free Online Word Finder & Hint Tool | WordSolverX';
  const pageDescription =
    'Use this Hangman solver to enter your pattern, wrong letters, and included letters, then get the best next guess, ranked answers, and entropy-based letter suggestions.';
  const pageUrl = 'https://wordsolver.tech/hangman-solver';

  const faqs = [
    {
      question: 'Is the Hangman solver running in the browser?',
      answer:
        'The page UI runs in your browser, but the large Hangman dictionary and entropy solver logic are served from a separate worker so the frontend stays lighter.'
    },
    {
      question: 'How do I write unknown letters in the pattern?',
      answer:
        'You can use underscores, question marks, hyphens, or asterisks for unknown letters. The solver normalizes them to the same blank pattern format.'
    },
    {
      question: 'What does the suggested letter mean?',
      answer:
        'The suggested letter is chosen with entropy-based scoring so it should reduce uncertainty as much as possible among the remaining candidate words.'
    }
  ];

  const schemas = JSON.stringify([
    generateFAQSchema(faqs),
    generateHowToSchema('How to use the Hangman solver', [
      { name: 'Enter the word pattern', text: 'Use letters for known positions and blank symbols for unknown spots.' },
      { name: 'Add wrong and included letters', text: 'Mark letters that are not in the word and letters that must appear somewhere.' },
      { name: 'Review ranked answers', text: 'Read the top word, best next letter, and the ranked candidate list returned by the worker.' }
    ]),
    {
      ...generateSoftwareApplicationSchema('Hangman Solver', 'GameApplication'),
      keywords: ['hangman solver', 'hangman helper', 'hangman word finder']
    },
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolver.tech' },
      { name: 'Solver', url: 'https://wordsolver.tech/solver' },
      { name: 'Hangman Solver', url: pageUrl }
    ]),
    generateWebPageSchema('Hangman Solver', pageDescription, pageUrl)
  ]);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta
    name="keywords"
    content="hangman solver, hangman helper, hangman cheat, hangman word finder, hangman hints, hangman answer finder"
  />
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

  <HangmanSolverClient />

  <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
      <FAQSection class="py-0" {faqs} title="Hangman Solver FAQs" />
    </div>
  </div>
</main>
