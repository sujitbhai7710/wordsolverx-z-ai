<script lang="ts">
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import ColorClues from '$lib/components/ColorClues.svelte';

  let { data } = $props();

  const startDate = new Date(2023, 7, 7); // August 7, 2023
</script>

<svelte:head>
  <title>Colordle Archive - Complete Color Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Colordle color answers. Calendar view with search and direct links to every past color puzzle solution." />
  <link rel="canonical" href="https://wordsolverx.com/colordle-archive" />
  <meta property="og:title" content="Colordle Archive - All Past Color Answers" />
  <meta property="og:description" content="Complete history of every Colordle color answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolverx.com/colordle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Colordle Archive",
    "description": "Complete archive of all Colordle daily color answers.",
    "url": "https://wordsolverx.com/colordle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolverx.com" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Colordle"
  gameColor="indigo"
  gameIcon="🎨"
  {startDate}
  basePath="/colordle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Colordle color answer. Find any past hex code solution instantly."
/>

<section id="archive-answer" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedColordle}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-gray-900 dark:text-white">
          Colordle answer for {data.selectedColordle.formattedDate}
        </h2>
      </div>
      <ColorClues colorName={data.selectedColordle.color.name} colorHex={data.selectedColordle.color.hex} />
    </div>
  {:else}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Choose a color date from the archive</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        When you select a day, the Colordle answer card for that date will render below the calendar on this same page.
      </p>
    </div>
  {/if}
</section>
