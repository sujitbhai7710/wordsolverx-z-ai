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
  <link rel="canonical" href="https://wordsolverx.com/wordle-answer-today" />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:image" content={data.meta.socialImage} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={`Wordle Answer for ${data.formattedDate}`} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://wordsolverx.com/wordle-answer-today" />
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
    url: 'https://wordsolverx.com/wordle-answer-today',
    dateModified: data.wordleData?.date || new Date().toISOString().split('T')[0]
  })}</script>`}
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 font-sans">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <WordleDisplayWrapper
      wordleData={data.wordleData}
      wordleWord={data.wordleWord}
      wordleNumber={data.wordleNumber}
      formattedDate={data.formattedDate}
      pageContext="today"
      contentGuide={data.wordleData?.content_guide}
      bonusHints={data.generatedArticle?.bonusHints ?? []}
      socialImage={data.directSocialImage}
      youtubeVideoUrl={data.wordleData?.youtube_video_url}
    />

    {#if data.generatedArticle?.articleHtml}
      <section class="mt-12 rounded-3xl border border-slate-100 bg-white p-8 shadow-lg">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">Today's notes</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-900">
          {data.generatedArticle.title || "Today's Wordle Breakdown"}
        </h2>
        {#if data.generatedArticle.summary}
          <p class="mt-4 text-lg leading-8 text-slate-600">{data.generatedArticle.summary}</p>
        {/if}
        <div class="prose prose-lg mt-6 max-w-none">
          {@html data.generatedArticle.articleHtml}
        </div>
      </section>
    {/if}

    {#if data.recentAnswers.length > 1}
      <section class="mt-12 bg-white rounded-3xl p-8 shadow-xl border border-gray-100 overflow-hidden">
        <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span class="w-2 h-8 bg-green-500 rounded-full"></span>
          Recent Wordle Answers
        </h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Wordle #</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Answer</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each data.recentAnswers as answer}
                <tr class="transition-colors hover:bg-gray-50 {answer.date === data.wordleData?.date ? 'bg-green-50/50' : ''}">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#{answer.id}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDateForFAQ(answer.date)}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
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

    <div class="mt-16">
      <InternalLinkSection currentGame="Wordle" />
    </div>
  </div>
</main>
