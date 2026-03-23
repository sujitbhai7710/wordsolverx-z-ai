<script lang="ts">
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import WorldleCountryCard from '$lib/components/worldle/WorldleCountryCard.svelte';

  let { data } = $props();

  const startDate = new Date(2022, 0, 21);
</script>

<svelte:head>
  <title>Worldle Archive - Complete Country Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Worldle answers. Calendar view with direct access to every past country silhouette puzzle solution." />
  <link rel="canonical" href="https://wordsolver.tech/worldle-archive" />
  <meta property="og:title" content="Worldle Archive - All Past Country Answers" />
  <meta property="og:description" content="Complete history of every Worldle country answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolver.tech/worldle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Worldle Archive",
    "description": "Complete archive of all Worldle daily country answers.",
    "url": "https://wordsolver.tech/worldle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolver.tech" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Worldle"
  gameColor="sky"
  gameIcon="WL"
  {startDate}
  basePath="/worldle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Worldle country answer. Browse the full country silhouette puzzle history."
/>

<section id="archive-answer" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedAnswer}
    <WorldleCountryCard
      answer={data.selectedAnswer}
      headline="Selected archive date"
      subheadline={`Showing the Worldle answer for ${data.formattedSelectedDate}.`}
    />
  {:else}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Choose a Worldle date above</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        The selected country answer and details will load here on the archive page.
      </p>
    </div>
  {/if}
</section>
