<script lang="ts">
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import { formatWaffleDateForSlug } from '$lib/waffle';

  const startDate = new Date(2022, 0, 1); // January 1, 2022
</script>

<svelte:head>
  <title>Waffle Archive - Complete Waffle Puzzle Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Waffle puzzle answers. Calendar view with search and direct links to every past waffle grid solution." />
  <link rel="canonical" href="https://wordsolverx.com/waffle-archive" />
  <meta property="og:title" content="Waffle Archive - All Past Waffle Answers" />
  <meta property="og:description" content="Complete history of every Waffle puzzle answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolverx.com/waffle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Waffle Archive",
    "description": "Complete archive of all Waffle daily puzzle answers.",
    "url": "https://wordsolverx.com/waffle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolverx.com" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Waffle"
  gameColor="amber"
  gameIcon="🧇"
  {startDate}
  slugPrefix="waffle-answer-for-"
  formatSlug={formatWaffleDateForSlug}
  description="Every Waffle puzzle answer. Browse the daily grid puzzle history."
/>
