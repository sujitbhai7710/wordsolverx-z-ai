<script lang="ts">
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import { formatDateForSlug } from '$lib/colordle-date';

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
  slugPrefix="colordle-answer-for-"
  formatSlug={formatDateForSlug}
  description="Every Colordle color answer. Find any past hex code solution instantly."
/>
