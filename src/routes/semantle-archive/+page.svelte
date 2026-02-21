<script lang="ts">
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import { formatSemantleDateForSlug } from '$lib/semantle';

  const startDate = new Date(2022, 0, 27); // January 27, 2022
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
  slugPrefix="semantle-answer-for-"
  formatSlug={formatSemantleDateForSlug}
  description="Every Semantle secret word answer. Find any past semantic puzzle solution instantly."
/>
