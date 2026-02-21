<script lang="ts">
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import { formatGlobleDateForSlug } from '$lib/globle-date';

  const startDate = new Date(2022, 0, 1); // January 1, 2022
</script>

<svelte:head>
  <title>Globle Archive - Complete Country Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Globle country answers. Calendar view with search and direct links to every past geography puzzle solution." />
  <link rel="canonical" href="https://wordsolverx.com/globle-archive" />
  <meta property="og:title" content="Globle Archive - All Past Country Answers" />
  <meta property="og:description" content="Complete history of every Globle country answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolverx.com/globle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Globle Archive",
    "description": "Complete archive of all Globle daily country answers.",
    "url": "https://wordsolverx.com/globle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolverx.com" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Globle"
  gameColor="sky"
  gameIcon="🌍"
  {startDate}
  slugPrefix="globle-answer-for-"
  formatSlug={formatGlobleDateForSlug}
  description="Every Globle daily country answer. Find any past geography puzzle solution."
/>
