<script lang="ts">
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import WordleDisplayWrapper from '$lib/components/WordleDisplayWrapper.svelte';
  import { formatDate } from '$lib/utils';

  let { data } = $props();

  const startDate = new Date(2021, 5, 19); // June 19, 2021 - Wordle launch
</script>

<svelte:head>
  <title>Wordle Answer Archive - Complete History of All Solutions | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Wordle answers by date. Calendar view with search, daily puzzle numbers, and direct links to every past solution since June 2021." />
  <link rel="canonical" href="https://wordsolver.tech/wordle-answer-archive" />
  <meta property="og:title" content="Wordle Answer Archive - All Past Solutions" />
  <meta property="og:description" content="Complete history of every Wordle answer. Browse by calendar or search by date." />
  <meta property="og:url" content="https://wordsolver.tech/wordle-answer-archive" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Wordle Answer Archive - All Past Solutions | WordSolverX" />
  <meta name="twitter:description" content="Complete history of every Wordle answer with calendar view." />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Wordle Answer Archive",
    "description": "Complete archive of all New York Times Wordle answers and solutions from June 2021 to present.",
    "url": "https://wordsolver.tech/wordle-answer-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolver.tech" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Wordle"
  gameColor="emerald"
  gameIcon="🟩"
  {startDate}
  basePath="/wordle-answer-archive"
  selectedDate={data.selectedDateKey}
  description="Every NYT Wordle answer since the beginning. Find any past solution instantly."
/>

<section id="archive-answer" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedWordle}
    <div class="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4 text-sm font-medium text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200">
      Selected archive date: {formatDate(new Date(`${data.selectedDateKey}T00:00:00Z`))}
    </div>
    <WordleDisplayWrapper
      wordleData={data.selectedWordle}
      wordleWord={data.selectedWordle.solution}
      wordleNumber={data.selectedWordle.id}
      formattedDate={formatDate(new Date(`${data.selectedDateKey}T00:00:00Z`))}
      pageContext="archive"
      contentGuide={data.selectedWordle.content_guide}
      socialImage={data.selectedWordle.social_image}
      youtubeVideoUrl={data.selectedWordle.youtube_video_url}
    />
  {:else}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Pick a date to reveal the answer here</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        Click any archived day in the calendar or list above and the full Wordle answer block will load below this section.
      </p>
    </div>
  {/if}
</section>
