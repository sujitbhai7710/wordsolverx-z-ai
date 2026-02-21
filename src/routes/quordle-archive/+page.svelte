<script lang="ts">
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import { formatDateForSlug } from '$lib/colordle-date';

  const startDate = new Date(2022, 0, 30); // January 30, 2022
</script>

<svelte:head>
  <title>Quordle Archive - Complete Four-Word Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Quordle answers. Calendar view with search and direct links to every past four-word puzzle solution." />
  <link rel="canonical" href="https://wordsolverx.com/quordle-archive" />
  <meta property="og:title" content="Quordle Archive - All Past Four-Word Answers" />
  <meta property="og:description" content="Complete history of every Quordle answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolverx.com/quordle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Quordle Archive",
    "description": "Complete archive of all Quordle daily four-word puzzle answers.",
    "url": "https://wordsolverx.com/quordle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolverx.com" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Quordle"
  gameColor="blue"
  gameIcon="4️⃣"
  {startDate}
  slugPrefix="quordle-answer-for-"
  formatSlug={formatDateForSlug}
  description="Every Quordle four-word puzzle answer. Browse the complete daily challenge history."
/>
