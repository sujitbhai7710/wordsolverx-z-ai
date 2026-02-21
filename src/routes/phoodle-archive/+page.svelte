<script lang="ts">
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import { formatDateForSlug } from '$lib/colordle-date';

  const startDate = new Date(2022, 4, 9); // May 9, 2022

  // Phoodle uses same slug format as colordle (MMMM-dd-yyyy lowercase)
  function formatPhoodleSlug(date: Date): string {
    return formatDateForSlug(date);
  }
</script>

<svelte:head>
  <title>Phoodle Archive - Complete Food Word Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Phoodle food word answers. Calendar view with search and direct links to every past food puzzle solution." />
  <link rel="canonical" href="https://wordsolverx.com/phoodle-archive" />
  <meta property="og:title" content="Phoodle Archive - All Past Food Word Answers" />
  <meta property="og:description" content="Complete history of every Phoodle food word answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolverx.com/phoodle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Phoodle Archive",
    "description": "Complete archive of all Phoodle daily food word answers.",
    "url": "https://wordsolverx.com/phoodle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolverx.com" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Phoodle"
  gameColor="orange"
  gameIcon="🍽️"
  {startDate}
  slugPrefix="phoodle-answer-for-"
  formatSlug={formatPhoodleSlug}
  description="Every Phoodle food word answer. Browse the complete daily food puzzle history."
/>
