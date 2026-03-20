<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import SquaredleSolverClient from '$lib/components/squaredle/SquaredleSolverClient.svelte';
  import {
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateSoftwareApplicationSchema,
    generateWebPageSchema
  } from '$lib/seo';

  const pageTitle = 'Squaredle Solver - Daily Board Helper & Path Finder | WordSolverX';
  const pageDescription =
    'Use the Squaredle solver to load today’s board, paste any custom grid, and find every valid word path with the same client-side solving logic as the original project.';
  const pageUrl = 'https://wordsolverx.com/squaredle-solver';

  const faqs = [
    {
      question: 'Does the Squaredle solver use the compressed dictionary from the original project?',
      answer:
        'Yes. The solver loads the same compressed words_alpha dictionary and solves the board in the browser once that dictionary is ready.'
    },
    {
      question: 'Can I load today’s official Squaredle puzzle?',
      answer:
        'Yes. The page includes the same today-puzzle scraping flow as the source project, then solves the official board locally after loading it.'
    },
    {
      question: 'What does Solve Official do?',
      answer:
        'Solve Official narrows the results to the known valid and bonus words for today’s official Squaredle board, so you can compare against the real puzzle list.'
    }
  ];

  const schemas = JSON.stringify([
    generateFAQSchema(faqs),
    generateHowToSchema('How to use the Squaredle solver', [
      { name: 'Enter or paste a board', text: 'Type one letter per cell or paste the whole board from a screenshot or copied grid.' },
      { name: 'Load today’s official puzzle if needed', text: 'Use Load today to pull in the current official Squaredle board and word list.' },
      { name: 'Solve and inspect paths', text: 'Run the solver, then hover the found words to see the exact path on the grid.' }
    ]),
    {
      ...generateSoftwareApplicationSchema('Squaredle Solver', 'GameApplication'),
      keywords: ['squaredle solver', 'squaredle helper', 'squaredle today solver']
    },
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolverx.com' },
      { name: 'Solver', url: 'https://wordsolverx.com/solver' },
      { name: 'Squaredle Solver', url: pageUrl }
    ]),
    generateWebPageSchema('Squaredle Solver', pageDescription, pageUrl)
  ]);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="keywords" content="squaredle solver, squaredle helper, squaredle board solver, squaredle today solver" />
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

  <SquaredleSolverClient />

  <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
      <FAQSection class="py-0" {faqs} title="Squaredle Solver FAQs" />
    </div>
  </div>
</main>
