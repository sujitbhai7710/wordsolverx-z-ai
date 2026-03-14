<script lang="ts">
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import SemantleClues from '$lib/components/SemantleClues.svelte';

  let { data } = $props();

  const startDate = new Date(2022, 0, 29); // January 29, 2022
</script>

<svelte:head>
  <title>Semantle Archive - Complete Secret Word Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Semantle secret word answers. Calendar view with search and direct links to every past semantic puzzle solution." />
  <link rel="canonical" href="https://wordsolverx.com/semantle-archive" />
  <meta property="og:title" content="Semantle Archive - All Past Secret Word Answers" />
  <meta property="og:description" content="Complete history of every Semantle secret word. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolverx.com/semantle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Semantle Archive",
    "description": "Complete archive of all Semantle daily secret word answers.",
    "url": "https://wordsolverx.com/semantle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolverx.com" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Semantle"
  gameColor="purple"
  gameIcon="🧠"
  {startDate}
  basePath="/semantle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Semantle secret word answer. Find any past semantic puzzle solution instantly."
/>

<section id="archive-answer" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedSemantle}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-purple-600 dark:text-purple-300">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-gray-900 dark:text-white">
          Semantle answer for {data.selectedSemantle.formattedDate}
        </h2>
      </div>
      <SemantleClues word={data.selectedSemantle.word} puzzleNumber={data.selectedSemantle.puzzleNumber} />
    </div>
  {:else}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Pick a Semantle archive date above</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        The selected puzzle’s clue-and-reveal block will load here, so the archive page itself becomes the answer page.
      </p>
    </div>
  {/if}
</section>
