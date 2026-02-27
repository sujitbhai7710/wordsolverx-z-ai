<script lang="ts">
  import WordleDisplayWrapper from '$lib/components/WordleDisplayWrapper.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <link rel="canonical" href="https://wordsolverx.com/wordle-answer-yesterday" />
  <meta name="robots" content="noindex, follow" />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:image" content={data.meta.socialImage} />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  <meta name="twitter:image" content={data.meta.socialImage} />
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950 font-sans">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <WordleDisplayWrapper
      wordleData={data.wordleData}
      wordleWord={data.wordleWord}
      wordleNumber={data.wordleNumber}
      formattedDate={data.formattedDate}
      pageContext="yesterday"
      contentGuide={data.wordleData?.content_guide}
      socialImage={data.wordleData?.social_image}
      youtubeVideoUrl={data.wordleData?.youtube_video_url}
    />

    <div class="mt-16">
      <InternalLinkSection currentGame="Wordle" />
    </div>
  </div>
</main>
