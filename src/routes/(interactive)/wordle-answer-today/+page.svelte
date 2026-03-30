<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import WordleDisplayWrapper from '$lib/components/WordleDisplayWrapper.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
  import {
    PRESTON_HAYES_AUTHOR_DESCRIPTION,
    PRESTON_HAYES_AUTHOR_IMAGE,
    PRESTON_HAYES_AUTHOR_NAME
  } from '$lib/authors';
  import type { WordleAnswer } from '$lib/api';

  let { data } = $props();

  function formatDateForFAQ(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta name="keywords" content={data.meta.keywords ?? 'wordle answer today, wordle answer, wordle hint, wordle hint today'} />
  <meta name="news_keywords" content="wordle, wordle answer, wordle today, nyt wordle, daily word puzzle" />
  <link rel="canonical" href="https://wordsolver.tech/wordle-answer-today" />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:image" content={data.meta.socialImage} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://wordsolver.tech/wordle-answer-today" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  <meta name="twitter:image" content={data.meta.socialImage} />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.meta.title,
    description: data.meta.description,
    url: 'https://wordsolver.tech/wordle-answer-today'
  })}</script>`}
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950 font-sans">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <WordleDisplayWrapper
      wordleData={data.wordleData}
      wordleWord={data.wordleWord}
      wordleNumber={data.wordleNumber}
      formattedDate={data.formattedDate}
      pageContext="today"
      contentGuide={data.wordleData?.content_guide}
      socialImage={data.directSocialImage}
      youtubeVideoUrl={data.wordleData?.youtube_video_url}
    />

    <!-- Recent Wordle Answers Table -->
    {#if data.recentAnswers.length > 1}
      <section class="mt-12 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="w-2 h-8 bg-green-500 rounded-full"></span>
          Recent Wordle Answers
        </h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wordle #</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Answer</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {#each data.recentAnswers as answer}
                <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 {answer.date === data.wordleData?.date ? 'bg-green-50/50 dark:bg-green-900/10' : ''}">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">#{answer.id}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{formatDateForFAQ(answer.date)}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {answer.solution.toUpperCase()}
                    </span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    {/if}

    <div class="mt-12">
      <AuthorCard
        name={PRESTON_HAYES_AUTHOR_NAME}
        image={PRESTON_HAYES_AUTHOR_IMAGE}
        description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
      />
    </div>

    <!-- Internal Linking -->
    <div class="mt-16">
      <InternalLinkSection currentGame="Wordle" />
    </div>
  </div>
</main>


